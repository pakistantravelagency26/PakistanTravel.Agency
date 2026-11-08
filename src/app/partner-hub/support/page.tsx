"use client";

import { useEffect, useState } from "react";
import { 
  LifeBuoy, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  X
} from "lucide-react";

interface Ticket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerContact: string;
  category: string;
  message: string;
  status: string;
  priority: string;
  adminNotes: string | null;
  source: string;
  createdAt: string;
}

export default function PartnerHubSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [message, setMessage] = useState("");

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/tickets");
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets || []);
      }
    } catch (err: any) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleOpenTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please enter ticket details.");
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/vendor/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          category,
          priority,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({ type: "success", text: data.message });
        setSubject("");
        setMessage("");
        setCategory("GENERAL");
        setPriority("MEDIUM");
        setModalOpen(false);
        fetchTickets();
      } else {
        setStatusMsg({ type: "error", text: data.error || "Failed to create ticket." });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Network error submitting ticket." });
    } finally {
      setSubmitting(false);
    }
  };

  const openTickets = tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS");
  const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED");

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-orange-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Partner Help Desk &amp; Support Tickets
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Open direct assistance tickets with PakistanTravel.Agency platform administration, reservation managers, and finance team.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-sm"
            title="Refresh tickets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Open New Support Ticket</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold border ${
            statusMsg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Tickets</p>
            <p className="text-2xl font-black text-orange-600 mt-1">{openTickets.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Being reviewed by support</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved Tickets</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{resolvedTickets.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Completed inquiries</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tickets</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{tickets.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">All-time communications</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-900">Your Communication Tickets</h2>
          </div>
          <span className="text-xs font-medium text-slate-400">Total: {tickets.length}</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
            <span>Loading support tickets...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600 text-sm">No support tickets opened yet</p>
            <p className="max-w-sm mx-auto text-slate-400">
              Need assistance with your tour listings, calendar rates, guest cancellations, or payout disbursements? Open a ticket to contact our administration team.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 text-orange-700 font-bold hover:bg-orange-100 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Open First Ticket</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map((t) => (
              <div key={t.id} className="p-5 hover:bg-slate-50/60 transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800 border border-slate-200">
                      #{t.ticketNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                      {t.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        t.priority === "HIGH"
                          ? "bg-rose-100 text-rose-800"
                          : t.priority === "URGENT"
                          ? "bg-red-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        t.status === "OPEN"
                          ? "bg-amber-100 text-amber-800"
                          : t.status === "IN_PROGRESS"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {t.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 whitespace-pre-wrap bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                  {t.message}
                </div>

                {t.adminNotes && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Response from PakistanTravel Administration:</span>
                    </div>
                    <p className="whitespace-pre-wrap">{t.adminNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Open New Support Ticket */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Open New Support Ticket</h3>
                  <p className="text-xs text-slate-400">Direct transmission to platform operations desk</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOpenTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Ticket Subject / Tour Reference</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Booking PKT-2026-102 date change or Payout inquiry"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="GENERAL">General Inquiry</option>
                    <option value="BOOKING">Booking &amp; Departure Issue</option>
                    <option value="PAYMENT">Payout, Raast &amp; Commission</option>
                    <option value="LISTING">Tour Listing / Rate Approval</option>
                    <option value="TECHNICAL">Extranet Portal Technical Issue</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="LOW">Low (General query)</option>
                    <option value="MEDIUM">Medium (Standard)</option>
                    <option value="HIGH">High (Upcoming departure)</option>
                    <option value="URGENT">Urgent (Immediate assistance)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Message &amp; Inquiry Details</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your request, guest booking numbers, departure dates, or payout inquiries in detail..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition disabled:opacity-50 shadow-md shadow-orange-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? "Submitting Ticket..." : "Submit Ticket to Admin"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
