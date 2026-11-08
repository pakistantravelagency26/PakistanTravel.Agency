import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { siteConfig , SITE_URL } from "@/config/site";

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "پرائیویسی پالیسی اور ڈیٹا کا تحفظ",
  description:
    "پاکستان ٹریول کی پرائیویسی پالیسی: مسافروں کی شناخت، سفری دستاویزات اور آن لائن مالیاتی لین دین کے تحفظ کے اصول۔",
  alternates: {
    canonical: `${siteUrl}/ur/privacy`,
    languages: {
      "ur-PK": `${siteUrl}/ur/privacy`,
      "en-PK": `${siteUrl}/privacy`,
    },
  },
  openGraph: {
    type: "website",
    locale: "ur_PK",
    url: `${siteUrl}/ur/privacy`,
    siteName: "پاکستان ٹریول",
    title: "پرائیویسی پالیسی اور ڈیٹا کا تحفظ",
    description:
      "پاکستان ٹریول کی پرائیویسی پالیسی: مسافروں کی شناخت، سفری دستاویزات اور آن لائن مالیاتی لین دین کے تحفظ کے اصول۔",
    images: [
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
        width: 1200,
        height: 630,
        alt: "پاکستان ٹریول پرائیویسی پالیسی اور ڈیٹا تحفظ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "پرائیویسی پالیسی اور ڈیٹا کا تحفظ",
    description:
      "پاکستان ٹریول کی پرائیویسی پالیسی: مسافروں کی شناخت، سفری دستاویزات اور آن لائن مالیاتی لین دین کے تحفظ کے اصول۔",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200"],
  },
};

export default function UrduPrivacyPage() {
  const supportEmail = siteConfig.contact.supportEmail;

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
        name: "پرائیویسی پالیسی",
        item: `${siteUrl}/ur/privacy`,
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-right">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200/80 space-y-8">
        <Link href="/ur" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline mb-2">
          <ArrowRight className="w-3.5 h-3.5" /> واپس صفحہ اول پر جائیں
        </Link>

        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">ڈیٹا کا تحفظ اور رازداری</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">پرائیویسی پالیسی</h1>
          <p className="text-xs text-slate-500 mt-1">پاکستان ٹریول کی باضابطہ ڈیٹا سیکیورٹی اور رازداری پالیسی</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1. ذاتی اور شناختی معلومات کا تحفظ</span>
            </h2>
            <p>
              ہم صرف وہی بنیادی معلومات اکٹھی کرتے ہیں جو ٹور ریزرویشن، ہوٹل بکنگ اور سفری حفاظتی تصدیق کے لیے لازمی ہوتی ہیں (مثلاً نام، فون نمبر، ای میل پتہ اور ضرورت پڑنے پر قومی شناختی کارڈ کی تفصیلات)۔ ہم آپ کا ڈیٹا کسی تیسرے فریق کو فروخت نہیں کرتے۔
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>2. مالیاتی لین دین اور بینکنگ سیکیورٹی</span>
            </h2>
            <p>
              آن لائن ادائیگیاں محفوظ اور انکرپٹڈ گیٹ ویز کے ذریعے انجام پاتی ہیں۔ پلیٹ فارم پر آپ کے کارڈ کا خفیہ پن یا سی وی وی (CVV) کوڈ کبھی محفوظ نہیں کیا جاتا۔
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>3. لوکل آپریٹرز اور ہوٹلز کے ساتھ معلومات کا تبادلہ</span>
            </h2>
            <p>
              بکنگ مکمل ہونے کے بعد صرف وہی ضروری تفصیلات متعلقہ ٹور آپریٹر یا ہوٹل کے ساتھ شیئر کی جاتی ہیں جو سروس کی فراہمی یا چیک ان کے لیے ناگزیر ہوں۔
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-6 space-y-1.5 text-xs text-slate-700">
            <p><strong>پلیٹ فارم:</strong> {siteConfig.name}</p>
            {supportEmail && <p><strong>سپورٹ ای میل:</strong> {supportEmail}</p>}
            <p><strong>کسٹمر کیئر:</strong> 24/7 اے آئی چیٹ بوٹ اور کاروباری اوقات میں ای میل ڈیسک</p>
          </div>
        </div>
      </div>
    </div>
  );
}
