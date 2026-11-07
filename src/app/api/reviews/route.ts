import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please log in to submit a review" }, { status: 401 });
    }

    const body = await req.json();
    const { listingId, rating, comment } = body;

    if (!listingId || !rating || !comment) {
      return NextResponse.json({ error: "Listing, rating, and comment are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Verify completed booking requirement
    const completedBooking = await prisma.booking.findFirst({
      where: {
        listingId,
        userId: user.id,
        status: "COMPLETED",
      },
    });

    if (!completedBooking) {
      return NextResponse.json(
        { error: "Review submission is only allowed for travelers with a completed booking for this listing." },
        { status: 403 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        listingId,
        rating: Number(rating),
        comment,
      },
      include: {
        user: true,
      },
    });

    // Update listing avgRating and totalReviews
    const allReviews = await prisma.review.findMany({
      where: { listingId },
      select: { rating: true },
    });

    const totalReviews = allReviews.length;
    const avgRating = totalReviews > 0
      ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2))
      : 5.0;

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        avgRating,
        totalReviews,
      },
    });

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        userName: review.user.name,
        userCity: "Pakistan",
        rating: review.rating,
        date: review.createdAt.toISOString().split("T")[0],
        comment: review.comment,
      },
    });
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
