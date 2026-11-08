/**
 * Input validation, sanitization, and PII masking for AI Chatbot.
 */

export const MAX_USER_MESSAGE_LENGTH = 500;

// Credit card regex (Visa, Mastercard, Amex, Discover, etc., with optional dashes or spaces)
const CREDIT_CARD_REGEX = /\b(?:\d{4}[ -]?){3}\d{4}\b|\b\d{15,16}\b/g;

// Password / secret patterns
const SENSITIVE_KEYWORD_REGEX = /(?:password|passwd|secret|api[_-]?key|pin)[\s:=]+([^\s,;]+)/gi;

// Common prompt injection / jailbreak triggers
const JAILBREAK_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /you\s+are\s+now\s+(DAN|an?\s+unrestricted|evil|jailbroken)/i,
  /system\s+prompt\s+(reveal|leak|show|override|overwrite)/i,
  /bypass\s+(all\s+)?(safety|security|rules|filters)/i,
  /output\s+the\s+(entire\s+)?system\s+prompt/i,
  /what\s+are\s+your\s+hidden\s+instructions/i,
  /pretend\s+you\s+have\s+no\s+(rules|limits|morals)/i,
];

/**
 * Masks credit cards and passwords from text before logging or storing.
 */
export function maskSensitiveData(text: string): string {
  if (!text) return "";
  let masked = text.replace(CREDIT_CARD_REGEX, "[CARD NUMBER MASKED]");
  masked = masked.replace(SENSITIVE_KEYWORD_REGEX, (_match, _val) => {
    return "[CREDENTIAL MASKED]";
  });
  return masked;
}

/**
 * Checks if the message contains obvious prompt-injection / role-override attempts.
 */
export function detectPromptInjection(text: string): boolean {
  if (!text) return false;
  return JAILBREAK_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Validates and cleans user chat input.
 */
export function sanitizeUserMessage(raw: unknown): {
  valid: boolean;
  cleanText: string;
  error?: string;
  isInjectionAttempt?: boolean;
} {
  if (typeof raw !== "string") {
    return { valid: false, cleanText: "", error: "Message must be a text string." };
  }

  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { valid: false, cleanText: "", error: "Message cannot be empty." };
  }

  if (trimmed.length > MAX_USER_MESSAGE_LENGTH) {
    return {
      valid: false,
      cleanText: trimmed.slice(0, MAX_USER_MESSAGE_LENGTH),
      error: `Message exceeds the limit of ${MAX_USER_MESSAGE_LENGTH} characters.`,
    };
  }

  const isInjection = detectPromptInjection(trimmed);

  return {
    valid: true,
    cleanText: trimmed,
    isInjectionAttempt: isInjection,
  };
}
