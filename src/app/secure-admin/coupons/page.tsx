"use client";

import { useState } from "react";
import { Tag, Plus, CheckCircle2, Trash2 } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([
    {
      code: "HUNZA10",
      discount: "10% Off",
      minSpend: "PKR 25,000",
      validUntil: "Dec 31, 2026",
      usedCount: 84,
      isActive: true,
    },
    {
      code: "WELCOMEPK",
      discount: "PKR 3,000 Flat",
      minSpend: "PKR 30,000",
      validUntil: "Nov 30, 2026",
      usedCount: 142,
      isActive: true,
    },
    {
      code: "AUTUMN2026",
      discount: "15% Off",
      minSpend: "PKR 50,000",
      validUntil: "Nov 20, 2026",
      usedCount: 29,
      isActive: true,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Promotional Coupons & Discount Vouchers</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create campaign promo codes for domestic and overseas Pakistani tourists
          </p>
        </div>

        <button
          onClick={() => {
            const code = prompt("Enter new Promo Code (e.g. SKARDU15):");
            if (code) {
              setCoupons([
                ...coupons,
                {
                  code: code.toUpperCase(),
                  discount: "15% Off",
                  minSpend: "PKR 35,000",
                  validUntil: "Dec 31, 2026",
                  usedCount: 0,
                  isActive: true,
                },
              ]);
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-xs transition shadow flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Promo</span>
        </button>
      </div>

      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount Value</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4">Total Redemptions</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300 font-medium">
              {coupons.map((c) => (
                <tr key={c.code} className="hover:bg-slate-700/30 transition">
                  <td className="py-3.5 px-4 font-mono font-extrabold text-amber-400 text-sm">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">{c.discount}</td>
                  <td className="py-3.5 px-4 text-slate-400">{c.minSpend}</td>
                  <td className="py-3.5 px-4 text-slate-300">{c.validUntil}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{c.usedCount} Bookings</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active
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
