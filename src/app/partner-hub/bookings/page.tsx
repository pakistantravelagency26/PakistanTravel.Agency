"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Printer, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function VendorBookingsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [bookings, setBookings] = useState([
    {
      id: "bk-101",
      number: "PKT-2026-89421",
      guest: "Usman Tariq",
      email: "customer@pakistantravel.agency",
      phone: "03001234567",
      dates: "Nov 10 – Nov 13, 2026 (3 Nights)",
      unit: "Deluxe Mountain View Room",
      amount: 97500,
      paymentMethod: "JazzCash",
      status: "CONFIRMED",
    },
    {
      id: "bk-102",
      number: "PKT-2026-92144",
      guest: "Hamza Sheikh",
      email: "hamza@example.pk",
      phone: "03215556677",
      dates: "Nov 14 – Nov 17, 2026 (3 Nights)",
      unit: "Executive Heritage Suite",
      amount: 144000,
      paymentMethod: "Card (Stripe)",
      status: "PENDING",
    },
    {
      id: "bk-103",
      number: "PKT-2026-78119",
      guest: "Dr. Fatima Zahra",
      email: "fatima.z@example.pk",
      phone: "03459998811",
      dates: "Nov 20 – Nov 22, 2026 (2 Nights)",
      unit: "Deluxe Mountain View Room",
      amount: 65000,
      paymentMethod: "Cash on Arrival",
      status: "CONFIRMED",
    },
    {
      id: "bk-104",
      number: "PKT-2026-66321",
      guest: "Zubair Ahmad",
      email: "zubair@example.pk",
      phone: "03334445566",
      dates: "Oct 25 – Oct 28, 2026",
      unit: "Deluxe Mountain View Room",
      amount: 97500,
      paymentMethod: "EasyPaisa",
      status: "CANCELLED",
    },
  ]);

  function setStatus(id: string, s: string) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: s } : b))
    );
  }

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reservations & Guests</h1>
          <p className="text-xs text-slate-500 mt-1">
            Accept, confirm, and review all booking vouchers for your property
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ref, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
          />
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 text-xs font-semibold">
        {["ALL", "CONFIRMED", "PENDING", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              statusFilter === s
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest Info</th>
                <th className="py-3 px-4">Stay & Dates</th>
                <th className="py-3 px-4">Total (PKR)</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-emerald">
                    {b.number}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{b.guest}</span>
                    <span className="text-[11px] text-slate-400">{b.phone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-800 font-semibold block">{b.unit}</span>
                    <span className="text-[11px] text-slate-400">{b.dates}</span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    PKR {b.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{b.paymentMethod}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-800"
                          : b.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {b.status === "PENDING" && (
                      <button
                        onClick={() => setStatus(b.id, "CONFIRMED")}
                        className="px-2.5 py-1 rounded bg-brand-emerald hover:bg-brand-emeraldDark text-white text-[11px] font-bold"
                      >
                        Accept
                      </button>
                    )}
                    <Link
                      href={`/confirmation/${b.number}`}
                      target="_blank"
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold inline-block"
                    >
                      Voucher
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
