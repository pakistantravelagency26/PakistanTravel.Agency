/**
 * Serverless-Safe Rate Limiter for PakistanTravel.Agency
 * 
 * Supports Upstash Redis REST API (zero persistent TCP connections, HTTP-based, serverless safe)
 * with transparent fallback to in-memory sliding window when Upstash credentials are not set.
 */

import { getTrustedClientIp, type HeaderSource } from "./clientIp.ts";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes in long-running processes
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    memoryStore.forEach((record, key) => {
      if (now > record.resetAt) {
        memoryStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
  if (timer.unref) {
    timer.unref();
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

/**
 * Executes a sliding-window rate limit check.
 * 
 * @param key Unique identifier (e.g. `login:192.168.1.1` or `register:user@example.com`)
 * @param maxRequests Maximum allowed requests within the window
 * @param windowSeconds Window duration in seconds (e.g. 60 for 1 minute, 600 for 10 minutes)
 */
export async function checkServerlessRateLimit(
  key: string,
  maxRequests: number = 10,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. If Upstash Redis credentials are provided, use Upstash HTTP REST API (Atomic & Distributed)
  if (upstashUrl && upstashToken) {
    try {
      const redisKey = `ratelimit:pta:${key}`;
      const nowSeconds = Math.floor(Date.now() / 1000);
      const windowStart = nowSeconds - windowSeconds;

      // Pipeline: 
      // 1. ZREMRANGEBYSCORE key 0 windowStart (prune old hits)
      // 2. ZADD key nowSeconds requestId
      // 3. ZCARD key (count current hits)
      // 4. EXPIRE key windowSeconds
      const member = `${nowSeconds}-${Math.random().toString(36).substring(2, 8)}`;
      const pipelineCommands = [
        ["ZREMRANGEBYSCORE", redisKey, "0", String(windowStart)],
        ["ZADD", redisKey, String(nowSeconds), member],
        ["ZCARD", redisKey],
        ["EXPIRE", redisKey, String(windowSeconds)],
      ];

      const res = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pipelineCommands),
      });

      if (res.ok) {
        const results = await res.json();
        const currentCount = Number(results[2]?.result || 1);
        const resetAt = (nowSeconds + windowSeconds) * 1000;

        if (currentCount > maxRequests) {
          return {
            success: false,
            remaining: 0,
            resetAt,
            retryAfterSeconds: windowSeconds,
          };
        }

        return {
          success: true,
          remaining: Math.max(0, maxRequests - currentCount),
          resetAt,
          retryAfterSeconds: 0,
        };
      }
    } catch (upstashErr) {
      console.warn("[RateLimiter] Upstash REST error, falling back to memory store:", upstashErr);
    }
  }

  // 2. Fallback to in-memory sliding window
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = memoryStore.get(key);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    memoryStore.set(key, newRecord);
    return {
      success: true,
      remaining: Math.max(0, maxRequests - 1),
      resetAt: newRecord.resetAt,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
      retryAfterSeconds: retryAfter,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: Math.max(0, maxRequests - record.count),
    resetAt: record.resetAt,
    retryAfterSeconds: 0,
  };
}

/**
 * Resolves trusted client IP and builds a rate limit key.
 */
export function buildRateLimitKey(prefix: string, headers: HeaderSource, identifier?: string): string {
  const clientIp = getTrustedClientIp(headers);
  if (identifier) {
    return `${prefix}:${identifier.toLowerCase().trim()}:${clientIp}`;
  }
  return `${prefix}:${clientIp}`;
}
