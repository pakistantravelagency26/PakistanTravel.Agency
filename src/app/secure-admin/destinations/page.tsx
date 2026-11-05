"use client";

import { useState } from "react";
import { MapPin, Plus, Star, CheckCircle2 } from "lucide-react";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState([
    {
      id: "hunza",
      name: "Hunza Valley",
      province: "Gilgit-Baltistan",
      isFeatured: true,
      listingsCount: 142,
      image: "https://images.unsplash.com/photo-1588661793444-c71597813a83?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "skardu",
      name: "Skardu & Deosai",
      province: "Gilgit-Baltistan",
      isFeatured: true,
      listingsCount: 96,
      image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "swat",
      name: "Swat & Kalam",
      province: "KPK",
      isFeatured: true,
      listingsCount: 184,
      image: "https://images.unsplash.com/photo-1596761011406-8d18d4052973?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "murree",
      name: "Murree & Bhurban",
      province: "Punjab",
      isFeatured: true,
      listingsCount: 210,
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "kumrat",
      name: "Kumrat Valley",
      province: "KPK",
      isFeatured: false,
      listingsCount: 24,
      image: "https://images.unsplash.com/photo-1596761011406-8d18d4052973?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "neelum",
      name: "Neelum Valley",
      province: "Azad Kashmir",
      isFeatured: false,
      listingsCount: 45,
      image: "https://images.unsplash.com/photo-1588661793444-c71597813a83?w=800&auto=format&fit=crop&q=80",
    },
  ]);

  function toggleFeatured(id: string) {
    setDestinations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFeatured: !d.isFeatured } : d))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Destinations & Tourism Valleys</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage Pakistani travel hubs and feature trending spots on the homepage
          </p>
        </div>

        <button
          onClick={() => {
            const name = prompt("Enter new Pakistani Destination Name (e.g. Chitral & Kalash):");
            if (name) {
              setDestinations([
                ...destinations,
                {
                  id: name.toLowerCase().replace(/\s+/g, "-"),
                  name,
                  province: "KPK",
                  isFeatured: false,
                  listingsCount: 0,
                  image: "https://images.unsplash.com/photo-1588661793444-c71597813a83?w=800&auto=format&fit=crop&q=80",
                },
              ]);
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-xs transition shadow flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-44">
              <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-slate-900/80 text-brand-amber text-[10px] font-bold px-2.5 py-0.5 rounded backdrop-blur-sm">
                {dest.province}
              </div>
            </div>

            <div className="p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">{dest.name}</h3>
                <p className="text-xs text-slate-400">{dest.listingsCount} Properties Active</p>
              </div>

              <button
                onClick={() => toggleFeatured(dest.id)}
                className={`p-2 rounded-xl border transition ${
                  dest.isFeatured
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-slate-700 text-slate-400 border-slate-600"
                }`}
                title={dest.isFeatured ? "Featured on Homepage" : "Click to Feature"}
              >
                <Star className={`w-4 h-4 ${dest.isFeatured ? "fill-amber-400" : ""}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
