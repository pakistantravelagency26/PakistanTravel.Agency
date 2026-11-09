import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTrustedClientIp } from "@/lib/clientIp";
import { checkServerlessRateLimit } from "@/lib/serverlessRateLimiter";
import { sanitizeUserMessage, maskSensitiveData } from "@/lib/chatSanitizer";
import { getGroundedContext } from "@/services/chatGrounding.service";
import { streamChatCompletion, type ChatMessageItem } from "@/lib/chatProvider";
import { siteConfig } from "@/config/site";
import { z } from "zod";

export const dynamic = "force-dynamic";

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    }).strict()
  ).min(1, "Messages array cannot be empty."),
  sessionId: z.string().optional(),
}).strict();

export async function POST(req: NextRequest) {
  try {
    // 1. Identify client with trusted IP proxy check and apply serverless rate limiting
    const clientIp = getTrustedClientIp(req.headers);
    const rateResult = await checkServerlessRateLimit(`chat:ip:${clientIp}`, 20, 600);
    if (!rateResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait a few minutes before sending another message or contact our team via email.",
          retryAfterSeconds: rateResult.retryAfterSeconds,
        },
        { 
          status: 429,
          headers: { "Retry-After": String(rateResult.retryAfterSeconds) }
        }
      );
    }

    // 2. Parse request body with strict Zod validation
    const body = await req.json().catch(() => ({}));
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid chat request format." }, { status: 400 });
    }

    const rawMessages = parsed.data.messages;
    const sessionId = parsed.data.sessionId;

    const lastMessage = rawMessages[rawMessages.length - 1];
    const validation = sanitizeUserMessage(lastMessage?.content);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Jailbreak / Prompt Injection immediate defense
    if (validation.isInjectionAttempt) {
      const refusalStream = new ReadableStream<Uint8Array>({
        start(controller) {
          const encoder = new TextEncoder();
          const message =
            "I cannot fulfill instructions to override my guidelines, reveal system configurations, or act outside my role as the PakistanTravel.Agency assistant. How may I help you with northern Pakistan tour packages or travel questions?";
          controller.enqueue(encoder.encode(message));
          controller.close();
        },
      });

      return new Response(refusalStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
        },
      });
    }

    // 4. Grounding retrieval
    const cleanUserQuery = validation.cleanText;
    const grounding = await getGroundedContext(cleanUserQuery);

    // Format messages for provider
    const formattedMessages: ChatMessageItem[] = rawMessages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 1000),
    }));

    // Replace the last message with sanitized clean text
    if (formattedMessages.length > 0) {
      formattedMessages[formattedMessages.length - 1].content = cleanUserQuery;
    }

    // 5. Asynchronous session logging (non-blocking)
    if (sessionId) {
      (async () => {
        try {
          const session = await prisma.chatSession.upsert({
            where: { id: sessionId },
            update: { updatedAt: new Date() },
            create: { id: sessionId, ipHash: clientIp.slice(0, 16) },
          });

          await prisma.chatMessage.create({
            data: {
              sessionId: session.id,
              role: "user",
              content: maskSensitiveData(cleanUserQuery),
            },
          });
        } catch (logErr) {
          console.error("[ChatAPI] Background logging failed:", logErr);
        }
      })();
    }

    // 6. Stream LLM completion with system prompt
    const stream = await streamChatCompletion({
      messages: formattedMessages,
      systemPrompt: grounding.systemPrompt,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err: unknown) {
    console.error("[ChatAPI] Critical handler error:", err);
    // Never throw 500 into chat UI: return a helpful graceful response
    return NextResponse.json(
      {
        message: `Our AI assistant is temporarily synchronizing with the database. Please visit our Contact page or email us directly at ${siteConfig.contact.supportEmail}.`,
      },
      { status: 200 }
    );
  }
}
