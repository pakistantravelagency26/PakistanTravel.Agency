import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkNeonHealth, sealRealtimeQuery, neonConfig } from "@/lib/neon";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
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
