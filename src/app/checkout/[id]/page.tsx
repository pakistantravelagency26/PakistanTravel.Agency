"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  ArrowRight,
  Loader2
} from "lucide-react";
import { ListingData } from "@/services/listing.service";

export const dynamic = "force-dynamic";

function CheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const listingId = params.id as string;
  const unitId = searchParams.get("unitId");
  const qty = Number(searchParams.get("qty") || 1);
  const startParam = searchParams.get("start") || "2026-11-10";
  const endParam = searchParams.get("end") || "2026-11-13";

  const [listing, setListing] = useState<ListingData | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/listings?id=${encodeURIComponent(listingId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.listing) {
          setListing(data.listing);
        }
      })
      .catch((err) => console.error("Error loading checkout listing:", err))
      .finally(() => setIsPageLoading(false));
  }, [listingId]);

  // Form State
  const [guestName, setGuestName] = useState("Usman Tariq");
  const [guestEmail, setGuestEmail] = useState("customer@pakistantravel.agency");
  const [guestPhone, setGuestPhone] = useState("03001234567");
  const [cnicOrPassport, setCnicOrPassport] = useState("37405-1234567-1");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"JAZZCASH" | "EASYPAISA" | "STRIPE" | "CASH_ON_ARRIVAL">("JAZZCASH");

  // Payment specific inputs
  const [walletPhone, setWalletPhone] = useState("03001234567");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");

  // Promo code
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  if (isPageLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-emerald mb-2" />
        <p className="text-sm text-slate-500 font-medium">Securing checkout session...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Tour Listing Unavailable</h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          This package is currently not available for instant booking.
        </p>
        <Link href="/" className="px-5 py-2.5 bg-brand-emerald text-white font-bold rounded-xl text-sm">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const unit = (listing.units || []).find((u) => u.id === unitId) || listing.units?.[0];
  const nightsCount = 3;
  const baseRate = unit ? unit.basePrice * nightsCount * qty : listing.basePrice * nightsCount;
  const tax = Math.round(baseRate * 0.05); // 5% provincial tourism levy

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = baseRate + tax - discount;

  function handleApplyPromo() {
    if (promoCode.toUpperCase() === "HUNZA10" || promoCode.toUpperCase() === "WELCOME") {
      const disc = Math.round(baseRate * 0.1);
      setDiscount(disc);
      setPromoApplied(true);
      setError("");
    } else {
      setError("Invalid discount code. Try 'HUNZA10' for 10% off!");
    }
  }

  async function handleCompleteBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!listing) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          listingTitle: listing.title,
          listingPhoto: listing.photos[0],
          unitTitle: unit.title,
          destination: `${listing.city}, ${listing.province}`,
          startDate: startParam,
          endDate: endParam,
          nightsCount,
          guestsCount: unit.maxGuests * qty,
          unitsCount: qty,
          totalAmount,
          paymentMethod,
          guestName,
          guestEmail,
          guestPhone,
          cnicOrPassport,
          specialRequests,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to process booking");
        setLoading(false);
        return;
      }

      router.push(`/confirmation/${data.booking.bookingNumber}`);
    } catch (err: any) {
      setError("Something went wrong while completing your reservation.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Secure Reservation & Checkout</h1>
            <p className="text-xs text-slate-500">Official voucher issued instantly upon completion</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>256-bit TLS Encrypted Checkout</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCompleteBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Lead Guest Information */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-emerald text-white text-xs flex items-center justify-center font-bold">1</span>
                Lead Guest Contact Details
              </h2>
              <p className="text-xs text-slate-500">
                Your confirmation email, WhatsApp notification, and PDF voucher will be sent here.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    CNIC or Passport No. <span className="text-slate-400 font-normal">(Required for check-in)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cnicOrPassport}
                    onChange={(e) => setCnicOrPassport(e.target.value)}
                    placeholder="37405-XXXXXXX-X"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Special Requests (Optional)</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. High floor room with mountain view, early check-in, heater setup..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-emerald text-white text-xs flex items-center justify-center font-bold">2</span>
                Choose Payment Method
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* JazzCash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("JAZZCASH")}
                  className={`p-3.5 rounded-xl border-2 text-left transition flex flex-col justify-between ${
                    paymentMethod === "JAZZCASH"
                      ? "border-red-600 bg-red-50/30 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-red-600 mb-2" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">JazzCash</span>
                    <span className="text-[10px] text-slate-500">Mobile Wallet</span>
                  </div>
                </button>

                {/* EasyPaisa */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("EASYPAISA")}
                  className={`p-3.5 rounded-xl border-2 text-left transition flex flex-col justify-between ${
                    paymentMethod === "EASYPAISA"
                      ? "border-emerald-600 bg-emerald-50/30 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600 mb-2" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">EasyPaisa</span>
                    <span className="text-[10px] text-slate-500">Account / QR</span>
                  </div>
                </button>

                {/* Stripe / Cards */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("STRIPE")}
                  className={`p-3.5 rounded-xl border-2 text-left transition flex flex-col justify-between ${
                    paymentMethod === "STRIPE"
                      ? "border-brand-navy bg-blue-50/30 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-brand-navy mb-2" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Credit / Debit</span>
                    <span className="text-[10px] text-slate-500">Visa / Master</span>
                  </div>
                </button>

                {/* Cash on Arrival */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CASH_ON_ARRIVAL")}
                  className={`p-3.5 rounded-xl border-2 text-left transition flex flex-col justify-between ${
                    paymentMethod === "CASH_ON_ARRIVAL"
                      ? "border-brand-amber bg-amber-50/30 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <Banknote className="w-5 h-5 text-brand-amber mb-2" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Pay at Desk</span>
                    <span className="text-[10px] text-slate-500">Cash on Arrival</span>
                  </div>
                </button>
              </div>

              {/* Dynamic Payment Field Inputs */}
              {(paymentMethod === "JAZZCASH" || paymentMethod === "EASYPAISA") && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                  <p className="text-xs font-semibold text-slate-800">
                    Enter your {paymentMethod === "JAZZCASH" ? "JazzCash" : "EasyPaisa"} Mobile Account Number:
                  </p>
                  <div className="max-w-xs">
                    <input
                      type="tel"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="03001234567"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    You will receive an automated USSD prompt or MPIN request on your mobile phone to approve the transaction.
                  </p>
                </div>
              )}

              {paymentMethod === "STRIPE" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                  <p className="text-xs font-semibold text-slate-800">Card Payment Details (Powered by Stripe):</p>
                  <div className="space-y-3 max-w-md">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "CASH_ON_ARRIVAL" && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-in fade-in">
                  <span className="font-bold block mb-1">✓ Instant Voucher Reservation</span>
                  You can pay the full amount in Pakistani Rupee (PKR cash) directly at the property front desk upon check-in.
                </div>
              )}
            </div>

            {/* Promo / Coupon Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-brand-emerald" /> Promo Code / Voucher
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter HUNZA10 for 10% off"
                  className="w-full px-3 py-2 text-xs uppercase rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyPromo}
                className="w-full sm:w-auto mt-auto px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                Apply Code
              </button>
            </div>
          </div>

          {/* Right Column: Trip Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5 sticky top-24">
              <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
                Your Booking Details
              </h3>

              {/* Property Mini Card */}
              <div className="flex gap-3">
                <img
                  src={listing.photos[0]}
                  alt={listing.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-emerald uppercase">
                    {listing.type}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{listing.title}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {listing.city}, {listing.province}
                  </p>
                </div>
              </div>

              {/* Selected Dates and Unit */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Accommodation:</span>
                  <span className="font-bold text-slate-800">{unit.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Dates:</span>
                  <span className="font-bold text-slate-800">{startParam} to {endParam}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Duration:</span>
                  <span className="font-bold text-slate-800">{nightsCount} Nights · {qty} Room</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Room charges ({nightsCount} nights):</span>
                  <span>PKR {baseRate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Provincial Tourism Levy (5%):</span>
                  <span>PKR {tax.toLocaleString()}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Discount (HUNZA10):</span>
                    <span>- PKR {discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Price:</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-brand-emerald">
                      PKR {totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Includes all taxes</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-emerald hover:bg-brand-emeraldDark text-white font-bold text-sm rounded-xl transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Processing Reservation..." : "Confirm & Book with Instant Voucher"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-slate-500 text-center space-y-1">
                <p className="flex items-center justify-center gap-1 text-green-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Instant Confirmation Voucher Generated
                </p>
                <p>By completing this booking you agree to property house rules.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-12 text-center text-xs text-slate-400">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
