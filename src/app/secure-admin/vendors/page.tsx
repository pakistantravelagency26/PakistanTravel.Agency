"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Building2, 
  Phone, 
  Mail, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Power, 
  Search, 
  MapPin, 
  FileText,
  AlertCircle,
  ExternalLink,
  Lock,
  Trash2,
  AlertTriangle
} from "lucide-react";

interface VendorData {
  id: string;
  companyName: string;
  city: string;
  tourismLicense: string;
  phone1: string;
  phone2: string;
  phone3: string;
  email: string;
  loginId: string;
  passwordPlain?: string;
  status: "ENABLED" | "DISABLED";
  commissionRate: number;
  listingsCount: number;
  createdAt: string;
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ENABLED" | "DISABLED">("ALL");

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Delete Modal State
  const [vendorToDelete, setVendorToDelete] = useState<VendorData | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Visible Passwords map
  const [visiblePasswords, setVisiblePasswords] = useState<{ [id: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    companyName: "",
    city: "Skardu",
    tourismLicense: "",
    phone1: "",
    phone2: "",
    phone3: "",
    email: "",
    loginId: "",
    passwordPlain: "",
  });

  // Fetch Vendors
  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/vendors");
      const data = await res.json();
      if (data.success && Array.isArray(data.vendors)) {
        setVendors(data.vendors);
      }
    } catch (err) {
      console.error("Failed to load vendors:", err);
    } finally {
      setLoading(false);
    }
  }

  // Toggle Status (Enable / Disable)
  async function handleToggleStatus(id: string, currentStatus: "ENABLED" | "DISABLED") {
    try {
      const res = await fetch(`/api/admin/vendors/${id}/status`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setVendors((prev) =>
          prev.map((v) => (v.id === id ? { ...v, status: data.vendor.status } : v))
        );
        setActionSuccess(
          data.vendor.status === "DISABLED"
            ? `Partner account "${data.vendor.companyName}" disabled. All their tours are now hidden from the marketplace.`
            : `Partner account "${data.vendor.companyName}" enabled. All their tours are now live on the marketplace!`
        );
        setTimeout(() => setActionSuccess(""), 5000);
      } else {
        setActionError(data.error || "Failed to update vendor status");
      }
    } catch (err: any) {
      setActionError("Network error while updating status.");
    }
  }

  // Delete Vendor Account (only when disabled)
  async function handleDeleteVendor() {
    if (!vendorToDelete) return;
    setDeleting(true);
    setActionError("");

    try {
      const res = await fetch(`/api/admin/vendors/${vendorToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setVendors((prev) => prev.filter((v) => v.id !== vendorToDelete.id));
        setActionSuccess(`Partner account "${vendorToDelete.companyName}" and all associated listings were permanently deleted.`);
        setVendorToDelete(null);
        setTimeout(() => setActionSuccess(""), 6000);
      } else {
        setActionError(data.error || "Failed to delete partner account");
      }
    } catch (err: any) {
      setActionError("Network error while deleting partner account.");
    } finally {
      setDeleting(false);
    }
  }

  // Create Vendor Account
  async function handleCreateVendor(e: React.FormEvent) {
    e.preventDefault();
    setActionError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setVendors((prev) => [data.vendor, ...prev]);
        setIsModalOpen(false);
        setActionSuccess(`Partner account created successfully for "${data.vendor.companyName}"! They can now log in at /partner-hub/login.`);
        setForm({
          companyName: "",
          city: "Skardu",
          tourismLicense: "",
          phone1: "",
          phone2: "",
          phone3: "",
          email: "",
          loginId: "",
          passwordPlain: "",
        });
        setTimeout(() => setActionSuccess(""), 6000);
      } else {
        setActionError(data.error || "Failed to create partner account");
      }
    } catch (err: any) {
      setActionError("Error submitting form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function copyCredentials(vendor: VendorData) {
    const text = `PakistanTravel.Agency - Partner Hub Account Details\n\nPortal: https://www.pakistantravel.agency/partner-hub/login\nLogin ID / Username: ${vendor.loginId}\nEmail: ${vendor.email}\nCompany: ${vendor.companyName}`;
    navigator.clipboard.writeText(text);
    setCopiedId(vendor.id);
    setTimeout(() => setCopiedId(null), 2500);
  }

  // Filtered List
  const filtered = vendors.filter((v) => {
    const matchSearch =
      v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.loginId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone1.includes(searchQuery);

    if (statusFilter === "ALL") return matchSearch;
    return matchSearch && v.status === statusFilter;
  });

  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === "ENABLED").length;
  const disabledVendors = vendors.filter((v) => v.status === "DISABLED").length;
  const totalTours = vendors.reduce((acc, curr) => acc + (curr.listingsCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Super Admin Partner Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Vendor & Partner Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Create vendor accounts with custom login IDs & passwords, register tourism licenses, maintain 3 contact phone lines, and control marketplace visibility (Enable / Disable / Delete).
          </p>
        </div>

        <button
          onClick={() => {
            setActionError("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Partner Account</span>
        </button>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess("")} className="text-emerald-700 hover:text-emerald-900 font-bold">×</button>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError("")} className="text-red-700 hover:text-red-900 font-bold">×</button>
        </div>
      )}

      {/* Analytics Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Operators</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalVendors}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Registered partner agencies</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Active & Live</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{activeVendors}</div>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">Visible on marketplace</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">Disabled / Hidden</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{disabledVendors}</div>
          <p className="text-[11px] text-rose-500/80 mt-0.5">Eligible for permanent deletion</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Tours Managed</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalTours}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Across all registered partners</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by company, city, login ID, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {(["ALL", "ENABLED", "DISABLED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "All Partners" : st === "ENABLED" ? "Active Only" : "Disabled Only"}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Agency / Business</th>
                <th className="py-3.5 px-4">Tourism License</th>
                <th className="py-3.5 px-4">3 Contact Phone Lines</th>
                <th className="py-3.5 px-4">Login ID & Password</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Tours</th>
                <th className="py-3.5 px-4 text-right">Marketplace Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading partner accounts...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No partner accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filtered.map((vendor) => {
                  const isEnabled = vendor.status === "ENABLED";
                  const showPass = visiblePasswords[vendor.id] || false;

                  return (
                    <tr
                      key={vendor.id}
                      className={`hover:bg-slate-50/80 transition ${
                        !isEnabled ? "bg-rose-50/30" : ""
                      }`}
                    >
                      {/* Agency Name & City */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                            isEnabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                          }`}>
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                              {vendor.companyName}
                            </span>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              <span>{vendor.city}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500 font-mono">{vendor.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* License */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono font-semibold text-[11px]">
                          <FileText className="w-3 h-3 text-slate-500" />
                          <span>{vendor.tourismLicense || "Pending"}</span>
                        </div>
                      </td>

                      {/* 3 Contact Numbers */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[9px] font-bold">1</span>
                            <span>{vendor.phone1}</span>
                            <span className="text-[10px] text-emerald-600 font-bold">(WhatsApp / Primary)</span>
                          </div>
                          {vendor.phone2 && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[9px] font-bold">2</span>
                              <span>{vendor.phone2}</span>
                              <span className="text-[10px] text-slate-400">(Office)</span>
                            </div>
                          )}
                          {vendor.phone3 && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <span className="w-3.5 h-3.5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[9px] font-bold">3</span>
                              <span>{vendor.phone3}</span>
                              <span className="text-[10px] text-amber-600 font-bold">(Emergency / Guide)</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Login ID & Password */}
                      <td className="py-4 px-4">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">ID:</span>
                            <span className="font-mono font-bold text-slate-800 text-xs">{vendor.loginId}</span>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Pass:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-slate-700">
                                {showPass ? (vendor.passwordPlain || "Encrypted") : "••••••••"}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setVisiblePasswords((prev) => ({ ...prev, [vendor.id]: !prev[vendor.id] }))
                                }
                                className="text-slate-400 hover:text-slate-600 p-0.5"
                                title="Show/Hide Password"
                              >
                                {showPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => copyCredentials(vendor)}
                            className="w-full mt-1.5 pt-1 border-t border-slate-200 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1"
                          >
                            {copiedId === vendor.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Copied Credentials!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy for Vendor</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 text-center">
                        {isEnabled ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Active</span>
                            </span>
                            <span className="text-[9px] text-emerald-700 mt-0.5">Tours Live</span>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                              <XCircle className="w-3 h-3" />
                              <span>Disabled</span>
                            </span>
                            <span className="text-[9px] text-rose-600 mt-0.5 font-bold">Tours Hidden</span>
                          </div>
                        )}
                      </td>

                      {/* Tours Count */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-extrabold text-sm text-slate-900 block">
                          {vendor.listingsCount || 0}
                        </span>
                        <span className="text-[10px] text-slate-400">Tours</span>
                      </td>

                      {/* Actions: Enable / Disable + DELETE IF DISABLED */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(vendor.id, vendor.status)}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                              isEnabled
                                ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{isEnabled ? "Disable Account" : "Enable & Show Tours"}</span>
                          </button>

                          {/* DELETE OPTION - ONLY APPEARS WHEN DISABLED */}
                          {!isEnabled && (
                            <button
                              onClick={() => setVendorToDelete(vendor)}
                              title="Delete Disabled Partner Account"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-sm shadow-red-600/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {vendorToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Permanently Delete Partner?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-800">{vendorToDelete.companyName}</span>?
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-[11px] space-y-1">
              <p className="font-bold">• Login credentials will be permanently erased.</p>
              <p className="font-bold">• All {vendorToDelete.listingsCount} tour listings will be deleted from the database.</p>
              <p className="text-red-700 font-semibold">• This action cannot be reversed.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setVendorToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteVendor}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? "Deleting..." : "Yes, Delete Permanently"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW VENDOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block">Partner Onboarding</span>
                <h2 className="text-xl font-extrabold text-slate-900">Create New Partner Account</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {actionError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleCreateVendor} className="space-y-4 text-xs">
              {/* Company Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Company / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karakoram Expeditions Ltd"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    City / Operating Region *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Skardu, Gilgit, Hunza, Islamabad"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Tourism License & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Tourism License / Reg No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. REG-GB-2024-889"
                    value={form.tourismLicense}
                    onChange={(e) => setForm({ ...form, tourismLicense: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Official Agency Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vendor@agency.pk"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 3 Contact Phone Numbers */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 block">
                  3 Contact Phone Numbers
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Phone 1 (WhatsApp / Primary) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="03001234567"
                      value={form.phone1}
                      onChange={(e) => setForm({ ...form, phone1: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Phone 2 (Office / Landline)
                    </label>
                    <input
                      type="text"
                      placeholder="0511234567"
                      value={form.phone2}
                      onChange={(e) => setForm({ ...form, phone2: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Phone 3 (Emergency / Guide)
                    </label>
                    <input
                      type="text"
                      placeholder="03459988776"
                      value={form.phone3}
                      onChange={(e) => setForm({ ...form, phone3: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Vendor Portal Login ID & Password (Set by Admin) */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 block">
                  Vendor Portal Login Credentials (Set by Super Admin)
                </span>
                <p className="text-[11px] text-emerald-700">
                  The partner agency will use this Login ID (or Email) and Password to access their Extranet at <span className="font-mono font-bold">/partner-hub/login</span> to manage their tours.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Custom Login ID / Username *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. karakoram_tours"
                      value={form.loginId}
                      onChange={(e) => setForm({ ...form, loginId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Password *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karakoram@2026"
                      value={form.passwordPlain}
                      onChange={(e) => setForm({ ...form, passwordPlain: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {submitting ? "Creating Partner Account..." : "Create Partner Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
