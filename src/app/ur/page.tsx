import type { Metadata } from "next";
import Link from "next/link";
import { Compass, MapPin, Sparkles, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "پاکستان ٹریول ایجنسی | شمالی علاقہ جات کے ٹورز اور ہوٹلز",
  description: "پاکستان ٹریول ایجنسی کے ذریعے ہنزہ، سکردو، سوات اور کمراٹ کے لیے تصدیق شدہ ٹور پیکجز، فیملی ٹرپس اور لگژری ہوٹلز باآسانی بک کریں۔",
  alternates: {
    canonical: "/ur",
    languages: {
      "en-PK": "/",
      "ur-PK": "/ur",
    },
  },
  openGraph: {
    title: "پاکستان ٹریول ایجنسی | تصدیق شدہ ٹورز اور ہوٹلز",
    description: "پاکستان ٹریول ایجنسی کے ذریعے ہنزہ، سکردو، سوات اور کمراٹ کے لیے تصدیق شدہ ٹور پیکجز باآسانی بک کریں۔",
    locale: "ur_PK",
  },
};

export default function UrduHomePage() {
  const popularDestinations = [
    { slug: "hunza", name: "ہنزہ ویلی اور عطاء آباد جھیل", province: "گلگت بلتستان" },
    { slug: "skardu", name: "سکردو اور دیوسائی نیشنل پارک", province: "گلگت بلتستان" },
    { slug: "swat", name: "سوات ویلی، کالام اور مالم جبہ", province: "خیبر پختونخوا" },
    { slug: "kumrat", name: "کمراٹ ویلی اور جہاز بانڈہ", province: "خیبر پختونخوا" },
    { slug: "murree", name: "مری اور گلیات ریزورٹس", province: "پنجاب" },
    { slug: "neelum", name: "وادی نیلم اور ارنگ کلاں", province: "آزاد کشمیر" },
  ];

  return (
    <div dir="rtl" className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Language switch header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-xs">
          <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-sky-600 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            <span>Switch to English Version</span>
          </Link>
          <span className="font-bold text-slate-500">اردو ورژن (ابتدائی ڈھانچہ)</span>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>پاکستان کا مستند ملٹی وینڈر ٹورازم نیٹ ورک</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
            شمالی علاقہ جات کے دلکش نظارے اور محفوظ سفر
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            ہنزہ، سکردو، سوات، کمراٹ اور مری کے تصدیق شدہ ٹورز، فیملی پیکجز، اور لگژری ہوٹلز۔ جاز کیش، ایزی پیسہ، اور آن لائن بینکنگ کی باآسانی ادائیگی کے ساتھ۔
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/search"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-lg shadow-emerald-600/20 transition"
            >
              تمام ٹورز اور ہوٹلز تلاش کریں
            </Link>
            <Link
              href="/destinations"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-2xl text-xs border border-slate-200 transition"
            >
              سیاحتی مقامات کے گائیڈز
            </Link>
          </div>
        </div>

        {/* Destinations in Urdu */}
        <div className="space-y-6 pt-6">
          <div className="text-right">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              مشہور سیاحتی و تفریحی مقامات
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ہر مقام کی تفصیلی معلومات، سفر کے اخراجات، اور ٹور پیکجز
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularDestinations.map((d) => (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition text-right group space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-emerald-600">{d.province}</span>
                  <MapPin className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition">
                  {d.name}
                </h3>
                <span className="text-xs font-bold text-sky-600 block pt-1">
                  مکمل ٹریول گائیڈ دیکھیں ←
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
