"use client";

import { useState } from "react";
import { Star, X, CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";
import { containsContactLeakage } from "@/lib/antiLeakage";

interface Props {
  listingId?: string;
  listingTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (review: any) => void;
}

export function WriteReviewModal({ listingId, listingTitle, isOpen, onClose, onSubmitSuccess }: Props) {
  const [overallRating, setOverallRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [staff, setStaff] = useState(5);
  const [location, setLocation] = useState(5);
  const [comment, setComment] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (containsContactLeakage(comment)) {
      setError("Direct contact details (phone numbers, WhatsApp, emails) are not permitted in reviews. Please remove them to submit.");
      return;
    }

    setSubmitting(true);

    try {
      if (listingId) {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listingId,
            rating: overallRating,
            comment,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to submit review");
        }

        setSubmitted(true);
        setTimeout(() => {
          onSubmitSuccess(data.review);
          onClose();
        }, 1200);
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        onSubmitSuccess({
          id: `rev-${Date.now()}`,
          userName: "Verified Traveler",
          userCity: "Pakistan",
          rating: overallRating,
          date: "Just now",
          comment,
        });
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to submit review");
      setSubmitting(false);
    }
  }

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="review-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Guest Review
            </span>
            <h2 id="review-modal-title" className="text-xl font-bold text-slate-900 mt-0.5">Rate your experience</h2>
            <p className="text-xs text-slate-500">{listingTitle}</p>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close review dialog" 
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2 text-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-slate-900">Thank you for your review!</h3>
            <p className="text-slate-500">Your feedback helps future travelers across Pakistan.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Overall Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Overall Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setOverallRating(star)}
                    aria-label={`Rate ${star} out of 5 stars`}
                    className="p-1 text-amber-400 hover:scale-110 transition"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= overallRating ? "fill-amber-400" : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-slate-700 ml-2">
                  {overallRating === 5 ? "Exceptional" : overallRating === 4 ? "Very Good" : "Good"}
                </span>
              </div>
            </div>

            {/* Sub-ratings */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block mb-1 font-medium">Cleanliness</span>
                <select
                  value={cleanliness}
                  onChange={(e) => setCleanliness(Number(e.target.value))}
                  className="w-full p-1.5 rounded border border-slate-300 font-bold bg-white"
                >
                  <option value={5}>5 ★</option>
                  <option value={4}>4 ★</option>
                  <option value={3}>3 ★</option>
                </select>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 font-medium">Staff Service</span>
                <select
                  value={staff}
                  onChange={(e) => setStaff(Number(e.target.value))}
                  className="w-full p-1.5 rounded border border-slate-300 font-bold bg-white"
                >
                  <option value={5}>5 ★</option>
                  <option value={4}>4 ★</option>
                  <option value={3}>3 ★</option>
                </select>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 font-medium">Location</span>
                <select
                  value={location}
                  onChange={(e) => setLocation(Number(e.target.value))}
                  className="w-full p-1.5 rounded border border-slate-300 font-bold bg-white"
                >
                  <option value={5}>5 ★</option>
                  <option value={4}>4 ★</option>
                  <option value={3}>3 ★</option>
                </select>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Your Review
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your stay experience, room heating, power backup, or views..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-brand-emerald hover:bg-brand-emeraldDark disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow flex items-center justify-center gap-1.5"
            >
              <span>{submitting ? "Submitting..." : "Post Review"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
