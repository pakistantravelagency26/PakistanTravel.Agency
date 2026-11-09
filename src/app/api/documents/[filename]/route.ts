import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { readFile, stat } from "fs/promises";
import path from "path";
import { verifySignedDocumentToken } from "@/lib/documentSigner";

export const dynamic = "force-dynamic";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

/**
 * Authorized Private Document Retrieval API
 * Solves IDOR and unauthorized document exposure (CNIC, NTN, tour licenses).
 * Supports both:
 * 1. Cryptographically signed temporary URL (?exp=...&sig=...)
 * 2. Authenticated Vendor / Admin session
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const rawFilename = params.filename;
    // Prevent directory traversal: take strictly base filename
    const safeFilename = path.basename(rawFilename);

    // Validate UUID format with allowed extension
    const validPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\.(jpg|jpeg|png|webp|avif|pdf)$/i;
    if (!validPattern.test(safeFilename)) {
      return NextResponse.json({ success: false, error: "Invalid document identifier format." }, { status: 400 });
    }

    // Check signed URL query parameters first
    const { searchParams } = new URL(req.url);
    const exp = searchParams.get("exp");
    const sig = searchParams.get("sig");
    const isSignedUrlValid = verifySignedDocumentToken(safeFilename, exp, sig);

    if (!isSignedUrlValid) {
      // Fall back to session authentication
      const session = await getServerSession(authOptions);
      const auth = requireRole(session, ["ADMIN", "VENDOR"]);
      if (!auth.authorized) {
        return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
      }
    }

    const privateDir = path.join(process.cwd(), "storage", "private-documents");
    const filePath = path.join(privateDir, safeFilename);

    // Verify file existence
    try {
      await stat(filePath);
    } catch {
      return NextResponse.json({ success: false, error: "Document not found." }, { status: 404 });
    }

    // Read and stream file with security headers
    const ext = path.extname(safeFilename).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Disposition": `inline; filename="${safeFilename}"`,
      },
    });
  } catch (error: any) {
    console.error("[DocumentsAPI] Error:", error);
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}
