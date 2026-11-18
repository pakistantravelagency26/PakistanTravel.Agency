"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Building2, 
  PlusCircle, 
  Calendar, 
  BookOpenCheck, 
  Wallet, 
  MessageSquare, 
  ShieldCheck, 
  ExternalLink,
  Settings,
  LifeBuoy,
  LogOut
} from "lucide-react";
import { COMMISSION_PERCENT } from "@/config/site";

export default function PartnerHubShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (pathname !== "/partner-hub/login" && pathname !== "/partner-hub/setup-2fa") {
      if (status === "unauthenticated") {
        window.location.href = `/partner-hub/login?callbackUrl=${encodeURIComponent(pathname)}`;
      }
    }
  }, [status, session, pathname]);

  // If on login or 2FA setup page, render clean login view without sidebar
  if (pathname === "/partner-hub/login" || pathname === "/partner-hub/setup-2fa") {
    return <>{children}</>;
  }

  // Guard: require authenticated session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs font-semibold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying Partner Extranet credentials...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs font-semibold">
        Redirecting to Partner Extranet login...
      </div>
    );
  }

  const businessTitle = session?.user?.name || "Verified Partner";

  const navItems = [
    { href: "/partner-hub/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/partner-hub/listings", label: "My Listings", icon: Building2 },
    { href: "/partner-hub/listings/new", label: "Add New Tour / Listing", icon: PlusCircle },
    { href: "/partner-hub/calendar", label: "Calendar & Rates", icon: Calendar },
    { href: "/partner-hub/bookings", label: "Bookings", icon: BookOpenCheck },
    { href: "/partner-hub/earnings", label: "Earnings & Payouts", icon: Wallet },
    { href: "/partner-hub/reviews", label: "Guest Reviews", icon: MessageSquare },
    { href: "/partner-hub/support", label: "Help & Support Tickets", icon: LifeBuoy },
    { href: "/partner-hub/profile", label: "Profile & Host Contact", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      {/* Sidebar - Dark Midnight & Violet Extranet */}
      <aside className="w-full md:w-64 bg-[#0B0720] text-[#D1B8FF] flex flex-col justify-between shrink-0 border-r border-[#25134D]">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-[#25134D]">
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
                <span className="font-extrabold text-white text-sm tracking-tight block">Partner Extranet</span>
                <p className="text-[10px] text-[#9D71E8] font-semibold">Vendor Management Hub</p>
              </div>
            </div>

            {/* Vendor Profile Badge */}
            <div className="mt-4 p-3 rounded-2xl bg-[#25134D] border border-[#6A2FC8]/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9D71E8] animate-pulse"></span>
                <span className="text-xs font-bold text-white truncate">{businessTitle}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#D1B8FF] mt-1.5">
                <span className="flex items-center gap-1 text-[#D1B8FF] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9D71E8]" /> Verified Partner
                </span>
                <span className="font-bold text-[#F2E9FF]">Per-Tour Comm.</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
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

        {/* Footer Shortcut & Sign Out */}
        <div className="p-4 border-t border-[#25134D] space-y-1">
          <Link
            href="/"
            className="flex items-center justify-between text-xs font-semibold text-[#D1B8FF] hover:text-white px-3 py-2 rounded-xl hover:bg-[#25134D] transition"
          >
            <span>Live Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/partner-hub/login" })}
            className="w-full flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-2 rounded-xl hover:bg-red-950/30 transition text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Extranet</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1 p-4 sm:p-8 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
