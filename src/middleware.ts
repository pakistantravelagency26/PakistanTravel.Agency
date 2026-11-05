import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || "super-secret-random-key-change-in-production";
  const token = await getToken({ req, secret });
  const path = req.nextUrl.pathname;

  // 1. Super Admin Portal protection (/secure-admin)
  if (path.startsWith("/secure-admin") && path !== "/secure-admin/login") {
    if (!token || token.role !== "ADMIN") {
      const loginUrl = new URL("/secure-admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/secure-admin/:path*",
    "/partner-hub/:path*",
    "/account/:path*",
    "/checkout/:path*",
  ],
};
