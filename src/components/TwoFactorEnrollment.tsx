"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ShieldCheck, Copy, Check, KeyRound, Download, AlertTriangle, ArrowRight, RefreshCw, Smartphone } from "lucide-react";

interface TwoFactorEnrollmentProps {
  portalName: string;
  onSuccessRedirect: string;
}

export default function TwoFactorEnrollment({ portalName, onSuccessRedirect }: TwoFactorEnrollmentProps) {
  const { update } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchSetup = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setQrCodeDataUrl(data.qrCodeDataUrl);
        setSecret(data.secret);
        setRecoveryCodes(data.recoveryCodes || []);
      } else {
        setError(data.error || "Failed to initialize 2FA setup.");
      }
    } catch {
      setError("Network error while initializing 2FA.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSetup();
  }, []);

  const handleCopySecret = () => {
    if (!secret) return;
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyCodes = () => {
    if (recoveryCodes.length === 0) return;
    navigator.clipboard.writeText(recoveryCodes.join("\n"));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleDownloadCodes = () => {
    const text = `PAKISTANTRAVEL.AGENCY - 2FA EMERGENCY RECOVERY CODES\nGenerated: ${new Date().toISOString()}\n\nKeep these single-use codes secure. Each code can only be used once.\n\n${recoveryCodes.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pakistantravel-2fa-recovery-codes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.trim().length !== 6) {
      setError("Please enter the 6-digit code from Google Authenticator.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/2fa/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        // Refresh session
        await update();
        setTimeout(() => {
          window.location.href = onSuccessRedirect;
        }, 1500);
      } else {
        setError(data.error || "Verification failed. Check the code and try again.");
      }
    } catch {
      setError("Network error while verifying 2FA code.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-xs font-semibold">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>Generating Google Authenticator key & recovery codes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl w-full mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-slate-100 pb-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mb-1">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block">
          Mandatory Security Enrollment
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Two-Factor Authentication (2FA)
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          To protect partner payouts, customer booking data, and administrative operations on{" "}
          <strong>{portalName}</strong>, 2FA with Google Authenticator is mandatory.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">2FA Verified & Activated!</h2>
          <p className="text-xs text-slate-500">Redirecting to your dashboard in a moment...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Step 1: Scan QR Code */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-sm font-bold text-slate-900">Scan QR Code with Authenticator</h2>
            </div>
            <p className="text-xs text-slate-500 pl-8">
              Open <strong>Google Authenticator</strong> (or Microsoft Authenticator / Apple Passwords) and scan the QR code below:
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 pl-8 pt-2">
              {qrCodeDataUrl && (
                <div className="p-2 bg-white rounded-2xl border border-slate-200 shadow-sm shrink-0">
                  <img src={qrCodeDataUrl} alt="2FA QR Code" width={160} height={160} className="rounded-xl" />
                </div>
              )}
              <div className="space-y-2 text-xs">
                <p className="font-semibold text-slate-700">Can&apos;t scan? Enter manually:</p>
                <div className="flex items-center gap-2 font-mono text-[11px] bg-white px-3 py-2 rounded-xl border border-slate-300">
                  <span className="truncate max-w-[180px]">{secret}</span>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="p-1 hover:text-emerald-600 text-slate-400"
                    title="Copy Secret"
                  >
                    {copiedSecret ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">Account: PakistanTravel.Agency</p>
              </div>
            </div>
          </div>

          {/* Step 2: Emergency Recovery Codes */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-bold text-slate-900">Save 10 Backup Recovery Codes</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCodes}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 px-2 py-1 rounded-lg bg-amber-100"
                >
                  {copiedCodes ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCodes ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCodes}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 px-2 py-1 rounded-lg bg-amber-100"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save File
                </button>
              </div>
            </div>
            <p className="text-xs text-amber-800 pl-8">
              Store these codes in a safe place. If you ever lose access to your phone, each code can be used once to sign in.
            </p>

            <div className="grid grid-cols-2 gap-2 pl-8 pt-1">
              {recoveryCodes.map((code, idx) => (
                <div key={idx} className="bg-white/80 border border-amber-200 px-2.5 py-1 rounded-lg font-mono text-xs font-semibold text-slate-800">
                  <span className="text-slate-400 text-[10px] mr-1.5">{idx + 1}.</span>
                  {code}
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Verify 6-digit Code */}
          <form onSubmit={handleVerify} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-bold text-slate-900">Enter 6-digit Authenticator Code</h2>
            </div>
            <p className="text-xs text-slate-500 pl-8">
              Enter the dynamic 6-digit code currently shown in Google Authenticator:
            </p>

            <div className="pl-8 space-y-4">
              <div className="relative max-w-xs">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full pl-9 pr-3.5 py-2.5 text-center font-mono tracking-widest text-lg font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || code.length !== 6}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/25 disabled:opacity-50"
              >
                {submitting ? "Verifying..." : "Verify & Activate 2FA"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Option to proceed to dashboard and setup later */}
          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                document.cookie = "snooze_2fa=1; path=/; max-age=86400; SameSite=Lax";
                window.location.href = onSuccessRedirect;
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold transition underline underline-offset-4"
            >
              Remind me later &bull; Continue to Dashboard &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
