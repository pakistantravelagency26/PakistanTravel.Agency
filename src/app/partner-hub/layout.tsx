"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Building2, 
  PlusCircle, 
  Calendar, 
  BookOpenCheck, 
  Wallet, 
  MessageSquare, 
  Compass, 
  ShieldCheck, 
  ExternalLink,
  LogOut
} from "lucide-react";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // If on login page, render clean login view without sidebar
  if (pathname === "/partner-hub/login") {
    return <>{children}</>;
  }

  const businessTitle = session?.user?.name?.includes("Karakoram") || session?.user?.email?.includes("karakoram")
    ? "Karakoram Expeditions"
    : (session?.user?.name || "Verified Partner");

  const navItems = [
    { href: "/partner-hub/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/partner-hub/listings", label: "My Listings", icon: Building2 },
    { href: "/partner-hub/listings/new", label: "Add New Listing", icon: PlusCircle },
    { href: "/partner-hub/calendar", label: "Calendar & Rates", icon: Calendar },
    { href: "/partner-hub/bookings", label: "Bookings", icon: BookOpenCheck },
    { href: "/partner-hub/earnings", label: "Earnings & Payouts", icon: Wallet },
    { href: "/partner-hub/reviews", label: "Guest Reviews", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-orange-400" />
              <div>
                <span className="font-bold text-white text-base">Partner Extranet</span>
                <p className="text-[10px] text-slate-400">Vendor Management Hub</p>
              </div>
            </div>

            {/* Vendor Profile Badge */}
            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-white truncate">{businessTitle}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3 h-3" /> Verified Partner
                </span>
                <span className="font-semibold text-orange-400">10% Comm.</span>
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
                      ? "bg-orange-500 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
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
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            <span>Live Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/partner-hub/login" })}
            className="w-full flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Extranet</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
