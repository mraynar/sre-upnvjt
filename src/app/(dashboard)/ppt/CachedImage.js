import React, { useState } from 'react';

// Build full URL from relative path stored in DB
// R2_PUBLIC_URL is exposed to client via next.config.mjs env section
const R2_BASE = (process.env.R2_PUBLIC_URL || "https://cdn.webly.biz.id").replace(/\/+$/, "");

export function buildSlideUrl(fileUrl) {
  if (!fileUrl) return "";
  // Already a full URL (legacy data or external link)
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
  // Local file served from Next.js public folder — return as-is
  if (fileUrl.startsWith("/uploads/")) return fileUrl;
  // Relative path stored in DB — build full CDN URL
  return `${R2_BASE}/${fileUrl.replace(/^\/+/, "")}`;
}

export default function CachedImage({ src, alt, className, ...props }) {
  const fullSrc = buildSlideUrl(src);
  const [errored, setErrored] = useState(false);

  if (!fullSrc) return null;

  return (
    <img
      src={errored ? "" : fullSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
      {...props}
    />
  );
}
