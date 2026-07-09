"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Presentation, Layers, ChevronRight, ChevronLeft, ArrowLeft, 
  ExternalLink, FileText, AlertCircle, HelpCircle, Star, BookOpen
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
  //  VIEW 2: EMBEDDED SLIDES PLAYER (NOT FULLSCREEN)
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeModule) {
    return (
      <div className="w-full relative select-none">
        
        {/* Back and Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={handleClosePlayer}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
            Kembali ke Modul
          </button>
          <div className="text-right">
            <span className="text-[10px] font-black text-primary tracking-widest uppercase block">Materi PPT Terbuka</span>
            <span className="text-xs text-gray-600 dark:text-white/50">{activeModule.title}</span>
          </div>
        </div>

        {/* Content Viewer Layout */}
        <div className="bg-white dark:bg-[#08120e] border border-gray-200 dark:border-white/5 rounded-3xl p-4 md:p-8 shadow-2xl relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-2 rounded-3xl pointer-events-none" />

          {isLoading ? (
            <div className="py-24 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="font-bold text-gray-900 dark:text-white mb-4">{error}</p>
              <button onClick={handleClosePlayer} className="px-5 py-2.5 bg-primary text-[#050e0a] rounded-xl font-bold">Kembali</button>
            </div>
          ) : slides.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <HelpCircle className="w-12 h-12 text-gray-300 dark:text-white/20 mb-4 animate-bounce" />
              <p className="font-bold text-gray-500 dark:text-white/50 text-sm">Belum ada slide ditambahkan ke modul ini.</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Column: Embed Slide Player */}
              <div className="flex-1 flex flex-col">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl bg-gray-100 dark:bg-black">
                  <iframe
                    src={currentSlide.driveUrl}
                    title={currentSlide.title || "Slide Presentation"}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>

                {/* Navigation and Slide Counter */}
                <div className="flex items-center justify-between mt-6 px-2">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-all"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-black text-gray-600 dark:text-white/60 font-mono">
                    Slide {currentSlideIdx + 1} / {slides.length}
                  </span>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-all"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Horizontal thumbnail navigator/strip below */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5">
                  <h4 className="text-[10px] font-black text-gray-500 dark:text-white/40 uppercase tracking-widest mb-3 px-1">Navigasi Halaman Slide</h4>
                  <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {slides.map((sl, idx) => (
                      <button
                        key={sl.id}
                        onClick={() => setCurrentSlideIdx(idx)}
                        className={`w-10 h-10 shrink-0 rounded-xl text-xs font-mono font-black flex items-center justify-center border transition-all ${
                          currentSlideIdx === idx
                            ? "bg-primary/20 border-primary text-primary shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                            : "bg-gray-50 dark:bg-[#050d0a] border-gray-200 dark:border-white/5 text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/10"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Slide Title & Teacher Notes */}
              <div className="w-full lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-white/5 lg:pl-8 pt-8 lg:pt-0 shrink-0">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-primary tracking-widest uppercase block mb-1">Slide #{currentSlide.order}</span>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                      {currentSlide.title || <span className="italic text-gray-400 dark:text-white/30 font-normal">Tanpa Judul</span>}
                    </h3>
                  </div>

                  <div className="p-4.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-xs text-gray-700 dark:text-white/60 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {currentSlide.notes || "Tidak ada catatan tambahan untuk slide ini."}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-white/5 mt-8 lg:mt-0">
                  <a
                    href={currentSlide.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all hover:scale-105"
                  >
                    <ExternalLink className="w-4 h-4" /> Buka Tab Baru
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  VIEW 1: CARD MODULES GRID
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="w-full relative select-none">
      
      {/* Glow Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10">
        <span className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-wide uppercase">
          E-Academy Materi
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-gray-900 dark:text-white mt-4 flex items-center gap-3">
          <Presentation className="w-9 h-9 text-primary animate-pulse" />
          Materi Pembelajaran SRE
        </h1>
        <p className="text-gray-600 dark:text-white/50 max-w-xl font-medium text-sm mt-2 leading-relaxed">
          Akses modul materi presentasi PPT yang telah disusun oleh mentor dan pengurus SRE UPNVJT.
        </p>
      </div>

      {modules.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white dark:bg-[#08120e] border border-dashed border-gray-200 dark:border-white/5 rounded-3xl">
          <BookOpen className="w-12 h-12 text-gray-300 dark:text-white/10 mb-4 animate-pulse" />
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Belum ada materi tersedia</h3>
          <p className="text-gray-500 dark:text-white/40 text-xs max-w-xs leading-relaxed mt-1">Kembali lagi nanti untuk modul pembelajaran berikutnya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((mod, index) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
              key={mod.id}
              onClick={() => handleOpenModule(mod)}
              className="bg-white dark:bg-gradient-to-b dark:from-white/10 dark:to-[#08120e] border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden hover:border-primary/50 dark:hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group shadow-lg"
            >
              {/* Cover Banner */}
              <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/5 to-gray-50 dark:from-primary/10 dark:to-[#08120e] border-b border-gray-200 dark:border-white/5">
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                {mod.coverImageUrl ? (
                  <img
                    src={mod.coverImageUrl}
                    alt={mod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-primary/30">
                    <Presentation className="w-10 h-10 animate-pulse" />
                  </div>
                )}
                {/* slideCount badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-white/90 dark:bg-black/60 border border-gray-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 text-gray-900 dark:text-white">
                    <Layers className="w-3.5 h-3.5" />
                    {mod.slideCount || 0} Slide
                  </span>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-sm line-clamp-1 mb-2 group-hover:text-primary transition-all tracking-tight">
                    {mod.title}
                  </h3>
                  {mod.description && (
                    <p className="text-xs text-gray-600 dark:text-white/40 line-clamp-2 leading-relaxed">
                      {mod.description}
                    </p>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/5 text-[10px] font-black tracking-widest uppercase text-primary group-hover:underline flex items-center gap-1">
                  Mulai Belajar & Lihat Slide →
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
