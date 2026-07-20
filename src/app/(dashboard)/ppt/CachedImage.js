import React, { useState, useEffect } from 'react';

export default function CachedImage({ src, alt, className, ...props }) {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    if (!src) return;

    const loadImg = async () => {
      try {
        const cache = await caches.open('ppt-slides-cache');
        const cachedResponse = await cache.match(src);
        
        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          if (isMounted) setImgSrc(URL.createObjectURL(blob));
        } else {
          // Fetch from network
          const response = await fetch(src);
          if (response.ok) {
            // Clone response to put in cache
            cache.put(src, response.clone());
            const blob = await response.blob();
            if (isMounted) setImgSrc(URL.createObjectURL(blob));
          } else {
            // fallback
            if (isMounted) setImgSrc(src);
          }
        }
      } catch (err) {
        console.error("Cache API failed, falling back to direct src", err);
        if (isMounted) setImgSrc(src);
      }
    };

    loadImg();

    return () => {
      isMounted = false;
    };
  }, [src]);

  return <img src={imgSrc || src} alt={alt} className={className} loading="lazy" {...props} />;
}
