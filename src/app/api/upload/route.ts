import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
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

    const uploadedUrls: string[] = [];

    // Check if Cloudinary is configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      // Cloudinary direct upload
      for (const file of allFiles) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
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
          // Fallback to local
          const localUrl = await saveLocalFile(file);
          uploadedUrls.push(localUrl);
        }
      }
    } else {
      // Save locally to public/uploads
      for (const file of allFiles) {
        const localUrl = await saveLocalFile(file);
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

async function saveLocalFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const safeBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${safeBaseName}_${Date.now()}_${Math.random().toString(36).slice(-4)}${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}
