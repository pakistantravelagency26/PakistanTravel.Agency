import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin portal protection
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=UnauthorizedAdmin", req.url));
    }

    // Vendor portal protection
    if (path.startsWith("/vendor") && token?.role !== "VENDOR" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=UnauthorizedVendor", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Public paths that do not require auth check
        if (
          path.startsWith("/login") ||
          path.startsWith("/register") ||
          path.startsWith("/search") ||
          path.startsWith("/listing") ||
          path === "/"
        ) {
          return true;
        }

        // Protected paths require token
        if (
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
    "/admin/:path*",
    "/vendor/:path*",
    "/account/:path*",
    "/checkout/:path*",
  ],
};
