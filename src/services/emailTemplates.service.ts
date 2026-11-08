import { siteConfig, SITE_URL, COMMISSION_PERCENT, PAYOUT_TIMING } from "../config/site.ts";

export interface BookingEmailData {
  bookingNumber: string;
  listingTitle: string;
  unitTitle?: string;
  destination: string;
  startDate: string;
  endDate: string;
  nightsCount: number;
  guestsCount: number;
  totalAmount: number;
  depositAmount: number;
  balanceDue: number;
  paymentMethod: string;
  paymentStatus: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string | null;
  vendorBusinessName?: string;
  vendorPhone?: string;
  vendorWhatsapp?: string;
  vendorEmail?: string;
  commissionRate?: number;
}

// Common email styling
const EMAIL_STYLES = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
  .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
  .header { background: #0A5C36; padding: 28px 24px; text-align: center; color: #ffffff; }
  .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
  .header .tag { display: inline-block; background: rgba(255, 255, 255, 0.2); color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 8px; }
  .body { padding: 28px 24px; }
  .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; }
  .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; line-height: 1.5; }
  .label { color: #64748b; font-weight: 500; }
  .val { color: #0f172a; font-weight: 700; text-align: right; }
  .total-row { border-top: 2px dashed #cbd5e1; padding-top: 10px; margin-top: 10px; font-size: 15px; color: #0A5C36; font-weight: 800; }
  .btn { display: inline-block; background: #0A5C36; color: #ffffff !important; padding: 13px 26px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin: 18px 0; text-align: center; }
  .footer { background: #0f172a; color: #94a3b8; padding: 20px; text-align: center; font-size: 11px; line-height: 1.6; }
  .notice { font-size: 12px; color: #64748b; background: #f1f5f9; padding: 12px; border-radius: 8px; margin-top: 16px; border-left: 3px solid #0A5C36; }
`;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * 1. Traveler Confirmation Email
 */
export function buildCustomerBookingConfirmationEmail(data: BookingEmailData) {
  const subject = `Booking Confirmed: ${data.bookingNumber} - ${data.listingTitle}`;
  const voucherUrl = `${SITE_URL}/confirmation/${data.bookingNumber}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(subject)}</title>
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>PakistanTravel.Agency</h1>
            <div class="tag">Booking Confirmed & Guaranteed</div>
          </div>
          <div class="body">
            <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Assalam-o-Alaikum, ${escapeHtml(data.guestName)}!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Your reservation for <strong>${escapeHtml(data.listingTitle)}</strong> in <strong>${escapeHtml(data.destination)}</strong> has been confirmed.
            </p>
            <div class="box">
              <div class="row">
                <span class="label">Booking Reference:</span>
                <span class="val" style="font-family: monospace; color: #0A5C36;">${data.bookingNumber}</span>
              </div>
              <div class="row">
                <span class="label">Listing:</span>
                <span class="val">${escapeHtml(data.listingTitle)}</span>
              </div>
              ${data.unitTitle ? `
              <div class="row">
                <span class="label">Package / Room:</span>
                <span class="val">${escapeHtml(data.unitTitle)}</span>
              </div>` : ""}
              <div class="row">
                <span class="label">Dates:</span>
                <span class="val">${data.startDate} to ${data.endDate} (${data.nightsCount} Nights)</span>
              </div>
              <div class="row">
                <span class="label">Guests:</span>
                <span class="val">${data.guestsCount} Person(s)</span>
              </div>
              <div class="row">
                <span class="label">Payment Status:</span>
                <span class="val">${data.paymentStatus === "PAID" ? "Paid in full (PKR)" : "Pending / Pay at Check-in"}</span>
              </div>
              ${data.depositAmount > 0 ? `
              <div class="row">
                <span class="label">Deposit Paid:</span>
                <span class="val">PKR ${data.depositAmount.toLocaleString()}</span>
              </div>` : ""}
              ${data.balanceDue > 0 ? `
              <div class="row">
                <span class="label">Balance Due at Check-in:</span>
                <span class="val" style="color: #d97706;">PKR ${data.balanceDue.toLocaleString()}</span>
              </div>` : ""}
              <div class="row total-row">
                <span>Total Amount:</span>
                <span>PKR ${data.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div style="background: #f1f5f9; border-radius: 10px; padding: 14px; margin-bottom: 20px;">
              <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 6px;">Your Host / Tour Operator:</span>
              <strong style="color: #0f172a; font-size: 14px;">${escapeHtml(data.vendorBusinessName || "Local Verified Partner")}</strong>
              ${data.vendorPhone ? `<div style="font-size: 13px; color: #475569; margin-top: 4px;">Host Contact: <strong>${escapeHtml(data.vendorPhone)}</strong></div>` : ""}
              ${data.vendorWhatsapp ? `<div style="font-size: 13px; color: #0A5C36; margin-top: 2px;">Host WhatsApp: <strong>${escapeHtml(data.vendorWhatsapp)}</strong></div>` : ""}
            </div>

            <div style="text-align: center; margin: 24px 0;">
              <a href="${voucherUrl}" class="btn">View & Download Official Travel Voucher</a>
            </div>

            <div class="notice">
              <strong>Cancellation Policy:</strong> ${escapeHtml(siteConfig.cancellationPolicy.summary)}
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${siteConfig.name}. Northern Pakistan Tourism Marketplace.</p>
            <p>Support: ${siteConfig.contact.supportEmail} (${siteConfig.contact.supportHours.humanEmail})</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Booking Confirmed - ${siteConfig.name}
Assalam-o-Alaikum ${data.guestName},

Your reservation has been confirmed:
- Booking Reference: ${data.bookingNumber}
- Listing: ${data.listingTitle}
- Destination: ${data.destination}
- Dates: ${data.startDate} to ${data.endDate} (${data.nightsCount} Nights)
- Guests: ${data.guestsCount} Person(s)
- Total Amount: PKR ${data.totalAmount.toLocaleString()} (${data.paymentStatus})
${data.balanceDue > 0 ? `- Balance Due at Check-in: PKR ${data.balanceDue.toLocaleString()}\n` : ""}- Host / Operator: ${data.vendorBusinessName || "Local Verified Partner"}
${data.vendorPhone ? `- Host Contact: ${data.vendorPhone}\n` : ""}
Download your Official Travel Voucher:
${voucherUrl}

Cancellation Policy: ${siteConfig.cancellationPolicy.summary}
Support: ${siteConfig.contact.supportEmail}`;

  return { subject, html, text };
}

/**
 * 2. Vendor / Host Booking Alert Email
 */
export function buildVendorBookingAlertEmail(data: BookingEmailData) {
  const subject = `New Booking Received! Ref: ${data.bookingNumber} (${data.listingTitle})`;
  const portalUrl = `${SITE_URL}/partner-hub/bookings`;
  const rate = data.commissionRate || COMMISSION_PERCENT;
  const platformFee = Math.round((data.totalAmount * rate) / 100);
  const vendorEarnings = data.totalAmount - platformFee;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(subject)}</title>
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header" style="background: #0f766e;">
            <h1>PakistanTravel.Agency Partner Hub</h1>
            <div class="tag">New Booking Notification</div>
          </div>
          <div class="body">
            <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Assalam-o-Alaikum, ${escapeHtml(data.vendorBusinessName || "Partner")}!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              You have received a new confirmed booking for <strong>${escapeHtml(data.listingTitle)}</strong>.
            </p>
            <div class="box">
              <div class="row">
                <span class="label">Booking Reference:</span>
                <span class="val" style="font-family: monospace; color: #0f766e;">${data.bookingNumber}</span>
              </div>
              <div class="row">
                <span class="label">Guest Name:</span>
                <span class="val">${escapeHtml(data.guestName)}</span>
              </div>
              <div class="row">
                <span class="label">Guest Phone:</span>
                <span class="val">${escapeHtml(data.guestPhone)}</span>
              </div>
              <div class="row">
                <span class="label">Guest Email:</span>
                <span class="val">${escapeHtml(data.guestEmail)}</span>
              </div>
              <div class="row">
                <span class="label">Dates:</span>
                <span class="val">${data.startDate} to ${data.endDate} (${data.nightsCount} Nights)</span>
              </div>
              <div class="row">
                <span class="label">Total Guests:</span>
                <span class="val">${data.guestsCount} Person(s)</span>
              </div>
              ${data.specialRequests ? `
              <div class="row">
                <span class="label">Special Requests / Notes:</span>
                <span class="val">${escapeHtml(data.specialRequests)}</span>
              </div>` : ""}
              <div class="row" style="border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px;">
                <span class="label">Gross Booking Value:</span>
                <span class="val">PKR ${data.totalAmount.toLocaleString()}</span>
              </div>
              <div class="row">
                <span class="label">Platform Commission (${rate}%):</span>
                <span class="val" style="color: #64748b;">- PKR ${platformFee.toLocaleString()}</span>
              </div>
              <div class="row total-row" style="color: #0f766e;">
                <span>Net Vendor Earnings:</span>
                <span>PKR ${vendorEarnings.toLocaleString()}</span>
              </div>
            </div>

            <div class="notice">
              <strong>Payout Timing:</strong> Platform payouts are processed <strong>${PAYOUT_TIMING}</strong> to your registered bank account / Raast ID.
            </div>

            <div style="text-align: center; margin: 24px 0;">
              <a href="${portalUrl}" class="btn" style="background: #0f766e;">Open Partner Hub Bookings</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${siteConfig.name} Partner Support.</p>
            <p>Vendor Support Desk: ${siteConfig.contact.supportEmail}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `New Booking Received - ${siteConfig.name} Partner Hub
Assalam-o-Alaikum ${data.vendorBusinessName || "Partner"},

A new reservation has been made:
- Booking Reference: ${data.bookingNumber}
- Listing: ${data.listingTitle}
- Guest: ${data.guestName} (${data.guestPhone}, ${data.guestEmail})
- Dates: ${data.startDate} to ${data.endDate} (${data.nightsCount} Nights)
- Guests: ${data.guestsCount} Person(s)
- Gross Amount: PKR ${data.totalAmount.toLocaleString()}
- Platform Commission (${rate}%): PKR ${platformFee.toLocaleString()}
- Net Vendor Earnings: PKR ${vendorEarnings.toLocaleString()}

Payout Timing: ${PAYOUT_TIMING}
Manage in Partner Hub: ${portalUrl}`;

  return { subject, html, text };
}

/**
 * 3. Super Admin Real-time Booking Alert Email
 */
export function buildAdminBookingAlertEmail(data: BookingEmailData) {
  const subject = `[Admin Alert] New Marketplace Booking: ${data.bookingNumber} (PKR ${data.totalAmount.toLocaleString()})`;
  const adminUrl = `${SITE_URL}/secure-admin/bookings`;
  const rate = data.commissionRate || COMMISSION_PERCENT;
  const platformFee = Math.round((data.totalAmount * rate) / 100);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(subject)}</title>
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header" style="background: #1e293b;">
            <h1>PakistanTravel.Agency Ops</h1>
            <div class="tag">Marketplace Booking Transaction</div>
          </div>
          <div class="body">
            <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">New Booking Alert</h2>
            <div class="box">
              <div class="row">
                <span class="label">Reference:</span>
                <span class="val" style="font-family: monospace;">${data.bookingNumber}</span>
              </div>
              <div class="row">
                <span class="label">Listing:</span>
                <span class="val">${escapeHtml(data.listingTitle)}</span>
              </div>
              <div class="row">
                <span class="label">Vendor:</span>
                <span class="val">${escapeHtml(data.vendorBusinessName || "Unassigned")}</span>
              </div>
              <div class="row">
                <span class="label">Customer:</span>
                <span class="val">${escapeHtml(data.guestName)} (${escapeHtml(data.guestEmail)})</span>
              </div>
              <div class="row">
                <span class="label">Dates:</span>
                <span class="val">${data.startDate} to ${data.endDate}</span>
              </div>
              <div class="row">
                <span class="label">Payment Status / Method:</span>
                <span class="val">${data.paymentStatus} via ${data.paymentMethod}</span>
              </div>
              <div class="row">
                <span class="label">Gross Total:</span>
                <span class="val">PKR ${data.totalAmount.toLocaleString()}</span>
              </div>
              <div class="row total-row" style="color: #0f172a;">
                <span>Platform Commission (${rate}%):</span>
                <span>PKR ${platformFee.toLocaleString()}</span>
              </div>
            </div>

            <div style="text-align: center; margin: 24px 0;">
              <a href="${adminUrl}" class="btn" style="background: #1e293b;">View in Secure Admin</a>
            </div>
          </div>
          <div class="footer">
            <p>Automated Operational Alert • PakistanTravel.Agency Internal Security</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `[Admin Alert] New Marketplace Booking
Reference: ${data.bookingNumber}
Listing: ${data.listingTitle}
Vendor: ${data.vendorBusinessName || "Unassigned"}
Customer: ${data.guestName} (${data.guestEmail}, ${data.guestPhone})
Dates: ${data.startDate} to ${data.endDate}
Gross Amount: PKR ${data.totalAmount.toLocaleString()}
Platform Fee (${rate}%): PKR ${platformFee.toLocaleString()}
Payment: ${data.paymentStatus} (${data.paymentMethod})

Admin Portal: ${adminUrl}`;

  return { subject, html, text };
}

/**
 * 4. Cancellation Emails (Customer, Vendor, Admin)
 */
export function buildCustomerCancellationEmail(data: BookingEmailData) {
  const subject = `Booking Cancelled: ${data.bookingNumber} - ${data.listingTitle}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(subject)}</title>
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header" style="background: #dc2626;">
            <h1>PakistanTravel.Agency</h1>
            <div class="tag">Booking Cancellation Notice</div>
          </div>
          <div class="body">
            <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Booking Cancellation Confirmed</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Assalam-o-Alaikum ${escapeHtml(data.guestName)}, your reservation <strong>${data.bookingNumber}</strong> for <strong>${escapeHtml(data.listingTitle)}</strong> has been cancelled.
            </p>
            <div class="box">
              <div class="row">
                <span class="label">Booking Ref:</span>
                <span class="val">${data.bookingNumber}</span>
              </div>
              <div class="row">
                <span class="label">Dates:</span>
                <span class="val">${data.startDate} to ${data.endDate}</span>
              </div>
              <div class="row">
                <span class="label">Total Amount:</span>
                <span class="val">PKR ${data.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <div class="notice">
              <strong>Refund Information:</strong> Refunds are processed strictly in accordance with our policy: ${escapeHtml(siteConfig.cancellationPolicy.summary)}. If eligible, funds will be returned within 3-5 business days.
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${siteConfig.name} Support: ${siteConfig.contact.supportEmail}</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const text = `Booking Cancelled: ${data.bookingNumber}
Assalam-o-Alaikum ${data.guestName}, your reservation for ${data.listingTitle} has been cancelled.
Refund Policy: ${siteConfig.cancellationPolicy.summary}
Support: ${siteConfig.contact.supportEmail}`;
  return { subject, html, text };
}

export function buildVendorCancellationEmail(data: BookingEmailData) {
  const subject = `Booking Cancelled by Guest: Ref: ${data.bookingNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(subject)}</title>
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header" style="background: #b91c1c;">
            <h1>PakistanTravel.Agency Partner Hub</h1>
            <div class="tag">Booking Cancellation</div>
          </div>
          <div class="body">
            <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Guest Booking Cancelled</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              The reservation for <strong>${escapeHtml(data.listingTitle)}</strong> (${data.startDate} to ${data.endDate}) has been cancelled by the guest.
            </p>
            <div class="box">
              <div class="row">
                <span class="label">Booking Ref:</span>
                <span class="val">${data.bookingNumber}</span>
              </div>
              <div class="row">
                <span class="label">Guest:</span>
                <span class="val">${escapeHtml(data.guestName)}</span>
              </div>
              <div class="row">
                <span class="label">Seats / Units:</span>
                <span class="val">Replenished automatically to availability</span>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${siteConfig.name} Partner Hub</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const text = `Booking Cancelled: Ref ${data.bookingNumber}
Listing: ${data.listingTitle}
Guest: ${data.guestName}
Dates: ${data.startDate} to ${data.endDate}
Seats/Units have been returned to available inventory.`;
  return { subject, html, text };
}

export function buildAdminCancellationEmail(data: BookingEmailData) {
  const subject = `[Admin Alert] Booking Cancelled: ${data.bookingNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(subject)}</title>
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header" style="background: #b91c1c;">
            <h1>PakistanTravel.Agency Ops</h1>
            <div class="tag">Cancellation Alert</div>
          </div>
          <div class="body">
            <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Booking Cancelled</h2>
            <div class="box">
              <div class="row">
                <span class="label">Reference:</span>
                <span class="val">${data.bookingNumber}</span>
              </div>
              <div class="row">
                <span class="label">Listing:</span>
                <span class="val">${escapeHtml(data.listingTitle)}</span>
              </div>
              <div class="row">
                <span class="label">Customer:</span>
                <span class="val">${escapeHtml(data.guestName)} (${escapeHtml(data.guestEmail)})</span>
              </div>
              <div class="row">
                <span class="label">Total Amount:</span>
                <span class="val">PKR ${data.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>PakistanTravel.Agency Operations</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const text = `[Admin Alert] Booking Cancelled: ${data.bookingNumber}
Listing: ${data.listingTitle}
Customer: ${data.guestName} (${data.guestEmail})
Total: PKR ${data.totalAmount.toLocaleString()}`;
  return { subject, html, text };
}
