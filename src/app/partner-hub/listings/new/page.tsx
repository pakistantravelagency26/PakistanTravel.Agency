"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Check, 
  Image as ImageIcon, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Compass,
  Clock,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";

export default function NewListingPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    type: "TOUR",
    destination: "hunza",
    city: "Karimabad",
    province: "Gilgit-Baltistan",
    address: "Islamabad / Gilgit Pickup",
    durationDays: 5,
    durationNights: 4,
    duration: "5 Days / 4 Nights",
    basePrice: 45000,
    singleSupplement: 12000,
    depositPercent: 25,
    unitTitle: "Per Person Package (Twin Sharing)",
    maxGuests: 2,
    inventory: 10,
    freeCancellationDays: 3,
    photos: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
    description: "",
  });

  const [departures, setDepartures] = useState<{ startDate: string; seatsTotal: number }[]>([
    { startDate: "2026-11-15", seatsTotal: 12 },
    { startDate: "2026-11-22", seatsTotal: 12 },
    { startDate: "2026-11-29", seatsTotal: 12 },
  ]);
  const [uploading, setUploading] = useState(false);

  const [amenities, setAmenities] = useState<string[]>([
    "Dedicated 4x4 Mountain Transport",
    "Certified Alpine Guide",
    "Daily Breakfast & Dinner Included",
    "Hotel / Resort Accommodations",
    "First Aid & Emergency Support",
  ]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");
  const [error, setError] = useState("");

  const tourAmenitiesList = [
    "Dedicated 4x4 Mountain Transport",
    "Certified Alpine Guide",
    "Daily Breakfast & Dinner Included",
    "Hotel / Resort Accommodations",
    "First Aid & Emergency Support",
    "National Park & Sightseeing Permits",
    "Campfire & Cultural BBQ Night",
    "Photography & Drone Assistance",
    "Airport Pick & Drop Included",
    "Sleeping Bags & Alpine Huts",
  ];

  const hotelAmenitiesList = [
    "24/7 Power Generator & Room Heating",
    "High-Speed Wi-Fi",
    "Hot Water & Ensuite Bathroom",
    "Complimentary Buffet Breakfast",
    "24/7 Front Desk & Room Service",
    "Free On-Site Secure Parking",
    "Mountain & Valley View Balcony",
    "Electric Kettle & Tea Bar",
    "Daily Housekeeping Service",
    "Bonfire & Lawn Garden Access",
  ];

  const isTour = formData.type === "TOUR";

  function handleTypeSwitch(nextType: "TOUR" | "HOTEL") {
    if (nextType === "TOUR") {
      setFormData((prev) => ({
        ...prev,
        type: "TOUR",
        title: prev.title.includes("Hotel") ? "" : prev.title,
        unitTitle: "Per Person Package (Twin Sharing)",
        durationDays: 5,
    durationNights: 4,
    duration: "5 Days / 4 Nights",
        address: "Islamabad / Gilgit Pickup",
        basePrice: prev.basePrice > 0 ? prev.basePrice : 45000,
      }));
      setAmenities([
        "Dedicated 4x4 Mountain Transport",
        "Certified Alpine Guide",
        "Daily Breakfast & Dinner Included",
        "Hotel / Resort Accommodations",
        "First Aid & Emergency Support",
      ]);
    } else {
      setFormData((prev) => ({
        ...prev,
        type: "HOTEL",
        title: prev.title.includes("Tour") ? "" : prev.title,
        unitTitle: "Deluxe Mountain View Room",
        duration: "Per Night Stay",
        address: `${prev.city || "Karimabad"}, Main Valley Road`,
        basePrice: prev.basePrice > 0 ? prev.basePrice : 18000,
      }));
      setAmenities([
        "24/7 Power Generator & Room Heating",
        "High-Speed Wi-Fi",
        "Hot Water & Ensuite Bathroom",
        "Complimentary Buffet Breakfast",
        "24/7 Front Desk & Room Service",
      ]);
    }
  }

  const presetPhotos: { [key: string]: string[] } = {
    hunza: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
    ],
    skardu: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1200&auto=format&fit=crop&q=80",
    ],
    swat: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
    ],
    murree: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200&auto=format&fit=crop&q=80",
    ],
  };

  function toggleAmenity(a: string) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((item) => item !== a) : [...prev, a]
    );
  }

  function addDeparture() {
    const lastDate = departures.length > 0 ? new Date(departures[departures.length - 1].startDate) : new Date();
    const nextDate = new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    setDepartures([...departures, { startDate: nextDate.toISOString().split("T")[0], seatsTotal: 12 }]);
  }

  function removeDeparture(index: number) {
    setDepartures(departures.filter((_, i) => i !== index));
  }

  function updateDeparture(index: number, field: "startDate" | "seatsTotal", val: any) {
    setDepartures(departures.map((d, i) => (i === index ? { ...d, [field]: val } : d)));
  }

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
      console.error("Upload error:", err);
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

  function handleDestinationChange(dest: string) {
    let city = "Karimabad";
    let province = "Gilgit-Baltistan";
    if (dest === "skardu") {
      city = "Skardu";
      province = "Gilgit-Baltistan";
    } else if (dest === "swat") {
      city = "Kalam";
      province = "Khyber Pakhtunkhwa";
    } else if (dest === "murree") {
      city = "Bhurban";
      province = "Punjab";
    } else if (dest === "kumrat") {
      city = "Thal";
      province = "Khyber Pakhtunkhwa";
    }

    const defaultPhotos = presetPhotos[dest] || presetPhotos.hunza;

    setFormData({
      ...formData,
      destination: dest,
      city,
      province,
      photos: defaultPhotos.join(","),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const calculatedDepartures = isTour
        ? departures.map((d) => {
            const start = new Date(d.startDate);
            const end = new Date(start.getTime() + (Number(formData.durationDays) || 5) * 24 * 60 * 60 * 1000);
            return {
              startDate: d.startDate,
              endDate: end.toISOString().split("T")[0],
              seatsTotal: Number(d.seatsTotal || 12),
              seatsLeft: Number(d.seatsTotal || 12),
              price: Number(formData.basePrice),
            };
          })
        : [];

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amenities,
          departures: calculatedDepartures,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to publish tour");
      }

      setCreatedSlug(data.listing.slug);
      setSubmitted(true);
      setTimeout(() => {
        router.push("/partner-hub/listings");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "An error occurred while creating listing");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <Link
          href="/partner-hub/listings"
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block">
            Vendor Extranet · Tour Publisher
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Create New Tour or Stay Package</h1>
          <p className="text-xs text-slate-500">
            Publish your Northern tour, hotel, or 4x4 rental directly to PakistanTravel.Agency
          </p>
        </div>
      </div>

      {submitted && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-lg animate-in fade-in">
          <Clock className="w-6 h-6 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <span className="font-bold text-sm text-amber-950 block">🎉 Tour Package Submitted for Admin Review!</span>
            <p className="text-amber-800">Your tour has been submitted to PakistanTravel.Agency Super Admin. It will undergo listing moderation and will go live across the marketplace once approved.</p>
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
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-8 text-slate-800">
        {/* Step 1: Explicit Offering Type Confirmation (Tour vs Hotel) */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">
                Required Step 1 · Offering Confirmation
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Aap kya list kar rahe hain? (Select Hotel or Tour)
              </h2>
              <p className="text-xs text-slate-500">
                Aap ke selection ke mutabiq public booking page par <strong>&quot;Book Tour&quot;</strong> ya <strong>&quot;Reserve Room&quot;</strong> aayega.
              </p>
            </div>
            <span className={`text-xs font-black px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 self-start sm:self-auto ${
              isTour ? "bg-orange-100 text-orange-800" : "bg-emerald-100 text-emerald-800"
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmed: {isTour ? "Tour Package" : "Hotel & Stay"}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* TOUR OPTION CARD */}
            <button
              type="button"
              onClick={() => handleTypeSwitch("TOUR")}
              className={`p-5 rounded-2xl border-2 text-left transition relative flex flex-col justify-between ${
                isTour
                  ? "border-orange-500 bg-orange-50/60 shadow-md ring-2 ring-orange-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
                    isTour ? "bg-orange-500 text-white shadow" : "bg-slate-100 text-slate-500"
                  }`}>
                    <Compass className="w-6 h-6" />
                  </div>
                  {isTour && (
                    <span className="text-[10px] font-extrabold text-orange-700 bg-orange-200/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Active Selection
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Guided Tour Package</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Multi-day northern trips, group itineraries, certified guide, 4x4 transport &amp; adventure treks.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-orange-200/60 mt-3 text-[11px] font-bold text-orange-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-orange-600" />
                <span>Customer Button: <strong>&quot;Book Tour&quot; (Per Seat / Person)</strong></span>
              </div>
            </button>

            {/* HOTEL OPTION CARD */}
            <button
              type="button"
              onClick={() => handleTypeSwitch("HOTEL")}
              className={`p-5 rounded-2xl border-2 text-left transition relative flex flex-col justify-between ${
                !isTour
                  ? "border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-600/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
                    !isTour ? "bg-emerald-600 text-white shadow" : "bg-slate-100 text-slate-500"
                  }`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  {!isTour && (
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-200/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Active Selection
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Hotel &amp; Resort Stay</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Hotel rooms, luxury mountain lodges, suites, glamping pods, guest houses &amp; per-night accommodations.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-emerald-200/60 mt-3 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Customer Button: <strong>&quot;Reserve Room&quot; (Per Room / Night)</strong></span>
              </div>
            </button>
          </div>
        </div>

        {/* Section 2: Basic Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-500" /> 2. {isTour ? "Tour Package Details" : "Hotel Property Details"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {isTour ? "Tour Title / Trip Name *" : "Hotel / Resort Property Name *"}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={
                  isTour
                    ? "e.g. 5-Day Hunza Autumn, Attabad Lake & Khunjerab Pass Expedition"
                    : "e.g. Serena Hotel Hunza or Shangrila Resort Skardu"
                }
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Destination Valley / Region *
              </label>
              <select
                value={formData.destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="hunza">Hunza Valley &amp; Attabad</option>
                <option value="skardu">Skardu &amp; Deosai Plains</option>
                <option value="swat">Swat Valley &amp; Kalam</option>
                <option value="murree">Murree &amp; Bhurban</option>
                <option value="kumrat">Kumrat Valley &amp; Dir</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {isTour ? "Tour Base / Pickup City" : "City / Valley Town"}
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {isTour ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
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
                    className="w-full px-3 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
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
                    className="w-full px-3 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Stay Duration
                </label>
                <input
                  type="text"
                  readOnly
                  value="Per Night Stay"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-600 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {isTour ? "Departure / Pickup Meeting Point" : "Hotel Physical Address"}
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Package Unit */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" /> 3. Vendor Demanded Pricing &amp; Deposit
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {isTour ? "Vendor Demanded Rate per Person (PKR) *" : "Vendor Rate per Room / Night (PKR) *"}
              </label>
              <input
                type="number"
                required
                min={1000}
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Aapka net amount. Admin markup iske upar add hoga.
              </span>
            </div>

            {isTour && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Single Supplement (PKR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.singleSupplement}
                  onChange={(e) => setFormData({ ...formData, singleSupplement: Number(e.target.value) })}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Charged to solo travelers booking twin-share tour.
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Online Deposit (%)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={formData.depositPercent}
                onChange={(e) => setFormData({ ...formData, depositPercent: Number(e.target.value) })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Default 25%. Remaining balance paid on arrival.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Free Cancellation Days
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={formData.freeCancellationDays}
                onChange={(e) => setFormData({ ...formData, freeCancellationDays: Number(e.target.value) })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Full refund window before start date.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3B: Fixed Departures Schedule (Tours only) */}
        {isTour && (
          <div className="space-y-4 bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" /> Fixed Departure Dates &amp; Seat Limits
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tours are booked only on fixed departures. Each departure prevents overbooking automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={addDeparture}
                className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Date</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {departures.map((dep, idx) => {
                const start = new Date(dep.startDate);
                const end = new Date(start.getTime() + (Number(formData.durationDays) || 5) * 24 * 60 * 60 * 1000);
                const endDateStr = isNaN(end.getTime()) ? "" : end.toISOString().split("T")[0];

                return (
                  <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Start Date</label>
                      <input
                        type="date"
                        required
                        value={dep.startDate}
                        onChange={(e) => updateDeparture(idx, "startDate", e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-900"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">End Date (Auto)</label>
                      <input
                        type="text"
                        readOnly
                        value={endDateStr}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-semibold"
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
                        className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-900 text-center"
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
        )}

        {/* Section 4: Inclusions / Amenities */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600" /> 4. {isTour ? "Tour Inclusions & Perks" : "Hotel Amenities & Facilities"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(isTour ? tourAmenitiesList : hotelAmenitiesList).map((a) => {
              const checked = amenities.includes(a);
              return (
                <button
                  type="button"
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold text-left transition ${
                    checked
                      ? isTour
                        ? "bg-orange-50 border-orange-300 text-orange-900 font-bold"
                        : "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                      checked
                        ? isTour
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{a}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Photos & Description */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-600" /> 5. High-Res Photos &amp; Highlights
          </h2>

          {/* Photo File Upload Box */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Upload real tour or hotel photos (JPG, PNG, WebP)
              </p>
              <p className="text-[11px] text-slate-500">
                Support for unlimited high-resolution photos.
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
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Photo Image URLs (Comma separated or auto-populated from uploads above)
            </label>
            <textarea
              rows={2}
              value={formData.photos}
              onChange={(e) => setFormData({ ...formData, photos: e.target.value })}
              className="w-full px-4 py-3 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              {isTour ? "Detailed Itinerary & Highlights" : "Hotel Description & Property Rules"}
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={
                isTour
                  ? "Describe key landmarks (e.g. Attabad Lake, Passu Cones, Eagle's Nest, local food, tour transport, hiking guides)..."
                  : "Describe hotel rooms, mountain views, room service, heating, breakfast buffet, front desk timings..."
              }
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            href="/partner-hub/listings"
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className={`px-7 py-3.5 rounded-xl text-white font-extrabold text-sm transition shadow-lg disabled:opacity-50 flex items-center gap-2 ${
              isTour
                ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/25"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {loading
                ? isTour ? "Submitting Tour..." : "Submitting Hotel..."
                : isTour ? "Submit Tour for Review" : "Submit Hotel for Review"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
