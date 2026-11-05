import { 
  Building2, 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  PhoneCall, 
  CheckCircle2, 
} from "lucide-react";
import { MOCK_LISTINGS } from "@/services/listing.service";
import { TourMarketplaceSection } from "@/components/home/TourMarketplaceSection";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-20 bg-slate-50/50">
      {/* Light & Modern Hero Banner (Musandam Tours style) */}
      <section className="relative pt-12 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50/80 via-white to-slate-50">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-sky-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Pakistan&apos;s Verified Multi-Vendor Travel Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Discover Pakistan&apos;s Majestic <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600">Mountains & Valleys</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Book verified hotels in Hunza & Skardu, guided northern tours, and family vacation packages with instant Pakistani confirmations.
          </p>
        </div>

        {/* Clean Floating Search Bar (Musandam.tours modern card style) */}
        <div className="max-w-5xl mx-auto mt-10">
          <form
            action="/search"
            method="GET"
            className="bg-white p-3 sm:p-4 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-3"
          >
            {/* Destination */}
            <div className="md:col-span-4 bg-slate-50 hover:bg-slate-100/70 transition rounded-2xl px-4 py-3 flex items-center gap-3 text-slate-800 border border-slate-100">
              <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] font-bold uppercase text-slate-400">Destination</label>
                <input
                  type="text"
                  name="destination"
                  placeholder="Hunza, Skardu, Swat, Murree..."
                  className="w-full text-xs sm:text-sm font-bold bg-transparent focus:outline-none placeholder:font-normal placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/70 transition rounded-2xl px-4 py-3 flex items-center gap-3 text-slate-800 border border-slate-100">
              <Calendar className="w-5 h-5 text-orange-500 shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] font-bold uppercase text-slate-400">Travel Dates</label>
                <input
                  type="text"
                  name="dates"
                  placeholder="Check-in — Check-out"
                  className="w-full text-xs sm:text-sm font-bold bg-transparent focus:outline-none placeholder:font-normal placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/70 transition rounded-2xl px-4 py-3 flex items-center gap-3 text-slate-800 border border-slate-100">
              <Users className="w-5 h-5 text-teal-600 shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] font-bold uppercase text-slate-400">Guests & Type</label>
                <select
                  name="type"
                  className="w-full text-xs sm:text-sm font-bold bg-transparent focus:outline-none text-slate-800"
                  defaultValue="ALL"
                >
                  <option value="ALL">All Experiences</option>
                  <option value="TOUR">Guided Tour Packages</option>
                  <option value="HOTEL">Hotels & Resorts</option>
                </select>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full h-full min-h-[52px] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-2xl transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">100% Verified Partners</span>
              <span className="text-[11px] text-slate-400">Physical hotel & guide verification</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Zero Double-Booking</span>
              <span className="text-[11px] text-slate-400">Real-time inventory locks</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">JazzCash & EasyPaisa</span>
              <span className="text-[11px] text-slate-400">Plus Credit Cards & Bank Transfer</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">24/7 Helpline Support</span>
              <span className="text-[11px] text-slate-400">+92 322 2327096 Helpdesk</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Multi-Vendor Marketplace Catalog: 4 items per row with Filter running on top */}
      <TourMarketplaceSection initialListings={MOCK_LISTINGS} />

      {/* Floating WhatsApp Helpdesk Pill (Iconic Musandam.tours feature) */}
      <aside aria-label="Customer Support" className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/923222327096?text=Assalam-o-Alaikum%2C%20I%20need%20assistance%20with%20Pakistan%20travel%20booking"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl shadow-emerald-600/40 font-bold text-xs transition-transform hover:scale-105"
        >
          <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
          <span className="hidden sm:inline">WhatsApp Help: +92 322 2327096</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </aside>
    </div>
  );
}
