"use client";

import { useState } from "react";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Phone, 
  Mail, 
  User, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Sparkles
} from "lucide-react";
import { siteConfig } from "@/config/site";

interface Props {
  initialDestination?: string;
  title?: string;
  subtitle?: string;
}

export function CustomTripEnquiryForm({
  initialDestination = "Hunza Valley",
  title = "Plan Your Custom Northern Journey",
  subtitle = "Tell us where you want to go. Our team and local partner operators will custom-design your itinerary with direct pricing.",
}: Props) {
  const [destination, setDestination] = useState(initialDestination);
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [budgetRange, setBudgetRange] = useState("Comfort / Family (PKR 18k - 35k / day)");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!customerPhone.trim()) {
      setError("Please provide your WhatsApp or mobile number so our team can reach you.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          travelDate: travelDate || null,
          travelers: Number(travelers) || 1,
          budgetRange,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || undefined,
          specialRequests: specialRequests.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit request");
      }

      setSubmittedEnquiryId(data.enquiryId);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  }

  if (submittedEnquiryId) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
            Custom Trip Request Logged
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Thank you, {customerName}!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your journey request for <strong className="text-slate-900">{destination}</strong> has been received (Reference: <span className="font-mono text-emerald-700 font-bold">{submittedEnquiryId.slice(0, 8)}</span>). A local partner coordinator will review your itinerary details and contact you with custom options.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setSubmittedEnquiryId(null);
              setSpecialRequests("");
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Tailor-Made Pakistan Itineraries</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Destination */}
          <div className="space-y-1 text-left">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-600" /> Preferred Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Hunza Valley & Attabad">Hunza Valley & Attabad Lake</option>
              <option value="Skardu & Deosai Plains">Skardu & Deosai Plains</option>
              <option value="Swat Valley & Kalam">Swat Valley & Kalam</option>
              <option value="Kumrat Valley & Dir">Kumrat Valley & Dir</option>
              <option value="Neelum Valley (Azad Kashmir)">Neelum Valley (Azad Kashmir)</option>
              <option value="Murree & Bhurban">Murree & Bhurban</option>
              <option value="Custom Multi-Valley Expedition">Custom Multi-Valley Expedition</option>
            </select>
          </div>

          {/* Travel Date */}
          <div className="space-y-1 text-left">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-600" /> Approximate Travel Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Travelers */}
          <div className="space-y-1 text-left">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-orange-500" /> Total Travelers
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Budget Tier */}
          <div className="space-y-1 text-left">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Budget Expectation
            </label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Backpacker Budget (PKR 7.5k - 12k / day)">Backpacker Budget (PKR 7,500 - 12,000 / day)</option>
              <option value="Comfort / Family (PKR 18k - 35k / day)">Comfort / Family (PKR 18,000 - 35,000 / day)</option>
              <option value="Luxury Heritage & 4x4 (PKR 45k+ / day)">Luxury Heritage & 4x4 (PKR 45,000+ / day)</option>
              <option value="Corporate / Custom Group">Corporate / Custom Group</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Lead Name */}
          <div className="space-y-1 text-left">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-500" /> Lead Passenger *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Asad Khan"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* WhatsApp / Phone */}
          <div className="space-y-1 text-left">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp / Phone *
            </label>
            <input
              type="tel"
              required
              placeholder="0300 1234567"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-1 text-left">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-sky-600" /> Email (Optional)
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Special Requests */}
        <div className="space-y-1 text-left pt-1">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Special Requests / Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Need private 4x4 Prado with English-speaking driver, lakefront hotel in Attabad, or honeymoon room decor..."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-sky-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Custom Journey Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
