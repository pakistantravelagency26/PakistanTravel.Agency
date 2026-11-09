import type { Metadata } from "next";
import Link from "next/link";
import { 
  Compass, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight,
  TrendingUp,
  Percent,
  Calendar,
  Lock
} from "lucide-react";
import { siteConfig, SITE_URL } from "@/config/site";

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "List Your Tour Packages",
  description:
    "List your guided tour packages on PakistanTravel to reach travelers across Pakistan. Enjoy digital booking vouchers, local payments, and low commission.",
  alternates: {
    canonical: `${siteUrl}/list-your-tour`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/list-your-tour`,
    siteName: "PakistanTravel",
    title: "List Your Tour Packages",
    description:
      "List your guided tour packages on PakistanTravel to reach travelers across Pakistan. Enjoy digital booking vouchers, local payments, and low commission.",
  },
};

export default function ListYourTourPage() {
  const commissionRate = siteConfig.marketplace.commissionPercent;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Compass className="w-4 h-4" />
            <span>For Independent Northern Tour Operators</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
            Grow Your Tour Bookings with Domestic &amp; Overseas Pakistani Travelers
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            List your northern Pakistan guided tour packages and trekking expeditions on Pakistan&apos;s dedicated tour marketplace. Zero monthly software fees—you only pay a simple {commissionRate}% platform commission on completed bookings. Travelers pay zero booking fees.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/register?role=VENDOR"
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm transition shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2"
            >
              <span>Register as a Tour Operator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/partner-hub/login"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition border border-white/20 text-center"
            >
              Operator Portal Login
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Upfront Fee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Direct Bank Payouts
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full Price Control
            </span>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Operator Advantages
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why List Your Tours on PakistanTravel.Agency?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A technology platform built specifically for local northern Pakistan tour operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Reach Active Travelers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect directly with families, corporate groups, and overseas Pakistanis looking for authentic northern journeys.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Direct WhatsApp Inquiries</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confirmed guests receive your official tour voucher with your direct phone and WhatsApp for seamless itinerary coordination.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Dependable Bank Payouts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {siteConfig.marketplace.payoutTiming} disbursements directly into your commercial Pakistani bank account (IBAN) with clear receipts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Fair {commissionRate}% Commission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No hidden listing fees or subscriptions. We succeed only when your departures fill up.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Flexible Departure Control</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Easily update departure dates, seat counts, pricing, and itinerary inclusions anytime from your mobile or desktop portal.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Clear Cancellation Terms</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standardized refund rules protect your committed transport allocations from last-minute cancellations.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How Partnering Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Create Operator Account</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register your business profile, operating city, contact person, and WhatsApp coordination number.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Publish Your Tour Packages</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add your guided tour packages with high-resolution photos, fixed departure dates, seat counts, and direct operator rates.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Receive Bookings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Travelers book and pay deposits through the marketplace. Your WhatsApp details are shared on confirmed guest vouchers.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">Receive Payouts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Funds are disbursed directly to your Pakistani commercial bank account following tour departure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commission & Requirements Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Commission Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Transparent Fee Structure
              </span>
              <h3 className="text-3xl font-black mt-2">
                {commissionRate}% <span className="text-lg font-medium text-emerald-200">Commission</span>
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                No monthly subscription, no setup costs, no hidden software fees. You only pay a flat {commissionRate}% commission deducted from fulfilled bookings. Travelers pay zero booking fees.
              </p>
            </div>

            <div className="space-y-2.5 border-t border-emerald-800/60 pt-4 text-xs text-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero registration fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero traveler booking fees—travelers pay your listing price</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Disbursements {siteConfig.marketplace.payoutTiming}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct operator pricing control—you choose the rates</span>
              </div>
            </div>
          </div>

          {/* Partner Requirements Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quality Standards
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Operator Eligibility Requirements
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                To maintain traveler confidence and safety standards across northern Pakistan:
              </p>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Must be an actively operating tour company, expedition organizer, or registered mountain guide in Pakistan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Must provide valid CNIC or NTN for account verification.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Optional DTS or provincial license reference (displayed on your profile as operator-provided).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Must adhere to the platform cancellation and refund policy (100% 7+ days, 50% 3-6 days).</span>
              </li>
            </ul>

            <Link
              href="/register?role=VENDOR"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition text-center shadow-sm"
            >
              Start Operator Application
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Verification Disclaimer Banner */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs text-slate-500 text-center space-y-2">
          <p className="font-semibold text-slate-700">Platform Transparency Notice</p>
          <p className="leading-relaxed">
            PakistanTravel.Agency is an online technology intermediary and marketplace. All guided tours, transport, and itineraries are executed by independent third-party operators. While we verify operator contact information, the platform does not inspect or certify physical facilities or vehicles.
          </p>
        </div>
      </section>
    </div>
  );
}
