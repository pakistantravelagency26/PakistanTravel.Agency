import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Privacy & Data</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last updated: November 2026</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pt-4 border-t border-slate-100">
          <p>
            At PakistanTravel.Agency, your personal information is protected under industry-standard 256-bit encryption. We only collect details necessary for issuing valid travel vouchers, road permit clearances, and processing secure transactions.
          </p>
          <h2 className="text-base font-bold text-slate-900">Information We Collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Contact Information: Full Name, Email, and WhatsApp Phone Number.</li>
            <li>Verification Details: CNIC or Passport numbers required by Pakistani law for hotel check-ins.</li>
            <li>Booking Preferences: Travel dates, room configurations, and dietary requirements.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
