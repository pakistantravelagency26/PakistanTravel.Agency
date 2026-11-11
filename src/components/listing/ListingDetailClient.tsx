"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Check, 
  Heart, 
  Share2, 
  Calendar, 
  Users, 
  Coffee, 
  Wifi, 
  Zap, 
  Flame, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Building,
  ArrowRight,
  MessageSquarePlus,
  Lock,
  Image as ImageIcon,
  FileText,
  ShieldAlert,
  MessageCircle,
  Phone
} from "lucide-react";
import type { ListingData } from "@/services/listing.service";
import { WriteReviewModal } from "@/components/reviews/WriteReviewModal";
import { AskOperatorModal } from "./AskOperatorModal";

interface ListingDetailClientProps {
  listing: ListingData;
}

function formatUnitTitle(title: string) {
  const lower = (title || "").toLowerCase();
  if (lower.includes("couple") || lower.includes("master") || lower.includes("private room")) {
    return "Private Room";
  }
  if (lower.includes("per person") || lower.includes("twin") || lower.includes("sharing") || lower.includes("standard")) {
    return "Sharing Room";
  }
  if (lower.includes("solo") || lower.includes("single")) {
    return "Solo Room";
  }
  return title;
}

export function ListingDetailClient({ listing }: ListingDetailClientProps) {
  const router = useRouter();

  const [activePhoto, setActivePhoto] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(listing.units?.[0]?.id || "");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [checkInDate, setCheckInDate] = useState("2026-11-15");
  const [checkOutDate, setCheckOutDate] = useState("2026-11-21");
  const [isSaved, setIsSaved] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAskOperatorOpen, setIsAskOperatorOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState<any[]>(listing.reviews || []);
  const [isReviewEligible, setIsReviewEligible] = useState(false);

  const isTour = listing.type === "TOUR" || listing.type === "ACTIVITY";
  const selectedUnit = listing.units.find((u) => u.id === selectedUnitId) || listing.units[0];
  const maxCapacity = Math.max(1, selectedUnit?.maxGuests || (isTour ? 2 : 4));
  const nightsCount = listing.durationNights || 3;
  const unitPrice = selectedUnit ? selectedUnit.basePrice : listing.basePrice;

  // Fixed Departures
  const departures = listing.departures && listing.departures.length > 0 ? listing.departures : [
    { id: "dep-1", startDate: "2026-11-15", endDate: "2026-11-21", seatsTotal: 12, seatsLeft: 8, status: "AVAILABLE" },
    { id: "dep-2", startDate: "2026-11-22", endDate: "2026-11-28", seatsTotal: 12, seatsLeft: 4, status: "AVAILABLE" },
    { id: "dep-3", startDate: "2026-11-29", endDate: "2026-12-05", seatsTotal: 12, seatsLeft: 11, status: "AVAILABLE" },
    { id: "dep-4", startDate: "2026-12-06", endDate: "2026-12-12", seatsTotal: 12, seatsLeft: 12, status: "AVAILABLE" },
  ];
  const [selectedDepartureId, setSelectedDepartureId] = useState<string>(departures[0]?.id || "");
  const selectedDeparture = departures.find((d) => d.id === selectedDepartureId) || departures[0];

  // Auto-calculated Dates (Tour End Date is strictly read-only derived)
  const effectiveStartDate = isTour ? selectedDeparture?.startDate || checkInDate : checkInDate;
  const effectiveEndDate = isTour
    ? selectedDeparture?.endDate || (function() {
        const start = new Date(checkInDate);
        start.setDate(start.getDate() + (listing.durationDays || 4) - 1);
        return start.toISOString().split("T")[0];
      })()
    : checkOutDate;

  // Solo Traveler Single Supplement
  const isSingleTraveler = selectedQuantity === 1 && isTour;
  const singleSupplementRate = listing.singleSupplement || Math.round(unitPrice * 0.35);
  const [isSoloSupplementApplied, setIsSoloSupplementApplied] = useState(true);
  const activeSupplement = isSingleTraveler && isSoloSupplementApplied ? singleSupplementRate : 0;

  // Pricing Calculation
  const baseTravelerPrice = isTour ? unitPrice * selectedQuantity : unitPrice * nightsCount * selectedQuantity;

  const totalPrice = baseTravelerPrice;
  const depositPercent = listing.depositPercent || 25;
  const depositAmount = Math.round((totalPrice * depositPercent) / 100);
  const balanceDue = totalPrice - depositAmount;

  useEffect(() => {
    fetch(`/api/bookings/eligible-review?listingId=${listing.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.eligible) {
          setIsReviewEligible(true);
        }
      })
      .catch(() => {});
  }, [listing.id]);

  function handleReserve() {
    if (!listing) return;
    router.push(
      `/checkout/${listing.id}?unitId=${selectedUnit?.id || ""}&depId=${selectedDeparture?.id || ""}&qty=${selectedQuantity}&isSolo=${isSingleTraveler && isSoloSupplementApplied ? "1" : "0"}&start=${effectiveStartDate}&end=${effectiveEndDate}`
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-emerald">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/destinations" className="hover:text-brand-emerald">Destinations</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/destinations/${listing.destinationSlug || "hunza"}`} className="hover:text-brand-emerald">
            {listing.destinationName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800 truncate">{listing.title}</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {listing.badge && (
                <span className="bg-brand-emeraldLight text-brand-emerald font-bold text-xs px-2.5 py-0.5 rounded">
                  {listing.badge}
                </span>
              )}
              <div className="flex items-center text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {listing.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 mt-2">
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-md">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                {listing.duration || (isTour ? `${listing.durationDays || 1} Days / ${listing.durationNights || 0} Nights` : "Per Night Stay")}
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-emerald shrink-0" />
                <span>{listing.address}, {listing.city}, {listing.province}</span>
              </span>
            </div>
          </div>

          {/* Action buttons & Quick Price */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm ${
                isSaved ? "text-red-500 border-red-200 bg-red-50" : "text-slate-600"
              }`}
              title="Save to Wishlist"
              aria-label="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-red-500" : ""}`} />
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-sm"
              title="Share Listing"
              aria-label="Share Listing"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <a
              href="#booking-table"
              className="px-6 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white font-bold text-sm transition shadow-md flex items-center gap-2"
            >
              <span>Book Tour Package</span>
            </a>
          </div>
        </div>

        {/* High Impact Photo Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden shadow-md">
          {/* Main Large Photo */}
          <div 
            onClick={() => setIsGalleryOpen(true)}
            className="md:col-span-2 h-72 sm:h-96 relative group cursor-pointer overflow-hidden bg-slate-100"
          >
            <Image
              src={listing.photos[activePhoto] || listing.photos[0]}
              alt={`${listing.title} Main Gallery View`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-300 group-hover:scale-102"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo {activePhoto + 1} of {listing.photos.length} · Click to expand</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsGalleryOpen(true);
              }}
              aria-label={`View all ${listing.photos.length} photos`}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition"
            >
              View All {listing.photos.length} Photos
            </button>
          </div>

          {/* Secondary Thumbnail Grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3 h-72 sm:h-96">
            {listing.photos.slice(0, 4).map((photo, index) => (
              <div
                key={index}
                onClick={() => setActivePhoto(index)}
                className={`relative h-full overflow-hidden cursor-pointer rounded-lg border-2 transition bg-slate-100 ${
                  activePhoto === index ? "border-brand-emerald" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <Image 
                  src={photo} 
                  alt={`${listing.title} Preview ${index + 1}`} 
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  loading="lazy"
                  className="object-cover" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Subnav Bar */}
        <div className="sticky top-20 z-40 bg-white border-y border-slate-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 shadow-sm flex gap-6 overflow-x-auto text-xs font-bold text-slate-600">
          <a href="#overview" className="hover:text-brand-emerald transition whitespace-nowrap">Overview</a>
          <a href="#booking-table" className="text-brand-emerald transition whitespace-nowrap">
            Tour Packages &amp; Seats
          </a>
          <a href="#amenities" className="hover:text-brand-emerald transition whitespace-nowrap">
            Inclusions &amp; Perks
          </a>
          <a href="#policies" className="hover:text-brand-emerald transition whitespace-nowrap">
            Schedule &amp; Guidelines
          </a>
          <a href="#safety" className="hover:text-brand-emerald transition whitespace-nowrap">Permits &amp; Safety</a>
          <a href="#reviews" className="hover:text-brand-emerald transition whitespace-nowrap">Guest Reviews ({listing.totalReviews})</a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview & Key Highlights */}
            <section id="overview" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                {isTour ? "About this Tour & Itinerary" : "About this Property"}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>

              {/* Data-Driven Tour & Property Inclusions */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
                {(listing.amenities && listing.amenities.length > 0 ? listing.amenities : [
                  "Included Transportation",
                  "Licensed Local Guide",
                  "Confirmed Accommodations",
                  "Daily Breakfast Included"
                ]).slice(0, 6).map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Tour Package / Seat Tier Selection Table */}
            <section id="booking-table" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Available Tour Packages &amp; Seat Tiers
                  </h2>
                  <p className="text-xs text-slate-500">
                    Prices are per person / traveler including mountain transport, activities, and hotel stays
                  </p>
                </div>
                <span className="text-xs font-semibold text-brand-emerald bg-brand-emeraldLight px-3 py-1 rounded-full">
                  Scheduled Departures
                </span>
              </div>

              {/* Unit Cards / Table Rows */}
              <div className="space-y-4">
                {listing.units.map((unit) => {
                  const isCurrent = selectedUnitId === unit.id;
                  return (
                    <div
                      key={unit.id}
                      className={`p-5 rounded-xl border-2 transition ${
                        isCurrent
                          ? "border-brand-emerald bg-emerald-50/20 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-5">
                        {/* Unit Details */}
                        <div className="space-y-2 flex-1">
                          <h3 className="font-bold text-base text-slate-900">{formatUnitTitle(unit.title)}</h3>
                          <p className="text-xs text-slate-500">{unit.description}</p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {unit.amenities.map((a) => (
                              <span key={a} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                                ✓ {a}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Pricing and Selector */}
                        <div className="shrink-0 flex flex-col justify-between items-start md:items-end text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                              {isTour ? "Price per traveler" : "Price per night"}
                            </span>
                            <p className="text-xl font-extrabold text-slate-900">
                              PKR {unit.basePrice.toLocaleString()}
                            </p>
                            <span className="text-[11px] text-green-700 font-semibold block max-w-xs">
                              {listing.cancellationPolicy}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => setSelectedUnitId(unit.id)}
                              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                                isCurrent
                                  ? "bg-brand-emerald text-white shadow-sm"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              }`}
                            >
                              {isCurrent ? "Selected Package" : "Choose this Package"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Property Facilities & Amenities */}
            <section id="amenities" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Facilities &amp; Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                {listing.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* House Rules & Mountain Advisory */}
            <section id="policies" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                {isTour ? "Tour Itinerary Guidelines & Rules" : "Property Policies & Northern Travel Advisory"}
              </h2>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <span className="font-bold block">
                      {isTour ? "High-Altitude Travel Advisory" : "Northern Areas Power & Weather Advisory"}
                    </span>
                    {isTour
                      ? "High-altitude weather changes swiftly. Please carry thermal layers, trekking shoes, and government CNIC/Passport at security checkpoints."
                      : "During peak winter/autumn periods in Gilgit-Baltistan, load shedding can occur. This property maintains heavy diesel generators operating during scheduled evening hours."}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 block mb-1">
                      Tour Schedule &amp; Timings
                    </span>
                    <p>Assembly Time: 06:00 AM sharp</p>
                    <p>Departure: 06:30 AM from pickup terminal</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 block mb-1">Cancellation Guarantee</span>
                    <p>{listing.cancellationPolicy}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Permits, NOC & High-Altitude Safety Guidelines */}
            <section id="safety" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Northern Areas Permits, NOC &amp; Safety Guidelines
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Pakistani Citizens Documentation
                  </span>
                  <p className="leading-relaxed">
                    Original Computerized National Identity Cards (CNIC) must be carried by all adult passengers. Mandatory verification occurs at Babusar Top, Diamer, and Gilgit military checkpoints.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Foreign Nationals &amp; Non-PK Passports
                  </span>
                  <p className="leading-relaxed">
                    Foreign tourists can freely visit Hunza, Skardu, and Swat with a valid Pakistan tourist visa. Restricted border areas (e.g. sensitive sections of Khunjerab Pass or military forward zones) may require an advance Non-Objection Certificate (NOC) from the Ministry of Interior.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    Altitude Sickness (AMS) &amp; Acclimatization
                  </span>
                  <p className="leading-relaxed">
                    For excursions above 3,000m (Deosai, Khunjerab, Babusar), ascend gradually, drink 3–4 liters of water daily, and avoid heavy alcohol or tobacco. In case of persistent dizziness or headache, descend immediately.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-600" />
                    Mountain Pass Timings &amp; Road Safety
                  </span>
                  <p className="leading-relaxed">
                    Babusar Pass road operates strictly between 05:00 AM and 05:00 PM in summer for passenger safety. During late autumn and winter, vehicles must carry snow chains. For route clearances, consult the local district tourist police before departure.
                  </p>
                </div>
              </div>
            </section>

            {/* Guest Reviews */}
            <section id="reviews" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Guest Reviews</h2>
                  <p className="text-xs text-slate-500">Only guests who booked and experienced this can leave reviews</p>
                </div>
                <div className="flex items-center gap-3">
                  {isReviewEligible ? (
                    <button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                      <span>Write a Review</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reviews open to travelers with completed bookings</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-emerald text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {listing.avgRating}
                    </div>
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-slate-800 block">Exceptional</span>
                      <span className="text-[11px] text-slate-400">{listing.totalReviews} reviews</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Cards */}
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                        <span className="text-[11px] text-slate-400 block">{rev.userCity} · {rev.date}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 italic">&ldquo;{rev.comment}&rdquo;</p>
                    {rev.vendorReply && (
                      <div className="mt-2 pl-3 border-l-2 border-brand-emerald text-xs text-slate-600 bg-white p-2 rounded-r">
                        <span className="font-bold text-brand-emerald block text-[11px]">Partner Response:</span>
                        {rev.vendorReply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Booking Card & Vendor Profile */}
          <div className="space-y-6">
            {/* Sticky Reservation Summary Box */}
            <div className="sticky top-36 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  Tour Booking Summary
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xs font-bold text-slate-700">PKR</span>
                  <span className="text-3xl font-extrabold text-slate-900">
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Total for {selectedQuantity} {selectedQuantity > 1 ? "Travelers" : "Traveler"} · {selectedUnit ? formatUnitTitle(selectedUnit.title) : "Tour Package"}
                </p>
              </div>

              {/* Tour Fixed Departures & Auto-calculated Date */}
              <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Select Fixed Departure Date *
                    </label>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                      {departures.map((d) => {
                        const isCurrent = selectedDepartureId === d.id;
                        const isSoldOut = d.seatsLeft <= 0;
                        return (
                          <div
                            key={d.id}
                            onClick={() => !isSoldOut && setSelectedDepartureId(d.id)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                              isCurrent
                                ? "border-brand-emerald bg-emerald-50/50 shadow-sm"
                                : isSoldOut
                                ? "border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-brand-emerald" />
                                <span>{d.startDate} → {d.endDate}</span>
                              </div>
                              <span className="text-[10px] text-slate-500">
                                {listing.duration || `${listing.durationDays || 7} Days`}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                isSoldOut
                                  ? "bg-red-100 text-red-700"
                                  : d.seatsLeft <= 4
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {isSoldOut ? "Sold Out" : `${d.seatsLeft} seats left`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Auto-calculated End Date (Read-Only) */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase">
                        Start Date
                      </span>
                      <span className="font-bold text-slate-800">{effectiveStartDate}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-100">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        End Date (Read-only)
                      </span>
                      <span className="font-bold text-slate-700">{effectiveEndDate}</span>
                    </div>
                  </div>
                </div>

                            {/* Number of Travelers (کتنے افراد ہیں) */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-900 font-extrabold block text-xs">
                      کتنے لوگ ہیں؟ (Number of Travelers)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {selectedUnit ? formatUnitTitle(selectedUnit.title) : "Tour Package"} کے لیے افراد منتخب کریں
                    </span>
                  </div>
                  <span className="text-xs font-bold text-brand-emerald bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {selectedQuantity} {selectedQuantity > 1 ? "Persons" : "Person"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-extrabold text-slate-700 hover:bg-slate-100 flex items-center justify-center text-base shadow-sm"
                      title="Decrease travelers"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-black text-slate-900 text-base">
                      {selectedQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-extrabold text-slate-700 hover:bg-slate-100 flex items-center justify-center text-base shadow-sm"
                      title="Increase travelers"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setSelectedQuantity(n)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                          selectedQuantity === n
                            ? "bg-brand-emerald text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Itemized Price Breakdown */}
              <div className="space-y-1 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Base Rate ({selectedQuantity} {selectedQuantity > 1 ? "Travelers" : "Traveler"}):</span>
                  <span>PKR {baseTravelerPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Total Package Price:</span>
                  <span>PKR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Online Deposit Due ({depositPercent}%):</span>
                  <span className="font-bold text-emerald-800">PKR {depositAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Balance Due on Arrival:</span>
                  <span className="font-bold text-slate-700">PKR {balanceDue.toLocaleString()}</span>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                onClick={handleReserve}
                className="w-full py-3.5 bg-brand-emerald hover:bg-brand-emeraldDark text-white font-bold text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>Book Tour Package Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <p className="flex items-center gap-1.5 text-green-700 font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" /> {listing.cancellationPolicy}
                </p>
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald shrink-0" /> 
                  Guaranteed seat reservation &amp; official tour voucher
                </p>
              </div>
            </div>

            {/* Vendor Profile Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Host &amp; Operator</h3>
                <span className="text-[10px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  Independent Host
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-brand-emerald flex items-center justify-center font-bold">
                  <Building className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{listing.vendor.businessName}</h4>
                  <p className="text-[11px] text-slate-500">
                    Partner since {listing.vendor.joinedYear} · ★ {listing.vendor.rating} Rating
                  </p>
                </div>
              </div>

              {/* Operator Credentials (submitted by operator) */}
              {(listing.vendor.licenseNumber || listing.vendor.registrationNumber) && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 block font-medium">Provided by operator (not certified by platform):</span>
                  {listing.vendor.licenseNumber && (
                    <div className="flex justify-between text-slate-600">
                      <span className="text-[11px] text-slate-500">License Reference:</span>
                      <span className="font-mono font-bold text-slate-800">{listing.vendor.licenseNumber}</span>
                    </div>
                  )}
                  {listing.vendor.registrationNumber && (
                    <div className="flex justify-between text-slate-600">
                      <span className="text-[11px] text-slate-500">Registration:</span>
                      <span className="font-mono font-bold text-slate-800">{listing.vendor.registrationNumber}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-1 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200/60 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Typically responds within 2 hours</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAskOperatorOpen(true)}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Ask the Operator</span>
                </button>

                <p className="text-[10px] text-slate-400 flex items-center gap-1 leading-tight">
                  <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Direct phone &amp; WhatsApp released upon booking confirmation</span>
                </p>

                <Link
                  href="/partner-info"
                  className="text-xs text-sky-600 hover:text-sky-700 font-bold hover:underline flex items-center gap-1 pt-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Partner Information &amp; Guidelines →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ask the Operator Relay Message Modal */}
      <AskOperatorModal
        isOpen={isAskOperatorOpen}
        onClose={() => setIsAskOperatorOpen(false)}
        listingId={listing.id}
        listingTitle={listing.title}
        vendorId={listing.vendor.id}
        operatorName={listing.vendor.businessName}
      />

      {/* Review Modal */}
      <WriteReviewModal
        listingId={listing.id}
        listingTitle={listing.title}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitSuccess={(newReview) => setReviewsList([newReview, ...reviewsList])}
      />

      {/* Unlimited Gallery Photos Lightbox Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in">
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div>
              <h3 className="font-bold text-base truncate max-w-lg">{listing.title}</h3>
              <span className="text-xs text-slate-400">Photo {activePhoto + 1} of {listing.photos.length}</span>
            </div>
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
            >
              ✕ Close Gallery
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={listing.photos[activePhoto]}
              alt={`Photo ${activePhoto + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {listing.photos.length > 1 && (
              <>
                <button
                  onClick={() => setActivePhoto((prev) => (prev > 0 ? prev - 1 : listing.photos.length - 1))}
                  className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white text-lg font-bold"
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  onClick={() => setActivePhoto((prev) => (prev < listing.photos.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white text-lg font-bold"
                  aria-label="Next photo"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2 overflow-x-auto py-2 justify-center scrollbar-none">
            {listing.photos.map((p, idx) => (
              <img
                key={idx}
                src={p}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setActivePhoto(idx)}
                className={`w-14 h-14 object-cover rounded-lg cursor-pointer border-2 transition ${
                  activePhoto === idx ? "border-emerald-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
