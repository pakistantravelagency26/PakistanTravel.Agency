import { BookingRecord } from "@/services/booking.service";
import { siteConfig } from "@/config/site";

export interface NotificationPayload {
  toEmail: string;
  toPhone: string;
  guestName: string;
  bookingNumber: string;
  listingTitle: string;
  dates: string;
  totalAmount: number;
}

export function generateBookingConfirmationHtml(booking: BookingRecord): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Booking Confirmation - PakistanTravel.agency</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
          .header { background: #0A5C36; padding: 28px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
          .badge { display: inline-block; background: #F59E0B; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 8px; }
          .content { padding: 28px; }
          .booking-box { background: #f1f5f9; border-radius: 12px; padding: 18px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
          .label { color: #64748b; font-weight: 500; }
          .value { color: #0f172a; font-weight: 700; }
          .total { border-top: 2px dashed #cbd5e1; padding-top: 12px; margin-top: 12px; font-size: 16px; color: #0A5C36; font-weight: 800; }
          .button { display: inline-block; background: #0A5C36; color: #ffffff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 18px; text-align: center; }
          .footer { background: #0f172a; color: #94a3b8; padding: 20px; text-align: center; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PakistanTravel.agency</h1>
            <div class="badge">Booking Confirmed & Guaranteed</div>
          </div>
          <div class="content">
            <h2>Assalam-o-Alaikum, ${booking.guestName}!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Your reservation for <strong>${booking.listingTitle}</strong> in ${booking.destination} is successfully confirmed.
            </p>
            <div class="booking-box">
              <div class="row">
                <span class="label">Booking Reference:</span>
                <span class="value" style="color: #0A5C36; font-family: monospace;">${booking.bookingNumber}</span>
              </div>
              <div class="row">
                <span class="label">Room / Package:</span>
                <span class="value">${booking.unitTitle}</span>
              </div>
              <div class="row">
                <span class="label">Dates:</span>
                <span class="value">${booking.startDate} to ${booking.endDate} (${booking.nightsCount} Nights)</span>
              </div>
              <div class="row">
                <span class="label">Payment Status:</span>
                <span class="value">${booking.paymentStatus === "PAID" ? "Paid in full (PKR)" : "Pay at property desk"}</span>
              </div>
              <div class="row total">
                <span>Total Amount:</span>
                <span>PKR ${booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <div style="background: #f8fafc; border-radius: 12px; padding: 14px; margin: 16px 0; border: 1px solid #e2e8f0;">
              <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 4px;">Your Host for this trip:</span>
              <strong style="color: #0f172a; font-size: 13px;">${booking.vendor?.businessName || "Local Partner Operator"}</strong>
              ${booking.vendor?.phone ? `<div style="font-size: 12px; color: #475569; margin-top: 4px;">Host Phone: <strong>${booking.vendor.phone}</strong></div>` : ""}
              ${booking.vendor?.whatsapp ? `<div style="font-size: 12px; color: #0A5C36; margin-top: 2px;">Host WhatsApp: <strong>${booking.vendor.whatsapp}</strong></div>` : ""}
            </div>
            <p style="font-size: 12px; color: #64748b;">
              Please present this voucher or your CNIC (${booking.cnicOrPassport}) at check-in.
            </p>
            <div style="text-align: center;">
              <a href="https://pakistantravel.agency/confirmation/${booking.bookingNumber}" class="button">
                Download Official Travel Voucher (PDF)
              </a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${siteConfig.name}. Northern Pakistan Tourism Marketplace.</p>
            <p>Support: ${siteConfig.contact.supportEmail}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generateWhatsAppMessage(booking: BookingRecord): string {
  return `*Booking Confirmed - ${siteConfig.name}* 🇵🇰
Assalam-o-Alaikum ${booking.guestName},

Your reservation has been confirmed:
*Booking Ref:* ${booking.bookingNumber}
*Stay:* ${booking.listingTitle}
*Host:* ${booking.vendor?.businessName || "Local Partner Operator"}
${booking.vendor?.whatsapp || booking.vendor?.phone ? `*Host Contact:* ${booking.vendor.whatsapp || booking.vendor.phone}\n` : ""}*Dates:* ${booking.startDate} - ${booking.endDate}
*Total:* PKR ${booking.totalAmount.toLocaleString()} (${booking.paymentStatus})

View & Download your Check-in Voucher:
https://pakistantravel.agency/confirmation/${booking.bookingNumber}

Customer Support: ${siteConfig.contact.supportEmail}
Safe travels to the Northern Areas!`;
}
