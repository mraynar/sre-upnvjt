"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// CSS to force the canvas to scale down gracefully without cropping
const responsivePdfStyles = `
  .react-pdf__Document {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .react-pdf__Page {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100% !important;
    height: 100% !important;
  }
  .react-pdf__Page__canvas {
    max-width: 100% !important;
    max-height: 100% !important;
    width: auto !important;
    height: auto !important;
    object-fit: contain;
  }
`;

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ pdfUrl, pageNumber, onDocumentLoadSuccess }) {
  const [loadProgress, setLoadProgress] = useState(0);
  const [fileSource, setFileSource] = useState(null);

  // 1. Periksa apakah PDF sudah ada di Cache lokal browser
  React.useEffect(() => {
    let isMounted = true;
    async function checkCache() {
      if (!pdfUrl) return;
      try {
        if (typeof caches !== 'undefined') {
          const cache = await caches.open('sre-pdf-cache-v1');
          const cachedRes = await cache.match(pdfUrl);
          if (cachedRes) {
            const blob = await cachedRes.blob();
            if (isMounted) setFileSource(blob); // Load instan dari Cache!
            return;
          }
        }
      } catch (err) {
        console.error("Cache API failed:", err);
      }
      // Jika tidak ada di cache, gunakan URL jaringan
      if (isMounted) setFileSource(pdfUrl);
    }
    
    setFileSource(null); // Reset saat pdfUrl berubah
    setLoadProgress(0);
    checkCache();
    
    return () => { isMounted = false; };
  }, [pdfUrl]);

  const handleLoadProgress = ({ loaded, total }) => {
    if (total) {
      setLoadProgress(Math.round((loaded / total) * 100));
    }
  };

  const handleDocumentLoadSuccess = async (pdf) => {
    onDocumentLoadSuccess(pdf);
    
    // 2. Simpan ke Cache secara diam-diam setelah berhasil dimuat (jika belum ada)
    // Karena browser baru saja mengunduhnya, fetch() ini akan langsung mengambil dari memory browser tanpa memakan kuota ulang!
    if (typeof fileSource === 'string' && pdfUrl) {
      try {
        if (typeof caches !== 'undefined') {
          const cache = await caches.open('sre-pdf-cache-v1');
          const existing = await cache.match(pdfUrl);
          if (!existing) {
            const res = await fetch(pdfUrl);
            if (res.ok) await cache.put(pdfUrl, res);
          }
        }
      } catch (err) {
        console.error("Failed to cache PDF:", err);
      }
    }
  };
  if (!fileSource) return null; // Wait until cache check is done

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden absolute inset-0">
      <style>{responsivePdfStyles}</style>
      <Document
        file={fileSource}
        onLoadSuccess={handleDocumentLoadSuccess}
        onLoadProgress={handleLoadProgress}
        className="w-full h-full flex items-center justify-center"
        loading={
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-emerald-500 font-bold animate-pulse">
              Mengunduh PDF... {loadProgress > 0 ? `${loadProgress}%` : ''}
            </div>
            <p className="text-slate-400 text-xs mt-2 max-w-xs text-center">
              (Jika ukuran file besar, proses ini mungkin memakan waktu beberapa detik untuk memuat data awal)
            </p>
          </div>
        }
        error={<div className="text-red-500 py-10">Gagal memuat PDF.</div>}
      >
        <Page 
          pageNumber={pageNumber} 
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={1200} // Render at high resolution, CSS will scale it down
        />
      </Document>
    </div>
  );
}
