"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { getSafeCallbackUrl } from "@/lib/safeRedirect";

export const dynamic = "force-dynamic";

function VendorLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const safeCallback = getSafeCallbackUrl(searchParams.get("callbackUrl"), "/partner-hub/listings");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [twoFactorPrompt, setTwoFactorPrompt] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: identifier.trim(),
        password: password.trim(),
        totpCode: totpCode.trim(),
        portal: "VENDOR",
        callbackUrl: safeCallback,
      });

      if (res?.error === "2FA_REQUIRED") {
        setTwoFactorPrompt(true);
        setError("");
        setLoading(false);
        return;
      }

      if (res?.error) {
        setError(res.error || "Invalid vendor credentials. Check your Login ID or password.");
        setLoading(false);
      } else {
        window.location.href = safeCallback;
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-800">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center mb-2">
            <div className="w-14 h-14 relative rounded-2xl overflow-hidden shadow-md shadow-sky-600/15">
              <Image
                src="/logo.png"
                alt="PakistanTravel.Agency"
                fill
                sizes="56px"
                className="object-cover"
                priority
              />
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest block">
            Partner Extranet Portal
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {twoFactorPrompt ? "Security Verification (2FA)" : "Vendor Partner Sign In"}
          </h1>
          <p className="text-xs text-slate-500">
            {twoFactorPrompt
              ? isRecoveryMode
                ? "Enter one of your emergency recovery codes"
                : "Enter the 6-digit code from Google Authenticator"
              : "Sign in to manage your tours, update prices, and track guest bookings"}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {twoFactorPrompt ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {isRecoveryMode ? "Emergency Recovery Code" : "Authenticator Code"}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryMode(!isRecoveryMode);
                    setTotpCode("");
                    setError("");
                  }}
                  className="text-[11px] font-semibold text-orange-600 hover:underline"
                >
                  {isRecoveryMode ? "Use Authenticator App" : "Use Recovery Code"}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  maxLength={isRecoveryMode ? 9 : 6}
                  required
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.toUpperCase())}
                  placeholder={isRecoveryMode ? "XXXX-XXXX" : "123456"}
                  className="w-full pl-9 pr-3.5 py-2.5 text-center font-mono tracking-widest text-lg font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || totpCode.trim().length < 6}
              className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-orange-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "Confirm & Enter Extranet"}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setTwoFactorPrompt(false);
                  setTotpCode("");
                  setError("");
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Credentials
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Vendor Email / Login ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="partner@yourcompany.pk"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-orange-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-orange-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Signing In..." : "Sign in to Extranet"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Protected by 3-Strike Lockout & Mandatory TOTP 2FA</span>
        </div>
      </div>
    </div>
  );
}

export default function VendorLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs font-semibold">
          Loading Partner Portal...
        </div>
      }
    >
      <VendorLoginForm />
    </Suspense>
  );
}
