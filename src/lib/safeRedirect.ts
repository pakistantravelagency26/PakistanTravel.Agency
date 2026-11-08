/**
 * Safe callbackUrl Sanitizer & Open Redirect Defense
 * Validates that redirect destinations are strictly same-origin relative paths.
 */

export function getSafeCallbackUrl(
  url: string | null | undefined,
  defaultUrl: string = "/"
): string {
  if (!url || typeof url !== "string") {
    return defaultUrl;
  }

  const trimmed = url.trim();

  // Reject empty, protocol-relative (//), or external schemes (http:, javascript:, data:)
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return defaultUrl;
  }

  // Reject backslashes (which some browsers normalize to forward slash) and control characters
  if (/[\\]/.test(trimmed)) {
    return defaultUrl;
  }

  // Disallow colon before any question mark or slash (prevents /https:// or /javascript:)
  const pathPart = trimmed.split("?")[0];
  if (pathPart.includes(":")) {
    return defaultUrl;
  }

  try {
    // Validate with strict URL resolution against canonical domain
    const resolved = new URL(trimmed, "https://www.pakistantravel.agency");
    if (resolved.origin !== "https://www.pakistantravel.agency") {
      return defaultUrl;
    }
    // Return sanitized path + query only
    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return defaultUrl;
  }
}
