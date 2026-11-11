"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  MapPin, 
  DollarSign, 
  Check, 
  Image as ImageIcon, 
  ShieldCheck, 
  ArrowLeft,
  Calendar,
  Compass,
  Clock,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Loader2,
  Navigation,
  Route,
  Users,
  Heart,
  UserCheck,
  Tag,
  Car,
  Bed,
  UtensilsCrossed,
  LifeBuoy,
  Camera,
  Layers
} from "lucide-react";

export default function NewListingPage() {
  const router = useRouter();

  // 1. Tour Package Details
  const [formData, setFormData] = useState({
    title: "",
    type: "TOUR" as const,
    destinationSlug: "hunza",
    destinationName: "Hunza Valley & Attabad",
    city: "Karimabad",
    province: "Gilgit-Baltistan",
    durationDays: 5,
    durationNights: 4,
    duration: "5 Days / 4 Nights",
    basePrice: 45000, // 1. Per Person Price
    couplePrice: 95000, // 2. Couple Price
    soloPrice: 58000, // 3. Solo Traveler / Private Room Price
    singleSupplement: 13000,
    depositPercent: 25,
    unitTitle: "Sharing Room",
    maxGuests: 2,
    inventory: 12,
    freeCancellationDays: 3,
    photos: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
    description: "",
  });

  // Departure / Pickup Meeting Points (Dynamic 1 -> 2 -> 3, Max 3)
  const [pickupPoints, setPickupPoints] = useState<string[]>([
    "Islamabad: Daewoo Express Terminal (G-9) / I-8 Interchange",
  ]);

  // Route / Sightseeing Stops along Journey (e.g. Karachi -> Sukkur -> Islamabad -> Hunza)
  const [routeStops, setRouteStops] = useState<string[]>([
    "Islamabad",
    "Abbottabad",
    "Babusar Pass",
    "Chilas",
    "Rakaposhi View Point",
    "Hunza Valley",
    "Attabad Lake",
    "Khunjerab Pass",
  ]);

  // Group & Family Discount Tiers ("itny log ho gy tu itny amount bane ga")
  const [groupDiscounts, setGroupDiscounts] = useState<
    { minPersons: number; pricePerPerson: number }[]
  >([
    { minPersons: 4, pricePerPerson: 42000 },
    { minPersons: 8, pricePerPerson: 38000 },
    { minPersons: 12, pricePerPerson: 35000 },
  ]);

  // Fixed Departure Dates Schedule
  const [departures, setDepartures] = useState<
    { startDate: string; seatsTotal: number }[]
  >([
    { startDate: "2026-11-15", seatsTotal: 12 },
    { startDate: "2026-11-22", seatsTotal: 12 },
    { startDate: "2026-11-29", seatsTotal: 12 },
  ]);

  // Schedule Generator Mode
  const [scheduleMode, setScheduleMode] = useState<"weekly" | "monthly" | "manual">("weekly");
  const [selectedWeekday, setSelectedWeekday] = useState<number>(0); // 0 = Sunday
  const [weeklyDurationWeeks, setWeeklyDurationWeeks] = useState<number>(8); // 8 weeks
  const [monthlySelectedDays, setMonthlySelectedDays] = useState<number[]>([10, 20, 30]);
  const [monthlyMonthsAhead, setMonthlyMonthsAhead] = useState<number>(3);
  const [defaultBatchSeats, setDefaultBatchSeats] = useState<number>(12);

  // Inclusions & Perks
  const [amenities, setAmenities] = useState<string[]>([
    "Dedicated 4x4 Mountain Transport",
    "Certified Alpine Guide & Tour Leader",
    "Daily Continental & Desi Breakfast",
    "Nightly Dinner Buffet & BBQ Night",
    "Standard / Deluxe Hotel Night Stays",
    "First Aid Medical Kit & Emergency Support",
    "All Fuel, Road Toll Taxes & Highway Challans Included",
  ]);

  const [customPerkInput, setCustomPerkInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");
  const [error, setError] = useState("");

  // Preset Top Valleys
  const popularValleys = [
    { slug: "hunza", name: "Hunza Valley & Attabad", city: "Karimabad", province: "Gilgit-Baltistan" },
    { slug: "skardu", name: "Skardu & Deosai Plains", city: "Skardu", province: "Gilgit-Baltistan" },
    { slug: "swat", name: "Swat Valley & Kalam", city: "Kalam", province: "Khyber Pakhtunkhwa" },
    { slug: "kumrat", name: "Kumrat Valley & Jahaz Banda", city: "Thal", province: "Khyber Pakhtunkhwa" },
    { slug: "neelum", name: "Neelum Valley & Arang Kel", city: "Kutton", province: "Azad Kashmir" },
    { slug: "naran", name: "Naran & Kaghan Valley", city: "Naran", province: "Khyber Pakhtunkhwa" },
    { slug: "fairy-meadows", name: "Fairy Meadows & Nanga Parbat", city: "Raikhot Bridge", province: "Gilgit-Baltistan" },
    { slug: "chitral", name: "Chitral & Kalash Valley", city: "Chitral", province: "Khyber Pakhtunkhwa" },
    { slug: "astore", name: "Astore & Rama Meadows", city: "Astore", province: "Gilgit-Baltistan" },
    { slug: "shigar", name: "Shigar & Khaplu Fort", city: "Shigar", province: "Gilgit-Baltistan" },
    { slug: "gwadar", name: "Gwadar & Ormara Beach", city: "Gwadar", province: "Balochistan" },
  ];

  // Researched Pakistan Tour Inclusions categorized
  const categorizedInclusions = [
    {
      category: "Transport & Transit",
      icon: Car,
      perks: [
        "Luxury Grand Cabin / Saloon Coaster (AC & Heated)",
        "Dedicated 4x4 Mountain Transport",
        "4x4 Mountain Jeep Safari for Off-Road Lakes",
        "All Fuel, Road Toll Taxes & Highway Challans Included",
        "Airport & Bus Terminal Pick & Drop Service",
        "Professional High-Altitude Mountain Drivers",
      ],
    },
    {
      category: "Hotel Stays & Camping",
      icon: Bed,
      perks: [
        "Standard / Deluxe Hotel Night Stays",
        "Master Bed Room for Couples (Private Attached Bath)",
        "Electric Heated Blankets & Room Heating",
        "Alpine Camping Tents, Sleeping Bags & Mattresses",
      ],
    },
    {
      category: "Food, BBQ & Refreshments",
      icon: UtensilsCrossed,
      perks: [
        "Daily Continental & Desi Breakfast",
        "Nightly Dinner Buffet & Traditional Cuisines",
        "Live Campfire & Musical Night",
        "Special Cultural BBQ Dinner & Bonfire",
        "Pure Mineral Water & Tea on Journey",
      ],
    },
    {
      category: "Guide, Health & Safety",
      icon: LifeBuoy,
      perks: [
        "Certified Alpine Guide & Tour Leader",
        "First Aid Medical Kit & Emergency Support",
        "Emergency Portable Oxygen Cylinders",
        "24/7 Operations Room & Checkpost Clearance Support",
      ],
    },
    {
      category: "Sightseeing, Permits & Media",
      icon: Camera,
      perks: [
        "National Park Permits & Fort Entry Tickets Included",
        "High-Resolution DSLR Photography & Drone Aerial Videos",
        "River Rafting & Boating Life Jackets Included",
        "Local Dry Fruit / Cultural Souvenir Gift Hamper",
        "Dedicated Family-Friendly Seating Priority",
      ],
    },
  ];

  // Quick chips for Pickup Points
  const commonPickupChips = [
    "Islamabad: Daewoo Express Terminal (G-9)",
    "Lahore: Thokar Niaz Baig / Kalma Chowk",
    "Karachi: Cantt Railway Station / Airport",
    "Rawalpindi: Saddar Metro Station",
    "Peshawar: General Bus Stand",
    "Faisalabad: Kohistan Express Terminal",
    "Multan: Chungi No. 9 / Kalma Chowk",
  ];

  // Quick chips for Sightseeing Stops
  const famousTourStops = [
    "Karachi",
    "Hyderabad",
    "Sukkur",
    "Multan",
    "Lahore",
    "Islamabad",
    "Abbottabad",
    "Besham",
    "Naran",
    "Babusar Pass",
    "Lulusar Lake",
    "Chilas",
    "3 Mountain Ranges Junction",
    "Gilgit City",
    "Rakaposhi View Point",
    "Hunza Valley",
    "Altit & Baltit Forts",
    "Attabad Lake",
    "Passu Cones",
    "Hussaini Suspension Bridge",
    "Khunjerab Pass (China Border)",
    "Skardu City",
    "Shangrila Resort",
    "Upper Kachura Lake",
    "Deosai Plains",
    "Kalam Valley",
    "Mahodand Lake",
  ];

  // Handle Destination change
  function selectPresetValley(item: typeof popularValleys[0]) {
    setFormData((prev) => ({
      ...prev,
      destinationSlug: item.slug,
      destinationName: item.name,
      city: item.city,
      province: item.province,
    }));
  }

  function handleCustomValleyName(name: string) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "custom-valley";
    setFormData((prev) => ({
      ...prev,
      destinationSlug: slug,
      destinationName: name,
    }));
  }

  // Pickup Points handling (Max 3)
  function updatePickupPoint(idx: number, val: string) {
    const updated = [...pickupPoints];
    updated[idx] = val;
    setPickupPoints(updated);
  }

  function addPickupPoint(initialText: string = "") {
    if (pickupPoints.length < 3) {
      setPickupPoints([...pickupPoints, initialText]);
    }
  }

  function removePickupPoint(idx: number) {
    if (pickupPoints.length > 1) {
      setPickupPoints(pickupPoints.filter((_, i) => i !== idx));
    }
  }

  // Route Stops handling
  function updateRouteStop(idx: number, val: string) {
    const updated = [...routeStops];
    updated[idx] = val;
    setRouteStops(updated);
  }

  function addRouteStop(val: string = "") {
    setRouteStops([...routeStops, val]);
  }

  function removeRouteStop(idx: number) {
    if (routeStops.length > 1) {
      setRouteStops(routeStops.filter((_, i) => i !== idx));
    }
  }

  // Group Discount Tiers
  function updateGroupTier(idx: number, field: "minPersons" | "pricePerPerson", val: number) {
    const updated = [...groupDiscounts];
    updated[idx] = { ...updated[idx], [field]: val };
    setGroupDiscounts(updated);
  }

  function addGroupTier() {
    const lastTier = groupDiscounts[groupDiscounts.length - 1];
    const newPersons = lastTier ? lastTier.minPersons + 4 : 4;
    const newPrice = lastTier ? Math.max(1000, lastTier.pricePerPerson - 3000) : Math.max(1000, formData.basePrice - 3000);
    setGroupDiscounts([...groupDiscounts, { minPersons: newPersons, pricePerPerson: newPrice }]);
  }

  function removeGroupTier(idx: number) {
    setGroupDiscounts(groupDiscounts.filter((_, i) => i !== idx));
  }

  // Schedule Departure Generators
  function generateWeeklySchedule() {
    const generated: { startDate: string; seatsTotal: number }[] = [];
    const today = new Date();
    // find next occurrence of selectedWeekday
    const currentDay = today.getDay();
    let daysUntilFirst = (selectedWeekday - currentDay + 7) % 7;
    if (daysUntilFirst === 0) daysUntilFirst = 7; // start next week

    const firstDate = new Date(today.getTime() + daysUntilFirst * 24 * 60 * 60 * 1000);

    for (let i = 0; i < weeklyDurationWeeks; i++) {
      const depDate = new Date(firstDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      generated.push({
        startDate: depDate.toISOString().split("T")[0],
        seatsTotal: defaultBatchSeats,
      });
    }
    setDepartures(generated);
  }

  function generateMonthlySchedule() {
    const generated: { startDate: string; seatsTotal: number }[] = [];
    const today = new Date();
    const sortedDays = [...monthlySelectedDays].sort((a, b) => a - b);

    for (let m = 0; m < monthlyMonthsAhead; m++) {
      const targetMonth = new Date(today.getFullYear(), today.getMonth() + m, 1);
      const year = targetMonth.getFullYear();
      const month = targetMonth.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (const day of sortedDays) {
        if (day <= daysInMonth) {
          const candidate = new Date(year, month, day);
          // Only add if future or today
          if (candidate.getTime() >= today.getTime() - 24 * 60 * 60 * 1000) {
            generated.push({
              startDate: candidate.toISOString().split("T")[0],
              seatsTotal: defaultBatchSeats,
            });
          }
        }
      }
    }

    if (generated.length > 0) {
      setDepartures(generated);
    }
  }

  function addSingleDeparture() {
    const lastDate = departures.length > 0 ? new Date(departures[departures.length - 1].startDate) : new Date();
    const nextDate = new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    setDepartures([...departures, { startDate: nextDate.toISOString().split("T")[0], seatsTotal: defaultBatchSeats }]);
  }

  function updateDeparture(idx: number, field: "startDate" | "seatsTotal", val: any) {
    setDepartures(departures.map((d, i) => (i === idx ? { ...d, [field]: val } : d)));
  }

  function removeDeparture(idx: number) {
    setDepartures(departures.filter((_, i) => i !== idx));
  }

  // Amenities / Inclusions handling
  function toggleAmenity(a: string) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((item) => item !== a) : [...prev, a]
    );
  }

  function handleAddCustomPerk(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmed = customPerkInput.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities([...amenities, trimmed]);
      setCustomPerkInput("");
    }
  }

  // File Upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploadForm = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadForm.append("files", files[i]);
      }
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();
      if (data.success && data.urls?.length) {
        const existing = formData.photos ? formData.photos.split(",").map((s) => s.trim()).filter(Boolean) : [];
        setFormData((prev) => ({
          ...prev,
          photos: [...existing, ...data.urls].join(","),
        }));
      } else {
        setError(data.error || "Failed to upload images");
      }
    } catch (err: any) {
      setError("Failed to upload files: " + (err.message || "Network error"));
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(urlToRemove: string) {
    const existing = formData.photos ? formData.photos.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const updated = existing.filter((url) => url !== urlToRemove);
    setFormData((prev) => ({ ...prev, photos: updated.join(",") }));
  }

  // Form Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const validDepartures = departures.map((d) => {
        const start = new Date(d.startDate);
        const end = new Date(start.getTime() + (Number(formData.durationDays) || 5) * 24 * 60 * 60 * 1000);
        return {
          startDate: d.startDate,
          endDate: end.toISOString().split("T")[0],
          seatsTotal: Number(d.seatsTotal || 12),
          seatsLeft: Number(d.seatsTotal || 12),
          price: Number(formData.basePrice),
        };
      });

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: "TOUR",
          destination: formData.destinationSlug,
          destinationSlug: formData.destinationSlug,
          destinationName: formData.destinationName,
          address: pickupPoints.join(" | "),
          pickupPoints,
          routeStops,
          groupDiscounts,
          amenities,
          departures: validDepartures,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to publish tour");
      }

      setSubmitted(true);
      setCreatedSlug(data.listing?.slug || "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Failed to submit listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/partner-hub/listings"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tour Listings</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[11px] font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>Tour Operator Portal · Guided Tours &amp; Fixed Departures</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Add New Tour Package
          </h1>
          <p className="text-orange-100 text-xs sm:text-sm leading-relaxed">
            Configure custom Destination Valleys, up to 3 pickup hubs, tiered couple/solo/group pricing, full journey sightseeing route stops, and automated recurring weekly or monthly departure schedules.
          </p>
        </div>
      </div>

      {submitted && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-lg animate-in fade-in">
          <Clock className="w-6 h-6 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <span className="font-bold text-sm text-amber-950 block">🎉 Tour Package Submitted for Admin Review!</span>
            <p className="text-amber-800">
              Your tour has been submitted to PakistanTravel.Agency Super Admin. It will undergo listing moderation and will go live across the marketplace once approved.
            </p>
            {createdSlug && (
              <p className="pt-2">
                <Link href={`/listing/${createdSlug}`} target="_blank" className="font-bold text-sky-700 underline hover:text-sky-900">
                  Preview listing draft →
                </Link>
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ======================================================== */}
        {/* SECTION 1: TOUR PACKAGE DETAILS & PICKUP POINTS */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-5 h-5 text-orange-500" /> 1. Tour Package Details
            </h2>
            <span className="text-xs text-slate-400 font-medium">Destination Valley &amp; Pickup Points</span>
          </div>

          <div className="space-y-4">
            {/* Tour Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tour Title / Trip Name *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 5-Day Hunza Autumn, Attabad Lake & Khunjerab Pass Expedition"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />
            </div>

            {/* Destination Valley Selector & Custom Input */}
            <div className="bg-orange-50/40 rounded-2xl p-4 border border-orange-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600" /> Destination Valley / Region (Select or Type Custom) *
                </label>
                <span className="text-[11px] text-orange-700 font-medium">
                  آپ اپنی مرضی کی ویلی بھی خود درج کر سکتے ہیں
                </span>
              </div>

              {/* Quick Select Preset Valley Pills */}
              <div className="flex flex-wrap gap-1.5">
                {popularValleys.map((v) => {
                  const isSelected = formData.destinationSlug === v.slug;
                  return (
                    <button
                      type="button"
                      key={v.slug}
                      onClick={() => selectPresetValley(v)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition ${
                        isSelected
                          ? "bg-orange-600 border-orange-600 text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50/50"
                      }`}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>

              {/* Custom Destination Valley Editable Input */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Destination Valley Name (Editable / Custom)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destinationName}
                    onChange={(e) => handleCustomValleyName(e.target.value)}
                    placeholder="e.g. Broghil Valley & Karambar Lake"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-orange-200 bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Base Hub / City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Karimabad, Skardu"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Duration Days & Nights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Duration Days *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.durationDays}
                  onChange={(e) => {
                    const days = Math.max(1, Number(e.target.value));
                    const nights = Math.max(0, days - 1);
                    setFormData({
                      ...formData,
                      durationDays: days,
                      durationNights: nights,
                      duration: `${days} Days / ${nights} Nights`,
                    });
                  }}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nights *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.durationNights}
                  onChange={(e) => {
                    const nights = Math.max(0, Number(e.target.value));
                    setFormData({
                      ...formData,
                      durationNights: nights,
                      duration: `${formData.durationDays} Days / ${nights} Nights`,
                    });
                  }}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-center"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Trip Duration Display
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.duration}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-center"
                />
              </div>
            </div>

            {/* Departure / Pickup Meeting Points (Dynamic 1 -> 2 -> 3, Max 3) */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-emerald-600" /> Departure / Pickup Meeting Points (Max 3 Points) *
                  </label>
                  <p className="text-[11px] text-slate-500">
                    پہلا پک اپ پوائنٹ درج کریں، اس کے بعد دوسرا اور تیسرا پوائنٹ شامل کر سکتے ہیں (زیادہ سے زیادہ 3)۔
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {pickupPoints.length} / 3 Points
                </span>
              </div>

              {/* Pickup Point Inputs */}
              <div className="space-y-2.5">
                {pickupPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      required
                      value={point}
                      onChange={(e) => updatePickupPoint(idx, e.target.value)}
                      placeholder={
                        idx === 0
                          ? "Pickup Point 1 (e.g. Islamabad: Daewoo Express G-9 / Faizabad)"
                          : idx === 1
                          ? "Pickup Point 2 (e.g. Lahore: Thokar Niaz Baig / Kalma Chowk)"
                          : "Pickup Point 3 (e.g. Rawalpindi: Saddar / Airport)"
                      }
                      className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removePickupPoint(idx)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Remove pickup point"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Next Pickup Point Button (Only if < 3) */}
              {pickupPoints.length < 3 && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => addPickupPoint("")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>
                      {pickupPoints.length === 1 ? "+ Add 2nd Pickup Point" : "+ Add 3rd Pickup Point (Final)"}
                    </span>
                  </button>
                </div>
              )}

              {/* Common Pickup Suggestion Chips */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                  Quick Click to Add Common Pickup Hubs:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {commonPickupChips.map((chip) => (
                    <button
                      type="button"
                      key={chip}
                      onClick={() => {
                        if (pickupPoints.length === 1 && !pickupPoints[0].trim()) {
                          updatePickupPoint(0, chip);
                        } else if (pickupPoints.length < 3) {
                          addPickupPoint(chip);
                        }
                      }}
                      disabled={pickupPoints.length >= 3 && pickupPoints.every((p) => p.trim())}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 font-medium transition disabled:opacity-40"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: PRICING (PER PERSON, COUPLE, SOLO, GROUP) & ROUTE */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" /> 2. Pricing Structure &amp; Journey Route
            </h2>
            <span className="text-xs text-slate-400 font-medium">Per Person, Couple, Solo &amp; Group Discounts</span>
          </div>

          {/* Pricing Hierarchy: 1. Per Person, 2. Couple, 3. Solo, 4. Group Discounts */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Per Person Price */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-emerald-950 uppercase flex items-center gap-1">
                    <Users className="w-4 h-4 text-emerald-600" /> 1. Sharing Room Price (PKR) *
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Base Sharing
                  </span>
                </div>
                <input
                  type="number"
                  required
                  min={1000}
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 text-base rounded-xl border border-emerald-300 bg-white text-slate-900 font-extrabold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-500 block">
                  Twin / Triple sharing standard seat package rate.
                </span>
              </div>

              {/* 2. Couple Price */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-amber-950 uppercase flex items-center gap-1">
                    <Heart className="w-4 h-4 text-rose-500" /> 2. Private Room Price (PKR)
                  </label>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Private Room for 2
                  </span>
                </div>
                <input
                  type="number"
                  min={1000}
                  value={formData.couplePrice}
                  onChange={(e) => setFormData({ ...formData, couplePrice: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 text-base rounded-xl border border-amber-300 bg-white text-slate-900 font-extrabold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[11px] text-slate-500 block">
                  Dedicated private master bedroom for couple (2 persons).
                </span>
              </div>

              {/* 3. Solo Traveler Price */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-sky-950 uppercase flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-sky-600" /> 3. Solo / Single Room (PKR)
                  </label>
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                    Single Room
                  </span>
                </div>
                <input
                  type="number"
                  min={1000}
                  value={formData.soloPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      soloPrice: val,
                      singleSupplement: Math.max(0, val - formData.basePrice),
                    });
                  }}
                  className="w-full px-4 py-2.5 text-base rounded-xl border border-sky-300 bg-white text-slate-900 font-extrabold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-[11px] text-slate-500 block">
                  Private single room for solo traveler (no sharing).
                </span>
              </div>
            </div>

            {/* 4. Group & Family Discount Tiers ("itny log ho gy tu itny amount bane ga") */}
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/40 border border-purple-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-purple-950 uppercase flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-purple-600" /> 4. Group &amp; Family Discount Pricing (کتنے لوگ ہوں گے تو کتنا ریٹ بنے گا)
                  </label>
                  <p className="text-[11px] text-slate-600">
                    جب فیملی یا دوستوں کا گروپ بک کرے گا تو فی بندہ رعایت کے ساتھ کیا قیمت ہو گی:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addGroupTier}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tier</span>
                </button>
              </div>

              <div className="space-y-2">
                {groupDiscounts.map((tier, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-purple-100 text-xs shadow-sm">
                    <span className="text-[11px] font-bold text-purple-700 w-16">
                      Tier {idx + 1}:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium">If</span>
                      <input
                        type="number"
                        min={2}
                        max={50}
                        value={tier.minPersons}
                        onChange={(e) => updateGroupTier(idx, "minPersons", Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded-lg border border-slate-300 font-extrabold text-center text-slate-900"
                      />
                      <span className="text-slate-500 font-medium">+ Persons</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      <span className="text-slate-500 font-medium">Rate / Person: PKR</span>
                      <input
                        type="number"
                        min={1000}
                        step={500}
                        value={tier.pricePerPerson}
                        onChange={(e) => updateGroupTier(idx, "pricePerPerson", Number(e.target.value))}
                        className="w-28 px-2 py-1 rounded-lg border border-slate-300 font-extrabold text-right text-emerald-700"
                      />
                    </div>

                    {groupDiscounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGroupTier(idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        title="Remove tier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deposit & Free Cancellation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Online Deposit (%)</span>
                  <span className="text-[10px] text-slate-500">Remaining paid on trip departure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={formData.depositPercent}
                    onChange={(e) => setFormData({ ...formData, depositPercent: Number(e.target.value) })}
                    className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-extrabold text-center text-slate-900"
                  />
                  <span className="text-xs font-bold text-slate-600">%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Free Cancellation Days</span>
                  <span className="text-[10px] text-slate-500">Full refund before departure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={formData.freeCancellationDays}
                    onChange={(e) => setFormData({ ...formData, freeCancellationDays: Number(e.target.value) })}
                    className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-extrabold text-center text-slate-900"
                  />
                  <span className="text-xs font-bold text-slate-600">Days</span>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* ROUTE & SIGHTSEEING STOPS ALONG JOURNEY */}
            {/* ======================================================== */}
            <div className="bg-amber-50/40 rounded-2xl p-4 sm:p-5 border border-amber-200 space-y-3 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
                    <Route className="w-4 h-4 text-amber-600" /> Tour Journey Route &amp; Sightseeing Stops (کہاں سے کہاں جائیں گے اور کیا کیا دیکھیں گے)
                  </label>
                  <p className="text-[11px] text-slate-600">
                    جیسے کراچی سے ہنزہ جاتے ہوئے کون کون سے شہر، جھیلیں، اور نظارے دیکھیں گے:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addRouteStop("")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Next Stop</span>
                </button>
              </div>

              {/* Sequential Stops */}
              <div className="space-y-2">
                {routeStops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={stop}
                      onChange={(e) => updateRouteStop(idx, e.target.value)}
                      placeholder={`Stop ${idx + 1} (e.g. ${idx === 0 ? "Karachi / Departure City" : "Attabad Lake, Babusar Pass"})`}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {routeStops.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRouteStop(idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        title="Remove stop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Route Preview Ribbon */}
              {routeStops.filter(Boolean).length > 0 && (
                <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block mb-1">
                    Route Chain Preview:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                    {routeStops.filter(Boolean).map((s, i, arr) => (
                      <span key={i} className="inline-flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900">{s}</span>
                        {i < arr.length - 1 && <span className="text-amber-500 font-extrabold">➔</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Add Sightseeing Chips */}
              <div className="pt-2 border-t border-amber-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Click to Append Famous Sights into Route:
                </span>
                <div className="flex flex-wrap gap-1">
                  {famousTourStops.map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => addRouteStop(st)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 font-medium transition"
                    >
                      + {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: FIXED DEPARTURE DATES & SEAT LIMITS */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" /> 3. Fixed Departure Dates &amp; Seat Limits
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ہفتہ وار شیڈول (جیسے ہر اتوار) یا مہینے کی مخصوص تاریخیں (جیسے ہر ماہ 10، 20، 30 تاریخ) خودکار جنریٹ کریں:
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setScheduleMode("weekly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  scheduleMode === "weekly" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Weekly Repeat
              </button>
              <button
                type="button"
                onClick={() => setScheduleMode("monthly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  scheduleMode === "monthly" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Dates (10, 20, 30)
              </button>
              <button
                type="button"
                onClick={() => setScheduleMode("manual")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  scheduleMode === "manual" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Single Date
              </button>
            </div>
          </div>

          {/* Generator Controls based on Mode */}
          {scheduleMode === "weekly" && (
            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-3">
              <span className="text-xs font-bold text-orange-950 uppercase block">
                Weekly Recurring Departure Generator (ہفتہ وار شیڈول)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Departure Day</label>
                  <select
                    value={selectedWeekday}
                    onChange={(e) => setSelectedWeekday(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 text-xs focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={0}>Every Sunday (اتوار)</option>
                    <option value={5}>Every Friday (جمعہ)</option>
                    <option value={6}>Every Saturday (ہفتہ)</option>
                    <option value={4}>Every Thursday Night (جمعرات)</option>
                    <option value={1}>Every Monday (پیر)</option>
                    <option value={2}>Every Tuesday (منگل)</option>
                    <option value={3}>Every Wednesday (بدھ)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Duration Ahead</label>
                  <select
                    value={weeklyDurationWeeks}
                    onChange={(e) => setWeeklyDurationWeeks(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 text-xs"
                  >
                    <option value={4}>Next 4 Weeks (1 Month)</option>
                    <option value={8}>Next 8 Weeks (2 Months)</option>
                    <option value={12}>Next 12 Weeks (3 Months)</option>
                    <option value={16}>Next 16 Weeks (4 Months)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Seats per Trip</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={defaultBatchSeats}
                    onChange={(e) => setDefaultBatchSeats(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 text-xs text-center"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={generateWeeklySchedule}
                    className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Dates</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {scheduleMode === "monthly" && (
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <span className="text-xs font-bold text-amber-950 uppercase block">
                Monthly Specific Dates Schedule (مہینے کی مخصوص تاریخیں جیسے 10، 20، 30)
              </span>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => setMonthlySelectedDays([10, 20, 30])}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-bold text-amber-900 hover:bg-amber-100"
                >
                  ⚡ 10, 20, 30 of Every Month
                </button>
                <button
                  type="button"
                  onClick={() => setMonthlySelectedDays([1, 15])}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 hover:bg-slate-100"
                >
                  1st &amp; 15th
                </button>
                <button
                  type="button"
                  onClick={() => setMonthlySelectedDays([5, 15, 25])}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 hover:bg-slate-100"
                >
                  5, 15, 25
                </button>
              </div>

              {/* Day numbers chips */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Days of Month:</span>
                <div className="flex flex-wrap gap-1">
                  {[...Array(31)].map((_, i) => {
                    const dayNum = i + 1;
                    const isSelected = monthlySelectedDays.includes(dayNum);
                    return (
                      <button
                        type="button"
                        key={dayNum}
                        onClick={() => {
                          if (isSelected) {
                            setMonthlySelectedDays(monthlySelectedDays.filter((d) => d !== dayNum));
                          } else {
                            setMonthlySelectedDays([...monthlySelectedDays, dayNum]);
                          }
                        }}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                          isSelected
                            ? "bg-amber-600 text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-700 hover:border-amber-300"
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Months Ahead</label>
                  <select
                    value={monthlyMonthsAhead}
                    onChange={(e) => setMonthlyMonthsAhead(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 text-xs"
                  >
                    <option value={2}>Next 2 Months</option>
                    <option value={3}>Next 3 Months</option>
                    <option value={6}>Next 6 Months</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Seats per Trip</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={defaultBatchSeats}
                    onChange={(e) => setDefaultBatchSeats(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 text-xs text-center"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={generateMonthlySchedule}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Monthly Dates</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Departures List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase">
                Active Departure Dates ({departures.length} Trips Scheduled)
              </span>
              <button
                type="button"
                onClick={addSingleDeparture}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Date Manually</span>
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {departures.map((dep, idx) => {
                const start = new Date(dep.startDate);
                const end = new Date(start.getTime() + (Number(formData.durationDays) || 5) * 24 * 60 * 60 * 1000);
                const endDateStr = isNaN(end.getTime()) ? "" : end.toISOString().split("T")[0];

                return (
                  <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-[140px]">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Departure Date</label>
                      <input
                        type="date"
                        required
                        value={dep.startDate}
                        onChange={(e) => updateDeparture(idx, "startDate", e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 font-bold text-slate-900 bg-white"
                      />
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Return Date (Auto)</label>
                      <input
                        type="text"
                        readOnly
                        value={endDateStr}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-600 font-semibold"
                      />
                    </div>
                    <div className="w-28">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Max Seats</label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        required
                        value={dep.seatsTotal}
                        onChange={(e) => updateDeparture(idx, "seatsTotal", Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-300 font-bold text-slate-900 text-center bg-white"
                      />
                    </div>
                    {departures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDeparture(idx)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg self-end mb-0.5"
                        title="Remove departure"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 4: TOUR INCLUSIONS & PERKS */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-600" /> 4. Tour Inclusions &amp; Perks
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                مارکیٹ میں شامل جدید ترین مراعات اور سروسز منتخب کریں یا اپنی کسٹم سروس بھی شامل کریں:
              </p>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
              {amenities.length} Perks Selected
            </span>
          </div>

          {/* Custom Perk Input Box ("sat may entr karny ka opctn b do") */}
          <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customPerkInput}
              onChange={(e) => setCustomPerkInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomPerk();
                }
              }}
              placeholder="Type custom perk (e.g. Free Skiing Gear in Malam Jabba, Horse Riding Pass)..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-sky-300 bg-white text-slate-900 placeholder:text-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="button"
              onClick={() => handleAddCustomPerk()}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Perk</span>
            </button>
          </div>

          {/* Categorized Researched Inclusions */}
          <div className="space-y-5">
            {categorizedInclusions.map((cat, catIdx) => {
              const IconComp = cat.icon;
              return (
                <div key={catIdx} className="space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <IconComp className="w-3.5 h-3.5 text-orange-500" />
                    <span>{cat.category}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.perks.map((p) => {
                      const checked = amenities.includes(p);
                      return (
                        <button
                          type="button"
                          key={p}
                          onClick={() => toggleAmenity(p)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                            checked
                              ? "bg-orange-50 border-orange-300 text-orange-950 font-bold shadow-sm"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                              checked
                                ? "bg-orange-500 border-orange-500 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {checked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="leading-tight">{p}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Custom Perks if any */}
          {amenities.filter((a) => !categorizedInclusions.flatMap((c) => c.perks).includes(a)).length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-sky-800 uppercase block">Your Custom Added Perks:</span>
              <div className="flex flex-wrap gap-1.5">
                {amenities
                  .filter((a) => !categorizedInclusions.flatMap((c) => c.perks).includes(a))
                  .map((cp) => (
                    <span
                      key={cp}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-100 text-sky-900 text-xs font-bold border border-sky-200"
                    >
                      <Check className="w-3 h-3 text-sky-700" />
                      <span>{cp}</span>
                      <button
                        type="button"
                        onClick={() => toggleAmenity(cp)}
                        className="ml-1 text-sky-600 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION 5: PHOTOS & DETAILED ITINERARY */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" /> 5. High-Res Photos &amp; Detailed Itinerary
            </h2>
            <span className="text-xs text-slate-400 font-medium">Gallery &amp; Trip Description</span>
          </div>

          {/* Photo File Upload Box */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Upload real tour photos (JPG, PNG, WebP)
              </p>
              <p className="text-[11px] text-slate-500">
                High-resolution scenic landscape photos boost traveler booking conversions.
              </p>
            </div>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition shadow">
              <span>{uploading ? "Uploading photos..." : "Select Images from Computer"}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={uploading}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Photos Preview Thumbnails */}
          {formData.photos && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Uploaded Photos Preview:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {formData.photos.split(",").map((p) => p.trim()).filter(Boolean).map((photoUrl, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                    <img src={photoUrl} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(photoUrl)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Photo Image URLs (Comma separated)
            </label>
            <textarea
              rows={2}
              value={formData.photos}
              onChange={(e) => setFormData({ ...formData, photos: e.target.value })}
              className="w-full px-4 py-3 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Detailed Day-by-Day Itinerary &amp; Special Notes *
            </label>
            <textarea
              rows={5}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Day 1: Departure from Islamabad, drive along Karakoram Highway, night stay in Chilas.
Day 2: Drive to Hunza via Rakaposhi view point, explore Karimabad and Altit Fort.
Day 3: Full day excursion to Attabad Lake, Passu Cones, and Khunjerab Pass.
Day 4: Visit Baltit Fort, shopping in local bazaar, bonfire & BBQ night.
Day 5: Return journey to Islamabad..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* SUBMIT BUTTON BAR */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex items-center justify-between shadow-lg">
          <Link
            href="/partner-hub/listings"
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl text-white font-extrabold text-sm transition shadow-lg disabled:opacity-50 flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-orange-500/25"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{loading ? "Submitting Tour..." : "Submit Tour Package for Review"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}