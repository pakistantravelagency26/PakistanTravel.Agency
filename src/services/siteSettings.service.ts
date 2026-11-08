import { prisma } from "@/lib/prisma";
import { siteConfig, COMMISSION_PERCENT, PAYOUT_TIMING } from "@/config/site";

export interface GeneralSettings {
  siteName: string;
  tagline: string;
  phonePrimary: string;
  phoneHelpline: string;
  whatsappNumber: string;
  supportEmail: string;
  address: string;
  dtsLicense: string;
  workingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

export interface HeroSettings {
  badgeText: string;
  title: string;
  subtitle: string;
  bgImage: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  badge1Title: string;
  badge1Sub: string;
  badge2Title: string;
  badge2Sub: string;
  badge3Title: string;
  badge3Sub: string;
}

export interface AnnouncementSettings {
  isEnabled: boolean;
  text: string;
  linkText: string;
  linkUrl: string;
}

export interface MarketplaceSectionSettings {
  badgeText: string;
  title: string;
  subtitle: string;
  emptyStateTitle: string;
  emptyStateDesc: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  url: string;
}

export interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
}

export interface FooterSettings {
  aboutText: string;
  copyrightNotice: string;
  emergencyPhone: string;
  headOfficeText: string;
  card1Title: string;
  card1Desc: string;
  card2Title: string;
  card2Desc: string;
  card3Title: string;
  card3Desc: string;
  col1Title: string;
  col1Links: FooterLinkItem[];
  col2Title: string;
  col2Links: FooterLinkItem[];
  col3Title: string;
  col3Links: FooterLinkItem[];
  col4Title: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface VerificationStep {
  step: string;
  title: string;
  desc: string;
}

export interface PageVerificationSettings {
  heading: string;
  subheading: string;
  steps: VerificationStep[];
}

export interface PageAboutSettings {
  heading: string;
  subheading: string;
  mission: string;
  vision: string;
  story: string;
  corporateName: string;
  secpCuin: string;
  fbrNtn: string;
  registeredOffice: string;
}

export interface PageTermsSettings {
  bookingPolicy: string;
  cancellationPolicy: string;
  safetyGuidelines: string;
  liabilityNotice: string;
}

export interface PagePrivacySettings {
  privacyStatement: string;
  paymentSecurity: string;
  contactProtection: string;
}

export interface PageDestinationsSettings {
  badgeText: string;
  heading: string;
  subheading: string;
}

export interface PageBlogSettings {
  badgeText: string;
  heading: string;
  subheading: string;
}

export const DEFAULT_SITE_SETTINGS = {
  GENERAL: {
    siteName: "PakistanTravel.Agency",
    tagline: "Northern Pakistan Tours, Hotels & Mountain Expeditions",
    phonePrimary: "",
    phoneHelpline: "",
    whatsappNumber: "",
    supportEmail: "support@pakistantravel.agency",
    address: "",
    dtsLicense: "",
    workingHours: "Mon - Sat, 9:00 AM - 6:00 PM PKT",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    youtubeUrl: "https://youtube.com",
  } as GeneralSettings,

  HERO: {
    badgeText: "Northern Pakistan Multi-Vendor Travel Marketplace",
    title: "Discover Pakistan's Majestic Mountains & Valleys",
    subtitle: "Compare and book tour packages and mountain stays directly from independent local operators across northern Pakistan.",
    bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=75",
    stat1Value: "Local",
    stat1Label: "Independent Operators",
    stat2Value: "Direct",
    stat2Label: "Transparent Rates",
    stat3Value: "24/7",
    stat3Label: "AI Travel Assistant",
    badge1Title: "Independent Local Operators",
    badge1Sub: "Regional Partner Network · Partner Information",
    badge2Title: "Local & Card Payments",
    badge2Sub: "JazzCash, EasyPaisa, Bank Transfer & Cards",
    badge3Title: "Customer Support Desk",
    badge3Sub: "24/7 AI Chat · Email Desk Mon-Sat",
  } as HeroSettings,

  NAVBAR_LINKS: [
    { id: "nav-1", label: "Hunza", url: "/destinations/hunza" },
    { id: "nav-2", label: "Skardu", url: "/destinations/skardu" },
    { id: "nav-3", label: "Swat", url: "/destinations/swat" },
    { id: "nav-4", label: "Kumrat", url: "/destinations/kumrat" },
    { id: "nav-5", label: "Tours", url: "/search?type=TOUR" },
    { id: "nav-6", label: "Hotels", url: "/search?type=HOTEL" },
    { id: "nav-7", label: "Blog", url: "/blog" },
  ] as NavLinkItem[],

  ANNOUNCEMENT: {
    isEnabled: true,
    text: "Autumn & Early Winter 2026 Season Booking Open across Skardu, Hunza & Swat!",
    linkText: "Explore Tours",
    linkUrl: "/search",
  } as AnnouncementSettings,

  MARKETPLACE_SECTION: {
    badgeText: "Multi-Vendor Tourism Marketplace",
    title: "Explore Northern Tours & Luxury Stays",
    subtitle: "Compare tour packages and mountain resorts from independent local operators across Pakistan",
    emptyStateTitle: "Marketplace Ready for Listings",
    emptyStateDesc: "No active tours or hotel stays currently published. New partner listings will appear here upon approval.",
  } as MarketplaceSectionSettings,

  FOOTER: {
    aboutText: "PakistanTravel.Agency is an online multi-vendor tourism marketplace connecting travelers with independent local tour operators and family-run hotels across northern Pakistan.",
    copyrightNotice: "© 2026 PakistanTravel.Agency. All rights reserved.",
    emergencyPhone: "",
    headOfficeText: "",
    card1Title: "Independent Local Partners",
    card1Desc: "Local operators and hotels publish and manage their own listings and itineraries.",
    card2Title: "JazzCash, EasyPaisa & Cards",
    card2Desc: "Simple local Pakistani payments with confirmed check-in voucher issuance upon verification.",
    card3Title: "Customer Support Desk",
    card3Desc: "AI assistant available 24/7; email support during business working hours.",
    col1Title: "Popular Destinations",
    col1Links: [
      { id: "c1-1", label: "Hunza Valley & Attabad Lake", url: "/destinations/hunza" },
      { id: "c1-2", label: "Skardu & Deosai Plains", url: "/destinations/skardu" },
      { id: "c1-3", label: "Swat Valley & Kalam", url: "/destinations/swat" },
      { id: "c1-4", label: "Kumrat Valley & Dir", url: "/destinations/kumrat" },
      { id: "c1-5", label: "Murree & Bhurban Resorts", url: "/destinations/murree" },
      { id: "c1-6", label: "Neelum Valley (Azad Kashmir)", url: "/destinations/neelum" },
    ],
    col2Title: "Experience Categories",
    col2Links: [
      { id: "c2-1", label: "Luxury Hotels & Resorts", url: "/search?type=HOTEL" },
      { id: "c2-2", label: "Guided Northern Tours", url: "/search?type=TOUR" },
      { id: "c2-3", label: "4x4 Mountain Jeeps & Rentals", url: "/search?type=RENTAL" },
      { id: "c2-4", label: "All Regional Destinations", url: "/destinations" },
      { id: "c2-5", label: "Northern Travel Guides & Tips", url: "/blog" },
    ],
    col3Title: "Platform Information",
    col3Links: [
      { id: "c3-1", label: "Partner Information", url: "/partner-info" },
      { id: "c3-2", label: "List Your Tour / Hotel", url: "/list-your-tour" },
      { id: "c3-3", label: "Direct Operator Rates", url: "/faq#operator-rates" },
      { id: "c3-4", label: "Cancellation Policy", url: "/terms" },
      { id: "c3-5", label: "About PakistanTravel.Agency", url: "/about" },
      { id: "c3-6", label: "Contact Customer Desk", url: "/contact" },
      { id: "c3-7", label: "Travel Blog & Insights", url: "/blog" },
    ],
    col4Title: "Support & Inquiries",
  } as FooterSettings,

  FAQS: [
    {
      id: "faq-1",
      q: "What documents are required to travel to Hunza & Skardu?",
      a: "All Pakistani citizens must carry their original CNIC. Overseas Pakistanis (NICOP) and international tourists should carry valid original passports and relevant visas. Security checkpoints at Babusar Top, Diamer, and Gilgit require verification.",
    },
    {
      id: "faq-2",
      q: "How does payment work on PakistanTravel.Agency?",
      a: "We support JazzCash, EasyPaisa, Direct Bank Transfer (IBAN), and Pakistani Debit/Credit cards. Travelers pay direct operator rates with zero booking fees. Operator disbursements are processed to verified Pakistani commercial bank accounts within 48 hours of departure or check-in.",
    },
    {
      id: "faq-direct-rates",
      q: "What is the Direct Operator Rates Policy?",
      a: `All tours and hotel rooms listed on PakistanTravel.Agency are priced directly by the local operators and hotel owners themselves. We do not inflate or mark up operator prices for travelers. Travelers pay direct local rates with zero booking fees. A flat ${COMMISSION_PERCENT}% platform commission is deducted from the operator's payout on completed bookings.`,
    },
    {
      id: "faq-operator-payout",
      q: "When and how are operators paid for bookings?",
      a: `Operator payouts are disbursed ${PAYOUT_TIMING} via direct Pakistani commercial bank transfer (IBAN). The platform deducts the ${COMMISSION_PERCENT}% platform commission and applicable payment gateway processing fees from the gross booking amount.`,
    },
    {
      id: "faq-cancellation",
      q: "What is your cancellation and refund policy?",
      a: "Our standardized marketplace policy applies to all bookings: 100% full refund for cancellations made 7 or more days before departure; 50% refund for cancellations between 3 and 6 days before departure; non-refundable within 72 hours of departure due to pre-committed mountain transport and accommodation allocations.",
    },
    {
      id: "faq-vouchers",
      q: "When is my confirmed booking voucher issued?",
      a: "When you submit a reservation request, your booking is recorded in 'Booking Request Received' status. Your official confirmed voucher—complete with the host's direct contact and trip coordination details—is issued immediately once your payment deposit or transfer is confirmed.",
    },
    {
      id: "faq-amenities",
      q: "Do all accommodations have 24/7 power backup and heating?",
      a: "Amenities vary significantly by property, valley, and seasonal altitude. Many northern hotels operate generators during local load shedding hours and offer room heating either included or for an optional seasonal surcharge. Please review the specific amenities listed on each hotel page prior to reserving.",
    },
    {
      id: "faq-guides",
      q: "Who operates the tours and are guides licensed?",
      a: "PakistanTravel.Agency is an online technology intermediary. All expeditions, transport, and stays are fulfilled directly by independent local tour operators and family-run hotels. Operators submit their business details and, where applicable, their Department of Tourist Services (DTS) or provincial registrations, which are displayed on their profile as self-reported information.",
    },
  ] as FaqItem[],

  PAGE_VERIFICATION: {
    heading: "Partner Information & Standards",
    subheading: "How independent tour operators and hotels publish listings and manage bookings on PakistanTravel.Agency.",
    steps: [
      {
        step: "01",
        title: "Operator Profile Submission",
        desc: "Independent tour operators and hotel owners register with their business details, local contact person, and operational cities.",
      },
      {
        step: "02",
        title: "Self-Reported Registration Details",
        desc: "Operators may provide their regional registration or license number, which is displayed on their profile as provided by the operator.",
      },
      {
        step: "03",
        title: "Listing Management & Pricing",
        desc: "Operators configure their own itineraries, seasonal dates, pricing, and hotel room tiers directly through the partner extranet.",
      },
      {
        step: "04",
        title: "Customer Reviews & Community Feedback",
        desc: "Actual travelers share feedback and star ratings following completed trips, giving future travelers firsthand community insights.",
      },
    ],
  } as PageVerificationSettings,

  PAGE_ABOUT: {
    heading: "Connecting Travelers with Northern Pakistan Tourism",
    subheading: "An online marketplace bringing together independent local tour operators, family-run hotels, and travelers seeking authentic northern adventures.",
    mission: "Our mission is to provide local mountain tour guides and family-run hotels across Gilgit-Baltistan and Khyber Pakhtunkhwa with modern digital booking tools while offering travelers transparent pricing.",
    vision: "To be a reliable, easy-to-use travel marketplace connecting travelers with independent regional operators.",
    story: "PakistanTravel.Agency was created to make northern Pakistan travel planning straightforward. By connecting travelers directly with local service providers on a unified digital platform, we make exploring Pakistan's majestic mountains more accessible.",
    corporateName: "",
    secpCuin: "",
    fbrNtn: "",
    registeredOffice: "",
  } as PageAboutSettings,

  PAGE_TERMS: {
    bookingPolicy: "PakistanTravel.Agency is an online booking intermediary. Listings are published and fulfilled by independent local operators. Advance deposit or payment confirmation is required to lock dates and generate your confirmed check-in voucher.",
    cancellationPolicy: "100% refund for cancellations made 7 or more days before departure. 50% refund for cancellations made between 3 and 6 days before departure. Non-refundable within 72 hours of departure due to pre-committed mountain transport and accommodation logistics.",
    safetyGuidelines: "All travelers must carry valid original CNIC or Passport. Mountain travel is subject to weather conditions and local authority road clearances.",
    liabilityNotice: "PakistanTravel.Agency acts solely as an intermediary marketplace. Independent operators are responsible for service delivery, local permits, vehicle safety, and listing accuracy.",
  } as PageTermsSettings,

  PAGE_PRIVACY: {
    privacyStatement: "We take your privacy seriously. Your personal contact details and CNIC/Passport information are shared strictly with the executing tour operator for hotel check-ins and security clearances.",
    paymentSecurity: "Payments made via JazzCash, EasyPaisa, or bank gateways are processed securely. We never store payment PINs or CVVs.",
    contactProtection: "We do not sell or rent traveler phone numbers or email addresses to third-party marketing companies.",
  } as PagePrivacySettings,

  PAGE_DESTINATIONS: {
    badgeText: "Discover Northern Pakistan",
    heading: "Top Travel Destinations in Pakistan",
    subheading: "Explore comprehensive destination guides, seasonal advice, approximate costs, and tours offered by local mountain operators.",
  } as PageDestinationsSettings,

  PAGE_BLOG: {
    badgeText: "Northern Travel Insights & Guides",
    heading: "Pakistan Travel Blog & Expeditions",
    subheading: "Essential trip planning advice, real seasonal costs, route conditions, and gear checklists curated by mountain travel writers.",
  } as PageBlogSettings,
};

export type SiteSettingsKey = keyof typeof DEFAULT_SITE_SETTINGS;

export async function getSiteSettings(key?: SiteSettingsKey): Promise<any> {
  try {
    if (key) {
      const record = await prisma.siteSetting.findUnique({
        where: { key },
      });
      if (record && record.value) {
        if (Array.isArray(DEFAULT_SITE_SETTINGS[key])) {
          return Array.isArray(record.value) ? record.value : DEFAULT_SITE_SETTINGS[key];
        }
        return { ...DEFAULT_SITE_SETTINGS[key], ...(record.value as object) };
      }
      return DEFAULT_SITE_SETTINGS[key];
    }

    // Load all settings
    const records = await prisma.siteSetting.findMany();
    const result: Record<string, any> = { ...DEFAULT_SITE_SETTINGS };

    records.forEach((r) => {
      if (r.key in DEFAULT_SITE_SETTINGS) {
        const defaultVal = DEFAULT_SITE_SETTINGS[r.key as SiteSettingsKey];
        if (Array.isArray(defaultVal)) {
          result[r.key] = Array.isArray(r.value) ? r.value : defaultVal;
        } else {
          result[r.key] = {
            ...defaultVal,
            ...(r.value as object),
          };
        }
      }
    });

    return result;
  } catch (error) {
    console.error("Failed to load site settings from DB, using defaults:", error);
    return key ? DEFAULT_SITE_SETTINGS[key] : DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSetting(key: string, value: any): Promise<any> {
  const updated = await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return updated.value;
}
