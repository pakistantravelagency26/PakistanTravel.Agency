import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowLeft, Clock, Bot, HelpCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig , SITE_URL } from "@/config/site";

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Contact Customer Support Desk",
  description:
    "Contact PakistanTravel support desk for tour inquiries, booking questions, and general guidance. AI assistant available 24/7.",
  alternates: {
    canonical: `${siteUrl}/contact`,
    languages: {
      "en-PK": `${siteUrl}/contact`,
      "ur-PK": `${siteUrl}/ur/contact`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/contact`,
    siteName: "PakistanTravel",
    title: "Contact Customer Support Desk",
    description:
      "Contact PakistanTravel support desk for tour inquiries, booking questions, and general guidance. AI assistant available 24/7.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200",
        width: 1200,
        height: 630,
        alt: "PakistanTravel Customer Support Desk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Customer Support Desk",
    description:
      "Contact PakistanTravel support desk for tour inquiries, booking questions, and general guidance. AI assistant available 24/7.",
    images: ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200"],
  },
};

export default function ContactPage() {
  const supportEmail = siteConfig.contact.supportEmail;
  const humanHours = siteConfig.contact.supportHours.humanEmail;
  const aiHours = siteConfig.contact.supportHours.aiChatbot;

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
        name: "Contact Support",
        item: `${siteUrl}/contact`,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Support &amp; Inquiries</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Contact Customer Desk</h1>
          <p className="text-xs text-slate-500 mt-1">Our support desk assists travelers with platform booking questions, cancellation requests, and partner inquiries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Direct channels */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Support Channels</h2>

            <div className="space-y-3 text-xs text-slate-600">
              {/* 24/7 AI Chatbot Pill */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <Bot className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sm block">24/7 AI Travel Assistant</span>
                  <p className="text-[11px] text-emerald-900 mt-0.5">
                    Click the chat widget on the bottom-right of any page for immediate answers about destinations, itineraries, and booking steps.
                  </p>
                </div>
              </div>

              {/* Email Support (Shown only if supportEmail is configured) */}
              {supportEmail && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <Mail className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Email Inquiries</span>
                    <a href={`mailto:${supportEmail}`} className="text-sky-700 font-semibold hover:underline">
                      {supportEmail}
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Direct inquiries for refunds, booking amendments, or operator partnerships.
                    </span>
                  </div>
                </div>
              )}

              {/* Support Hours */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Clock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Working Hours</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    <strong>Human Desk:</strong> {humanHours}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    <strong>AI Assistant:</strong> {aiHours}
                  </p>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <HelpCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Frequently Asked Questions</span>
                  <Link href="/faq" className="text-sky-600 font-semibold text-[11px] hover:underline block mt-0.5">
                    Visit our FAQ page for cancellation rules, permits, and payment options →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Send an Online Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
