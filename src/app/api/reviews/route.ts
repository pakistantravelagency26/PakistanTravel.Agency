import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkServerlessRateLimit } from "@/lib/serverlessRateLimiter";
import { getTrustedClientIp } from "@/lib/clientIp";
import { maskContactLeakage, containsContactLeakage } from "@/lib/antiLeakage";
import { z } from "zod";

export const dynamic = "force-dynamic";

const reviewSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(2000, "Comment cannot exceed 2000 characters"),
}).strict();

export async function POST(req: Request) {
  try {
    const clientIp = getTrustedClientIp(req.headers);
    const rateCheck = await checkServerlessRateLimit(`review-ip:${clientIp}`, 5, 600);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: `Too many reviews submitted. Please retry after ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please log in to submit a review" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed: " + (parsed.error.errors[0]?.message || "Invalid input") },
        { status: 400 }
      );
    }

    const { listingId, rating, comment } = parsed.data;

    // Anti-leakage block: phone numbers, emails, WhatsApp links before/after booking
    if (containsContactLeakage(comment)) {
      return NextResponse.json(
        { error: "Direct contact details (phone numbers, WhatsApp, emails) are not permitted in reviews. Please remove them to submit." },
        { status: 400 }
      );
    }

    const cleanComment = maskContactLeakage(comment.trim());

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
        comment: cleanComment,
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
