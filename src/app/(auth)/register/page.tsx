"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Compass, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle, 
  ShieldCheck,
  CheckSquare,
  Square
} from "lucide-react";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "VENDOR" ? "VENDOR" : "CUSTOMER";

  const [role, setRole] = useState<"CUSTOMER" | "VENDOR">(defaultRole);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    password: "",
    businessName: "",
    city: "Hunza",
    listingType: "TOUR",
    cnicOrTaxNumber: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (role === "VENDOR" && !agreedToTerms) {
      setError("You must agree to the Marketplace Partner Agreement to register as an operator.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(role === "VENDOR" ? "/partner-hub/login?registered=true" : "/login?registered=true");
      }, 1500);
    } catch (err: unknown) {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mb-1">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {role === "VENDOR" ? "Partner Registration" : "Create your account"}
          </h2>
          <p className="text-xs text-slate-500">
            {role === "VENDOR"
              ? `List tours & hotel rooms on ${siteConfig.name}`
              : "Book authentic northern Pakistan tours & luxury stays"}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setRole("CUSTOMER")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              role === "CUSTOMER"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            I am a Traveler
          </button>
          <button
            type="button"
            onClick={() => setRole("VENDOR")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              role === "VENDOR"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            List Tour / Hotel (Partner)
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {role === "VENDOR"
                ? "Partner account created! Redirecting to Partner Hub..."
                : "Account created! Redirecting to login..."}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {role === "VENDOR" ? "Primary Contact Person Name" : "Your Full Name"}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ali Khan"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ali@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Phone (Login)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="03001234567"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 8 characters with numbers"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Vendor Specific Inputs */}
          {role === "VENDOR" && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3.5 animate-in fade-in">
              <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-700" /> Operator or Hotel Business Details
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Business / Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Karakoram Expeditions or Hunza Serena Inn"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>WhatsApp Number (Trip Coordination)</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="0300-1234567"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-emerald-800 font-medium block mt-1">
                  🔒 Only shared with guests who have a confirmed booking.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    City / Valley Base
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Hunza">Hunza Valley</option>
                    <option value="Skardu">Skardu / Baltistan</option>
                    <option value="Swat">Swat / Kalam</option>
                    <option value="Kumrat">Kumrat Valley</option>
                    <option value="Murree">Murree / Galyat</option>
                    <option value="Neelum">Neelum Valley (AJK)</option>
                    <option value="Gilgit">Gilgit City</option>
                    <option value="Islamabad">Islamabad / Rawalpindi</option>
                    <option value="Lahore">Lahore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Primary Service
                  </label>
                  <select
                    value={formData.listingType}
                    onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="TOUR">Guided Tours &amp; Trips</option>
                    <option value="HOTEL">Hotels &amp; Mountain Stays</option>
                    <option value="RENTAL">4x4 Jeeps &amp; Transport</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">
                  License / Registration Reference (Optional)
                </label>
                <input
                  type="text"
                  value={formData.cnicOrTaxNumber}
                  onChange={(e) => setFormData({ ...formData, cnicOrTaxNumber: e.target.value })}
                  placeholder="e.g. DTS-2024-GB-123 or SECP/NTN"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Will be shown on your profile as &ldquo;Provided by operator (not certified by platform)&rdquo;.
                </span>
              </div>

              {/* Partner Agreement Checkbox */}
              <div className="pt-2 border-t border-emerald-200/60">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500 shrink-0"
                  />
                  <span className="leading-snug text-[11px]">
                    I agree to the{" "}
                    <Link href="/terms" target="_blank" className="text-emerald-800 font-bold underline">
                      Marketplace Partner Agreement
                    </Link>{" "}
                    ({siteConfig.marketplace.commissionPercent}% platform commission on completed bookings, standard cancellation policy, direct traveler contract, and anti-circumvention rules).
                  </span>
                </label>
              </div>

              <div className="p-2.5 rounded-lg bg-white/80 border border-emerald-200 text-[10px] text-emerald-800">
                ℹ️ New partner accounts are submitted with <strong>PENDING</strong> status for team review before listings appear publicly.
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition shadow-lg shadow-emerald-700/20 disabled:opacity-50"
          >
            {loading ? "Creating your account..." : `Register as ${role === "VENDOR" ? "Partner Operator" : "Traveler"}`}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600">
          Already have an account?{" "}
          <Link href={role === "VENDOR" ? "/partner-hub/login" : "/login"} className="text-emerald-700 font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center text-xs text-slate-400">Loading register...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
