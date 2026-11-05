"use client";

import Link from "next/link";
import { Heart, MapPin, Star, Trash2 } from "lucide-react";
import { MOCK_LISTINGS } from "@/services/listing.service";

export default function WishlistPage() {
  const savedListings = MOCK_LISTINGS.slice(0, 3);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Wishlist</h1>
          <p className="text-xs text-slate-500 mt-1">
            Properties and northern tours you saved for later
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedListings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-44">
                <img
                  src={item.photos[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-brand-emerald text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {item.destinationName}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.city}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Starting from</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      PKR {item.basePrice.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    href={`/listing/${item.slug}`}
                    className="px-3.5 py-1.5 rounded-lg bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
