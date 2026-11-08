"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { getSafeCallbackUrl } from "@/lib/safeRedirect";

export const dynamic = "force-dynamic";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const safeCallback = getSafeCallbackUrl(searchParams.get("callbackUrl"), "/secure-admin/dashboard");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
        callbackUrl: safeCallback,
      });

      if (res?.error) {
        setError(res.error || "Invalid administrative credentials. Access restricted.");
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
            <div className="w-14 h-14 relative rounded-2xl overflow-hidden shadow-md shadow-emerald-600/15">
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
          <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block">
            Internal Platform Operations
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Super Admin Sign In
          </h1>
          <p className="text-xs text-slate-500">
            Sign in with your authorized Administrator credentials
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Admin Login ID / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter Administrator Login ID or Email"
                className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Security Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Administrator Password"
                className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Verifying Authorization..." : "Access Control Center"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 font-semibold">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading admin portal...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
