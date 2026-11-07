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
}

export interface AnnouncementSettings {
  isEnabled: boolean;
  text: string;
  linkText: string;
  linkUrl: string;
}

export interface FooterSettings {
  aboutText: string;
  copyrightNotice: string;
  emergencyPhone: string;
  headOfficeText: string;
}

export interface PageAboutSettings {
  heading: string;
  subheading: string;
  mission: string;
  vision: string;
  story: string;
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

export const DEFAULT_SITE_SETTINGS = {
  GENERAL: {
    siteName: "PakistanTravel.Agency",
    tagline: "Pakistan's Premier Verified Tourism Marketplace",
    phonePrimary: "+92 322 2327096",
    phoneHelpline: "+92 (51) 111-TRAVEL (872835)",
    whatsappNumber: "+92 322 2327096",
    supportEmail: "pakistantravel.agency26@gmail.com",
    address: "Blue Area, Islamabad, Pakistan / Gilgit DTS Regional Office",
    dtsLicense: "DTS License # 1245-ICT (Government of Pakistan)",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    youtubeUrl: "https://youtube.com",
  } as GeneralSettings,

  HERO: {
    badgeText: "Pakistan's Premier Verified Travel Network",
    title: "Discover Pakistan's Breathtaking Northern Destinations",
    subtitle: "Explore curated tours from verified local operators, reserve luxury mountain hotels, and book with 100% confidence.",
    bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=80",
    stat1Value: "50+",
    stat1Label: "Verified Local Operators",
    stat2Value: "100%",
    stat2Label: "DTS Compliance Audited",
    stat3Value: "24/7",
    stat3Label: "Traveler Assistance Hotline",
  } as HeroSettings,

  ANNOUNCEMENT: {
    isEnabled: true,
    text: "Autumn & Early Winter 2026 Season Booking Open across Skardu, Hunza & Swat!",
    linkText: "Explore Tours",
    linkUrl: "/search",
  } as AnnouncementSettings,

  FOOTER: {
    aboutText: "PakistanTravel.Agency is the official online multi-vendor tourism marketplace dedicated to promoting sustainable and safe travel across northern Pakistan.",
    copyrightNotice: "© 2026 PakistanTravel.Agency. All rights reserved. Registered with Department of Tourist Services (DTS), Government of Pakistan.",
    emergencyPhone: "+92 322 2327096",
    headOfficeText: "Blue Area, Islamabad, Pakistan",
  } as FooterSettings,

  PAGE_ABOUT: {
    heading: "Connecting Travelers with Verified Northern Operators",
    subheading: "Built to make tourism in northern Pakistan transparent, safe, and easily accessible for domestic families, solo adventurers, and international guests.",
    mission: "Our mission is to empower indigenous mountain guides and hospitality operators across Gilgit-Baltistan and Khyber Pakhtunkhwa with world-class digital booking infrastructure.",
    vision: "To be the most trusted and comprehensive travel ecosystem in Pakistan, guaranteeing fair operator pricing and zero-commission tourist support.",
    story: "PakistanTravel.Agency was founded by native northern travel logistics veterans who witnessed the challenges travelers faced with hidden fees, unreliable guides, and last-minute booking cancellations.",
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
};

export type SiteSettingsKey = keyof typeof DEFAULT_SITE_SETTINGS;

export async function getSiteSettings(key?: SiteSettingsKey): Promise<any> {
  try {
    if (key) {
      const record = await prisma.siteSetting.findUnique({
        where: { key },
      });
      if (record && record.value) {
        return { ...DEFAULT_SITE_SETTINGS[key], ...(record.value as object) };
      }
      return DEFAULT_SITE_SETTINGS[key];
    }

    // Load all settings
    const records = await prisma.siteSetting.findMany();
    const result: Record<string, any> = { ...DEFAULT_SITE_SETTINGS };

    records.forEach((r) => {
      if (r.key in DEFAULT_SITE_SETTINGS) {
        result[r.key] = {
          ...DEFAULT_SITE_SETTINGS[r.key as SiteSettingsKey],
          ...(r.value as object),
        };
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
