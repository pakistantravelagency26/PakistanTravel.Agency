"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Plus, Star, Trash2, X, AlertCircle, Loader2 } from "lucide-react";

interface DestinationItem {
  id: string;
  name: string;
  slug: string;
  province: string;
  description: string;
  image: string;
  isFeatured: boolean;
  listingsCount: number;
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [province, setProvince] = useState("Gilgit-Baltistan");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);

  async function loadDestinations() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/destinations");
      const data = await res.json();
      if (data.success) {
        setDestinations(data.destinations || []);
      }
    } catch (err) {
      console.error("Failed to load destinations:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDestinations();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Destination Name is required.");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          province: province.trim(),
          description: description.trim(),
          image: image.trim(),
          isFeatured,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setName("");
        setDescription("");
        setImage("");
        loadDestinations();
      } else {
        setError(data.error || "Failed to create destination.");
      }
    } catch (err: any) {
      setError(err.message || "Network error while creating destination.");
    } finally {
      setCreating(false);
    }
  }

  async function toggleFeatured(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !current }),
      });
      if (res.ok) {
        setDestinations((prev) =>
          prev.map((d) => (d.id === id ? { ...d, isFeatured: !current } : d))
        );
      }
    } catch (err) {
      console.error("Failed to toggle destination featured status:", err);
    }
  }

  async function handleDelete(id: string, destName: string) {
    if (!confirm(`Are you sure you want to delete destination "${destName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/destinations/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setDestinations((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert(data.error || "Failed to delete destination.");
      }
    } catch (err: any) {
      alert("Error deleting destination: " + err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Destinations & Tourism Valleys</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage northern valleys, scenic corridors, and featured regions stored live in Neon PostgreSQL
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
          <span className="text-xs font-semibold">Loading destinations from database...</span>
        </div>
      ) : destinations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <MapPin className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">No Destinations Configured</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              No tourism destinations currently exist in the database. Click &quot;Add New Destination&quot; above to add your own valleys and regions.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Destination</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-slate-800 tracking-wider uppercase shadow">
                  {dest.province}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => toggleFeatured(dest.id, dest.isFeatured)}
                    title={dest.isFeatured ? "Featured" : "Mark as featured"}
                    className={`p-2 rounded-full backdrop-blur-md transition shadow ${
                      dest.isFeatured
                        ? "bg-amber-400 text-slate-900 font-bold"
                        : "bg-black/40 text-white hover:bg-black/60"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    onClick={() => handleDelete(dest.id, dest.name)}
                    title="Delete destination"
                    className="p-2 rounded-full bg-red-600/90 hover:bg-red-700 text-white transition shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-extrabold text-white text-base leading-tight drop-shadow-sm">
                    {dest.name}
                  </h3>
                  <span className="text-[11px] text-white/80 font-medium">
                    Slug: /{dest.slug}
                  </span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between bg-slate-50/70 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  {dest.listingsCount} Live {dest.listingsCount === 1 ? "Tour" : "Tours"}
                </span>

                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {dest.isFeatured ? "★ Featured" : "Standard"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Destination Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Add New Destination</h3>
                <p className="text-xs text-slate-500">Stored persistently in database</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kaghan & Naran Valley"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Province / Territory
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa (KPK)</option>
                  <option value="Azad Kashmir">Azad Jammu & Kashmir</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital">Islamabad Capital Territory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Brief overview of top attractions, peaks, or lakes..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="feat-checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="feat-checkbox" className="text-xs font-semibold text-slate-700">
                  Feature this destination on homepage and discovery filters
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Destination</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
