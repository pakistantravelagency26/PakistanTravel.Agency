"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, XCircle, ExternalLink, ShieldCheck } from "lucide-react";

export default function AdminListingsPage() {
  const [pendingListings, setPendingListings] = useState([
    {
      id: "serena-shigar-fort",
      title: "Serena Shigar Fort - The Palace on the Rock",
      type: "HOTEL",
      vendor: "Hunza Serena Hospitality Ltd",
      destination: "Shigar Valley, Skardu",
      basePrice: 42000,
      photos: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
      status: "PENDING_APPROVAL",
      cancellationDays: 2,
    },
    {
      id: "kumrat-luxury-camps",
      title: "Kumrat Valley Alpine Riverside Glamping",
      type: "HOTEL",
      vendor: "Swat Green Valley Resorts",
      destination: "Kumrat Valley, Upper Dir",
      basePrice: 22000,
      photos: "https://images.unsplash.com/photo-1596761011406-8d18d4052973?w=800&auto=format&fit=crop&q=80",
      status: "PENDING_APPROVAL",
      cancellationDays: 1,
    },
  ]);

  function handleAction(id: string, newStatus: string) {
    setPendingListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Listing Moderation Queue</h1>
        <p className="text-xs text-slate-400 mt-1">
          Verify photos, amenities, pricing, and hotel policies before publishing to travelers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingListings.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48">
              <img src={item.photos} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {item.status === "PENDING_APPROVAL" ? "Awaiting Admin Review" : "Published"}
                </span>
                <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                  {item.type}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-white">{item.title}</h3>
                <p className="text-xs text-emerald-400 mt-0.5">{item.destination}</p>
                <p className="text-xs text-slate-400 mt-1">Submitted by: <span className="text-slate-200 font-semibold">{item.vendor}</span></p>

                <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Starting Rate</span>
                    <span className="font-extrabold text-white text-sm">
                      PKR {item.basePrice.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Cancellation</span>
                    <span className="text-emerald-400 font-bold">{item.cancellationDays} Days Free</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                {item.status === "PENDING_APPROVAL" ? (
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => handleAction(item.id, "PUBLISHED")}
                      className="flex-1 py-2 bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow"
                    >
                      Approve & Publish Live
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "REJECTED")}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs rounded-xl transition border border-red-500/30"
                    >
                      Request Revisions
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Published to Marketplace
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
