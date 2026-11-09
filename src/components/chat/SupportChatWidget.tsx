"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  LifeBuoy,
  ShieldAlert,
  ChevronDown,
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { siteConfig } from "@/config/site";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ParsedListingCard {
  slug: string;
  title: string;
  price: string;
  type: string;
  destination: string;
}

function parseListingToken(text: string): { cleanText: string; listing?: ParsedListingCard } {
  const match = text.match(/\[\[LISTING:([^:]+):([^:]+):([^:]+):([^:]+):([^\]]+)\]\]/);
  if (!match) return { cleanText: text };

  const [fullMatch, slug, title, price, type, destination] = match;
  const cleanText = text.replace(fullMatch, "").trim();

  return {
    cleanText,
    listing: {
      slug: slug.trim(),
      title: title.trim(),
      price: price.trim(),
      type: type.trim(),
      destination: destination.trim(),
    },
  };
}

export default function SupportChatWidget() {
  const pathname = usePathname();

  // The AI Chatbot widget must NOT render on portal, admin, dashboard, or auth pages (public pages only)
  const isExcluded =
    !pathname ||
    pathname.startsWith("/partner-hub") ||
    pathname.startsWith("/secure-admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/account") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/forgot-password");

  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Ticket handoff form state
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketName, setTicketName] = useState("");
  const [ticketContact, setTicketContact] = useState("");
  const [ticketCategory, setTicketCategory] = useState<"GENERAL" | "REFUND" | "PAYMENT" | "COMPLAINT">("GENERAL");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccessNumber, setTicketSuccessNumber] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize unique session ID
  useEffect(() => {
    let sid = sessionStorage.getItem("pta_chat_session_id");
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      sessionStorage.setItem("pta_chat_session_id", sid);
    }
    setSessionId(sid);

    // Initial greeting message
    const greeting: ChatMessage = {
      id: "greeting",
      role: "assistant",
      content: `Assalam-o-Alaikum! 🏔️ I am the **${siteConfig.name}** AI assistant.\n\nI can help you explore guided tour packages across Hunza, Skardu, Swat, and northern valleys, explain our cancellation and payment policies, or connect you with support.\n\nHow may I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([greeting]);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Listen for global open-support-chat events (e.g. from listing detail "Chat with Operator" button)
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ query?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.query) {
        setInputValue(customEvent.detail.query);
      }
    };
    window.addEventListener("open-support-chat", handleOpenChat);
    return () => window.removeEventListener("open-support-chat", handleOpenChat);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputValue;
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    if (trimmed.length > 500) {
      alert("Message is limited to 500 characters.");
      return;
    }

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    const assistantMsgId = "a_" + Date.now();
    const newAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newAssistantMsg]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        let errMsg = "Unable to process request right now.";
        try {
          const errJson = await response.json();
          errMsg = errJson.error || errJson.message || errMsg;
        } catch {
          // Ignore JSON parse errors
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: `⚠️ ${errMsg} For assistance, please email **${siteConfig.contact.supportEmail}** or use our [Contact Form](/contact).`,
                }
              : m
          )
        );
        setIsLoading(false);
        return;
      }

      if (!response.body) {
        throw new Error("No response stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: accumulated } : m))
        );
      }
    } catch (err) {
      console.error("[ChatWidget] Streaming error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: `Assalam-o-Alaikum! Our live AI chat is synchronizing with our database. For any inquiries, bookings, or cancellations, please reach out to **${siteConfig.contact.supportEmail}** or visit our [Contact Form](/contact).`,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      if (!isOpen) setHasUnread(true);
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName.trim() || !ticketContact.trim() || !ticketMessage.trim()) {
      alert("Please fill in your name, contact information, and message.");
      return;
    }

    setIsSubmittingTicket(true);
    try {
      const res = await fetch("/api/chat/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: ticketName,
          customerContact: ticketContact,
          category: ticketCategory,
          message: ticketMessage,
          sessionId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit ticket");
      }

      setTicketSuccessNumber(data.ticket.ticketNumber);

      // Append confirmation to chat
      const confirmationMsg: ChatMessage = {
        id: "tkt_" + Date.now(),
        role: "assistant",
        content: `✅ **Support Ticket Created: #${data.ticket.ticketNumber}**\n\nThank you, **${ticketName}**. Your request has been forwarded to our support desk (${siteConfig.contact.supportEmail}). We will review your message and reply via **${ticketContact}** within our business support hours (${siteConfig.contact.supportHours.humanEmail}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, confirmationMsg]);

      // Reset ticket form
      setShowTicketForm(false);
      setTicketName("");
      setTicketContact("");
      setTicketMessage("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create ticket.");
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const quickPrompts = [
    { label: "Hunza Valley Tours", query: "What tour packages are available in Hunza Valley?" },
    { label: "Cancellation Policy", query: "What is your cancellation and refund policy?" },
    { label: "Payment Methods", query: "What payment methods do you accept for booking?" },
    { label: "List My Tour Package", query: "How can a local tour operator list packages on the platform?" },
  ];

  if (isExcluded) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open PakistanTravel AI Assistant"
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 border border-emerald-500/30"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </div>
            <span className="text-xs font-bold tracking-wide">Ask AI Travel Desk</span>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Customer Support AI Chat"
          className="fixed bottom-4 right-4 z-50 w-[94vw] sm:w-[420px] h-[600px] max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-slate-900 text-white p-4 shrink-0 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600/60 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1.5 tracking-tight">
                  {siteConfig.name} AI Desk
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[10px] text-emerald-100 font-medium">
                  24/7 Grounded Assistance • Multi-Vendor Tours
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowTicketForm((prev) => !prev)}
                title="Open Support Ticket"
                className="p-1.5 rounded-lg hover:bg-emerald-600/50 text-emerald-100 transition-colors"
              >
                <LifeBuoy className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize Chat"
                className="p-1.5 rounded-lg hover:bg-emerald-600/50 text-emerald-100 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 rounded-lg hover:bg-red-500/40 text-emerald-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Privacy Disclaimer Banner */}
          <div className="bg-amber-50 border-b border-amber-200/60 px-3 py-1.5 flex items-center gap-2 text-[10px] text-amber-900 shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="leading-tight">
              AI Assistant. Conversations may be logged for quality. Do not share bank PINs or passwords.
            </span>
          </div>

          {/* Ticket Handoff Drawer / Modal */}
          {showTicketForm && (
            <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 max-h-[380px] overflow-y-auto animate-in slide-in-from-top duration-150">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <LifeBuoy className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Open Support Ticket</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTicketForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-600 mb-3">
                For complaints, refunds, or payment issues, our support desk will contact you via email/phone.
              </p>

              <form onSubmit={handleTicketSubmit} className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">Email or Phone</label>
                  <input
                    type="text"
                    required
                    value={ticketContact}
                    onChange={(e) => setTicketContact(e.target.value)}
                    placeholder="name@email.com or 0300-1234567"
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full text-xs px-2 py-1.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="GENERAL">General Inquiry</option>
                    <option value="REFUND">Refund Request</option>
                    <option value="PAYMENT">Payment Issue</option>
                    <option value="COMPLAINT">Partner / Trip Complaint</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">Message</label>
                  <textarea
                    required
                    rows={2}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Explain the issue or booking details..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingTicket}
                    className="flex-1 text-xs py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-md disabled:opacity-50"
                  >
                    {isSubmittingTicket ? "Submitting Ticket..." : "Submit to Support Desk"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTicketForm(false)}
                    className="px-3 text-xs py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-slate-800 text-xs">
            {messages.map((m) => {
              const isUser = m.role === "user";
              const parsed = parseListingToken(m.content);

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm whitespace-pre-wrap text-[12px] ${
                      isUser
                        ? "bg-emerald-700 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                    }`}
                  >
                    {parsed.cleanText}

                    {/* Listing Card Preview Component */}
                    {parsed.listing && (
                      <div className="mt-3 bg-slate-50 border border-emerald-300/60 rounded-xl p-3 shadow-xs text-slate-900 not-prose">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {parsed.listing.type}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            PKR {Number(parsed.listing.price).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {parsed.listing.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{parsed.listing.destination}</span>
                        </div>
                        <Link
                          href={`/listings/${parsed.listing.slug}`}
                          className="mt-2.5 inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          <span>View Listing Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span className="text-[11px]">Consulting northern travel knowledge base...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips (when few messages) */}
          {messages.length <= 2 && !isLoading && (
            <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.query)}
                  className="whitespace-nowrap text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors shrink-0"
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                maxLength={500}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about Hunza, Skardu, booking, cancellation..."
                disabled={isLoading}
                className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
                className="p-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl transition-colors shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1.5 px-1">
              <span>{inputValue.length}/500</span>
              <button
                type="button"
                onClick={() => setShowTicketForm(true)}
                className="hover:text-emerald-700 font-semibold transition-colors"
              >
                Need human support? Open Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
