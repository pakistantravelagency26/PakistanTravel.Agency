import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/chatRateLimiter";
import { sanitizeUserMessage, maskSensitiveData } from "@/lib/chatSanitizer";
import { getGroundedContext } from "@/services/chatGrounding.service";
import { streamChatCompletion, type ChatMessageItem } from "@/lib/chatProvider";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Identify client for rate limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateResult = checkRateLimit(ip, 20, 10 * 60 * 1000);
    if (!rateResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait a few minutes before sending another message or contact our team via email.",
          resetMs: rateResult.resetMs,
        },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await req.json().catch(() => ({}));
    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId : undefined;

    if (rawMessages.length === 0) {
      return NextResponse.json({ error: "Messages array cannot be empty." }, { status: 400 });
    }

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
            create: { id: sessionId, ipHash: ip.slice(0, 16) },
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
