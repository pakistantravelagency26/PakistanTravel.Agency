"use client";

import React, { useState, useEffect } from "react";
import {
  LifeBuoy,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
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

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  createdAt: string;
  messages: ChatMessage[];
}

export default function AdminTicketsPage() {
  const [activeTab, setActiveTab] = useState<"tickets" | "logs">("tickets");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const url =
        statusFilter === "ALL"
          ? "/api/admin/tickets"
          : `/api/admin/tickets?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tickets?view=logs");
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error("Failed to load chat logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "tickets") {
      fetchTickets();
    } else {
      fetchLogs();
    }
  }, [activeTab, statusFilter]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedTicket) return;
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          status: newStatus,
          adminNotes: adminNotesInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedTicket(data.ticket);
        setTickets((prev) =>
          prev.map((t) => (t.id === data.ticket.id ? data.ticket : t))
        );
      }
    } catch (err) {
      console.error("Failed to update ticket:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-emerald-600" />
            Support Desk & AI Chatbot Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer complaints, refunds, and review automated AI chat transcripts
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-lg bg-slate-200/80 p-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-4 py-1.5 rounded-md transition-colors ${
              activeTab === "tickets"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Support Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-1.5 rounded-md transition-colors ${
              activeTab === "logs"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            AI Chat Logs ({sessions.length})
          </button>
        </div>
      </div>

      {/* Metric Cards (Tickets Tab) */}
      {activeTab === "tickets" && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Open Tickets</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{openCount}</div>
            <span className="text-[10px] text-amber-600 font-medium">Requires response</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>In Progress</span>
              <Clock className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{inProgressCount}</div>
            <span className="text-[10px] text-sky-600 font-medium">Under investigation</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Resolved</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{resolvedCount}</div>
            <span className="text-[10px] text-emerald-600 font-medium">Completed handoffs</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>AI Grounding Status</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-sm font-bold text-slate-900 mt-2">Active & Grounded</div>
            <span className="text-[10px] text-slate-400">DB + SiteConfig Synchronized</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === "tickets" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <div className="flex gap-1.5 overflow-x-auto">
                {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase transition-colors ${
                      statusFilter === s
                        ? "bg-emerald-700 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={fetchTickets}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                Loading support tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
                <LifeBuoy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">No support tickets found</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Customer handoff inquiries submitted to the chatbot will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTicket(t);
                      setAdminNotesInput(t.adminNotes || "");
                    }}
                    className={`p-4 bg-white rounded-xl border cursor-pointer transition-all hover:border-emerald-400 shadow-xs ${
                      selectedTicket?.id === t.id
                        ? "border-emerald-600 ring-1 ring-emerald-600"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {t.ticketNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            t.status === "OPEN"
                              ? "bg-amber-100 text-amber-800"
                              : t.status === "IN_PROGRESS"
                              ? "bg-sky-100 text-sky-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {t.status}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {t.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-2.5">
                      <h4 className="text-xs font-bold text-slate-800">{t.customerName}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">{t.message}</p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span>Contact: {t.customerContact}</span>
                      <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                        View Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ticket Detail Drawer */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs h-fit space-y-4">
            {selectedTicket ? (
              <>
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-1">
                    {selectedTicket.customerName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedTicket.customerContact}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Customer Message / Complaint
                  </label>
                  <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-1 whitespace-pre-wrap">
                    {selectedTicket.message}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Update Ticket Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusUpdate(st)}
                        disabled={isUpdating}
                        className={`text-xs py-1.5 px-2 rounded-lg font-bold border transition-colors ${
                          selectedTicket.status === st
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Internal Admin Notes
                  </label>
                  <textarea
                    rows={3}
                    value={adminNotesInput}
                    onChange={(e) => setAdminNotesInput(e.target.value)}
                    placeholder="Add notes on customer resolution, refund transaction, or partner outreach..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => handleStatusUpdate(selectedTicket.status)}
                    disabled={isUpdating}
                    className="w-full text-xs py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Save Admin Notes"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select a ticket from the list to view full customer details and take action.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* AI Chat Logs Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Recent AI Conversations
            </h3>
            {loading ? (
              <div className="text-xs text-slate-400 py-6 text-center">Loading logs...</div>
            ) : sessions.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">No chat logs recorded yet.</div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSession(s)}
                    className={`p-3 rounded-lg border cursor-pointer text-xs transition-colors ${
                      selectedSession?.id === s.id
                        ? "bg-emerald-50 border-emerald-500"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span>ID: {s.id.slice(0, 14)}...</span>
                      <span>{new Date(s.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-slate-800 font-bold mt-1">
                      {s.messages.length} Messages
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transcript Viewer */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Conversation Transcript
            </h3>
            {selectedSession ? (
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
                {selectedSession.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl text-xs ${
                      m.role === "user"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-950 ml-6"
                        : "bg-slate-50 border border-slate-200 text-slate-800 mr-6"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>{m.role === "user" ? "Traveler" : "PakistanTravel AI"}</span>
                      <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs">
                Select a conversation session to review the transcript.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
