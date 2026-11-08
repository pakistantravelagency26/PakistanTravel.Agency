import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Headphones, 
  ArrowLeft,
  Compass,
  Calendar
} from "lucide-react";
import { CustomTripEnquiryForm } from "@/components/common/CustomTripEnquiryForm";

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "شمالی پاکستان میں ٹورز اور ہوٹلز کی بکنگ",
  description:
    "پاکستان کے شمالی پہاڑی علاقوں ہنزہ، سکردو، سوات اور کمراٹ کے لیے ٹور پیکجز، فیملی ہوٹلز اور 4x4 جیپ رینٹل کا آن لائن مارکیٹ پلیس۔",
  alternates: {
    canonical: `${siteUrl}/ur`,
    languages: {
      "ur-PK": `${siteUrl}/ur`,
      "en-PK": `${siteUrl}/`,
    },
  },
  openGraph: {
    type: "website",
    locale: "ur_PK",
    url: `${siteUrl}/ur`,
    siteName: "پاکستان ٹریول",
    title: "شمالی پاکستان میں ٹورز اور ہوٹلز کی بکنگ",
    description:
      "پاکستان کے شمالی پہاڑی علاقوں ہنزہ، سکردو، سوات اور کمراٹ کے لیے ٹور پیکجز، فیملی ہوٹلز اور 4x4 جیپ رینٹل کا آن لائن مارکیٹ پلیس۔",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        width: 1200,
        height: 630,
        alt: "پاکستان کے خوبصورت پہاڑی مناظر",
      },
    ],
  },
};

export default function UrduHomePage() {
  const destinations = [
    { name: "ہنزہ وادی", sub: "عطاء آباد جھیل و پاسو کونز", slug: "hunza", desc: "خوبصورت جھیلیں، خوبانی کے باغات اور بلند و بالا پہاڑی چوٹیاں۔" },
    { name: "سکردو و بلتستان", sub: "دیوسائی و شنگریلا ریزورٹ", slug: "skardu", desc: "کے ٹو کا گیٹ وے، سرد صحرائی ریت کے ٹیلے اور قدیم قلعے۔" },
    { name: "سوات و کالام", sub: "مالم جبہ اسکی ریزورٹ و مہوڈنڈ", slug: "swat", desc: "سرسبز دیودار کے جنگلات، شفاف ندیاں اور ایشوکا کی تاریخ۔" },
    { name: "کمراٹ وادی", sub: "دیر بالا و جہاز بانڈہ", slug: "kumrat", desc: "پرامن دیودار کا جنگل، کٹورا جھیل اور قدرتی کیمپنگ۔" },
    { name: "وادی نیلم", sub: "ارنگ خیل و رتی گلی جھیل", slug: "neelum", desc: "آزاد کشمیر کا نیلا نگینہ، خوبصورت آبشاریں اور لکڑی کے مکانات۔" },
    { name: "مری و گلیات", sub: "بھوربن و نتھیا گلی", slug: "murree", desc: "اسلام آباد سے محض ایک گھنٹے کی مسافت پر خوشگوار پائن وڈز۔" },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>شمالی پاکستان کا آن لائن ٹورازم مارکیٹ پلیس</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            پاکستان کے پرشکوہ پہاڑوں اور وادیوں کا سفر
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ہنزہ، سکردو، سوات اور آزاد کشمیر کے لیے آزاد مقامی ٹور آپریٹرز اور ہوٹلز۔ شفاف ریٹس اور مکمل رہنمائی۔
          </p>

          {/* Confidence Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-800">آزاد مقامی ٹور آپریٹرز</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span className="font-bold text-slate-800">جاز کیش، ایزی پیسہ و کارڈز</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-teal-600" />
              <span className="font-bold text-slate-800">کسٹمر کیئر ڈیسک و اے آئی چیٹ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid in Urdu */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">سیاحتی مقامات</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            شمالی پاکستان کے مقبول سیاحتی مراکز
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            ہر مقام کی تفصیلی معلومات، موسم، سفری راستے اور رہائشی سہولیات کی تفصیلات۔
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <div
              key={d.slug}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
                  <span>{d.sub}</span>
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{d.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{d.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <Link href={`/destinations/${d.slug}`} className="hover:underline flex items-center gap-1">
                  <span>تفصیلی گائیڈ پڑھیں</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Journey Lead Generation Form */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <CustomTripEnquiryForm
          title="اپنے سفر کا خاکہ تیار کروائیں"
          subtitle="ہمیں بتائیں آپ کہاں کا سفر کرنا چاہتے ہیں۔ ہمارے علاقائی کوآرڈینیٹرز آپ کے بجٹ اور تاریخوں کے مطابق بہترین پلان پیش کریں گے۔"
        />
      </section>
    </div>
  );
}
