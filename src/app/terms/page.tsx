import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

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
        </div>
      </div>
    </div>
  );
}
