"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Phone, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  User,
  Mail,
  Loader2,
  FileText
} from "lucide-react";

interface VendorProfile {
  id: string;
  businessName: string;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  cnicOrTaxNumber: string;
  status: string;
  email: string;
  username: string;
  name: string;
}

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/partner/profile");
        const data = await res.json();
        if (data.success && data.profile) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error("Failed to load partner profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!currentPassword || !newPassword) {
      setFeedback({ type: "error", message: "Please fill in all password fields." });
      return;
    }

    if (newPassword.length < 8) {
      setFeedback({ type: "error", message: "New password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "New password and confirm password do not match." });
      return;
    }

    setChangingPassword(true);

    try {
      const res = await fetch("/api/partner/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password.");
      }

      setFeedback({
        type: "success",
        message: "Your password has been changed successfully! Keep it safe.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to update password.",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-slate-500 font-medium">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600 mr-2" />
        Loading Partner Profile & Security Settings...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Partner Account & Security
          </span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-emerald-600" />
          Partner Profile &amp; Password Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View your verified agency details and manage your account sign-in password
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2.5 text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
              : "bg-red-50 border border-red-200 text-red-900"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* CARD 1: VERIFIED PROFILE DETAILS (READ-ONLY) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-extrabold text-slate-900">
              Verified Agency Profile Details
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Lock className="w-3 h-3 text-emerald-600" />
            Verified &amp; Managed by Super Admin
          </span>
        </div>

        {/* Administration Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700">
          <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-slate-900">
              Profile Management Notice:
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Your company name, operational base, phone numbers, WhatsApp, and licensing information are managed and verified by <strong>PakistanTravel.Agency Super Administration</strong>. To request updates to your company profile, please contact administrator support.
            </p>
          </div>
        </div>

        {/* Details Grid (Read-Only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Company / Operator Name
            </span>
            <span className="font-bold text-slate-800 block text-sm">
              {profile?.businessName || "N/A"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Operational City / Hub
            </span>
            <span className="font-bold text-slate-800 block text-sm flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {profile?.city || "N/A"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Primary Office Phone
            </span>
            <span className="font-bold text-slate-800 block flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {profile?.phone || "N/A"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Host WhatsApp (Guest Coordination)
            </span>
            <span className="font-bold text-emerald-800 block flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              {profile?.whatsapp || "N/A"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Registered Sign-In Email
            </span>
            <span className="font-bold text-slate-800 block flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {profile?.email || "N/A"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Login ID / Username
            </span>
            <span className="font-bold text-slate-800 block flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {profile?.username || profile?.id || "N/A"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Tourism License / CNIC Reference
            </span>
            <span className="font-bold text-slate-800 block flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              {profile?.cnicOrTaxNumber || "Verified"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Office / Hub Address
            </span>
            <span className="font-medium text-slate-700 block">
              {profile?.address || "Address on file"}
            </span>
          </div>
        </div>
      </div>

      {/* CARD 2: PASSWORD CHANGE FORM */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <KeyRound className="w-5 h-5 text-emerald-600" />
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              Change Account Password
            </h2>
            <p className="text-[11px] text-slate-500">
              Update your sign-in password to keep your vendor partner account secure
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">At least 8 characters.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            🔒 Passwords are cryptographically hashed using bcrypt (cost 12).
          </span>
          <button
            type="submit"
            disabled={changingPassword}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            <span>{changingPassword ? "Updating Password..." : "Update Password"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
