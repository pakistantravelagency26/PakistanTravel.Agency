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

let cachedTransporter: nodemailer.Transporter | null = null;

function getMailTransporter(): nodemailer.Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (host && user && pass) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });
    return cachedTransporter;
  }

  return null;
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

  const fromAddress = process.env.SMTP_FROM || `PakistanTravel.Agency <no-reply@${siteConfig.domain}>`;
  const transporter = getMailTransporter();

  try {
    if (transporter) {
      await transporter.sendMail({
        from: fromAddress,
        to: item.to,
        subject: item.subject,
        text: item.textBody,
        html: item.htmlBody,
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

  // 1. Customer Confirmation Email
  const customerEmail = buildCustomerBookingConfirmationEmail(emailData);
  const customerOutboxId = await queueEmail({
    to: booking.guestEmail,
    recipientRole: "CUSTOMER",
    subject: customerEmail.subject,
    htmlBody: customerEmail.html,
    textBody: customerEmail.text,
    bookingId: booking.id,
    eventType: "BOOKING_CONFIRMED",
  });
  await deliverOutboxEmail(customerOutboxId);

  // 2. Vendor Alert Email (if vendor email exists)
  let vendorOutboxId: string | undefined = undefined;
  if (emailData.vendorEmail) {
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
  }

  // 3. Admin Alerts (to all configured ops emails)
  const adminEmail = buildAdminBookingAlertEmail(emailData);
  const adminOutboxIds: string[] = [];
  for (const adminTo of ADMIN_NOTIFICATION_EMAILS) {
    if (adminTo && adminTo.includes("@")) {
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
  for (const adminTo of ADMIN_NOTIFICATION_EMAILS) {
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
