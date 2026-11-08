import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  CreditCard, 
  AlertTriangle, 
  Handshake, 
  HelpCircle 
} from "lucide-react";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pakistantravel-agency.vercel.app";

export const metadata: Metadata = {
  title: "Terms of Service & Marketplace Policy",
  description:
    "Official marketplace terms of service, booking policies, operator independent contractor status, cancellation policies, and liability limitations on PakistanTravel.Agency.",
  alternates: {
    canonical: `${siteUrl}/terms`,
    languages: {
      "en-PK": `${siteUrl}/terms`,
      "ur-PK": `${siteUrl}/ur/terms`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/terms`,
    siteName: siteConfig.name,
    title: "Terms of Service & Marketplace Policy | PakistanTravel.Agency",
    description:
      "Marketplace terms of service, independent operator relationships, booking contracts, and liability limitations on PakistanTravel.Agency.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
        width: 1200,
        height: 630,
        alt: "PakistanTravel.Agency Terms of Service & Marketplace Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service & Marketplace Policy | PakistanTravel.Agency",
    description:
      "Marketplace terms of service, booking contracts, and liability limitations on PakistanTravel.Agency.",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200"],
  },
};

export default function TermsPage() {
  const supportEmail = siteConfig.contact.supportEmail;

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
        name: "Terms of Service",
        item: `${siteUrl}/terms`,
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200/80 space-y-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Marketplace Agreement</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Terms of Service &amp; Booking Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last updated: Autumn 2026 · {siteConfig.name}</p>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs sm:text-sm text-sky-900 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Important Notice Regarding Platform Role:</p>
            <p className="mt-0.5 text-sky-800">
              {siteConfig.name} is an online booking intermediary technology platform connecting independent travelers with registered local tour operators, transport owners, and hotel providers across Pakistan. Please read these terms carefully before placing a booking.
            </p>
          </div>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1. Platform Role &amp; The Direct Booking Contract</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Intermediary Platform Only:</strong> {siteConfig.name} operates strictly as an intermediary technology marketplace. We are not a travel agency, tour operator, transport company, mountain guiding outfit, or travel insurance provider.
              </p>
              <p>
                <strong>Direct Contract:</strong> When you place a booking through the platform, the legal service contract for the tour, hotel room, or transport service is formed directly between you (the Traveler) and the independent service provider (the Vendor / Operator). The Operator is solely responsible for fulfilling the travel service according to the published itinerary.
              </p>
              <p>
                <strong>Voucher Issuance:</strong> A booking request is considered confirmed and an official confirmed voucher with host contact details is issued only upon receipt and verification of advance deposit or full payment.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Handshake className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>2. Independent Contractor Status of Vendors</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Independent Businesses:</strong> All vendors (tour companies, mountain guides, hotel owners, and jeep drivers) listing on {siteConfig.name} are independent business contractors. They are neither employees, agents, joint venturers, nor representatives of {siteConfig.name}.
              </p>
              <p>
                <strong>Vendor Compliance &amp; Licenses:</strong> Vendors are solely responsible for obtaining and maintaining their own business registrations, Department of Tourist Services (DTS) or regional tourism department licenses, local permits, vehicle fitness certificates, and tax filings (SECP/FBR). Any license number shown on an operator&apos;s listing or profile is self-reported by the operator.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>3. Platform Responsibilities: Payments &amp; Support</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                While {siteConfig.name} does not operate the on-ground tours, we actively safeguard the marketplace experience through:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Payment Collection &amp; Holding:</strong> Collecting guest deposits via local Pakistani payment channels (JazzCash, EasyPaisa, Pakistani credit/debit cards, and direct bank transfers) and releasing funds to operators according to agreed payout milestones.
                </li>
                <li>
                  <strong>Voucher &amp; Contact Protection:</strong> Issuing verifiable booking vouchers and safely sharing host contact coordination numbers once a booking is confirmed.
                </li>
                <li>
                  <strong>Cancellation &amp; Refund Enforcement:</strong> Ensuring refunds are strictly calculated and processed in accordance with the platform&apos;s cancellation policy.
                </li>
                <li>
                  <strong>Customer Assistance:</strong> Providing our 24/7 AI travel desk and human email support desk for resolving discrepancies.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>4. Standardized Cancellation &amp; Refund Policy</span>
            </h2>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <p className="font-semibold text-emerald-950">
                To protect both travelers and local operators who incur upfront logistics costs, the following policy applies to all marketplace bookings:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-700 block text-sm">100% Refund</span>
                  <span className="text-slate-600">7 or more days before departure</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-700 block text-sm">50% Refund</span>
                  <span className="text-slate-600">3 to 6 days before departure</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200">
                  <span className="font-bold text-rose-700 block text-sm">No Refund</span>
                  <span className="text-slate-600">Less than 72 hours before departure</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Note: Non-refundable policies within 72 hours reflect committed mountain hotel rooms, 4x4 jeep reservations, and permit disbursements made on your behalf.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>5. Mountain Logistics &amp; Limitation of Liability</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Unpredictable High-Altitude Conditions:</strong> Northern Pakistan travel involves alpine terrain subject to rapid weather shifts, heavy snow, rockfall, landslides, and road closures (including Babusar Pass, Karakoram Highway / KKH, Lowari Tunnel, or Skardu Highway), as well as weather-dependent domestic flight cancellations (Gilgit and Skardu airports).
              </p>
              <p>
                <strong>Force Majeure &amp; Route Modifications:</strong> Neither {siteConfig.name} nor the tour operator can be held financially liable for trip delays, missed flights, or alternative routing required due to natural landslides, road blockades, official security directives, or severe weather. Operators reserve the right to modify routes for guest safety.
              </p>
              <p>
                <strong>Limitation of Liability:</strong> To the maximum extent permitted by applicable law, {siteConfig.name} shall not be liable for any direct, indirect, punitive, or consequential damages resulting from operator default, personal injury, sickness, vehicle mechanical failure, lost luggage, or high-altitude illness. Travelers are strongly advised to obtain comprehensive personal travel and health insurance.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>6. Anti-Circumvention &amp; Platform Integrity</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Platform Integrity:</strong> To protect the safety, secure deposit protection, and dispute resolution guarantees offered by {siteConfig.name}, travelers and registered vendors agree not to circumvent the platform.
              </p>
              <p>
                <strong>No Off-Platform Booking:</strong> Users agree not to exchange direct private phone numbers or bank accounts prior to a confirmed booking, nor solicit off-platform cash transactions for listings found through the marketplace. Violating this clause terminates buyer dispute protection and may result in vendor expulsion.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600 shrink-0" />
              <span>7. Mandatory Travel Documents &amp; Checkpoints</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                All Pakistani citizens traveling to Gilgit-Baltistan, Azad Kashmir, or Khyber Pakhtunkhwa must carry their original valid CNIC. International visitors and overseas Pakistanis (NICOP) must carry valid original passports and relevant tourist visas. Checkpoints at Babusar Top, Diamer, Kohistan, and Jaglot require identity registration.
              </p>
            </div>
          </section>

          {/* Support Information Box */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-6 space-y-2 text-xs text-slate-700">
            <p><strong>Platform:</strong> {siteConfig.name} (Online Multi-Vendor Tourism Marketplace)</p>
            {supportEmail && (
              <p>
                <strong>Support Desk Email:</strong>{" "}
                <a href={`mailto:${supportEmail}`} className="text-sky-700 underline font-medium">
                  {supportEmail}
                </a>
              </p>
            )}
            <p><strong>Customer Inquiries Desk:</strong> {siteConfig.contact.supportHours.humanEmail}</p>
            <p><strong>Instant Inquiries:</strong> 24/7 AI Travel Assistant available on every page</p>
            <div className="pt-2 flex items-center gap-4 text-sky-700 font-semibold">
              <Link href="/partner-info" className="hover:underline">Partner Information &rarr;</Link>
              <Link href="/list-your-tour" className="hover:underline">List Your Tour / Hotel &rarr;</Link>
              <Link href="/privacy" className="hover:underline">Privacy Policy &rarr;</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
