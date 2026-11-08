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
  LogOut
} from "lucide-react";
import { COMMISSION_PERCENT } from "@/config/site";

export default function PartnerHubShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (pathname !== "/partner-hub/login" && pathname !== "/partner-hub/setup-2fa") {
      if (status === "unauthenticated" || (timedOut && status === "loading")) {
        window.location.href = `/partner-hub/login?callbackUrl=${encodeURIComponent(pathname)}`;
      }
    }
  }, [status, session, pathname, timedOut]);

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
    { href: "/partner-hub/profile", label: "Profile & Host Contact", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white text-slate-700 flex flex-col justify-between shrink-0 border-r border-slate-200">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm shrink-0">
                <Image
                  src="/logo.png"
                  alt="PakistanTravel.Agency"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-sm tracking-tight block">Partner Extranet</span>
                <p className="text-[10px] text-slate-400 font-semibold">Vendor Management Hub</p>
              </div>
            </div>

            {/* Vendor Profile Badge */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-900 truncate">{businessTitle}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Partner
                </span>
                <span className="font-bold text-orange-600">{COMMISSION_PERCENT}% Comm.</span>
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
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Shortcut & Sign Out */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link
            href="/"
            className="flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
          >
            <span>Live Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/partner-hub/login" })}
            className="w-full flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 transition text-left"
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
