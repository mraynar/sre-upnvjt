import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "sre-portal";
const publicUrl = process.env.R2_PUBLIC_URL || "https://cdn.webly.biz.id";

export const r2Client = (accountId && accessKeyId && secretAccessKey)
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    })
  : null;

/**
 * Upload buffer ke Cloudflare R2.
 * Hanya return path relatif (folder/filename) — full URL dibentuk di client.
 *
 * @param {Buffer} buffer
 * @param {string} filename
 * @param {string} mimeType
 * @param {string} folder - e.g. "modul-5"
 * @returns {Promise<{ path: string, ok: boolean }>}
 *   path = "modul-5/FILENAME.webp" — simpan ini di DB
 */
export async function uploadToR2({ buffer, filename, mimeType = "image/webp", folder = "" }) {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const key = cleanFolder ? `${cleanFolder}/${filename}` : filename;

  if (!r2Client) {
    console.warn("[R2] Client not configured, upload skipped.");
    return { path: key, ok: false };
  }

  try {
    await r2Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: "public, max-age=31536000, immutable",
    }));
    return { path: key, ok: true };
  } catch (err) {
    console.error("[R2] Upload error:", err);
    return { path: key, ok: false };
  }
}

/**
 * Bangun full URL dari path relatif yang disimpan di DB.
 * Hanya digunakan di sisi server jika diperlukan.
 */
export function buildR2Url(relativePath) {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath; // legacy full URL
  const base = publicUrl.replace(/\/+$/, "");
  return `${base}/${relativePath}`;
}

/**
 * Hapus objek dari Cloudflare R2 berdasarkan path relatif yang disimpan di DB.
 *
 * @param {string} relativePath - e.g. "modul-5/SLIDE.webp" atau full URL (legacy)
 * @returns {Promise<{ ok: boolean }>}
 */
export async function deleteFromR2(relativePath) {
  if (!relativePath) return { ok: false };
  if (!r2Client) {
    console.warn("[R2] Client not configured, delete skipped.");
    return { ok: false };
  }

  // Jika full URL (legacy) → ambil path setelah domain sebagai key
  let key = relativePath;
  if (relativePath.startsWith("http")) {
    try {
      key = new URL(relativePath).pathname.replace(/^\/+/, "");
    } catch {
      return { ok: false };
    }
  }

  try {
    await r2Client.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }));
    console.log(`[R2] Deleted: ${key}`);
    return { ok: true };
  } catch (err) {
    console.error("[R2] Delete error:", err);
    return { ok: false };
  }
}
