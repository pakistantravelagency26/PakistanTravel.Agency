import { prisma } from "../lib/prisma.ts";
import { ADMIN_NOTIFICATION_EMAILS, siteConfig } from "../config/site.ts";
import type { BookingEmailData } from "./emailTemplates.service.ts";
import {
  buildCustomerBookingConfirmationEmail,
  buildVendorBookingAlertEmail,
  buildAdminBookingAlertEmail,
  buildCustomerCancellationEmail,
  buildVendorCancellationEmail,
  buildAdminCancellationEmail,
} from "./emailTemplates.service.ts";
import { getBookingEmailSettings, type BookingEmailSettings } from "./emailSettings.service.ts";
import nodemailer from "nodemailer";

export interface OutboxMessage {
  to: string;
  recipientRole: "CUSTOMER" | "VENDOR" | "ADMIN";
  subject: string;
  htmlBody: string;
  textBody: string;
  bookingId?: string;
  eventType: "BOOKING_CONFIRMED" | "BOOKING_CANCELLED" | "PAYMENT_RECEIVED";
}

let cachedTransporter: {
  transporter: nodemailer.Transporter | null;
  cacheKey: string;
} | null = null;

export function resetMailTransporter(): void {
  cachedTransporter = null;
}

export async function getMailTransporter(): Promise<{
  transporter: nodemailer.Transporter | null;
  settings: BookingEmailSettings;
}> {
  const settings = await getBookingEmailSettings();

  if (!settings.enabled) {
    return { transporter: null, settings };
  }

  const host = settings.smtpHost;
  const port = Number(settings.smtpPort || 587);
  const user = settings.smtpUser;
  const pass = settings.smtpPass;

  if (host && user && pass) {
    const cacheKey = `${host}:${port}:${user}:${settings.smtpSecure}`;
    if (cachedTransporter && cachedTransporter.cacheKey === cacheKey) {
      return { transporter: cachedTransporter.transporter, settings };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: settings.smtpSecure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });

    cachedTransporter = { transporter, cacheKey };
    return { transporter, settings };
  }

  return { transporter: null, settings };
}

/**
 * Queue an email in the transactional outbox table
 */
export async function queueEmail(msg: OutboxMessage): Promise<string> {
  const record = await prisma.emailOutbox.create({
    data: {
      to: msg.to.trim().toLowerCase(),
      recipientRole: msg.recipientRole,
      subject: msg.subject,
      htmlBody: msg.htmlBody,
      textBody: msg.textBody,
      bookingId: msg.bookingId || null,
      eventType: msg.eventType,
      status: "PENDING",
      attempts: 0,
    },
  });

  return record.id;
}

/**
 * Deliver a single outbox record using configured transport (SMTP or Mock/Dev outbox)
 */
export async function deliverOutboxEmail(outboxId: string): Promise<{ success: boolean; error?: string }> {
  const item = await prisma.emailOutbox.findUnique({
    where: { id: outboxId },
  });

  if (!item || item.status === "SENT") {
    return { success: true };
  }

  const { transporter, settings } = await getMailTransporter();
  const senderName = settings.senderName || "PakistanTravel.Agency";
  const senderEmail = settings.senderEmail || settings.smtpUser || `no-reply@${siteConfig.domain}`;
  const fromAddress = `"${senderName}" <${senderEmail}>`;
  const replyTo = settings.replyTo || undefined;

  try {
    if (transporter && settings.enabled) {
      await transporter.sendMail({
        from: fromAddress,
        to: item.to,
        subject: item.subject,
        text: item.textBody,
        html: item.htmlBody,
        replyTo,
      });
    } else {
      // In staging/development/preview without SMTP credentials:
      // Record simulated delivery in server logs to prevent breaking checkout flows
      console.log(`[EMAIL OUTBOX: DISPATCH] To: ${item.to} | Subject: "${item.subject}" | Role: ${item.recipientRole}`);
    }

    await prisma.emailOutbox.update({
      where: { id: item.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
        attempts: { increment: 1 },
        lastError: null,
      },
    });

    return { success: true };
  } catch (err: any) {
    const errorMessage = err?.message || String(err);
    console.error(`[EMAIL OUTBOX: ERROR] Failed to send to ${item.to}:`, errorMessage);

    const newAttempts = item.attempts + 1;
    await prisma.emailOutbox.update({
      where: { id: item.id },
      data: {
        attempts: newAttempts,
        status: newAttempts >= 5 ? "FAILED" : "PENDING",
        lastError: errorMessage,
      },
    });

    return { success: false, error: errorMessage };
  }
}

/**
 * High-level: Trigger booking confirmation emails for Customer, Vendor, and Platform Admins
 */
export async function sendBookingConfirmationEmails(bookingIdOrNumber: string): Promise<{
  customerOutboxId?: string;
  vendorOutboxId?: string;
  adminOutboxIds: string[];
}> {
  const settings = await getBookingEmailSettings();
  if (!settings.enabled) {
    console.log("[EMAIL OUTBOX] Automatic booking emails disabled in Admin Settings.");
    return { adminOutboxIds: [] };
  }

  const booking = await prisma.booking.findFirst({
    where: {
      OR: [{ id: bookingIdOrNumber }, { bookingNumber: bookingIdOrNumber }],
    },
    include: {
      listing: {
        include: { vendor: { include: { user: true } }, destination: true },
      },
      unit: true,
      user: true,
      payment: true,
    },
  });

  if (!booking) {
    console.warn(`[EMAIL OUTBOX] Booking ${bookingIdOrNumber} not found for email dispatch`);
    return { adminOutboxIds: [] };
  }

  // Trigger emails ONLY when booking status is CONFIRMED
  if (booking.status !== "CONFIRMED") {
    console.log(
      `[EMAIL OUTBOX] Skipping confirmation emails: Booking ${booking.bookingNumber} is '${booking.status}', not 'CONFIRMED'.`
    );
    return { adminOutboxIds: [] };
  }

  const emailData: BookingEmailData = {
    bookingNumber: booking.bookingNumber,
    listingTitle: booking.listing.title,
    unitTitle: booking.unit?.title || undefined,
    destination: booking.listing.destination?.name || "Northern Pakistan",
    startDate: booking.startDate.toISOString().split("T")[0],
    endDate: booking.endDate.toISOString().split("T")[0],
    nightsCount: Math.max(1, Math.round((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24))),
    guestsCount: booking.guestsCount,
    totalAmount: Number(booking.totalAmount),
    depositAmount: Number(booking.depositAmount || 0),
    balanceDue: Number(booking.balanceDue || 0),
    paymentMethod: booking.payment?.paymentMethod || "CASH_ON_ARRIVAL",
    paymentStatus: booking.payment?.status || booking.status,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    specialRequests: booking.specialRequests,
    vendorBusinessName: booking.listing.vendor?.businessName,
    vendorPhone: booking.listing.vendor?.phone || undefined,
    vendorWhatsapp: booking.listing.vendor?.whatsapp || undefined,
    vendorEmail: booking.listing.vendor?.user?.email,
    commissionRate: booking.listing.commissionRate || undefined,
  };

  const bookingId = booking.id;

  // Helper for deduplication: check if an email of this role was already queued or delivered
  async function getExistingOutbox(role: "CUSTOMER" | "VENDOR" | "ADMIN", to?: string): Promise<string | null> {
    const existing = await prisma.emailOutbox.findFirst({
      where: {
        bookingId,
        recipientRole: role,
        eventType: "BOOKING_CONFIRMED",
        ...(to ? { to: to.trim().toLowerCase() } : {}),
      },
    });
    return existing ? existing.id : null;
  }

  // 1. Customer Confirmation Email
  let customerOutboxId: string | undefined;
  const existingCustomer = await getExistingOutbox("CUSTOMER");
  if (existingCustomer) {
    customerOutboxId = existingCustomer;
  } else {
    const customerEmail = buildCustomerBookingConfirmationEmail(emailData);
    customerOutboxId = await queueEmail({
      to: booking.guestEmail,
      recipientRole: "CUSTOMER",
      subject: customerEmail.subject,
      htmlBody: customerEmail.html,
      textBody: customerEmail.text,
      bookingId: booking.id,
      eventType: "BOOKING_CONFIRMED",
    });
    await deliverOutboxEmail(customerOutboxId);
  }

  // 2. Vendor Alert Email
  let vendorOutboxId: string | undefined;
  const existingVendor = await getExistingOutbox("VENDOR");
  if (existingVendor) {
    vendorOutboxId = existingVendor;
  } else if (emailData.vendorEmail && emailData.vendorEmail.includes("@")) {
    const vendorEmail = buildVendorBookingAlertEmail(emailData);
    vendorOutboxId = await queueEmail({
      to: emailData.vendorEmail,
      recipientRole: "VENDOR",
      subject: vendorEmail.subject,
      htmlBody: vendorEmail.html,
      textBody: vendorEmail.text,
      bookingId: booking.id,
      eventType: "BOOKING_CONFIRMED",
    });
    await deliverOutboxEmail(vendorOutboxId);
  } else {
    // If vendor email address is not configured, record that in the outbox / Admin panel,
    // continue delivering the admin and client copies, and do not crash the checkout flow.
    console.warn(`[EMAIL OUTBOX] Vendor email missing for listing "${booking.listing.title}" on booking ${booking.bookingNumber}`);
    vendorOutboxId = await queueEmail({
      to: "vendor-missing@platform.internal",
      recipientRole: "VENDOR",
      subject: `[ACTION REQUIRED] Missing Vendor Email: ${booking.bookingNumber} (${booking.listing.title})`,
      htmlBody: `<p>Warning: No email address configured for tour operator "${booking.listing.vendor?.businessName || "Unknown"}". Fulfilment alert requires manual dispatch.</p>`,
      textBody: `Warning: No email address configured for tour operator "${booking.listing.vendor?.businessName || "Unknown"}". Fulfilment alert requires manual dispatch.`,
      bookingId: booking.id,
      eventType: "BOOKING_CONFIRMED",
    });
    await prisma.emailOutbox.update({
      where: { id: vendorOutboxId },
      data: {
        status: "FAILED",
        attempts: 1,
        lastError: "Vendor email address not configured. Fulfilment alert requires manual follow-up.",
      },
    });
  }

  // 3. Admin Alerts (to configured admin email from settings)
  const adminEmail = buildAdminBookingAlertEmail(emailData);
  const adminOutboxIds: string[] = [];
  const primaryAdmin = settings.adminEmail || (ADMIN_NOTIFICATION_EMAILS && ADMIN_NOTIFICATION_EMAILS[0]);
  const adminRecipients = Array.from(new Set([primaryAdmin, ...ADMIN_NOTIFICATION_EMAILS].filter(Boolean)));

  for (const adminTo of adminRecipients) {
    if (adminTo && adminTo.includes("@")) {
      const existingAdmin = await getExistingOutbox("ADMIN", adminTo);
      if (existingAdmin) {
        adminOutboxIds.push(existingAdmin);
      } else {
        const adminOutboxId = await queueEmail({
          to: adminTo,
          recipientRole: "ADMIN",
          subject: adminEmail.subject,
          htmlBody: adminEmail.html,
          textBody: adminEmail.text,
          bookingId: booking.id,
          eventType: "BOOKING_CONFIRMED",
        });
        await deliverOutboxEmail(adminOutboxId);
        adminOutboxIds.push(adminOutboxId);
      }
    }
  }

  return { customerOutboxId, vendorOutboxId, adminOutboxIds };
}

/**
 * High-level: Trigger cancellation emails for Customer, Vendor, and Platform Admins
 */
export async function sendBookingCancellationEmails(bookingIdOrNumber: string): Promise<{
  customerOutboxId?: string;
  vendorOutboxId?: string;
  adminOutboxIds: string[];
}> {
  const settings = await getBookingEmailSettings();
  if (!settings.enabled) {
    return { adminOutboxIds: [] };
  }

  const booking = await prisma.booking.findFirst({
    where: {
      OR: [{ id: bookingIdOrNumber }, { bookingNumber: bookingIdOrNumber }],
    },
    include: {
      listing: {
        include: { vendor: { include: { user: true } }, destination: true },
      },
      payment: true,
    },
  });

  if (!booking) {
    return { adminOutboxIds: [] };
  }

  const emailData: BookingEmailData = {
    bookingNumber: booking.bookingNumber,
    listingTitle: booking.listing.title,
    destination: booking.listing.destination?.name || "Northern Pakistan",
    startDate: booking.startDate.toISOString().split("T")[0],
    endDate: booking.endDate.toISOString().split("T")[0],
    nightsCount: 1,
    guestsCount: booking.guestsCount,
    totalAmount: Number(booking.totalAmount),
    depositAmount: Number(booking.depositAmount || 0),
    balanceDue: Number(booking.balanceDue || 0),
    paymentMethod: booking.payment?.paymentMethod || "CASH_ON_ARRIVAL",
    paymentStatus: "CANCELLED",
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    vendorBusinessName: booking.listing.vendor?.businessName,
    vendorEmail: booking.listing.vendor?.user?.email,
  };

  // 1. Customer Cancellation
  const customerEmail = buildCustomerCancellationEmail(emailData);
  const customerOutboxId = await queueEmail({
    to: booking.guestEmail,
    recipientRole: "CUSTOMER",
    subject: customerEmail.subject,
    htmlBody: customerEmail.html,
    textBody: customerEmail.text,
    bookingId: booking.id,
    eventType: "BOOKING_CANCELLED",
  });
  await deliverOutboxEmail(customerOutboxId);

  // 2. Vendor Cancellation
  let vendorOutboxId: string | undefined = undefined;
  if (emailData.vendorEmail) {
    const vendorEmail = buildVendorCancellationEmail(emailData);
    vendorOutboxId = await queueEmail({
      to: emailData.vendorEmail,
      recipientRole: "VENDOR",
      subject: vendorEmail.subject,
      htmlBody: vendorEmail.html,
      textBody: vendorEmail.text,
      bookingId: booking.id,
      eventType: "BOOKING_CANCELLED",
    });
    await deliverOutboxEmail(vendorOutboxId);
  }

  // 3. Admin Alerts
  const adminEmail = buildAdminCancellationEmail(emailData);
  const adminOutboxIds: string[] = [];
  const primaryAdmin = settings.adminEmail || (ADMIN_NOTIFICATION_EMAILS && ADMIN_NOTIFICATION_EMAILS[0]);
  const adminRecipients = Array.from(new Set([primaryAdmin, ...ADMIN_NOTIFICATION_EMAILS].filter(Boolean)));

  for (const adminTo of adminRecipients) {
    if (adminTo && adminTo.includes("@")) {
      const adminOutboxId = await queueEmail({
        to: adminTo,
        recipientRole: "ADMIN",
        subject: adminEmail.subject,
        htmlBody: adminEmail.html,
        textBody: adminEmail.text,
        bookingId: booking.id,
        eventType: "BOOKING_CANCELLED",
      });
      await deliverOutboxEmail(adminOutboxId);
      adminOutboxIds.push(adminOutboxId);
    }
  }

  return { customerOutboxId, vendorOutboxId, adminOutboxIds };
}

/**
 * Background / Retry Engine: Process pending emails with retry limit (< 5 attempts)
 */
export async function processPendingEmailOutbox(batchSize: number = 25, specificIds?: string[]): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
}> {
  const whereClause: any = {
    status: "PENDING",
    attempts: { lt: 5 },
  };
  if (specificIds && specificIds.length > 0) {
    whereClause.id = { in: specificIds };
  }

  const pending = await prisma.emailOutbox.findMany({
    where: whereClause,
    orderBy: { createdAt: "asc" },
    take: batchSize,
  });

  let succeeded = 0;
  let failed = 0;

  for (const item of pending) {
    const res = await deliverOutboxEmail(item.id);
    if (res.success) {
      succeeded++;
    } else {
      failed++;
    }
  }

  return {
    processed: pending.length,
    succeeded,
    failed,
  };
}
