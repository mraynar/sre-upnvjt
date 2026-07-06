"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Download, Play, Lightbulb, ArrowLeft, Layers, Presentation, Maximize, Minimize, Loader2
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

// Helper component to render HTML notes nicely
const HtmlNotes = ({ html, fontSizeClass }) => {
  if (!html) return null;

  return (
    <>
      <style>{`
        .notes-html p { margin-bottom: 1rem; }
        .notes-html p:last-child { margin-bottom: 0; }
        .notes-html b, .notes-html strong { font-weight: 700; color: inherit; }
        .notes-html i, .notes-html em { font-style: italic; }
        .notes-html ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .notes-html ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .notes-html li { margin-bottom: 0.25rem; }
        .notes-html h1, .notes-html h2, .notes-html h3, .notes-html h4 { font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #0f172a; }
        :is(.dark .notes-html h1, .dark .notes-html h2, .dark .notes-html h3, .dark .notes-html h4) { color: #f8fafc; }
        .notes-html a { color: #10b981; text-decoration: underline; }
        .notes-html blockquote { border-left: 4px solid #10b981; padding-left: 1rem; font-style: italic; color: #64748b; margin-bottom: 1rem; }
        :is(.dark .notes-html blockquote) { color: #94a3b8; }
        .notes-html br { display: block; content: ""; margin-top: 0.5rem; }
      `}</style>
      <div 
        className={`notes-html text-slate-600 dark:text-slate-400 leading-relaxed text-justify ${fontSizeClass}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};

export default function MateriDetailClient({ initialData, r2Url }) {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [moduleData] = useState(initialData);
  const [slides] = useState(initialData?.slides || []);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(() => {
    if (typeof window !== 'undefined' && initialData?.id) {
      try {
        const savedProgress = localStorage.getItem(`sre_materi_progress_${initialData.id}`);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          if (parsed.currentSlideIdx !== undefined && parsed.currentSlideIdx >= 0 && parsed.currentSlideIdx < (initialData.slides?.length || 0)) {
            return parsed.currentSlideIdx;
          }
        }
      } catch (e) {}
    }
    return 0;
  });
  const [notesFontSize, setNotesFontSize] = useState('md');
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  
  // Custom font sizes based on user preference
  const fontSizeStyles = {
    sm: 'text-xs md:text-sm',
    md: 'text-sm md:text-base',
    lg: 'text-base md:text-lg',
  };

  // Fullscreen State
  const presentationRef = useRef(null);
  const fetchedSlides = useRef(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Cached Images Object URLs
  const [cachedImages, setCachedImages] = useState({});


  // Save progress to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && moduleData?.id) {
      const progressData = { currentSlideIdx, lastAccessed: Date.now() };
      localStorage.setItem(`sre_materi_progress_${moduleData.id}`, JSON.stringify(progressData));
    }
  }, [currentSlideIdx, moduleData?.id]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]{11})/);
    return match ? match[1] : null;
  };

  // Lazy Load and Cache API Logic
  useEffect(() => {
    const loadImage = async (slideIdx) => {
      if (slideIdx < 0 || slideIdx >= slides.length) return;
      const slide = slides[slideIdx];
      if (!slide?.fileUrl) return;
      
      const isYoutube = getYoutubeVideoId(slide.fileUrl);
      if (isYoutube) return;

      const fullUrl = `${r2Url.replace(/\/$/, '')}/${slide.fileUrl.replace(/^\//, '')}`;
      
      // Avoid refetching if we already tried
      if (fetchedSlides.current.has(slideIdx)) return;
      fetchedSlides.current.add(slideIdx);

      try {
        const cache = await caches.open('sre-materi-cache');
        let response = await cache.match(fullUrl);
        
        if (!response) {
          response = await fetch(fullUrl, { mode: 'cors' });
          if (response.ok) {
            await cache.put(fullUrl, response.clone());
          } else {
            // If failed to fetch, fallback silently
            setCachedImages(prev => ({ ...prev, [slideIdx]: fullUrl }));
            return;
          }
        }
        
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        setCachedImages(prev => ({ ...prev, [slideIdx]: objectURL }));
      } catch (e) {
        // Fallback: use direct URL if CORS fails or Cache API fails
        setCachedImages(prev => ({ ...prev, [slideIdx]: fullUrl }));
      }
    };

    loadImage(currentSlideIdx);
    loadImage(currentSlideIdx + 1); // preload next
  }, [currentSlideIdx, slides, r2Url]);


  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      if (presentationRef.current?.requestFullscreen) {
        await presentationRef.current.requestFullscreen();
        try {
          if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('landscape');
          }
        } catch (e) {
          // Ignore if unsupported
        }
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        try {
          if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
          }
        } catch (e) {
          // Ignore if unsupported
        }
      }
    }
  };

  if (!moduleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-red-500 font-bold text-xl mb-4">{t('materi.module_not_found') || 'Module not found'}</p>
        <button onClick={() => router.push('/member/materi')} className="px-6 py-2 bg-emerald-500 text-[#0f172a] font-bold rounded-lg hover:bg-emerald-400">{t('materi.btn_back') || 'Back to Materi'}</button>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIdx];

  const handleNext = () => {
    if (currentSlideIdx < slides.length - 1) {
      setDirection(1);
      setCurrentSlideIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIdx > 0) {
      setDirection(-1);
      setCurrentSlideIdx(prev => prev - 1);
    }
  };

  const youtubeId = getYoutubeVideoId(currentSlide?.fileUrl);
  const currentImageUrl = cachedImages[currentSlideIdx];
  const downloadUrl = currentSlide?.fileUrl ? `${r2Url.replace(/\/$/, '')}/${currentSlide.fileUrl.replace(/^\//, '')}` : "#";

  return (
    <div className="w-full pt-8 pb-12">
      <div className="w-full">
        
        {/* Back Button */}
        <button 
          onClick={() => router.push('/member/materi')}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors mb-8 font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> {t('materi.btn_back') || 'Kembali ke Daftar Materi'}
        </button>

        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-4">
            <Layers className="w-3.5 h-3.5" />
            {t('materi.learning_material') || 'Materi Pembelajaran'}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {moduleData.title}
          </h1>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          
          {/* Left Column Wrapper */}
          <div className="contents lg:block lg:col-span-3 lg:space-y-6">
            
            {/* 2. Presentation Card (order-2 on mobile) */}
            <div 
              ref={presentationRef}
              className={`order-2 lg:order-none bg-white dark:bg-[#0d131f] border-slate-200 dark:border-white/5 overflow-hidden flex flex-col relative w-full ${isFullscreen ? 'border-0 rounded-none h-screen' : 'border rounded-2xl shadow-sm'}`}
            >
              {/* Media Area (strictly 16:9 unless fullscreen) */}
              <div className={`relative bg-slate-100 dark:bg-black/50 w-full flex flex-col items-center justify-center overflow-hidden ${isFullscreen ? 'flex-1' : 'aspect-video'}`}>
                {youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : currentSlide?.fileUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative bg-[#0f172a]">
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={currentSlideIdx}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -20 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        {currentImageUrl ? (
                          <img 
                            src={currentImageUrl} 
                            alt={currentSlide.title || `${t('materi.slide')} ${currentSlideIdx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                            <span className="text-sm font-semibold tracking-wide">{t('materi.loading_slides') || 'Memuat Slide...'}</span>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="p-12 text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <Presentation className="w-8 h-8 text-slate-400 dark:text-emerald-500/50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-700 dark:text-white">{currentSlide?.title || t('materi.no_title') || "No Title"}</h3>
                    <p className="text-sm max-w-md mx-auto">{moduleData.notes || t('materi.no_notes') || "Tidak ada media pendukung untuk materi ini."}</p>
                  </div>
                )}
              </div>

              {/* Controls Bar */}
              <div className="p-4 bg-white dark:bg-[#0d131f] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrev} 
                    disabled={currentSlideIdx === 0} 
                    className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-600 dark:text-white disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-semibold text-sm min-w-[100px] text-center">
                    {t('materi.slide') || 'Slide'} {currentSlideIdx + 1} / {slides.length || 1}
                  </div>
                  
                  <button 
                    onClick={handleNext} 
                    disabled={currentSlideIdx === slides.length - 1} 
                    className="w-10 h-10 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {youtubeId && (
                    <a 
                      href={currentSlide?.fileUrl || "#"} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm"
                    >
                      <Play className="w-4 h-4" />
                      {t('materi.open_youtube') || 'Buka di YouTube'}
                    </a>
                  )}
                  
                  <button
                    onClick={toggleFullscreen}
                    title="Fullscreen"
                    className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-600 dark:text-white transition-colors shrink-0"
                  >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Notes Section (order-3 on mobile) */}
            {moduleData?.notes && (
              <div className="order-3 lg:order-none bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-sm w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-white/5 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('materi.module_notes') || 'Catatan Materi'}</h3>
                  </div>
                  
                  {/* Font Size Toggles */}
                  <div className="flex items-center bg-slate-100 dark:bg-[#0a0f16] rounded-lg p-1 border border-slate-200 dark:border-white/5 self-start sm:self-auto shrink-0">
                    <button 
                      onClick={() => setNotesFontSize('sm')}
                      className={`w-9 h-9 rounded-md flex items-center justify-center font-bold transition-all ${notesFontSize === 'sm' ? 'bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                      title="Teks Kecil"
                    >
                      <span className="text-[11px]">A</span>
                    </button>
                    <button 
                      onClick={() => setNotesFontSize('md')}
                      className={`w-9 h-9 rounded-md flex items-center justify-center font-bold transition-all ${notesFontSize === 'md' ? 'bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                      title="Teks Sedang"
                    >
                      <span className="text-[14px]">A</span>
                    </button>
                    <button 
                      onClick={() => setNotesFontSize('lg')}
                      className={`w-9 h-9 rounded-md flex items-center justify-center font-bold transition-all ${notesFontSize === 'lg' ? 'bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                      title="Teks Besar"
                    >
                      <span className="text-[18px]">A</span>
                    </button>
                  </div>
                </div>
                <div className="mt-4 bg-slate-50/50 dark:bg-[#0a0f16]/30 rounded-xl p-4 sm:p-6 border border-slate-100 dark:border-white/5">
                  <HtmlNotes html={moduleData.notes} fontSizeClass={fontSizeStyles[notesFontSize]} />
                </div>
              </div>
            )}
          </div>

          {/* Right Column Wrapper */}
          <div className="contents lg:block lg:col-span-1 lg:space-y-6 lg:sticky lg:top-28">
            
              {/* 1. Module Progress (order-1 on mobile) */}
            <div className="order-1 lg:order-none bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm w-full">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t('materi.module_progress') || 'Progres Modul'}</h3>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-500 dark:text-slate-400">{t('materi.completion') || 'Penyelesaian'}</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {slides?.length > 1 ? Math.round((currentSlideIdx / (slides.length - 1)) * 100) : (currentSlideIdx >= 0 ? 100 : 0)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${slides?.length > 1 ? (currentSlideIdx / (slides.length - 1)) * 100 : (currentSlideIdx >= 0 ? 100 : 0)}%` }}
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
