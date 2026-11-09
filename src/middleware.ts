import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.AUTH_SECRET ||
  "5de993c28db9ed08866510437fbfec2a5e9f331f113c994f8b341af47948f3e2";

export async function middleware(req: NextRequest) {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase().trim();
  const path = req.nextUrl.pathname;
  const isSecure = req.url.startsWith("https://") || req.headers.get("x-forwarded-proto") === "https";

  // 1. Canonical Domain Enforcement (301 Permanent Redirect)
  // pakistantravel.agency (apex) & every *.vercel.app host -> https://www.pakistantravel.agency
  const isVercelHost = host.endsWith(".vercel.app");
  const isApexDomain = host === "pakistantravel.agency";
  const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1");

  if ((isApexDomain || isVercelHost) && !isLocalhost) {
    const canonicalUrl = new URL(
      `${req.nextUrl.pathname}${req.nextUrl.search}`,
      "https://www.pakistantravel.agency"
    );
    return NextResponse.redirect(canonicalUrl, 301);
  }

  // 1b. 301 Permanent Redirects for Hotel & Rental URLs -> /tours
  const typeParam = req.nextUrl.searchParams.get("type")?.toUpperCase();
  const isHotelOrRentalType = typeParam === "HOTEL" || typeParam === "RENTAL";
  const isHotelsPath = path === "/hotels" || path.startsWith("/hotels/");
  const isRentalsPath = path === "/rentals" || path.startsWith("/rentals/");
  const isSearchWithHotelOrRental = path === "/search" && isHotelOrRentalType;

  if (isHotelsPath || isRentalsPath || isSearchWithHotelOrRental) {
    const toursUrl = new URL("/tours", "https://www.pakistantravel.agency");
    return NextResponse.redirect(toursUrl, 301);
  }

  // 1c. 301 Permanent Redirects for legacy Urdu routes -> English equivalent
  if (path === "/ur" || path === "/ur/") {
    const englishHome = new URL("/", "https://www.pakistantravel.agency");
    return NextResponse.redirect(englishHome, 301);
  }
  if (path.startsWith("/ur/")) {
    const cleanPath = path.replace(/^\/ur/, "") || "/";
    const englishUrl = new URL(
      `${cleanPath}${req.nextUrl.search}`,
      "https://www.pakistantravel.agency"
    );
    return NextResponse.redirect(englishUrl, 301);
  }

  // 1d. Convenient redirect for /admin -> /secure-admin
  if (path === "/admin" || path === "/admin/" || path.startsWith("/admin/")) {
    const targetPath = path.replace(/^\/admin/, "/secure-admin") || "/secure-admin";
    const targetUrl = new URL(`${targetPath}${req.nextUrl.search}`, req.url);
    return NextResponse.redirect(targetUrl, 307);
  }

  // 1d. API Security: CORS & CSRF Protection for /api/*
  if (path.startsWith("/api/")) {
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");
    const secFetchSite = req.headers.get("sec-fetch-site");
    const isProduction = process.env.NODE_ENV === "production";

    const isAllowedOrigin = (urlStr: string) => {
      if (!urlStr) return false;
      const clean = urlStr.trim().toLowerCase();
      if (clean === "https://www.pakistantravel.agency") return true;
      if (!isProduction && (clean === "http://localhost:3000" || clean === "http://127.0.0.1:3000")) return true;
      return false;
    };

    // Preflight (OPTIONS) Handling
    if (req.method === "OPTIONS") {
      if (origin) {
        if (!isAllowedOrigin(origin)) {
          return NextResponse.json(
            { error: "Forbidden: Cross-origin request not allowed." },
            { status: 403 }
          );
        }
        return new NextResponse(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, x-signature, x-webhook-signature, stripe-signature, x-webhook-timestamp",
            "Access-Control-Max-Age": "86400",
            "Vary": "Origin",
          },
        });
      }
      return new NextResponse(null, { status: 204 });
    }

    // State-changing CSRF defense (POST, PUT, PATCH, DELETE)
    const isStateChanging = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
    const isExemptWebhook = path === "/api/payments/webhook" || path.startsWith("/api/cron/");

    if (isStateChanging && !isExemptWebhook) {
      if (secFetchSite === "cross-site") {
        return NextResponse.json(
          { error: "Forbidden: Cross-site request blocked by CSRF policy." },
          { status: 403 }
        );
      }

      if (origin && !isAllowedOrigin(origin)) {
        return NextResponse.json(
          { error: "Forbidden: Cross-origin state-changing request blocked." },
          { status: 403 }
        );
      }

      if (!origin && referer) {
        try {
          const refOrigin = new URL(referer).origin;
          if (!isAllowedOrigin(refOrigin)) {
            return NextResponse.json(
              { error: "Forbidden: Cross-origin referer blocked by CSRF policy." },
              { status: 403 }
            );
          }
        } catch {
          return NextResponse.json(
            { error: "Forbidden: Malformed referer header." },
            { status: 403 }
          );
        }
      }
    }
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

  // 1e. Auto-forward authenticated Admin away from login pages straight to dashboard
  if ((path === "/secure-admin/login" || path === "/login") && token?.role === "ADMIN") {
    const dashUrl = new URL("/secure-admin/dashboard", req.url);
    return NextResponse.redirect(dashUrl);
  }

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
