import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getSiteSettings } from "@/services/siteSettings.service";
import { siteConfig , SITE_URL } from "@/config/site";

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Privacy Policy & Data Security",
  description:
    "Learn how PakistanTravel collects, encrypts, and protects personal contact details, booking information, and payment transactions on our marketplace.",
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/privacy`,
    siteName: "PakistanTravel",
    title: "Privacy Policy & Data Security",
    description:
      "Learn how PakistanTravel collects, encrypts, and protects personal contact details, booking information, and payment transactions on our marketplace.",
    images: [
      {
        url: `${siteUrl}/images/og/home-og.jpg`,
        width: 1200,
        height: 630,
        alt: "PakistanTravel Data Protection and Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy & Data Security",
    description:
      "Learn how PakistanTravel collects, encrypts, and protects personal contact details, booking information, and payment transactions on our marketplace.",
    images: [`${siteUrl}/images/og/home-og.jpg`],
  },
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const privacy = settings.PAGE_PRIVACY;
  const general = settings.GENERAL;
  const supportEmail = siteConfig.contact.supportEmail || general.supportEmail;

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
        name: "Privacy Policy",
        item: `${siteUrl}/privacy`,
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200/80 space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Privacy &amp; Data Security</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Official Platform Compliance · {general.siteName || siteConfig.name}</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>1. Traveler Data Privacy &amp; Identity Statement</span>
            </h2>
            <p>{privacy.privacyStatement}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>2. Payment &amp; Banking Gateway Security</span>
            </h2>
            <p>{privacy.paymentSecurity}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3. Contact &amp; Profile Protection</span>
            </h2>
            <p>{privacy.contactProtection}</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-4 space-y-1.5 text-xs text-slate-700">
            <p><strong>Platform:</strong> {siteConfig.name}</p>
            {supportEmail && <p><strong>Official Contact:</strong> <a href={`mailto:${supportEmail}`} className="text-sky-700 underline">{supportEmail}</a></p>}
            <p><strong>Customer Assistance:</strong> AI Assistant 24/7 · Email desk during working hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
