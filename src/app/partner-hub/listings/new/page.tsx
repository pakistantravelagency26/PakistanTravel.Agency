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
  Car,
  Clock,
  Sparkles,
  Layers
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
    duration: "5 Days / 4 Nights",
    basePrice: 55000,
    unitTitle: "Per Person Package (Twin Sharing)",
    maxGuests: 2,
    inventory: 10,
    freeCancellationDays: 3,
    photos: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
    description: "",
  });

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

  const availableAmenities = [
    "Dedicated 4x4 Mountain Transport",
    "Certified Alpine Guide",
    "Daily Breakfast & Dinner Included",
    "Hotel / Resort Accommodations",
    "First Aid & Emergency Support",
    "Airport Pick & Drop Included",
    "National Park & Sightseeing Permits",
    "24/7 Power Generator & Room Heating",
    "Campfire & Cultural BBQ Night",
    "Photography & Drone Assistance",
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
  };

  function toggleAmenity(a: string) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((item) => item !== a) : [...prev, a]
    );
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
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amenities,
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
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">
            Vendor Extranet · Tour Publisher
          </span>
          <h1 className="text-2xl font-extrabold text-white">Create New Tour or Stay Package</h1>
          <p className="text-xs text-slate-400">
            Publish your Northern tour, hotel, or 4x4 rental directly to PakistanTravel.Agency
          </p>
        </div>
      </div>

      {submitted && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3 shadow-xl animate-in fade-in">
          <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
          <div className="space-y-1">
            <span className="font-bold text-sm text-white block">🎉 Tour Published Successfully to Marketplace!</span>
            <p>Your listing is now active and will appear on the homepage and catalog search results.</p>
            {createdSlug && (
              <p className="pt-2">
                <Link href={`/listing/${createdSlug}`} target="_blank" className="font-bold text-sky-400 underline hover:text-sky-300">
                  Click here to view your live listing →
                </Link>
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-8 shadow-xl text-slate-200">
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-400" /> 1. Tour / Stay Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Tour / Property Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 5-Day Hunza Autumn, Attabad Lake & Khunjerab Pass Expedition"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Offering Category *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="TOUR">Tour Package (Guided Trip)</option>
                <option value="HOTEL">Hotel & Mountain Resort</option>
                <option value="RENTAL">4x4 Mountain Vehicle Rental</option>
                <option value="ACTIVITY">Trek & Adventure Expedition</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Destination Valley / Region *
              </label>
              <select
                value={formData.destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="hunza">Hunza Valley & Attabad</option>
                <option value="skardu">Skardu & Deosai Plains</option>
                <option value="swat">Swat Valley & Kalam</option>
                <option value="murree">Murree & Bhurban</option>
                <option value="kumrat">Kumrat Valley & Dir</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Base City / Area
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Trip Duration (e.g. 5 Days / 4 Nights)
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Package Unit */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> 2. Pricing & Booking Packages
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Base Price (PKR) *
              </label>
              <input
                type="number"
                required
                min={1000}
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Package Unit Title
              </label>
              <input
                type="text"
                required
                value={formData.unitTitle}
                onChange={(e) => setFormData({ ...formData, unitTitle: e.target.value })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Free Cancellation Days
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={formData.freeCancellationDays}
                onChange={(e) => setFormData({ ...formData, freeCancellationDays: Number(e.target.value) })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Inclusions / Amenities */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" /> 3. What&apos;s Included (Inclusions & Amenities)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableAmenities.map((a) => {
              const checked = amenities.includes(a);
              return (
                <button
                  type="button"
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold text-left transition ${
                    checked
                      ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                      checked
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "border-slate-700 bg-slate-800"
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

        {/* Section 4: Photos & Description */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-400" /> 4. High-Res Photos & Highlights
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Photo Image URLs (Comma separated)
            </label>
            <textarea
              rows={2}
              value={formData.photos}
              onChange={(e) => setFormData({ ...formData, photos: e.target.value })}
              className="w-full px-4 py-3 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Pre-filled with authentic high-resolution Pakistani photography. You can replace with your own links.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Detailed Description & Itinerary Highlights
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the key landmarks (e.g. Attabad Lake, Passu Cones, Eagle's Nest, local food, hotel amenities, road conditions)..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <Link
            href="/partner-hub/listings"
            className="px-5 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-semibold"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm transition shadow-xl shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Publishing Tour..." : "Publish Tour to Marketplace"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
