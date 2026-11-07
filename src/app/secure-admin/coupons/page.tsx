"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, CheckCircle2, Trash2, X, AlertCircle, Percent, Calendar, ShieldCheck, Loader2 } from "lucide-react";

interface CouponItem {
  id: string;
  code: string;
  discountPercent: number | null;
  flatDiscount: number | null;
  minSpend: number | null;
  validUntil: string;
  usedCount: number;
  maxUses: number;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "flat">("percent");
  const [discountValue, setDiscountValue] = useState("10");
  const [minSpend, setMinSpend] = useState("10000");
  const [validDays, setValidDays] = useState("60");
  const [maxUses, setMaxUses] = useState("100");

  async function loadCoupons() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      }
    } catch (err: any) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!code.trim()) {
      setError("Please enter a valid coupon code.");
      return;
    }

    setCreating(true);
    try {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + (parseInt(validDays, 10) || 30));

      const payload = {
        code: code.trim().toUpperCase(),
        discountPercent: discountType === "percent" ? parseInt(discountValue, 10) : null,
        flatDiscount: discountType === "flat" ? parseFloat(discountValue) : null,
        minSpend: minSpend ? parseFloat(minSpend) : null,
        validUntil: expiry.toISOString(),
        maxUses: maxUses ? parseInt(maxUses, 10) : 100,
      };

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setCode("");
        loadCoupons();
      } else {
        setError(data.error || "Failed to create coupon.");
      }
    } catch (err: any) {
      setError(err.message || "Network error while creating coupon.");
    } finally {
      setCreating(false);
    }
  }

  async function toggleStatus(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !current } : c))
        );
      }
    } catch (err) {
      console.error("Failed to toggle coupon status:", err);
    }
  }

  async function handleDelete(id: string, couponCode: string) {
    if (!confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Promotional Coupons & Discount Vouchers</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create and manage verified promotional campaign discount codes stored in Neon PostgreSQL
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promo Code</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
          <span className="text-xs font-semibold">Loading live coupons from database...</span>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Tag className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">No Promotional Coupons Created</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              You haven&apos;t created any coupon codes yet. Click &quot;Create Promo Code&quot; above to issue real percentage discounts or flat PKR vouchers for travelers.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Coupon</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map((c) => (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border transition bg-white ${
                c.isActive
                  ? "border-emerald-200 shadow-sm"
                  : "border-slate-200 opacity-60 bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-base font-black text-slate-900 tracking-wider">
                    {c.code}
                  </span>
                  <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
                    {c.discountPercent ? `${c.discountPercent}% OFF` : `PKR ${c.flatDiscount?.toLocaleString()} FLAT`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleStatus(c.id, c.isActive)}
                    title={c.isActive ? "Deactivate" : "Activate"}
                    className={`p-1.5 rounded-lg text-xs font-bold transition ${
                      c.isActive ? "text-emerald-700 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.code)}
                    title="Delete coupon"
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Min Spend</span>
                  <span className="font-semibold text-slate-700">
                    {c.minSpend ? `PKR ${c.minSpend.toLocaleString()}` : "No minimum"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Redeemed</span>
                  <span className="font-semibold text-slate-700">
                    {c.usedCount} / {c.maxUses}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Valid Until</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(c.validUntil).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Create Promotional Coupon</h3>
                <p className="text-xs text-slate-500">Stored persistently in database</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SKARDU15, SUMMER26"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm uppercase font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat PKR Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {discountType === "percent" ? "Discount (%)" : "Discount (PKR)"}
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Min Spend (PKR)
                  </label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Validity (Days)
                  </label>
                  <input
                    type="number"
                    value={validDays}
                    onChange={(e) => setValidDays(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Coupon</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
