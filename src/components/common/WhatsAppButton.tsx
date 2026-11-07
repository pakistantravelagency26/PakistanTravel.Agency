"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const pathname = usePathname();

  // Hide on admin/vendor extranet pages
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/vendor") ||
    pathname?.startsWith("/secure-admin") ||
    pathname?.startsWith("/partner-hub")
  ) {
    return null;
  }

  return (
    <aside aria-label="Support chat" className="fixed bottom-6 right-6 z-40 print:hidden">
      <a
        href="https://wa.me/923222327096?text=Hi%20PakistanTravel.Agency,%20I%20have%20an%20inquiry%20about%20a%20tour%20or%20hotel%20booking."
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Chat with PakistanTravel.Agency on WhatsApp (+92 322 2327096)"
      >
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span className="hidden sm:inline">WhatsApp Help (+92 322 2327096)</span>
        <span className="sm:hidden">Help</span>
      </a>
    </aside>
  );
}
