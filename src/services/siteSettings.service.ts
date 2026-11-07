import { prisma } from "@/lib/prisma";

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
    tagline: "Pakistan's Premier Verified Tourism Marketplace",
    phonePrimary: "+92 322 2327096",
    phoneHelpline: "+92 (51) 111-TRAVEL (872835)",
    whatsappNumber: "+92 322 2327096",
    supportEmail: "pakistantravel.agency26@gmail.com",
    address: "Floor 4, Evacuee Trust Complex, Aga Khan Rd, F-5/1, Islamabad, ICT 44000",
    dtsLicense: "DTS License # 1245-ICT (Government of Pakistan)",
    workingHours: "Mon - Sat, 9am - 8pm PKT",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    youtubeUrl: "https://youtube.com",
  } as GeneralSettings,

  HERO: {
    badgeText: "Pakistan's Premier Verified Travel Network",
    title: "Discover Pakistan's Majestic Mountains & Valleys",
    subtitle: "Discover Pakistan's breathtaking destinations, explore tours from local operators, and book your perfect adventure—all in one place.",
    bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=80",
    stat1Value: "50+",
    stat1Label: "Verified Local Operators",
    stat2Value: "100%",
    stat2Label: "DTS Compliance Audited",
    stat3Value: "24/7",
    stat3Label: "Traveler Assistance Hotline",
    badge1Title: "Licensed Local Operators",
    badge1Sub: "DTS & SECP Vetted · Verified Partners",
    badge2Title: "JazzCash & EasyPaisa",
    badge2Sub: "Plus Credit Cards & Bank Transfer",
    badge3Title: "24/7 Online Support",
    badge3Sub: "WhatsApp & Phone Desk",
  } as HeroSettings,

  ANNOUNCEMENT: {
    isEnabled: true,
    text: "Autumn & Early Winter 2026 Season Booking Open across Skardu, Hunza & Swat!",
    linkText: "Explore Tours",
    linkUrl: "/search",
  } as AnnouncementSettings,

  MARKETPLACE_SECTION: {
    badgeText: "Multi-Vendor Tourism Marketplace",
    title: "Explore Northern Tours & Luxury Stays",
    subtitle: "Compare tour packages and mountain resorts from verified local operators across Pakistan",
    emptyStateTitle: "Marketplace Ready for Listings",
    emptyStateDesc: "No active tours or hotel stays currently published. New partner listings will appear here upon approval.",
  } as MarketplaceSectionSettings,

  FOOTER: {
    aboutText: "PakistanTravel.Agency is the official online multi-vendor tourism marketplace dedicated to promoting sustainable and safe travel across northern Pakistan.",
    copyrightNotice: "© 2026 PakistanTravel.Agency. All rights reserved. Registered with Department of Tourist Services (DTS), Government of Pakistan.",
    emergencyPhone: "+92 322 2327096",
    headOfficeText: "Floor 4, Evacuee Trust Complex, Blue Area, Islamabad, Pakistan",
    card1Title: "Vetted Northern Partners",
    card1Desc: "Operators are verified against DTS licenses and SECP registration records.",
    card2Title: "JazzCash, EasyPaisa & Cards",
    card2Desc: "Zero hassle local Pakistani payments with instant PDF check-in voucher issuance.",
    card3Title: "24/7 Online Assistance",
    card3Desc: "Dedicated on-ground emergency and route coordinators active during your journeys.",
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
      a: "We support JazzCash, EasyPaisa, Pakistani Credit/Debit cards (Visa/MasterCard via Stripe), and Cash on Arrival. Instant electronic vouchers are generated as soon as your booking is placed.",
    },
    {
      id: "faq-3",
      q: "Can I cancel my tour or hotel booking for free?",
      a: "Yes! Every listing clearly specifies its free cancellation window (typically between 48 hours to 7 days before trip start date). If you cancel within the free window, you receive a full 100% refund.",
    },
    {
      id: "faq-4",
      q: "Are the tour guides and 4x4 drivers certified?",
      a: "Yes. All tours provided by partner operators on PakistanTravel.Agency are led by certified mountain drivers and alpine guides licensed by the Department of Tourist Services Pakistan.",
    },
    {
      id: "faq-5",
      q: "Is electricity and heating available in Northern hotels during autumn/winter?",
      a: "Yes. Verified partners on our platform maintain 24/7 power backup generators and room heating arrangements suited for Northern mountain temperatures.",
    },
  ] as FaqItem[],

  PAGE_VERIFICATION: {
    heading: "How We Verify Travel Partners",
    subheading: "Our multi-step verification process ensures that every tour operator and mountain hotel listed on PakistanTravel.Agency holds authentic licensing, regional experience, and customer safety compliance.",
    steps: [
      {
        step: "01",
        title: "Government Registration & DTS Licensing",
        desc: "Every operator must provide valid registration with the Department of Tourist Services (DTS) Pakistan or SECP corporate registration. We verify business NTNs and licensing credentials before onboarding.",
      },
      {
        step: "02",
        title: "Established Regional Operating Base",
        desc: "Partners must operate an established physical office or recognized hospitality base in northern hubs (Gilgit, Skardu, Karimabad, Swat, or Islamabad), ensuring local accountability.",
      },
      {
        step: "03",
        title: "Vehicle Roadworthiness & Driver Safety",
        desc: "For guided expeditions and 4x4 mountain tracks, vehicles must pass annual mechanical fitness checks, and drivers must possess certified hill-driving experience across the Karakoram and Hindu Kush ranges.",
      },
      {
        step: "04",
        title: "Escrow Deposit & Transparent Payouts",
        desc: "Customer deposits are held securely through our platform. Operator payouts are released on an agreed schedule, ensuring travelers receive promised services or timely refunds if issues arise.",
      },
      {
        step: "05",
        title: "Continuous Review & Performance Auditing",
        desc: "We strictly gate reviews to travelers with completed bookings. Operators that fail to maintain minimum customer satisfaction standards or violate safety protocols are removed from the marketplace.",
      },
    ],
  } as PageVerificationSettings,

  PAGE_ABOUT: {
    heading: "Connecting Travelers with Verified Northern Operators",
    subheading: "Built to make tourism in northern Pakistan transparent, safe, and easily accessible for domestic families, solo adventurers, and international guests.",
    mission: "Our mission is to empower indigenous mountain guides and hospitality operators across Gilgit-Baltistan and Khyber Pakhtunkhwa with world-class digital booking infrastructure.",
    vision: "To be the most trusted and comprehensive travel ecosystem in Pakistan, guaranteeing fair operator pricing and zero-commission tourist support.",
    story: "PakistanTravel.Agency was founded by native northern travel logistics veterans who witnessed the challenges travelers faced with hidden fees, unreliable guides, and last-minute booking cancellations.",
    corporateName: "PakistanTravel.Agency Technologies (Private) Limited",
    secpCuin: "0248911-PK (Security and Exchange Commission of Pakistan)",
    fbrNtn: "9824102-7 (Federal Board of Revenue)",
    registeredOffice: "Floor 4, Evacuee Trust Complex, Agha Khan Road, F-5/1, Islamabad",
  } as PageAboutSettings,

  PAGE_TERMS: {
    bookingPolicy: "All bookings placed through PakistanTravel.Agency generate an immediate digital voucher and lock your seats with our verified local partner. Advance deposit is required to secure peak-season vehicle and hotel quotas.",
    cancellationPolicy: "Free cancellation up to 7 days before tour departure. 50% refund between 3 to 7 days. Non-refundable within 72 hours of departure due to non-recoverable mountain logistics and hotel commitments.",
    safetyGuidelines: "All travelers must carry valid original CNIC or Passport. Mountain travel is subject to weather conditions and local authority road clearances.",
    liabilityNotice: "PakistanTravel.Agency ensures all partner agencies maintain valid commercial vehicle fitness and licensed DTS mountain chauffeurs.",
  } as PageTermsSettings,

  PAGE_PRIVACY: {
    privacyStatement: "We take your privacy seriously. Your personal contact details and CNIC/Passport information are shared strictly with the executing tour operator for hotel check-ins and security clearances.",
    paymentSecurity: "Payments made via JazzCash, EasyPaisa, Raast, or credit/debit card are processed through 256-bit SSL encrypted bank gateways. We never store payment PINs or CVVs.",
    contactProtection: "We do not sell or rent traveler phone numbers or email addresses to third-party marketing companies.",
  } as PagePrivacySettings,

  PAGE_DESTINATIONS: {
    badgeText: "Discover Northern Pakistan",
    heading: "Top Travel Destinations in Pakistan",
    subheading: "Explore comprehensive destination guides, seasonal advice, approximate costs, and verified tours curated by local mountain experts.",
  } as PageDestinationsSettings,

  PAGE_BLOG: {
    badgeText: "Northern Travel Insights & Guides",
    heading: "Pakistan Travel Blog & Expeditions",
    subheading: "Essential trip planning advice, real seasonal costs, route conditions, and gear checklists curated by certified mountain guides.",
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
