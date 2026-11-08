import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Handshake, 
  CreditCard,
  HelpCircle 
} from "lucide-react";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pakistantravel-agency.vercel.app";

export const metadata: Metadata = {
  title: "شرائط و ضوابط اور منسوخی کی پالیسی",
  description:
    "پاکستان ٹریول کی باضابطہ مارکیٹ پلیس شرائط، آپریٹرز کا خودمختار کردار، بکنگ معائدہ، منسوخی کی پالیسی، اور حدود ذمہ داری۔",
  alternates: {
    canonical: `${siteUrl}/ur/terms`,
    languages: {
      "ur-PK": `${siteUrl}/ur/terms`,
      "en-PK": `${siteUrl}/terms`,
    },
  },
  openGraph: {
    type: "website",
    locale: "ur_PK",
    url: `${siteUrl}/ur/terms`,
    siteName: "پاکستان ٹریول",
    title: "شرائط و ضوابط اور منسوخی کی پالیسی | پاکستان ٹریول",
    description:
      "پاکستان ٹریول کی باضابطہ مارکیٹ پلیس شرائط، بکنگ معائدہ، اور حدود ذمہ داری۔",
    images: [
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
        width: 1200,
        height: 630,
        alt: "پاکستان ٹریول بکنگ شرائط و ضوابط",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "شرائط و ضوابط اور منسوخی کی پالیسی | پاکستان ٹریول",
    description:
      "پاکستان ٹریول کی مارکیٹ پلیس شرائط و ضوابط اور منسوخی کی پالیسی۔",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200"],
  },
};

export default function UrduTermsPage() {
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
        name: "شرائط و ضوابط",
        item: `${siteUrl}/ur/terms`,
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
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">مارکیٹ پلیس معائدہ اور پالیسی</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">شرائط و ضوابط اور بکنگ پالیسی</h1>
          <p className="text-xs text-slate-500 mt-1">آخری ترمیم: موسم خزاں 2026 · {siteConfig.name}</p>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs sm:text-sm text-sky-900 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">پلیٹ فارم کے کردار کے متعلق اہم وضاحت:</p>
            <p className="mt-0.5 text-sky-800">
              {siteConfig.name} ایک آن لائن ٹیکنالوجی مارکیٹ پلیس اور انٹرمیڈیری ہے۔ ہم سیاحوں کو پاکستان کے آزاد مقامی ٹور آپریٹرز، ہوٹل مالکان اور ٹرانسپورٹ مالکان کے ساتھ جوڑتے ہیں۔ بکنگ کرنے سے پہلے برائے مہربانی یہ شرائط غور سے پڑھ لیں۔
            </p>
          </div>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1. مارکیٹ پلیس کا کردار اور براہ راست سروس معائدہ</span>
            </h2>
            <div className="space-y-1.5 text-slate-700">
              <p>
                <strong>صرف تکنیکی ثالث:</strong> {siteConfig.name} کوئی ٹور آپریٹر، ہوٹل کا مالک، ٹرانسپورٹ فراہم کنندہ یا انشورنس ادارہ نہیں ہے۔ ہم ایک ڈیجیٹل پلیٹ فارم مہیا کرتے ہیں جہاں آپریٹرز اپنی خدمات خود شائع کرتے ہیں۔
              </p>
              <p>
                <strong>براہ راست معائدہ:</strong> جب آپ کوئی ٹور یا ہوٹل بک کرتے ہیں تو سروس کی فراہمی کا قانونی معائدہ براہ راست آپ کے اور متعلقہ آزاد آپریٹر کے درمیان طے پاتا ہے۔ ٹور کے شیڈول اور کوالٹی کی فراہمی متعلقہ آپریٹر کی ذمہ داری ہے۔
              </p>
              <p>
                <strong>واؤچر کا اجراء:</strong> بکنگ کی باضابطہ تصدیق اور آپریٹر کی رابطہ تفصیلات پر مشتمل واؤچر صرف اس وقت جاری ہوتا ہے جب مطلوبہ ڈپازٹ یا مکمل ادائیگی موصول اور تصدیق ہو جائے۔
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Handshake className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>2. شراکت داروں کا خودمختار کاروباری تشخص (Independent Contractors)</span>
            </h2>
            <div className="space-y-1.5 text-slate-700">
              <p>
                پلیٹ فارم پر درج تمام ٹور کمپنیاں، جیپ ڈرائیورز اور ہوٹلز آزاد قانونی کاروباری ادارے ہیں۔ وہ {siteConfig.name} کے ملازم، نمائندے یا ایجنٹ نہیں ہیں۔
              </p>
              <p>
                اپنے متعلقہ ڈیپارٹمنٹ آف ٹورسٹ سروسز (DTS) لائسنس، صوبائی رجسٹریشن، گاڑیوں کی فٹنس، گائیڈز کی اسناد اور ٹیکس کے معاملات کی درستگی کی ذمہ داری بذات خود متعلقہ آپریٹر پر عائد ہوتی ہے۔ آپریٹر کی پروفائل پر ظاہر لائسنس نمبر ان کی طرف سے خود فراہم کردہ ہوتا ہے۔
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>3. پلیٹ فارم کی ذمہ داریاں: ادائیگیاں اور کسٹمر سپورٹ</span>
            </h2>
            <div className="space-y-1.5 text-slate-700">
              <p>پلیٹ فارم مسافروں کے تحفظ کے لیے درج ذیل امور کا پابند ہے:</p>
              <ul className="list-disc pr-5 space-y-1">
                <li>
                  <strong>محفوظ ادائیگیاں:</strong> جاز کیش، ایزی پیسہ، بینک ٹرانسفر اور کارڈز کے ذریعے موصول شدہ رقم کو امانت کے اصولوں کے مطابق محفوظ رکھنا اور طے شدہ شرائط پر آپریٹر کو منتقل کرنا۔
                </li>
                <li>
                  <strong>منسوخی پالیسی کا شفاف نفاذ:</strong> کسی منسوخی کی صورت میں پالیسی کے مطابق ریفنڈ کا حساب لگا کر مسافر کو بروقت واپس دلوانا۔
                </li>
                <li>
                  <strong>24/7 سپورٹ معاونت:</strong> ہمارے اے آئی اسسٹنٹ اور ای میل سپورٹ ڈیسک کے ذریعے بکنگ کے مسائل حل کروانا۔
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>4. یکساں منسوخی اور ریفنڈ پالیسی</span>
            </h2>
            <p className="text-slate-700 font-medium">
              مسافروں اور پہاڑی آپریٹرز دونوں کے پیشگی اخراجات کے تحفظ کے لیے درج ذیل ریفنڈ قوانین لاگو ہوتے ہیں:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-700 block text-sm">100 فیصد ریفنڈ</span>
                <span className="text-slate-600">روانگی سے 7 یا اس سے زائد دن پہلے</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <span className="font-bold text-amber-700 block text-sm">50 فیصد ریفنڈ</span>
                <span className="text-slate-600">روانگی سے 3 تا 6 دن پہلے</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200">
                <span className="font-bold text-rose-700 block text-sm">کوئی ریفنڈ نہیں</span>
                <span className="text-slate-600">روانگی سے 72 گھنٹے سے کم وقت میں</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              نوٹ: 72 گھنٹوں سے کم وقت میں منسوخی پر رقم واپس نہ ہونے کی وجہ یہ ہے کہ پہاڑی علاقوں کے ہوٹل اور جیپس پیشگی بک کر لی جاتی ہیں۔
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>5. پہاڑی راستوں کے حالات اور حدود ذمہ داری (Limitation of Liability)</span>
            </h2>
            <div className="space-y-1.5 text-slate-700">
              <p>
                <strong>پہاڑی خطرات اور لینڈ سلائیڈنگ:</strong> گلگت بلتستان، سوات اور کشمیر کا سفر بلند و بالا پہاڑوں پر مشتمل ہے۔ بارشوں، برف باری یا لینڈ سلائیڈنگ کے باعث بابوسر ٹاپ، قراقرم ہائی وے، لواری سرنگ یا سکردو روڈ کی بندش اور پروازوں کی منسوخی قدرتی عوامل ہیں۔
              </p>
              <p>
                <strong>قدرتی عوامل اور متبادل راستے:</strong> قدرتی آفات، راستوں کی بندش یا حکومتی سیکیورٹی احکامات کے باعث ہونے والی تاخیر کا مالی بوجھ {siteConfig.name} یا آپریٹر پر عائد نہیں کیا جا سکتا۔ سیاحوں کی حفاظت کے لیے آپریٹر کو روٹ میں تبدیلی کا حق حاصل ہے۔
              </p>
              <p>
                <strong>ذمہ داری کی حد:</strong> کسی آپریٹر کے نقص، ذاتی چوٹ، بیماری، سامان کی گمشدگی یا ہائی ایلٹیٹیوڈ بیماری کی صورت میں پلیٹ فارم کو ذمہ دار نہیں ٹھہرایا جا سکتا۔ مسافروں کو ذاتی ٹریول انشورنس لینے کی سخت تاکید کی جاتی ہے۔
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>6. اینٹی بائی پاس اصول (Anti-Circumvention)</span>
            </h2>
            <div className="space-y-1.5 text-slate-700">
              <p>
                پلیٹ فارم پر بکنگ کے تحفظ اور شفافیت کو برقرار رکھنے کے لیے مسافر اور آپریٹرز اس بات کے پابند ہیں کہ تصدیق شدہ بکنگ سے قبل براہ راست ذاتی فون نمبرز یا آف پلیٹ فارم نقد سودے بازی نہ کریں۔ اس اصول کی خلاف ورزی پر خریدار کا تحفظ ختم ہو جاتا ہے اور آپریٹر کا اکاؤنٹ معطل کیا جا سکتا ہے۔
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600 shrink-0" />
              <span>7. ضروری شناختی دستاویزات</span>
            </h2>
            <div className="space-y-1.5 text-slate-700">
              <p>
                تمام پاکستانی شہریوں کے لیے اصل قومی شناختی کارڈ (CNIC) اور غیر ملکی یا اوورسیز پاکستانیوں کے لیے درست پاسپورٹ اور ویزا ہمراہ رکھنا لازمی ہے۔ بابوسر، دیامر، کوہستان اور جگلوٹ کے چیک پوائنٹس پر شناختی جانچ پڑتال کی جاتی ہے۔
              </p>
            </div>
          </section>

          {/* Support Information Box */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-6 space-y-2 text-xs text-slate-700">
            <p><strong>پلیٹ فارم:</strong> {siteConfig.name} (آن لائن ٹورازم مارکیٹ پلیس)</p>
            {supportEmail && (
              <p>
                <strong>سپورٹ ای میل:</strong>{" "}
                <a href={`mailto:${supportEmail}`} className="text-emerald-700 underline font-medium">
                  {supportEmail}
                </a>
              </p>
            )}
            <p><strong>سپورٹ ڈیسک کے اوقات:</strong> {siteConfig.contact.supportHours.humanEmail}</p>
            <p><strong>اے آئی اسسٹنٹ:</strong> 24 گھنٹے ہر صفحے پر دستیاب ہے</p>
            <div className="pt-2 flex items-center gap-4 text-emerald-700 font-semibold">
              <Link href="/ur/about" className="hover:underline">ہمارے متعلق &larr;</Link>
              <Link href="/list-your-tour" className="hover:underline">اپنا ٹور یا ہوٹل رجسٹر کریں &larr;</Link>
              <Link href="/ur/privacy" className="hover:underline">پرائیویسی پالیسی &larr;</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
