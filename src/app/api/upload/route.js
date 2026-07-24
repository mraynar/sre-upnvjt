import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import sharp from "sharp";
import { uploadToR2 } from "@/lib/r2";
import path from "path";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
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

    const { url, isR2 } = await uploadToR2({
      buffer: finalBuffer,
      filename,
      mimeType,
      folder: safeFolder,
    });

    return NextResponse.json({ success: true, url, isR2 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
