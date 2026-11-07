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
  MapPin,
  Tag,
  Key,
  Edit,
  X,
  Loader2,
  CheckSquare,
  Square,
  Globe
} from "lucide-react";

interface PermissionOption {
  key: string;
  label: string;
  department: string;
  description: string;
  badgeColor: string;
  icon: any;
}

const PERMISSION_OPTIONS: PermissionOption[] = [
  {
    key: "BOOKINGS",
    label: "Bookings & Refunds",
    department: "Reservations Desk",
    description: "Manage customer tour bookings, cancel departures, and process traveler refunds.",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    icon: BookOpenCheck,
  },
  {
    key: "FINANCE",
    label: "Billing & Raast Payouts",
    department: "Accounts & Finance",
    description: "Audit vendor net commissions, execute Raast/IBFT disbursements, and view financial ledger.",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: CreditCard,
  },
  {
    key: "LISTINGS",
    label: "Listing Moderation",
    department: "Quality & Catalog",
    description: "Approve or reject vendor submitted tours & hotel packages, set per-tour commission %.",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Building2,
  },
  {
    key: "VENDORS",
    label: "Partner Agencies",
    department: "Vendor Operations",
    description: "Create partner vendor accounts, edit bank details, enable or disable partner login access.",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Users,
  },
  {
    key: "DESTINATIONS",
    label: "Destinations & Valleys",
    department: "Tourism Content",
    description: "Add northern valleys, edit regional guides, and toggle featured tourist destinations.",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    icon: MapPin,
  },
  {
    key: "COUPONS",
    label: "Coupons & Promos",
    department: "Marketing & Growth",
    description: "Issue discount promo voucher codes, set minimum spends and validity dates.",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    icon: Tag,
  },
  {
    key: "WEBSITE",
    label: "Website Content & CMS",
    department: "CMS Editor",
    description: "Edit website announcements, hero banner text, contact info, and legal policy pages.",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Globe,
  },
  {
    key: "TEAM",
    label: "Team & Staff Access",
    department: "Administration",
    description: "Create staff sub-accounts and configure granular department permissions.",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: ShieldCheck,
  },
];

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  staffRole: string;
  permissions: string;
  createdAt: string;
  isProtected?: boolean;
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New staff form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(["BOOKINGS"]);

  // Edit staff permissions modal state
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [updatingPermissions, setUpdatingPermissions] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (data.success) {
        setTeam(data.team);
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to load team." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Network error loading team members." });
    } finally {
      setLoading(false);
    }
  }

  function togglePermission(key: string, isEdit = false) {
    if (isEdit) {
      if (key === "ALL") {
        if (editPermissions.includes("ALL")) {
          setEditPermissions(["BOOKINGS"]);
        } else {
          setEditPermissions(["ALL", ...PERMISSION_OPTIONS.map((p) => p.key)]);
        }
        return;
      }

      setEditPermissions((prev) => {
        const withoutAll = prev.filter((p) => p !== "ALL");
        const exists = withoutAll.includes(key);
        const updated = exists ? withoutAll.filter((p) => p !== key) : [...withoutAll, key];
        if (updated.length === PERMISSION_OPTIONS.length) {
          return ["ALL", ...PERMISSION_OPTIONS.map((p) => p.key)];
        }
        return updated.length === 0 ? [key] : updated;
      });
    } else {
      if (key === "ALL") {
        if (selectedPermissions.includes("ALL")) {
          setSelectedPermissions(["BOOKINGS"]);
        } else {
          setSelectedPermissions(["ALL", ...PERMISSION_OPTIONS.map((p) => p.key)]);
        }
        return;
      }

      setSelectedPermissions((prev) => {
        const withoutAll = prev.filter((p) => p !== "ALL");
        const exists = withoutAll.includes(key);
        const updated = exists ? withoutAll.filter((p) => p !== key) : [...withoutAll, key];
        if (updated.length === PERMISSION_OPTIONS.length) {
          return ["ALL", ...PERMISSION_OPTIONS.map((p) => p.key)];
        }
        return updated.length === 0 ? [key] : updated;
      });
    }
  }

  async function handleCreateStaff(e: React.FormEvent) {
    e.preventDefault();
    setStatusMessage(null);

    if (selectedPermissions.length === 0) {
      setStatusMessage({ type: "error", text: "Please select at least one permission check for this account." });
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
          phone: phone.trim() || undefined,
          permissions: selectedPermissions,
          staffRole: selectedPermissions.includes("ALL") ? "SUPER_ADMIN" : "CUSTOM_STAFF",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: `Staff account "${data.member.name}" successfully created with ${selectedPermissions.length} assigned permissions!`,
        });
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setSelectedPermissions(["BOOKINGS"]);
        fetchTeam();
      } else {
        setStatusMessage({ type: "error", text: data.error || "Could not create staff account." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error creating staff account: " + err.message });
    } finally {
      setFormLoading(false);
    }
  }

  async function handleUpdatePermissions(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMember) return;

    setUpdatingPermissions(true);
    try {
      const res = await fetch(`/api/admin/team/${editingMember.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permissions: editPermissions,
          staffRole: editPermissions.includes("ALL") ? "SUPER_ADMIN" : "CUSTOM_STAFF",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: `Permissions updated successfully for ${editingMember.name}!`,
        });
        setEditingMember(null);
        fetchTeam();
      } else {
        alert(data.error || "Failed to update permissions.");
      }
    } catch (err: any) {
      alert("Error updating permissions: " + err.message);
    } finally {
      setUpdatingPermissions(false);
    }
  }

  async function handleDelete(id: string, memberName: string) {
    if (!confirm(`Are you sure you want to delete staff account "${memberName}"? They will permanently lose access.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: "success", text: data.message });
        fetchTeam();
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to delete account." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error deleting staff member: " + err.message });
    }
  }

  function openEditModal(m: TeamMember) {
    setEditingMember(m);
    const perms = (m.permissions || "").split(",").map((p) => p.trim()).filter(Boolean);
    setEditPermissions(perms.length > 0 ? perms : ["BOOKINGS"]);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Role & Department Permission Controller</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Team & Department Staff Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Assign custom job roles with granular checkboxes. Give one staff member 2 tasks (e.g. Bookings + Billing) and another 3 tasks (e.g. Listings + Destinations + Promos).
          </p>
        </div>

        <a
          href="#create-staff-form"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Create Staff Member</span>
        </a>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-3 transition ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="font-semibold">{statusMessage.text}</span>
        </div>
      )}

      {/* Team Directory */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Current Staff Members</h2>
              <p className="text-xs text-slate-400">Accounts authorized with departmental dashboard access</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {team.length} Active {team.length === 1 ? "Account" : "Accounts"}
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-xs font-semibold">Loading team members...</span>
          </div>
        ) : team.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No staff accounts found. Create your first team member below.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {team.map((member) => {
              const isSuper = member.isProtected || member.email === "emraanirshad88@gmail.com" || member.permissions?.includes("ALL");
              const memberPerms = isSuper 
                ? PERMISSION_OPTIONS.map((p) => p.key) 
                : (member.permissions || "").split(",").map((s) => s.trim()).filter(Boolean);

              return (
                <div
                  key={member.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="space-y-2 max-w-md">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900 text-sm">{member.name}</span>
                      {member.isProtected && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Primary Super Admin
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{member.email}</span>
                      </div>
                      {member.phone && member.phone !== "N/A" && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assigned Granular Permissions Pills */}
                  <div className="flex-1 lg:px-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Assigned Permissions ({memberPerms.length} {memberPerms.length === 1 ? "Module" : "Modules"})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {isSuper ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-sm flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Full Super Admin Access (All 7 Modules)</span>
                        </span>
                      ) : (
                        memberPerms.map((permKey) => {
                          const option = PERMISSION_OPTIONS.find((p) => p.key === permKey);
                          if (!option) return null;
                          const Icon = option.icon;
                          return (
                            <span
                              key={permKey}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${option.badgeColor}`}
                            >
                              <Icon className="w-3 h-3" />
                              <span>{option.label}</span>
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!member.isProtected && (
                      <>
                        <button
                          onClick={() => openEditModal(member)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-500" />
                          <span>Edit Tasks</span>
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition"
                          title="Delete staff account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create New Staff Member with Granular Checkboxes Form */}
      <div id="create-staff-form" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Create New Staff Account</h2>
            <p className="text-xs text-slate-500">
              Provide credentials and check off the exact tasks this staff member will handle
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateStaff} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Staff Member Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tariq Mehmood"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Staff Email (Login Username) *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. tariq@travel.com"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Initial Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure alphanumeric password"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Direct Contact Phone (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Granular Permission Checkboxes Section */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Department Permissions & Module Access Checkboxes
                </h3>
                <p className="text-xs text-slate-500">
                  Select which dashboard tabs this account can view and manage ({selectedPermissions.length} selected)
                </p>
              </div>

              {/* Quick Select Helpers */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPermissions(PERMISSION_OPTIONS.map((p) => p.key))}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPermissions(["BOOKINGS"])}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Bookings Only
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPermissions(["BOOKINGS", "FINANCE"])}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Bookings + Billing (2 Tasks)
                </button>
              </div>
            </div>

            {/* Checkboxes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {PERMISSION_OPTIONS.map((option) => {
                const isChecked = selectedPermissions.includes(option.key) || selectedPermissions.includes("ALL");
                const Icon = option.icon;

                return (
                  <div
                    key={option.key}
                    onClick={() => togglePermission(option.key, false)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3.5 ${
                      isChecked
                        ? "bg-emerald-50/60 border-emerald-300 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="mt-0.5 text-emerald-600">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 fill-emerald-600 text-white" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isChecked ? "text-emerald-700" : "text-slate-400"}`} />
                        <span className="font-extrabold text-xs text-slate-900">{option.label}</span>
                        <span className="text-[10px] font-semibold text-slate-400">({option.department})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={formLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              {formLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>Create Staff Member ({selectedPermissions.length} Tasks)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Edit Permissions Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingMember(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Edit Permissions for {editingMember.name}
                </h3>
                <p className="text-xs text-slate-500">{editingMember.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePermissions} className="space-y-5">
              <div className="text-xs text-slate-600">
                Check or uncheck the departments and tasks this staff member should be assigned:
              </div>

              <div className="space-y-2.5">
                {PERMISSION_OPTIONS.map((option) => {
                  const isChecked = editPermissions.includes(option.key) || editPermissions.includes("ALL");
                  const Icon = option.icon;

                  return (
                    <div
                      key={option.key}
                      onClick={() => togglePermission(option.key, true)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                        isChecked
                          ? "bg-emerald-50/60 border-emerald-300 shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="mt-0.5 text-emerald-600">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 fill-emerald-600 text-white" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${isChecked ? "text-emerald-700" : "text-slate-400"}`} />
                          <span className="font-extrabold text-xs text-slate-900">{option.label}</span>
                          <span className="text-[10px] text-slate-400">({option.department})</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPermissions}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {updatingPermissions && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Permissions ({editPermissions.length} Tasks)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
