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

    const rawUrl = neonConfig.databaseUrl || "NOT_SET";
    const maskedUrl = rawUrl === "NOT_SET" ? "NOT_SET" : rawUrl.replace(/:[^:@]+@/, ":***@");
    const health = await checkNeonHealth();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      databaseUrlMasked: maskedUrl,
      services: health,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const sampleQuery = body.query || "SELECT count(*) FROM \"Listing\" WHERE \"status\" = 'PUBLISHED'";
    
    const sealed = await sealRealtimeQuery({
      query: sampleQuery,
      params: body.params || [],
    });

    return NextResponse.json({
      success: true,
      sealed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
