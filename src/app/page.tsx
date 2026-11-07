import Link from "next/link";
import Image from "next/image";
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
  ArrowRight,
  Star,
  Check,
  Percent,
  Clock,
  Award
} from "lucide-react";
import { getActiveDbListings } from "@/services/serverListing.service";
import { TourMarketplaceSection } from "@/components/home/TourMarketplaceSection";
import { getSiteSettings } from "@/services/siteSettings.service";

export const revalidate = 60;

export default async function HomePage() {
  const listings = await getActiveDbListings();
  const settings = await getSiteSettings();
  const hero = settings.HERO;
  const announcement = settings.ANNOUNCEMENT;

  // Filter dropdown destinations and experience types strictly by real available listings
  const activeDestinationSlugs = new Set(listings.map((l) => l.destinationSlug));
  const hasHotels = listings.some((l) => l.type === "HOTEL");
  const hasTours = listings.some((l) => l.type === "TOUR");
  const hasRentals = listings.some((l) => l.type === "RENTAL");

  const allDestinations = [
    { 
      slug: "hunza", 
      label: "Hunza Valley", 
      desc: "Attabad Lake, Passu & Karimabad",
      image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600&auto=format&fit=crop&q=80",
      tours: 12
    },
    { 
      slug: "skardu", 
      label: "Skardu & Deosai", 
      desc: "Shangrila, Katpana & Plains",
      image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&auto=format&fit=crop&q=80",
      tours: 9
    },
    { 
      slug: "swat", 
      label: "Swat & Kalam", 
      desc: "Mahodand, Malam Jabba & Rivers",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
      tours: 7
    },
    { 
      slug: "kumrat", 
      label: "Kumrat Valley", 
      desc: "Jahaz Banda, Katora & Pine Woods",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
      tours: 6
    },
    { 
      slug: "murree", 
      label: "Murree & Bhurban", 
      desc: "Luxury Hill Resorts & Pine Walks",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
      tours: 8
    },
    { 
      slug: "neelum", 
      label: "Neelum Valley", 
      desc: "Arang Kel, Sharda & Kashmir Valleys",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80",
      tours: 5
    },
  ];

  const availableDestinations = allDestinations.filter(
    (d) => activeDestinationSlugs.size === 0 || activeDestinationSlugs.has(d.slug)
  );

  return (
    <div className="space-y-16 pb-24 bg-[#F8FAF9] text-slate-800">
      {/* 1. Dynamic Top Announcement Banner */}
      {announcement?.isEnabled && announcement?.text && (
        <div className="bg-[#FD4621] text-white text-xs py-2.5 px-4 text-center font-bold shadow-sm flex items-center justify-center gap-2">
          <span>{announcement.text}</span>
          {announcement.linkUrl && (
            <Link
              href={announcement.linkUrl}
              className="underline font-black hover:text-white/80 transition ml-1"
            >
              {announcement.linkText || "Explore Tours →"}
            </Link>
          )}
        </div>
      )}

      {/* 2. Turie Index-3 Hero Area with Interactive Search Widget */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-[#F8FAF9]">
        {/* Soft Decorative Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-100/40 via-sky-100/30 to-orange-100/30 blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FD4621]" />
            <span>{hero?.badgeText || "Your Tour, Perfectly Personalised!"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 max-w-4xl mx-auto leading-tight">
            {hero?.title || "Explore Northern Pakistan With Verified Local Operators"}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            {hero?.subtitle || "Discover Pakistan's breathtaking destinations, compare guided tours from licensed operators, and book your perfect mountain getaway."}
          </p>
        </div>

        {/* Turie-Style Multi-Tab Floating Search Bar */}
        <div className="max-w-5xl mx-auto mt-10">
          <div className="bg-white p-3 sm:p-5 rounded-3xl shadow-2xl shadow-slate-300/50 border border-slate-200/90">
            {/* Search Form */}
            <form
              action="/search"
              method="GET"
              className="grid grid-cols-1 md:grid-cols-12 gap-3"
            >
              {/* Destination Dropdown */}
              <div className="md:col-span-4 bg-slate-50 hover:bg-slate-100/80 transition rounded-2xl px-4 py-3 flex items-center gap-3 text-slate-800 border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FD4621] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="w-full text-left">
                  <label htmlFor="destination-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Location
                  </label>
                  <select
                    id="destination-select"
                    name="destination"
                    className="w-full bg-transparent font-extrabold text-xs sm:text-sm text-slate-900 outline-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="">Where to in Pakistan?</option>
                    {availableDestinations.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Travel Date */}
              <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/80 transition rounded-2xl px-4 py-3 flex items-center gap-3 text-slate-800 border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="w-full text-left">
                  <label htmlFor="travel-date-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    When?
                  </label>
                  <input
                    id="travel-date-input"
                    type="date"
                    name="date"
                    className="w-full bg-transparent font-extrabold text-xs sm:text-sm text-slate-900 outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Category / Experience Type */}
              <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/80 transition rounded-2xl px-4 py-3 flex items-center gap-3 text-slate-800 border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="w-full text-left">
                  <label htmlFor="type-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </label>
                  <select
                    id="type-select"
                    name="type"
                    className="w-full bg-transparent font-extrabold text-xs sm:text-sm text-slate-900 outline-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="">All Experiences</option>
                    {(hasTours || (!hasHotels && !hasRentals)) && <option value="TOUR">Northern Guided Tours</option>}
                    {hasHotels && <option value="HOTEL">Luxury Stays & Hotels</option>}
                    {hasRentals && <option value="RENTAL">4x4 Mountain Jeeps</option>}
                  </select>
                </div>
              </div>

              {/* Turie Action Button */}
              <div className="md:col-span-2 flex items-center">
                <button
                  type="submit"
                  className="w-full h-full min-h-[52px] bg-[#FD4621] hover:bg-[#e03a18] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FD4621]/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Confidence Badges */}
        <div className="max-w-4xl mx-auto mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-600">
          <Link href="/how-we-verify-partners" className="flex items-center gap-3 hover:opacity-85 transition group">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block group-hover:text-emerald-700">
                {hero?.badge1Title || "Licensed Local Operators"}
              </span>
              <span className="text-[11px] text-slate-400">
                {hero?.badge1Sub || "DTS & SECP Vetted · How we verify"}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FD4621] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                {hero?.badge2Title || "JazzCash & EasyPaisa"}
              </span>
              <span className="text-[11px] text-slate-400">
                {hero?.badge2Sub || "Plus Credit Cards & Bank Transfer"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                {hero?.badge3Title || "24/7 Online Support"}
              </span>
              <span className="text-[11px] text-slate-400">
                {hero?.badge3Sub || "WhatsApp & Phone Desk"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Turie Index-3 Top Destinations Area (tp-destination-3-area) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-[#FD4621] font-black text-xs uppercase tracking-wider block mb-1">
              Popular Destinations
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Iconic Northern Valleys
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Discover Pakistan&apos;s majestic alpine peaks, pristine lakes, and historic mountain cultures
            </p>
          </div>

          <Link
            href="/destinations"
            className="text-xs font-bold text-[#FD4621] hover:text-[#e03a18] flex items-center gap-1 transition shrink-0"
          >
            <span>All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Curved Destination Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {allDestinations.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block h-56"
            >
              <Image
                src={dest.image}
                alt={dest.label}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-110 transition duration-700 brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              <div className="absolute bottom-3.5 left-3.5 right-3.5 space-y-0.5">
                <span className="text-[10px] font-bold text-amber-300 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full inline-block mb-1">
                  {dest.tours} Tours & Stays
                </span>
                <h3 className="font-black text-white text-sm sm:text-base leading-tight group-hover:text-amber-300 transition">
                  {dest.label}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Main Multi-Vendor Marketplace Catalog (tp-tour-area) */}
      <TourMarketplaceSection 
        initialListings={listings} 
        customSettings={settings.MARKETPLACE_SECTION}
      />

      {/* 5. Turie Index-3 Dual Promotional Offer Banners (tp-offer-banner-area) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Offer Banner 1 */}
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 bg-slate-900 text-white min-h-[260px] flex flex-col justify-between shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&auto=format&fit=crop&q=80"
              alt="Luxury Mountain Stays"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-40 hover:scale-105 transition duration-700"
            />
            <div className="relative z-10 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FD4621] text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                Up to 30% Off
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight max-w-sm">
                Luxury Mountain Stays & Resorts
              </h3>
              <p className="text-xs text-slate-200 font-medium max-w-xs">
                Verified luxury hotels with 24/7 heating and scenic panoramic valley balconies.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <Link
                href="/search?type=HOTEL"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-[#FD4621] hover:text-white transition shadow-md"
              >
                <span>Book Luxury Stays</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Offer Banner 2 */}
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 bg-slate-900 text-white min-h-[260px] flex flex-col justify-between shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80"
              alt="Guided Expeditions"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-40 hover:scale-105 transition duration-700"
            />
            <div className="relative z-10 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-sm">
                Certified Guides
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight max-w-sm">
                Conquer The Karakoram & Hindu Kush
              </h3>
              <p className="text-xs text-slate-200 font-medium max-w-xs">
                All-inclusive group departures with expert alpine guides, 4x4 transport & meals.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <Link
                href="/search?type=TOUR"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-emerald-500 hover:text-slate-950 transition shadow-md"
              >
                <span>Explore Tour Packages</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Turie Index-3 Platform Facts & Counters (tp-counter-area) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-[#FD4621]">50+</p>
            <p className="text-xs font-bold text-slate-900">Verified Local Partners</p>
            <p className="text-[11px] text-slate-400">Licensed Northern Operators</p>
          </div>

          <div className="space-y-1 border-l border-slate-100">
            <p className="text-3xl sm:text-4xl font-black text-slate-900">100%</p>
            <p className="text-xs font-bold text-slate-900">DTS Compliance</p>
            <p className="text-[11px] text-slate-400">Government Licensed</p>
          </div>

          <div className="space-y-1 border-l border-slate-100">
            <p className="text-3xl sm:text-4xl font-black text-emerald-600">24/7</p>
            <p className="text-xs font-bold text-slate-900">On-Ground Support</p>
            <p className="text-[11px] text-slate-400">Helpline & WhatsApp</p>
          </div>

          <div className="space-y-1 border-l border-slate-100">
            <p className="text-3xl sm:text-4xl font-black text-sky-600">15,000+</p>
            <p className="text-xs font-bold text-slate-900">Happy Travelers</p>
            <p className="text-[11px] text-slate-400">Safe Mountain Journeys</p>
          </div>
        </div>
      </section>

      {/* 7. Turie Index-3 Why Choose Us (tp-about-area) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Why Choose PakistanTravel.Agency</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              The Safe, Direct & Transparent Travel Marketplace
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              We connect travelers directly with audited regional operators across Gilgit-Baltistan and Khyber Pakhtunkhwa, eliminating middleman commissions and ensuring safety.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>DTS Licensed Guides</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Secure Escrow Protection</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant PDF Vouchers</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/how-we-verify-partners"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#FD4621] hover:underline"
              >
                <span>Read our verification standards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80"
              alt="Mountain Travel Safety"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 8. Turie Index-3 Blog & Stories Area (tp-blog-area) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-[#FD4621] font-black text-xs uppercase tracking-wider block mb-1">
              Travel Guides & News
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Northern Travel Insights & Tips
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real advice, route conditions, trip budgets, and essential checklists by certified mountain experts
            </p>
          </div>

          <Link
            href="/blog"
            className="text-xs font-bold text-[#FD4621] hover:text-[#e03a18] flex items-center gap-1 transition shrink-0"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/blog/skardu-trip-cost-2026"
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
          >
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&auto=format&fit=crop&q=80"
                alt="Skardu Trip Cost"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-[#FD4621] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                Budget Guide
              </span>
            </div>
            <div className="p-5 space-y-2">
              <span className="text-[11px] font-bold text-slate-400">5 min read • Expedition Tips</span>
              <h3 className="font-extrabold text-slate-950 text-sm sm:text-base group-hover:text-[#FD4621] transition line-clamp-2">
                Skardu Trip Cost in 2026: Complete Budget & Route Breakdown
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 font-medium">
                Detailed cost estimate for flights, 4x4 jeeps, hotel stays, and food across Shangrila and Deosai.
              </p>
            </div>
          </Link>

          <Link
            href="/blog/hunza-best-time-to-visit"
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
          >
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600&auto=format&fit=crop&q=80"
                alt="Best Time to Visit Hunza"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                Seasonal Guide
              </span>
            </div>
            <div className="p-5 space-y-2">
              <span className="text-[11px] font-bold text-slate-400">4 min read • Seasonal Advice</span>
              <h3 className="font-extrabold text-slate-950 text-sm sm:text-base group-hover:text-[#FD4621] transition line-clamp-2">
                Best Time to Visit Hunza: Blossom, Summer & Golden Autumn
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 font-medium">
                Explore the ideal months for cherry blossoms in Karimabad versus golden foliage across Attabad.
              </p>
            </div>
          </Link>

          <Link
            href="/blog/kumrat-valley-route-tips"
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
          >
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80"
                alt="Kumrat Valley Trekking"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-sky-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                Trekking & Jeeps
              </span>
            </div>
            <div className="p-5 space-y-2">
              <span className="text-[11px] font-bold text-slate-400">6 min read • Off-Road Tips</span>
              <h3 className="font-extrabold text-slate-950 text-sm sm:text-base group-hover:text-[#FD4621] transition line-clamp-2">
                Kumrat Valley & Jahaz Banda: Route Guide & Camping Essentials
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 font-medium">
                Essential 4x4 track advice from Thal to Jahaz Banda meadow and Katora Lake trekking safety.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
