import React, { useState, useEffect } from 'react';

export default function CachedImage({ src, alt, className, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    let isMounted = true;
    let objectUrl = null;

    if (!src) return;

    const loadImg = async () => {
      try {
        if (typeof window === 'undefined' || !('caches' in window)) {
          if (isMounted) setImgSrc(src);
          return;
        }

        const cache = await caches.open('ppt-slides-cache-v1');
        const cachedResponse = await cache.match(src);

        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          objectUrl = URL.createObjectURL(blob);
          if (isMounted) setImgSrc(objectUrl);
        } else {
          // Fetch from Cloudflare R2 on first view
          const response = await fetch(src, { mode: 'cors' });
          if (response.ok) {
            // Save to CacheStorage so subsequent views don't re-request R2
            await cache.put(src, response.clone());
            const blob = await response.blob();
            objectUrl = URL.createObjectURL(blob);
            if (isMounted) setImgSrc(objectUrl);
          } else {
            if (isMounted) setImgSrc(src);
          }
        }
      } catch (err) {
        // Fallback to direct R2 src on error/CORS fallback
        if (isMounted) setImgSrc(src);
      }
    };

    loadImg();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  return (
    <img
      src={imgSrc || src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgSrc(src)}
      {...props}
    />
  );
}
