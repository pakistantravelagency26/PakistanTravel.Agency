import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { getBookingEmailSettings } from "@/services/emailSettings.service";
import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";
import { z } from "zod";

export const dynamic = "force-dynamic";

const sendTestSchema = z.object({
  recipient: z.string().email("Please provide a valid recipient email address."),
  smtpHost: z.string().optional(),
  smtpPort: z.number().int().optional(),
  smtpSecure: z.boolean().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
  senderName: z.string().optional(),
  senderEmail: z.string().optional(),
  replyTo: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = sendTestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const currentSettings = await getBookingEmailSettings();

    const host = (parsed.data.smtpHost || currentSettings.smtpHost || "smtp.gmail.com").trim();
    const port = Number(parsed.data.smtpPort || currentSettings.smtpPort || 587);
    const user = (parsed.data.smtpUser || parsed.data.senderEmail || currentSettings.smtpUser || currentSettings.senderEmail || "").trim();

    let pass = (parsed.data.smtpPass || "").trim();
    if (!pass || pass === "••••••••••••••••") {
      pass = currentSettings.smtpPass || "";
    }

    const secure = typeof parsed.data.smtpSecure === "boolean" ? parsed.data.smtpSecure : (port === 465);
    const senderName = (parsed.data.senderName || currentSettings.senderName || "PakistanTravel.Agency").trim();
    const senderEmail = (parsed.data.senderEmail || user || `no-reply@${siteConfig.domain}`).trim();
    const replyTo = parsed.data.replyTo || currentSettings.replyTo || undefined;
    const targetRecipient = parsed.data.recipient.trim().toLowerCase();

    if (!user || !pass) {
      return NextResponse.json(
        {
          success: false,
          message: "Please configure SMTP sender address and App Password before sending a test email.",
        },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 15000,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });

    const nowIso = new Date().toUTCString();
    const testHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #a7f3d0; border-radius: 16px; overflow: hidden; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0A5C36 0%, #047857 100%); color: #ffffff; padding: 24px; text-align: center;">
          <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase;">System Test Notice</span>
          <h2 style="margin: 8px 0 0; font-size: 20px; font-weight: 800;">⚡ PakistanTravel.Agency SMTP Test Email</h2>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Booking Notification &amp; Voucher Dispatch Engine</p>
        </div>
        <div style="padding: 24px; font-size: 13px; color: #334155; line-height: 1.6;">
          <p>Assalam-o-Alaikum,</p>
          <p>This is a <strong>clearly marked diagnostic test email</strong> sent from the <strong>PakistanTravel.Agency Admin Panel</strong>.</p>
          <p>Your Gmail SMTP connection is operational. Confirmed customer vouchers, partner fulfilment notifications, and platform administrator alerts will be delivered automatically.</p>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 18px 0;">
            <div style="margin-bottom: 6px;"><strong>Status:</strong> <span style="color: #0A5C36; font-weight: 700;">CONNECTED &amp; DELIVERING</span></div>
            <div style="margin-bottom: 6px;"><strong>Timestamp:</strong> ${nowIso}</div>
            <div style="margin-bottom: 6px;"><strong>SMTP Server:</strong> ${host}:${port} (${secure ? "Implicit TLS" : "STARTTLS"})</div>
            <div style="margin-bottom: 6px;"><strong>Sender Account:</strong> ${senderEmail}</div>
            <div><strong>Test Recipient:</strong> ${targetRecipient}</div>
          </div>

          <p style="font-size: 12px; color: #64748b;">
            If you did not initiate this test from the Admin Settings dashboard, please inspect recent admin activity logs.
          </p>
        </div>
        <div style="background: #f8fafc; padding: 14px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          PakistanTravel.Agency • Marketplace Operations Control
        </div>
      </div>
    `;

    const testText = `[TEST] PakistanTravel.Agency SMTP Booking Alerts Test
Assalam-o-Alaikum,

This is a test notification confirming that your SMTP booking alerts dispatcher is working properly.
Timestamp: ${nowIso}
Host: ${host}:${port}
Sender: ${senderEmail}
Test Recipient: ${targetRecipient}

PakistanTravel.Agency Marketplace Operations`;

    try {
      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: targetRecipient,
        replyTo,
        subject: `[TEST] PakistanTravel.Agency Booking Email System Active (${new Date().toLocaleTimeString()})`,
        text: testText,
        html: testHtml,
      });

      return NextResponse.json({
        success: true,
        message: `Test email dispatched successfully to ${targetRecipient}! Please check the recipient inbox or spam folder.`,
      });
    } catch (sendErr: any) {
      const sanitized = (sendErr?.message || "Send failed").replace(pass, "********");
      console.error("[SMTP Send Test Error]", sanitized);
      return NextResponse.json(
        {
          success: false,
          message: `Failed to deliver test email: ${sanitized}`,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("[Send Test Route Error]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error while dispatching test email." },
      { status: 500 }
    );
  }
}
