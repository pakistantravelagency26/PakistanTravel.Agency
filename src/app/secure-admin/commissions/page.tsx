"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Percent, ArrowRight } from "lucide-react";

export default function AdminCommissionsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/secure-admin/listings");
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
        <Percent className="w-6 h-6" />
      </div>
      <h1 className="text-xl font-bold text-slate-900">Per-Tour Commission Moderation</h1>
      <p className="text-sm text-slate-500">
        Commission percentage is now determined individually per tour when approving submissions in Listing Moderation.
      </p>
      <Link
        href="/secure-admin/listings"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
      >
        <span>Open Listing Moderation</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
