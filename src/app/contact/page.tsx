"use client";

import { MessageCircle, PhoneCall, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Customer Care</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Get in Touch with Our Team</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Our trip coordinators and mountain safety advisors are available round-the-clock for bookings, inquiries, and road status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Direct Contact Channels</h2>

            <div className="space-y-4 text-xs text-slate-600">
              <a
                href="https://wa.me/923222327096"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-100 hover:bg-emerald-100 transition font-bold"
              >
                <MessageCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <span className="block text-sm">24/7 WhatsApp Helpdesk</span>
                  <span className="text-[11px] font-normal text-emerald-700">+92 322 2327096 (Instant reply)</span>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <PhoneCall className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Official Helpline & Call Support</span>
                  <span className="text-slate-500">+92 322 2327096</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Email Inquiries</span>
                  <span className="text-slate-500">paksitantravel.agency@gmail.com</span>
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
            <form onSubmit={(e) => { e.preventDefault(); alert("Message sent! Our support coordinator will WhatsApp you shortly."); }} className="space-y-3 text-xs">
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
                <label className="block font-bold text-slate-700 uppercase mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="03001234567"
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
