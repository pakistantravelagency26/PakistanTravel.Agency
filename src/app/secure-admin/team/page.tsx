"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Trash2, 
  Lock, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  BookOpenCheck,
  CreditCard,
  Building2,
  Headphones,
  Key
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  staffRole: string;
  createdAt: string;
  isProtected?: boolean;
}

const ROLE_CONFIG: Record<string, { label: string; description: string; color: string; icon: any }> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    description: "Unrestricted access across all platform operations, payouts, vendors, and staff accounts.",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: ShieldCheck,
  },
  BOOKINGS_MANAGER: {
    label: "Bookings Manager",
    description: "Responsible for managing traveler reservations, issuing vouchers, and processing cancellations.",
    color: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    icon: BookOpenCheck,
  },
  BILLING_FINANCE: {
    label: "Billing & Finance",
    description: "Responsible for auditing vendor net balances, commissions, and bank disbursements.",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: CreditCard,
  },
  LISTING_MODERATOR: {
    label: "Listing Moderator",
    description: "Responsible for reviewing new tours, hotel rooms, vendor licenses, and itinerary quality.",
    color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    icon: Building2,
  },
  CUSTOMER_SUPPORT: {
    label: "Customer Support",
    description: "Responsible for traveler inquiries, WhatsApp desk messages, and booking assistance.",
    color: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    icon: Headphones,
  },
};

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    staffRole: "BOOKINGS_MANAGER",
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (data.success && Array.isArray(data.team)) {
        setTeam(data.team);
      }
    } catch (err: any) {
      console.error("Team load error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create staff member.");
      }

      setSuccessMsg(`Staff account for ${formData.name} created successfully!`);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        staffRole: "BOOKINGS_MANAGER",
      });
      setIsModalOpen(false);
      fetchTeam();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteMember(member: TeamMember) {
    if (member.isProtected) {
      alert("The primary Super Admin account cannot be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to delete staff account "${member.name}" (${member.email})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete staff member.");
      }

      setTeam((prev) => prev.filter((m) => m.id !== member.id));
    } catch (err: any) {
      alert(err.message || "Failed to delete account.");
    }
  }

  const superAdminCount = team.filter((m) => m.staffRole === "SUPER_ADMIN" || m.isProtected).length;
  const bookingsCount = team.filter((m) => m.staffRole === "BOOKINGS_MANAGER").length;
  const billingCount = team.filter((m) => m.staffRole === "BILLING_FINANCE").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Accounts & Role-Based Access</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create logins for your team members and assign specific departmental permissions (Bookings, Billing, Listing Moderation).
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold transition shadow-md shadow-brand-emerald/20 flex items-center gap-2 self-start"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Staff Account</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Team Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Staff Accounts</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{team.length} Members</p>
          <p className="text-[11px] text-slate-400">Active team members with dashboard access</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Bookings Desk</span>
            <BookOpenCheck className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{bookingsCount} Managers</p>
          <p className="text-[11px] text-slate-400">Dedicated to reservations and vouchers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Finance & Billing</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{billingCount} Accountants</p>
          <p className="text-[11px] text-slate-400">Dedicated to partner payouts & commissions</p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Configured Staff & Roles</h2>
          <span className="text-xs text-slate-400 font-medium">Logged-in staff only see sections permitted to their role</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Assigned Department / Role</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Loading team accounts...
                  </td>
                </tr>
              ) : team.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No staff accounts created yet.
                  </td>
                </tr>
              ) : (
                team.map((member) => {
                  const roleConfig = ROLE_CONFIG[member.staffRole] || ROLE_CONFIG.BOOKINGS_MANAGER;
                  const Icon = roleConfig.icon;

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{member.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${roleConfig.color}`}>
                            <Icon className="w-3 h-3" />
                            {roleConfig.label}
                          </span>
                          <p className="text-[10px] text-slate-400">{roleConfig.description}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {member.phone}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {member.createdAt.split("T")[0]}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {member.isProtected ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" /> Primary Owner
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteMember(member)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete staff account"
                            aria-label={`Delete staff account ${member.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Staff Account Modal */}
      {isModalOpen && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-staff-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 text-slate-800">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> Access Delegation
                </span>
                <h2 id="modal-staff-title" className="text-xl font-bold text-slate-900 mt-0.5">Create Staff Account</h2>
                <p className="text-xs text-slate-500">Give your team member login access to manage their specific department.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
              <div>
                <label htmlFor="staff-name" className="block font-bold text-slate-700 uppercase mb-1">
                  Staff Member Full Name
                </label>
                <input
                  id="staff-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Asad Malik"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="staff-email" className="block font-bold text-slate-700 uppercase mb-1">
                    Login Email
                  </label>
                  <input
                    id="staff-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff@pakistantravel.agency"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="staff-password" className="block font-bold text-slate-700 uppercase mb-1">
                    Login Password
                  </label>
                  <input
                    id="staff-password"
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter secure password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="staff-phone" className="block font-bold text-slate-700 uppercase mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  id="staff-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="03221234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-sm"
                />
              </div>

              <div>
                <label htmlFor="staff-role" className="block font-bold text-slate-700 uppercase mb-1">
                  Department / Role Permission
                </label>
                <select
                  id="staff-role"
                  value={formData.staffRole}
                  onChange={(e) => setFormData({ ...formData, staffRole: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald font-semibold text-slate-800 text-sm"
                >
                  <option value="BOOKINGS_MANAGER">Bookings Manager (Only Bookings, Vouchers & Guest Queries)</option>
                  <option value="BILLING_FINANCE">Billing & Finance (Only Payouts, Commissions & Bank Ledgers)</option>
                  <option value="LISTING_MODERATOR">Listing Moderator (Only Tour & Hotel Approvals, Vendors)</option>
                  <option value="CUSTOMER_SUPPORT">Customer Support Desk (General Inquiries & WhatsApp)</option>
                  <option value="SUPER_ADMIN">Super Admin (Full Platform Control)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  The staff member will log in at the admin portal and access the tools permitted by their department.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-brand-emerald/20 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{submitting ? "Creating Account..." : "Create Staff Account"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
