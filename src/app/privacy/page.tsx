import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Security | Pakistan Travel Agency",
  description: "Learn how PakistanTravel.Agency collects, encrypts, and protects your personal information and transaction details when booking tours in Pakistan.",
  alternates: {
    canonical: "/privacy",
    languages: {
      "en-PK": "/privacy",
      "ur-PK": "/ur/privacy",
    },
  },
};

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

          <h2 className="text-base font-bold text-slate-900">Payment Security &amp; No Card Storage</h2>
          <p>
            Payment transactions via JazzCash, EasyPaisa, and Credit/Debit Cards (Stripe) are processed directly over PCI-DSS certified encrypted gateways. PakistanTravel.Agency never stores or logs your raw payment credentials or credit card numbers.
          </p>

          <h2 className="text-base font-bold text-slate-900">Data Protection Officer &amp; Inquiries</h2>
          <p>
            You have the right to request access to or deletion of your stored profile and booking history at any time.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 space-y-1 text-xs">
            <p><strong>Data Controller:</strong> PakistanTravel.Agency Technologies (Private) Limited {/* TODO: CONFIRM_LEGAL_CONTROLLER_ENTITY */}</p>
            <p><strong>Data Protection Officer:</strong> Compliance Dept, Floor 4, Evacuee Trust Complex, Islamabad {/* TODO: APPOINT_OR_UPDATE_DPO_CONTACT */}</p>
            <p><strong>Email:</strong> privacy@pakistantravel.agency / pakistantravel.agency26@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
