"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, Lock, Unlock, RefreshCw, AlertTriangle, Clock, History, CheckCircle2 } from "lucide-react";

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

export default function AdminSecurityPage() {
  const [blockedLogins, setBlockedLogins] = useState<BlockedLoginRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/security/blocked");
      if (res.ok) {
        const data = await res.json();
        setBlockedLogins(data.blockedLogins || []);
        setAuditLogs(data.recentAuditLogs || []);
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
              Login Security & Brute Force Defense
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Automated multi-tier throttling, 30-minute lockout protection, and constant-time authentication.
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Locked Accounts</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{activePairBlocks.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">3 failed attempts (IP + User)</p>
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
            <p className="text-xs font-semibold text-slate-500">Security Audit Events</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{auditLogs.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Logged incidents & actions</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <History className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Policy Explanation Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-tight">Active Multi-Tier Defense Rules</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="border-l border-slate-700 pl-3">
            <p className="font-semibold text-white">1. Pair Lockout (3 Fails)</p>
            <p className="text-[11px] text-slate-400 mt-1">
              3 consecutive wrong passwords for an IP+Email triggers an immediate 30-minute block.
            </p>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <p className="font-semibold text-white">2. Progressive Delay</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Each failure adds backoff delay (1s, 2s, 3s... up to 60s) before returning response.
            </p>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <p className="font-semibold text-white">3. Global IP Ceiling</p>
            <p className="text-[11px] text-slate-400 mt-1">
              30 total failures across all accounts in 1 hour locks the entire IP for 30 minutes.
            </p>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <p className="font-semibold text-white">4. Constant-Time Verify</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Dummy bcrypt execution on missing accounts prevents timing-based user enumeration.
            </p>
          </div>
        </div>
      </div>

      {/* Lockouts Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-bold text-slate-900">Active & Recent Lockouts</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Total: {blockedLogins.length}</span>
        </div>

        {blockedLogins.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            No active or recent lockouts recorded. All authentication endpoints are healthy.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Client IP</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Expires</th>
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
                      <td className="p-3 font-semibold text-slate-900">{item.target}</td>
                      <td className="p-3 font-mono text-slate-500">{item.ip}</td>
                      <td className="p-3 text-slate-500 max-w-xs truncate">{item.reason}</td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">
                        {new Date(item.expiresAt).toLocaleTimeString()}
                      </td>
                      <td className="p-3">
                        {isActive && (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                            ACTIVE
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
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50"
                          >
                            <Unlock className="w-3 h-3" />
                            Unblock
                          </button>
                        ) : (
                          <span className="text-slate-300 text-[11px]">—</span>
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

      {/* Audit Log Table */}
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
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
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
