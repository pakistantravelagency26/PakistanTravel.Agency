import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "pakistantravel-agency-secret-token";

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

  // Check token with appropriate cookie security flag, and fallback to alternate if needed
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

  // 2. Super Admin Portal protection (/secure-admin)
  if (path.startsWith("/secure-admin") && path !== "/secure-admin/login") {
    if (!token || token.role !== "ADMIN") {
      const loginUrl = new URL("/secure-admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2b. Admin API protection (/api/admin)
  if (path.startsWith("/api/admin")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }
  }

  // 3. Partner Hub Portal protection (/partner-hub)
  if (path.startsWith("/partner-hub") && path !== "/partner-hub/login") {
    if (!token || (token.role !== "VENDOR" && token.role !== "ADMIN")) {
      const loginUrl = new URL("/partner-hub/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
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

  // 5. SEO Protection for Non-Canonical Hosts (e.g. Vercel Preview Deployments)
  // Keep previews accessible for testing, but prevent duplicate indexing in search engines
  if (!isLocalhost && host !== "www.pakistantravel.agency") {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  // 6. Private Portal Indexing Prevention
  if (
    path.startsWith("/secure-admin") ||
    path.startsWith("/partner-hub") ||
    path.startsWith("/account") ||
    path.startsWith("/api/")
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
