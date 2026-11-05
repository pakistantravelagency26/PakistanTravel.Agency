"use client";

import Link from "next/link";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight,
  MapPin,
  Clock
} from "lucide-react";

export default function AdminDashboardPage() {
  const regionalPerformance = [
    { name: "Gilgit-Baltistan (Hunza, Skardu, Deosai)", percent: 58, revenue: "PKR 7,238,400" },
    { name: "Khyber Pakhtunkhwa (Swat, Kalam, Kumrat)", percent: 24, revenue: "PKR 2,995,200" },
    { name: "Punjab & Galiyat (Murree, Bhurban, Nathia Gali)", percent: 18, revenue: "PKR 2,246,400" },
  ];

  const recentTransactions = [
    {
      id: "TX-9941",
      number: "PKT-2026-89421",
      vendor: "Hunza Serena Inn",
      customer: "Usman Tariq",
      amount: 97500,
      fee: 9750, // 10%
      method: "JazzCash",
      date: "Just now",
    },
    {
      id: "TX-9940",
      number: "PKT-2026-94210",
      vendor: "Karakoram Expeditions",
      customer: "Zainab Chaudhry",
      amount: 65000,
      fee: 7800, // 12%
      method: "Card (Stripe)",
      date: "24 mins ago",
    },
    {
      id: "TX-9939",
      number: "PKT-2026-77123",
      vendor: "Walnut Heights Swat",
      customer: "Dr. Hamza Siddiqui",
      amount: 37000,
      fee: 3700,
      method: "EasyPaisa",
      date: "1 hour ago",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Marketplace Operations & Executive Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Macro-level metrics across all Pakistani hotels, tours, activities, and transport rentals
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/secure-admin/vendors"
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 transition flex items-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4" />
            <span>2 Pending Vendors</span>
          </Link>
          <Link
            href="/secure-admin/listings"
            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            <span>1 Listing Moderation</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Gross Marketplace Value (GMV)
          </span>
          <p className="text-2xl font-extrabold text-white">PKR 12.48M</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +26.2% vs last quarter
          </div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Net Commission Earnings
          </span>
          <p className="text-2xl font-extrabold text-brand-amber">PKR 1.37M</p>
          <p className="text-[11px] text-slate-400">Blended take-rate: 11.0%</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Verified Tourism Partners
          </span>
          <p className="text-2xl font-extrabold text-white">48 Partners</p>
          <p className="text-[11px] text-slate-400">Across 14 Pakistani districts</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Confirmed Trips Booked
          </span>
          <p className="text-2xl font-extrabold text-emerald-400">312 Bookings</p>
          <p className="text-[11px] text-slate-400">99.4% zero double-booking rate</p>
        </div>
      </div>

      {/* Regional Revenue Distribution */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-emerald" /> Regional Revenue Breakdown (Pakistan)
        </h2>

        <div className="space-y-4 pt-2">
          {regionalPerformance.map((region) => (
            <div key={region.name} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">{region.name}</span>
                <span className="font-bold text-brand-amber">
                  {region.percent}% ({region.revenue})
                </span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand-emerald h-full rounded-full transition-all duration-500"
                  style={{ width: `${region.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions & Commission Split */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-white">Live Booking Transactions & Commission Split</h2>
            <p className="text-xs text-slate-400">Real-time payment captures with instant platform fee split</p>
          </div>
          <Link href="/secure-admin/bookings" className="text-xs font-bold text-emerald-400 hover:underline">
            View All Ledger →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold border-y border-slate-700">
              <tr>
                <th className="py-3 px-4">Tx ID</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Partner</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Gross Total</th>
                <th className="py-3 px-4">Platform Fee</th>
                <th className="py-3 px-4">Payment Rail</th>
                <th className="py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300 font-medium">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-700/30 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-400">{tx.id}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{tx.number}</td>
                  <td className="py-3 px-4 font-bold text-white">{tx.vendor}</td>
                  <td className="py-3 px-4">{tx.customer}</td>
                  <td className="py-3 px-4 font-bold text-white">PKR {tx.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-amber-400">+PKR {tx.fee.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-slate-300">
                      {tx.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
