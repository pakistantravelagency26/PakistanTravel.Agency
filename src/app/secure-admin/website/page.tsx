"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Globe, 
  Settings, 
  Megaphone, 
  Phone, 
  FileText, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
  Info,
  Layers,
  HelpCircle,
  Lock,
  Plus,
  Trash2,
  Edit,
  Building2,
  Compass,
  CreditCard,
  Headphones,
  Check
} from "lucide-react";
import type { 
  GeneralSettings, 
  HeroSettings, 
  AnnouncementSettings, 
  MarketplaceSectionSettings,
  FooterSettings, 
  FaqItem,
  PageVerificationSettings,
  PageAboutSettings, 
  PageTermsSettings, 
  PagePrivacySettings,
  PageDestinationsSettings,
  PageBlogSettings
} from "@/services/siteSettings.service";

export default function AdminWebsiteManagerPage() {
  const [activeTab, setActiveTab] = useState<
    | "general" 
    | "hero" 
    | "announcement" 
    | "marketplace" 
    | "footer" 
    | "faqs" 
    | "verification" 
    | "about" 
    | "terms" 
    | "privacy" 
    | "guides"
  >("general");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states for all 11 sections
  const [general, setGeneral] = useState<GeneralSettings>({
    siteName: "",
    tagline: "",
    phonePrimary: "",
    phoneHelpline: "",
    whatsappNumber: "",
    supportEmail: "",
    address: "",
    dtsLicense: "",
    workingHours: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
  });

  const [hero, setHero] = useState<HeroSettings>({
    badgeText: "",
    title: "",
    subtitle: "",
    bgImage: "",
    stat1Value: "",
    stat1Label: "",
    stat2Value: "",
    stat2Label: "",
    stat3Value: "",
    stat3Label: "",
    badge1Title: "",
    badge1Sub: "",
    badge2Title: "",
    badge2Sub: "",
    badge3Title: "",
    badge3Sub: "",
  });

  const [announcement, setAnnouncement] = useState<AnnouncementSettings>({
    isEnabled: true,
    text: "",
    linkText: "",
    linkUrl: "",
  });

  const [marketplace, setMarketplace] = useState<MarketplaceSectionSettings>({
    badgeText: "",
    title: "",
    subtitle: "",
    emptyStateTitle: "",
    emptyStateDesc: "",
  });

  const [footer, setFooter] = useState<FooterSettings>({
    aboutText: "",
    copyrightNotice: "",
    emergencyPhone: "",
    headOfficeText: "",
    card1Title: "",
    card1Desc: "",
    card2Title: "",
    card2Desc: "",
    card3Title: "",
    card3Desc: "",
  });

  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [showAddFaq, setShowAddFaq] = useState(false);

  const [verification, setVerification] = useState<PageVerificationSettings>({
    heading: "",
    subheading: "",
    steps: [],
  });

  const [about, setAbout] = useState<PageAboutSettings>({
    heading: "",
    subheading: "",
    mission: "",
    vision: "",
    story: "",
    corporateName: "",
    secpCuin: "",
    fbrNtn: "",
    registeredOffice: "",
  });

  const [terms, setTerms] = useState<PageTermsSettings>({
    bookingPolicy: "",
    cancellationPolicy: "",
    safetyGuidelines: "",
    liabilityNotice: "",
  });

  const [privacy, setPrivacy] = useState<PagePrivacySettings>({
    privacyStatement: "",
    paymentSecurity: "",
    contactProtection: "",
  });

  const [destinationsPage, setDestinationsPage] = useState<PageDestinationsSettings>({
    badgeText: "",
    heading: "",
    subheading: "",
  });

  const [blogPage, setBlogPage] = useState<PageBlogSettings>({
    badgeText: "",
    heading: "",
    subheading: "",
  });

  async function loadSettings() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        if (data.settings.GENERAL) setGeneral(data.settings.GENERAL);
        if (data.settings.HERO) setHero(data.settings.HERO);
        if (data.settings.ANNOUNCEMENT) setAnnouncement(data.settings.ANNOUNCEMENT);
        if (data.settings.MARKETPLACE_SECTION) setMarketplace(data.settings.MARKETPLACE_SECTION);
        if (data.settings.FOOTER) setFooter(data.settings.FOOTER);
        if (data.settings.FAQS) setFaqs(data.settings.FAQS);
        if (data.settings.PAGE_VERIFICATION) setVerification(data.settings.PAGE_VERIFICATION);
        if (data.settings.PAGE_ABOUT) setAbout(data.settings.PAGE_ABOUT);
        if (data.settings.PAGE_TERMS) setTerms(data.settings.PAGE_TERMS);
        if (data.settings.PAGE_PRIVACY) setPrivacy(data.settings.PAGE_PRIVACY);
        if (data.settings.PAGE_DESTINATIONS) setDestinationsPage(data.settings.PAGE_DESTINATIONS);
        if (data.settings.PAGE_BLOG) setBlogPage(data.settings.PAGE_BLOG);
      }
    } catch (err: any) {
      console.error("Failed to load settings:", err);
      setStatusMessage({ type: "error", text: "Failed to load live settings from database." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function handleSave(key: string, value: any) {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: `Settings for "${key.replace("PAGE_", "").toLowerCase()}" successfully saved to database and applied live!`,
        });
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to save settings." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error saving: " + err.message });
    } finally {
      setSaving(false);
    }
  }

  // FAQ Handlers
  function handleAddFaq(e: React.FormEvent) {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    const updated = [
      ...faqs,
      {
        id: `faq-${Date.now()}`,
        q: newFaqQ.trim(),
        a: newFaqA.trim(),
      },
    ];
    setFaqs(updated);
    setNewFaqQ("");
    setNewFaqA("");
    setShowAddFaq(false);
    handleSave("FAQS", updated);
  }

  function handleDeleteFaq(id: string) {
    if (!confirm("Are you sure you want to remove this FAQ?")) return;
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    handleSave("FAQS", updated);
  }

  function handleUpdateFaq(id: string, q: string, a: string) {
    const updated = faqs.map((f) => (f.id === id ? { ...f, q, a } : f));
    setFaqs(updated);
  }

  const subTabs = [
    { id: "general", label: "General & Contact Desk", icon: Settings },
    { id: "hero", label: "Homepage Hero & Badges", icon: Sparkles },
    { id: "announcement", label: "Top Announcement Bar", icon: Megaphone },
    { id: "marketplace", label: "Marketplace Catalog", icon: Building2 },
    { id: "footer", label: "Footer & Value Cards", icon: Layers },
    { id: "faqs", label: "FAQs Management", icon: HelpCircle },
    { id: "verification", label: "Partner Verification Page", icon: ShieldCheck },
    { id: "about", label: "About Page & Corporate", icon: Info },
    { id: "terms", label: "Terms & Booking Policy", icon: FileText },
    { id: "privacy", label: "Privacy Policy", icon: Lock },
    { id: "guides", label: "Destinations & Blog Banners", icon: Compass },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Complete Website CMS & Content Controller (A to Z)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Website Content & Settings Editor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            100% customizable from A to Z: Edit contact numbers, homepage headlines, search trust badges, FAQs, footer propositions, verification steps, and legal policies.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <span>View Live Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-3 transition ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="font-semibold">{statusMessage.text}</span>
        </div>
      )}

      {/* Sub-Tabs Navigation Bar */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm flex flex-wrap gap-1">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
          <span className="text-xs font-semibold">Loading live settings from database...</span>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* TAB 1: GENERAL & CONTACT */}
          {activeTab === "general" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("GENERAL", general);
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">General Brand & Contact Settings</h2>
                <p className="text-xs text-slate-500">Configure public business identity, working hours, and direct customer care numbers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Website Brand Name</label>
                  <input
                    type="text"
                    value={general.siteName}
                    onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={general.tagline}
                    onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Support Phone</label>
                  <input
                    type="text"
                    value={general.phonePrimary}
                    onChange={(e) => setGeneral({ ...general, phonePrimary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">24/7 Helpline Number</label>
                  <input
                    type="text"
                    value={general.phoneHelpline}
                    onChange={(e) => setGeneral({ ...general, phoneHelpline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Live Chat Number</label>
                  <input
                    type="text"
                    value={general.whatsappNumber}
                    onChange={(e) => setGeneral({ ...general, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer Support Email</label>
                  <input
                    type="email"
                    value={general.supportEmail}
                    onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Office Operational Working Hours</label>
                  <input
                    type="text"
                    value={general.workingHours}
                    onChange={(e) => setGeneral({ ...general, workingHours: e.target.value })}
                    placeholder="Mon - Sat, 9am - 8pm PKT"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">DTS License Reference</label>
                  <input
                    type="text"
                    value={general.dtsLicense}
                    onChange={(e) => setGeneral({ ...general, dtsLicense: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Head Office Physical Address</label>
                  <input
                    type="text"
                    value={general.address}
                    onChange={(e) => setGeneral({ ...general, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={general.instagramUrl}
                    onChange={(e) => setGeneral({ ...general, instagramUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={general.facebookUrl}
                    onChange={(e) => setGeneral({ ...general, facebookUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save General & Contact Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: HOMEPAGE HERO & BADGES */}
          {activeTab === "hero" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("HERO", hero);
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Homepage Hero, Headline & Confidence Badges</h2>
                <p className="text-xs text-slate-500">Edit top headline, subtitle, background image, metrics, and search confidence pills</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Top Badge Pill</label>
                  <input
                    type="text"
                    value={hero.badgeText}
                    onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
                    placeholder="e.g. Pakistan's Premier Verified Travel Network"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Hero Heading</label>
                  <input
                    type="text"
                    value={hero.title}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Subtitle Paragraph</label>
                  <textarea
                    rows={3}
                    value={hero.subtitle}
                    onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Background Visual URL</label>
                  <input
                    type="url"
                    value={hero.bgImage}
                    onChange={(e) => setHero({ ...hero, bgImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {hero.bgImage && (
                  <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-slate-200">
                    <Image
                      src={hero.bgImage}
                      alt="Hero background preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                      Hero Visual Preview
                    </div>
                  </div>
                )}

                {/* 3 Confidence Badges under search bar */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Search Bar Trust & Confidence Badges (Under Search Box)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700">Badge 1</label>
                      <input
                        type="text"
                        value={hero.badge1Title}
                        onChange={(e) => setHero({ ...hero, badge1Title: e.target.value })}
                        placeholder="Licensed Local Operators"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={hero.badge1Sub}
                        onChange={(e) => setHero({ ...hero, badge1Sub: e.target.value })}
                        placeholder="DTS & SECP Vetted · Verified Partners"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px]"
                      />
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700">Badge 2</label>
                      <input
                        type="text"
                        value={hero.badge2Title}
                        onChange={(e) => setHero({ ...hero, badge2Title: e.target.value })}
                        placeholder="JazzCash & EasyPaisa"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={hero.badge2Sub}
                        onChange={(e) => setHero({ ...hero, badge2Sub: e.target.value })}
                        placeholder="Plus Credit Cards & Bank Transfer"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px]"
                      />
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700">Badge 3</label>
                      <input
                        type="text"
                        value={hero.badge3Title}
                        onChange={(e) => setHero({ ...hero, badge3Title: e.target.value })}
                        placeholder="24/7 Online Support"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={hero.badge3Sub}
                        onChange={(e) => setHero({ ...hero, badge3Sub: e.target.value })}
                        placeholder="WhatsApp & Phone Desk"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3 Metric Stats */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Platform Statistics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-600">Metric 1</label>
                      <input
                        type="text"
                        value={hero.stat1Value}
                        onChange={(e) => setHero({ ...hero, stat1Value: e.target.value })}
                        placeholder="50+"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={hero.stat1Label}
                        onChange={(e) => setHero({ ...hero, stat1Label: e.target.value })}
                        placeholder="Verified Local Operators"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px]"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-600">Metric 2</label>
                      <input
                        type="text"
                        value={hero.stat2Value}
                        onChange={(e) => setHero({ ...hero, stat2Value: e.target.value })}
                        placeholder="100%"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={hero.stat2Label}
                        onChange={(e) => setHero({ ...hero, stat2Label: e.target.value })}
                        placeholder="DTS Verified Standards"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px]"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-600">Metric 3</label>
                      <input
                        type="text"
                        value={hero.stat3Value}
                        onChange={(e) => setHero({ ...hero, stat3Value: e.target.value })}
                        placeholder="24/7"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={hero.stat3Label}
                        onChange={(e) => setHero({ ...hero, stat3Label: e.target.value })}
                        placeholder="Traveler Support Line"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Hero & Badges Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ANNOUNCEMENT BAR */}
          {activeTab === "announcement" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("ANNOUNCEMENT", announcement);
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Top Announcement Banner</h2>
                <p className="text-xs text-slate-500">Show or hide a prominent notification strip across the top of every page</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs text-slate-900 block">Enable Announcement Banner</span>
                  <span className="text-[11px] text-slate-500">Display notice on live website top bar</span>
                </div>
                <input
                  type="checkbox"
                  checked={announcement.isEnabled}
                  onChange={(e) => setAnnouncement({ ...announcement, isEnabled: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Message Text</label>
                  <input
                    type="text"
                    value={announcement.text}
                    onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                    placeholder="e.g. Autumn & Early Winter 2026 Season Booking Open across Skardu, Hunza & Swat!"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Button / Link Text</label>
                    <input
                      type="text"
                      value={announcement.linkText}
                      onChange={(e) => setAnnouncement({ ...announcement, linkText: e.target.value })}
                      placeholder="e.g. Explore Tours"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Link URL</label>
                    <input
                      type="text"
                      value={announcement.linkUrl}
                      onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value })}
                      placeholder="/search"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Announcement Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: MARKETPLACE SECTION */}
          {activeTab === "marketplace" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("MARKETPLACE_SECTION", marketplace);
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Homepage Marketplace Catalog Section</h2>
                <p className="text-xs text-slate-500">Edit the title, subtitle, and zero-listing empty state for the tours and hotels feed</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Badge Pill</label>
                  <input
                    type="text"
                    value={marketplace.badgeText}
                    onChange={(e) => setMarketplace({ ...marketplace, badgeText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Section Heading</label>
                  <input
                    type="text"
                    value={marketplace.title}
                    onChange={(e) => setMarketplace({ ...marketplace, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle / Description</label>
                  <input
                    type="text"
                    value={marketplace.subtitle}
                    onChange={(e) => setMarketplace({ ...marketplace, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Empty State Box Title (When 0 Listings)</label>
                  <input
                    type="text"
                    value={marketplace.emptyStateTitle}
                    onChange={(e) => setMarketplace({ ...marketplace, emptyStateTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Empty State Description</label>
                  <textarea
                    rows={2}
                    value={marketplace.emptyStateDesc}
                    onChange={(e) => setMarketplace({ ...marketplace, emptyStateDesc: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Marketplace Section</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: FOOTER & VALUE CARDS */}
          {activeTab === "footer" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("FOOTER", footer);
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Footer, Value Cards & Legal Notice</h2>
                <p className="text-xs text-slate-500">Edit the mission description, copyright lines, emergency helpline, and the 3 value cards</p>
              </div>

              {/* 3 Value Cards in Footer */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  The 3 Value Proposition Cards (Top of Footer)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">Card 1 (Vetted Partners)</label>
                    <input
                      type="text"
                      value={footer.card1Title}
                      onChange={(e) => setFooter({ ...footer, card1Title: e.target.value })}
                      placeholder="Vetted Northern Partners"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={footer.card1Desc}
                      onChange={(e) => setFooter({ ...footer, card1Desc: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px]"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">Card 2 (Payment Rails)</label>
                    <input
                      type="text"
                      value={footer.card2Title}
                      onChange={(e) => setFooter({ ...footer, card2Title: e.target.value })}
                      placeholder="JazzCash, EasyPaisa & Cards"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={footer.card2Desc}
                      onChange={(e) => setFooter({ ...footer, card2Desc: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px]"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">Card 3 (Support Assistance)</label>
                    <input
                      type="text"
                      value={footer.card3Title}
                      onChange={(e) => setFooter({ ...footer, card3Title: e.target.value })}
                      placeholder="24/7 Online Assistance"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={footer.card3Desc}
                      onChange={(e) => setFooter({ ...footer, card3Desc: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">About Text in Footer</label>
                  <textarea
                    rows={3}
                    value={footer.aboutText}
                    onChange={(e) => setFooter({ ...footer, aboutText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Copyright Line & DTS Disclaimer</label>
                  <input
                    type="text"
                    value={footer.copyrightNotice}
                    onChange={(e) => setFooter({ ...footer, copyrightNotice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Traveler Helpline</label>
                    <input
                      type="text"
                      value={footer.emergencyPhone}
                      onChange={(e) => setFooter({ ...footer, emergencyPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Head Office Location Text</label>
                    <input
                      type="text"
                      value={footer.headOfficeText}
                      onChange={(e) => setFooter({ ...footer, headOfficeText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Footer & Cards Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 6: FAQS MANAGER */}
          {activeTab === "faqs" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Frequently Asked Questions (/faq)</h2>
                  <p className="text-xs text-slate-500">Add, edit, or delete FAQs displayed to travelers on the Help Center page</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddFaq(!showAddFaq)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddFaq ? "Cancel New FAQ" : "+ Add New FAQ"}</span>
                </button>
              </div>

              {/* Add New FAQ Form */}
              {showAddFaq && (
                <form onSubmit={handleAddFaq} className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
                  <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">New FAQ Entry</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Question</label>
                    <input
                      type="text"
                      value={newFaqQ}
                      onChange={(e) => setNewFaqQ(e.target.value)}
                      placeholder="e.g. Can I pay via cash on arrival?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Answer</label>
                    <textarea
                      rows={3}
                      value={newFaqA}
                      onChange={(e) => setNewFaqA(e.target.value)}
                      placeholder="e.g. Yes, cash on arrival is supported for select hotel bookings with advance verification."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition"
                    >
                      Save &amp; Add FAQ
                    </button>
                  </div>
                </form>
              )}

              {/* FAQ List */}
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={faq.id || index} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400">FAQ #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Question</label>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => handleUpdateFaq(faq.id, e.target.value, faq.a)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Answer</label>
                      <textarea
                        rows={2}
                        value={faq.a}
                        onChange={(e) => handleUpdateFaq(faq.id, faq.q, e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSave("FAQS", faqs)}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save All FAQs ({faqs.length})</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: PARTNER VERIFICATION */}
          {activeTab === "verification" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("PAGE_VERIFICATION", verification);
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Partner Verification Page (/how-we-verify-partners)</h2>
                <p className="text-xs text-slate-500">Edit quality standards, DTS licensing criteria, and verification steps</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Heading</label>
                  <input
                    type="text"
                    value={verification.heading}
                    onChange={(e) => setVerification({ ...verification, heading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subheading Paragraph</label>
                  <textarea
                    rows={2}
                    value={verification.subheading}
                    onChange={(e) => setVerification({ ...verification, subheading: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    The 5 Verification Steps
                  </h3>
                  {verification.steps.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-[11px] font-black text-sky-600">STEP {step.step || `0${idx + 1}`}</span>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => {
                          const updated = [...verification.steps];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setVerification({ ...verification, steps: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                      />
                      <textarea
                        rows={2}
                        value={step.desc}
                        onChange={(e) => {
                          const updated = [...verification.steps];
                          updated[idx] = { ...updated[idx], desc: e.target.value };
                          setVerification({ ...verification, steps: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Verification Page</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 8: ABOUT US PAGE & CORPORATE */}
          {activeTab === "about" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("PAGE_ABOUT", about);
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">About Us Page Content & Corporate Registry (/about)</h2>
                <p className="text-xs text-slate-500">Edit mission statement, company story, and official SECP / FBR registration credentials</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Heading</label>
                  <input
                    type="text"
                    value={about.heading}
                    onChange={(e) => setAbout({ ...about, heading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subheading / Introduction</label>
                  <textarea
                    rows={2}
                    value={about.subheading}
                    onChange={(e) => setAbout({ ...about, subheading: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Our Mission</label>
                  <textarea
                    rows={3}
                    value={about.mission}
                    onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Our Vision</label>
                  <textarea
                    rows={3}
                    value={about.vision}
                    onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Origin Story</label>
                  <textarea
                    rows={4}
                    value={about.story}
                    onChange={(e) => setAbout({ ...about, story: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* SECP / FBR Credentials */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Official Corporate & Compliance Details (About Page Box)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Operating Corporate Entity</label>
                      <input
                        type="text"
                        value={about.corporateName}
                        onChange={(e) => setAbout({ ...about, corporateName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">SECP Corporate Identification Number (CUIN)</label>
                      <input
                        type="text"
                        value={about.secpCuin}
                        onChange={(e) => setAbout({ ...about, secpCuin: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Federal Board of Revenue (FBR) NTN</label>
                      <input
                        type="text"
                        value={about.fbrNtn}
                        onChange={(e) => setAbout({ ...about, fbrNtn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Registered Head Office Address</label>
                      <input
                        type="text"
                        value={about.registeredOffice}
                        onChange={(e) => setAbout({ ...about, registeredOffice: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save About Page &amp; Corporate Info</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 9: TERMS & BOOKING POLICY */}
          {activeTab === "terms" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("PAGE_TERMS", terms);
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Terms & Booking Policy (/terms)</h2>
                <p className="text-xs text-slate-500">Edit cancellation terms, voucher rules, and traveler safety instructions</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Booking & Payment Confirmation Policy</label>
                  <textarea
                    rows={3}
                    value={terms.bookingPolicy}
                    onChange={(e) => setTerms({ ...terms, bookingPolicy: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cancellation & Refund Guidelines</label>
                  <textarea
                    rows={3}
                    value={terms.cancellationPolicy}
                    onChange={(e) => setTerms({ ...terms, cancellationPolicy: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mountain Travel Safety & Identity Requirements</label>
                  <textarea
                    rows={3}
                    value={terms.safetyGuidelines}
                    onChange={(e) => setTerms({ ...terms, safetyGuidelines: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Operator Liability & DTS Compliance Notice</label>
                  <textarea
                    rows={3}
                    value={terms.liabilityNotice}
                    onChange={(e) => setTerms({ ...terms, liabilityNotice: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Terms & Policy</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 10: PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("PAGE_PRIVACY", privacy);
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Privacy Policy Content (/privacy)</h2>
                <p className="text-xs text-slate-500">Edit data encryption, payment gateway compliance, and identity protection statements</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data Privacy Statement</label>
                  <textarea
                    rows={3}
                    value={privacy.privacyStatement}
                    onChange={(e) => setPrivacy({ ...privacy, privacyStatement: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment & Banking Gateway Security</label>
                  <textarea
                    rows={3}
                    value={privacy.paymentSecurity}
                    onChange={(e) => setPrivacy({ ...privacy, paymentSecurity: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Traveler Contact Data Protection</label>
                  <textarea
                    rows={3}
                    value={privacy.contactProtection}
                    onChange={(e) => setPrivacy({ ...privacy, contactProtection: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Privacy Policy</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 11: DESTINATIONS & BLOG BANNERS */}
          {activeTab === "guides" && (
            <div className="space-y-8">
              {/* Destinations Header */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave("PAGE_DESTINATIONS", destinationsPage);
                }}
                className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Destinations Page Header Banner (/destinations)</h3>
                  <p className="text-xs text-slate-500">Edit the top title, badge, and intro paragraph on the destinations index page</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Pill</label>
                  <input
                    type="text"
                    value={destinationsPage.badgeText}
                    onChange={(e) => setDestinationsPage({ ...destinationsPage, badgeText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Heading</label>
                  <input
                    type="text"
                    value={destinationsPage.heading}
                    onChange={(e) => setDestinationsPage({ ...destinationsPage, heading: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subheading Paragraph</label>
                  <textarea
                    rows={2}
                    value={destinationsPage.subheading}
                    onChange={(e) => setDestinationsPage({ ...destinationsPage, subheading: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition disabled:opacity-50"
                  >
                    Save Destinations Header
                  </button>
                </div>
              </form>

              {/* Blog Header */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave("PAGE_BLOG", blogPage);
                }}
                className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Blog & Expeditions Header Banner (/blog)</h3>
                  <p className="text-xs text-slate-500">Edit the top title, badge, and description on the Travel Blog page</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Pill</label>
                  <input
                    type="text"
                    value={blogPage.badgeText}
                    onChange={(e) => setBlogPage({ ...blogPage, badgeText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Heading</label>
                  <input
                    type="text"
                    value={blogPage.heading}
                    onChange={(e) => setBlogPage({ ...blogPage, heading: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subheading Paragraph</label>
                  <textarea
                    rows={2}
                    value={blogPage.subheading}
                    onChange={(e) => setBlogPage({ ...blogPage, subheading: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition disabled:opacity-50"
                  >
                    Save Blog Header
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
