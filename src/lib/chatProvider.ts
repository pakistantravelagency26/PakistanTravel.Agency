import { siteConfig } from "@/config/site";

export interface ChatMessageItem {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface StreamChatOptions {
  messages: ChatMessageItem[];
  systemPrompt: string;
}

/**
 * Creates a graceful offline/fallback response stream when no API key is present
 * or when the LLM provider fails or times out.
 */
function createGracefulFallbackStream(userQuery: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const lower = userQuery.toLowerCase();

  let fallbackMessage = `Assalam-o-Alaikum! Welcome to ${siteConfig.name}.\n\n`;

  if (lower.includes("cancel") || lower.includes("refund")) {
    fallbackMessage += `**Cancellation & Refund Policy:**\n` +
      `• 7+ days before departure: 100% refund\n` +
      `• 3 to 6 days before departure: 50% refund\n` +
      `• Less than 72 hours: Non-refundable\n\n` +
      `For refund assistance, please email our support desk at **${siteConfig.contact.supportEmail}** or submit a request via our [Contact Form](/contact).`;
  } else if (lower.includes("payment") || lower.includes("jazzcash") || lower.includes("easypaisa") || lower.includes("card")) {
    fallbackMessage += `**Accepted Payment Methods:**\n` +
      `We support JazzCash, EasyPaisa, Direct Bank Transfer, and major Debit/Credit cards. Confirmed travel vouchers are issued immediately once your payment or deposit is confirmed.\n\n` +
      `Need help with a payment? Contact **${siteConfig.contact.supportEmail}**.`;
  } else if (lower.includes("list") || lower.includes("vendor") || lower.includes("host") || lower.includes("partner")) {
    fallbackMessage += `**List your Tour or Mountain Stay:**\n` +
      `Independent local tour operators and hotel owners across northern Pakistan can register and list packages on our platform.\n\n` +
      `Visit our [Partner Information](/partner-info) page or [Operator Registration](/vendor/register) to get started.`;
  } else if (lower.includes("hunza") || lower.includes("skardu") || lower.includes("swat") || lower.includes("kumrat") || lower.includes("neelum")) {
    fallbackMessage += `We feature travel packages and family-run hotels across Hunza, Skardu, Swat, Kumrat, and Neelum Valley from independent local hosts.\n\n` +
      `Browse our current listings on our [Search Page](/search) or [Destinations Guide](/destinations). For custom trip enquiries, feel free to use our [Contact Form](/contact).`;
  } else {
    fallbackMessage += `I am currently operating in verified information mode. You can explore tours and hotels across northern Pakistan on our [Destinations Page](/destinations).\n\n` +
      `If you have questions about bookings, payments, or itineraries, our human support team is ready to assist at **${siteConfig.contact.supportEmail}** or via our [Contact Page](/contact).`;
  }

  // Stream in small chunks to simulate streaming
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const words = fallbackMessage.split(" ");
      for (const word of words) {
        controller.enqueue(encoder.encode(word + " "));
        await new Promise((r) => setTimeout(r, 20));
      }
      controller.close();
    },
  });
}

/**
 * Calls Anthropic Messages API with streaming.
 */
async function streamAnthropic(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: ChatMessageItem[]
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  const formattedMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role,
      content: m.content,
    }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: model || "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: formattedMessages,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const dataStr = trimmed.slice(5).trim();
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (
                parsed.type === "content_block_delta" &&
                parsed.delta?.type === "text_delta" &&
                parsed.delta?.text
              ) {
                controller.enqueue(encoder.encode(parsed.delta.text));
              }
            } catch {
              // Ignore non-json or incomplete chunks
            }
          }
        }
      } catch (err) {
        console.error("[ChatProvider] Anthropic stream processing error:", err);
      } finally {
        controller.close();
      }
    },
  });
}

/**
 * Calls OpenAI-compatible API (OpenAI, Groq, DeepSeek, etc.) with streaming.
 */
async function streamOpenAICompatible(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: ChatMessageItem[],
  baseUrl: string = "https://api.openai.com/v1"
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  const payloadMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "gpt-4o-mini",
      messages: payloadMessages,
      stream: true,
      max_tokens: 1024,
    }),
  });

  if (!response.ok || !response.body) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const dataStr = trimmed.slice(5).trim();
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              const text = parsed.choices?.[0]?.delta?.content;
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch {
              // Ignore non-json or incomplete chunks
            }
          }
        }
      } catch (err) {
        console.error("[ChatProvider] OpenAI stream processing error:", err);
      } finally {
        controller.close();
      }
    },
  });
}

/**
 * Main provider entrypoint with fallback resilience.
 */
export async function streamChatCompletion({
  messages,
  systemPrompt,
}: StreamChatOptions): Promise<ReadableStream<Uint8Array>> {
  const provider = (process.env.CHAT_PROVIDER || "anthropic").toLowerCase();
  const apiKey = process.env.CHAT_API_KEY?.trim();
  const model = process.env.CHAT_MODEL?.trim() || (provider === "anthropic" ? "claude-3-5-sonnet-20241022" : "gpt-4o-mini");

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";

  // If no API key configured, use graceful grounded fallback immediately
  if (!apiKey) {
    console.warn("[ChatProvider] CHAT_API_KEY is not set in environment. Using graceful grounded fallback.");
    return createGracefulFallbackStream(lastUserMessage);
  }

  try {
    if (provider === "anthropic") {
      return await streamAnthropic(apiKey, model, systemPrompt, messages);
    } else if (provider === "openai" || provider === "groq") {
      const baseUrl = provider === "groq" ? "https://api.groq.com/openai/v1" : "https://api.openai.com/v1";
      return await streamOpenAICompatible(apiKey, model, systemPrompt, messages, baseUrl);
    } else {
      console.warn(`[ChatProvider] Unsupported provider "${provider}". Using Anthropic fallback.`);
      return await streamAnthropic(apiKey, model, systemPrompt, messages);
    }
  } catch (err) {
    console.error("[ChatProvider] Provider request failed. Falling back gracefully:", err);
    return createGracefulFallbackStream(lastUserMessage);
  }
}
