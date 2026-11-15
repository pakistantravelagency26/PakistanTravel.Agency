"use client";

import React from "react";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Check,
  X,
  Luggage,
  Navigation,
  Compass,
} from "lucide-react";
import { parseStructuredDescription } from "@/lib/structuredDescription";
import type { ListingData } from "@/services/listing.service";

interface TourStructuredDetailsProps {
  listing: ListingData;
}

export function TourStructuredDetails({ listing }: TourStructuredDetailsProps) {
  const structured = parseStructuredDescription(listing.description);

  const whatToBring = [
    "Warm thermal innerwear and fleece layers",
    "Sturdy walking or trekking shoes with good grip",
    "Windproof and waterproof outer jacket",
    "Original valid CNIC (Pakistani citizens) or Passport + Visa (Foreign tourists)",
    "High-SPF sunscreen, lip balm, and UV sunglasses",
    "Portable power bank (10,000+ mAh) and charging cables",
    "Personal prescription medications and basic first aid items",
  ];

  const standardExclusions = [
    "Personal room service, laundry, and extra telephone charges",
    "Personal insurance, emergency mountain rescue or medical evacuation",
    "Optional activities (boating fees, jet-ski, zipline, chairlift tickets)",
    "Gratuities / tips for local drivers and mountain guide staff",
  ];

  return (
    <div className="space-y-8">
      {/* 1. Overview & Summary */}
      <section id="overview" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-700" />
          <span>Tour Overview &amp; Experience</span>
        </h2>
        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {structured.summary || listing.description}
        </div>

        {/* Highlight Inclusions Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
          {listing.amenities.map((amenity, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Seasonal Mountain Route Advisory (Babusar & KKH) */}
      <section className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-amber-950 text-sm sm:text-base">
              Seasonal Mountain Route Notice: Babusar Pass &amp; KKH
            </h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              {structured.seasonalNotice ||
                "Babusar Pass (4,173m) is closed during winter and late autumn due to heavy alpine snow. Departures during this season operate strictly via the all-weather Karakoram Highway (KKH) through Hazara Motorway, Besham, and Kohistan to Chilas."}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Mandatory Travel Documents, Permits & NOC */}
      <section className="bg-sky-50/60 border border-sky-200 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-sky-950 text-sm sm:text-base">
              Identification, Permits &amp; Checkpoints
            </h3>
            <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">
              {structured.permitsNotice ||
                "Pakistani citizens must carry original valid CNIC cards. International visitors and overseas Pakistanis (NICOP) must carry original passports and Pakistan tourist visas. Physical identity registration is conducted at Diamer and Gilgit checkposts."}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Journey & Sightseeing Route */}
      {structured.route.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-sky-600" />
            <span>Tour Journey &amp; Sightseeing Route</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {structured.route.map((stop, idx) => (
              <React.Fragment key={idx}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-black">
                    {idx + 1}
                  </span>
                  <span>{stop}</span>
                </span>
                {idx < structured.route.length - 1 && (
                  <span className="text-slate-300 font-bold text-sm">➔</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

      {/* 5. Departure & Pickup Meeting Points */}
      {structured.meetingPoints.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <span>Departure &amp; Pickup Meeting Points</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {structured.meetingPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2.5"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-900 block">{point}</span>
                  <span className="text-[11px] text-slate-500">Scheduled departure pickup location</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Day-by-Day Detailed Itinerary */}
      {structured.itinerary.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <span>Day-by-Day Itinerary ({structured.itinerary.length} Days)</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {listing.duration}
            </span>
          </div>

          <div className="space-y-3.5">
            {structured.itinerary.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition space-y-2 group"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-700 text-white font-black text-xs">
                    {item.day}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">
                    {item.title}
                  </h3>
                </div>
                {item.text && item.text !== item.title && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
                    {item.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Inclusions vs Exclusions Breakdown */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-extrabold text-slate-900">
          Package Inclusions &amp; Exclusions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inclusions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>What&apos;s Included</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {listing.amenities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <X className="w-4 h-4 text-rose-600" />
              <span>What&apos;s Not Included</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {standardExclusions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 8. What to Bring / Packing Checklist */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Luggage className="w-5 h-5 text-emerald-700" />
          <span>What to Bring (Recommended Packing Checklist)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 pt-1">
          {whatToBring.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
