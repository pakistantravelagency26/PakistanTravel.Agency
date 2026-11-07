"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Compass, 
  Building2, 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  Search, 
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Users,
  Heart
} from "lucide-react";
import { ListingData } from "@/services/listing.service";
import type { MarketplaceSectionSettings } from "@/services/siteSettings.service";

interface Props {
  initialListings: ListingData[];
  customSettings?: MarketplaceSectionSettings;
}

export function TourMarketplaceSection({ initialListings, customSettings }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => {
    const tourCount = initialListings.filter(l => l.type === "TOUR").length;
    const hotelCount = initialListings.filter(l => l.type === "HOTEL").length;

    const destinationNames: Record<string, string> = {
      hunza: "Hunza Valley",
      skardu: "Skardu & Deosai",
      swat: "Swat & Kalam",
      kumrat: "Kumrat Valley & Dir",
      neelum: "Neelum Valley",
      gwadar: "Gwadar & Makran",
    };

    const destMap = new Map<string, { label: string; count: number }>();
    initialListings.forEach((item) => {
      const slug = item.destinationSlug || "other";
      const label = destinationNames[slug] || item.destinationName || slug;
      const cur = destMap.get(slug);
      if (cur) {
        cur.count += 1;
      } else {
        destMap.set(slug, { label, count: 1 });
      }
    });

    const list = [
      { id: "ALL", label: "All Experiences", count: initialListings.length },
      ...(tourCount > 0 ? [{ id: "TOUR", label: "Tour Packages", count: tourCount }] : []),
      ...(hotelCount > 0 ? [{ id: "HOTEL", label: "Hotels & Stays", count: hotelCount }] : []),
    ];

    destMap.forEach((val, slug) => {
      list.push({ id: slug, label: val.label, count: val.count });
    });

    return list.filter((cat) => cat.count > 0);
  }, [initialListings]);

  const filteredListings = useMemo(() => {
    return initialListings.filter((item) => {
      // Category filter
      let matchCat = true;
      if (selectedCategory === "TOUR") {
        matchCat = item.type === "TOUR";
      } else if (selectedCategory === "HOTEL") {
        matchCat = item.type === "HOTEL";
      } else if (selectedCategory !== "ALL") {
        matchCat = item.destinationSlug === selectedCategory || item.city.toLowerCase().includes(selectedCategory);
      }

      // Text search filter
      let matchQuery = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        matchQuery = 
          item.title.toLowerCase().includes(q) ||
          item.destinationName.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.vendor.businessName.toLowerCase().includes(q);
      }

      return matchCat && matchQuery;
    });
  }, [initialListings, selectedCategory, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/70 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>{customSettings?.badgeText || "Multi-Vendor Tourism Marketplace"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {customSettings?.title || "Explore Northern Tours & Luxury Stays"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {customSettings?.subtitle || "Compare tour packages and mountain resorts from verified local operators across Pakistan"}
          </p>
        </div>

        {/* Search input inside section */}
        <div className="relative min-w-[260px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tours, hotels or vendors..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Interactive Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 shrink-0 mr-1 hidden sm:flex">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/80"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-500"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4 Tours/Hotels per row Grid */}
      {initialListings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {customSettings?.emptyStateTitle || "Marketplace Ready for Listings"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {customSettings?.emptyStateDesc || "Vendors and partners can log in to the Partner Hub to publish verified tours, hotels, and expeditions."}
            </p>
          </div>
          <Link
            href="/partner-hub/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            <span>Partner Login / Add Tour</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
          <p className="text-sm font-bold text-slate-700">No experiences match your filter.</p>
          <button
            onClick={() => {
              setSelectedCategory("ALL");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-sky-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.map((item) => (
            <Link
              key={item.id}
              href={`/listing/${item.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo & Turie-Style Badges */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.photos[0]}
                  alt={`${item.title} - ${item.destinationName}, ${item.province}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-108 transition duration-700 ease-out"
                />
                
                {/* Turie Top Left Discount / Status Pill */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <span className="bg-[#FD4621] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md tracking-tight">
                    {item.badge || "-20% Off"}
                  </span>
                  {item.isFeatured && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                </div>

                {/* Wishlist Heart Top Right */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      alert("Added to your wishlist!");
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#FD4621] flex items-center justify-center shadow-md transition group/btn"
                    title="Add to wishlist"
                  >
                    <Heart className="w-4 h-4 transition group-hover/btn:scale-110" />
                  </button>
                </div>

                {/* Duration or Type Bottom Left */}
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
                    {item.type === "HOTEL" ? (
                      <>
                        <Building2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Luxury Hotel</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{item.duration || "Multi-Day Tour"}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                <div className="space-y-2">
                  {/* Reviews & Star Rating */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-extrabold text-slate-900 text-xs ml-1">
                          {item.avgRating > 0 ? item.avgRating.toFixed(1) : "5.0"}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({item.totalReviews > 0 ? item.totalReviews : "08"} Reviews)
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.province}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-[#FD4621] transition line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Specifications: Location & Capacity */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold pt-0.5">
                    <span className="flex items-center gap-1 text-slate-700 truncate">
                      <MapPin className="w-3 h-3 text-[#FD4621] shrink-0" /> {item.destinationName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600 shrink-0">
                      <Users className="w-3 h-3 text-slate-400" /> 1-12 Persons
                    </span>
                  </div>

                  {/* Verified Partner Tag */}
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit font-bold border border-emerald-100/80">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.vendor.businessName}</span>
                  </div>
                </div>

                {/* Rating & Pricing Bottom Bar with Turie 'Book A Tour' CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 line-through block font-medium leading-none mb-0.5">
                      PKR {Math.round(item.basePrice * 1.25).toLocaleString()}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm sm:text-base font-black text-slate-950">
                        PKR {item.basePrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        /{item.type === "HOTEL" ? "night" : "person"}
                      </span>
                    </div>
                  </div>

                  <span className="px-3.5 py-2 rounded-xl bg-slate-900 group-hover:bg-[#FD4621] text-white text-[11px] font-extrabold transition shadow-sm flex items-center gap-1 shrink-0">
                    <span>Book Tour</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom CTA to browse more */}
      <div className="text-center pt-6">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50 font-bold text-xs shadow-sm transition"
        >
          <span>View All Pakistan Tours & Hotels Catalog</span>
          <ArrowRight className="w-4 h-4 text-orange-500" />
        </Link>
      </div>
    </section>
  );
}
