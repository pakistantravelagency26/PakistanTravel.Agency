"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpenCheck, Search, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings.map((b: any) => ({
            id: b.id,
            number: b.bookingNumber || b.id,
            guest: b.guestName || "Guest",
            vendor: b.listingTitle || "Travel Package",
            dates: `${b.startDate || ""} – ${b.endDate || ""}`,
            gross: b.totalAmount || 0,
            fee: Math.round((b.totalAmount || 0) * 0.12),
            vendorNet: (b.totalAmount || 0) - Math.round((b.totalAmount || 0) * 0.12),
            paymentMethod: b.paymentMethod || "Direct",
            status: b.status || "CONFIRMED",
            emailDeliveryStatus: b.emailDeliveryStatus,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleRefund(id: string) {
    if (!confirm("Are you sure you want to trigger a full refund for this booking?")) return;
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "REFUNDED" } : b))
    );
  }

  const filtered = bookings.filter((b) =>
    b.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketplace Bookings & Refund Control</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit all reservations, gross transactions, platform take-rates, and issue customer refunds
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking ref, guest, vendor..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Tour Package</th>
                <th className="py-3 px-4">Gross (PKR)</th>
                <th className="py-3 px-4">Platform Fee</th>
                <th className="py-3 px-4">Partner Share</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Email Dispatch</th>
                <th className="py-3 px-4 text-right">Refund Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    {loading ? "Loading bookings from database..." : "No customer bookings found in the database."}
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-700/30 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{b.number}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{b.guest}</td>
                  <td className="py-3.5 px-4 text-slate-300">{b.vendor}</td>
                  <td className="py-3.5 px-4 font-extrabold text-white">PKR {b.gross.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-amber-400 font-bold">+PKR {b.fee.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-slate-400">PKR {b.vendorNet.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5" title={`Customer: ${b.emailDeliveryStatus?.customer || "NONE"}, Vendor: ${b.emailDeliveryStatus?.vendor || "NONE"}, Admin: ${b.emailDeliveryStatus?.admin || "NONE"}`}>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          b.emailDeliveryStatus?.customer === "SENT"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : b.emailDeliveryStatus?.customer === "PENDING"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : b.emailDeliveryStatus?.customer === "FAILED"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-slate-700 text-slate-400"
                        }`}
                        title={`Customer Copy: ${b.emailDeliveryStatus?.customer || "NONE"}`}
                      >
                        C: {b.emailDeliveryStatus?.customer === "SENT" ? "✓" : b.emailDeliveryStatus?.customer === "PENDING" ? "⋯" : b.emailDeliveryStatus?.customer === "FAILED" ? "✕" : "–"}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          b.emailDeliveryStatus?.vendor === "SENT"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : b.emailDeliveryStatus?.vendor === "PENDING"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : b.emailDeliveryStatus?.vendor === "FAILED"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-slate-700 text-slate-400"
                        }`}
                        title={`Vendor Copy: ${b.emailDeliveryStatus?.vendor || "NONE"}${b.emailDeliveryStatus?.vendorError ? ` (${b.emailDeliveryStatus.vendorError})` : ""}`}
                      >
                        V: {b.emailDeliveryStatus?.vendor === "SENT" ? "✓" : b.emailDeliveryStatus?.vendor === "PENDING" ? "⋯" : b.emailDeliveryStatus?.vendor === "FAILED" ? "✕" : "–"}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          b.emailDeliveryStatus?.admin === "SENT"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : b.emailDeliveryStatus?.admin === "PENDING"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : b.emailDeliveryStatus?.admin === "FAILED"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-slate-700 text-slate-400"
                        }`}
                        title={`Admin Copy: ${b.emailDeliveryStatus?.admin || "NONE"}`}
                      >
                        A: {b.emailDeliveryStatus?.admin === "SENT" ? "✓" : b.emailDeliveryStatus?.admin === "PENDING" ? "⋯" : b.emailDeliveryStatus?.admin === "FAILED" ? "✕" : "–"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {b.status === "CONFIRMED" ? (
                      <button
                        onClick={() => handleRefund(b.id)}
                        className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-[11px] border border-red-500/30"
                      >
                        Refund Customer
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Processed</span>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
