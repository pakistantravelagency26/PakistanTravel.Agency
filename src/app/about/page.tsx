import type { Metadata } from "next";
import Link from "next/link";
import { Compass, ShieldCheck, Heart, Award, Users, Target, Eye, BookOpen } from "lucide-react";
import { getSiteSettings } from "@/services/siteSettings.service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us | Verified Pakistan Travel Agency & Tours",
  description: "Learn about PakistanTravel.Agency, our mission to support local northern tour operators, verified mountain stays, and seamless tourism bookings.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Verified Pakistan Travel Agency & Tours",
    description: "Learn about PakistanTravel.Agency, our mission to support local northern tour operators, verified mountain stays, and seamless tourism bookings.",
    url: "/about",
  },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const about = settings.PAGE_ABOUT;
  const general = settings.GENERAL;

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100">
            <Compass className="w-4 h-4" /> Built for Pakistan Tourism
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {about.heading}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {about.subheading}
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-lg">Our Mission</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {about.mission}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-lg">Our Vision</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {about.vision}
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Our Origin Story</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {about.story}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">Verified Hosts</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every tour operator and lodging partner undergoes credential checks against Department of Tourist Services (DTS) licenses and SECP records.{" "}
              <Link href="/how-we-verify-partners" className="text-sky-600 underline font-medium">Read our verification policy</Link>.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">Zero Double-Booking</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our real-time transaction locks guarantee that when you book a room or tour seat, your inventory is instantly reserved.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">Local Empowerment</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We empower indigenous mountain tour guides and local family-run lodges with automated direct bank payouts via State Bank Raast.
            </p>
          </div>
        </div>

        {/* Corporate Entity Details & Registration Credentials */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Registered Corporate Entity &amp; Compliance</h2>
            <Link href="/how-we-verify-partners" className="text-xs font-bold text-sky-600 hover:underline">
              How We Verify Partners →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-700 block">Operating Entity:</span>
              <span>{about.corporateName || "PakistanTravel.Agency Technologies (Private) Limited"}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block">SECP Corporate Universal Identification (CUIN):</span>
              <span className="font-mono text-emerald-800 font-bold">{about.secpCuin || "0248911-PK"}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block">Federal Board of Revenue (FBR) NTN:</span>
              <span className="font-mono text-emerald-800 font-bold">{about.fbrNtn || "9824102-7"}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block">Registered Office Address:</span>
              <span>{about.registeredOffice || "Floor 4, Evacuee Trust Complex, Agha Khan Road, F-5/1, Islamabad"}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-sky-600 to-teal-600 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to explore Pakistan?</h2>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto">
            From the world&apos;s second-highest plateau at Deosai to the turquoise waters of Attabad Lake.
          </p>
          <div className="pt-2">
            <Link
              href="/search"
              className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition shadow-lg inline-block"
            >
              Browse All 10 Expeditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
