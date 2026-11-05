"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ArrowRight, 
  DollarSign, 
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Phone,
  FileText
} from "lucide-react";

interface OverviewData {
  stats: {
    totalVendors: number;
    activeVendors: number;
    disabledVendors: number;
    totalTours: number;
    approvedTours: number;
    pendingTours: number;
    rejectedTours: number;
    avgPrice: number;
  };
  destinations: { name: string; count: number; percent: number }[];
  vendors: {
    id: string;
    companyName: string;
    city: string;
    tourismLicense: string;
    phone1: string;
    status: "ENABLED" | "DISABLED";
    listingsCount: number;
  }[];
  recentListings: {
    id: string;
    slug: string;
    title: string;
    destinationName: string;
    province: string;
    basePrice: number;
    duration?: string;
    photos: string[];
    moderationStatus?: "APPROVED" | "PENDING_APPROVAL" | "REJECTED";
    vendor: {
      id: string;
      businessName: string;
    };
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  async function fetchOverview() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/overview");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error("Error fetching admin overview:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
        Loading real-time platform overview & synchronized metrics...
      </div>
    );
  }

  const { stats, destinations, vendors, recentListings } = data;

  return (
    <div className="space-y-8 text-slate-800">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Executive Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Marketplace Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            100% synchronized live data across registered partner operators, curated tour packages, and quality compliance moderation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/secure-admin/vendors"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span>Manage Partners ({stats.totalVendors})</span>
          </Link>

          <Link
            href="/secure-admin/listings"
            className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              stats.pendingTours > 0
                ? "bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-400"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Clock className={`w-4 h-4 ${stats.pendingTours > 0 ? "text-amber-600" : "text-slate-400"}`} />
            <span>
              {stats.pendingTours > 0 ? `${stats.pendingTours} Tours Awaiting Review` : "Listing Queue (0)"}
            </span>
          </Link>
        </div>
      </div>

      {/* Synchronized Real-Time KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Vendors */}
        <Link
          href="/secure-admin/vendors"
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Registered Partners
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-700 flex items-center justify-center transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats.totalVendors}</p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{stats.activeVendors} Active & Live</span>
            {stats.disabledVendors > 0 && (
              <span className="text-rose-600 font-bold">• {stats.disabledVendors} Disabled</span>
            )}
          </div>
        </Link>

        {/* Total Tours Managed */}
        <Link
          href="/secure-admin/listings"
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Tours Managed
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-sky-50 text-slate-600 group-hover:text-sky-700 flex items-center justify-center transition">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats.totalTours}</p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-700">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>{stats.approvedTours} Approved Live on Site</span>
          </div>
        </Link>

        {/* Pending Moderation */}
        <Link
          href="/secure-admin/listings"
          className={`p-5 rounded-3xl border shadow-sm hover:shadow-md transition space-y-2 group ${
            stats.pendingTours > 0 ? "bg-amber-50/60 border-amber-300" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Listing Moderation Queue
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-900">{stats.pendingTours}</p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {stats.pendingTours > 0 ? "Pending admin approval" : "All submissions approved"}
            </span>
          </div>
        </Link>

        {/* Average Tour Price */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Average Tour Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            PKR {stats.avgPrice.toLocaleString()}
          </p>
          <div className="text-[11px] text-slate-500 font-semibold">
            Across {stats.totalTours} live package options
          </div>
        </div>
      </div>

      {/* Destinations Coverage & Navigation Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Destination Coverage */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Active Destinations Coverage
              </h3>
              <p className="text-xs text-slate-500">
                Calculated dynamically from active tour listings
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {destinations.length} Northern Valleys Covered
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {destinations.map((dest) => (
              <div
                key={dest.name}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{dest.name}</span>
                    <span className="text-[10px] text-slate-500">{dest.count} Tour Packages</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-700">{dest.percent}%</span>
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${dest.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Operations Shortcuts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Quick Platform Access</h3>
            <p className="text-xs text-slate-500 mt-0.5">Jump directly to core management modules</p>

            <div className="space-y-2.5 mt-4">
              <Link
                href="/secure-admin/vendors"
                className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 hover:border-emerald-200 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-900">
                    Partner Accounts Hub
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-emerald-700">
                  {stats.totalVendors} Partners →
                </span>
              </Link>

              <Link
                href="/secure-admin/listings"
                className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/70 border border-slate-100 hover:border-sky-200 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-xs text-slate-800 group-hover:text-sky-900">
                    Listing Moderation
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-sky-700">
                  {stats.totalTours} Listings →
                </span>
              </Link>

              <Link
                href="/partner-hub/login"
                target="_blank"
                className="p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/70 border border-slate-100 hover:border-orange-200 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-orange-600" />
                  <span className="font-bold text-xs text-slate-800 group-hover:text-orange-900">
                    Vendor Extranet Login
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-orange-700">
                  Partner Portal ↗
                </span>
              </Link>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All system data is 1:1 synchronized in real-time.</span>
          </div>
        </div>
      </div>

      {/* Synchronized Partner Agencies Directory */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Registered Partner Agencies Directory
            </h3>
            <p className="text-xs text-slate-500">
              Live operators with verified tourism licenses and synchronized tour counts
            </p>
          </div>

          <Link
            href="/secure-admin/vendors"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Open Partner Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Partner Agency</th>
                <th className="py-3 px-3">City / Valley</th>
                <th className="py-3 px-3">Tourism License</th>
                <th className="py-3 px-3">Contact (WhatsApp)</th>
                <th className="py-3 px-3 text-center">Live Tours</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 block text-xs">{v.companyName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{v.id}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{v.city}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                    {v.tourismLicense || "Pending"}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 text-slate-800 font-semibold">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{v.phone1}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-900 font-extrabold text-xs">
                      {v.listingsCount} Tours
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {v.status === "ENABLED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                        <XCircle className="w-3 h-3" />
                        <span>Disabled</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href="/secure-admin/vendors"
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Synchronized Tour Listings Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Live & Moderated Tour Packages
            </h3>
            <p className="text-xs text-slate-500">
              Synchronized tour packages with exact vendor assignments
            </p>
          </div>

          <Link
            href="/secure-admin/listings"
            className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
          >
            <span>View All in Moderation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentListings.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <MapPin className="w-3 h-3" />
                    <span>{item.destinationName}</span>
                  </span>
                  {item.moderationStatus === "PENDING_APPROVAL" ? (
                    <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                      Pending Review
                    </span>
                  ) : item.moderationStatus === "REJECTED" ? (
                    <span className="text-red-800 bg-red-100 px-2 py-0.5 rounded-full font-bold">
                      Rejected
                    </span>
                  ) : (
                    <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                      Approved Live
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-xs text-slate-900 mt-1.5 line-clamp-2">
                  {item.title}
                </h4>

                <p className="text-[11px] text-slate-500 mt-1">
                  By: <strong className="text-slate-800">{item.vendor?.businessName}</strong>
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Package Rate</span>
                  <span className="font-extrabold text-slate-900">
                    PKR {item.basePrice.toLocaleString()}
                  </span>
                </div>

                <Link
                  href="/secure-admin/listings"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-[10px] hover:bg-slate-800 transition"
                >
                  Inspect
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
