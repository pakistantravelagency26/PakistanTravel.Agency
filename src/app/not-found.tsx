import Link from "next/link";
import { Compass, Search, MapPin, ArrowRight, Home, MessageCircle } from "lucide-react";

export default function NotFound() {
  const popularDestinations = [
    { name: "Hunza Valley", slug: "hunza" },
    { name: "Skardu", slug: "skardu" },
    { name: "Swat & Kalam", slug: "swat" },
    { name: "Kumrat Valley", slug: "kumrat" },
  ];

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase tracking-wider">
            404 · Destination Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Off the Beaten Mountain Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            The page, tour package, or destination you are searching for does not exist or has been relocated to a new route.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/search"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Search className="w-3.5 h-3.5 text-sky-600" />
            <span>Search All Tours</span>
          </Link>
        </div>

        {/* Popular Destinations Quick Links */}
        <div className="pt-6 border-t border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Popular Destinations
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {popularDestinations.map((d) => (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:border-sky-500 hover:text-sky-600 transition flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-sky-600" />
                <span>{d.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Support Link */}
        <p className="text-xs text-slate-400 pt-2">
          Need booking assistance?{" "}
          <a
            href="https://wa.me/923222327096?text=Hi%20PakistanTravel.Agency,%20I%20hit%20a%20404%20page%20and%20need%20help"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            WhatsApp Customer Desk (+92 322 2327096)
          </a>
        </p>
      </div>
    </div>
  );
}
