import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, ArrowLeft, Headphones, Clock, Phone, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { getSiteSettings } from "@/services/siteSettings.service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact Us | Pakistan Travel Agency Support Desk",
  description: "Contact PakistanTravel.Agency customer support for tour inquiries, hotel reservations, road condition updates, and custom northern packages.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Pakistan Travel Agency Support Desk",
    description: "Contact PakistanTravel.Agency customer support for tour inquiries, hotel reservations, road condition updates, and custom northern packages.",
    url: "/contact",
  },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const general = settings.GENERAL;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Support &amp; Inquiries</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Contact Customer Desk</h1>
          <p className="text-xs text-slate-500 mt-1">Our support desk is active to assist with tour reservations, route conditions, and custom itineraries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Direct channels */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Direct Contact Channels</h2>

            <div className="space-y-3 text-xs text-slate-600">
              <a
                href={`https://wa.me/${general.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20PakistanTravel.Agency%2C%20I%20have%20an%20inquiry%20regarding%20a%20tour`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-200 font-bold hover:bg-emerald-100 transition"
              >
                <MessageSquare className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <span className="block text-sm">WhatsApp Live Chat</span>
                  <span className="text-[11px] font-normal text-emerald-800">{general.whatsappNumber} · Instant Response</span>
                </div>
              </a>

              <a
                href={`tel:${general.phonePrimary.replace(/[^0-9+]/g, "")}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-sky-50 text-sky-950 border border-sky-200 font-bold hover:bg-sky-100 transition"
              >
                <Phone className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <span className="block text-sm">Call Support</span>
                  <span className="text-[11px] font-normal text-sky-800">{general.phonePrimary} ({general.workingHours || "Mon - Sat, 9am - 8pm PKT"})</span>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Email Inquiries</span>
                  <span className="text-slate-500">{general.supportEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Headquarters (Pakistan)</span>
                  <span className="text-slate-500 block">{general.address}</span>
                  <span className="text-[10px] text-slate-400">{general.dtsLicense}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Send an Online Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
