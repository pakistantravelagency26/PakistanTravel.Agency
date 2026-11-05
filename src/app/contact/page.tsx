"use client";

import Link from "next/link";
import { Mail, MapPin, ArrowLeft, Headphones, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Support & Inquiries</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Contact Customer Desk</h1>
          <p className="text-xs text-slate-500 mt-1">Our on-ground coordinators are active 24/7 to assist with your bookings and travel plans.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Direct channels */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Direct Contact Channels</h2>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-sky-50 text-sky-900 border border-sky-100 font-bold">
                <Headphones className="w-6 h-6 text-sky-600 shrink-0" />
                <div>
                  <span className="block text-sm">24/7 Online Support</span>
                  <span className="text-[11px] font-normal text-sky-700">Instant assistance for travelers and bookings</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Email Inquiries</span>
                  <span className="text-slate-500">pakistantravel.agency26@gmail.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <Clock className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Operating Hours</span>
                  <span className="text-slate-500">Monday – Sunday · 24 Hours Active</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Headquarters</span>
                  <span className="text-slate-500">Floor 4, Evacuee Trust Complex, Blue Area, Islamabad</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Send an Online Message</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert("Message sent! Our support team will respond to your email shortly."); }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Malik"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ask about customized tour packages, road conditions, or private Prado rentals..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md shadow-orange-500/20"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


