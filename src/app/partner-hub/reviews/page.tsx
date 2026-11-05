"use client";

import { useState } from "react";
import { Star, MessageSquare, CheckCircle2, CornerDownRight } from "lucide-react";

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: "rev-1",
      guest: "Kamran Shah",
      city: "Lahore, Pakistan",
      rating: 5,
      date: "October 2026",
      stay: "Deluxe Mountain View Room (3 Nights)",
      comment: "Unbelievable view of Rakaposhi right from the bedroom terrace! Staff was extraordinarily courteous and food in Osho Maraka restaurant was top tier.",
      reply: "Thank you Kamran! It was an absolute delight hosting you during the autumn blossom season. We look forward to welcoming you back next summer.",
      isReplying: false,
    },
    {
      id: "rev-2",
      guest: "Ayesha Malik",
      city: "Karachi, Pakistan",
      rating: 5,
      date: "September 2026",
      stay: "Executive Heritage Suite (2 Nights)",
      comment: "24/7 electricity and room heaters worked flawlessly even when outside temperature dropped below zero. Best luxury stay in Gilgit-Baltistan.",
      reply: "",
      isReplying: false,
    },
  ]);

  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  function handleSaveReply(id: string) {
    if (!replyText.trim()) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: replyText } : r))
    );
    setReplyText("");
    setActiveReplyId(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Guest Reviews & Feedback</h1>
        <p className="text-xs text-slate-500 mt-1">
          Respond directly to verified travelers who booked through PakistanTravel.agency
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-bold text-sm text-slate-900 block">{rev.guest}</span>
                <span className="text-xs text-slate-400">
                  {rev.city} · Stayed in {rev.stay} · {rev.date}
                </span>
              </div>

              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-700 italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              &ldquo;{rev.comment}&rdquo;
            </p>

            {/* Existing reply or reply form */}
            {rev.reply ? (
              <div className="pl-4 border-l-2 border-brand-emerald bg-emerald-50/30 p-3 rounded-r-xl space-y-1 text-xs">
                <span className="font-bold text-brand-emerald flex items-center gap-1.5">
                  <CornerDownRight className="w-3.5 h-3.5" /> Your Official Partner Reply:
                </span>
                <p className="text-slate-700">{rev.reply}</p>
              </div>
            ) : activeReplyId === rev.id ? (
              <div className="space-y-2 pt-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a polite, welcoming reply to this guest..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveReply(rev.id)}
                    className="px-4 py-1.5 rounded-lg bg-brand-emerald text-white text-xs font-bold"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveReplyId(rev.id);
                  setReplyText("");
                }}
                className="text-xs font-bold text-brand-emerald hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Respond to this Review
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
