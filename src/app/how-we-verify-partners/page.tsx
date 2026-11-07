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

export default function HowWeVerifyPartnersPage() {
  const steps = [
    {
      step: "01",
      icon: FileCheck2,
      title: "Government Registration & DTS Licensing",
      desc: "Every operator must provide valid registration with the Department of Tourist Services (DTS) Pakistan or SECP corporate registration. We verify business NTNs and licensing credentials before onboarding."
    },
    {
      step: "02",
      icon: Building2,
      title: "Established Regional Operating Base",
      desc: "Partners must operate an established physical office or recognized hospitality base in northern hubs (Gilgit, Skardu, Karimabad, Swat, or Islamabad), ensuring local accountability."
    },
    {
      step: "03",
      icon: Car,
      title: "Vehicle Roadworthiness & Driver Safety",
      desc: "For guided expeditions and 4x4 mountain tracks, vehicles must pass annual mechanical fitness checks, and drivers must possess certified hill-driving experience across the Karakoram and Hindu Kush ranges."
    },
    {
      step: "04",
      icon: CreditCard,
      title: "Escrow Deposit & Transparent Payouts",
      desc: "Customer deposits are held securely through our platform. Operator payouts are released on an agreed schedule, ensuring travelers receive promised services or timely refunds if issues arise."
    },
    {
      step: "05",
      icon: Star,
      title: "Continuous Review & Performance Auditing",
      desc: "We strictly gate reviews to travelers with completed bookings. Operators that fail to maintain minimum customer satisfaction standards or violate safety protocols are removed from the marketplace."
    }
  ];

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
            How We Verify Travel Partners
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Our multi-step verification process ensures that every tour operator and mountain hotel listed on PakistanTravel.Agency holds authentic licensing, regional experience, and customer safety compliance.
          </p>
        </div>

        {/* 5-Step Process Cards */}
        <div className="space-y-6">
          {steps.map((s) => {
            const Icon = s.icon;
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
