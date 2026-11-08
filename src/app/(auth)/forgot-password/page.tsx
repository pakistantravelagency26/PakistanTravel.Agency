"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Mail, Lock, ArrowLeft, CheckCircle2, AlertCircle, KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"REQUEST" | "RESET" | "SUCCESS">("REQUEST");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Step 1: Request code
  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message);
        setStep("RESET");
        setResendCooldown(60);
      } else {
        setError(data.error || "Failed to process request. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Resend code
  async function handleResendCode() {
    if (resendCooldown > 0) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("A new 6-digit verification code has been dispatched.");
        setResendCooldown(60);
      } else {
        setError(data.error || "Failed to resend code.");
      }
    } catch {
      setError("Network error while resending code.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify code & reset password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify your entries.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/password-reset/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep("SUCCESS");
      } else {
        setError(data.error || "Failed to reset password. Please verify the 6-digit code.");
      }
    } catch {
      setError("Network error while resetting password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 mb-1">
            <Compass className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {step === "SUCCESS" ? "Password Updated" : "Reset your password"}
          </h1>
          <p className="text-xs text-slate-500">
            {step === "REQUEST" && "Enter your account email to receive a 6-digit verification code."}
            {step === "RESET" && "Enter the 6-digit code sent to your email along with your new password."}
            {step === "SUCCESS" && "Your password has been changed securely."}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && step === "RESET" && !error && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Step 1: Request Email */}
        {step === "REQUEST" && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition shadow-lg shadow-orange-500/25 disabled:opacity-50"
            >
              {loading ? "Sending Code..." : "Send Verification Code"}
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign in
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: Code Verification + New Password */}
        {step === "RESET" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || loading}
                  className="text-[11px] font-semibold text-sky-600 hover:underline disabled:text-slate-400"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full pl-9 pr-3.5 py-2.5 text-center font-mono tracking-widest text-lg font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Code expires in 10 minutes. Maximum 5 verification attempts.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1 border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Password Requirements:
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-500 text-[10px]">
                <li>Minimum 8 characters</li>
                <li>At least one uppercase and one lowercase letter</li>
                <li>At least one number and one special symbol (!@#$...)</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/25 disabled:opacity-50"
            >
              {loading ? "Updating Password..." : "Confirm & Update Password"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep("REQUEST");
                  setError(null);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change email address
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Screen */}
        {step === "SUCCESS" && (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-bold text-base text-slate-900">Password Reset Completed</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your password has been securely updated. For your safety, all active sessions and signed-in devices have been logged out.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-block w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md"
              >
                Sign in with New Password
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
