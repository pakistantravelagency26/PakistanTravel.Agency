import { NextResponse } from "next/server";
import { getSiteSettings } from "@/services/siteSettings.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    const settings = await getSiteSettings(key as any);
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
