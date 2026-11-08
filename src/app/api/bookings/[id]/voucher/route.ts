import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBookingById } from "@/services/booking.service";
import { siteConfig, getVerifiedValue } from "@/config/site";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await getBookingById(params.id);
    if (!booking) {
      return new NextResponse("Booking Voucher Not Found", { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const url = new URL(req.url);
    const guestEmailParam = url.searchParams.get("email")?.toLowerCase().trim();

    const isAdmin = session?.user?.role === "ADMIN";
    const isOwner =
      (session?.user?.email &&
        booking.guestEmail.toLowerCase() === session.user.email.toLowerCase()) ||
      (guestEmailParam && booking.guestEmail.toLowerCase() === guestEmailParam);

    let isVendorOwner = false;
    if (session?.user?.role === "VENDOR" && session.user.vendorId) {
      const { prisma } = await import("@/lib/prisma");
      const listing = await prisma.listing.findUnique({
        where: { id: booking.listingId },
        select: { vendorId: true },
      });
      if (listing?.vendorId === session.user.vendorId) {
        isVendorOwner = true;
      }
    }

    const isRecentlyCreated =
      Date.now() - new Date(booking.createdAt).getTime() < 15 * 60 * 1000;

    if (!isAdmin && !isOwner && !isVendorOwner && !isRecentlyCreated) {
      return new NextResponse("Forbidden: Access to voucher denied", { status: 403 });
    }

    const isConfirmed =
      booking.status === "CONFIRMED" || booking.paymentStatus === "PAID";
    const voucherTitle = isConfirmed
      ? `Official Travel Voucher - ${booking.bookingNumber}`
      : `Booking Request Received - ${booking.bookingNumber}`;
    const voucherHeaderSubtitle = isConfirmed
      ? "Official Traveler Check-in Voucher"
      : "Booking Request Awaiting Payment / Confirmation";
    const statusBadgeBg = isConfirmed ? "#22c55e" : "#f59e0b";
    const statusLabel = isConfirmed ? "CONFIRMED" : "PENDING CONFIRMATION";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${voucherTitle}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 24px; background: #fff; }
    .voucher-card { max-width: 800px; margin: 0 auto; border: 2px solid #0f172a; border-radius: 16px; overflow: hidden; }
    .header { background: #0A5C36; color: #fff; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header .ref { text-align: right; }
    .header .ref-num { font-size: 18px; font-family: monospace; font-weight: 800; color: #fef08a; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 4px; background: ${statusBadgeBg}; color: #fff; }
    .body { padding: 32px; }
    .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
    .field-label { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; }
    .field-val { font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px; }
    .receipt-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .receipt-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
    .receipt-total { border-top: 2px dashed #94a3b8; padding-top: 10px; margin-top: 10px; font-size: 16px; font-weight: 800; color: #0A5C36; }
    .footer { background: #f1f5f9; padding: 16px 32px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
      .voucher-card { border: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 800px; margin: 0 auto 16px; text-align: right;">
    <button onclick="window.print()" style="background: #0A5C36; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="voucher-card">
    <div class="header">
      <div>
        <h1>PakistanTravel.agency</h1>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.9;">${voucherHeaderSubtitle}</p>
      </div>
      <div class="ref">
        <div class="field-label" style="color: #cbd5e1;">Booking Reference</div>
        <div class="ref-num">${booking.bookingNumber}</div>
        <div class="status-badge">${statusLabel}</div>
      </div>
    </div>

    <div class="body">
      <div class="section-title">Tour & Experience Details</div>
      <div class="grid">
        <div>
          <div class="field-label">Package Name</div>
          <div class="field-val">${booking.listingTitle}</div>
        </div>
        <div>
          <div class="field-label">Destination & City</div>
          <div class="field-val">${booking.destination}</div>
        </div>
        <div>
          <div class="field-label">Departure / Start Date</div>
          <div class="field-val" style="color: #0A5C36;">${booking.startDate} (06:00 AM)</div>
        </div>
        <div>
          <div class="field-label">Return / End Date</div>
          <div class="field-val">${booking.endDate}</div>
        </div>
        <div>
          <div class="field-label">Travelers / Seats Booked</div>
          <div class="field-val">${booking.guestsCount} Traveler(s) · ${booking.isSoloTraveler ? "Solo Room Supplement Included" : "Twin Sharing Package"}</div>
        </div>
        <div>
          <div class="field-label">Accommodation Package</div>
          <div class="field-val">${booking.unitTitle}</div>
        </div>
      </div>

      <div class="section-title">Your Host for This Trip</div>
      <div class="grid">
        <div>
          <div class="field-label">Host Company</div>
          <div class="field-val">${booking.vendor?.businessName || "Local Partner Operator"}</div>
        </div>
        <div>
          <div class="field-label">Host Location / Base</div>
          <div class="field-val">${booking.vendor?.city || booking.destination}</div>
        </div>
        <div>
          <div class="field-label">Host WhatsApp</div>
          <div class="field-val">${isConfirmed && (booking.vendor?.whatsapp || booking.vendor?.phone) ? `<a href="https://wa.me/${(booking.vendor.whatsapp || booking.vendor.phone || '').replace(/\\D/g, '')}" style="color: #0A5C36; font-weight: 700;">${booking.vendor.whatsapp || booking.vendor.phone}</a>` : '<span style="color: #64748b; font-style: italic;">Released upon payment confirmation</span>'}</div>
        </div>
        <div>
          <div class="field-label">Host Direct Phone</div>
          <div class="field-val">${isConfirmed && booking.vendor?.phone ? booking.vendor.phone : '<span style="color: #64748b; font-style: italic;">Released upon payment confirmation</span>'}</div>
        </div>
      </div>

      <div class="section-title">Primary Traveler Information</div>
      <div class="grid">
        <div>
          <div class="field-label">Lead Passenger Name</div>
          <div class="field-val">${booking.guestName}</div>
        </div>
        <div>
          <div class="field-label">Phone / WhatsApp Contact</div>
          <div class="field-val">${booking.guestPhone}</div>
        </div>
        <div>
          <div class="field-label">Email Address</div>
          <div class="field-val">${booking.guestEmail}</div>
        </div>
        <div>
          <div class="field-label">CNIC / Passport Number</div>
          <div class="field-val">${booking.cnicOrPassport}</div>
        </div>
      </div>

      <div class="section-title">Payment & Financial Breakdown (PKR)</div>
      <div class="receipt-box">
        <div class="receipt-row">
          <span>Total Booking Amount:</span>
          <span style="font-weight: 700;">PKR ${booking.totalAmount.toLocaleString()}</span>
        </div>
        <div class="receipt-row">
          <span>Deposit Paid Online (${booking.paymentMethod}):</span>
          <span style="color: #16a34a; font-weight: 700;">PKR ${(booking.depositAmount || booking.totalAmount).toLocaleString()}</span>
        </div>
        <div class="receipt-row">
          <span>Remaining Balance Due on Arrival:</span>
          <span style="color: #ea580c; font-weight: 700;">PKR ${(booking.balanceDue || 0).toLocaleString()}</span>
        </div>
        <div class="receipt-row receipt-total">
          <span>Payment Status:</span>
          <span>${booking.paymentStatus === "PAID" ? "VERIFIED & CONFIRMED" : "PENDING AT DESK"}</span>
        </div>
      </div>

      <div style="font-size: 11px; color: #64748b; line-height: 1.6; margin-top: 12px; padding: 10px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
        <strong>Standard Cancellation Policy:</strong> ${siteConfig.cancellationPolicy.summary}<br/>
        <strong style="margin-top: 4px; display: inline-block;">Check-in Notice:</strong> Present this voucher and original CNIC/Passport at departure check-in. Warm alpine clothing required for high-altitude passes.
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0;">PakistanTravel.Agency · Multi-Vendor Tourism Marketplace</p>
      <p style="margin: 4px 0 0;">Customer Support: ${siteConfig.contact.supportEmail} · AI Assistant 24/7</p>
    </div>
  </div>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("Voucher generation error:", error);
    return new NextResponse("Error generating voucher", { status: 500 });
  }
}
