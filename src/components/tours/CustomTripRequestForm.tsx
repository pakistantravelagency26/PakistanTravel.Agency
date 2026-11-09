"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Compass, Users, Calendar, MapPin, Mail, Phone, User } from "lucide-react";

export function CustomTripRequestForm() {
  const [formData, setFormData] = useState({
    destination: "Hunza Valley",
    travelDate: "",
    travelers: 2,
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    specialRequests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: formData.destination,
          travelDate: formData.travelDate || null,
          travelers: Number(formData.travelers) || 1,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail || undefined,
          specialRequests: formData.specialRequests || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit trip request. Please try again.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-10 text-center space-y-3 max-w-2xl mx-auto">
        <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-extrabold text-emerald-950">Custom Trip Request Received</h3>
        <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
          Thank you! Local tour operators managing trips to {formData.destination} will review your request and reach out with itinerary options.
        </p>
        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setFormData({
              destination: "Hunza Valley",
              travelDate: "",
              travelers: 2,
              customerName: "",
              customerPhone: "",
              customerEmail: "",
              specialRequests: "",
            });
          }}
          className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Tailored Itineraries</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Request a Custom Northern Tour Package
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          Cannot find exact dates? Send your travel preferences directly to independent local operators across Gilgit-Baltistan and Khyber Pakhtunkhwa.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Destination
            </label>
            <select
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              required
            >
              <option value="Hunza Valley">Hunza Valley & Attabad</option>
              <option value="Skardu & Deosai">Skardu & Deosai Plains</option>
              <option value="Swat & Kalam">Swat Valley & Kalam</option>
              <option value="Kumrat Valley">Kumrat Valley & Dir</option>
              <option value="Neelum Valley">Neelum Valley (AJK)</option>
              <option value="Murree & Galyat">Murree & Galyat</option>
              <option value="Multi-Region Expedition">Multi-Region Expedition</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Target Date
            </label>
            <input
              type="date"
              value={formData.travelDate}
              onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
              className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Travelers
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.travelers}
              onChange={(e) => setFormData({ ...formData, travelers: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Your Full Name
            </label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={100}
              placeholder="e.g. Tariq Khan"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Phone / WhatsApp
            </label>
            <input
              type="tel"
              required
              minLength={8}
              maxLength={30}
              placeholder="e.g. 0300 1234567"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email (Optional)
            </label>
            <input
              type="email"
              placeholder="e.g. tariq@example.pk"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
            Special Requirements / Notes
          </label>
          <textarea
            rows={3}
            maxLength={600}
            placeholder="Tell operators if you require private 4x4 transport, family rooms, trekking gear, or specific pickup from Islamabad/Lahore..."
            value={formData.specialRequests}
            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? "Submitting Request..." : "Send Request to Local Tour Operators"}</span>
        </button>
      </form>
    </div>
  );
}
