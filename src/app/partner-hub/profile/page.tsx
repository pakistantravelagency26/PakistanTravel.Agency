"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Phone, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Lock
} from "lucide-react";

export default function VendorProfilePage() {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cnicOrTaxNumber, setCnicOrTaxNumber] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/partner/profile");
        const data = await res.json();
        if (data.success && data.profile) {
          setBusinessName(data.profile.businessName || "");
          setCity(data.profile.city || "");
          setPhone(data.profile.phone || "");
          setWhatsapp(data.profile.whatsapp || "");
          setCnicOrTaxNumber(data.profile.cnicOrTaxNumber || "");
          setAddress(data.profile.address || "");
        }
      } catch (err) {
        console.error("Failed to load partner profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanWa = whatsapp.replace(/[\s\-()]/g, "");
    if (!cleanWa || !/^(\+92|0|92)?3\d{9}$/.test(cleanWa)) {
      setFeedback({
        type: "error",
        message: "Please enter a valid Pakistani WhatsApp number (e.g. 03001234567 or +92 300 1234567).",
      });
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/partner/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          city,
          phone,
          whatsapp,
          cnicOrTaxNumber,
          address,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile");
      }

      setFeedback({
        type: "success",
        message: "Profile updated successfully. Your WhatsApp number is safely stored.",
      });
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to update profile",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Loading Partner Profile settings...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-emerald-600" />
          Partner Profile &amp; Host Contact Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your operator details, on-ground location, and guest coordination numbers
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2.5 text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
              : "bg-red-50 border border-red-200 text-red-900"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
        {/* Anti-Leakage Notice Box */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-950">
          <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-emerald-900">
              Anti-Leakage Protection Policy:
            </span>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              This WhatsApp number is <strong>only shared with guests who have a confirmed booking</strong> (deposit or full payment verified). To prevent marketplace bypass and protect your business, public listing pages and pre-booking inquiries will never expose your direct phone or WhatsApp.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Company / Operator Name
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Displayed on listing profiles and vouchers.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              City / Operational Base
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Karimabad (Hunza), Skardu, Islamabad"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Primary Phone (Office / Desk)</span>
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0300-1234567"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Host WhatsApp Number *</span>
            </label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="0300-1234567 or +923001234567"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
              🔒 Pakistani format (03XX XXXXXXX). Only shared with guests who have a confirmed booking.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>License / Registration Reference</span>
            </label>
            <input
              type="text"
              value={cnicOrTaxNumber}
              onChange={(e) => setCnicOrTaxNumber(e.target.value)}
              placeholder="e.g. DTS-2024-GB-99"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Displayed as &ldquo;Provided by operator (not certified by platform)&rdquo;.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Local Office Address</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street or Bazar Address"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Profile Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
