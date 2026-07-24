import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "sre-portal";
const publicUrl = process.env.R2_PUBLIC_URL || "https://cdn.webly.biz.id/";

export const r2Client = (accountId && accessKeyId && secretAccessKey)
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  : null;

/**
 * Upload buffer directly to Cloudflare R2 storage bucket (No local public/uploads saving)
 *
 * @param {Object} options
 * @param {Buffer} options.buffer - Binary buffer of the file
 * @param {string} options.filename - File name (e.g., slide_1.webp)
 * @param {string} options.mimeType - Content MIME type (e.g. image/webp)
 * @param {string} options.folder - Subfolder path (e.g. modul-1)
 * @returns {Promise<{ url: string, isR2: boolean }>}
 */
export async function uploadToR2({ buffer, filename, mimeType = "image/webp", folder = "" }) {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const key = cleanFolder ? `${cleanFolder}/${filename}` : filename;
  const baseUrl = publicUrl.endsWith("/") ? publicUrl : `${publicUrl}/`;
  const fullUrl = `${baseUrl}${key}`;

  if (r2Client) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        CacheControl: "public, max-age=31536000, immutable",
      });
      await r2Client.send(command);

      return { url: fullUrl, isR2: true };
    } catch (r2Err) {
      console.error("Cloudflare R2 Upload Error:", r2Err);
      return { url: fullUrl, isR2: false };
    }
  } else {
    // Return Cloudflare R2 public URL format directly
    return { url: fullUrl, isR2: false };
  }
}
