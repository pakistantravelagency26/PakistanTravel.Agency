"use client";

import { useState } from "react";
import { Users, CheckCircle2, XCircle, ShieldCheck, AlertCircle, Edit2 } from "lucide-react";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState([
    {
      id: "v-1",
      businessName: "Hunza Serena Hospitality Ltd",
      owner: "Hunza Serena Management",
      email: "vendor@serena.pk",
      phone: "03000000002",
      city: "Hunza Valley",
      cnic: "37405-1234567-1",
      commissionRate: 10.0,
      status: "VERIFIED",
      listingsCount: 2,
    },
    {
      id: "v-2",
      businessName: "Karakoram Expeditions & Treks",
      owner: "Asif Balti",
      email: "asif@karakoramexpeditions.pk",
      phone: "03451122334",
      city: "Skardu",
      cnic: "71501-9988776-5",
      commissionRate: 12.0,
      status: "PENDING",
      listingsCount: 1,
    },
    {
      id: "v-3",
      businessName: "Swat Green Valley Resorts",
      owner: "Malik Jahangir",
      email: "swatgreen@gmail.com",
      phone: "03017778899",
      city: "Kalam, Swat",
      cnic: "15602-4433221-3",
      commissionRate: 12.0,
      status: "PENDING",
      listingsCount: 0,
    },
  ]);

  function updateStatus(id: string, newStatus: string) {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
  }

  function updateCommission(id: string, rate: number) {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, commissionRate: rate } : v))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Vendor & Hotel Partner Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review business credentials, CNIC/Tax verification, and set contractual commission rates
          </p>
        </div>
      </div>

      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Business / Agency</th>
                <th className="py-3 px-4">Owner & Contact</th>
                <th className="py-3 px-4">City / Region</th>
                <th className="py-3 px-4">CNIC / NTN</th>
                <th className="py-3 px-4">Commission</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300 font-medium">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-700/30 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block text-sm">{v.businessName}</span>
                    <span className="text-[11px] text-slate-400">{v.listingsCount} Properties Listed</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-200 block">{v.owner}</span>
                    <span className="text-[11px] text-slate-400">{v.phone}</span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">{v.city}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{v.cnic}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-400 font-bold border border-slate-700">
                      {v.commissionRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        v.status === "VERIFIED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {v.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => updateStatus(v.id, "VERIFIED")}
                          className="px-3 py-1.5 rounded-lg bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-[11px]"
                        >
                          Approve Partner
                        </button>
                        <button
                          onClick={() => updateStatus(v.id, "REJECTED")}
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 font-bold text-[11px]"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          const r = prompt("Enter new commission percentage (e.g. 12):", v.commissionRate.toString());
                          if (r) updateCommission(v.id, Number(r));
                        }}
                        className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-bold"
                      >
                        Edit Rate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
