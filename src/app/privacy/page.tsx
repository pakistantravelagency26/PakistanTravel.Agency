import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getSiteSettings } from "@/services/siteSettings.service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Privacy Policy & Data Security | Pakistan Travel Agency",
  description: "Learn how PakistanTravel.Agency collects, encrypts, and protects your personal information and transaction details when booking tours in Pakistan.",
  alternates: {
    canonical: "/privacy",
  },
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const privacy = settings.PAGE_PRIVACY;
  const general = settings.GENERAL;

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Privacy & Data Security</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Official Platform Compliance · {general.siteName}</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>1. Traveler Data Privacy & Identity Statement</span>
            </h2>
            <p>{privacy.privacyStatement}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>2. Payment & Banking Gateway Security</span>
            </h2>
            <p>{privacy.paymentSecurity}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3. Contact & Profile Protection</span>
            </h2>
            <p>{privacy.contactProtection}</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-4 space-y-1.5 text-xs">
            <p><strong>Official Entity:</strong> {general.siteName}</p>
            <p><strong>Head Office:</strong> {general.address}</p>
            <p><strong>DTS License:</strong> {general.dtsLicense}</p>
            <p><strong>Privacy Helpline:</strong> {general.phoneHelpline}</p>
            <p><strong>Official Contact:</strong> {general.supportEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
