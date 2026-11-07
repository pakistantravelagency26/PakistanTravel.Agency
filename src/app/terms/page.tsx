import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { getSiteSettings } from "@/services/siteSettings.service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms of Service & Booking Policy | Pakistan Travel Agency",
  description: "Read the terms of service, payment policies, cancellation guidelines, and traveler guarantees for booking trips with PakistanTravel.Agency.",
  alternates: {
    canonical: "/terms",
  },
};

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const terms = settings.PAGE_TERMS;
  const general = settings.GENERAL;

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Legal Agreement</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Terms of Service & Booking Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Official Platform Policy · {general.siteName}</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Booking & Voucher Confirmation Policy</span>
            </h2>
            <p>{terms.bookingPolicy}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>2. Cancellation & Refund Regulations</span>
            </h2>
            <p>{terms.cancellationPolicy}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3. Northern Travel Identity & Safety Guidelines</span>
            </h2>
            <p>{terms.safetyGuidelines}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>4. Operator Liability & DTS Compliance Standards</span>
            </h2>
            <p>{terms.liabilityNotice}</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-4 space-y-1.5 text-xs">
            <p><strong>Official Entity:</strong> {general.siteName}</p>
            <p><strong>DTS License:</strong> {general.dtsLicense}</p>
            <p><strong>Head Office:</strong> {general.address}</p>
            <p><strong>Customer Helpline:</strong> {general.phoneHelpline}</p>
            <p><strong>Support Email:</strong> {general.supportEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
