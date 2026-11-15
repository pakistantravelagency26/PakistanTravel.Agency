import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowLeft, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Users, 
  Database, 
  Trash2, 
  Cookie, 
  AlertTriangle,
  Mail,
  Calendar,
  Clock
} from "lucide-react";
import { siteConfig, SITE_URL } from "@/config/site";

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection",
  description:
    "Comprehensive privacy policy for PakistanTravel. Learn how traveler personal data, booking details, and payment information are handled and protected.",
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/privacy`,
    siteName: "PakistanTravel",
    title: "Privacy Policy & Data Protection | PakistanTravel",
    description:
      "Comprehensive privacy policy for PakistanTravel. Learn how traveler personal data, booking details, and payment information are handled and protected.",
    images: [
      {
        url: `${siteUrl}/images/og/home-og.jpg`,
        width: 1200,
        height: 630,
        alt: "PakistanTravel Data Protection and Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy & Data Protection | PakistanTravel",
    description:
      "Comprehensive privacy policy for PakistanTravel. Learn how traveler personal data, booking details, and payment information are handled and protected.",
    images: [`${siteUrl}/images/og/home-og.jpg`],
  },
};

export default function PrivacyPage() {
  const supportEmail = siteConfig.contact.supportEmail || "support@pakistantravel.agency";
  const lastUpdated = siteConfig.termsLastUpdated || "November 15, 2026";

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
        name: "Privacy Policy",
        item: `${siteUrl}/privacy`,
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-12 rounded-3xl shadow-sm border border-slate-200/80 space-y-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline mb-3">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Platform Compliance</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">Privacy Policy &amp; Data Protection</h1>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
            This Privacy Policy explains how PakistanTravel (&quot;PakistanTravel&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;the Platform&quot;) collects, uses, protects, and discloses personal information when you use our website at{" "}
            <a href={siteUrl} className="text-sky-600 underline font-medium">{siteUrl}</a>, our mobile interfaces, and related tourism marketplace services.
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {/* 1. Data Controller */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>1. Data Controller &amp; Marketplace Intermediary</span>
            </h2>
            <p>
              PakistanTravel operates strictly as an intermediary multi-vendor tourism marketplace facilitating connections between independent travelers and independent local tour operators.
            </p>
            <p>
              The platform is administered by PakistanTravel Operations. Registered business entity details, legal company registration number, and formal legal domicile are recorded as: <strong>TODO: [Platform Operator Legal Business Entity Name, SECP Registration Number, and Registered Physical Office Address]</strong>. For any inquiries regarding personal data processing, you may contact our dedicated privacy officer at{" "}
              <a href={`mailto:${supportEmail}`} className="text-sky-700 underline font-semibold">{supportEmail}</a>.
            </p>
          </section>

          {/* 2. What We Collect */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>2. Information We Collect</span>
            </h2>
            <p>
              We collect information that you directly provide to us, information collected automatically through technical interaction with our services, and information necessary to complete travel reservations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Contact &amp; Account Identifiers:</strong> Full legal name, email address, telephone/mobile WhatsApp number, and password credentials when creating an account or submitting an inquiry.</li>
              <li><strong>Government Identity Documents (Required for Northern Travel):</strong> Computerized National Identity Card (CNIC) numbers for Pakistani citizens, or passport and visa details for international visitors. These details are required by Pakistani provincial authorities, hotel registries, and security checkposts along northern transit corridors (such as Kohistan, Gilgit-Baltistan, and Azad Kashmir).</li>
              <li><strong>Reservation &amp; Travel Logistics:</strong> Departure dates, group size, passenger counts, room category preferences (Sharing Room, Private Room, Solo Room), dietary restrictions, and emergency contact details.</li>
              <li><strong>Transaction &amp; Billing Data:</strong> Transaction reference IDs, deposit payment amounts, selected payment method (e.g., JazzCash, bank transfer, debit/credit card), and timestamp. <em>Note: Full payment card numbers and online banking passwords are never processed or stored on PakistanTravel servers; they are handled directly by PCI-DSS compliant financial processors.</em></li>
              <li><strong>Customer Support &amp; AI Chat Communications:</strong> Transcripts of conversations with our customer service team and automated AI assistant, including tour requests and feedback.</li>
              <li><strong>Technical &amp; Log Data:</strong> IP address, browser type, operating system version, referring URL, time of access, device type, and interaction events.</li>
            </ul>
          </section>

          {/* 3. Purpose */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3. Purposes of Data Processing</span>
            </h2>
            <p>We process personal data only for legitimate, transparent operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Facilitating and confirming tour package reservations between you and your booked independent tour operator.</li>
              <li>Issuing digital tour vouchers containing trip itineraries, meeting points, operator contacts, and deposit receipts.</li>
              <li>Complying with statutory security checkpost and hotel guest registration requirements in northern Pakistan.</li>
              <li>Providing customer support, answering trip inquiries, and handling cancellation or refund requests.</li>
              <li>Detecting, investigating, and preventing fraudulent transactions, platform abuse, or unauthorized access attempts.</li>
              <li>Analyzing anonymous aggregate platform trends to enhance site performance, routing, and user interface responsiveness.</li>
            </ul>
          </section>

          {/* 4. Recipients */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>4. Who Receives Your Data</span>
            </h2>
            <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes. Your data is shared exclusively with:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Your Booked Tour Operator:</strong> The specific independent tour operator whose package you have booked receives traveler names, contact details, traveler counts, and room tiers to coordinate vehicle dispatch, hotel check-in, and tour execution.</li>
              <li><strong>Payment Processors &amp; Banking Partners:</strong> Regulated payment gateways (such as 1Link, JazzCash, Easypaisa, or commercial acquiring banks) to securely verify deposit transactions.</li>
              <li><strong>Transactional Email &amp; SMS Providers:</strong> Cloud delivery partners (such as Resend or AWS SES) to deliver booking confirmations, vouchers, and critical itinerary updates.</li>
              <li><strong>Cloud Hosting &amp; Managed Database Infrastructure:</strong> Secure enterprise cloud service providers (Vercel and Neon PostgreSQL) operating encrypted cloud environments.</li>
              <li><strong>Law Enforcement &amp; Government Checkposts:</strong> State law enforcement agencies, tourism police, and district administrations when strictly required by applicable Pakistani laws, court orders, or travel security directives.</li>
            </ul>
          </section>

          {/* 5. Data Minimization */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>5. Data Minimization &amp; Sensitive Data Security</span>
            </h2>
            <p>
              We practice strict data minimization. Independent tour operators are granted access only to the specific traveler details necessary to execute the contracted tour itinerary.
            </p>
            <p>
              <strong>CNIC &amp; Passport Protection:</strong> Traveler CNIC and passport numbers are strictly restricted. They are never displayed on public vouchers, never included in marketing newsletters, and never exposed in unencrypted communications. CNIC information is retained strictly for security clearance and room allocation protocols mandated by provincial hospitality authorities.
            </p>
          </section>

          {/* 6. Retention */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>6. Data Retention Schedule</span>
            </h2>
            <p>We retain personal information only for as long as necessary to fulfill the purposes outlined in this policy:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Active Booking Records &amp; Invoices:</strong> Retained for the duration of the trip and for up to 5 years following completion to satisfy financial auditing, tax reporting, and dispute resolution requirements under Pakistani law.</li>
              <li><strong>Customer Accounts:</strong> Retained while your account remains active. You may request account closure and deletion at any time.</li>
              <li><strong>Uncompleted Inquiries &amp; Abandoned Drafts:</strong> Purged automatically after 90 days.</li>
              <li><strong>Security &amp; Rate-Limiting Logs:</strong> Technical IP access logs and failed login records are purged after 90 days.</li>
            </ul>
          </section>

          {/* 7. Security */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>7. Technical &amp; Operational Security Measures</span>
            </h2>
            <p>
              We enforce industry-standard administrative, physical, and technical defenses to safeguard your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>All web traffic between your device and PakistanTravel is encrypted in transit using modern Transport Layer Security (TLS 1.3 / HTTPS).</li>
              <li>Database records are stored in enterprise-grade managed PostgreSQL with AES-256 encryption at rest.</li>
              <li>Strict role-based access control (RBAC) ensures administrative and operator portals are isolated with automated rate-limiting, IP lockout policies, and session token rotation.</li>
              <li>We perform routine code audits and dependency vulnerability scanning to prevent unauthorized data exposure.</li>
            </ul>
          </section>

          {/* 8. User Rights */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-emerald-600" />
              <span>8. Your Privacy Rights &amp; How to Request Deletion</span>
            </h2>
            <p>
              You have the right to access, review, update, or request deletion of personal information held by PakistanTravel:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Access &amp; Portability:</strong> You may request a copy of the personal data we store regarding your account and tour bookings.</li>
              <li><strong>Correction:</strong> You may request the rectification of inaccurate or outdated traveler contact details.</li>
              <li><strong>Deletion (Right to be Forgotten):</strong> You may request the deletion of your account and personal identifiers, subject to statutory record-retention requirements for completed financial transactions.</li>
            </ul>
            <p>
              To exercise any of these rights, email your request to{" "}
              <a href={`mailto:${supportEmail}`} className="text-sky-700 underline font-semibold">{supportEmail}</a> with the subject line &quot;Data Subject Request&quot;. We will acknowledge and process verified requests within 30 days.
            </p>
          </section>

          {/* 9. Cookies & Consent Mode v2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cookie className="w-4 h-4 text-emerald-600" />
              <span>9. Cookies &amp; Google Consent Mode v2</span>
            </h2>
            <p>
              PakistanTravel utilizes essential cookies to maintain user authentication sessions, preserve shopping cart states, and remember cookie preferences.
            </p>
            <p>
              We implement Google Consent Mode v2 across all public pages. Analytics storage, ad storage, and personalization cookies remain disabled by default until you provide explicit consent via our on-screen Cookie Preferences banner. You can adjust your consent settings at any time using the &quot;Cookie Preferences&quot; control located in the platform footer.
            </p>
          </section>

          {/* 10. Children */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-emerald-600" />
              <span>10. Protection of Minors</span>
            </h2>
            <p>
              Our marketplace is not intended for use by unsupervised individuals under the age of 18. We do not knowingly collect personal data directly from children. Minors participating in family tour packages must be registered by a parent or legal guardian who provides consent for necessary checkpost and lodging documentation.
            </p>
          </section>

          {/* 11. Contact */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>11. Contact Us &amp; Policy Updates</span>
            </h2>
            <p>
              We may update this Privacy Policy periodically to reflect technological changes, regulatory updates, or operational adjustments. Any updates will be published on this page with a revised &quot;Last Updated&quot; date.
            </p>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-700 mt-2">
              <p><strong>Platform:</strong> {siteConfig.name}</p>
              <p><strong>Privacy Inquiries:</strong> <a href={`mailto:${supportEmail}`} className="text-sky-700 underline font-medium">{supportEmail}</a></p>
              <p><strong>Operating Model:</strong> Multi-vendor marketplace intermediary connecting travelers with independent local tour operators.</p>
              <p><strong>Support Desk:</strong> {siteConfig.contact.supportHours.humanEmail} (PKT)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
