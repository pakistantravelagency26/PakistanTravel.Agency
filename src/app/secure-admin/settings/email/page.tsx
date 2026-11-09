"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mail,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  KeyRound,
  Server,
  Lock,
  Globe,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

interface EmailSettingsState {
  enabled: boolean;
  senderName: string;
  senderEmail: string;
  smtpUser: string;
  smtpPass: string;
  isPasswordConfigured: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  adminEmail: string;
  replyTo: string;
}

export default function AdminEmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSettingsState>({
    enabled: true,
    senderName: "PakistanTravel.Agency",
    senderEmail: "",
    smtpUser: "",
    smtpPass: "",
    isPasswordConfigured: false,
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpSecure: false,
    adminEmail: "",
    replyTo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Connection Test State
  const [testConnLoading, setTestConnLoading] = useState(false);
  const [testConnStatus, setTestConnStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Send Test Email State
  const [showTestModal, setShowTestModal] = useState(false);
  const [testRecipient, setTestRecipient] = useState("");
  const [sendTestLoading, setSendTestLoading] = useState(false);
  const [sendTestStatus, setSendTestStatus] = useState<{ success: boolean; message: string } | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/email");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings({
          enabled: data.settings.enabled ?? true,
          senderName: data.settings.senderName || "PakistanTravel.Agency",
          senderEmail: data.settings.senderEmail || "",
          smtpUser: data.settings.smtpUser || data.settings.senderEmail || "",
          smtpPass: "",
          isPasswordConfigured: Boolean(data.settings.isPasswordConfigured),
          smtpHost: data.settings.smtpHost || "smtp.gmail.com",
          smtpPort: Number(data.settings.smtpPort) || 587,
          smtpSecure: Boolean(data.settings.smtpSecure),
          adminEmail: data.settings.adminEmail || "",
          replyTo: data.settings.replyTo || "",
        });
        if (data.settings.adminEmail || data.settings.senderEmail) {
          setTestRecipient((prev) => prev || data.settings.adminEmail || data.settings.senderEmail);
        }
      }
    } catch (err) {
      console.error("Failed to load email settings:", err);
      setSaveStatus({ type: "error", message: "Failed to load settings from server." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveStatus(null);

    try {
      const res = await fetch("/api/admin/settings/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: settings.enabled,
          senderName: settings.senderName,
          senderEmail: settings.senderEmail,
          smtpUser: settings.smtpUser || settings.senderEmail,
          smtpPass: settings.smtpPass,
          smtpHost: settings.smtpHost,
          smtpPort: Number(settings.smtpPort),
          smtpSecure: settings.smtpSecure,
          adminEmail: settings.adminEmail,
          replyTo: settings.replyTo || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus({ type: "success", message: "Email configuration saved and activated successfully." });
        setSettings((prev) => ({
          ...prev,
          smtpPass: "",
          isPasswordConfigured: Boolean(data.settings.isPasswordConfigured),
        }));
      } else {
        setSaveStatus({ type: "error", message: data.error || "Failed to save settings." });
      }
    } catch (err: any) {
      setSaveStatus({ type: "error", message: err.message || "Network error while saving settings." });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestConnLoading(true);
    setTestConnStatus(null);

    try {
      const res = await fetch("/api/admin/settings/email/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smtpHost: settings.smtpHost,
          smtpPort: Number(settings.smtpPort),
          smtpSecure: settings.smtpSecure,
          senderEmail: settings.senderEmail,
          smtpUser: settings.smtpUser || settings.senderEmail,
          smtpPass: settings.smtpPass,
        }),
      });

      const data = await res.json();
      setTestConnStatus({
        success: Boolean(data.success),
        message: data.message || (data.success ? "Connection verified!" : "Handshake failed."),
      });
    } catch (err: any) {
      setTestConnStatus({
        success: false,
        message: err.message || "Failed to initiate SMTP test connection.",
      });
    } finally {
      setTestConnLoading(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient) {
      setSendTestStatus({ success: false, message: "Please enter a recipient email address." });
      return;
    }

    setSendTestLoading(true);
    setSendTestStatus(null);

    try {
      const res = await fetch("/api/admin/settings/email/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: testRecipient,
          smtpHost: settings.smtpHost,
          smtpPort: Number(settings.smtpPort),
          smtpSecure: settings.smtpSecure,
          senderName: settings.senderName,
          senderEmail: settings.senderEmail,
          smtpUser: settings.smtpUser || settings.senderEmail,
          smtpPass: settings.smtpPass,
          replyTo: settings.replyTo || null,
        }),
      });

      const data = await res.json();
      setSendTestStatus({
        success: Boolean(data.success),
        message: data.message || (data.success ? "Test email sent!" : "Delivery failed."),
      });
    } catch (err: any) {
      setSendTestStatus({
        success: false,
        message: err.message || "Network error sending test email.",
      });
    } finally {
      setSendTestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="text-xs font-semibold">Loading email configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Booking Email Settings</h1>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  settings.enabled
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {settings.enabled ? "Active" : "Disabled"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure Gmail SMTP credentials, alerts, and automated multi-party booking vouchers.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testConnLoading}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Server className={`w-3.5 h-3.5 ${testConnLoading ? "animate-spin text-emerald-600" : "text-slate-500"}`} />
            <span>{testConnLoading ? "Testing..." : "Test SMTP Connection"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTestModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Test Email</span>
          </button>
        </div>
      </div>

      {/* Inline Connection Test Status Banner */}
      {testConnStatus && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium flex items-start gap-2.5 border ${
            testConnStatus.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          {testConnStatus.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <span className="font-bold">{testConnStatus.success ? "Connection Verified: " : "Connection Error: "}</span>
            <span>{testConnStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setTestConnStatus(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Save Status Banner */}
      {saveStatus && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-2.5 border ${
            saveStatus.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          {saveStatus.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Dispatcher &amp; Sender Configuration</h2>
              <p className="text-[11px] text-slate-500">
                All settings are stored securely on the database server without redeploying.
              </p>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800">Enable booking emails</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Sender Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Sender Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={settings.senderName}
                onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                placeholder="PakistanTravel.Agency"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2.5 font-medium text-slate-900 transition outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The friendly display name customers and partners see in their email client.
              </p>
            </div>

            {/* Sender Gmail address */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Sender Gmail Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={settings.senderEmail}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    senderEmail: e.target.value,
                    smtpUser: settings.smtpUser === settings.senderEmail ? e.target.value : settings.smtpUser,
                  })
                }
                placeholder="pakistantravelagency26@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2.5 font-medium text-slate-900 transition outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The Gmail account used to dispatch all booking confirmations and operational alerts.
              </p>
            </div>

            {/* Gmail App Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-slate-700">
                  Gmail App Password (16-char) <span className="text-rose-500">*</span>
                </label>
                {settings.isPasswordConfigured && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Password configured
                  </span>
                )}
              </div>
              <input
                type="password"
                value={settings.smtpPass}
                onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                placeholder={settings.isPasswordConfigured ? "••••••••••••••••" : "Enter 16-character App Password"}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2.5 font-mono text-slate-900 transition outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Encrypted at rest using AES-256-GCM. Leave blank to preserve existing configured password.
              </p>
            </div>

            {/* Admin booking email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Admin Booking Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                placeholder="ops@pakistantravel.agency"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2.5 font-medium text-slate-900 transition outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The inbox that receives the platform administrator copy of all reservations.
              </p>
            </div>

            {/* SMTP Host */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">SMTP Host</label>
              <input
                type="text"
                required
                value={settings.smtpHost}
                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                placeholder="smtp.gmail.com"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2.5 font-mono text-slate-900 transition outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Default for Gmail accounts is smtp.gmail.com.</p>
            </div>

            {/* SMTP Port & Encryption */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">SMTP Port &amp; Encryption</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, smtpPort: 587, smtpSecure: false })}
                  className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                    settings.smtpPort === 587 && !settings.smtpSecure
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Port 587 (STARTTLS)
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, smtpPort: 465, smtpSecure: true })}
                  className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                    settings.smtpPort === 465 && settings.smtpSecure
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Port 465 (SSL / TLS)
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Port 587 with STARTTLS is recommended by Google for Gmail outbound services.
              </p>
            </div>

            {/* Reply-To Address */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">
                Reply-To Address <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                value={settings.replyTo}
                onChange={(e) => setSettings({ ...settings, replyTo: e.target.value })}
                placeholder="support@pakistantravel.agency"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2.5 font-medium text-slate-900 transition outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                If provided, customer replies to their confirmation emails will route to this address.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saveLoading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {saveLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{saveLoading ? "Saving Settings..." : "Save Settings"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Recipient Roles & Routing Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>Automated 3-Way Confirmation Dispatch Architecture</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          When any reservation transitions to <strong>CONFIRMED</strong> status, three distinct, isolated emails are generated and enqueued with transaction-safe deduplication protection:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-900">1. Client Voucher Copy</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Customer</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dispatched to guest email on checkout. Includes booking number, travel dates, passenger count, itinerary summary, and direct link to the verifiable web voucher.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-900">2. Partner Fulfilment Copy</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">Tour Operator</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dispatched to the operator account assigned to the listing. Contains passenger contact info, special requests, net earnings, and link to the Partner Hub. If missing, flagged in Admin without blocking customer delivery.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-900">3. Platform Admin Copy</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">Platform Ops</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dispatched to configured Admin Booking Email with gross amounts, platform take-rate, financial transaction references, and quick access link to the Admin booking moderation ledger.
            </p>
          </div>
        </div>
      </div>

      {/* Send Test Email Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Send Test Alert Email</h3>
                  <p className="text-[11px] text-slate-500">Dispatch a test message using current settings</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowTestModal(false);
                  setSendTestStatus(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {sendTestStatus && (
              <div
                className={`p-3 rounded-2xl text-xs font-semibold flex items-start gap-2 border ${
                  sendTestStatus.success
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                {sendTestStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{sendTestStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Test Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  The test email is clearly marked as a test and does not affect live bookings or reveal passwords.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowTestModal(false);
                    setSendTestStatus(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={sendTestLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${sendTestLoading ? "animate-spin" : ""}`} />
                  <span>{sendTestLoading ? "Dispatching..." : "Send Test Now"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
