"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Compass, Lock, Mail, AlertCircle, ArrowRight, User, KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { getSafeCallbackUrl } from "@/lib/safeRedirect";

export const dynamic = "force-dynamic";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"), "/");
  const errorParam = searchParams.get("error");
  const { data: session, status } = useSession();

  let initialError = "";
  if (errorParam === "OAuthSignin" || errorParam === "OAuthCallback" || errorParam === "Configuration") {
    initialError = "Google / Facebook Sign-In requires valid API credentials in Vercel. Please configure GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET or sign in with your Email / Mobile below.";
  } else if (errorParam) {
    initialError = "Access denied or session expired. Please sign in again.";
  }

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [twoFactorPrompt, setTwoFactorPrompt] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);

  // If already authenticated as ADMIN or VENDOR, redirect appropriately
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "ADMIN") {
        window.location.href = "/secure-admin/dashboard";
      } else if (session?.user?.role === "VENDOR") {
        window.location.href = "/partner-hub/dashboard";
      }
    }
  }, [status, session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSocialNotice(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: identifier.trim(),
        password: password.trim(),
        totpCode: totpCode.trim(),
        portal: "CUSTOMER",
        callbackUrl,
      });

      if (res?.error === "2FA_REQUIRED") {
        setTwoFactorPrompt(true);
        setError("");
        setLoading(false);
        return;
      }

      if (res?.error) {
        setError(res.error || "Invalid Login ID or Password. Please try again.");
        setLoading(false);
      } else {
        try {
          const sessionRes = await fetch("/api/auth/session");
          const sessionData = await sessionRes.json();
          if (sessionData?.user?.role === "ADMIN") {
            window.location.href = "/secure-admin/dashboard";
            return;
          }
          if (sessionData?.user?.role === "VENDOR") {
            window.location.href = "/partner-hub/dashboard";
            return;
          }
        } catch {}
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  function handleSocialClick(provider: string) {
    setError("");
    setSocialNotice(null);
    if (provider === "Google") {
      signIn("google", { callbackUrl });
    } else if (provider === "Facebook") {
      signIn("facebook", { callbackUrl });
    } else {
      setSocialNotice(`${provider} Sign-In requires OAuth API credentials in your environment. You can sign in instantly using your Email / Phone number below.`);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 mb-1">
            <Compass className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {twoFactorPrompt ? "Security Verification (2FA)" : "Welcome back"}
          </h1>
          <p className="text-xs text-slate-500">
            {twoFactorPrompt
              ? isRecoveryMode
                ? "Enter one of your 10 single-use emergency backup recovery codes"
                : "Enter the dynamic 6-digit code from Google Authenticator"
              : "Sign in to manage your Northern Pakistan tour bookings"}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {socialNotice && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{socialNotice}</span>
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
                  className="text-[11px] font-semibold text-sky-600 hover:underline"
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
                  className="w-full pl-9 pr-3.5 py-2.5 text-center font-mono tracking-widest text-lg font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || totpCode.trim().length < 6}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "Confirm & Sign In"}
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
          <>
            {/* Social Logins */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleSocialClick("Google")}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-3 shadow-sm hover:shadow"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick("Facebook")}
                className="w-full py-2.5 px-4 rounded-xl border border-blue-600 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs transition flex items-center justify-center gap-3 shadow-sm hover:shadow"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
                or sign in with login id
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Login ID / Email / Mobile
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. user@example.com or 03001234567"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-sky-600 font-semibold hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition shadow-lg shadow-orange-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Authenticating..." : "Sign In with Credentials"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

        <p className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-sky-600 font-bold hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center text-xs text-slate-400">Loading sign in...</div>}>
      <CustomerLoginForm />
    </Suspense>
  );
}
