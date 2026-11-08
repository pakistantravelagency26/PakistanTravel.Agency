import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET || "super-secret-random-key-change-in-production";

export async function middleware(req: NextRequest) {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase().trim();
  const path = req.nextUrl.pathname;
  const isSecure = req.url.startsWith("https://") || req.headers.get("x-forwarded-proto") === "https";

  // 1. Canonical Domain Enforcement (301 Permanent Redirect)
  // pakistantravel.agency (apex) & production *.vercel.app hosts -> https://www.pakistantravel.agency
  const isProductionVercelHost =
    host === "pakistantravel-agency.vercel.app" ||
    host === "pakistan-travel-agency.vercel.app";
  const isApexDomain = host === "pakistantravel.agency";
  const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1");

  if ((isApexDomain || isProductionVercelHost) && !isLocalhost) {
    const canonicalUrl = new URL(
      `${req.nextUrl.pathname}${req.nextUrl.search}`,
      "https://www.pakistantravel.agency"
    );
    return NextResponse.redirect(canonicalUrl, 301);
  }

  // Check token across all possible cookie variations and secure flags
  let token = await getToken({
    req,
    secret: AUTH_SECRET,
    secureCookie: isSecure,
  });

  if (!token) {
    token = await getToken({
      req,
      secret: AUTH_SECRET,
      secureCookie: !isSecure,
    });
  }

  if (!token) {
    token = await getToken({
      req,
      secret: AUTH_SECRET,
      cookieName: "__Secure-next-auth.session-token",
    });
  }

  if (!token) {
    token = await getToken({
      req,
      secret: AUTH_SECRET,
      cookieName: "next-auth.session-token",
    });
  }

  const hasQueryParams = req.nextUrl.search.length > 0;
  const snooze2fa =
    req.cookies.get("snooze_2fa")?.value === "1" ||
    req.nextUrl.searchParams.get("snooze_2fa") === "1";

  // 2. Super Admin Portal protection (/secure-admin)
  if (path.startsWith("/secure-admin") && path !== "/secure-admin/login") {
    if (!token) {
      const loginUrl = new URL("/secure-admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (token.role !== "ADMIN") {
      return new NextResponse("Forbidden: Access restricted to platform administrators.", { status: 403 });
    }
    // Mandatory 2FA Enforcement for Admin (supports 24h snooze reminder)
    if (!token.twoFactorEnabled && path !== "/secure-admin/setup-2fa" && !snooze2fa) {
      const setup2faUrl = new URL("/secure-admin/setup-2fa", req.url);
      return NextResponse.redirect(setup2faUrl);
    }
  }

  // 2b. Admin API protection (/api/admin)
  if (path.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized access: Session required." }, { status: 401 });
    }
    if (token.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden: Admin role required." }, { status: 403 });
    }
  }

  // 3. Partner Hub Portal protection (/partner-hub)
  if (path.startsWith("/partner-hub") && path !== "/partner-hub/login") {
    if (!token || (token.role !== "VENDOR" && token.role !== "ADMIN")) {
      const loginUrl = new URL("/partner-hub/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Mandatory 2FA Enforcement for Vendor / Partner (supports 24h snooze reminder)
    if (token.role === "VENDOR" && !token.twoFactorEnabled && path !== "/partner-hub/setup-2fa" && !snooze2fa) {
      const setup2faUrl = new URL("/partner-hub/setup-2fa", req.url);
      return NextResponse.redirect(setup2faUrl);
    }
    if (token.role === "ADMIN" && !token.twoFactorEnabled && path !== "/secure-admin/setup-2fa" && !snooze2fa) {
      const setup2faUrl = new URL("/secure-admin/setup-2fa", req.url);
      return NextResponse.redirect(setup2faUrl);
    }
  }

  // 4. Customer Account protection (/account)
  if (path.startsWith("/account")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const res = NextResponse.next();

  if (req.nextUrl.searchParams.get("snooze_2fa") === "1") {
    res.cookies.set("snooze_2fa", "1", { path: "/", maxAge: 86400, sameSite: "lax" });
  }

  // 5. SEO Protection for Non-Canonical Hosts (e.g. Vercel Preview Deployments)
  // Keep previews accessible for testing, but prevent duplicate indexing in search engines
  if (!isLocalhost && host !== "www.pakistantravel.agency") {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  // 6. Private Portal & Query Parameter Indexing Prevention (SEO Protection)
  const hasQueryParams = req.nextUrl.search.length > 0;
  if (
    path.startsWith("/secure-admin") ||
    path.startsWith("/partner-hub") ||
    path.startsWith("/account") ||
    path.startsWith("/dashboard") ||
    path === "/login" ||
    path === "/register" ||
    path.startsWith("/forgot-password") ||
    path === "/search" ||
    path.startsWith("/search/") ||
    path.startsWith("/api/") ||
    hasQueryParams
  ) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static build assets)
     * - _next/image (image optimization files)
     * - Static asset files (favicon.ico, favicon.png, icon-192.png, robots.txt, sitemap.xml)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|icon-192\\.png|robots\\.txt|sitemap\\.xml).*)",
  ],
};
