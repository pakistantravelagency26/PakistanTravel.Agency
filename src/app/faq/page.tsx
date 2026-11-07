import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { getSiteSettings, type FaqItem } from "@/services/siteSettings.service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Pakistan Travel FAQs & Trip Guide | PakistanTravel.Agency",
  description: "Find answers to frequent questions about traveling to Hunza and Skardu, local payments, cancellation rules, and booking trips in northern Pakistan.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Pakistan Travel FAQs & Trip Guide | PakistanTravel.Agency",
    description: "Find answers to frequent questions about traveling to Hunza and Skardu, local payments, cancellation rules, and booking trips in northern Pakistan.",
    url: "/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pakistan Travel FAQs & Trip Guide | PakistanTravel.Agency",
    description: "Find answers to frequent questions about traveling to northern Pakistan.",
  },
};

export default async function FAQPage() {
  const faqs: FaqItem[] = await getSiteSettings("FAQS");

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
          {faqs.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <h2 className="font-bold text-base text-slate-900">{f.q}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
