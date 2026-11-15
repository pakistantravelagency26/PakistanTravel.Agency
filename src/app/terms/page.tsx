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
import { siteConfig, SITE_URL, COMMISSION_PERCENT } from "@/config/site";

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Terms of Service & Booking Policy",
  description:
    "Read marketplace terms of service, independent operator obligations, cancellation rules, payment processing terms, and liability limits on PakistanTravel.",
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/terms`,
    siteName: "PakistanTravel",
    title: "Terms of Service & Booking Policy",
    description:
      "Read marketplace terms of service, independent operator obligations, cancellation rules, payment processing terms, and liability limits on PakistanTravel.",
    images: [
      {
        url: `${siteUrl}/images/og/home-og.jpg`,
        width: 1200,
        height: 630,
        alt: "PakistanTravel Terms of Service & Marketplace Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service & Booking Policy",
    description:
      "Read marketplace terms of service, independent operator obligations, cancellation rules, payment processing terms, and liability limits on PakistanTravel.",
    images: [`${siteUrl}/images/og/home-og.jpg`],
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
          <p className="text-xs text-slate-500 mt-1">Last updated: November 15, 2026 · {siteConfig.name}</p>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs sm:text-sm text-sky-900 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Important Notice Regarding Platform Role:</p>
            <p className="mt-0.5 text-sky-800">
              {siteConfig.name} is an online booking intermediary technology platform connecting independent travelers with independent local tour operators, transport owners, and guides across Pakistan. Please read these terms carefully before placing a booking.
            </p>
          </div>
        </div>

                {/* Table of Contents */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <p className="font-bold text-xs uppercase tracking-wider text-slate-700">Table of Contents</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a href="#section-1" className="text-sky-600 hover:underline">1. Platform Role & Booking Contract</a>
            <a href="#section-2" className="text-sky-600 hover:underline">2. Independent Status of Vendors</a>
            <a href="#section-3" className="text-sky-600 hover:underline">3. Payments, Commission & Payouts</a>
            <a href="#section-4" className="text-sky-600 hover:underline">4. Standardized Cancellation Policy</a>
            <a href="#section-5" className="text-sky-600 hover:underline">5. Mountain Logistics & Liability</a>
            <a href="#section-6" className="text-sky-600 hover:underline">6. Anti-Circumvention Integrity</a>
            <a href="#section-7" className="text-sky-600 hover:underline">7. Mandatory Travel Documents</a>
            <a href="#section-8" className="text-sky-600 hover:underline">8. User Accounts & Security</a>
            <a href="#section-9" className="text-sky-600 hover:underline">9. Prohibited Activities</a>
            <a href="#section-10" className="text-sky-600 hover:underline">10. Dispute Resolution</a>
            <a href="#section-11" className="text-sky-600 hover:underline">11. Governing Law & Jurisdiction</a>
            <a href="#section-12" className="text-sky-600 hover:underline">12. Modifications to Terms</a>
          </div>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span id="section-1">1. Platform Role &amp; The Direct Booking Contract</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Intermediary Platform Only:</strong> {siteConfig.name} operates strictly as an intermediary technology marketplace. We are not a travel agency, tour operator, transport company, mountain guiding outfit, or travel insurance provider.
              </p>
              <p>
                <strong>Direct Contract:</strong> When you place a booking through the platform, the legal service contract for the guided tour package is formed directly between you (the Traveler) and the independent service provider (the Tour Operator). The Operator is solely responsible for fulfilling the travel service according to the published itinerary.
              </p>
              <p>
                <strong>Voucher Issuance:</strong> A booking request is considered confirmed and an official confirmed voucher with operator contact details is issued only upon receipt and verification of advance deposit or full payment.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Handshake className="w-4 h-4 text-emerald-600 shrink-0" />
              <span id="section-2">2. Independent Contractor Status of Vendors</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Independent Businesses:</strong> All vendors (tour operators, transport owners and guides) listing on {siteConfig.name} are independent business contractors. They are neither employees, agents, joint venturers, nor representatives of {siteConfig.name}.
              </p>
              <p>
                <strong>Vendor Compliance &amp; Licenses:</strong> Vendors are solely responsible for obtaining and maintaining their own business registrations, Department of Tourist Services (DTS) or regional tourism department licenses, local permits, vehicle fitness certificates, and tax filings (SECP/FBR). Any license number shown on an operator&apos;s listing or profile is self-reported by the operator.
              </p>
            </div>
          </section>

          {/* Section 3: Payments, Platform Commission and Payouts */}
          {/* DRAFT - NEEDS LEGAL REVIEW BY PAKISTANI COUNSEL. Single source of truth: src/config/site.ts */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
              <span id="section-3">3. Payments, Platform Commission and Operator Payouts</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                {siteConfig.name} operates as a multi-vendor booking intermediary technology platform. The financial and settlement terms are governed as follows:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Traveler Booking Fees:</strong> Travelers pay the direct operator listing price. The platform charges zero booking fees to travelers.
                </li>
                <li>
                  <strong>Platform Commission:</strong> A flat {COMMISSION_PERCENT}% platform commission is deducted from the gross booking value upon completed reservations. Travelers pay the direct operator listing price with zero platform booking fees. Operators receive their guaranteed demanded base rate net of applicable payment processing charges.
                </li>
                <li>
                  <strong>Payment Processing Fees:</strong> Third-party payment gateway and transaction processing fees (including JazzCash, debit/credit card merchant fees, or interbank IBFT charges) are deducted separately from operator disbursements.
                </li>
                <li>
                  <strong>Payout Timing &amp; Settlement:</strong> Operator disbursements are initiated {siteConfig.marketplace.payoutTiming} via direct Pakistani commercial bank transfer (IBAN). Payouts are contingent upon the traveler successfully checking in or commencing the tour without unresolved failure of service.
                </li>
                <li>
                  <strong>Voucher &amp; Contact Protection:</strong> Verifiable booking check-in vouchers and host contact coordination details are issued immediately upon confirmation of guest deposit or payment.
                </li>
                <li>
                  <strong>Cancellation &amp; Refund Enforcement:</strong> Refunds are strictly calculated and processed in accordance with Section 4 below.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
              <span id="section-4">4. Standardized Cancellation &amp; Refund Policy</span>
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
                Note: Non-refundable policies within 72 hours reflect committed mountain accommodation, 4x4 transport allocations, and permit disbursements made on your behalf.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span id="section-5">5. Mountain Logistics &amp; Limitation of Liability</span>
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
              <span id="section-6">6. Anti-Circumvention &amp; Platform Integrity</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Platform Integrity:</strong> To protect the safety, secure deposit protection, and dispute resolution protections offered by {siteConfig.name}, travelers and registered vendors agree not to circumvent the platform.
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
              <span id="section-7">7. Mandatory Travel Documents &amp; Checkpoints</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                All Pakistani citizens traveling to Gilgit-Baltistan, Azad Kashmir, or Khyber Pakhtunkhwa must carry their original valid CNIC. International visitors and overseas Pakistanis (NICOP) must carry valid original passports and relevant tourist visas. Checkpoints at Babusar Top, Diamer, Kohistan, and Jaglot require identity registration.
              </p>
            </div>
          </section>

                    {/* Section 8 */}
          {/* DRAFT - NEEDS LEGAL REVIEW BY PAKISTANI COUNSEL */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span id="section-8">8. User Accounts &amp; Security</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                Travelers and operators creating accounts must provide accurate, current, and complete registration credentials. You are solely responsible for maintaining the confidentiality of your account credentials and password. Any unauthorized access or suspected security compromise must be reported immediately to our support desk.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          {/* DRAFT - NEEDS LEGAL REVIEW BY PAKISTANI COUNSEL */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span id="section-9">9. Prohibited Activities &amp; Content</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                Users agree not to: (a) publish fraudulent, misleading, or unauthorized tour listings; (b) reverse engineer, scrape, or extract platform content or source code; (c) post defamatory, abusive, or culturally insensitive remarks; (d) facilitate unlicensed or unlawful activities in violation of Pakistani law; or (e) attempt to bypass platform communication safeguards.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          {/* DRAFT - NEEDS LEGAL REVIEW BY PAKISTANI COUNSEL */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Handshake className="w-4 h-4 text-emerald-600 shrink-0" />
              <span id="section-10">10. Dispute Resolution &amp; Escalation</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                In the event of a dispute, grievance, or service dissatisfaction arising from a booking, travelers and operators agree to first submit an official support ticket to the platform support desk ({supportEmail || "support@pakistantravel.agency"}). Both parties agree to participate in good-faith administrative mediation and dispute resolution through the platform support team before seeking external legal or formal administrative remedies.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          {/* DRAFT - NEEDS LEGAL REVIEW BY PAKISTANI COUNSEL */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600 shrink-0" />
              <span id="section-11">11. Governing Law &amp; Jurisdiction</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                These Terms of Service and any contractual or non-contractual disputes arising hereunder shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. The competent courts situated in Islamabad, Pakistan, shall have exclusive jurisdiction over any unresolved disputes subject to the initial mediation process.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          {/* DRAFT - NEEDS LEGAL REVIEW BY PAKISTANI COUNSEL */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span id="section-12">12. Modifications to Terms</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                We reserve the right to revise or amend these Terms of Service at any time to reflect operational, legal, or regulatory updates. Continued use of {siteConfig.name} following the publication of revised terms constitutes full acceptance of the updated terms.
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
              <Link href="/list-your-tour" className="hover:underline">List Your Tour Package &rarr;</Link>
              <Link href="/privacy" className="hover:underline">Privacy Policy &rarr;</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
