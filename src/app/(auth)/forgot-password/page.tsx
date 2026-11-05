"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 mb-1">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Reset your password
          </h2>
          <p className="text-xs text-slate-500">
            Enter your account email to receive a password reset link
          </p>
        </div>

        {sent ? (
          <div className="py-6 text-center space-y-2 text-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-slate-900">Reset instructions sent!</h3>
            <p className="text-slate-500">Check your inbox at <strong>{email}</strong> for instructions.</p>
            <div className="pt-4">
              <Link href="/login" className="text-sky-600 font-bold hover:underline">
                Return to Sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
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
              className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition shadow-lg shadow-orange-500/25"
            >
              Send Reset Link
            </button>

            <div className="text-center">
              <Link href="/login" className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
