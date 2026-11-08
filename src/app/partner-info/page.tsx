import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  Building2, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft,
  Users,
  Compass,
  AlertTriangle
} from "lucide-react";

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Partner Information & Operator Guidelines",
  description:
    "Learn how independent northern Pakistan tour operators and hotels publish listings and manage bookings on PakistanTravel.Agency.",
  alternates: {
    canonical: `${siteUrl}/partner-info`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/partner-info`,
    siteName: "PakistanTravel",
    title: "Partner Information & Operator Guidelines",
    description:
      "Learn how independent northern Pakistan tour operators and hotels publish listings and manage bookings on PakistanTravel.Agency.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200",
        width: 1200,
        height: 630,
        alt: "PakistanTravel Partner Information and Guidelines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Partner Information & Operator Guidelines",
    description:
      "Learn how independent northern Pakistan tour operators and hotels publish listings and manage bookings on PakistanTravel.Agency.",
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200"],
  },
};

export default function PartnerInfoPage() {
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
        name: "Partner Information",
        item: `${siteUrl}/partner-info`,
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
            Marketplace Transparency
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-1">
            Partner Information &amp; Marketplace Standards
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            How independent local tour operators list packages, manage itineraries, and handle bookings on PakistanTravel.Agency.
          </p>
        </div>

        {/* Essential Intermediary Notice */}
        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200/80 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Marketplace Platform Intermediary Notice</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed">
            PakistanTravel.Agency is an online booking intermediary and marketplace. All guided tour packages and trekking expeditions listed on this website are owned, organized, and executed by independent third-party tour operators. The platform does not certify, inspect, or guarantee operator credentials, vehicles, or physical facilities.
          </p>
        </div>

        {/* How It Works for Partners */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">How Operators Join and Publish Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Operator Registration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tour operators create a partner account with their business name, contact person, base city, and operational areas across northern Pakistan.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Operator-Provided Credentials</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an operator holds a regional tourism license or business registration number, they may submit it. Any license shown on an operator profile is labeled as &quot;provided by operator&quot; and is not verified or endorsed by the platform.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Self-Managed Listings &amp; Pricing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Operators set their own itineraries, seasonal departure dates, vehicle allocations, and inclusions directly through their partner dashboard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Authentic Traveler Reviews</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Travelers who complete bookings can submit genuine reviews and ratings, helping other travelers make informed choices based on peer experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Traveler Guidance */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Tips for Travelers Before Booking</h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>Review the day-by-day itinerary, vehicle type, and hotel inclusions carefully before completing your reservation.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>Note the platform cancellation policy (100% refund $\ge 7$ days before departure, 50% 3–6 days, non-refundable within 72 hours).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>Carry original identity documents (CNIC for Pakistani citizens, passport with valid visa for international guests) for northern security checkpoints.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>Use our 24/7 AI travel assistant or contact support if you need assistance with booking requests or route updates.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
