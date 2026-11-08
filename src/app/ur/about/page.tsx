import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import { Compass, ShieldCheck, Heart, Award, Target, Eye, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "ہمارے بارے میں اور شمالی سیاحت کا مشن",
  description:
    "پاکستان ٹریول کا تعارف: آزاد مقامی ٹور آپریٹرز اور ہوٹلز کو سیاحوں سے جوڑنے والا شفاف آن لائن مارکیٹ پلیس۔",
  alternates: {
    canonical: `${siteUrl}/ur/about`,
    languages: {
      "ur-PK": `${siteUrl}/ur/about`,
      "en-PK": `${siteUrl}/about`,
    },
  },
  openGraph: {
    type: "website",
    locale: "ur_PK",
    url: `${siteUrl}/ur/about`,
    siteName: "پاکستان ٹریول",
    title: "ہمارے بارے میں اور شمالی سیاحت کا مشن",
    description:
      "پاکستان ٹریول کا تعارف: آزاد مقامی ٹور آپریٹرز اور ہوٹلز کو سیاحوں سے جوڑنے والا شفاف آن لائن مارکیٹ پلیس۔",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200",
        width: 1200,
        height: 630,
        alt: "پاکستان ٹریول کا مشن اور شمالی پاکستان کی مہمان نوازی",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ہمارے بارے میں اور شمالی سیاحت کا مشن",
    description:
      "پاکستان ٹریول کا تعارف: آزاد مقامی ٹور آپریٹرز اور ہوٹلز کو سیاحوں سے جوڑنے والا شفاف آن لائن مارکیٹ پلیس۔",
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200"],
  },
};

export default async function UrduAboutPage() {
  const publishedListingCount = await prisma.listing.count({
    where: { status: "PUBLISHED" },
  }).catch(() => 0);

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
        name: "ہمارے بارے میں",
        item: `${siteUrl}/ur/about`,
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-right">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Compass className="w-4 h-4 text-emerald-600" /> شمالی پاکستان کا آن لائن ٹورازم مارکیٹ پلیس
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            شمالی پاکستان کی مستند سیاحت، شفاف اور آسان انداز میں
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ہم پاکستان کے مقامی ٹور گائیڈز اور فیملی ہوٹل آپریٹرز کو بااختیار بنا کر سیاحوں کو براہ راست اور شفاف آن لائن بکنگ پلیٹ فارم مہیا کرتے ہیں۔
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-lg">ہمارا مشن</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              شمالی علاقہ جات (گلگت بلتستان، خیبر پختونخوا اور آزاد کشمیر) کے آزاد سیاحتی آپریٹرز کو جدید ڈیجیٹل ٹیکنالوجی سے جوڑنا اور مسافروں کو براہ راست نرخوں پر شفاف بکنگ فراہم کرنا۔
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-lg">ہمارا ویژن</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              پاکستان کا سب سے آسان اور قابل اعتماد ٹورازم پلیٹ فارم بننا جہاں ہر مسافر اور مقامی آپریٹر کے حقوق کا تحفظ ہو۔
            </p>
          </div>
        </div>

        {/* Origin Story */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">مارکیٹ پلیس کا تعارف</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            پاکستان ٹریول ایک درمیانی مارکیٹ پلیس کے طور پر کام کرتا ہے جہاں آزاد ٹور آپریٹرز اور ہوٹل مالکان اپنی سروسز خود پیش کرتے ہیں۔ مسافر مختلف پیکجز اور ہوٹلوں کا موازنہ کر کے اپنی پسند کے مطابق بکنگ کر سکتے ہیں۔
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">آزاد مقامی میزبان</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              مقامی آپریٹرز اپنے ٹورز اور کرائے خود ترتیب دیتے ہیں۔ ان کے اسناد ان کی اپنی جمع کردہ معلومات پر مبنی ہوتے ہیں۔{" "}
              <Link href="/partner-info" className="text-emerald-700 underline font-semibold">پارٹنر معلومات پڑھیں</Link>۔
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">بکنگ کا واضح نظام</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              آن لائن بکنگ کا باقاعدہ ریکارڈ اور بروقت کنفرمیشن سلپ تاکہ سفر میں کوئی ابہام باقی نہ رہے۔
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">مقامی معیشت کی معاونت</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              ہم مقامی گائیڈز اور فیملی لاجز کو بااختیار بنا کر سیاحت کی معاشی آمدنی براہ راست مقامی آبادی تک پہنچاتے ہیں۔
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">پاکستان کی خوبصورتی دریافت کرنے کے لیے تیار ہیں؟</h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            دیوسائی کے بلند ترین میدانوں سے لے کر ہنزہ کی عطاء آباد جھیل کے نیلگوں پانیوں تک، محفوظ سفر شروع کریں۔
          </p>
          <div className="pt-2">
            <Link
              href="/ur"
              className="px-6 py-3 rounded-2xl bg-white text-emerald-950 font-bold text-xs hover:bg-slate-100 transition shadow-lg inline-block"
            >
              {publishedListingCount > 0
                ? `تمام ${publishedListingCount} ٹورز اور پیکیجز دیکھیں`
                : "اپنی مرضی کا ٹور پیکیج بنوائیں"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
