"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ShieldCheck, CreditCard, Mail, Headphones, Phone } from "lucide-react";
import { DEFAULT_SITE_SETTINGS } from "@/services/siteSettings.service";

export function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev) => ({
            ...prev,
            ...data.settings,
          }));
        }
      })
      .catch((err) => console.warn("Failed to load footer settings:", err));
  }, []);

  // Completely hide the public website footer on all Admin and Vendor portal routes
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/vendor") ||
    pathname?.startsWith("/secure-admin") ||
    pathname?.startsWith("/partner-hub") ||
    pathname?.startsWith("/admin-portal") ||
    pathname?.startsWith("/vendor-portal")
  ) {
    return null;
  }

  const general = settings.GENERAL;
  const footer = settings.FOOTER;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800 text-sm">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{footer.card1Title || "Vetted Northern Partners"}</p>
              <p className="text-xs text-slate-400 mt-1">
                {footer.card1Desc || "Operators are verified against DTS licenses and SECP registration records."}{" "}
                <Link href="/how-we-verify-partners" className="text-sky-400 hover:underline">Learn how</Link>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{footer.card2Title || "JazzCash, EasyPaisa & Cards"}</p>
              <p className="text-xs text-slate-400 mt-1">
                {footer.card2Desc || "Zero hassle local Pakistani payments with instant PDF check-in voucher issuance."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{footer.card3Title || "24/7 Online Assistance"}</p>
              <p className="text-xs text-slate-400 mt-1">
                {footer.card3Desc || "Dedicated on-ground emergency and route coordinators active during your journeys."}
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-sm">
          <div>
            <p className="font-bold text-white text-xs mb-3 uppercase tracking-wider text-sky-400">
              {footer.col1Title || "Popular Destinations"}
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              {(footer.col1Links && footer.col1Links.length > 0 ? footer.col1Links : DEFAULT_SITE_SETTINGS.FOOTER.col1Links).map((link) => (
                <li key={link.id || link.url}>
                  <Link href={link.url} className="hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold text-white text-xs mb-3 uppercase tracking-wider text-orange-400">
              {footer.col2Title || "Experience Categories"}
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              {(footer.col2Links && footer.col2Links.length > 0 ? footer.col2Links : DEFAULT_SITE_SETTINGS.FOOTER.col2Links).map((link) => (
                <li key={link.id || link.url}>
                  <Link href={link.url} className="hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold text-white text-xs mb-3 uppercase tracking-wider text-teal-400">
              {footer.col3Title || "Traveler Guarantees"}
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              {(footer.col3Links && footer.col3Links.length > 0 ? footer.col3Links : DEFAULT_SITE_SETTINGS.FOOTER.col3Links).map((link) => (
                <li key={link.id || link.url}>
                  <Link href={link.url} className="hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold text-white text-xs mb-3 uppercase tracking-wider text-emerald-400">
              {footer.col4Title || "Direct Support"}
            </p>
            <div className="space-y-2.5 text-xs text-slate-400">
              <a
                href={`https://wa.me/${general.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20PakistanTravel.Agency%20Support`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition text-emerald-400 font-bold"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{general.whatsappNumber} (WhatsApp / Helpline)</span>
              </a>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{general.supportEmail}</span>
              </p>
              <p className="pt-1 text-[11px] text-slate-500">
                {general.address}
              </p>
              <p className="pt-1">
                <Link href="/how-we-verify-partners" className="text-sky-400 hover:text-white transition text-xs font-semibold">
                  How We Verify Partners →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{footer.copyrightNotice}</p>
          <div className="flex flex-wrap items-center gap-5 font-medium">
            <Link href="/about" className="hover:text-white transition">About Us</Link>
            <Link href="/blog" className="hover:text-white transition">Blog</Link>
            <Link href="/contact" className="hover:text-white transition">Contact & Help</Link>
            <Link href="/faq" className="hover:text-white transition">FAQs</Link>
            <Link href="/terms" className="hover:text-white transition">Terms & Policies</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
