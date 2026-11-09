import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.CRON_SECRET || process.env.NEXTAUTH_SECRET;
    const session = await getServerSession(authOptions);

    const isAuthorized =
      (authHeader && secret && authHeader === `Bearer ${secret}`) ||
      session?.user?.role === "ADMIN";

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session or Bearer token required." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const targetPath = body.path;

    if (targetPath && typeof targetPath === "string") {
      revalidatePath(targetPath);
      return NextResponse.json({ success: true, revalidated: targetPath, now: Date.now() });
    }

    // Default: Purge public catalog paths
    revalidatePath("/");
    revalidatePath("/tours");
    revalidatePath("/destinations");
    revalidatePath("/faq");
    revalidatePath("/terms");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({
      success: true,
      revalidated: ["/", "/tours", "/destinations", "/faq", "/terms", "/sitemap.xml"],
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
