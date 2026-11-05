"use client";

import { useState } from "react";
import { Percent, CheckCircle2, ShieldCheck, DollarSign } from "lucide-react";

export default function AdminCommissionsPage() {
  const [categoryRates, setCategoryRates] = useState([
    { category: "Hotels & Luxury Resorts", rate: 10.0, description: "Applied to standard hotel and glamping reservations" },
    { category: "Northern Tour Packages", rate: 12.0, description: "Includes guided group & family multi-day tours" },
    { category: "4x4 Prado & Vehicle Rentals", rate: 15.0, description: "Includes chauffeured mountain transport" },
    { category: "Activities & Treks", rate: 10.0, description: "Basecamp expeditions, boating, and paragliding" },
  ]);

  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Commission Structure</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure default marketplace take-rates per vertical and vendor tier
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>Commission policy updated across all automated booking fee calculations!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-700 flex items-center gap-2">
            <Percent className="w-4 h-4 text-brand-amber" /> Category Baseline Rates (%)
          </h2>

          <div className="space-y-4">
            {categoryRates.map((cat, index) => (
              <div
                key={cat.category}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <h3 className="font-bold text-white text-sm">{cat.category}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    step="0.5"
                    min="5"
                    max="30"
                    value={cat.rate}
                    onChange={(e) => {
                      const updated = [...categoryRates];
                      updated[index].rate = Number(e.target.value);
                      setCategoryRates(updated);
                    }}
                    className="w-20 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-amber-400 font-extrabold text-sm text-center focus:outline-none"
                  />
                  <span className="text-slate-400 font-bold text-sm">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-xs transition shadow-md"
          >
            Save Commission Settings
          </button>
        </div>
      </form>
    </div>
  );
}
