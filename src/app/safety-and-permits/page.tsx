import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  ShieldAlert, 
  FileCheck, 
  HeartPulse, 
  Compass, 
  MapPin, 
  PhoneCall, 
  ChevronRight, 
  AlertTriangle,
  CloudSnow,
  CheckCircle2
} from "lucide-react";

export const revalidate = 3600;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Travel Safety & Permits Guide",
  description:
    "Read essential travel safety advisories, checkpost permit requirements, altitude acclimatization tips, and winter road rules for northern Pakistan.",
  alternates: {
    canonical: `${siteUrl}/safety-and-permits`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/safety-and-permits`,
    siteName: "PakistanTravel",
    title: "Travel Safety & Permits Guide | PakistanTravel",
    description:
      "Read essential travel safety advisories, checkpost permit requirements, altitude acclimatization tips, and winter road rules for northern Pakistan.",
    images: [
      {
        url: `${siteUrl}/images/og/home-og.jpg`,
        width: 1200,
        height: 630,
        alt: "PakistanTravel Mountain Safety and Permits Guidance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Safety & Permits Guide | PakistanTravel",
    description:
      "Read essential travel safety advisories, checkpost permit requirements, altitude acclimatization tips, and winter road rules for northern Pakistan.",
    images: [`${siteUrl}/images/og/home-og.jpg`],
  },
};

export default function SafetyAndPermitsPage() {
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
        name: "Travel Safety & Permits",
        item: `${siteUrl}/safety-and-permits`,
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 pt-12 pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-slate-700 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-semibold">Travel Safety &amp; Permits</span>
          </nav>

          <span className="inline-block bg-amber-50 text-amber-800 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
            Advisories &amp; Compliance
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Northern Pakistan Travel Safety &amp; Permits
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Essential guidelines on mandatory identity documents, security checkpoints, high-altitude health precautions, and seasonal mountain pass accessibility.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 space-y-10 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {/* Section 1: ID & Permits */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            <FileCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold">1. Mandatory Identity Documents &amp; Checkpoints</h2>
          </div>
          <p>
            Northern Pakistan spans diverse administrative jurisdictions—including Khyber Pakhtunkhwa, Gilgit-Baltistan, and Azad Jammu &amp; Kashmir. Security checkpoints are standard along transit highways to verify traveler identification and maintain regional road safety.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm block">Pakistani Citizens</span>
              <p className="text-slate-600">
                You must carry your original <strong>Computerized National Identity Card (CNIC)</strong> or valid Smart Card at all times. Physical photocopies are helpful for faster registration at district checkposts. Minors must carry their original NADRA B-Form.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm block">International Travelers</span>
              <p className="text-slate-600">
                Foreign nationals require a valid <strong>Pakistan Tourist Visa</strong> and passport with at least six months validity. Most primary tourism corridors (Hunza, Skardu city, Swat, Kaghan) are open without special permits, but check prevailing interior ministry guidelines before travel.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            <strong>Restricted Border Zones (NOC Notice):</strong> Non-Objection Certificates (NOC) may be required for specific sensitive border zones near the Line of Control or extreme mountaineering technical zones. Independent tour operators coordinate required local registrations for their groups.
          </p>
        </section>

        {/* Section 2: Altitude & Acclimatization */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold">2. High Altitude &amp; Acclimatization Guidelines</h2>
          </div>
          <p>
            Several popular destinations in Gilgit-Baltistan and northern KP sit well above 2,400 meters, where atmospheric pressure drops and oxygen levels decrease significantly:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Karimabad, Hunza:</strong> ~2,438 meters</li>
            <li><strong>Skardu City:</strong> ~2,228 meters</li>
            <li><strong>Babusar Pass:</strong> ~4,173 meters</li>
            <li><strong>Deosai National Park:</strong> ~4,114 meters</li>
            <li><strong>Khunjerab Pass:</strong> ~4,693 meters</li>
          </ul>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2 text-slate-700">
            <span className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" /> Acclimatization Tips
            </span>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Drink plenty of clean bottled or boiled water; high altitude increases respiratory fluid loss.</li>
              <li>Avoid strenuous uphill hiking during your first 24 hours at elevations exceeding 2,500 meters.</li>
              <li>Recognize symptoms of Acute Mountain Sickness (AMS): persistent headache, dizziness, nausea, and shortness of breath. If symptoms intensify, immediately descend to a lower altitude.</li>
              <li>Consult your physician regarding altitude medications prior to ascending to Deosai Plains or Khunjerab Pass.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Seasonal Passes & Winter Travel */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            <CloudSnow className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold">3. Seasonal Mountain Passes &amp; Winter Road Conditions</h2>
          </div>
          <p>
            Road conditions in northern Pakistan vary dramatically with the seasons. Travelers should understand the distinction between all-weather arterial highways and seasonal mountain passes:
          </p>
          <div className="space-y-3">
            <div className="border border-slate-200 p-4 rounded-2xl">
              <span className="font-bold text-slate-900 block text-sm">Babusar Pass (N-15 Kaghan Route)</span>
              <p className="text-slate-600 mt-1">
                Babusar Pass (4,173m) is strictly seasonal. Heavy snow clears by late June or early July, and winter snow recloses the pass by late October. From November through June, all overland road journeys to Gilgit-Baltistan travel via the Karakoram Highway (N-35) through Besham and Kohistan.
              </p>
            </div>
            <div className="border border-slate-200 p-4 rounded-2xl">
              <span className="font-bold text-slate-900 block text-sm">Winter Snow Travel (Kalam, Malam Jabba, Shogran, Murree)</span>
              <p className="text-slate-600 mt-1">
                During winter snowstorms (December through March), road access to upper Kalam, Siri Paye, and Malam Jabba strictly requires 4x4 vehicles fitted with metallic tire chains. Never attempt icy alpine ascents in standard front-wheel-drive sedans without chains.
              </p>
            </div>
            <div className="border border-slate-200 p-4 rounded-2xl">
              <span className="font-bold text-slate-900 block text-sm">Commercial Flights &amp; Weather Contingencies</span>
              <p className="text-slate-600 mt-1">
                Flights between Islamabad and Gilgit/Skardu operate under Visual Flight Rules (VFR) and are contingent on cloud clearance over the Indus gorge. Always build 1 to 2 buffer days into your schedule to accommodate potential flight delays or overland diversions.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Cultural Etiquette */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            <Compass className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold">4. Cultural Etiquette &amp; Environmental Respect</h2>
          </div>
          <p>
            Mountain communities in northern Pakistan are famous for warm hospitality. To ensure positive and respectful interactions:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Dress Modestly:</strong> Wear clothing that covers shoulders and knees when visiting traditional villages, heritage citadels, and bazaars.</li>
            <li><strong>Ask Permission for Photography:</strong> Always ask politely before taking photographs of local residents, particularly women, elders, and religious shrines. In the Kalash Valleys, strictly observe temple prohibitions and sacred boundaries.</li>
            <li><strong>Leave No Trace:</strong> Mountain ecosystems are fragile. Carry all plastic waste, beverage cans, and snack wrappers back to municipal disposal bins in major towns. Do not litter along pristine glacial lakes or alpine meadows.</li>
          </ul>
        </section>

        {/* Section 5: Emergency Contacts */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            <PhoneCall className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold">5. Important Emergency Helpline Numbers</h2>
          </div>
          <p>Keep these national and regional emergency services saved in your mobile phone prior to departure:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-xs block">Emergency Rescue</span>
              <span className="font-extrabold text-slate-900 text-base">1122 (Ambulance / Rescue)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-xs block">National Highway &amp; Motorway Police</span>
              <span className="font-extrabold text-slate-900 text-base">130 (Help &amp; Road Status)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-xs block">Police Emergency</span>
              <span className="font-extrabold text-slate-900 text-base">15 (National Police)</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            For operational inquiries regarding your booking, contact your tour operator using the direct telephone number listed on your digital tour voucher, or reach our support desk at <Link href="/contact" className="text-sky-600 underline">PakistanTravel Support</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
