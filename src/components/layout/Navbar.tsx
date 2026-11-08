"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Compass, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Heart,
  Phone
} from "lucide-react";
import { useState, useEffect } from "react";
import { NavLinkItem, DEFAULT_SITE_SETTINGS } from "@/services/siteSettings.service";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>(DEFAULT_SITE_SETTINGS.NAVBAR_LINKS);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.NAVBAR_LINKS && Array.isArray(data.settings.NAVBAR_LINKS) && data.settings.NAVBAR_LINKS.length > 0) {
            setNavLinks(data.settings.NAVBAR_LINKS);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Completely hide the public website header on all Admin and Vendor portal routes
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/vendor") ||
    pathname?.startsWith("/secure-admin") ||
    pathname?.startsWith("/partner-hub") ||
    pathname?.startsWith("/admin-portal") ||
    pathname?.startsWith("/vendor-portal")
  ) {
    return null;
  }

  // Only customer role is treated as active on public customer navbar
  const isCustomerLoggedIn = session?.user && session.user.role === "CUSTOMER";

  return (
    <header className="bg-white text-slate-800 sticky top-0 z-50 shadow-sm border-b border-slate-100">
      {/* Top Announcement Bar */}
      <div className="bg-slate-50 border-b border-slate-100 text-slate-600 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Compare and book tours from independent local operators
            </span>
          </div>

          {/* Right items: Currency & Customer Sign In / Up */}
          <div className="flex items-center gap-3">
            <Link
              href="/list-your-tour"
              className="text-slate-700 hover:text-sky-600 font-semibold hidden md:inline-flex items-center gap-1 text-[11px]"
            >
              List your tour / hotel
            </Link>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="font-semibold text-slate-700 hidden sm:inline">PKR (Rs.)</span>
            <span className="text-slate-300">|</span>

            {isCustomerLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 font-bold text-slate-800 hover:text-sky-600 transition"
                >
                  <div className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[9px] font-bold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{session.user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="text-[10px] text-slate-400 font-medium">Signed in as Traveler</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{session.user.email}</p>
                    </div>

                    <Link
                      href="/account/bookings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-semibold"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      My Bookings & Vouchers
                    </Link>

                    <Link
                      href="/account/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-semibold"
                    >
                      <Heart className="w-3.5 h-3.5 text-slate-400" />
                      Saved Wishlist
                    </Link>

                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 hover:bg-red-50 text-left border-t border-slate-100 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 font-bold text-[11px]">
                <Link
                  href="/register"
                  className="text-slate-700 hover:text-sky-600 transition"
                >
                  Register
                </Link>
                <span className="text-slate-300">/</span>
                <Link
                  href="/login"
                  className="text-orange-600 hover:text-orange-700 font-extrabold transition"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Anchor text is brand name only */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-sky-600/15 group-hover:scale-105 transition shrink-0">
              <Image
                src="/logo.png"
                alt="PakistanTravel.Agency Logo"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Pakistan<span className="text-sky-600">Travel</span><span className="text-orange-500">.Agency</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.id || link.url}
                href={link.url}
                className="hover:text-sky-600 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action: Explore Catalog button */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              href="/search"
              className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-sky-600" />
              <span>Explore All</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
          <div className="space-y-2 text-sm font-semibold">
            <Link
              href="/search"
              className="block py-2.5 px-3 rounded-xl bg-slate-50 text-slate-800 font-bold hover:text-sky-600 flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Search Tours & Hotels Catalog</span>
              <Compass className="w-4 h-4 text-orange-500" />
            </Link>

            <Link
              href="/list-your-tour"
              className="block py-2.5 px-3 rounded-xl bg-sky-50 text-sky-900 font-bold hover:bg-sky-100 flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>List Your Tour or Hotel</span>
              <Building2 className="w-4 h-4 text-sky-600" />
            </Link>

            <div className="pt-2 pb-1 border-b border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-wider px-3">
              Navigation
            </div>
            <div className="grid grid-cols-2 gap-2 px-1 text-xs">
              {navLinks.map((link) => (
                <Link
                  key={link.id || link.url}
                  href={link.url}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 font-medium truncate"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <Link
              href="/login"
              className="w-1/2 text-center py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="w-1/2 text-center py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
