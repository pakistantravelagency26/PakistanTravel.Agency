import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { processPendingEmailOutbox } from "@/services/email.service";

/**
 * GET/POST /api/cron/email-outbox
 * Scheduled automated worker for outbox retry delivery
 */
async function handleOutboxCron(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const keyParam = req.nextUrl.searchParams.get("key");
  const cronSecret = process.env.CRON_SECRET;

  const isBearerMatch = Boolean(cronSecret && authHeader.replace(/^Bearer\s+/i, "").trim() === cronSecret);
  const isKeyMatch = Boolean(cronSecret && keyParam === cronSecret);

  if (!isBearerMatch && !isKeyMatch) {
    // Check if called by logged in Admin
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Invalid cron authentication token." }, { status: 401 });
    }
  }

  try {
    const result = await processPendingEmailOutbox(50);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (err: any) {
    console.error("[CRON EMAIL-OUTBOX] Execution error:", err);
    return NextResponse.json({ error: "Cron execution failed", details: err?.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleOutboxCron(req);
}

export async function POST(req: NextRequest) {
  return handleOutboxCron(req);
}
