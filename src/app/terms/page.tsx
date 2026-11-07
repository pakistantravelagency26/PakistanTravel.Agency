import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service & Booking Policy | Pakistan Travel Agency",
  description: "Read the terms of service, payment policies, cancellation guidelines, and traveler guarantees for booking trips with PakistanTravel.Agency.",
  alternates: {
    canonical: "/terms",
    languages: {
      "en-PK": "/terms",
      "ur-PK": "/ur/terms",
    },
  },
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Legal Agreement</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Terms of Service & Booking Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last updated: November 2026 · PakistanTravel.Agency</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900">1. Marketplace Platform Role</h2>
          <p>
            PakistanTravel.Agency acts as a multi-vendor reservation marketplace connecting independent travelers with registered hotel partners, tour guides, and 4x4 transport operators across Pakistan. All partners are verified by our operations team.
          </p>

          <h2 className="text-base font-bold text-slate-900">2. Booking & Cancellation Policies</h2>
          <p>
            Each tour and hotel listing clearly indicates its specific free cancellation window (e.g. 48 hours, 3 days, or 7 days prior to departure). Cancellations made within the free cancellation window receive a 100% refund.
          </p>

          <h2 className="text-base font-bold text-slate-900">3. Northern Areas Travel Advisory</h2>
          <p>
            Travelers must carry their original Computerized National Identity Card (CNIC) or Passport for verification at security checkpoints (e.g. Babusar Pass, Diamer, Raikot, and Gilgit).
          </p>

          <h2 className="text-base font-bold text-slate-900">4. Payments & Invoicing</h2>
          <p>
            Payments are processed in Pakistani Rupee (PKR) through licensed local rails (JazzCash, EasyPaisa, 1LINK) and international credit/debit card gateways (Stripe). Instant electronic vouchers are issued upon confirmation.
          </p>

          <h2 className="text-base font-bold text-slate-900">5. Mountain Weather, Landslides &amp; Force Majeure</h2>
          <p>
            Travel in northern Pakistan involves natural mountain terrain subject to sudden weather disruptions, rockfalls, or road blockages (particularly at Babusar Pass, Kohistan, or Jaglot). In the event of unforeseen road closures, local operators will provide safe alternate routes (such as via Besham/KKH) or reschedule itineraries in consultation with travelers. PakistanTravel.Agency does not charge modification fees for acts of force majeure.
          </p>

          <h2 className="text-base font-bold text-slate-900">6. High-Altitude Health &amp; Liability</h2>
          <p>
            Certain northern expeditions exceed 3,000 meters above sea level (including Deosai National Park, Khunjerab Pass, and Rush Lake). Travelers are responsible for ensuring personal medical fitness and consulting physicians regarding altitude sickness medications. Operators maintain basic first-aid supplies on ground.
          </p>

          <h2 className="text-base font-bold text-slate-900">7. Corporate Information &amp; Governing Law</h2>
          <p>
            These terms are governed by the laws of the Islamic Republic of Pakistan. Any legal proceedings shall be subject to the exclusive jurisdiction of the competent courts of Islamabad.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 space-y-1 text-xs">
            <p><strong>Company:</strong> PakistanTravel.Agency Technologies (Private) Limited {/* TODO: CONFIRM_LEGAL_COMPANY_NAME */}</p>
            <p><strong>NTN:</strong> 9824102-7 {/* TODO: CONFIRM_NTN */}</p>
            <p><strong>SECP CUIN:</strong> 0248911-PK {/* TODO: CONFIRM_SECP_CUIN */}</p>
            <p><strong>Address:</strong> Floor 4, Evacuee Trust Complex, Blue Area, Islamabad, Pakistan {/* TODO: CONFIRM_REGISTERED_OFFICE_ADDRESS */}</p>
            <p><strong>Legal Inquiries:</strong> pakistantravel.agency26@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
