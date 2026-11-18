"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Building2, 
  BookOpenCheck, 
  ArrowDownToLine, 
  MapPin, 
  Tag, 
  Globe,
  Headphones,
  ShieldAlert,
  Mail,
  LogOut,
  Percent,
  User as UserIcon,
  ExternalLink,
} from "lucide-react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (pathname !== "/secure-admin/login" && pathname !== "/secure-admin/setup-2fa") {
      if (status === "unauthenticated") {
        window.location.href = `/secure-admin/login?callbackUrl=${encodeURIComponent(pathname)}`;
      } else if (
        status === "authenticated" &&
        session?.user?.role !== "ADMIN"
      ) {
        window.location.href = `/secure-admin/login?error=UnauthorizedAdmin&callbackUrl=${encodeURIComponent(pathname)}`;
      }
    }
  }, [status, session, pathname]);

  // If on login or 2FA setup page, render clean view without sidebar
  if (pathname === "/secure-admin/login" || pathname === "/secure-admin/setup-2fa") {
    return <>{children}</>;
  }

  // Guard: require authenticated Super Admin session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs font-semibold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>Verifying Admin authorization...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs font-semibold">
        Redirecting to Admin sign-in...
      </div>
    );
  }

  const userPerms = (session?.user?.permissions || "").toUpperCase();
  const isSuperAdmin = session?.user?.staffRole === "SUPER_ADMIN" || userPerms.includes("ALL");

  const allNavItems = [
    { href: "/secure-admin/dashboard", label: "Overview & Analytics", icon: LayoutDashboard, perm: "OVERVIEW" },
    { href: "/secure-admin/tickets", label: "Support Tickets & AI Logs", icon: Headphones, perm: "TICKETS" },
    { href: "/secure-admin/bookings", label: "Bookings & Refunds", icon: BookOpenCheck, perm: "BOOKINGS" },
    { href: "/secure-admin/payouts", label: "Disbursements & Raast", icon: ArrowDownToLine, perm: "FINANCE" },
    { href: "/secure-admin/commissions", label: "Commission Settings", icon: Percent, perm: "COMMISSIONS" },
    { href: "/secure-admin/listings", label: "Listing Moderation", icon: Building2, perm: "LISTINGS" },
    { href: "/secure-admin/vendors", label: "Partner Hub (Vendors)", icon: Users, perm: "VENDORS" },
    { href: "/secure-admin/destinations", label: "Destinations & Valleys", icon: MapPin, perm: "DESTINATIONS" },
    { href: "/secure-admin/coupons", label: "Coupons & Promos", icon: Tag, perm: "COUPONS" },
    { href: "/secure-admin/website", label: "Website CMS & Content", icon: Globe, perm: "WEBSITE" },
    { href: "/secure-admin/settings/email", label: "Booking Email Settings", icon: Mail, perm: "SETTINGS" },
    { href: "/secure-admin/security", label: "Login Security & Lockouts", icon: ShieldAlert, perm: "SECURITY" },
    { href: "/secure-admin/team", label: "Team & Staff Access", icon: ShieldCheck, perm: "TEAM" },
    { href: "/secure-admin/profile", label: "My Profile & Credentials", icon: UserIcon, perm: null },
  ];

  const navItems = allNavItems.filter((item) => {
    if (!item.perm) return true;
    if (isSuperAdmin) return true;
    return userPerms.includes(item.perm);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      {/* Sidebar - Dark Indigo & Violet Palette */}
      <aside className="w-full md:w-64 bg-[#0B0720] text-[#D1B8FF] flex flex-col justify-between shrink-0 border-r border-[#25134D]">
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-[#25134D] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm shrink-0 border border-[#6A2FC8]/40">
                <Image
                  src="/logo.png"
                  alt="PakistanTravel.Agency"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm tracking-tight block">Control Center</span>
                <p className="text-[10px] text-[#9D71E8] font-semibold font-mono">
                  {isSuperAdmin ? "Super Admin" : "Staff Portal"}
                </p>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#6A2FC8] text-white shadow-lg shadow-[#6A2FC8]/30 font-bold"
                      : "text-[#D1B8FF] hover:text-white hover:bg-[#25134D]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#9D71E8]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t border-[#25134D] space-y-1">
          <Link
            href="/secure-admin/profile"
            className="flex items-center gap-2 text-xs font-semibold text-[#D1B8FF] hover:text-white px-3 py-2 rounded-xl hover:bg-[#25134D] transition"
          >
            <UserIcon className="w-3.5 h-3.5 text-[#9D71E8]" />
            <span>My Profile & Settings</span>
          </Link>

          <Link
            href="/"
            className="flex items-center justify-between text-xs font-semibold text-[#D1B8FF] hover:text-white px-3 py-2 rounded-xl hover:bg-[#25134D] transition"
          >
            <span>Live Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/secure-admin/login" })}
            className="w-full flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-2 rounded-xl hover:bg-red-950/30 transition text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
        <header className="h-16 border-b border-[#25134D]/20 px-6 flex items-center justify-between bg-[#0B0720] text-white sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9D71E8] animate-pulse"></span>
            <span className="text-xs font-semibold text-[#D1B8FF]">Pakistan Travel Network Live & Monitored</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/secure-admin/profile"
              className="inline-flex items-center gap-2 bg-[#25134D] hover:bg-[#3D1680] text-[#F2E9FF] px-3.5 py-1.5 rounded-full border border-[#6A2FC8]/40 transition font-medium text-[11px]"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#D1B8FF]" />
              <span className="font-bold">{session?.user?.name || session?.user?.email}</span>
              {(session?.user as any)?.username && (
                <span className="text-[#D1B8FF]/60 font-mono">(@{(session?.user as any).username})</span>
              )}
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
