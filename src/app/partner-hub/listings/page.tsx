"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  PlusCircle, 
  ExternalLink, 
  Edit, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  X,
  Check,
  DollarSign
} from "lucide-react";
import { MOCK_LISTINGS, ListingData } from "@/services/listing.service";

export default function VendorListingsPage() {
  const [tours, setTours] = useState<ListingData[]>(MOCK_LISTINGS);
  const [editingTour, setEditingTour] = useState<ListingData | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    basePrice: 0,
    duration: "",
    city: "",
    description: "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  function openEditModal(tour: ListingData) {
    setEditingTour(tour);
    setEditForm({
      title: tour.title,
      basePrice: tour.basePrice,
      duration: tour.duration || "4 Days / 3 Nights",
      city: tour.city,
      description: tour.description,
    });
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTour) return;

    setTours((prev) =>
      prev.map((t) =>
        t.id === editingTour.id
          ? {
              ...t,
              title: editForm.title,
              basePrice: Number(editForm.basePrice),
              duration: editForm.duration,
              city: editForm.city,
              description: editForm.description,
            }
          : t
      )
    );

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setEditingTour(null);
    }, 1200);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Tours & Expeditions Management</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {tours.length} Active Tours
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong className="text-slate-800">Karakoram Expeditions & Northern Tours</strong>. Manage prices, itineraries, and dates.
          </p>
        </div>

        <Link
          href="/partner-hub/listings/new"
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-md shadow-orange-500/20 flex items-center gap-1.5 self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Tour</span>
        </Link>
      </div>

      {/* Grid of 10 Tours */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48">
              <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                  Live on Marketplace
                </span>
                {item.badge && (
                  <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.duration && (
                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Clock className="w-3 h-3 text-orange-500" />
                  {item.duration}
                </span>
              )}
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-sky-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {item.destinationName} ({item.province})
                </span>
                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mt-1">{item.title}</h3>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Base Rate</span>
                    <span className="font-extrabold text-slate-900">PKR {item.basePrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Guest Rating</span>
                    <span className="font-bold text-emerald-600">{item.avgRating} ★ ({item.totalReviews})</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={`/listing/${item.slug}`}
                  target="_blank"
                  className="text-sky-600 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Preview Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href="/partner-hub/calendar"
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[11px]"
                  >
                    Dates & Rates
                  </Link>
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Tour Modal (Allows editing in real-time) */}
      {editingTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block">
                  Vendor Quick Edit
                </span>
                <h2 className="text-lg font-bold text-slate-900">Edit Tour Details</h2>
              </div>
              <button
                onClick={() => setEditingTour(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-base text-slate-900">Changes Saved Successfully!</h3>
                <p className="text-xs text-slate-500">Live tour listing updated across the marketplace.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tour Title</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Price (PKR)</label>
                    <input
                      type="number"
                      required
                      value={editForm.basePrice}
                      onChange={(e) => setEditForm({ ...editForm, basePrice: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Duration</label>
                    <input
                      type="text"
                      required
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      placeholder="e.g. 5 Days / 4 Nights"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Base City / Hub</label>
                  <input
                    type="text"
                    required
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tour Itinerary Overview</label>
                  <textarea
                    rows={3}
                    required
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTour(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20"
                  >
                    Save & Update Tour
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
