import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Languages, Mail, Bot } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: "پاکستان ٹریول | شمالی پاکستان میں ٹورز اور ہوٹلز کی بکنگ",
    template: "%s | پاکستان ٹریول",
  },
  description:
    "پاکستان کے شمالی علاقہ جات ہنزہ، سکردو، سوات اور کمراٹ میں ٹور پیکجز، فیملی ہوٹلز اور 4x4 جیپ بکنگ کا آزاد مارکیٹ پلیس۔",
  alternates: {
    languages: {
      "ur-PK": "/ur",
      "en-PK": "/",
    },
  },
};

export default function UrduLayout({ children }: { children: React.ReactNode }) {
  const supportEmail = siteConfig.contact.supportEmail;

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans text-right">
      {/* Top Bar with Language Switcher */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/ur" className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-600" />
            <span className="font-black text-lg text-slate-900 tracking-tight">
              پاکستان ٹریول<span className="text-amber-500">.ایجنسی</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700">
            <Link href="/ur" className="hover:text-emerald-700 transition">صفحہ اول</Link>
            <Link href="/ur/about" className="hover:text-emerald-700 transition">ہمارے بارے میں</Link>
            <Link href="/partner-info" className="hover:text-emerald-700 transition">پارٹنر معلومات</Link>
            <Link href="/ur/contact" className="hover:text-emerald-700 transition">رابطہ کریں</Link>
            <Link href="/ur/terms" className="hover:text-emerald-700 transition">شرائط و ضوابط</Link>
            <Link href="/ur/privacy" className="hover:text-emerald-700 transition">پرائیویسی</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-200"
              title="Switch to English"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600" />
              <span>English</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Urdu Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 mt-16 text-right">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                <span className="font-extrabold text-base">پاکستان ٹریول ایجنسی</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                پاکستان کے شمالی علاقہ جات کے لیے آزاد مقامی آپریٹرز اور ہوٹلز کا آن لائن ٹورازم مارکیٹ پلیس۔
              </p>
            </div>

            <div>
              <p className="font-bold text-amber-400 mb-3 uppercase tracking-wider text-[11px]">اہم صفحات</p>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/ur" className="hover:text-white transition">صفحہ اول</Link></li>
                <li><Link href="/ur/about" className="hover:text-white transition">ہمارے بارے میں</Link></li>
                <li><Link href="/partner-info" className="hover:text-white transition">پارٹنر معلومات و ہدایات</Link></li>
                <li><Link href="/ur/contact" className="hover:text-white transition">کسٹمر کیئر اور رابطہ</Link></li>
                <li><Link href="/ur/terms" className="hover:text-white transition">منسوخی اور ریفنڈ پالیسی</Link></li>
                <li><Link href="/ur/privacy" className="hover:text-white transition">ڈیٹا سیکیورٹی اور پرائیویسی</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-emerald-400 mb-3 uppercase tracking-wider text-[11px]">مقبول سیاحتی مقامات</p>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/destinations/hunza" className="hover:text-white transition">ہنزہ وادی و عطاء آباد جھیل</Link></li>
                <li><Link href="/destinations/skardu" className="hover:text-white transition">سکردو و دیوسائی نیشنل پارک</Link></li>
                <li><Link href="/destinations/swat" className="hover:text-white transition">سوات وادی و مالم جبہ</Link></li>
                <li><Link href="/destinations/kumrat" className="hover:text-white transition">کمراٹ وادی و جہاز بانڈہ</Link></li>
                <li><Link href="/destinations/neelum" className="hover:text-white transition">وادی نیلم، آزاد کشمیر</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="font-bold text-sky-400 mb-3 uppercase tracking-wider text-[11px]">سپورٹ اور مدد</p>
              {supportEmail && (
                <p className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-sky-400" dir="ltr">{supportEmail}</span>
                </p>
              )}
              <p className="text-[11px] text-slate-400">اے آئی چیٹ اسسٹنٹ: 24/7 فوری مدد کے لیے فعال</p>
              <p className="text-[11px] text-slate-400">انسانی سپورٹ: پیر تا ہفتہ، صبح 9 تا شام 6 بجے</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© 2026 پاکستان ٹریول ایجنسی۔ جملہ حقوق محفوظ ہیں۔</p>
            <Link href="/" className="text-emerald-400 hover:underline">
              Switch to English Version →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
