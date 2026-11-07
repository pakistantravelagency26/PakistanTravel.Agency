"use client";

import { useState } from "react";
import { ArrowDownToLine, CheckCircle2, ShieldCheck, Clock } from "lucide-react";

export default function AdminPayoutsPage() {
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);

  function handleDisburse(id: string) {
    setPayoutRequests((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "DISBURSED_VIA_RAAST" } : p))
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Partner Payouts & State Bank Raast Settlement</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review automated net ledger balances and trigger IBAN bank disbursements
        </p>
      </div>

      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Partner Business</th>
                <th className="py-3 px-4">Bank & IBAN</th>
                <th className="py-3 px-4">Net Amount</th>
                <th className="py-3 px-4">Trips Included</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300 font-medium">
              {payoutRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No pending partner payout requests.
                  </td>
                </tr>
              ) : (
                payoutRequests.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-700/30 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{p.id}</td>
                  <td className="py-3.5 px-4 font-bold text-white text-sm">{p.partner}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-200 block font-semibold">{p.bank}</span>
                    <span className="font-mono text-[11px] text-slate-400">{p.iban}</span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-brand-amber text-sm">
                    PKR {p.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">{p.bookingsCount} Completed Stays</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        p.status === "DISBURSED_VIA_RAAST"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {p.status === "DISBURSED_VIA_RAAST" ? "Disbursed via Raast" : "Pending Approval"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.status === "PENDING_APPROVAL" ? (
                      <button
                        onClick={() => handleDisburse(p.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-[11px] shadow"
                      >
                        Approve & Transfer (Raast)
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 1LINK Success
                      </span>
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
