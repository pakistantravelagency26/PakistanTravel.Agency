import { prisma } from "@/lib/prisma";
import { generateBookingConfirmationHtml } from "@/lib/notifications";
import { calculateBookingPricing } from "@/lib/bookingPricing";
import { resolveBookingVendorContact } from "@/lib/antiLeakage";
import { COMMISSION_PERCENT } from "@/config/site";
import { sendBookingConfirmationEmails, sendBookingCancellationEmails } from "./email.service";
import crypto from "crypto";

export interface BookingRecord {
  id: string;
  bookingNumber: string;
  listingId: string;
  listingTitle: string;
  listingPhoto: string;
  unitTitle: string;
  destination: string;
  departureId?: string;
  startDate: string;
  endDate: string;
  nightsCount: number;
  guestsCount: number;
  unitsCount: number;
  totalAmount: number;
  depositAmount: number;
  balanceDue: number;
  isSoloTraveler?: boolean;
  singleSupplement?: number;
  paymentMethod: "STRIPE" | "JAZZCASH" | "EASYPAISA" | "CASH_ON_ARRIVAL";
  paymentStatus: "PAID" | "PENDING";
  status: "CONFIRMED" | "CANCELLED_BY_CUSTOMER" | "PENDING_PAYMENT" | "COMPLETED";
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  cnicOrPassport: string;
  specialRequests?: string;
  createdAt: string;
  vendor?: {
    id: string;
    businessName: string;
    city: string;
    phone?: string;
    whatsapp?: string;
  };
}

export function generateBookingNumber(): string {
  const token = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `PKT-2026-${token}`;
}

export async function createBooking(data: {
  listingId: string;
  listingTitle: string;
  listingPhoto?: string;
  unitTitle?: string;
  destination: string;
  departureId?: string;
  startDate: string;
  endDate: string;
  nightsCount: number;
  guestsCount: number;
  unitsCount: number;
  totalAmount: number;
  depositAmount?: number;
  balanceDue?: number;
  isSoloTraveler?: boolean;
  singleSupplement?: number;
  paymentMethod: "STRIPE" | "JAZZCASH" | "EASYPAISA" | "CASH_ON_ARRIVAL";
  paymentChoice?: "FULL" | "DEPOSIT" | "ON_ARRIVAL";
  paymentStatus: "PAID" | "PENDING";
  status: "CONFIRMED" | "CANCELLED_BY_CUSTOMER" | "PENDING_PAYMENT";
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  cnicOrPassport: string;
  specialRequests?: string;
}): Promise<BookingRecord> {
  const bookingNumber = generateBookingNumber();

  // Execute inside an ACID database transaction to strictly prevent overbooking and price tampering
  const result = await prisma.$transaction(async (tx) => {
    // 1. Fetch official listing data to guarantee server-side pricing integrity
    const listing = await tx.listing.findUnique({
      where: { id: data.listingId },
      include: { units: true },
    });

    if (!listing) {
      throw new Error("The selected listing or tour could not be found.");
    }

    let departure = null;
    if (data.departureId) {
      // 2. Concurrency Control: Atomic compare-and-swap on available seats
      const updatedDeparture = await tx.departure.updateMany({
        where: {
          id: data.departureId,
          seatsLeft: { gte: data.guestsCount },
        },
        data: {
          seatsLeft: { decrement: data.guestsCount },
        },
      });

      if (updatedDeparture.count === 0) {
        throw new Error("Overbooking prevented: No seats remaining for this departure date.");
      }

      departure = await tx.departure.findUnique({
        where: { id: data.departureId },
      });
    }

    // 3. Server-side price calculation (never trust client amounts)
    const isTour = listing.type === "TOUR";
    const serverBasePrice = Number(departure?.price || listing.basePrice);
    const pricing = calculateBookingPricing({
      basePrice: serverBasePrice,
      quantity: isTour ? data.guestsCount : (data.unitsCount || 1),
      isTour,
      nightsCount: Math.max(1, data.nightsCount),
      isSoloTraveler: Boolean(data.isSoloTraveler),
      singleSupplementAmount: listing.singleSupplement ? Number(listing.singleSupplement) : undefined,
      depositPercent: listing.depositPercent ? Number(listing.depositPercent) : 25,
      taxRate: 0.05,
    });

    const isCashOnArrival = data.paymentMethod === "CASH_ON_ARRIVAL" || data.paymentChoice === "ON_ARRIVAL";
    let finalDepositAmount = pricing.totalAmount;
    let finalBalanceDue = 0;

    if (isCashOnArrival) {
      finalDepositAmount = 0;
      finalBalanceDue = pricing.totalAmount;
    } else if (data.paymentChoice === "DEPOSIT") {
      finalDepositAmount = pricing.depositAmount;
      finalBalanceDue = pricing.balanceDue;
    }

    const calculatedTotalAmount = pricing.totalAmount;

    // 4. Find or create traveler customer user
    let user = await tx.user.findFirst({
      where: {
        OR: [{ email: data.guestEmail }, { phone: data.guestPhone }],
      },
    });

    if (!user) {
      user = await tx.user.create({
        data: {
          name: data.guestName,
          email: data.guestEmail,
          phone: data.guestPhone,
          role: "CUSTOMER",
        },
      });
    }

    const unitId = listing.units[0]?.id || data.listingId;
    const commissionRate = listing.commissionRate || COMMISSION_PERCENT;
    const platformFee = Math.round((calculatedTotalAmount * commissionRate) / 100);
    const vendorEarnings = calculatedTotalAmount - platformFee;

    // 5. Create Booking with strictly server-verified amounts
    const booking = await tx.booking.create({
      data: {
        bookingNumber,
        userId: user.id,
        listingId: data.listingId,
        unitId,
        departureId: data.departureId || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        guestsCount: data.guestsCount,
        unitsCount: data.unitsCount,
        totalAmount: calculatedTotalAmount,
        depositAmount: finalDepositAmount,
        balanceDue: finalBalanceDue,
        vendorEarnings,
        platformFee,
        isSoloTraveler: Boolean(data.isSoloTraveler),
        singleSupplement: pricing.singleSupplement,
        status: data.status === "CONFIRMED" ? "CONFIRMED" : "PENDING_PAYMENT",
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        specialRequests: data.specialRequests || (data.cnicOrPassport ? `ID: ${data.cnicOrPassport.length > 4 ? data.cnicOrPassport.slice(0, 2) + "******" + data.cnicOrPassport.slice(-2) : "Verified"}` : null),
      },
    });

    // 5. Create Payment record
    await tx.payment.create({
      data: {
        bookingId: booking.id,
        amount: finalDepositAmount > 0 ? finalDepositAmount : calculatedTotalAmount,
        currency: "PKR",
        paymentMethod: data.paymentMethod,
        status: data.paymentStatus === "PAID" ? "PAID" : "PENDING",
        transactionRef: `TXN-${bookingNumber}`,
        paidAt: data.paymentStatus === "PAID" ? new Date() : null,
      },
    });

    return booking;
  });

  const record: BookingRecord = {
    id: result.id,
    bookingNumber: result.bookingNumber,
    listingId: data.listingId,
    listingTitle: data.listingTitle,
    listingPhoto: data.listingPhoto || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    unitTitle: data.unitTitle || "Standard Tour Seat",
    destination: data.destination,
    departureId: data.departureId,
    startDate: data.startDate,
    endDate: data.endDate,
    nightsCount: data.nightsCount,
    guestsCount: data.guestsCount,
    unitsCount: data.unitsCount,
    totalAmount: Number(result.totalAmount),
    depositAmount: Number(result.depositAmount || 0),
    balanceDue: Number(result.balanceDue || 0),
    isSoloTraveler: data.isSoloTraveler,
    singleSupplement: data.singleSupplement,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus,
    status: data.status,
    guestName: data.guestName,
    guestEmail: data.guestEmail,
    guestPhone: data.guestPhone,
    cnicOrPassport: data.cnicOrPassport,
    specialRequests: data.specialRequests,
    createdAt: result.createdAt.toISOString(),
  };

  // Asynchronously dispatch transactional outbox emails to Customer, Vendor, and Admin
  sendBookingConfirmationEmails(result.id).catch((err) => {
    console.error("[EMAIL OUTBOX] Error dispatching booking confirmation emails:", err);
  });

  return record;
}

export async function getBookingById(idOrNumber: string): Promise<BookingRecord | null> {
  try {
    const dbBooking = await prisma.booking.findFirst({
      where: {
        OR: [{ id: idOrNumber }, { bookingNumber: idOrNumber }],
      },
      include: {
        listing: {
          include: { destination: true, vendor: true },
        },
        unit: true,
        departure: true,
        payment: true,
        user: true,
      },
    });

    if (!dbBooking) return null;

    const nightsCount = Math.max(
      1,
      Math.round(
        (new Date(dbBooking.endDate).getTime() - new Date(dbBooking.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    const isConfirmedBooking =
      dbBooking.status === "CONFIRMED" ||
      dbBooking.status === "COMPLETED" ||
      dbBooking.payment?.status === "PAID";
    const rawVendor = dbBooking.listing?.vendor;
    const vendorData = resolveBookingVendorContact(rawVendor, isConfirmedBooking);

    return {
      id: dbBooking.id,
      bookingNumber: dbBooking.bookingNumber,
      listingId: dbBooking.listingId,
      listingTitle: dbBooking.listing?.title || "Tour / Hotel Booking",
      listingPhoto: dbBooking.listing?.photos?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      unitTitle: dbBooking.unit?.title || "Package Booking",
      destination: `${dbBooking.listing?.city || "Pakistan"}, ${dbBooking.listing?.destination?.province || "Northern Areas"}`,
      departureId: dbBooking.departureId || undefined,
      startDate: dbBooking.startDate.toISOString().split("T")[0],
      endDate: dbBooking.endDate.toISOString().split("T")[0],
      nightsCount,
      guestsCount: dbBooking.guestsCount,
      unitsCount: dbBooking.unitsCount,
      totalAmount: Number(dbBooking.totalAmount),
      depositAmount: Number(dbBooking.depositAmount || 0),
      balanceDue: Number(dbBooking.balanceDue || 0),
      isSoloTraveler: dbBooking.isSoloTraveler,
      singleSupplement: Number(dbBooking.singleSupplement || 0),
      paymentMethod: (dbBooking.payment?.paymentMethod as any) || "CASH_ON_ARRIVAL",
      paymentStatus: dbBooking.payment?.status === "PAID" ? "PAID" : "PENDING",
      status: dbBooking.status === "CONFIRMED" ? "CONFIRMED" : dbBooking.status === "COMPLETED" ? "COMPLETED" : "PENDING_PAYMENT",
      guestName: dbBooking.guestName,
      guestEmail: dbBooking.guestEmail,
      guestPhone: dbBooking.guestPhone,
      cnicOrPassport: dbBooking.specialRequests?.includes("CNIC:") ? dbBooking.specialRequests.replace("CNIC:", "").trim() : "Verified",
      specialRequests: dbBooking.specialRequests || undefined,
      createdAt: dbBooking.createdAt.toISOString(),
      vendor: vendorData,
    };
  } catch (error) {
    console.error("Error fetching booking by id:", error);
    return null;
  }
}

export async function getAllBookings(): Promise<BookingRecord[]> {
  try {
    const dbBookings = await prisma.booking.findMany({
      include: {
        listing: { include: { destination: true } },
        unit: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return dbBookings.map((b) => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      listingId: b.listingId,
      listingTitle: b.listing?.title || "Northern Pakistan Trip",
      listingPhoto: b.listing?.photos?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      unitTitle: b.unit?.title || "Tour Package",
      destination: `${b.listing?.city || "Pakistan"}`,
      startDate: b.startDate.toISOString().split("T")[0],
      endDate: b.endDate.toISOString().split("T")[0],
      nightsCount: 3,
      guestsCount: b.guestsCount,
      unitsCount: b.unitsCount,
      totalAmount: Number(b.totalAmount),
      depositAmount: Number(b.depositAmount || 0),
      balanceDue: Number(b.balanceDue || 0),
      paymentMethod: (b.payment?.paymentMethod as any) || "CASH_ON_ARRIVAL",
      paymentStatus: b.payment?.status === "PAID" ? "PAID" : "PENDING",
      status: b.status === "CONFIRMED" ? "CONFIRMED" : b.status === "COMPLETED" ? "COMPLETED" : "PENDING_PAYMENT",
      guestName: b.guestName,
      guestEmail: b.guestEmail,
      guestPhone: b.guestPhone,
      cnicOrPassport: "Verified",
      createdAt: b.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    return [];
  }
}

export async function getBookingsByEmail(email: string): Promise<BookingRecord[]> {
  try {
    const dbBookings = await prisma.booking.findMany({
      where: {
        guestEmail: { equals: email, mode: "insensitive" },
      },
      include: {
        listing: { include: { destination: true } },
        unit: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return dbBookings.map((b) => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      listingId: b.listingId,
      listingTitle: b.listing?.title || "Northern Pakistan Trip",
      listingPhoto: b.listing?.photos?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      unitTitle: b.unit?.title || "Tour Package",
      destination: `${b.listing?.city || "Pakistan"}`,
      startDate: b.startDate.toISOString().split("T")[0],
      endDate: b.endDate.toISOString().split("T")[0],
      nightsCount: 3,
      guestsCount: b.guestsCount,
      unitsCount: b.unitsCount,
      totalAmount: Number(b.totalAmount),
      depositAmount: Number(b.depositAmount || 0),
      balanceDue: Number(b.balanceDue || 0),
      paymentMethod: (b.payment?.paymentMethod as any) || "CASH_ON_ARRIVAL",
      paymentStatus: b.payment?.status === "PAID" ? "PAID" : "PENDING",
      status: b.status === "CONFIRMED" ? "CONFIRMED" : b.status === "COMPLETED" ? "COMPLETED" : "PENDING_PAYMENT",
      guestName: b.guestName,
      guestEmail: b.guestEmail,
      guestPhone: b.guestPhone,
      cnicOrPassport: "Verified",
      createdAt: b.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching bookings by email:", error);
    return [];
  }
}

export async function getBookingsByVendorId(vendorId: string): Promise<BookingRecord[]> {
  try {
    const dbBookings = await prisma.booking.findMany({
      where: {
        listing: { vendorId },
      },
      include: {
        listing: { include: { destination: true } },
        unit: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return dbBookings.map((b) => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      listingId: b.listingId,
      listingTitle: b.listing?.title || "Northern Pakistan Trip",
      listingPhoto: b.listing?.photos?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      unitTitle: b.unit?.title || "Tour Package",
      destination: `${b.listing?.city || "Pakistan"}`,
      startDate: b.startDate.toISOString().split("T")[0],
      endDate: b.endDate.toISOString().split("T")[0],
      nightsCount: 3,
      guestsCount: b.guestsCount,
      unitsCount: b.unitsCount,
      totalAmount: Number(b.totalAmount),
      depositAmount: Number(b.depositAmount || 0),
      balanceDue: Number(b.balanceDue || 0),
      paymentMethod: (b.payment?.paymentMethod as any) || "CASH_ON_ARRIVAL",
      paymentStatus: b.payment?.status === "PAID" ? "PAID" : "PENDING",
      status: b.status === "CONFIRMED" ? "CONFIRMED" : b.status === "COMPLETED" ? "COMPLETED" : "PENDING_PAYMENT",
      guestName: b.guestName,
      guestEmail: b.guestEmail,
      guestPhone: b.guestPhone,
      cnicOrPassport: "Verified",
      createdAt: b.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching bookings by vendorId:", error);
    return [];
  }
}

export async function cancelBooking(id: string): Promise<boolean> {
  try {
    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findFirst({
        where: { OR: [{ id }, { bookingNumber: id }] },
      });

      if (!booking) return;

      // If tied to a departure, replenish seats atomically
      if (booking.departureId) {
        await tx.departure.update({
          where: { id: booking.departureId },
          data: {
            seatsLeft: { increment: booking.guestsCount },
            status: "AVAILABLE",
          },
        });
      }

      await tx.booking.update({
        where: { id: booking.id },
        data: { status: "CANCELLED_BY_CUSTOMER" },
      });
    });

    sendBookingCancellationEmails(id).catch((err) => {
      console.error("[EMAIL OUTBOX] Error dispatching cancellation emails:", err);
    });

    return true;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return false;
  }
}

/**
 * Idempotent Payment Webhook Handler
 */
export async function handlePaymentWebhookIdempotent(payload: {
  transactionRef: string;
  amount: number;
  paymentMethod: "STRIPE" | "JAZZCASH" | "EASYPAISA";
  rawResponse?: any;
}): Promise<{ success: boolean; message: string; bookingId?: string }> {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Find existing payment by transactionRef
    const existingPayment = await tx.payment.findUnique({
      where: { transactionRef: payload.transactionRef },
      include: { booking: true },
    });

    if (existingPayment) {
      // Idempotency: If already marked PAID, return success without duplicate side-effects
      if (existingPayment.status === "PAID") {
        return {
          success: true,
          message: "Payment already processed previously (Idempotent replay).",
          bookingId: existingPayment.bookingId,
          newlyPaid: false,
        };
      }

      // Verify that paid amount is at least the required amount
      const expectedAmount = Number(existingPayment.amount);
      if (payload.amount < expectedAmount) {
        return {
          success: false,
          message: `Underpayment: expected ${expectedAmount} PKR but received ${payload.amount} PKR.`,
          newlyPaid: false,
        };
      }

      // Mark paid
      await tx.payment.update({
        where: { id: existingPayment.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
          rawResponse: payload.rawResponse || null,
        },
      });

      await tx.booking.update({
        where: { id: existingPayment.bookingId },
        data: { status: "CONFIRMED" },
      });

      return {
        success: true,
        message: "Payment marked PAID successfully.",
        bookingId: existingPayment.bookingId,
        newlyPaid: true,
      };
    }

    return { success: false, message: "Transaction reference not found.", newlyPaid: false };
  });

  if (result.success && result.newlyPaid && result.bookingId) {
    sendBookingConfirmationEmails(result.bookingId).catch((err) => {
      console.error("[EMAIL OUTBOX] Error dispatching payment confirmation emails:", err);
    });
  }

  return result;
}
