"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ArrowRight,
  SlidersHorizontal,
  Search,
  Compass
} from "lucide-react";
import { ListingData } from "@/services/listing.service";
import { CustomTripEnquiryForm } from "@/components/common/CustomTripEnquiryForm";

interface TourMarketplaceSectionProps {
  initialListings: ListingData[];
  customSettings?: {
    badgeText?: string;
    title?: string;
    subtitle?: string;
  };
}

export function TourMarketplaceSection({ initialListings = [], customSettings }: TourMarketplaceSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const tourListings = useMemo(() => {
    return initialListings.filter((l) => l.type === "TOUR");
  }, [initialListings]);

  const categories = useMemo(() => {
    const destinationNames: Record<string, string> = {
      hunza: "Hunza Valley",
      skardu: "Skardu & Deosai",
      swat: "Swat & Kalam",
      kumrat: "Kumrat Valley & Dir",
      neelum: "Neelum Valley",
      gwadar: "Gwadar & Makran",
    };

    const destMap = new Map<string, { label: string; count: number }>();
    tourListings.forEach((item) => {
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
      { id: "ALL", label: "All Tour Packages", count: tourListings.length },
    ];

    destMap.forEach((val, slug) => {
      list.push({ id: slug, label: val.label, count: val.count });
    });

    return list.filter((cat) => cat.count > 0);
  }, [tourListings]);

  const filteredListings = useMemo(() => {
    return tourListings.filter((item) => {
      // Category filter
      let matchCat = true;
      if (selectedCategory !== "ALL") {
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
  }, [tourListings, selectedCategory, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/70 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>{customSettings?.badgeText || "Verified Tour Operator Marketplace"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {customSettings?.title || "Explore Northern Tour Packages"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {customSettings?.subtitle || "Compare guided tour packages from independent local tour operators across Pakistan"}
          </p>
        </div>

        {/* Search input inside section */}
        <div className="relative min-w-[260px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tour packages or operators..."
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

      {/* 4 Tours per row Grid */}
      {tourListings.length === 0 ? (
        <div className="py-6">
          <CustomTripEnquiryForm
            title="Plan Your Custom Northern Pakistan Tour"
            subtitle="While seasonal operator quotas are being updated, our team and partner operators will custom-design your itinerary with direct operator pricing."
          />
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
          <p className="text-sm font-bold text-slate-700">No tour packages match your filter.</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredListings.map((item) => (
            <Link
              key={item.id}
              href={`/listing/${item.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.photos[0]}
                  alt={`${item.title} - ${item.destinationName}, ${item.province}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                
                {/* Badge Top Left */}
                {item.badge && (
                  <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}

                {/* Duration Bottom Left */}
                <span className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 text-orange-400" />
                  <span>{item.duration || "Multi-Day Tour"}</span>
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  {/* Location & Province */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-sky-600 font-semibold truncate">
                      <MapPin className="w-3 h-3 shrink-0" /> {item.destinationName}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">{item.province}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-sky-600 transition line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Verified Vendor Tag */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 pt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate font-medium text-slate-700">{item.vendor.businessName}</span>
                  </div>
                </div>

                {/* Rating & Pricing Bottom Bar */}
                <div className="pt-2.5 border-t border-slate-100 flex items-end justify-between">
                  <div className="flex items-center gap-1 text-xs">
                    <div className="bg-sky-600 text-white px-1.5 py-0.5 rounded-md text-[11px] font-extrabold shadow-sm flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                      <span>{item.avgRating}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">({item.totalReviews})</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Per Person
                    </span>
                    <p className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                      PKR {item.basePrice.toLocaleString()}
                    </p>
                  </div>
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
          <span>View All Northern Tour Packages Catalog</span>
          <ArrowRight className="w-4 h-4 text-orange-500" />
        </Link>
      </div>
    </section>
  );
}
