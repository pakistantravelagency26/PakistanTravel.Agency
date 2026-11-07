import type { Metadata } from "next";
import Link from "next/link";
import { 
  ShieldCheck, 
  FileCheck2, 
  Car, 
  CreditCard, 
  Star, 
  CheckCircle2, 
  ArrowLeft,
  Building2,
  Compass
} from "lucide-react";
import { getSiteSettings, type PageVerificationSettings } from "@/services/siteSettings.service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "How We Verify Travel Partners | Pakistan Travel Agency",
  description: "Learn how PakistanTravel.Agency verifies northern tour operators and hotels through DTS licensing, vehicle checks, and quality compliance standards.",
  alternates: {
    canonical: "/how-we-verify-partners",
  },
  openGraph: {
    title: "How We Verify Travel Partners | Pakistan Travel Agency",
    description: "Learn how PakistanTravel.Agency verifies northern tour operators and hotels through DTS licensing, vehicle checks, and quality compliance standards.",
    url: "/how-we-verify-partners",
  },
};

export default async function HowWeVerifyPartnersPage() {
  const verification: PageVerificationSettings = await getSiteSettings("PAGE_VERIFICATION");
  const stepIcons = [FileCheck2, Building2, Car, CreditCard, Star, ShieldCheck];

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
            Quality &amp; Trust Standards
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-1">
            {verification.heading}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            {verification.subheading}
          </p>
        </div>

        {/* Dynamic Verification Process Cards */}
        <div className="space-y-6">
          {verification.steps.map((s, idx) => {
            const Icon = stepIcons[idx % stepIcons.length] || ShieldCheck;
            return (
              <div key={s.step} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-sky-600">STEP {s.step}</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900">{s.title}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* License transparency notice */}
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-3 text-xs sm:text-sm text-amber-950">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <span>Operator License Transparency</span>
          </div>
          <p className="leading-relaxed">
            Every vendor profile and tour listing on our platform explicitly publishes the operator&apos;s Department of Tourist Services (DTS) license number or SECP registration. Travelers are encouraged to verify these credentials directly with local provincial tourist authorities prior to undertaking high-altitude expeditions.
          </p>
        </div>

        {/* Navigation Actions */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap gap-4 items-center justify-between text-xs">
          <Link href="/about" className="text-sky-600 font-bold hover:underline">
            ← Read About Our Mission
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition"
          >
            Explore Verified Northern Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
