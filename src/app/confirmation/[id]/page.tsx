"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  Printer, 
  Share2, 
  MapPin, 
  Calendar, 
  Users, 
  PhoneCall, 
  Download, 
  ShieldCheck, 
  Compass,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import type { BookingRecord } from "@/services/booking.service";

export default function ConfirmationPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        const data = await res.json();
        if (data.success && data.booking) {
          setBooking(data.booking);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn("Could not fetch remote booking:", e);
      }

      setLoading(false);
    }
    load();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-emerald"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Booking Reference Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          We could not locate any active reservation matching reference &quot;{bookingId}&quot;. Please verify your booking link or contact traveler support.
        </p>
        <Link
          href="/search"
          className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
        >
          Explore Verified Tours
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Success Banner (Hidden on print) */}
        <div className="bg-emerald-600 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 print:hidden">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-200 uppercase tracking-widest block">
                Booking Confirmed & Guaranteed
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Your trip is booked, {booking.guestName}!
              </h1>
              <p className="text-xs text-white/80 mt-1">
                We sent a confirmation copy and WhatsApp notification to {booking.guestPhone}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`/api/bookings/${booking.bookingNumber}/voucher`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-slate-100 font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Voucher</span>
            </a>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <Link
              href="/account/bookings"
              className="px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-black text-white font-bold text-xs shadow transition"
            >
              My Bookings
            </Link>
          </div>
        </div>

        {/* Official Printable Voucher Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Voucher Header */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-6 h-6 text-brand-emerald" />
                <span className="text-xl font-bold text-slate-900">
                  PakistanTravel<span className="text-brand-amber">.agency</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">Official Check-in Voucher & Guest Pass</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Booking Number</span>
              <span className="text-lg font-mono font-extrabold text-brand-emerald block">
                {booking.bookingNumber}
              </span>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                {booking.status}
              </span>
            </div>
          </div>

          {/* Property & Stay Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">
                Property / Experience
              </span>
              <h2 className="text-base font-bold text-slate-900">{booking.listingTitle}</h2>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                {booking.destination}
              </p>
              <div className="mt-3 text-xs text-slate-700 font-semibold bg-white p-2.5 rounded-lg border border-slate-200 inline-block">
                {booking.unitTitle?.toLowerCase().includes("seat") || booking.listingTitle?.toLowerCase().includes("tour")
                  ? `Package: ${booking.unitTitle} (${booking.unitsCount} Seat${booking.unitsCount > 1 ? "s" : ""}, ${booking.guestsCount} Travelers)`
                  : `Room: ${booking.unitTitle} (${booking.unitsCount} Room, ${booking.guestsCount} Guests)`}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {booking.listingTitle?.toLowerCase().includes("tour") ? "Tour Departure" : "Check-in"}
                </span>
                <span className="font-bold text-slate-900 block text-sm mt-0.5">{booking.startDate}</span>
                <span className="text-[10px] text-slate-500">From 02:00 PM</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {booking.listingTitle?.toLowerCase().includes("tour") ? "Tour Return" : "Check-out"}
                </span>
                <span className="font-bold text-slate-900 block text-sm mt-0.5">{booking.endDate}</span>
                <span className="text-[10px] text-slate-500">Until 12:00 PM</span>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guest Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Guest</span>
                <span className="font-bold text-slate-800">{booking.guestName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Phone / WhatsApp</span>
                <span className="font-bold text-slate-800">{booking.guestPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">CNIC / Passport</span>
                <span className="font-bold text-slate-800">{booking.cnicOrPassport}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Email</span>
                <span className="font-bold text-slate-800 truncate block">{booking.guestEmail}</span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="space-y-3 border-t border-slate-100 pt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Receipt & Breakdown</h3>
              <a
                href={`/api/bookings/${booking.bookingNumber}/voucher`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-brand-emerald hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Voucher</span>
              </a>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Method: {booking.paymentMethod}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Status: {booking.paymentStatus === "PAID" ? "Payment Completed" : "Partial Deposit / Due on Arrival"}
                  </span>
                  {booking.isSoloTraveler && (
                    <span className="inline-block mt-1 text-[10px] font-semibold text-brand-emerald bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Solo Traveler Booking (Twin-share solo supplement included: PKR {Number(booking.singleSupplement || 0).toLocaleString()})
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total Price (Inc. Taxes)</span>
                  <span className="text-xl font-extrabold text-slate-900">
                    PKR {booking.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {(booking.depositAmount > 0 || booking.balanceDue > 0) && (
                <div className="border-t border-slate-200 pt-3 grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Paid Online (Deposit)</span>
                    <span className="text-sm font-extrabold text-emerald-600 block mt-0.5">
                      PKR {booking.depositAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">Card / JazzCash / EasyPaisa</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Balance Due on Arrival</span>
                    <span className={`text-sm font-extrabold block mt-0.5 ${booking.balanceDue > 0 ? "text-amber-700" : "text-slate-900"}`}>
                      PKR {booking.balanceDue.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">Pay at departure / check-in desk</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Check-in Notes for Northern Pakistan */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold block">Important Mountain Travel Instructions:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li>Please keep your original National Identity Card (CNIC) or Passport ready for presentation at check-in.</li>
              <li>Present this electronic or printed voucher upon arrival at the reception.</li>
              <li>For round-the-clock ground assistance, contact our Pakistan Support: +92 322 2327096 / paksitantravel.agency@gmail.com.</li>
            </ul>
          </div>
        </div>

        {/* Bottom Navigation (Hidden on print) */}
        <div className="flex justify-between items-center text-xs print:hidden">
          <Link href="/" className="text-brand-emerald font-semibold hover:underline">
            ← Return to Home
          </Link>
          <Link
            href="/search"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition flex items-center gap-1.5"
          >
            <span>Explore More Tours</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
