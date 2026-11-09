"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Cookie, Shield, Check, X } from "lucide-react";
import { updateAnalyticsConsent } from "@/lib/analytics";

export const CONSENT_STORAGE_KEY = "cookie_consent_analytics";

export function getStoredConsent(): "granted" | "denied" | null {
  if (typeof window === "undefined") return null;

  try {
    const local = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (local === "granted" || local === "denied") return local;

    // Fallback: check document.cookie
    const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_STORAGE_KEY}=([^;]*)`));
    if (match && (match[1] === "granted" || match[1] === "denied")) {
      return match[1] as "granted" | "denied";
    }
  } catch (e) {
    // Storage access blocked or restricted
  }

  return null;
}

export function saveStoredConsent(value: "granted" | "denied"): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value);
    document.cookie = `${CONSENT_STORAGE_KEY}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (e) {
    console.warn("Failed to persist cookie consent:", e);
  }
}

export default function CookieConsentBanner() {
  const [consentState, setConsentState] = useState<"granted" | "denied" | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const handleOpenPreferences = useCallback(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    setIsClient(true);
    const stored = getStoredConsent();
    setConsentState(stored);

    // If no prior consent decision, display the consent banner
    if (!stored) {
      setIsOpen(true);
    } else {
      // Restore previously saved consent decision in Google Consent Mode
      updateAnalyticsConsent(stored === "granted");
    }

    // Listen for custom open event triggered from footer "Cookie Preferences" link
    window.addEventListener("openCookiePreferences", handleOpenPreferences);
    return () => {
      window.removeEventListener("openCookiePreferences", handleOpenPreferences);
    };
  }, [handleOpenPreferences]);

  const handleAccept = () => {
    saveStoredConsent("granted");
    setConsentState("granted");
    updateAnalyticsConsent(true);
    setIsOpen(false);
  };

  const handleReject = () => {
    saveStoredConsent("denied");
    setConsentState("denied");
    updateAnalyticsConsent(false);
    setIsOpen(false);
  };

  if (!isClient || !isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie Preferences"
      aria-modal="true"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Cookie Preferences</span>
                {consentState && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      consentState === "granted"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    Current: {consentState === "granted" ? "Analytics Accepted" : "Analytics Rejected"}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">PakistanTravel.Agency Privacy &amp; Consent</p>
            </div>
          </div>

          {consentState && (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-300 mt-3.5 leading-relaxed">
          We use performance cookies and Google Analytics 4 to measure website traffic, search patterns, and improve tour booking navigation. Advertising and tracking cookies remain strictly disabled. You can adjust your choice at any time.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mt-5">
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept analytics</span>
          </button>

          <button
            type="button"
            onClick={handleReject}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reject analytics</span>
          </button>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-slate-400">
            <Shield className="w-3 h-3 text-emerald-400" /> Google Consent Mode v2 Active
          </span>
          <Link href="/privacy" className="text-emerald-400 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
