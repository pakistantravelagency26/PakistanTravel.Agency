import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { getSiteSettings, type FaqItem } from "@/services/siteSettings.service";

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Northern Pakistan Travel FAQs & Guide",
  description:
    "Find expert answers on traveling to Hunza and Skardu, local payment methods, cancellation rules, road seasons, and verified bookings.",
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/faq`,
    siteName: "PakistanTravel",
    title: "Northern Pakistan Travel FAQs & Guide",
    description:
      "Find expert answers on traveling to Hunza and Skardu, local payment methods, cancellation rules, road seasons, and verified bookings.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200",
        width: 1200,
        height: 630,
        alt: "PakistanTravel Frequently Asked Questions & Trip Planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Northern Pakistan Travel FAQs & Guide",
    description:
      "Find expert answers on traveling to Hunza and Skardu, local payment methods, cancellation rules, road seasons, and verified bookings.",
    images: ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200"],
  },
};

export default async function FAQPage() {
  const faqs: FaqItem[] = await getSiteSettings("FAQS");

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
        name: "Frequently Asked Questions",
        item: `${siteUrl}/faq`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Help Center</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Frequently Asked Questions</h1>
          <p className="text-xs text-slate-500 mt-1">Everything you need to know about booking trips in Pakistan</p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => {
            const anchorId = f.q.toLowerCase().includes("operator rates")
              ? "operator-rates"
              : f.id;
            return (
              <div
                key={f.id || i}
                id={anchorId}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2 scroll-mt-24"
              >
                <h2 className="font-bold text-base text-slate-900">{f.q}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
