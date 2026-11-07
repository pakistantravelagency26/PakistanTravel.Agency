"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
        <h3 className="font-extrabold text-slate-900 text-sm">Message Sent Successfully</h3>
        <p className="text-xs text-slate-600">
          Our Islamabad coordination desk has received your inquiry and will email you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-xs">
      <div>
        <label htmlFor="contact-name" className="block font-bold text-slate-700 uppercase mb-1">Your Name</label>
        <input
          id="contact-name"
          type="text"
          required
          placeholder="e.g. Asad Malik"
          className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block font-bold text-slate-700 uppercase mb-1">Your Email</label>
        <input
          id="contact-email"
          type="email"
          required
          placeholder="name@example.com"
          className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block font-bold text-slate-700 uppercase mb-1">Message</label>
        <textarea
          id="contact-message"
          rows={4}
          required
          placeholder="Ask about customized tour packages, road conditions, or private Prado rentals..."
          className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Send Inquiry</span>
      </button>
    </form>
  );
}
