import { NextResponse } from "next/server";
import { checkNeonHealth, sealRealtimeQuery } from "@/lib/neon";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const health = await checkNeonHealth();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
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
