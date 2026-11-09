"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  ShieldCheck, 
  Search, 
  Clock, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Check, 
  Eye, 
  RotateCcw,
  Calendar,
  Layers,
  FileText,
  UserCheck,
  Percent
} from "lucide-react";
import type { ListingData } from "@/services/listing.service";
import { COMMISSION_PERCENT } from "@/config/site";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED">("PENDING_APPROVAL");
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>("ALL");

  // Deep Inspection Modal State
  const [selectedTour, setSelectedTour] = useState<ListingData | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Approval & Commission Modal State
  const [approvingTour, setApprovingTour] = useState<ListingData | null>(null);
  const [commissionRate, setCommissionRate] = useState<number>(COMMISSION_PERCENT);

  useEffect(() => {
    fetchListings();
    fetchVendors();
  }, []);

  async function fetchVendors() {
    try {
      const res = await fetch("/api/admin/vendors");
      const data = await res.json();
      if (data.success && Array.isArray(data.vendors)) {
        setVendors(data.vendors);
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  }

  async function fetchListings() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/listings");
      const data = await res.json();
      if (data.success && Array.isArray(data.listings)) {
        setListings(data.listings);
      }
    } catch (err) {
      console.error("Error fetching listings for moderation:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenApproval(tour: ListingData) {
    setApprovingTour(tour);
    setCommissionRate(tour.commissionRate !== undefined ? tour.commissionRate : COMMISSION_PERCENT);
  }

  async function handleConfirmApproval() {
    if (!approvingTour) return;
    const vendorRate = approvingTour.vendorPrice || approvingTour.basePrice;
    const commRate = Number(commissionRate) || 0;
    const commAmt = Math.round((vendorRate * commRate) / 100);
    const totalPublicPrice = vendorRate + commAmt;

    await handleModerate(
      approvingTour.id,
      "APPROVE",
      adminNotes,
      commRate,
      vendorRate,
      totalPublicPrice
    );
    setApprovingTour(null);
  }

  async function handleModerate(
    id: string,
    action: "APPROVE" | "REJECT",
    notes?: string,
    customCommission?: number,
    vendorPrice?: number,
    totalPrice?: number
  ) {
    setActionLoading(true);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/listings/${id}/moderate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          notes: notes || adminNotes,
          commissionRate: customCommission !== undefined ? customCommission : commissionRate,
          vendorPrice,
          totalPrice,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, ...data.listing } : l))
        );
        setActionMessage({
          type: "success",
          text:
            action === "APPROVE"
              ? `Tour "${data.listing.title}" is now APPROVED & LIVE on PakistanTravel.Agency at total price PKR ${(data.listing.basePrice || totalPrice || 0).toLocaleString()} (Vendor gets PKR ${(vendorPrice || data.listing.vendorPrice || 0).toLocaleString()} + Agency markup ${(data.listing.commissionRate || commissionRate)}%)!`
              : `Tour "${data.listing.title}" was marked as revision required / rejected.`,
        });
        if (selectedTour?.id === id) {
          setSelectedTour((prev) => (prev ? { ...prev, ...data.listing } : data.listing));
        }
        setTimeout(() => {
          setSelectedTour(null);
          setAdminNotes("");
        }, 1500);
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to process moderation." });
      }
    } catch (err: any) {
      setActionMessage({ type: "error", text: "Network error during moderation." });
    } finally {
      setActionLoading(false);
    }
  }

  // Filter & Search
  const filteredListings = listings.filter((l) => {
    if (selectedVendorId !== "ALL" && l.vendor?.id !== selectedVendorId) {
      return false;
    }
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      l.title.toLowerCase().includes(query) ||
      l.city.toLowerCase().includes(query) ||
      l.destinationName.toLowerCase().includes(query) ||
      l.vendor?.businessName?.toLowerCase().includes(query);

    const effectiveStatus = l.moderationStatus || "APPROVED";
    if (statusFilter === "ALL") return matchSearch;
    return matchSearch && effectiveStatus === statusFilter;
  });

  const pendingCount = listings.filter((l) => l.moderationStatus === "PENDING_APPROVAL").length;
  const approvedCount = listings.filter((l) => !l.moderationStatus || l.moderationStatus === "APPROVED").length;
  const rejectedCount = listings.filter((l) => l.moderationStatus === "REJECTED").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Listing Quality & Compliance Gate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Listing Moderation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Review new tour submissions and modified packages from all vendors. Inspect itineraries, pricing, photos, and policies in detail before approving them live for public travelers.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold">{pendingCount} Tours Awaiting Your Review</span>
          </div>
        )}
      </div>

      {/* Global Action Banner */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter("PENDING_APPROVAL")}
          className={`text-left p-5 rounded-2xl border transition shadow-sm ${
            statusFilter === "PENDING_APPROVAL"
              ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-400"
              : "bg-white border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Pending Moderation</span>
          <div className="text-2xl font-extrabold text-amber-800 mt-1">{pendingCount}</div>
          <p className="text-[11px] text-amber-600/90 mt-0.5">Awaiting Super Admin review</p>
        </button>

        <button
          onClick={() => setStatusFilter("APPROVED")}
          className={`text-left p-5 rounded-2xl border transition shadow-sm ${
            statusFilter === "APPROVED"
              ? "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500"
              : "bg-white border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Approved & Live</span>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1">{approvedCount}</div>
          <p className="text-[11px] text-emerald-600/90 mt-0.5">Live on public website</p>
        </button>

        <button
          onClick={() => setStatusFilter("REJECTED")}
          className={`text-left p-5 rounded-2xl border transition shadow-sm ${
            statusFilter === "REJECTED"
              ? "bg-red-50/80 border-red-300 ring-2 ring-red-400"
              : "bg-white border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">Revision Requested</span>
          <div className="text-2xl font-extrabold text-red-700 mt-1">{rejectedCount}</div>
          <p className="text-[11px] text-red-600/90 mt-0.5">Returned to vendor</p>
        </button>

        <button
          onClick={() => setStatusFilter("ALL")}
          className={`text-left p-5 rounded-2xl border transition shadow-sm ${
            statusFilter === "ALL"
              ? "bg-slate-100 border-slate-300 ring-2 ring-slate-400"
              : "bg-white border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">All Listings</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{listings.length}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Total across all partners</p>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by tour title, vendor, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={selectedVendorId}
            onChange={(e) => setSelectedVendorId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Partner Agencies ({vendors.length})</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.companyName} ({v.listingsCount} Tours)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: "PENDING_APPROVAL", label: `Pending Review (${pendingCount})` },
              { id: "APPROVED", label: `Approved & Live (${approvedCount})` },
              { id: "REJECTED", label: `Rejected (${rejectedCount})` },
              { id: "ALL", label: `All Tours (${listings.length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setStatusFilter(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                statusFilter === t.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
          Loading tour moderation queue...
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm">No Listings Found</h3>
          <p className="text-xs text-slate-500">
            {statusFilter === "PENDING_APPROVAL"
              ? "All caught up! There are no pending tour packages waiting for approval right now."
              : "No tour packages found matching the selected filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((item) => {
            const isPending = item.moderationStatus === "PENDING_APPROVAL";
            const isRejected = item.moderationStatus === "REJECTED";
            const isApproved = !item.moderationStatus || item.moderationStatus === "APPROVED";

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border transition overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isPending
                    ? "border-amber-300 ring-1 ring-amber-200"
                    : isRejected
                    ? "border-red-200 bg-red-50/20"
                    : "border-slate-200"
                }`}
              >
                <div>
                  {/* Tour Image + Status Badges */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.photos[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      {isPending ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] shadow-md flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.isEdited ? "Updated Tour — Re-approval Required" : "New Tour — Awaiting Approval"}</span>
                        </span>
                      ) : isRejected ? (
                        <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-extrabold text-[10px] shadow-md flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          <span>Revision Requested</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Live on Marketplace</span>
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold">
                        {item.type}
                      </span>
                    </div>

                    {item.duration && (
                      <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-bold shadow-sm">
                        {item.duration}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <MapPin className="w-3 h-3" />
                        <span>{item.destinationName} ({item.province})</span>
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-900 mt-1 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1.5">
                        <UserCheck className="w-3 h-3 text-slate-400" />
                        <span>Submitted by: </span>
                        <strong className="text-slate-800 font-semibold">{item.vendor?.businessName || "Partner Agency"}</strong>
                      </div>
                    </div>

                    {/* Price & Cancellation Pills */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Vendor Demanded Price</span>
                        <span className="font-extrabold text-slate-700 text-xs sm:text-sm">
                          PKR {(Number(item.vendorPrice || item.basePrice) || 0).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Price on Web</span>
                        <span className="font-black text-emerald-700 text-xs sm:text-sm">
                          PKR {(Number(item.basePrice) || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Percent className="w-3 h-3 text-emerald-600" /> Agency Markup:
                        </span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          +{item.commissionRate ?? 12}% (+PKR {Math.round(((Number(item.vendorPrice || item.basePrice) || 0) * (item.commissionRate ?? 12)) / 100).toLocaleString()})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 space-y-2">
                  {/* Primary Review Button */}
                  <button
                    onClick={() => {
                      setSelectedTour(item);
                      setActivePhotoIdx(0);
                      setAdminNotes(item.moderationNotes || "");
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review & Inspect (Check All Details)</span>
                  </button>

                  {/* Quick Action Buttons for Pending */}
                  {isPending && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenApproval(item)}
                        className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Live</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTour(item);
                          setActivePhotoIdx(0);
                          setAdminNotes("");
                        }}
                        className="py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center justify-center gap-1 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject / Notes</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DEEP INSPECTION MODAL (AK AK CHEEZ YAHAN SE CHECK HOGI) */}
      {selectedTour && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
                    Tour Package Compliance Inspection
                  </span>
                  {selectedTour.isEdited && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                      Vendor Updated Existing Tour
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {selectedTour.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>Operated by:</span>
                  <strong className="text-slate-800">{selectedTour.vendor?.businessName}</strong>
                  <span>•</span>
                  <span>Vendor ID: <code className="text-slate-600 bg-slate-100 px-1 py-0.5 rounded">{selectedTour.vendor?.id}</code></span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTour(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Photo Gallery Viewer */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                1. Uploaded Photos Gallery ({(selectedTour.photos || []).length} Photos)
              </span>

              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={(selectedTour.photos || [])[activePhotoIdx] || (selectedTour.photos || [])[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"}
                  alt="Tour Photo Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  Photo {activePhotoIdx + 1} of {(selectedTour.photos || []).length || 1}
                </span>
              </div>

              {(selectedTour.photos || []).length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {(selectedTour.photos || []).map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                        activePhotoIdx === idx ? "border-emerald-600 scale-105" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Detailed Parameters Grid (Ek ek cheez) */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                2. Operational & Pricing Specifications
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Vendor Price</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    PKR {(Number(selectedTour.vendorPrice || selectedTour.basePrice) || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Vendor Demanded</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase block">Public Price on Web</span>
                  <span className="font-black text-emerald-800 text-sm">
                    PKR {(Number(selectedTour.basePrice) || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600 block">+{selectedTour.commissionRate ?? 12}% Commission</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tour Duration</span>
                  <span className="font-extrabold text-slate-900 text-sm">{selectedTour.duration || "Multi-Day"}</span>
                  <span className="text-[10px] text-slate-500 block">Itinerary Length</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Destination & Region</span>
                  <span className="font-extrabold text-slate-900 text-sm">{selectedTour.city}</span>
                  <span className="text-[10px] text-slate-500 block">{selectedTour.province}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cancellation Policy</span>
                  <span className="font-extrabold text-emerald-700 text-sm">{selectedTour.freeCancellationDays || 3} Days Free</span>
                  <span className="text-[10px] text-slate-500 block">100% Refundable</span>
                </div>
              </div>
            </div>

            {/* Included Amenities & Services */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                3. Included Amenities & Inclusions
              </span>
              <div className="flex flex-wrap gap-2">
                {(selectedTour.amenities || []).map((amenity, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{amenity}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Full Description & Itinerary Details */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                4. Full Package Description & Overview
              </span>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedTour.description}
              </div>
            </div>

            {/* Edit Alert Warning if modified */}
            {selectedTour.isEdited && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <p className="font-bold">Notice: Vendor Modified This Package</p>
                  <p className="text-[11px] text-purple-700 mt-0.5">
                    This tour was previously approved, but the vendor has updated prices or details. Please verify all information before publishing it back live to travelers.
                  </p>
                </div>
              </div>
            )}

            {/* Admin Decision & Notes Panel */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Admin Feedback / Revision Notes (Optional for Rejections)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please upload higher resolution photos for Deosai Plains, or correct the pickup location."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href={`/listing/${selectedTour.slug}`}
                  target="_blank"
                  className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Preview as Traveler</span>
                </Link>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleModerate(selectedTour.id, "REJECT", adminNotes)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition disabled:opacity-50"
                  >
                    Reject / Request Changes
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleOpenApproval(selectedTour)}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Set Commission & Approve Live</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPROVAL & LIVE COMMISSION CALCULATOR MODAL */}
      {approvingTour && (
        <div className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                    Listing Approval & Take-Rate
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 line-clamp-1">
                    {approvingTour.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setApprovingTour(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Tour & Vendor Details */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Operator / Vendor</span>
                <span className="font-bold text-slate-800">{approvingTour.vendor?.businessName}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold block">Vendor Demanded Amount</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  PKR {(Number(approvingTour.vendorPrice || approvingTour.basePrice) || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Commission Percentage Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Our Agency Commission Markup (%)
                </label>
                <span className="text-xs text-slate-500 font-medium">Enter % to add to Vendor Amount</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value) || 0)}
                    className="w-full pl-4 pr-10 py-3 rounded-2xl border-2 border-emerald-500/40 focus:border-emerald-600 text-lg font-black text-slate-900 focus:outline-none"
                    placeholder="10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-sm">
                    %
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {[10, 12, 15, 20].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setCommissionRate(rate)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition ${
                        commissionRate === rate
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Real-Time Live Amount Breakdown Card (Amounts show hongi) */}
            {(() => {
              const vendorRate = Number(approvingTour.vendorPrice || approvingTour.basePrice) || 0;
              const rate = Number(commissionRate) || 0;
              const commissionAmt = Math.round((vendorRate * rate) / 100);
              const totalWebPrice = vendorRate + commissionAmt;

              return (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 border border-emerald-200/80 space-y-3">
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block">
                    Markup & Live Website Selling Price
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Vendor Net Amount */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-sm">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">
                        Vendor Gets (Net Demanded)
                      </span>
                      <span className="text-base sm:text-lg font-black block mt-0.5 text-slate-800">
                        PKR {vendorRate.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Vendor ka apna amount</span>
                    </div>

                    {/* Agency Commission */}
                    <div className="p-3 rounded-xl bg-amber-500 text-white shadow-sm">
                      <span className="text-[10px] text-amber-100 font-bold block uppercase">
                        Agency Markup (+{rate}%)
                      </span>
                      <span className="text-base sm:text-lg font-black block mt-0.5">
                        + PKR {commissionAmt.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-amber-100/90 block">Humara Profit</span>
                    </div>
                  </div>

                  {/* Highlighted Total Public Price Box */}
                  <div className="p-3.5 rounded-xl bg-emerald-600 text-white flex items-center justify-between shadow-md">
                    <div>
                      <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider block">
                        Total Amount Jo Web Par Jaye Ga (Customer Price)
                      </span>
                      <span className="text-xs text-emerald-100">
                        Vendor (PKR {vendorRate.toLocaleString()}) + Commission (PKR {commissionAmt.toLocaleString()})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-black block tracking-tight">
                        PKR {totalWebPrice.toLocaleString()}
                      </span>
                      <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                        Live on Web
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <p className="text-[11px] text-slate-500 leading-normal">
              Approve hotay hi yeh tour status <strong>PUBLISHED</strong> ho kar foran website par <strong>Total Amount</strong> k sath active ho jaye ga aur vendor ko uski demanded raqam guaranteed rahay gi.
            </p>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setApprovingTour(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmApproval}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Publish Total Price Live</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
