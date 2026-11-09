import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { getBookingEmailSettings } from "@/services/emailSettings.service";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json().catch(() => ({}));
    const currentSettings = await getBookingEmailSettings();

    // Use submitted fields if provided, otherwise fallback to saved settings
    const host = (body.smtpHost || currentSettings.smtpHost || "smtp.gmail.com").trim();
    const port = Number(body.smtpPort || currentSettings.smtpPort || 587);
    const user = (body.smtpUser || body.senderEmail || currentSettings.smtpUser || currentSettings.senderEmail || "").trim();
    
    let pass = (body.smtpPass || "").trim();
    if (!pass || pass === "••••••••••••••••") {
      pass = currentSettings.smtpPass || "";
    }

    const secure = typeof body.smtpSecure === "boolean" ? body.smtpSecure : (port === 465);

    if (!user || !pass) {
      return NextResponse.json(
        {
          success: false,
          message: "Please configure Gmail address and App Password before testing the SMTP connection.",
        },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });

    try {
      await transporter.verify();
      return NextResponse.json({
        success: true,
        message: `SMTP connection established successfully! Handshake verified with ${host}:${port} as ${user}.`,
      });
    } catch (verifyErr: any) {
      const sanitized = (verifyErr?.message || "Unknown error").replace(pass, "********");
      console.error("[SMTP Test Connection Error]", sanitized);
      return NextResponse.json(
        {
          success: false,
          message: `SMTP handshake failed: ${sanitized}`,
        },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.error("[Test Connection Internal Error]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error during SMTP verification." },
      { status: 500 }
    );
  }
}
