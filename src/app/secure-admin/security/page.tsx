"use client";

import { useEffect, useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  History, 
  CheckCircle2,
  Mail,
  KeyRound,
  Send,
  UserX,
  Search,
  CheckCircle
} from "lucide-react";

interface BlockedLoginRecord {
  id: string;
  key: string;
  type: "PAIR" | "GLOBAL_IP";
  target: string;
  ip: string;
  reason: string;
  blockedAt: string;
  expiresAt: string;
  unblockedAt: string | null;
  unblockedBy: string | null;
}

interface AuditLogRecord {
  id: string;
  action: string;
  actorEmail: string | null;
  ip: string | null;
  resourceType: string | null;
  details: string | null;
  createdAt: string;
}

interface FailedAttemptRecord {
  id: string;
  identifier: string;
  ip: string;
  attemptAt: string;
}

export default function AdminSecurityPage() {
  const [blockedLogins, setBlockedLogins] = useState<BlockedLoginRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [failedAttempts, setFailedAttempts] = useState<FailedAttemptRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 2FA / Password Reset dispatcher state
  const [targetEmail, setTargetEmail] = useState("");
  const [resetReason, setResetReason] = useState("Administrative password recovery");
  const [resetAction, setResetAction] = useState<"BOTH" | "SEND_PASSWORD_RESET" | "RESET_2FA">("BOTH");
  const [dispatcherLoading, setDispatcherLoading] = useState(false);
  const [dispatcherResult, setDispatcherResult] = useState<{
    message: string;
    code?: string;
    targetEmail: string;
  } | null>(null);

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/security/blocked");
      if (res.ok) {
        const data = await res.json();
        setBlockedLogins(data.blockedLogins || []);
        setAuditLogs(data.recentAuditLogs || []);
        setFailedAttempts(data.recentFailedAttempts || []);
      }
    } catch (err) {
      console.error("Failed to load security data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const handleUnblock = async (blockId: string) => {
    if (!confirm("Are you sure you want to unblock this target?")) return;
    setActionLoading(blockId);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/security/blocked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: "Target unblocked successfully." });
        await fetchSecurityData();
      } else {
        setMsg({ type: "error", text: data.error || "Failed to unblock target." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Network error while unblocking." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockTarget = async (targetIdentifier: string) => {
    if (!confirm(`Are you sure you want to clear all blocks for "${targetIdentifier}"?`)) return;
    setActionLoading(targetIdentifier);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/security/blocked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: targetIdentifier }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: data.message });
        await fetchSecurityData();
      } else {
        setMsg({ type: "error", text: data.error || "Failed to unblock target." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Network error." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDispatchSecurityReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim() || !targetEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setDispatcherLoading(true);
    setDispatcherResult(null);
    setMsg(null);

    try {
      const res = await fetch("/api/admin/security/send-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail.trim(),
          action: resetAction,
          reason: resetReason.trim() || "Admin initiated reset",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDispatcherResult({
          message: data.message,
          code: data.code,
          targetEmail: data.targetEmail,
        });
        setMsg({ type: "success", text: `Success: ${data.message}` });
        fetchSecurityData();
      } else {
        setMsg({ type: "error", text: data.error || "Failed to process security reset." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Network error." });
    } finally {
      setDispatcherLoading(false);
    }
  };

  const now = new Date();
  const activePairBlocks = blockedLogins.filter(
    (b) => b.type === "PAIR" && !b.unblockedAt && new Date(b.expiresAt) > now
  );
  const activeIpBlocks = blockedLogins.filter(
    (b) => b.type === "GLOBAL_IP" && !b.unblockedAt && new Date(b.expiresAt) > now
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Security Hub: 2FA, Blocked Accounts & Password Resets
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Real-time brute force defense, blocked ID monitor, remote 2FA clearing, and transactional password reset mailer.
          </p>
        </div>
        <button
          onClick={fetchSecurityData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Status
        </button>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border ${
            msg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* SECTION 1: 2FA & Password Reset Email Dispatcher */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              User 2FA Reset & Password Reset Email Dispatcher
            </h2>
            <p className="text-xs text-slate-500">
              Enter any Admin, Vendor, or Customer email to dispatch a secure 6-digit password reset code via email or reset their 2FA
            </p>
          </div>
        </div>

        <form onSubmit={handleDispatchSecurityReset} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Account Email</span>
            </label>
            <input
              type="email"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              placeholder="e.g. emran@gmail.com or vendor@agency.pk"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Security Action</label>
            <select
              value={resetAction}
              onChange={(e) => setResetAction(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="BOTH">Reset 2FA + Send Password Reset Email</option>
              <option value="SEND_PASSWORD_RESET">Send Password Reset Email Only</option>
              <option value="RESET_2FA">Reset 2FA Only (Clear TOTP)</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={dispatcherLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{dispatcherLoading ? "Dispatching..." : "Send Reset Email"}</span>
            </button>
          </div>
        </form>

        {dispatcherResult && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Action Dispatched Successfully</span>
            </div>
            <p className="text-emerald-700">{dispatcherResult.message}</p>
            {dispatcherResult.code && (
              <p className="font-mono text-emerald-900 text-xs font-black mt-2">
                Verification Code Generated: <span className="bg-emerald-200 px-2 py-0.5 rounded">{dispatcherResult.code}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Currently Blocked IDs</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{activePairBlocks.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">3 failed attempts (IP + Email/Phone)</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Global IP Blocks</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{activeIpBlocks.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">&gt;30 failures/hr threshold</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Recent Failed Attempts</p>
            <p className="text-2xl font-black text-orange-600 mt-1">{failedAttempts.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Recorded incorrect credentials</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SECTION 2: Blocked Login IDs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Blocked IDs &amp; Lockout Monitor (Kaun si ID block hui hai)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Total: {blockedLogins.length}</span>
        </div>

        {blockedLogins.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            No active or recent lockouts recorded. All accounts and IP addresses are currently unblocked.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Blocked Login ID / Email</th>
                  <th className="p-3">Client IP</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Locked Until</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {blockedLogins.map((item) => {
                  const isExpired = new Date(item.expiresAt) <= now;
                  const isUnblocked = Boolean(item.unblockedAt);
                  const isActive = !isExpired && !isUnblocked;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.type === "GLOBAL_IP"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          {item.target}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-500">{item.ip}</td>
                      <td className="p-3 text-slate-500 max-w-xs truncate">{item.reason}</td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">
                        {new Date(item.expiresAt).toLocaleTimeString()}
                      </td>
                      <td className="p-3">
                        {isActive && (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                            BLOCKED (ACTIVE)
                          </span>
                        )}
                        {isUnblocked && (
                          <span className="text-emerald-600 font-semibold text-[11px]">
                            Unblocked ({item.unblockedBy})
                          </span>
                        )}
                        {isExpired && !isUnblocked && (
                          <span className="text-slate-400 text-[11px]">Expired</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {isActive ? (
                          <button
                            onClick={() => handleUnblock(item.id)}
                            disabled={actionLoading === item.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 shadow-sm"
                          >
                            <Unlock className="w-3 h-3" />
                            Unblock ID
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblockTarget(item.target)}
                            disabled={actionLoading === item.target}
                            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-[11px] font-semibold"
                          >
                            <span>Clear Cache</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 3: Recent Failed Attempts Log */}
      {failedAttempts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-orange-500" />
              <h2 className="text-sm font-bold text-slate-900">
                Recent Failed Login Attempts (Incorrect Credentials Entered)
              </h2>
            </div>
            <span className="text-xs text-slate-400">Last 25 events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3">Attempted ID</th>
                  <th className="p-3">Client IP</th>
                  <th className="p-3">Time</th>
                  <th className="p-3 text-right">Quick Unblock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {failedAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{att.identifier}</td>
                    <td className="p-3 font-mono text-slate-500">{att.ip}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">
                      {new Date(att.attemptAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleUnblockTarget(att.identifier)}
                        disabled={actionLoading === att.identifier}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                      >
                        <Unlock className="w-3 h-3 text-emerald-600" />
                        <span>Unblock {att.identifier}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-bold text-slate-900">Security Audit Trail</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Recent events: {auditLogs.length}</span>
        </div>

        {auditLogs.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">No audit events recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Actor / Target</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">{log.actorEmail || "—"}</td>
                    <td className="p-3 font-mono text-slate-500">{log.ip || "—"}</td>
                    <td className="p-3 text-slate-500 text-[11px]">{log.details || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
