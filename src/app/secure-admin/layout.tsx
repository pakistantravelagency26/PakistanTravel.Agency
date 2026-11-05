"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Building2, 
  Percent, 
  BookOpenCheck, 
  ArrowDownToLine, 
  MapPin, 
  Tag, 
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on login page, render clean login view without sidebar
  if (pathname === "/secure-admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/secure-admin/dashboard", label: "Overview & Analytics", icon: LayoutDashboard },
    { href: "/secure-admin/vendors", label: "Vendor Approvals", icon: Users },
    { href: "/secure-admin/listings", label: "Listing Moderation", icon: Building2 },
    { href: "/secure-admin/commissions", label: "Commission Settings", icon: Percent },
    { href: "/secure-admin/bookings", label: "Bookings & Refunds", icon: BookOpenCheck },
    { href: "/secure-admin/payouts", label: "Disbursements & Raast", icon: ArrowDownToLine },
    { href: "/secure-admin/destinations", label: "Destinations & Valleys", icon: MapPin },
    { href: "/secure-admin/coupons", label: "Coupons & Promos", icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/30">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">Control Center</span>
                <p className="text-[10px] text-emerald-400 font-mono font-semibold">Super Admin Portal</p>
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
                      ? "bg-emerald-600 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-900 transition"
          >
            <span>Live Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/secure-admin/login" })}
            className="w-full flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Control Center</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900">
        <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-950/40 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300">Pakistan Travel Network Live & Monitored</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 font-mono text-[11px]">
              admin@pakistantravel.agency
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
