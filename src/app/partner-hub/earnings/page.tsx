"use client";

import { useState } from "react";
import { 
  Wallet, 
  Building2, 
  ArrowDownToLine, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export default function VendorEarningsPage() {
  const [requested, setRequested] = useState(false);

  const [payouts, setPayouts] = useState([
    {
      id: "PO-9921",
      date: "Oct 28, 2026",
      amount: 450000,
      bank: "Meezan Bank (IBAN ...0123)",
      method: "State Bank Raast / 1LINK",
      status: "PAID",
      refCode: "RAAST-882194821",
    },
    {
      id: "PO-9844",
      date: "Oct 15, 2026",
      amount: 620000,
      bank: "Meezan Bank (IBAN ...0123)",
      method: "State Bank Raast / 1LINK",
      status: "PAID",
      refCode: "RAAST-771928391",
    },
    {
      id: "PO-9712",
      date: "Sep 30, 2026",
      amount: 262000,
      bank: "Meezan Bank (IBAN ...0123)",
      method: "State Bank Raast / 1LINK",
      status: "PAID",
      refCode: "RAAST-661298412",
    },
  ]);

  function handleRequestPayout() {
    setRequested(true);
    setTimeout(() => {
      setPayouts((prev) => [
        {
          id: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
          date: "Today (Nov 04, 2026)",
          amount: 1332000,
          bank: "Meezan Bank (IBAN ...0123)",
          method: "State Bank Raast / 1LINK",
          status: "PROCESSING",
          refCode: "RAAST-PENDING",
        },
        ...prev,
      ]);
    }, 1000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Earnings, Commission & Payouts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time financial reconciliation and automated payouts to your Pakistani bank account
          </p>
        </div>

        <button
          onClick={handleRequestPayout}
          disabled={requested}
          className="px-5 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark disabled:opacity-50 text-white font-bold text-xs transition shadow-md flex items-center gap-2 self-start"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>{requested ? "Payout Request Submitted" : "Request Payout (PKR 1,332,000)"}</span>
        </button>
      </div>

      {requested && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600" />
          <div>
            <span className="font-bold block">Payout Request Dispatched to State Bank Raast!</span>
            Funds are settled directly to your Meezan Bank account within 2-4 banking hours.
          </div>
        </div>
      )}

      {/* Financial Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total Gross Bookings
          </span>
          <p className="text-2xl font-extrabold text-slate-900">PKR 1,480,000</p>
          <p className="text-[11px] text-slate-400">Total customer payments captured</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Platform Commission (10%)
          </span>
          <p className="text-2xl font-extrabold text-amber-600">- PKR 148,000</p>
          <p className="text-[11px] text-slate-400">Fixed contracted partner rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-emerald/40 bg-emerald-50/20 shadow-sm space-y-2">
          <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider block">
            Net Available Balance
          </span>
          <p className="text-2xl font-extrabold text-brand-emerald">PKR 1,332,000</p>
          <p className="text-[11px] text-emerald-700 font-medium">Ready for withdrawal to Meezan Bank</p>
        </div>
      </div>

      {/* Verified Bank Account Details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-emerald" /> Linked Pakistani Settlement Account
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Verified by Antigravity Compliance Team</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Raast & 1LINK Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank Name</span>
            <span className="font-bold text-slate-800 text-sm">Meezan Bank Limited</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Title</span>
            <span className="font-bold text-slate-800 text-sm">Hunza Serena Hospitality Ltd</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">IBAN Number</span>
            <span className="font-mono font-bold text-slate-800 text-sm">PK36MEZN0001234567890123</span>
          </div>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Historical Settlement Ledger</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Payout ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount (PKR)</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Settlement Rail</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">{p.id}</td>
                  <td className="py-3.5 px-4">{p.date}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    PKR {p.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{p.bank}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-mono text-slate-500">{p.method}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        p.status === "PAID"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {p.status}
                    </span>
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
