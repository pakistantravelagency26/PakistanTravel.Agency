import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, FileCheck, Award, Mail, ChevronRight, Scale, BookOpen } from "lucide-react";

export const revalidate = 3600;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Editorial Policy & Standards",
  description:
    "Read the PakistanTravel editorial standards: who writes our travel guides, fact-checking process, no sponsored tour rankings, and corrections.",
  alternates: {
    canonical: `${siteUrl}/about/editorial-policy`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/about/editorial-policy`,
    siteName: "PakistanTravel",
    title: "Editorial Policy & Standards | PakistanTravel",
    description:
      "Read the PakistanTravel editorial standards: who writes our travel guides, fact-checking process, no sponsored tour rankings, and corrections.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Editorial Policy & Standards | PakistanTravel",
    description:
      "Read the PakistanTravel editorial standards: who writes our travel guides, fact-checking process, no sponsored tour rankings, and corrections.",
  },
};

export default function EditorialPolicyPage() {
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
        name: "About Us",
        item: `${siteUrl}/about`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Editorial Policy",
        item: `${siteUrl}/about/editorial-policy`,
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="bg-white border-b border-slate-200/80 pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-slate-700 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/about" className="hover:text-slate-700 transition">About</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-semibold">Editorial Policy</span>
          </nav>

          <span className="inline-block bg-emerald-50 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            Trust &amp; Transparency
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            PakistanTravel Editorial Policy &amp; Standards
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            How we research, verify, and publish unbiased travel guides, regional itineraries, and mountain safety advisories for northern Pakistan.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 space-y-12">
        {/* Section 1: Who Writes */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <h2 className="text-xl font-extrabold">1. Who Writes for PakistanTravel</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            All destination guides, route advisories, cost breakdowns, and seasonal analyses are produced by the <strong>PakistanTravel Editorial Team</strong>. Our editorial contributors include local mountain guides, logistics coordinators based across Gilgit-Baltistan and Khyber Pakhtunkhwa, and seasoned independent travel researchers with direct on-the-ground experience navigating northern routes.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            We do not accept anonymous, automated, or outsourced promotional submissions. Every article attribution represents our collective editorial desk, ensuring unified standards of accuracy and accountability.
          </p>
        </section>

        {/* Section 2: Review Process & Ground Truth Fact-Checking */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            <FileCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-extrabold">2. Ground Truth Fact-Checking Process</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Northern Pakistan features dynamic mountain terrain where conditions change rapidly. Our editorial desk adheres to rigorous verification protocols:
          </p>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 pl-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2"></span>
              <span><strong>Road &amp; Pass Openings:</strong> Mountain passes such as Babusar Pass, Deosai plateau tracks, and Lowari tunnel routes are cross-checked with National Highway Authority (NHA) updates and local transport unions rather than historical estimates.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2"></span>
              <span><strong>Aviation Realities:</strong> Flight operations into Skardu and Gilgit are explicitly documented as operating under Visual Flight Rules (VFR), clearly communicating weather dependency and cancellation realities.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2"></span>
              <span><strong>Vehicle Requirements:</strong> We accurately classify terrain requiring high-clearance 4x4 vehicles (such as Thal to Kumrat Forest, Raikot to Tato, and Dowarian to Ratti Gali) to prevent vehicle damage and traveler misadventure.</span>
            </li>
          </ul>
        </section>

        {/* Section 3: No Sponsored Rankings */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            <Scale className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-extrabold">3. Strict No Sponsored Rankings Policy</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            PakistanTravel operates as a transparent tour marketplace. We maintain an absolute separation between commercial operations and editorial content:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-2"></span>
              <span>Tour operators cannot purchase editorial placement, positive editorial reviews, or top rankings in our destination recommendations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-2"></span>
              <span>Listings shown on destination and search pages are ordered by real traveler reviews, operator responsiveness, and itinerary completeness.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-2"></span>
              <span>All cost ranges published in our guides reflect verified market averages, helping travelers budget accurately without artificial inflation.</span>
            </li>
          </ul>
        </section>

        {/* Section 4: Corrections & Inquiries */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            <Mail className="w-5 h-5 text-sky-600" />
            <h2 className="text-xl font-extrabold">4. Corrections and Feedback Contact</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            We welcome corrections, route updates, and community feedback. If you identify an outdated road status, an inaccurate altitude figure, or a changed local permit requirement, please contact our editorial desk immediately:
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
            >
              Contact Editorial Desk
            </Link>
            <a
              href="mailto:support@pakistantravel.agency"
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition"
            >
              support@pakistantravel.agency
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
