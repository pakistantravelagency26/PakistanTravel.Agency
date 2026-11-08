"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Check, 
  Star, 
  Sparkles,
  ArrowRight,
  Compass,
  Clock,
  RotateCcw
} from "lucide-react";
import { ListingData } from "@/services/listing.service";
import { CustomTripEnquiryForm } from "@/components/common/CustomTripEnquiryForm";

interface SearchClientViewProps {
  initialListings?: ListingData[];
}

function SearchContent({ initialListings = [] }: SearchClientViewProps) {
  const searchParams = useSearchParams();
  const initialDestination = searchParams.get("destination") || "";

  // Filter States
  const [destinationQuery, setDestinationQuery] = useState(initialDestination);
  const [priceMax, setPriceMax] = useState<number>(150000);
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

  const [dbListings, setDbListings] = useState<ListingData[]>(
    initialListings.filter((l) => l.type === "TOUR")
  );
  const [loading, setLoading] = useState(initialListings.length === 0);

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.listings)) {
          // Strictly TOURS only
          setDbListings(data.listings.filter((l: ListingData) => l.type === "TOUR"));
        }
      })
      .catch((err) => console.error("Error fetching live listings:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filtered and Sorted Listings
  const filteredListings = useMemo(() => {
    let list = dbListings.filter((item) => item.type === "TOUR");

    if (destinationQuery.trim()) {
      const q = destinationQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.destinationSlug?.toLowerCase().includes(q) ||
          item.destinationName?.toLowerCase().includes(q) ||
          item.city?.toLowerCase().includes(q) ||
          item.title?.toLowerCase().includes(q) ||
          item.province?.toLowerCase().includes(q)
      );
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

    // Sorting
    if (sortBy === "price_asc") {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.avgRating - a.avgRating);
    }

    return list;
  }, [dbListings, destinationQuery, priceMax, minRating, onlyFreeCancellation, sortBy]);

  function resetFilters() {
    setDestinationQuery("");
    setPriceMax(150000);
    setMinRating(0);
    setOnlyFreeCancellation(false);
    setSortBy("recommended");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Search Controls Bar */}
      <section className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Destination Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={destinationQuery}
              onChange={(e) => setDestinationQuery(e.target.value)}
              placeholder="Search tour destination or valley (e.g. Hunza, Skardu, Swat, Kumrat)..."
              className="w-full pl-12 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:bg-white transition"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
              showAdvancedFilters
                ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in">
            {/* Price Filter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Max Budget</span>
                <span className="text-brand-emerald font-extrabold">PKR {priceMax.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={200000}
                step={5000}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>

            {/* Minimum Rating */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:outline-none"
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>★ 4.5 &amp; above (Top Rated)</option>
                <option value={4.8}>★ 4.8 &amp; above (Superb)</option>
              </select>
            </div>

            {/* Cancellation */}
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="free-canc"
                checked={onlyFreeCancellation}
                onChange={(e) => setOnlyFreeCancellation(e.target.checked)}
                className="w-4 h-4 rounded text-brand-emerald focus:ring-brand-emerald accent-brand-emerald cursor-pointer"
              />
              <label htmlFor="free-canc" className="text-xs font-bold text-slate-700 cursor-pointer">
                Free Cancellation Only
              </label>
            </div>

            {/* Reset */}
            <div className="flex items-center justify-end pt-2">
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 p-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
        <div>
          <span>Showing </span>
          <span className="text-slate-900 font-extrabold">{filteredListings.length}</span>
          <span> tour packages across Pakistan</span>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-normal">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated (★)</option>
          </select>
        </div>
      </div>

      {/* Grid of Results */}
      <main>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-200/70 animate-pulse" />
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="space-y-8">
            <div className="p-8 text-center rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3 max-w-xl mx-auto">
              <Compass className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No active tour packages found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No problem! You can custom-plan your guided northern tour with our local operator network below.
              </p>
              {destinationQuery && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Clear Search Filters
                </button>
              )}
            </div>

            <CustomTripEnquiryForm
              initialDestination={destinationQuery ? destinationQuery : "Hunza Valley & Attabad"}
              title="Request a Custom Northern Pakistan Tour"
              subtitle="Tell us where you want to go. Our team and verified local tour operators will custom-design your itinerary with direct pricing."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <article
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={item.photos[0]}
                      alt={`${item.title} in ${item.city}, ${item.province}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Type Badge */}
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Compass className="w-3 h-3 text-orange-500" />
                      <span>Tour Package</span>
                    </span>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => toggleWishlist(item.id, e)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition ${
                        wishlist.includes(item.id)
                          ? "bg-red-500 text-white"
                          : "bg-black/30 hover:bg-black/50 text-white"
                      }`}
                      aria-label="Save to Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(item.id) ? "fill-white" : ""
                        }`}
                      />
                    </button>

                    {/* Rating Pill */}
                    <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.avgRating}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-brand-emerald" />
                      <span>{item.destinationName} · {item.city}</span>
                    </div>

                    <h2 className="font-extrabold text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-emerald transition">
                      <Link href={`/listing/${item.slug}`}>{item.title}</Link>
                    </h2>

                    {item.duration && (
                      <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span>{item.duration}</span>
                      </p>
                    )}

                    {/* Amenities pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(item.amenities || []).slice(0, 3).map((amenity, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md"
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
                </div>

                {/* Pricing and Action CTA */}
                <div className="p-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Per Traveler (Twin Share)
                    </span>
                    <p className="text-lg font-extrabold text-slate-900 leading-tight">
                      PKR {item.basePrice.toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={`/listing/${item.slug}`}
                    className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition shadow-md shadow-orange-500/20 flex items-center gap-1.5 group-hover:scale-105"
                  >
                    <span>Book Tour</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export function SearchClientView({ initialListings }: SearchClientViewProps) {
  return (
    <Suspense fallback={<div className="min-h-screen p-12 text-center text-xs text-slate-400">Loading tour packages across Pakistan...</div>}>
      <SearchContent initialListings={initialListings} />
    </Suspense>
  );
}
