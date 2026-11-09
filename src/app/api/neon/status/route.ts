import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { checkNeonHealth } from "@/lib/neon";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const health = await checkNeonHealth();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      services: {
        postgres: health.postgres,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Health check error" },
      { status: 500 }
    );
  }
}
