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
  CheckCircle2
} from "lucide-react";

export default function NewListingPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    type: "HOTEL",
    destination: "hunza",
    city: "Karimabad",
    address: "",
    basePrice: 25000,
    unitTitle: "Deluxe King Room",
    maxGuests: 2,
    inventory: 5,
    cancellationDays: 2,
    photos: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80",
    description: "",
  });

  const [amenities, setAmenities] = useState<string[]>([
    "24/7 Power Generator",
    "Room Heating",
    "High-speed WiFi",
    "Complimentary Buffet Breakfast",
  ]);

  const [submitted, setSubmitted] = useState(false);

  const availableAmenities = [
    "24/7 Power Generator",
    "Room Heating",
    "High-speed WiFi",
    "Complimentary Buffet Breakfast",
    "Mountain View",
    "Underfloor Heating",
    "Lakefront Access",
    "Free Private Parking",
    "Airport Shuttle",
  ];

  function toggleAmenity(a: string) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((item) => item !== a) : [...prev, a]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push("/partner-hub/listings");
    }, 1800);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/partner-hub/listings"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">List a New Property or Tour</h1>
          <p className="text-xs text-slate-500">
            Publish your stay or northern package to thousands of travelers across Pakistan
          </p>
        </div>
      </div>

      {submitted && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600" />
          <div>
            <span className="font-bold block">Listing Submitted for Admin Approval!</span>
            Our local onboarding team verifies all photos and policies within 24 hours. Redirecting...
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-emerald" /> 1. General Property Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Listing Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Karakoram Glamping Pods & Resort"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Category Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              >
                <option value="HOTEL">Hotel & Resort</option>
                <option value="TOUR">Tour Package</option>
                <option value="RENTAL">4x4 Vehicle Rental</option>
                <option value="ACTIVITY">Trek & Adventure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Destination Region
              </label>
              <select
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              >
                <option value="hunza">Hunza Valley (Gilgit-Baltistan)</option>
                <option value="skardu">Skardu (Gilgit-Baltistan)</option>
                <option value="swat">Swat & Kalam (KPK)</option>
                <option value="murree">Murree & Bhurban (Punjab)</option>
                <option value="kumrat">Kumrat Valley (Dir, KPK)</option>
                <option value="islamabad">Islamabad Capital</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Complete Street Address
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Near Altit Fort Viewpoint, Karimabad, Hunza"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Room Units & Pricing */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand-emerald" /> 2. Room Configuration & Rates (PKR)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Room Unit Name
              </label>
              <input
                type="text"
                required
                value={formData.unitTitle}
                onChange={(e) => setFormData({ ...formData, unitTitle: e.target.value })}
                placeholder="Deluxe Mountain Room"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Nightly Price (PKR)
              </label>
              <input
                type="number"
                required
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Available Rooms / Slots
              </label>
              <input
                type="number"
                required
                value={formData.inventory}
                onChange={(e) => setFormData({ ...formData, inventory: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Mountain Amenities */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            3. Amenities & Facilities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableAmenities.map((amenity) => (
              <label
                key={amenity}
                className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                  amenities.includes(amenity)
                    ? "border-brand-emerald bg-emerald-50 text-brand-emerald"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="hidden"
                />
                <Check className={`w-4 h-4 ${amenities.includes(amenity) ? "opacity-100" : "opacity-0"}`} />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 4: High-res Photo URL */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-brand-emerald" /> 4. Photography (Cloudinary / Unsplash)
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              required
              value={formData.photos}
              onChange={(e) => setFormData({ ...formData, photos: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
          <Link
            href="/partner-hub/listings"
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white font-bold text-xs transition shadow-md"
          >
            Submit Listing for Verification
          </button>
        </div>
      </form>
    </div>
  );
}
