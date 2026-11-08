import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "pakistantravel-agency-secret-token";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isSecure = req.url.startsWith("https://") || req.headers.get("x-forwarded-proto") === "https";

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

  // 1. Super Admin Portal protection (/secure-admin)
  if (path.startsWith("/secure-admin") && path !== "/secure-admin/login") {
    if (!token || token.role !== "ADMIN") {
      const loginUrl = new URL("/secure-admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 1b. Admin API protection (/api/admin)
  if (path.startsWith("/api/admin")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }
  }

  // 2. Partner Hub Portal protection (/partner-hub)
  if (path.startsWith("/partner-hub") && path !== "/partner-hub/login") {
    if (!token || (token.role !== "VENDOR" && token.role !== "ADMIN")) {
      const loginUrl = new URL("/partner-hub/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Customer Account protection (/account)
  if (path.startsWith("/account")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const res = NextResponse.next();

  // Admin exposure & indexing prevention (Send X-Robots-Tag on private areas)
  if (
    path.startsWith("/secure-admin") ||
    path.startsWith("/partner-hub") ||
    path.startsWith("/account") ||
    path.startsWith("/api/admin")
  ) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return res;
}

export const config = {
  matcher: [
    "/secure-admin/:path*",
    "/partner-hub/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/api/admin/:path*",
  ],
};
