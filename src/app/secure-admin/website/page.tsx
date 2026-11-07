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
  Lock
} from "lucide-react";
import type { 
  GeneralSettings, 
  HeroSettings, 
  AnnouncementSettings, 
  FooterSettings, 
  PageAboutSettings, 
  PageTermsSettings, 
  PagePrivacySettings 
} from "@/services/siteSettings.service";

export default function AdminWebsiteManagerPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "hero" | "announcement" | "footer" | "about" | "terms" | "privacy"
  >("general");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states for each section
  const [general, setGeneral] = useState<GeneralSettings>({
    siteName: "",
    tagline: "",
    phonePrimary: "",
    phoneHelpline: "",
    whatsappNumber: "",
    supportEmail: "",
    address: "",
    dtsLicense: "",
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
  });

  const [announcement, setAnnouncement] = useState<AnnouncementSettings>({
    isEnabled: true,
    text: "",
    linkText: "",
    linkUrl: "",
  });

  const [footer, setFooter] = useState<FooterSettings>({
    aboutText: "",
    copyrightNotice: "",
    emergencyPhone: "",
    headOfficeText: "",
  });

  const [about, setAbout] = useState<PageAboutSettings>({
    heading: "",
    subheading: "",
    mission: "",
    vision: "",
    story: "",
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

  async function loadSettings() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        if (data.settings.GENERAL) setGeneral(data.settings.GENERAL);
        if (data.settings.HERO) setHero(data.settings.HERO);
        if (data.settings.ANNOUNCEMENT) setAnnouncement(data.settings.ANNOUNCEMENT);
        if (data.settings.FOOTER) setFooter(data.settings.FOOTER);
        if (data.settings.PAGE_ABOUT) setAbout(data.settings.PAGE_ABOUT);
        if (data.settings.PAGE_TERMS) setTerms(data.settings.PAGE_TERMS);
        if (data.settings.PAGE_PRIVACY) setPrivacy(data.settings.PAGE_PRIVACY);
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
          text: `Website ${key.replace("PAGE_", "").toLowerCase()} settings successfully saved and applied live!`,
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

  const subTabs = [
    { id: "general", label: "General & Contact", icon: Settings },
    { id: "hero", label: "Homepage Hero", icon: Sparkles },
    { id: "announcement", label: "Announcement Bar", icon: Megaphone },
    { id: "footer", label: "Footer & Legal", icon: Layers },
    { id: "about", label: "About Us Page", icon: Info },
    { id: "terms", label: "Terms & Booking Policy", icon: FileText },
    { id: "privacy", label: "Privacy Policy", icon: Lock },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Full Website Content Management System (CMS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Website Content & Settings Editor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Customize all website content, contact numbers, homepage hero text, policy pages, and announcements directly from this dashboard.
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
              <Icon className="w-4 h-4" />
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
                <p className="text-xs text-slate-500">Configure public business identity and direct helpline numbers</p>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Phone</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Support Number</label>
                  <input
                    type="text"
                    value={general.whatsappNumber}
                    onChange={(e) => setGeneral({ ...general, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={general.supportEmail}
                    onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Head Office Address</label>
                  <input
                    type="text"
                    value={general.address}
                    onChange={(e) => setGeneral({ ...general, address: e.target.value })}
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={general.instagramUrl}
                    onChange={(e) => setGeneral({ ...general, instagramUrl: e.target.value })}
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
                  <span>Save General Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: HOMEPAGE HERO */}
          {activeTab === "hero" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("HERO", hero);
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Homepage Hero & Banner Settings</h2>
                <p className="text-xs text-slate-500">Edit the top headline, subtitle, background visual, and key platform statistics</p>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Background Image URL</label>
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

                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Key Highlights / Metrics Under Hero
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
                  <span>Save Hero Settings</span>
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

          {/* TAB 4: FOOTER & LEGAL */}
          {activeTab === "footer" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("FOOTER", footer);
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Footer & Bottom Legal Notice</h2>
                <p className="text-xs text-slate-500">Edit the mission description, copyright lines, and emergency contact in the footer</p>
              </div>

              <div className="space-y-4">
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
                  <span>Save Footer Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: ABOUT US PAGE */}
          {activeTab === "about" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("PAGE_ABOUT", about);
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">About Us Page Content (/about)</h2>
                <p className="text-xs text-slate-500">Edit the story, mission statement, and value proposition displayed on the About page</p>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Origin & Story</label>
                  <textarea
                    rows={4}
                    value={about.story}
                    onChange={(e) => setAbout({ ...about, story: e.target.value })}
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
                  <span>Save About Page Content</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 6: TERMS & BOOKING POLICY */}
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

          {/* TAB 7: PRIVACY POLICY */}
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
        </div>
      )}
    </div>
  );
}
