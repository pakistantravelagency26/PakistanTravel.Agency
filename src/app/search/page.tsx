"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Check, 
  Star, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Filter,
  Building2,
  Compass,
  Clock,
  RotateCcw
} from "lucide-react";
import { MOCK_LISTINGS } from "@/services/listing.service";

export const dynamic = "force-dynamic";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialDestination = searchParams.get("destination") || "";
  const initialType = searchParams.get("type") || "ALL";

  // Filter States
  const [destinationQuery, setDestinationQuery] = useState(initialDestination);
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [priceMax, setPriceMax] = useState<number>(85000);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyFreeCancellation, setOnlyFreeCancellation] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  function toggleWishlist(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  // Filtered and Sorted Listings
  const filteredListings = useMemo(() => {
    let list = [...MOCK_LISTINGS];

    if (destinationQuery.trim()) {
      const q = destinationQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.destinationSlug.toLowerCase().includes(q) ||
          item.destinationName.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.province.toLowerCase().includes(q)
      );
    }

    if (selectedType !== "ALL") {
      list = list.filter((item) => item.type === selectedType);
    }

    if (priceMax) {
      list = list.filter((item) => item.basePrice <= priceMax);
    }

    if (minRating > 0) {
      list = list.filter((item) => item.avgRating >= minRating);
    }

    if (onlyFreeCancellation) {
      list = list.filter((item) => item.freeCancellation);
    }

    if (sortBy === "price_asc") {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === "rating_desc") {
      list.sort((a, b) => b.avgRating - a.avgRating);
    }

    return list;
  }, [
    destinationQuery,
    selectedType,
    priceMax,
    minRating,
    onlyFreeCancellation,
    sortBy,
  ]);

  const quickDestinations = [
    { label: "All Pakistan", val: "" },
    { label: "Hunza Valley", val: "Hunza" },
    { label: "Skardu & Deosai", val: "Skardu" },
    { label: "Swat & Kalam", val: "Swat" },
    { label: "Fairy Meadows", val: "Fairy Meadows" },
    { label: "Neelum Valley", val: "Neelum" },
    { label: "Murree & Bhurban", val: "Murree" },
    { label: "Kumrat Valley", val: "Kumrat" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Top Search & Filter Control Center (Option to choose what to search) */}
      <section className="bg-white border-b border-slate-200 shadow-sm py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Breadcrumb & Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Link href="/" className="hover:text-sky-600 font-medium">Home</Link>
                <span>/</span>
                <span>Search Catalog</span>
                {destinationQuery && (
                  <>
                    <span>/</span>
                    <span className="text-slate-900 font-bold">{destinationQuery}</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Search Tours & Luxury Stays in Pakistan
              </h1>
              <p className="text-xs text-slate-500">
                Filter by destination, accommodation type, budget, or verified operator
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  showAdvancedFilters
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showAdvancedFilters ? "Hide Filters" : "More Filters"}</span>
              </button>

              {(destinationQuery || selectedType !== "ALL" || minRating > 0 || onlyFreeCancellation || priceMax < 85000) && (
                <button
                  onClick={() => {
                    setDestinationQuery("");
                    setSelectedType("ALL");
                    setPriceMax(85000);
                    setMinRating(0);
                    setOnlyFreeCancellation(false);
                    setSortBy("recommended");
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Box & Category Switcher Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search destination input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                placeholder="Search destination, hotel, or tour (e.g. Hunza, Skardu, Swat)..."
                className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
              {destinationQuery && (
                <button
                  onClick={() => setDestinationQuery("")}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Type selector: All vs Tour vs Hotel */}
            <div className="md:col-span-4 flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedType("ALL")}
                className={`flex-1 py-2 px-2.5 rounded-lg transition text-center ${
                  selectedType === "ALL"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Options
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("TOUR")}
                className={`flex-1 py-2 px-2.5 rounded-lg transition text-center flex items-center justify-center gap-1 ${
                  selectedType === "TOUR"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Tour Packages</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("HOTEL")}
                className={`flex-1 py-2 px-2.5 rounded-lg transition text-center flex items-center justify-center gap-1 ${
                  selectedType === "HOTEL"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Hotels & Stays</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="recommended">Sort by: Recommended</option>
                <option value="price_asc">Price: Lowest First</option>
                <option value="price_desc">Price: Highest First</option>
                <option value="rating_desc">Highest Guest Rating</option>
              </select>
            </div>
          </div>

          {/* Quick Destination Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 hidden sm:inline">Popular:</span>
            {quickDestinations.map((d) => {
              const isActive = (d.val === "" && destinationQuery === "") || (d.val !== "" && destinationQuery.toLowerCase() === d.val.toLowerCase());
              return (
                <button
                  key={d.label}
                  onClick={() => setDestinationQuery(d.val)}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {/* Advanced Collapsible Filters */}
          {showAdvancedFilters && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
              {/* Budget slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-800">Budget Limit</span>
                  <span className="text-xs font-bold text-orange-600">
                    Up to PKR {priceMax.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="85000"
                  step="5000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>PKR 20,000</span>
                  <span>PKR 85,000+</span>
                </div>
              </div>

              {/* Rating selection */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-1.5">Guest Review Score</span>
                <div className="flex items-center gap-2">
                  {[
                    { label: "Any", val: 0 },
                    { label: "4.5+ ★", val: 4.5 },
                    { label: "4.8+ ★", val: 4.8 },
                  ].map((r) => (
                    <button
                      key={r.val}
                      onClick={() => setMinRating(r.val)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                        minRating === r.val
                          ? "bg-sky-600 text-white border-sky-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free cancellation */}
              <div className="flex items-center">
                <label className="flex items-center gap-2.5 cursor-pointer bg-white p-3 rounded-xl border border-slate-200 w-full hover:bg-slate-100/70 transition">
                  <input
                    type="checkbox"
                    checked={onlyFreeCancellation}
                    onChange={(e) => setOnlyFreeCancellation(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Free Cancellation</span>
                    <span className="text-[10px] text-slate-500">Show only zero-risk refundable packages</span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Results: 3 ITEMS IN A LINE (`lg:grid-cols-3`) WITH DETAILS UNDERNEATH */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Results Counter Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-600">
            Showing <span className="text-slate-900 font-extrabold">{filteredListings.length}</span> experiences across Pakistan
          </p>
          <span className="text-[11px] text-slate-400 font-medium">3 per row view</span>
        </div>

        {/* 3 Per Line Grid */}
        {filteredListings.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Filter className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No properties or tours match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try clearing the destination search, increasing the budget, or selecting &ldquo;All Options&rdquo;.
            </p>
            <button
              onClick={() => {
                setDestinationQuery("");
                setSelectedType("ALL");
                setPriceMax(85000);
                setMinRating(0);
                setOnlyFreeCancellation(false);
              }}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <article
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Photo & Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.photos[0]}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Top Left Badge */}
                  {item.badge && (
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  )}

                  {/* Wishlist Heart */}
                  <button
                    onClick={(e) => toggleWishlist(item.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow transition"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist.includes(item.id) ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>

                  {/* Duration or Type Bottom Left */}
                  <span className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                    {item.type === "HOTEL" ? (
                      <>
                        <Building2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Luxury Hotel Stay</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-orange-400" />
                        <span>{item.duration || "Guided Tour"}</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Details Underneath ("Usk nichy thori detls") */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Location & Province */}
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-sky-600 font-semibold truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" /> {item.destinationName}
                      </span>
                      <span className="text-[11px] text-slate-400 shrink-0">{item.province}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-sky-600 transition line-clamp-2 leading-snug">
                      <Link href={`/listing/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>

                    {/* Short Details / Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Verified Vendor & Rating */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 text-[11px] text-slate-700 font-medium truncate">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.vendor.businessName}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <div className="bg-sky-600 text-white px-1.5 py-0.5 rounded-md text-[11px] font-extrabold flex items-center gap-0.5 shadow-sm">
                          <Star className="w-2.5 h-2.5 fill-white text-white" />
                          <span>{item.avgRating}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">({item.totalReviews})</span>
                      </div>
                    </div>

                    {/* Key Amenities Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {item.freeCancellation && (
                      <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 pt-0.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Free cancellation available</span>
                      </p>
                    )}
                  </div>

                  {/* Pricing and Action CTA */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        {item.type === "HOTEL" ? "Per Night" : "Starting Price"}
                      </span>
                      <p className="text-lg font-extrabold text-slate-900 leading-tight">
                        PKR {item.basePrice.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/listing/${item.slug}`}
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition shadow-md shadow-orange-500/20 flex items-center gap-1.5 group-hover:scale-105"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-12 text-center text-xs text-slate-400">Loading experiences across Pakistan...</div>}>
      <SearchContent />
    </Suspense>
  );
}
