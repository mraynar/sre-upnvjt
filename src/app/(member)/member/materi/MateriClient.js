"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Presentation, Layers, ChevronRight, ChevronLeft, X, ExternalLink,
  BookOpen, HelpCircle, AlertCircle, ArrowLeft,
} from "lucide-react";

export default function MateriClient({ initialModules }) {
  const [modules] = useState(initialModules || []);
  const [activeModule, setActiveModule] = useState(null); // module details with slides
  const [slides, setSlides] = useState([]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpenModule = async (mod) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ppt/${mod.id}`);
      if (!res.ok) throw new Error("Gagal memuat detail modul");
      const data = await res.json();
      setActiveModule(data);
      setSlides(data.slides || []);
      setCurrentSlideIdx(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePlayer = () => {
    setActiveModule(null);
    setSlides([]);
    setCurrentSlideIdx(0);
  };

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlideIdx(prev => (prev + 1) % slides.length);
  }, [slides]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlideIdx(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides]);

  // Handle keyboard arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeModule || slides.length === 0) return;
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "Escape") {
        handleClosePlayer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModule, slides, nextSlide, prevSlide]);

  const currentSlide = slides[currentSlideIdx];

  // ═══════════════════════════════════════════════════════════════════════════
  //  VIEW: CAROUSEL SLIDES PLAYER
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeModule) {
    return (
      <div className="fixed inset-0 z-50 bg-[#040a08] text-white flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/5 bg-[#050e0a] shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClosePlayer}
              className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:text-primary transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-md md:text-lg font-bold truncate max-w-[280px] md:max-w-xl">{activeModule.title}</h2>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Slide {slides.length > 0 ? `${currentSlideIdx + 1} / ${slides.length}` : "0 / 0"}
              </span>
            </div>
          </div>

          <button onClick={handleClosePlayer} className="text-gray-400 hover:text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading and Error states */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="font-bold mb-2">{error}</p>
            <button onClick={handleClosePlayer} className="px-4 py-2 bg-primary text-[#050e0a] rounded-xl font-bold">Kembali</button>
          </div>
        ) : slides.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <HelpCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className="font-bold">Belum ada slide ditambahkan ke modul ini.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
            {/* Embed & Controls */}
            <div className="flex-1 flex flex-col p-4 md:p-6 bg-black min-h-0 justify-center">
              <div className="relative aspect-video w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a1612]">
                <iframe
                  src={currentSlide.driveUrl}
                  title={currentSlide.title || "Slide Presentation"}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-center gap-6 mt-6 shrink-0">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-xs font-bold text-gray-400 select-none">
                  {currentSlideIdx + 1} / {slides.length}
                </span>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Slide notes sidebar */}
            <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/5 bg-[#050e0a] p-6 overflow-y-auto shrink-0 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-primary tracking-widest uppercase block mb-2">Slide #{currentSlide.order}</span>
                <h3 className="text-md font-bold text-white mb-4">
                  {currentSlide.title || <span className="italic text-gray-500 font-normal">Tanpa Judul</span>}
                </h3>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {currentSlide.notes || "Tidak ada catatan tambahan untuk slide ini."}
                </div>
              </div>
              <div className="pt-6 border-t border-white/5 mt-6">
                <a
                  href={currentSlide.driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> Buka Presentasi Asli
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  VIEW: CARD MODULES GRID
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="w-full relative">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-white">
          <Presentation className="w-8 h-8 text-primary" />
          Materi Pembelajaran SRE
        </h1>
        <p className="text-gray-400 max-w-xl font-light">
          Akses modul materi presentasi PPT yang telah disusun oleh mentor dan pengurus SRE UPNVJT.
        </p>
      </div>

      {modules.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
          <BookOpen className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Belum ada materi tersedia</h3>
          <p className="text-gray-500 text-sm">Kembali lagi nanti untuk modul pembelajaran berikutnya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map(mod => (
            <div
              key={mod.id}
              onClick={() => handleOpenModule(mod)}
              className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group shadow-lg"
            >
              {/* Cover Banner */}
              <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-b border-white/5">
                {mod.coverImageUrl ? (
                  <img
                    src={mod.coverImageUrl}
                    alt={mod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-primary/30">
                    <Presentation className="w-8 h-8" />
                  </div>
                )}
                {/* badges */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-black/50 text-white backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    {mod.slideCount || 0} Slide
                  </span>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-1 mb-2 group-hover:text-primary transition-all">
                    {mod.title}
                  </h3>
                  {mod.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {mod.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-bold text-primary group-hover:underline flex items-center gap-1">
                  Mulai Belajar & Lihat Slide →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
