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
    type: "TOUR" as const,
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
    "Hotel / Resort Accommodations Included",
    "First Aid & Emergency Support",
  ]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");
  const [error, setError] = useState("");

  const tourInclusionsList = [
    "Dedicated 4x4 Mountain Transport",
    "Certified Alpine Guide",
    "Daily Breakfast & Dinner Included",
    "Hotel / Resort Accommodations Included",
    "First Aid & Emergency Support",
    "National Park & Sightseeing Permits",
    "Campfire & Cultural BBQ Night",
    "Photography & Drone Assistance",
    "Airport Pick & Drop Included",
    "Sleeping Bags & Alpine Huts",
  ];

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
    kumrat: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
    ],
    neelum: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80",
    ],
    naran: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80",
    ],
    "fairy-meadows": [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1200&auto=format&fit=crop&q=80",
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
    } else if (dest === "neelum") {
      city = "Kutton";
      province = "Azad Kashmir";
    } else if (dest === "naran") {
      city = "Naran";
      province = "Khyber Pakhtunkhwa";
    } else if (dest === "fairy-meadows") {
      city = "Raikhot Bridge";
      province = "Gilgit-Baltistan";
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
      const calculatedDepartures = departures.map((d) => {
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
          amenities,
          departures: calculatedDepartures,
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
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
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
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[11px] font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>Tour Operator Portal · Guided Tours Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Add New Tour Package
          </h1>
          <p className="text-orange-100 text-xs sm:text-sm">
            List your guided northern tour package with fixed departures, 4x4 mountain transit, certified guides, and seat availability.
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
        
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-500" /> 1. Tour Package Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Tour Title / Trip Name *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 5-Day Hunza Autumn, Attabad Lake & Khunjerab Pass Expedition"
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
                <option value="neelum">Neelum Valley &amp; Arang Kel</option>
                <option value="naran">Naran &amp; Kaghan Valley</option>
                <option value="fairy-meadows">Fairy Meadows &amp; Nanga Parbat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Tour Base / Pickup City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

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

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Departure / Pickup Meeting Point *
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

        {/* Section 2: Pricing & Package Unit */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" /> 2. Pricing &amp; Deposit
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Rate per Person (PKR) *
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
                Net demanded rate. Admin markup applies.
              </span>
            </div>

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
                Default 25%. Remaining balance paid on departure.
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
                Full refund window before departure date.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Fixed Departures Schedule */}
        <div className="space-y-4 bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" /> 3. Fixed Departure Dates &amp; Seat Limits
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Tours are booked exclusively on fixed departures. Each departure prevents overbooking automatically.
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Departure Date</label>
                    <input
                      type="date"
                      required
                      value={dep.startDate}
                      onChange={(e) => updateDeparture(idx, "startDate", e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-900"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Return Date (Auto)</label>
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

        {/* Section 4: Inclusions & Amenities */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600" /> 4. Tour Inclusions &amp; Perks
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {tourInclusionsList.map((a) => {
              const checked = amenities.includes(a);
              return (
                <button
                  type="button"
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold text-left transition ${
                    checked
                      ? "bg-orange-50 border-orange-300 text-orange-900 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                      checked
                        ? "bg-orange-500 border-orange-500 text-white"
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

        {/* Section 5: Photos & Highlights */}
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
                Upload real tour photos (JPG, PNG, WebP)
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
              Detailed Tour Itinerary &amp; Highlights *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe day-by-day itinerary, key landmarks (e.g. Attabad Lake, Passu Cones, Eagle's Nest, 4x4 Jeep transit, hiking trails, hotel nights included)..."
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
            className="px-7 py-3.5 rounded-xl text-white font-extrabold text-sm transition shadow-lg disabled:opacity-50 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 shadow-orange-500/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Submitting Tour..." : "Submit Tour Package for Review"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
