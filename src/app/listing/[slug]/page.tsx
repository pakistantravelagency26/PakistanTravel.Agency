"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  Loader2
} from "lucide-react";
import { ListingData } from "@/services/listing.service";
import { isVendorEnabled } from "@/services/vendor.service";
import { WriteReviewModal } from "@/components/reviews/WriteReviewModal";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);

  const [activePhoto, setActivePhoto] = useState(0);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [checkInDate, setCheckInDate] = useState("2026-11-10");
  const [checkOutDate, setCheckOutDate] = useState("2026-11-13");
  const [isSaved, setIsSaved] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/listings?id=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.listing) {
          setListing(data.listing);
          if (data.listing.units?.[0]?.id) {
            setSelectedUnitId(data.listing.units[0].id);
          }
          if (Array.isArray(data.listing.reviews)) {
            setReviewsList(data.listing.reviews);
          }
        }
      })
      .catch((err) => console.error("Error loading listing details:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-emerald mb-2" />
        <p className="text-sm text-slate-500 font-medium">Loading tour details...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Tour Listing Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          This experience is either undergoing moderation or is currently inactive.
        </p>
        <Link href="/" className="px-5 py-2.5 bg-brand-emerald text-white font-bold rounded-xl text-sm">
          Browse Verified Tours
        </Link>
      </div>
    );
  }

  const isListingActive = isVendorEnabled(listing?.vendor?.id);

  // Schema.org Structured Data JSON-LD for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": listing.type === "HOTEL" ? "Hotel" : "TouristTrip",
    name: listing.title,
    description: listing.description,
    image: listing.photos,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.province,
      addressCountry: "PK",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: listing.avgRating,
      reviewCount: listing.totalReviews,
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price: listing.basePrice,
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
    },
  };

  const isTour = listing.type === "TOUR" || listing.type === "ACTIVITY";
  const selectedUnit = listing.units.find((u) => u.id === selectedUnitId) || listing.units[0];
  const nightsCount = 3; // Demo nights duration for hotels
  const unitPrice = selectedUnit ? selectedUnit.basePrice : listing.basePrice;
  const totalPrice = isTour ? unitPrice * selectedQuantity : unitPrice * nightsCount * selectedQuantity;

  function handleReserve() {
    if (!listing) return;
    router.push(
      `/checkout/${listing.id}?unitId=${selectedUnit?.id || ""}&qty=${selectedQuantity}&start=${checkInDate}&end=${checkOutDate}`
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-emerald">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/search" className="hover:text-brand-emerald">Pakistan</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/search?destination=${listing.destinationSlug}`} className="hover:text-brand-emerald">
            {listing.destinationName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800 truncate">{listing.title}</span>
        </div>
      </div>

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
            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-brand-emerald shrink-0" />
              <span>{listing.address}, {listing.city}, {listing.province}</span>
              <span className="text-brand-emerald font-semibold hover:underline cursor-pointer ml-1">
                — Show on map
              </span>
            </p>
          </div>

          {/* Action buttons & Quick Price */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm ${
                isSaved ? "text-red-500 border-red-200 bg-red-50" : "text-slate-600"
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-red-500" : ""}`} />
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-sm"
              title="Share Listing"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <a
              href="#booking-table"
              className="px-6 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white font-bold text-sm transition shadow-md flex items-center gap-2"
            >
              <span>{isTour ? "Book Tour" : "Reserve Room"}</span>
            </a>
          </div>
        </div>

        {/* High Impact Photo Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden shadow-md">
          {/* Main Large Photo */}
          <div className="md:col-span-2 h-72 sm:h-96 relative group cursor-pointer">
            <img
              src={listing.photos[activePhoto] || listing.photos[0]}
              alt={listing.title}
              className="w-full h-full object-cover transition duration-300"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-md backdrop-blur-sm">
              Photo {activePhoto + 1} of {listing.photos.length}
            </div>
          </div>

          {/* Secondary Thumbnail Grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3 h-72 sm:h-96">
            {listing.photos.slice(0, 4).map((photo, index) => (
              <div
                key={index}
                onClick={() => setActivePhoto(index)}
                className={`relative h-full overflow-hidden cursor-pointer rounded-lg border-2 transition ${
                  activePhoto === index ? "border-brand-emerald" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Subnav Bar */}
        <div className="sticky top-20 z-40 bg-white border-y border-slate-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 shadow-sm flex gap-6 overflow-x-auto text-xs font-bold text-slate-600">
          <a href="#overview" className="hover:text-brand-emerald transition whitespace-nowrap">Overview</a>
          <a href="#booking-table" className="text-brand-emerald transition whitespace-nowrap">
            {isTour ? "Tour Packages & Seats" : "Rooms & Pricing"}
          </a>
          <a href="#amenities" className="hover:text-brand-emerald transition whitespace-nowrap">
            {isTour ? "Inclusions & Perks" : "Facilities & Amenities"}
          </a>
          <a href="#policies" className="hover:text-brand-emerald transition whitespace-nowrap">
            {isTour ? "Schedule & Guidelines" : "House Rules & Policies"}
          </a>
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
              <p className="text-sm text-slate-600 leading-relaxed">
                {listing.description}
              </p>

              {/* Northern Pakistan Specific Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>24/7 Power Backup</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{isTour ? "Campfire Nights" : "Heated Rooms"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Wifi className="w-4 h-4 text-sky-500" />
                  <span>High Speed WiFi</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Coffee className="w-4 h-4 text-emerald-600" />
                  <span>Free Breakfast</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Verified Partner</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{isTour ? "Guided Schedule" : "24hr Front Desk"}</span>
                </div>
              </div>
            </section>

            {/* Room / Unit Selection Table */}
            <section id="booking-table" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {isTour ? "Available Tour Packages & Seat Tiers" : "Available Rooms & Packages"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isTour
                      ? "Prices are per person / traveler including verified mountain transport and stays"
                      : `Prices are per room for ${nightsCount} nights including Pakistani taxes`}
                  </p>
                </div>
                <span className="text-xs font-semibold text-brand-emerald bg-brand-emeraldLight px-3 py-1 rounded-full">
                  {isTour ? "Guaranteed Departures" : "Real-time Availability"}
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
                          <h3 className="font-bold text-base text-slate-900">{unit.title}</h3>
                          <p className="text-xs text-slate-500">{unit.description}</p>
                          <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-400" /> 
                            {isTour 
                              ? `Capacity: ${unit.maxGuests} Travelers / Seats · ${unit.bedType}` 
                              : `Max Guests: ${unit.maxGuests} Adults · ${unit.bedType}`}
                          </p>
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
                            <span className="text-[11px] text-green-700 font-semibold block">
                              Free cancellation before trip
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
                              {isCurrent
                                ? (isTour ? "Selected Package" : "Selected Room")
                                : (isTour ? "Choose this Package" : "Choose this Room")}
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
              <h2 className="text-lg font-bold text-slate-900">Facilities & Services</h2>
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
                      {isTour ? "Tour Schedule & Timings" : "Check-in / Check-out"}
                    </span>
                    {isTour ? (
                      <>
                        <p>Assembly Time: 06:00 AM sharp</p>
                        <p>Departure: 06:30 AM from pickup terminal</p>
                      </>
                    ) : (
                      <>
                        <p>Check-in: 02:00 PM</p>
                        <p>Check-out: 12:00 PM (Noon)</p>
                      </>
                    )}
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 block mb-1">Cancellation Guarantee</span>
                    <p>{listing.cancellationPolicy}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Verified Reviews */}
            <section id="reviews" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Verified Guest Reviews</h2>
                  <p className="text-xs text-slate-500">Only guests who booked and stayed can leave reviews</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Write a Review</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-emerald text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {listing.avgRating}
                    </div>
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-slate-800 block">Exceptional</span>
                      <span className="text-[11px] text-slate-400">{listing.totalReviews} verified</span>
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
                  {isTour ? "Tour Booking Summary" : "Total Stay Estimate"}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xs font-bold text-slate-700">PKR</span>
                  <span className="text-3xl font-extrabold text-slate-900">
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {isTour
                    ? `For ${selectedQuantity} ${selectedQuantity > 1 ? "Travelers / Seats" : "Traveler / Seat"} · All taxes included`
                    : `For ${nightsCount} nights · ${selectedQuantity} ${selectedQuantity > 1 ? "rooms" : "room"} (Taxes included)`}
                </p>
              </div>

              {/* Date pickers simulation */}
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      {isTour ? "Tour Start Date" : "Check-in"}
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      {isTour ? "Tour End Date" : "Check-out"}
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">
                    {isTour ? "Travelers / Seats" : "Quantity"}
                  </span>
                  <select
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    className="font-bold text-slate-800 bg-transparent focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {isTour ? (num > 1 ? "Travelers" : "Traveler") : (num > 1 ? "Rooms" : "Room")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                onClick={handleReserve}
                className="w-full py-3.5 bg-brand-emerald hover:bg-brand-emeraldDark text-white font-bold text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>{isTour ? "Book Tour Now" : "Reserve Room Now"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <p className="flex items-center gap-1.5 text-green-700 font-medium">
                  <Check className="w-3.5 h-3.5" /> No instant charge: Pay online or Cash on arrival
                </p>
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" /> 
                  {isTour ? "Guaranteed seat reservation & trip voucher" : "Guaranteed booking confirmation voucher"}
                </p>
              </div>
            </div>

            {/* Vendor Profile Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Host & Operator</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-emeraldLight text-brand-emerald flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{listing.vendor.businessName}</h4>
                  <p className="text-[11px] text-slate-500">
                    Partner since {listing.vendor.joinedYear} · ★ {listing.vendor.rating} Rating
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Licensed tourism partner adhering to Pakistan Department of Tourist Services standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <WriteReviewModal
        listingTitle={listing.title}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitSuccess={(newReview) => setReviewsList([newReview, ...reviewsList])}
      />
    </div>
  );
}
