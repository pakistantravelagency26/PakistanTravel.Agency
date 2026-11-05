import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Super Admin portal protection (/secure-admin)
    if (path.startsWith("/secure-admin") && path !== "/secure-admin/login") {
      if (!token || token.role !== "ADMIN") {
        const loginUrl = new URL("/secure-admin/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // 2. Vendor Partner Hub protection (/partner-hub)
    if (path.startsWith("/partner-hub") && path !== "/partner-hub/login") {
      if (!token || (token.role !== "VENDOR" && token.role !== "ADMIN")) {
        const loginUrl = new URL("/partner-hub/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Legacy paths support
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/secure-admin/login", req.url));
    }
    if (path.startsWith("/vendor") && token?.role !== "VENDOR" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/partner-hub/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public paths and logins do not require token
        if (
          path === "/secure-admin/login" ||
          path === "/partner-hub/login" ||
          path.startsWith("/login") ||
          path.startsWith("/register") ||
          path.startsWith("/search") ||
          path.startsWith("/listing") ||
          path.startsWith("/api/auth") ||
          path === "/"
        ) {
          return true;
        }

        // Protected portal routes require valid session token
        if (
          path.startsWith("/secure-admin") ||
          path.startsWith("/partner-hub") ||
          path.startsWith("/account") ||
          path.startsWith("/checkout") ||
          path.startsWith("/admin") ||
          path.startsWith("/vendor")
        ) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/secure-admin/:path*",
    "/partner-hub/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/vendor/:path*",
  ],
};
