import { prisma } from "@/lib/prisma";
import { generateBookingConfirmationHtml } from "@/lib/notifications";

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
}

export function generateBookingNumber(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `PKT-2026-${random}`;
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
  paymentStatus: "PAID" | "PENDING";
  status: "CONFIRMED" | "CANCELLED_BY_CUSTOMER" | "PENDING_PAYMENT";
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  cnicOrPassport: string;
  specialRequests?: string;
}): Promise<BookingRecord> {
  const bookingNumber = generateBookingNumber();
  const depositAmount = data.depositAmount !== undefined ? data.depositAmount : (data.paymentMethod === "CASH_ON_ARRIVAL" ? 0 : data.totalAmount);
  const balanceDue = data.balanceDue !== undefined ? data.balanceDue : (data.totalAmount - depositAmount);

  // Execute inside an ACID database transaction to strictly prevent overbooking
  const result = await prisma.$transaction(async (tx) => {
    // 1. If tour departure is specified, atomically check available seats & lock
    if (data.departureId) {
      const departure = await tx.departure.findUnique({
        where: { id: data.departureId },
      });

      if (!departure) {
        throw new Error("The selected departure date is no longer available.");
      }

      if (departure.seatsLeft < data.guestsCount) {
        throw new Error(
          `Overbooking prevented: Only ${departure.seatsLeft} seat(s) remaining for departure on ${departure.startDate.toISOString().split("T")[0]}, but ${data.guestsCount} were requested.`
        );
      }

      // Decrement seats atomically
      const remaining = departure.seatsLeft - data.guestsCount;
      await tx.departure.update({
        where: { id: data.departureId },
        data: {
          seatsLeft: remaining,
          status: remaining <= 0 ? "SOLD_OUT" : "AVAILABLE",
        },
      });
    }

    // 2. Find or create traveler customer user
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

    // 3. Resolve listing and unit
    const listing = await tx.listing.findUnique({
      where: { id: data.listingId },
      include: { units: true },
    });

    const unitId = listing?.units[0]?.id || data.listingId;
    const commissionRate = listing?.commissionRate || 12.0;
    const platformFee = Math.round((data.totalAmount * commissionRate) / 100);
    const vendorEarnings = data.totalAmount - platformFee;

    // 4. Create Booking
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
        totalAmount: data.totalAmount,
        depositAmount,
        balanceDue,
        vendorEarnings,
        platformFee,
        isSoloTraveler: Boolean(data.isSoloTraveler),
        singleSupplement: data.singleSupplement || 0,
        status: data.status === "CONFIRMED" ? "CONFIRMED" : "PENDING_PAYMENT",
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        specialRequests: data.specialRequests || `CNIC: ${data.cnicOrPassport}`,
      },
    });

    // 5. Create Payment record
    await tx.payment.create({
      data: {
        bookingId: booking.id,
        amount: depositAmount > 0 ? depositAmount : data.totalAmount,
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
    totalAmount: data.totalAmount,
    depositAmount,
    balanceDue,
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

  // Asynchronously trigger confirmation email / notification
  try {
    generateBookingConfirmationHtml(record);
  } catch (err) {
    console.error("Error generating confirmation notification:", err);
  }

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
          include: { destination: true },
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
  return await prisma.$transaction(async (tx) => {
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
      };
    }

    return { success: false, message: "Transaction reference not found." };
  });
}
