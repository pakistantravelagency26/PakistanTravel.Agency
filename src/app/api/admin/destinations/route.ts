import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const destinations = await prisma.destination.findMany({
      include: {
        _count: {
          select: { listings: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      destinations: destinations.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        province: d.province,
        description: d.description || "",
        image: d.image,
        isFeatured: d.isFeatured,
        listingsCount: d._count.listings,
      })),
    });
  } catch (error: any) {
    console.error("Fetch destinations error:", error);
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
    const { name, slug, province, description, image, isFeatured } = body;

    if (!name || !province) {
      return NextResponse.json(
        { success: false, error: "Name and Province are required" },
        { status: 400 }
      );
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existing = await prisma.destination.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `A destination with slug '${generatedSlug}' already exists.` },
        { status: 400 }
      );
    }

    const created = await prisma.destination.create({
      data: {
        name: name.trim(),
        slug: generatedSlug,
        province: province.trim(),
        description: description ? description.trim() : null,
        image:
          image && image.trim().length > 0
            ? image.trim()
            : "https://images.unsplash.com/photo-1588661793444-c71597813a83?w=800&auto=format&fit=crop&q=80",
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({ success: true, destination: created });
  } catch (error: any) {
    console.error("Create destination error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
