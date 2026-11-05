"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, DollarSign, Plus, Lock, CheckCircle2 } from "lucide-react";
import { MOCK_LISTINGS } from "@/services/listing.service";

export default function VendorCalendarPage() {
  const [selectedListing, setSelectedListing] = useState("skardu-7-day-tour");
  const [selectedUnit, setSelectedUnit] = useState("Per Person Seat");

  // Custom pricing rule state
  const [ruleName, setRuleName] = useState("Autumn Peak Foliage");
  const [customPrice, setCustomPrice] = useState(42000);
  const [ruleAdded, setRuleAdded] = useState(false);

  // Generate 28 days for current month
  const days = Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    const isWeekend = day % 7 === 5 || day % 7 === 6;
    const isPeak = day >= 10 && day <= 15;
    return {
      day,
      available: day % 4 === 0 ? 1 : 4,
      price: isPeak ? 42000 : isWeekend ? 36000 : 32500,
      isBlocked: day === 24,
    };
  });

  function handleAddRule(e: React.FormEvent) {
    e.preventDefault();
    setRuleAdded(true);
    setTimeout(() => setRuleAdded(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Availability & Dynamic Pricing</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage inventory and set seasonal / weekend price adjustments for Northern Pakistan
          </p>
        </div>

        {/* Property Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedListing}
            onChange={(e) => setSelectedListing(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white shadow-sm"
          >
            {MOCK_LISTINGS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">November 2026 Inventory</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Low (1 left)
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> Blocked
              </span>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => (
              <div
                key={d.day}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
                  d.isBlocked
                    ? "bg-slate-100 border-slate-200 opacity-60"
                    : d.available === 1
                    ? "bg-amber-50/50 border-amber-200 hover:border-amber-400"
                    : "bg-white border-slate-200 hover:border-brand-emerald"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-800">{d.day}</span>
                  {d.isBlocked ? (
                    <Lock className="w-3 h-3 text-red-500" />
                  ) : (
                    <span
                      className={`text-[10px] font-bold px-1 rounded ${
                        d.available === 1 ? "bg-amber-200 text-amber-900" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {d.available} left
                    </span>
                  )}
                </div>

                <div className="mt-auto">
                  <span className="text-[10px] text-slate-400 block font-medium">PKR</span>
                  <span className="text-xs font-bold text-slate-900">
                    {(d.price / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Seasonal Rule Adder (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <form
            onSubmit={handleAddRule}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
          >
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand-emerald" /> Set Seasonal Surge / Discount
            </h3>

            {ruleAdded && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
                <span>Rate rule applied successfully to calendar!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Occasion / Reason
              </label>
              <input
                type="text"
                required
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g. Eid Holidays, Cherry Blossom"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">From Date</label>
                <input
                  type="date"
                  defaultValue="2026-11-10"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">To Date</label>
                <input
                  type="date"
                  defaultValue="2026-11-15"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                New Price per Night (PKR)
              </label>
              <input
                type="number"
                required
                value={customPrice}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold rounded-xl transition shadow"
            >
              Apply Custom Rate
            </button>
          </form>

          {/* Quick Tips for Mountain Hosts */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold block">Gilgit-Baltistan Host Tip:</span>
            <p className="text-[11px] leading-relaxed">
              Autumn foliage (October–November) and Cherry Blossom (April–May) experience 100% occupancy in Karimabad. Increase rates 20% in advance to maximize yield.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
