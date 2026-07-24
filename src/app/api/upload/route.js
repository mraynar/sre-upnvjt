import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import sharp from "sharp";
import { uploadToR2 } from "@/lib/r2";
import path from "path";
import fs from "fs/promises";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder = data.get('folder') || '';
    const destination = data.get('destination') || 'r2'; // 'r2' | 'local'

    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
    const prefix = safeFolder ? safeFolder.toUpperCase() : "FILE";
    const randomStr = Math.random().toString(36).substring(2, 8);
    const isImage = file.type?.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file.name);

    let finalBuffer = buffer;
    let filename;
    let mimeType = file.type || "application/octet-stream";

    if (isImage) {
      filename = `${prefix}_${Date.now()}_${randomStr}.webp`;
      finalBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
      mimeType = "image/webp";
    } else {
      const ext = path.extname(file.name) || ".bin";
      filename = `${prefix}_${Date.now()}_${randomStr}${ext}`;
    }

    // ── LOCAL upload → /public/uploads/{folder} ─────────────────────────────
    if (destination === 'local') {
      const uploadDir = safeFolder
        ? path.join(process.cwd(), 'public', 'uploads', safeFolder)
        : path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, finalBuffer);
      // Return relative path (same shape as R2 path) — full URL served by Next.js static
      const relativePath = safeFolder ? `${safeFolder}/${filename}` : filename;
      return NextResponse.json({ success: true, path: `/uploads/${relativePath}`, ok: true });
    }

    // ── R2 upload ────────────────────────────────────────────────────────────
    const { path: relativePath, ok } = await uploadToR2({
      buffer: finalBuffer,
      filename,
      mimeType,
      folder: safeFolder,
    });

    // Only return relative path (folder/filename) — full URL built at display time
    return NextResponse.json({ success: true, path: relativePath, ok });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
