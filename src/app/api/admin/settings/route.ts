import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSiteSettings, updateSiteSetting } from "@/services/siteSettings.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getSiteSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error("Admin settings fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { key, value } = body;

    if (!key || typeof value !== "object") {
      return NextResponse.json(
        { success: false, error: "Key and value object are required." },
        { status: 400 }
      );
    }

    const updated = await updateSiteSetting(key, value);

    return NextResponse.json({
      success: true,
      key,
      value: updated,
      message: `Settings for "${key}" successfully saved to database.`,
    });
  } catch (error: any) {
    console.error("Admin settings update error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
