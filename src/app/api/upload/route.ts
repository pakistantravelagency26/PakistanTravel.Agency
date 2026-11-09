import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { generateSignedDocumentUrl } from "@/lib/documentSigner";
import { checkServerlessRateLimit } from "@/lib/serverlessRateLimiter";
import { getTrustedClientIp } from "@/lib/clientIp";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

function isValidImageHeader(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 4) return false;

  if (mime === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mime === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  if (mime === "image/webp") {
    // RIFF .... WEBP
    return (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }
  if (mime === "image/avif") {
    // ftyp .... avif
    return buffer.toString("ascii", 4, 8) === "ftyp";
  }
  return false;
}

export async function POST(req: Request) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized: Please log in to upload files." }, { status: 401 });
    }

    // Rate limiting: 10 uploads per 10 minutes
    const clientIp = getTrustedClientIp(req.headers);
    const rateCheck = await checkServerlessRateLimit(`upload-ip:${clientIp}`, 10, 600);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: `Too many upload requests. Please retry in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const allFiles: File[] = [];
    if (singleFile && singleFile.size > 0) allFiles.push(singleFile);
    if (files && files.length > 0) {
      for (const f of files) {
        if (f.size > 0 && !allFiles.some((x) => x.name === f.name && x.size === f.size)) {
          allFiles.push(f);
        }
      }
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ error: "No image files provided" }, { status: 400 });
    }

    if (allFiles.length > 10) {
      return NextResponse.json({ error: "Cannot upload more than 10 files at once." }, { status: 400 });
    }

    const isPrivate = formData.get("isPrivate") === "true";
    if (isPrivate && session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Only operators and admins can upload verification documents." }, { status: 403 });
    }

    const uploadedUrls: string[] = [];

    // Check if Cloudinary is configured (for public listing images only)
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    for (const file of allFiles) {
      // 2. Size limit
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the maximum allowed size of 5MB.` },
          { status: 400 }
        );
      }

      // 3. MIME type whitelist
      const ext = ALLOWED_MIME_TYPES[file.type.toLowerCase()];
      if (!ext) {
        return NextResponse.json(
          { error: `File type "${file.type}" is not allowed. Only JPEG, PNG, WEBP, and AVIF are permitted.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 4. Magic bytes header verification
      if (!isValidImageHeader(buffer, file.type.toLowerCase())) {
        return NextResponse.json(
          { error: `File content of "${file.name}" does not match its claimed image type.` },
          { status: 400 }
        );
      }

      // If document is private (CNIC, NTN, license), store in private non-public storage
      if (isPrivate) {
        const fileName = await saveSecurePrivateFile(buffer, ext);
        const signedUrl = generateSignedDocumentUrl(fileName);
        uploadedUrls.push(signedUrl);
        continue;
      }

      if (cloudName && apiKey && apiSecret) {
        // Cloudinary upload for public listing media
        const base64Data = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64Data}`;

        const cloudinaryEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const cloudForm = new FormData();
        cloudForm.append("file", dataUri);
        cloudForm.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "pakistan_travel_agency");

        const cloudRes = await fetch(cloudinaryEndpoint, {
          method: "POST",
          body: cloudForm,
        });

        if (cloudRes.ok) {
          const cloudJson = await cloudRes.json();
          uploadedUrls.push(cloudJson.secure_url || cloudJson.url);
        } else {
          const localUrl = await saveSecureLocalFile(buffer, ext);
          uploadedUrls.push(localUrl);
        }
      } else {
        const localUrl = await saveSecureLocalFile(buffer, ext);
        uploadedUrls.push(localUrl);
      }
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0] || null,
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}

async function saveSecureLocalFile(buffer: Buffer, ext: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  // Cryptographically randomized UUID filename, never user-derived
  const fileName = `${crypto.randomUUID()}${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

async function saveSecurePrivateFile(buffer: Buffer, ext: string): Promise<string> {
  const privateDir = path.join(process.cwd(), "storage", "private-documents");
  await mkdir(privateDir, { recursive: true });

  const fileName = `${crypto.randomUUID()}${ext}`;
  const filePath = path.join(privateDir, fileName);

  await writeFile(filePath, buffer);
  return fileName;
}
