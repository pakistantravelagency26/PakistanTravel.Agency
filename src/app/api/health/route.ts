import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const uptimeSeconds =
    typeof process !== "undefined" && typeof process.uptime === "function"
      ? Math.floor(process.uptime())
      : 0;

  return NextResponse.json(
    {
      status: "healthy",
      version: "2026.11.08-v3",
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "5777a16",
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      environment: process.env.NODE_ENV || "production",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    }
  );
}
