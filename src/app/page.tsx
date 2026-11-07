import Link from "next/link";
import { 
  Building2, 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Headphones, 
  CheckCircle2, 
} from "lucide-react";
import { getActiveDbListings } from "@/services/serverListing.service";
import { TourMarketplaceSection } from "@/components/home/TourMarketplaceSection";

export const revalidate = 60;

export default async function HomePage() {
  const listings = await getActiveDbListings();

  // Filter dropdown destinations and experience types strictly by real available listings
  const activeDestinationSlugs = new Set(listings.map((l) => l.destinationSlug));
  const hasHotels = listings.some((l) => l.type === "HOTEL");
  const hasTours = listings.some((l) => l.type === "TOUR");
  const hasRentals = listings.some((l) => l.type === "RENTAL");

  const allDestinations = [
    { slug: "hunza", label: "Hunza Valley & Attabad" },
    { slug: "skardu", label: "Skardu & Deosai Plains" },
    { slug: "kumrat", label: "Kumrat Valley & Dir" },
    { slug: "swat", label: "Swat & Kalam" },
    { slug: "neelum", label: "Neelum Valley" },
    { slug: "murree", label: "Murree & Bhurban" },
  ];

  const availableDestinations = allDestinations.filter(
    (d) => activeDestinationSlugs.size === 0 || activeDestinationSlugs.has(d.slug)
  );

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
            Discover Pakistan&apos;s breathtaking destinations, explore tours from local operators, and book your perfect adventure—all in one place.
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
              <div className="w-full text-left">
                <label htmlFor="destination-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Where in Pakistan?</label>
                <select
                  id="destination-select"
                  name="destination"
                  className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="">All Destinations</option>
                  {availableDestinations.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Travel Date */}
            <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/70 transition rounded-2xl px-4 py-3 flex items-center gap-3 text-slate-800 border border-slate-100">
              <Calendar className="w-5 h-5 text-teal-600 shrink-0" />
              <div className="w-full text-left">
                <label htmlFor="travel-date-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">When?</label>
                <input
                  id="travel-date-input"
                  type="date"
                  name="date"
                  className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Experience Category */}
            <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/70 transition rounded-2xl px-4 py-3 flex items-center gap-3 text-slate-800 border border-slate-100">
              <Compass className="w-5 h-5 text-orange-500 shrink-0" />
              <div className="w-full text-left">
                <label htmlFor="type-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience Type</label>
                <select
                  id="type-select"
                  name="type"
                  className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="">All Categories</option>
                  {(hasTours || (!hasHotels && !hasRentals)) && <option value="TOUR">Northern Guided Tours</option>}
                  {hasHotels && <option value="HOTEL">Hotels & Resorts</option>}
                  {hasRentals && <option value="RENTAL">4x4 Mountain Jeeps</option>}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex items-center">
              <button
                type="submit"
                className="w-full h-full min-h-[52px] bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Confidence Badges */}
        <div className="max-w-4xl mx-auto mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-600">
          <Link href="/how-we-verify-partners" className="flex items-center gap-3 hover:opacity-80 transition group">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block group-hover:text-emerald-700">Licensed Local Operators</span>
              <span className="text-[11px] text-slate-400">DTS & SECP Vetted · How we verify</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">JazzCash & EasyPaisa</span>
              <span className="text-[11px] text-slate-400">Plus Credit Cards & Bank Transfer</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">24/7 Online Support</span>
              <span className="text-[11px] text-slate-400">WhatsApp & Phone Desk</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Multi-Vendor Marketplace Catalog: 4 items per row with Filter running on top */}
      <TourMarketplaceSection initialListings={listings} />
    </div>
  );
}
