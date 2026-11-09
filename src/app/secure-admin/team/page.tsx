"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Trash2, 
  Lock, 
  Unlock,
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
  Globe, 
  LayoutDashboard, 
  Headphones, 
  Percent, 
  ShieldAlert, 
  AtSign, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Save 
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
    key: "OVERVIEW",
    label: "Overview & Analytics",
    department: "Executive Dashboard",
    description: "View platform real-time overview, daily booking metrics, revenue, and active listings.",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: LayoutDashboard,
  },
  {
    key: "TICKETS",
    label: "Support Tickets & AI Logs",
    department: "Customer Support",
    description: "Manage traveler inquiries, reply to support tickets, and view AI concierge chat conversations.",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    icon: Headphones,
  },
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
    key: "COMMISSIONS",
    label: "Commission Settings",
    department: "Finance & Rates",
    description: "Configure global platform take-rate percentages and custom tier commissions.",
    badgeColor: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Percent,
  },
  {
    key: "LISTINGS",
    label: "Listing Moderation",
    department: "Quality & Catalog",
    description: "Approve or reject vendor submitted tour packages, set per-tour commission %.",
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
    key: "SETTINGS",
    label: "Booking Email Settings",
    department: "System Configuration",
    description: "Configure transactional booking emails, Gmail App password, and SMTP delivery.",
    badgeColor: "bg-slate-50 text-slate-700 border-slate-200",
    icon: Mail,
  },
  {
    key: "SECURITY",
    label: "Login Security & Lockouts",
    department: "Cyber Security",
    description: "View real-time login logs, unblock blocked IP addresses, and manage 2FA overrides.",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    icon: ShieldAlert,
  },
  {
    key: "TEAM",
    label: "Team & Staff Access",
    department: "Administration",
    description: "Create staff sub-accounts and configure granular department tab permissions.",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: ShieldCheck,
  },
];

interface TeamMember {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone: string;
  staffRole: string;
  permissions: string;
  createdAt: string;
  isProtected?: boolean;
  isSuspended?: boolean;
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New staff form state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(["BOOKINGS", "TICKETS"]);

  // Edit staff modal state
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [updatingMember, setUpdatingMember] = useState(false);

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
        if (editPermissions.includes("ALL") || editPermissions.length === PERMISSION_OPTIONS.length) {
          setEditPermissions(["BOOKINGS"]);
        } else {
          setEditPermissions(PERMISSION_OPTIONS.map((p) => p.key));
        }
        return;
      }

      setEditPermissions((prev) => {
        const withoutAll = prev.filter((p) => p !== "ALL");
        const exists = withoutAll.includes(key);
        const updated = exists ? withoutAll.filter((p) => p !== key) : [...withoutAll, key];
        return updated.length === 0 ? [key] : updated;
      });
    } else {
      if (key === "ALL") {
        if (selectedPermissions.includes("ALL") || selectedPermissions.length === PERMISSION_OPTIONS.length) {
          setSelectedPermissions(["BOOKINGS"]);
        } else {
          setSelectedPermissions(PERMISSION_OPTIONS.map((p) => p.key));
        }
        return;
      }

      setSelectedPermissions((prev) => {
        const withoutAll = prev.filter((p) => p !== "ALL");
        const exists = withoutAll.includes(key);
        const updated = exists ? withoutAll.filter((p) => p !== key) : [...withoutAll, key];
        return updated.length === 0 ? [key] : updated;
      });
    }
  }

  async function handleCreateStaff(e: React.FormEvent) {
    e.preventDefault();
    setStatusMessage(null);

    if (selectedPermissions.length === 0) {
      setStatusMessage({ type: "error", text: "Please select at least one tab/permission for this staff account." });
      return;
    }

    if (password.length < 8) {
      setStatusMessage({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim() || undefined,
          email: email.trim().toLowerCase(),
          password: password.trim(),
          phone: phone.trim() || undefined,
          permissions: selectedPermissions.length === PERMISSION_OPTIONS.length ? ["ALL"] : selectedPermissions,
          staffRole: selectedPermissions.length === PERMISSION_OPTIONS.length ? "SUPER_ADMIN" : "CUSTOM_STAFF",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: `Staff account "${data.member.name}" successfully created with ${selectedPermissions.length} assigned tabs!`,
        });
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setPhone("");
        setSelectedPermissions(["BOOKINGS", "TICKETS"]);
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

  function openEditModal(m: TeamMember) {
    setEditingMember(m);
    setEditName(m.name || "");
    setEditUsername(m.username || "");
    setEditEmail(m.email || "");
    setEditPhone(m.phone !== "N/A" ? m.phone : "");
    setEditPassword("");
    const isSuper = m.isProtected || m.permissions?.includes("ALL");
    if (isSuper) {
      setEditPermissions(PERMISSION_OPTIONS.map((p) => p.key));
    } else {
      const perms = (m.permissions || "").split(",").map((p) => p.trim()).filter(Boolean);
      setEditPermissions(perms.length > 0 ? perms : ["BOOKINGS"]);
    }
  }

  async function handleUpdateMember(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMember) return;

    if (editPermissions.length === 0) {
      alert("Please select at least one tab/permission for this staff member.");
      return;
    }

    setUpdatingMember(true);
    try {
      const isAll = editPermissions.length === PERMISSION_OPTIONS.length;
      const res = await fetch(`/api/admin/team/${editingMember.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          username: editUsername.trim() || "",
          email: editEmail.trim().toLowerCase(),
          phone: editPhone.trim() || "",
          password: editPassword.trim() ? editPassword.trim() : undefined,
          permissions: isAll ? ["ALL"] : editPermissions,
          staffRole: isAll ? "SUPER_ADMIN" : "CUSTOM_STAFF",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: `Details and tab permissions updated successfully for ${editName}!`,
        });
        setEditingMember(null);
        fetchTeam();
      } else {
        alert(data.error || "Failed to update staff member.");
      }
    } catch (err: any) {
      alert("Error updating staff member: " + err.message);
    } finally {
      setUpdatingMember(false);
    }
  }

  async function handleToggleSuspend(id: string, memberName: string, isSuspended: boolean) {
    const verb = isSuspended ? "unblock and restore" : "block and suspend";
    if (!confirm(`Are you sure you want to ${verb} access for "${memberName}"?`)) {
      return;
    }

    setActionLoading(id);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: isSuspended ? "UNBLOCK" : "BLOCK" }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: "success", text: data.message });
        fetchTeam();
      } else {
        setStatusMessage({ type: "error", text: data.error || `Failed to ${verb} staff account.` });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: `Error updating account status: ${err.message}` });
    } finally {
      setActionLoading(null);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Role & Tab Assignment Controller</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Team & Staff Tab Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Create staff sub-accounts with custom Username, Password, Email, and Phone. Check off exactly which dashboard tabs each staff member is allowed to see and manage.
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
              <p className="text-xs text-slate-400">All registered platform operators and their assigned dashboard tabs</p>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm">{member.name}</span>
                      {member.username && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-200 text-slate-700">
                          @{member.username}
                        </span>
                      )}
                      {member.isProtected && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Primary Super Admin
                        </span>
                      )}
                      {member.isSuspended && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-rose-600" />
                          SUSPENDED
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
                      Assigned Tabs ({memberPerms.length} of {PERMISSION_OPTIONS.length} Tabs)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {isSuper ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-sm flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Full Super Admin Access (All 13 Tabs Authorized)</span>
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
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {!member.isProtected && (
                      <>
                        <button
                          onClick={() => openEditModal(member)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-sm"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-500" />
                          <span>Edit Details & Tabs</span>
                        </button>
                        <button
                          onClick={() => handleToggleSuspend(member.id, member.name, Boolean(member.isSuspended))}
                          disabled={actionLoading === member.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${
                            member.isSuspended
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                          }`}
                        >
                          {member.isSuspended ? (
                            <>
                              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Unblock Staff</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Block</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          disabled={actionLoading === member.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition shadow-sm"
                          title="Delete staff account permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          <span>Delete</span>
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

      {/* Create New Staff Member Form */}
      <div id="create-staff-form" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Create New Staff Account</h2>
            <p className="text-xs text-slate-500">
              Provide Username, Email, Phone, Password, and check off the exact tabs this staff member will be assigned.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateStaff} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Staff Full Name *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username (Login ID)
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
                  placeholder="e.g. tariq_operations"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. tariq@travel.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mobile Phone (Login ID)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 03001234567"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Staff Password *
            </label>
            <div className="relative max-w-md">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 8 characters)"
                className="w-full pl-9 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Granular Permission Checkboxes Section */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Dashboard Tabs & Module Access Checkboxes
                </h3>
                <p className="text-xs text-slate-500">
                  Select which dashboard tabs this staff member can view and manage ({selectedPermissions.length} of {PERMISSION_OPTIONS.length} tabs selected)
                </p>
              </div>

              {/* Quick Select Helpers */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPermissions(PERMISSION_OPTIONS.map((p) => p.key))}
                  className="px-3 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold transition"
                >
                  Select All Tabs
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPermissions(["BOOKINGS", "TICKETS"])}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Bookings + Support
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPermissions(["FINANCE", "COMMISSIONS"])}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Finance Desk
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPermissions(["LISTINGS", "DESTINATIONS"])}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Catalog & Content
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPermissions([])}
                  className="px-3 py-1 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Checkboxes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {PERMISSION_OPTIONS.map((option) => {
                const isChecked = selectedPermissions.includes(option.key) || selectedPermissions.includes("ALL");
                const Icon = option.icon;

                return (
                  <div
                    key={option.key}
                    onClick={() => togglePermission(option.key, false)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3.5 ${
                      isChecked
                        ? "bg-emerald-50/70 border-emerald-300 shadow-sm ring-1 ring-emerald-300"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="mt-0.5 text-emerald-600 shrink-0">
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
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 block">
                        {option.department}
                      </span>
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
              <span>Create Staff Member ({selectedPermissions.length} Tabs)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Edit Member & Permissions Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setEditingMember(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Edit Staff Details & Tab Access
                </h3>
                <p className="text-xs text-slate-500">Updating profile and permissions for {editingMember.name}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateMember} className="space-y-6">
              {/* Profile Details in Modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Staff Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
                    placeholder="e.g. username"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="e.g. 03001234567"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reset Password (Leave blank to keep current password)
                </label>
                <div className="relative max-w-sm">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3.5 pr-10 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkboxes in Modal */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                      Assigned Dashboard Tabs ({editPermissions.length} Selected)
                    </h4>
                    <p className="text-[11px] text-slate-400">Select which tabs will be visible to this staff member</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditPermissions(PERMISSION_OPTIONS.map((p) => p.key))}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditPermissions([])}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 text-[11px] font-bold"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">
                  {PERMISSION_OPTIONS.map((option) => {
                    const isChecked = editPermissions.includes(option.key) || editPermissions.includes("ALL");
                    const Icon = option.icon;

                    return (
                      <div
                        key={option.key}
                        onClick={() => togglePermission(option.key, true)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                          isChecked
                            ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="mt-0.5 text-emerald-600 shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 fill-emerald-600 text-white" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`w-3.5 h-3.5 ${isChecked ? "text-emerald-700" : "text-slate-400"}`} />
                            <span className="font-extrabold text-xs text-slate-900">{option.label}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight">
                            {option.department}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                  disabled={updatingMember}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {updatingMember && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Staff Details & Tabs ({editPermissions.length} Tabs)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
