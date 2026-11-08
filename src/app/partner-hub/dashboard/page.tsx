"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Star, 
  ArrowUpRight, 
  Building, 
  Clock, 
  CheckCircle2, 
  XCircle,
  PlusCircle,
  AlertCircle
} from "lucide-react";

export default function VendorDashboardPage() {
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  function updateStatus(id: string, newStatus: string) {
    setRecentBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partner Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Welcome to your partner extranet. Manage listings, rates, and incoming reservations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/partner-hub/calendar"
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm"
          >
            Manage Rates & Dates
          </Link>
          <Link
            href="/partner-hub/listings/new"
            className="px-4 py-2 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold transition shadow-md flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Listing</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Booking Value</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-brand-emerald">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">PKR 0</p>
          <p className="text-[11px] text-slate-400">Total customer payments captured</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Earnings</span>
            <span className="p-2 rounded-lg bg-blue-50 text-brand-navy">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-brand-navy">PKR 0</p>
          <p className="text-[11px] text-slate-400">Available for next Raast/Bank payout</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Bookings</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">0 Tours</p>
          <p className="text-[11px] text-slate-400">Confirmed customer reservations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Partner Status</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">Active</p>
          <p className="text-[11px] text-slate-400">Verified Partner Extranet</p>
        </div>
      </div>

      {/* Recent Bookings Action Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Customer Reservations</h2>
            <p className="text-xs text-slate-500">Review incoming reservations and update booking status</p>
          </div>
          <Link href="/partner-hub/bookings" className="text-xs font-bold text-brand-emerald hover:underline">
            View All Bookings →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest Details</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Room Type</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No customer reservations yet. Click &apos;Add New Listing&apos; to publish your tours or rooms.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-emerald">{b.number}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{b.guest}</span>
                    <span className="text-[11px] text-slate-400">{b.phone}</span>
                  </td>
                  <td className="py-3.5 px-4">{b.dates}</td>
                  <td className="py-3.5 px-4 text-slate-600">{b.room}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    PKR {b.amount.toLocaleString()}
                  </td>
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
                    {b.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => updateStatus(b.id, "CONFIRMED")}
                          className="px-2.5 py-1 rounded bg-brand-emerald hover:bg-brand-emeraldDark text-white text-[11px] font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(b.id, "REJECTED")}
                          className="px-2.5 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-[11px] font-bold"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No action needed</span>
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
