import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import {
  getMaskedBookingEmailSettings,
  saveBookingEmailSettings,
  type SaveBookingEmailSettingsInput,
} from "@/services/emailSettings.service";
import { resetMailTransporter } from "@/services/email.service";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const settings = await getMaskedBookingEmailSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error("[GET /api/admin/settings/email] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve email settings." },
      { status: 500 }
    );
  }
}

const updateSettingsSchema = z.object({
  enabled: z.boolean().optional(),
  senderName: z.string().min(1).max(100).optional(),
  senderEmail: z.string().email("Invalid sender Gmail address").optional().or(z.literal("")),
  smtpUser: z.string().optional().or(z.literal("")),
  smtpPass: z.string().optional().or(z.literal("")),
  smtpHost: z.string().min(1).optional(),
  smtpPort: z.number().int().min(1).max(65535).optional(),
  smtpSecure: z.boolean().optional(),
  adminEmail: z.string().email("Invalid admin notification email").optional().or(z.literal("")),
  replyTo: z.string().email("Invalid reply-to email").optional().nullable().or(z.literal("")),
  clearPassword: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = updateSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input: SaveBookingEmailSettingsInput = {
      enabled: parsed.data.enabled,
      senderName: parsed.data.senderName,
      senderEmail: parsed.data.senderEmail || undefined,
      smtpUser: parsed.data.smtpUser || parsed.data.senderEmail || undefined,
      smtpPass: parsed.data.smtpPass,
      smtpHost: parsed.data.smtpHost,
      smtpPort: parsed.data.smtpPort,
      smtpSecure: parsed.data.smtpSecure,
      adminEmail: parsed.data.adminEmail || undefined,
      replyTo: parsed.data.replyTo || null,
      clearPassword: parsed.data.clearPassword,
    };

    const saved = await saveBookingEmailSettings(input);
    resetMailTransporter();

    return NextResponse.json({
      success: true,
      message: "Booking email settings saved successfully.",
      settings: saved,
    });
  } catch (error: any) {
    console.error("[POST /api/admin/settings/email] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking email settings." },
      { status: 500 }
    );
  }
}
