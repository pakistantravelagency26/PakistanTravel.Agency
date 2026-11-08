import type { Metadata } from "next";
import Link from "next/link";
import { 
  Building2, 
  Compass, 
  CreditCard, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Banknote, 
  MessageCircle,
  HelpCircle,
  Lock
} from "lucide-react";
import { siteConfig , SITE_URL } from "@/config/site";

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "List Your Tour or Hotel | Partner Onboarding",
  description:
    "Partner with PakistanTravel.Agency to reach domestic and overseas Pakistani travelers. Automated check-in vouchers, JazzCash/card payments, and transparent commission.",
  alternates: {
    canonical: `${siteUrl}/list-your-tour`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/list-your-tour`,
    siteName: siteConfig.name,
    title: "List Your Tour or Hotel | Partner Onboarding",
    description:
      "Partner with PakistanTravel.Agency to reach domestic and overseas Pakistani travelers. Automated check-in vouchers, JazzCash/card payments, and transparent commission.",
  },
};

export default function ListYourTourPage() {
  const commissionRate = siteConfig.marketplace.defaultCommissionRate || 10;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Building2 className="w-4 h-4" />
            <span>For Northern Tour Operators &amp; Hotel Owners</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
            Grow Your Bookings with Domestic &amp; Overseas Pakistani Travelers
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            List your northern Pakistan tours, family-run hotels, or 4x4 mountain rentals on Pakistan&apos;s dedicated multi-vendor marketplace. Zero monthly software fees—you only pay a simple {commissionRate}% commission on completed bookings.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/register?role=VENDOR"
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm transition shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2"
            >
              <span>Register as a Partner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/partner-hub/login"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition border border-white/20 text-center"
            >
              Partner Extranet Login
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Upfront Fee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Traveler Vouchers
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pakistani Commercial Bank Payouts
            </span>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Why Partner With Us</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Everything You Need to Run Digital Bookings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Focus on delivering memorable mountain journeys while our technology handles guest inquiries, payments, and confirmations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Reach Nationwide Travelers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect directly with families and corporate groups from Karachi, Lahore, and Islamabad, as well as overseas Pakistanis planning summer vacations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Pakistani Payment Collection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accept JazzCash, EasyPaisa, Direct Bank Transfer, and Credit/Debit cards with zero merchant account setup needed on your end.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Automated PDF Vouchers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Guests receive branded check-in vouchers with verified CNIC details immediately upon confirmed payment, eliminating manual paperwork.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Extranet Rate &amp; Date Control</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Manage your departures, seasonal price spikes, twin-sharing supplements, and seat inventories directly from your Partner Extranet.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Simple Process</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How Partner Onboarding Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              From registration to receiving your first booking in 4 clear steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Create Partner Account</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register your business profile, operating city, contact person, and WhatsApp coordination number.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Publish Your Listings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add your tour packages or hotel rooms with high-resolution photos, seasonal dates, and direct operator rates.
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
                Funds are disbursed directly to your Pakistani commercial bank account following departure check-in.
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
                No monthly subscription, no setup costs, no hidden software fees. You only pay a flat {commissionRate}% commission on successfully fulfilled bookings.
              </p>
            </div>

            <div className="space-y-2.5 border-t border-emerald-800/60 pt-4 text-xs text-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero registration fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero fees if a customer cancels within free refund window</span>
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
                Partner Eligibility Requirements
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                To maintain traveler confidence and safety standards across northern Pakistan:
              </p>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Must be an actively operating tour company, registered guide, or hotel/resort in Pakistan.</span>
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
              Start Partner Application
            </Link>
          </div>
        </div>
      </section>

      {/* Partner FAQs */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Frequently Asked</span>
            <h2 className="text-2xl font-extrabold text-slate-900">Partner Questions &amp; Answers</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                When do I receive the traveler&apos;s direct contact details?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                To prevent marketplace bypass and protect both parties, direct phone and WhatsApp numbers are exchanged only once the traveler completes a confirmed reservation and verified payment deposit.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                How are partner earnings disbursed?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                Disbursements are processed directly to your registered Pakistani commercial bank account within 48 hours of successful tour departure or guest check-in.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                What if a tour is delayed due to weather or road closures?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                Northern mountain logistics (Babusar Pass, Karakoram Highway, Skardu road) are subject to weather conditions. Under our Marketplace Terms, force majeure road clearances allow operators to reschedule departures or offer alternative valley itineraries without penalties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-slate-900 text-white py-14 px-4 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-black">
          Ready to List Your Tour Packages or Mountain Resort?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Join independent local hosts across Gilgit-Baltistan and Khyber Pakhtunkhwa.
        </p>
        <div className="pt-2">
          <Link
            href="/register?role=VENDOR"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition shadow-lg"
          >
            <span>Register as a Partner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
