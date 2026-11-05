"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Printer, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Compass,
  ArrowRight
} from "lucide-react";
import { BookingRecord, getAllBookings } from "@/services/booking.service";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "CONFIRMED" | "CANCELLED">("ALL");

  useEffect(() => {
    async function load() {
      const data = await getAllBookings();
      setBookings(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleCancel(id: string) {
    if (!confirm("Are you sure you want to cancel this booking? Free cancellation policy applies.")) {
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: "POST" });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id || b.bookingNumber === id ? { ...b, status: "CANCELLED_BY_CUSTOMER" } : b))
        );
      }
    } catch (e) {
      alert("Failed to cancel booking");
    }
  }

  const filtered = bookings.filter((b) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "CONFIRMED") return b.status === "CONFIRMED";
    if (activeTab === "CANCELLED") return b.status === "CANCELLED_BY_CUSTOMER";
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Bookings & Trips</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your hotel stays, northern tours, and vouchers across Pakistan
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
          {[
            { id: "ALL", label: "All Bookings" },
            { id: "CONFIRMED", label: "Active & Upcoming" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? "bg-brand-emerald text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading your bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <Compass className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">No bookings found</h3>
            <p className="text-xs text-slate-500">Ready to explore Northern Pakistan? Find your next dream stay.</p>
            <Link
              href="/search"
              className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-brand-emerald text-white text-xs font-bold"
            >
              Search Hotels & Tours
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                <div className="flex gap-4">
                  <img
                    src={b.listingPhoto}
                    alt={b.listingTitle}
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-brand-emerald">
                        {b.bookingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {b.status === "CONFIRMED" ? "Confirmed" : "Cancelled"}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">{b.listingTitle}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {b.destination}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                      {b.startDate} to {b.endDate} · {b.unitTitle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Price</span>
                    <span className="text-base font-extrabold text-slate-900">
                      PKR {b.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Paid via {b.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/confirmation/${b.bookingNumber}`}
                      className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Voucher</span>
                    </Link>

                    {b.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="px-3.5 py-2 rounded-lg text-red-600 hover:bg-red-50 font-bold text-xs transition border border-red-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
