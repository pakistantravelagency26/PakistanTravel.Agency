import { prisma } from "@/lib/prisma";

export interface BookingRecord {
  id: string;
  bookingNumber: string;
  listingId: string;
  listingTitle: string;
  listingPhoto: string;
  unitTitle: string;
  destination: string;
  startDate: string;
  endDate: string;
  nightsCount: number;
  guestsCount: number;
  unitsCount: number;
  totalAmount: number;
  paymentMethod: "STRIPE" | "JAZZCASH" | "EASYPAISA" | "CASH_ON_ARRIVAL";
  paymentStatus: "PAID" | "PENDING";
  status: "CONFIRMED" | "CANCELLED_BY_CUSTOMER" | "PENDING_PAYMENT";
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  cnicOrPassport: string;
  specialRequests?: string;
  createdAt: string;
}

// In-memory persistent store for development & mock fallback
const BOOKINGS_STORE: BookingRecord[] = [
  {
    id: "pkt-mock-1",
    bookingNumber: "PKT-2026-89421",
    listingId: "hunza-serena-inn",
    listingTitle: "Hunza Serena Inn & Heritage Lodge",
    listingPhoto: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    unitTitle: "Deluxe Mountain View Room",
    destination: "Hunza Valley, Gilgit-Baltistan",
    startDate: "2026-11-10",
    endDate: "2026-11-13",
    nightsCount: 3,
    guestsCount: 2,
    unitsCount: 1,
    totalAmount: 97500,
    paymentMethod: "JAZZCASH",
    paymentStatus: "PAID",
    status: "CONFIRMED",
    guestName: "Usman Tariq",
    guestEmail: "customer@pakistantravel.agency",
    guestPhone: "03001234567",
    cnicOrPassport: "37405-9876543-1",
    specialRequests: "Upper floor room with direct view of Rakaposhi peak.",
    createdAt: new Date().toISOString(),
  },
];

export function generateBookingNumber(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `PKT-2026-${random}`;
}

export async function createBooking(data: Omit<BookingRecord, "id" | "bookingNumber" | "createdAt">): Promise<BookingRecord> {
  const newBooking: BookingRecord = {
    ...data,
    id: `bk-${Date.now()}`,
    bookingNumber: generateBookingNumber(),
    createdAt: new Date().toISOString(),
  };

  BOOKINGS_STORE.unshift(newBooking);
  return newBooking;
}

export async function getBookingById(idOrNumber: string): Promise<BookingRecord | null> {
  const found = BOOKINGS_STORE.find(
    (b) => b.id === idOrNumber || b.bookingNumber === idOrNumber
  );
  return found || null;
}

export async function getBookingsByEmail(email: string): Promise<BookingRecord[]> {
  return BOOKINGS_STORE.filter(
    (b) => b.guestEmail.toLowerCase() === email.toLowerCase()
  );
}

export async function getAllBookings(): Promise<BookingRecord[]> {
  return BOOKINGS_STORE;
}

export async function cancelBooking(id: string): Promise<boolean> {
  const booking = BOOKINGS_STORE.find((b) => b.id === id || b.bookingNumber === id);
  if (booking) {
    booking.status = "CANCELLED_BY_CUSTOMER";
    return true;
  }
  return false;
}
