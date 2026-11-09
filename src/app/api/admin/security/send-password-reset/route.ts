import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { siteConfig } from "@/config/site";
import { queueEmail } from "@/services/email.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const auth = requireRole(session, ["ADMIN"]);
  if (!auth.authorized || !session?.user) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
  }

  const isSuperAdmin =
    session!.user?.role === "ADMIN" &&
    ((session!.user as any).staffRole === "SUPER_ADMIN" ||
      (session!.user as any).permissions === "ALL" ||
      (session!.user as any).permissions?.includes("ALL"));

  if (!isSuperAdmin) {
    return NextResponse.json(
      { error: "Forbidden: Only Super Administrators can trigger security resets." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { email, action = "BOTH", reason = "Administrative security override" } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const normEmail = email.toLowerCase().trim();
    const targetUser = await prisma.user.findUnique({
      where: { email: normEmail },
    });

    if (!targetUser) {
      return NextResponse.json({ error: `No registered account found for "${normEmail}".` }, { status: 404 });
    }

    const adminEmail = session.user.email || "admin@pakistantravel.agency";
    const results: string[] = [];
    let resetCode: string | null = null;

    // 1. Reset 2FA
    if (action === "RESET_2FA" || action === "BOTH") {
      await prisma.user.update({
        where: { id: targetUser.id },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null,
          twoFactorPendingSecret: null,
          twoFactorRecoveryCodes: null,
          twoFactorEnrolledAt: null,
          sessionVersion: { increment: 1 },
          tokenVersion: { increment: 1 },
        },
      });

      await prisma.auditLog.create({
        data: {
          action: "ADMIN_RESET_2FA",
          actorId: session.user.id,
          actorEmail: adminEmail,
          resourceType: "USER",
          resourceId: targetUser.id,
          details: `Super Admin ${adminEmail} reset 2FA TOTP for ${targetUser.email}. Reason: ${reason}. Sessions invalidated.`,
        },
      });

      results.push("2FA configuration has been cleared and sessions revoked.");
    }

    // 2. Dispatch Password Reset Code & Email
    if (action === "SEND_PASSWORD_RESET" || action === "BOTH") {
      // Invalidate existing tokens
      await prisma.passwordResetToken.updateMany({
        where: {
          email: normEmail,
          usedAt: null,
          invalidated: false,
        },
        data: { invalidated: true },
      });

      // Generate 6-digit random code
      const codeInt = crypto.randomInt(100000, 1000000);
      resetCode = codeInt.toString();
      const codeHash = crypto.createHash("sha256").update(resetCode).digest("hex");
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      await prisma.passwordResetToken.create({
        data: {
          email: normEmail,
          codeHash,
          attemptsLeft: 5,
          expiresAt,
          ip: "ADMIN_CONSOLE",
        },
      });

      const resetUrl = `https://www.pakistantravel.agency/forgot-password?email=${encodeURIComponent(normEmail)}`;

      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; }
            .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
            .header { background: #0f172a; padding: 28px; text-align: center; }
            .header h1 { color: #ffffff; font-size: 20px; margin: 0; font-weight: 800; letter-spacing: -0.5px; }
            .header p { color: #f97316; font-size: 12px; margin: 6px 0 0; font-weight: 600; }
            .body { padding: 32px 28px; }
            .code-box { background: #fff7ed; border: 2px dashed #f97316; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
            .code { font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #ea580c; font-family: monospace; }
            .btn { display: inline-block; background: #ea580c; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 10px; }
            .footer { padding: 20px; background: #f1f5f9; text-align: center; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PakistanTravel.Agency</h1>
              <p>ACCOUNT SECURITY ALERT</p>
            </div>
            <div class="body">
              <h2 style="font-size: 18px; font-weight: 700; margin-top: 0;">Password Reset Verification Code</h2>
              <p style="font-size: 13px; line-height: 1.6; color: #475569;">
                Hello <strong>${targetUser.name || "Valued User"}</strong>,<br/>
                An administrator has requested a password reset for your account (<code>${targetUser.email}</code>).
              </p>
              
              <div class="code-box">
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #c2410c; margin-bottom: 6px;">Your 6-Digit Reset Code</div>
                <div class="code">${resetCode}</div>
                <div style="font-size: 11px; color: #7c2d12; margin-top: 6px;">Expires in 15 minutes</div>
              </div>

              <div style="text-align: center; margin: 20px 0;">
                <a href="${resetUrl}" class="btn" style="color: #ffffff;">Reset Your Password Now</a>
              </div>

              <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
                If you did not request this, please notify <a href="mailto:${siteConfig.contact.supportEmail}">${siteConfig.contact.supportEmail}</a> immediately.
              </p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} PakistanTravel.Agency &bull; Northern Pakistan Tourism Marketplace
            </div>
          </div>
        </body>
        </html>
      `;

      const textBody = `
PakistanTravel.Agency - Password Reset Code

Hello ${targetUser.name || "User"},
Your 6-digit password reset code is: ${resetCode}
This code will expire in 15 minutes.

Reset your password directly at:
${resetUrl}

If you did not request this, please contact support at ${siteConfig.contact.supportEmail}.
      `.trim();

      await queueEmail({
        to: normEmail,
        recipientRole: targetUser.role as any,
        subject: "Your PakistanTravel.Agency Password Reset Code",
        htmlBody,
        textBody,
        eventType: "BOOKING_CONFIRMED" as any, // standard transactional high-priority
      });

      await prisma.auditLog.create({
        data: {
          action: "ADMIN_DISPATCHED_PASSWORD_RESET",
          actorId: session.user.id,
          actorEmail: adminEmail,
          resourceType: "USER",
          resourceId: targetUser.id,
          details: `Super Admin ${adminEmail} dispatched password reset code to ${normEmail}.`,
        },
      });

      results.push(`6-digit reset code sent to ${normEmail}.`);
    }

    return NextResponse.json({
      success: true,
      message: results.join(" "),
      code: resetCode,
      targetEmail: normEmail,
      targetRole: targetUser.role,
    });
  } catch (err: any) {
    console.error("POST /api/admin/security/send-password-reset error:", err);
    return NextResponse.json({ error: "Failed to execute security reset: " + err.message }, { status: 500 });
  }
}
