import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import sharp from "sharp";

export async function POST(req) {
  try {
    // Check authentication
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

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeFolder);
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    const prefix = safeFolder ? safeFolder.toUpperCase() : "FILE";
    const randomStr = Math.random().toString(36).substring(2, 8);
    const isImage = file.type?.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file.name);

    let filename;
    let filepath;

    if (isImage) {
      filename = `${prefix}_${Date.now()}_${randomStr}.webp`;
      filepath = path.join(uploadDir, filename);
      await sharp(buffer).webp({ quality: 80 }).toFile(filepath);
    } else {
      const ext = path.extname(file.name);
      filename = `${prefix}_${Date.now()}_${randomStr}${ext}`;
      filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
    }

    // Return the URL
    const urlPath = safeFolder ? `/uploads/${safeFolder}/${filename}` : `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: urlPath });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
