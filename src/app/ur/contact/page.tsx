import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowRight, Clock, Bot, HelpCircle } from "lucide-react";
import { siteConfig , SITE_URL } from "@/config/site";

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "رابطہ کریں اور کسٹمر سپورٹ ڈیسک",
  description:
    "پاکستان ٹریول کی کسٹمر سپورٹ: ٹور انکوائری، بکنگ کے سوالات اور رہنمائی۔ 24/7 اے آئی اسسٹنٹ دستیاب ہے۔",
  alternates: {
    canonical: `${siteUrl}/ur/contact`,
    languages: {
      "ur-PK": `${siteUrl}/ur/contact`,
      "en-PK": `${siteUrl}/contact`,
    },
  },
  openGraph: {
    type: "website",
    locale: "ur_PK",
    url: `${siteUrl}/ur/contact`,
    siteName: "پاکستان ٹریول",
    title: "رابطہ کریں اور کسٹمر سپورٹ ڈیسک",
    description:
      "پاکستان ٹریول کی کسٹمر سپورٹ: ٹور انکوائری، بکنگ کے سوالات اور رہنمائی۔ 24/7 اے آئی اسسٹنٹ دستیاب ہے۔",
    images: [
      {
        url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200",
        width: 1200,
        height: 630,
        alt: "پاکستان ٹریول کسٹمر سپورٹ ڈیسک",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "رابطہ کریں اور کسٹمر سپورٹ ڈیسک",
    description:
      "پاکستان ٹریول کی کسٹمر سپورٹ: ٹور انکوائری، بکنگ کے سوالات اور رہنمائی۔ 24/7 اے آئی اسسٹنٹ دستیاب ہے۔",
    images: ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200"],
  },
};

export default function UrduContactPage() {
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
        name: "صفحہ اول",
        item: `${siteUrl}/ur`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "رابطہ کریں",
        item: `${siteUrl}/ur/contact`,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-right">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Link href="/ur" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 mb-6">
        <ArrowRight className="w-4 h-4" /> واپس صفحہ اول پر جائیں
      </Link>

      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">کسٹمر کیئر اور رہنمائی ڈیسک</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">ہم سے رابطہ کریں</h1>
          <p className="text-xs text-slate-600 mt-1">
            ہماری ٹیم اور خودکار اے آئی اسسٹنٹ ٹور ریزرویشنز، منسوخی اور پلیٹ فارم کے سوالات کے لیے دستیاب ہیں۔
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Direct channels */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">سپورٹ چینلز</h2>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <Bot className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sm block">24/7 اے آئی ٹریول اسسٹنٹ</span>
                  <p className="text-[11px] text-emerald-900 mt-0.5">
                    اسکرین کے نیچے دائیں جانب موجود چیٹ ویجیٹ پر کلک کر کے فوری رہنمائی، نرخ اور بکنگ کی تفصیلات حاصل کریں۔
                  </p>
                </div>
              </div>

              {supportEmail && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <Mail className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">ای میل رابطہ</span>
                    <a href={`mailto:${supportEmail}`} className="text-sky-700 font-semibold hover:underline block mt-0.5">
                      {supportEmail}
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      ریفنڈز، پارٹنر شپ اور بکنگ کی تبدیلی کے لیے ای میل کریں۔
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Clock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">اوقات کار</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    <strong>ای میل سپورٹ:</strong> {humanHours}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    <strong>اے آئی چیٹ بوٹ:</strong> {aiHours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <HelpCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">اکثر پوچھے گئے سوالات</span>
                  <Link href="/faq" className="text-emerald-700 font-semibold text-[11px] hover:underline block mt-0.5">
                    منسوخی پالیسی، پرمٹس اور ادائیگی کے طریقوں کے لیے ایف اے کیو دیکھیں ←
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">آن لائن پیغام بھیجیں</h2>
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                اگر آپ کے پاس کوئی سوال یا کسٹم ٹور کی درخواست ہے تو نیچے دیے گئے لنک سے انکوائری فارم بھریں۔
              </p>
              <Link
                href="/ur"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
              >
                <span>کسٹم ٹور انکوائری فارم پر جائیں</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
