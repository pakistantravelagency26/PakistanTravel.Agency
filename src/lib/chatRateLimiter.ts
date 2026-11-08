/**
 * In-memory sliding-window rate limiter for the AI Chatbot.
 * Default: 20 messages per 10 minutes (600,000 ms) per IP / session ID.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const DEFAULT_MAX_REQUESTS = 20;
const DEFAULT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Periodically purge stale entries older than the window.
 */
function cleanupExpired(windowMs: number) {
  const now = Date.now();
  rateLimitStore.forEach((record, key) => {
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  });
}

// Run periodic cleanup every 5 minutes if in Node runtime
if (typeof setInterval !== "undefined") {
  const interval = setInterval(() => {
    cleanupExpired(DEFAULT_WINDOW_MS);
  }, 5 * 60 * 1000);
  if (interval.unref) interval.unref();
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS
): RateLimitResult {
  const now = Date.now();
  const cleanId = (identifier || "anonymous").trim();

  let record = rateLimitStore.get(cleanId);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(cleanId, record);
  }

  // Filter out timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return {
      allowed: false,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    resetMs: windowMs,
  };
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete((identifier || "anonymous").trim());
}

export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}
