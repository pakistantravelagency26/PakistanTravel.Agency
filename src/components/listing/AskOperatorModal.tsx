"use client";

import { useState } from "react";
import { MessageSquare, X, CheckCircle2, ShieldCheck, AlertTriangle, Send, Lock } from "lucide-react";
import { containsContactLeakage } from "@/lib/antiLeakage";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  vendorId: string;
  operatorName: string;
}

export function AskOperatorModal({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  vendorId,
  operatorName,
}: Props) {
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const hasLeakage = containsContactLeakage(message);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (hasLeakage) {
      setError("Direct phone numbers, WhatsApp, and emails cannot be shared before booking. Please ask your questions directly.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/vendor/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          listingTitle,
          vendorId,
          senderName,
          senderEmail,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to deliver message to operator.");
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage("");
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || "An error occurred while sending message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-operator-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Direct Operator Inquiry
            </span>
            <h2 id="ask-operator-title" className="text-xl font-extrabold text-slate-900 mt-1">
              Ask the Operator
            </h2>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              Host: <strong className="text-slate-800">{operatorName}</strong> · {listingTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Message Relayed to Operator!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your inquiry has been relayed to <strong>{operatorName}</strong>. They will reply to{" "}
              <strong>{senderEmail}</strong> shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Commission Protection Policy:</strong> Direct phone &amp; WhatsApp numbers are released
                automatically upon booking confirmation. In-platform messages must not include personal contact numbers or emails.
              </span>
            </div>

            {error && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Ali Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Email (for response) *</label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="e.g. traveler@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Question or Special Request *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about itinerary pace, vehicle type (4x4 vs van), hotel amenities, meal options, or custom dates..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 ${
                  hasLeakage
                    ? "border-red-400 focus:ring-red-400 bg-red-50/30"
                    : "border-slate-200 focus:ring-emerald-500"
                }`}
              />
              {hasLeakage && (
                <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Phone numbers, WhatsApp links, and emails cannot be shared before booking.</span>
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || hasLeakage}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-700/20"
              >
                {submitting ? (
                  <span>Sending inquiry...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Operator</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
