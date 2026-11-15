import { SITE_URL, siteConfig } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  Compass, 
  Search, 
  Users, 
  CreditCard, 
  FileCheck, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  HelpCircle,
  ArrowRight
} from "lucide-react";

export const revalidate = 3600;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "How Booking Works",
  description:
    "Learn how tour booking works on PakistanTravel: browse independent operator packages, select room tiers, pay a 25% deposit, and get instant digital vouchers.",
  alternates: {
    canonical: `${siteUrl}/how-booking-works`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/how-booking-works`,
    siteName: "PakistanTravel",
    title: "How Booking Works | PakistanTravel",
    description:
      "Learn how tour booking works on PakistanTravel: browse independent operator packages, select room tiers, pay a 25% deposit, and get instant digital vouchers.",
    images: [
      {
        url: `${siteUrl}/images/og/home-og.jpg`,
        width: 1200,
        height: 630,
        alt: "How Booking Works on PakistanTravel Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Booking Works | PakistanTravel",
    description:
      "Learn how tour booking works on PakistanTravel: browse independent operator packages, select room tiers, pay a 25% deposit, and get instant digital vouchers.",
    images: [`${siteUrl}/images/og/home-og.jpg`],
  },
};

export default function HowBookingWorksPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "How Booking Works",
        item: `${siteUrl}/how-booking-works`,
      },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Book a Tour on PakistanTravel",
    description: "Step-by-step guide to reserving guided tour packages across northern Pakistan with independent local tour operators.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Select Your Mountain Destination & Itinerary",
        text: "Browse published tour packages across Hunza, Skardu, Swat, Kumrat, Neelum, and Fairy Meadows. Compare day-by-day schedules, vehicle types, and inclusions."
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose Your Room Category & Travelers",
        text: "Select between Sharing Room, Private Room, or Solo Room tiers. The booking widget calculates exact per-person rates and applicable group discounts."
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Confirm with a 25% Advance Deposit",
        text: "Pay only a 25% deposit to lock in your seat. Funds are held in escrow by the platform until tour departure."
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Receive Your Digital Tour Voucher",
        text: "Instantly download your confirmed tour voucher with meeting points, operator contacts, hotel tiers, and packing advice."
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Depart & Pay Balance Directly to Operator",
        text: "Meet at the departure terminal in Islamabad or regional hub. Pay the remaining 75% balance directly to your operator upon departure."
      }
    ]
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 pt-12 pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-slate-700 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-semibold">How Booking Works</span>
          </nav>

          <span className="inline-block bg-sky-50 text-sky-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            Clear &amp; Transparent Process
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            How Booking Works on PakistanTravel
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            A simple, five-step reservation system connecting you directly with independent local tour operators. Pay a 25% deposit to lock your seats; settle the remainder on departure day.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 space-y-12">
        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-extrabold text-lg shrink-0">
              1
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Explore &amp; Compare Guided Expeditions</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Browse independent tour listings across northern destinations including Hunza, Skardu, Swat, Kumrat, and Neelum Valley. Each tour package displays real operator details, full day-by-day itineraries, exact pickup points, transit routes, and genuine photo galleries.
              </p>
              <div className="pt-1">
                <Link href="/tours" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700">
                  Browse live expeditions <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-extrabold text-lg shrink-0">
              2
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Select Room Tiers &amp; Group Size</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every tour package offers clear accommodation tiers: <strong>Sharing Room</strong> (standard 3–4 persons per room), <strong>Private Room</strong> (dedicated room for couples or pairs), or <strong>Solo Room</strong> (single occupancy). Our dynamic pricing calculator automatically tallies the per-traveler rate and applies verified group discounts without hidden fees.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-extrabold text-lg shrink-0">
              3
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Lock Your Seats with a 25% Advance Deposit</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                You only pay a 25% confirmation deposit at the time of reservation. Deposits are payable securely via direct bank transfer (IBAN), JazzCash, or online payment options. Platform escrow safeguards traveler deposits until tour departure, ensuring operator accountability.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-extrabold text-lg shrink-0">
              4
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Receive Your Confirmed Digital Tour Voucher</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Once payment is verified, your official digital tour voucher is generated instantly. The voucher contains your unique booking reference ID, direct operator contact phone numbers, assigned assembly point in Islamabad, departure schedule, and mandatory packing checklist.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-lg shrink-0">
              5
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Meet Your Tour Leader &amp; Pay Remaining Balance</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Arrive at the designated assembly point at departure time. Meet your tour guide, settle the remaining 75% tour balance directly with the operator (via cash or bank transfer), and begin your journey into the mountains with total peace of mind.
              </p>
            </div>
          </div>
        </div>

        {/* Cancellation Summary */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold">Standard Platform Cancellation Policy</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All tours booked through PakistanTravel are backed by our transparent cancellation tier:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
              <span className="font-extrabold text-emerald-800 text-sm block">100% Refund</span>
              <p className="text-slate-600">For cancellations submitted 7 or more calendar days prior to scheduled departure.</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
              <span className="font-extrabold text-amber-800 text-sm block">50% Refund</span>
              <p className="text-slate-600">For cancellations submitted between 3 and 6 calendar days prior to departure.</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 space-y-1">
              <span className="font-extrabold text-rose-800 text-sm block">Non-Refundable</span>
              <p className="text-slate-600">Within 72 hours of departure, as operator transport and hotel rooms are prepaid.</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Read our complete terms and force majeure policy in our <Link href="/terms" className="text-sky-600 underline">Terms of Service</Link>.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-sky-600 to-teal-600 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to reserve your mountain getaway?</h2>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto">
            Explore authentic multi-day itineraries curated by independent local operators across northern Pakistan.
          </p>
          <div className="pt-2">
            <Link
              href="/tours"
              className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition shadow-lg inline-block"
            >
              Browse All Tour Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
