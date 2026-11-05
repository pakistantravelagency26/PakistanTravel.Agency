"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ShieldCheck, CreditCard, Mail, Headphones } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Completely hide the public website footer on all Admin and Vendor portal routes
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

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800 text-sm">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">Verified Northern Partners</h4>
              <p className="text-xs text-slate-400 mt-1">
                Every hotel in Hunza & Skardu and 4x4 mountain driver is physically vetted and licensed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">JazzCash, EasyPaisa & Cards</h4>
              <p className="text-xs text-slate-400 mt-1">
                Zero hassle local Pakistani payments with instant PDF check-in voucher issuance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">24/7 Online Assistance</h4>
              <p className="text-xs text-slate-400 mt-1">
                Dedicated on-ground emergency and route coordinators active during your journeys.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-sm">
          <div>
            <h5 className="font-bold text-white text-xs mb-3 uppercase tracking-wider text-sky-400">Popular Destinations</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/search?destination=hunza" className="hover:text-white transition">Hunza Valley & Attabad Lake</Link></li>
              <li><Link href="/search?destination=skardu" className="hover:text-white transition">Skardu & Deosai Plains</Link></li>
              <li><Link href="/search?destination=swat" className="hover:text-white transition">Swat Valley & Kalam</Link></li>
              <li><Link href="/search?destination=murree" className="hover:text-white transition">Murree & Bhurban Resorts</Link></li>
              <li><Link href="/search?destination=kumrat" className="hover:text-white transition">Kumrat Valley & Dir</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs mb-3 uppercase tracking-wider text-orange-400">Experience Categories</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/search?type=HOTEL" className="hover:text-white transition">Luxury Hotels & Resorts</Link></li>
              <li><Link href="/search?type=TOUR" className="hover:text-white transition">Guided Northern Tours</Link></li>
              <li><Link href="/search?destination=hunza" className="hover:text-white transition">Hunza Valley Packages</Link></li>
              <li><Link href="/search?destination=skardu" className="hover:text-white transition">Skardu Expeditions</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs mb-3 uppercase tracking-wider text-teal-400">Traveler Guarantees</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/faq" className="hover:text-white transition">Best Price Match Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Flexible Cancellation Policy</Link></li>
              <li><Link href="/about" className="hover:text-white transition">Verified Local Tour Partners</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Customer Care 24/7</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs mb-3 uppercase tracking-wider text-emerald-400">Direct Support</h5>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                pakistantravel.agency26@gmail.com
              </p>
              <p className="pt-2 text-[11px] text-slate-500">
                Blue Area, Islamabad, Pakistan
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PakistanTravel.Agency. Designed with pride for Pakistan Tourism.</p>
          <div className="flex flex-wrap items-center gap-5 font-medium">
            <Link href="/about" className="hover:text-white transition">About Us</Link>
            <Link href="/contact" className="hover:text-white transition">Contact & Help</Link>
            <Link href="/faq" className="hover:text-white transition">FAQs</Link>
            <Link href="/terms" className="hover:text-white transition">Terms & Policies</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
