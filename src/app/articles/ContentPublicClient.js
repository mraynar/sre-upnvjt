"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronRight, Calendar, ArrowRight, Search, FileText, Leaf
} from "lucide-react";

// ─── Animation Variants ────────────────────────────────────────────────────────

const staggerGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
};

// ─── Category Badge Colors ─────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  Research: "bg-emerald-900/60 text-emerald-300 border-emerald-700/40",
  News: "bg-blue-900/40 text-blue-300 border-blue-700/30",
  Insight: "bg-amber-900/40 text-amber-300 border-amber-700/30",
  default: "bg-black/60 text-white border-[#07130e]/15 dark:border-white/10",
};

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ query }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-24 flex flex-col items-center gap-6"
    >
      {/* Brand illustration — leaf/solar motif */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
          aria-hidden="true"
        />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/15 to-emerald-900/30 border border-primary/20 flex items-center justify-center">
          <Leaf className="w-10 h-10 text-primary/60" aria-hidden="true" />
        </div>
      </div>
      <div>
        <h3 className="text-[22px] font-display font-black uppercase tracking-tight text-[#07130e] dark:text-white mb-2">
          No Articles Found
        </h3>
        <p className="text-[14px] text-[#07130e]/50 dark:text-white/40 max-w-xs mx-auto leading-relaxed">
          {query
            ? `No results for "${query}". Try a different keyword or browse all topics.`
            : "No articles available in this category yet. Check back soon."}
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-6 py-2.5 rounded-full border border-slate-200 dark:border-white/10 text-[12px] font-bold uppercase tracking-widest text-[#07130e]/60 dark:text-white/40 hover:border-primary hover:text-primary transition-all duration-300 focus-visible:outline-primary"
      >
        Browse All
      </button>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ContentPublicClient({ initialArticles }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "Research", "News", "Insight"];

  const getArticleCategory = (article) => {
    const titleLower = article.title.toLowerCase();
    if (titleLower.includes("biofuel") || titleLower.includes("wind") || titleLower.includes("grid")) return "Research";
    if (titleLower.includes("event") || titleLower.includes("chapter") || titleLower.includes("mou")) return "News";
    return "Insight";
  };

  const filteredArticles = initialArticles.filter(art => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = art.title.toLowerCase().includes(q) || (art.author?.name || "").toLowerCase().includes(q);
    const category = getArticleCategory(art);
    const matchesCategory = activeCategory === "all" || category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0bb37e] dark:bg-[#07130e] text-white dark:text-white font-sans selection:bg-yellow-300">
      
      {/* ── Hero / Filter Section ──────────────────────────────────────────── */}
      <section id="hero" className="scroll-mt-20 pt-40 pb-20 px-6 relative overflow-hidden bg-[#0bb37e] dark:bg-[#07130e]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-7xl mx-auto px-0 md:px-6 relative z-10 text-center">
          <motion.div {...fadeUp} initial={fadeUp.initial} animate={fadeUp.animate} transition={fadeUp.transition}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-yellow-300 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              <FileText className="w-4 h-4" aria-hidden="true" /> Latest Updates
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white dark:text-white font-display">
              Articles &{" "}
              <span className="text-yellow-300 dark:text-emerald-400">
                Insights
              </span>
            </h1>
            <p className="text-lg text-emerald-50/90 dark:text-white/55 max-w-2xl mx-auto mb-10">
              Read the latest news, research, and updates from the Society of Renewable Energy UPN Veteran Jawa Timur.
            </p>
            
            {/* Search bar with focus animation */}
            <div className="relative max-w-xl mx-auto mb-12 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-300 dark:group-focus-within:text-emerald-400 transition-colors duration-300 pointer-events-none" aria-hidden="true" />
              <input 
                type="text"
                placeholder="Search articles by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search articles"
                className="w-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white dark:text-white placeholder:text-white/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 dark:focus:ring-primary/50 focus:border-yellow-300/40 dark:focus:border-primary/40 shadow-lg shadow-slate-100 dark:shadow-none transition-all duration-300 focus:scale-[1.01] backdrop-blur-sm"
              />
            </div>

            {/* ── Animated category filter pills ──────────────────────────── */}
            <div
              role="tablist"
              aria-label="Article categories"
              className="flex gap-2 justify-center overflow-x-auto pb-4 max-w-2xl mx-auto hide-scrollbar"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-colors duration-200 border focus-visible:outline-yellow-300 ${
                    activeCategory === cat
                      ? "text-slate-950 dark:text-slate-950 border-transparent"
                      : "bg-white/10 dark:bg-white/5 text-white/80 dark:text-gray-400 border-white/20 dark:border-white/5 hover:text-yellow-300 dark:hover:text-white hover:border-white/30 dark:hover:border-white/15"
                  }`}
                >
                  {/* Animated sliding background pill */}
                  {activeCategory === cat && (
                    <motion.span
                      layoutId="cat-active-pill"
                      className="absolute inset-0 rounded-xl bg-yellow-300 dark:bg-emerald-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">
                    {cat === "all" ? "All Topics" : cat}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Articles Grid Section ──────────────────────────────────────────── */}
      <section
        id="grid"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Articles grid"
        className="scroll-mt-20 py-20 px-6 bg-slate-50 dark:bg-[#050e0a] border-t border-slate-200 dark:border-white/5 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-0 md:px-6">
          <AnimatePresence mode="wait">
            {filteredArticles.length === 0 ? (
              <EmptyState key="empty-state" query={searchQuery} />
            ) : (
              <motion.div
                key={`grid-${activeCategory}-${searchQuery}`}
                variants={staggerGrid}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredArticles.map((article) => {
                  const cat = getArticleCategory(article);
                  const catColor = CATEGORY_COLORS[cat] || CATEGORY_COLORS.default;
                  return (
                    <motion.div
                      key={article.id}
                      variants={cardVariant}
                      layout
                      className="group"
                    >
                      <Link href={`/articles/${article.slug}`} className="block h-full focus-visible:outline-primary focus-visible:rounded-3xl">
                        <div className="bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/8 transition-all duration-500 h-full flex flex-col hover:border-yellow-300 dark:hover:border-primary/30 hover:-translate-y-1 backdrop-blur-sm">
                          
                          {/* Image */}
                          <div className="h-56 relative overflow-hidden bg-black/30">
                            {article.imageUrl ? (
                              <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-emerald-900/20">
                                <Leaf className="w-12 h-12 text-primary/30" aria-hidden="true" />
                              </div>
                            )}
                            {/* Hover gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" aria-hidden="true" />
                            {/* Category badge */}
                            <div className="absolute top-4 left-4 z-10">
                              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border backdrop-blur-sm ${catColor}`}>
                                {cat}
                              </span>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-yellow-300 dark:text-emerald-400 mb-3">
                                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                                <time dateTime={article.createdAt}>
                                  {new Date(article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </time>
                              </div>
                              
                              <h3 className="text-[19px] font-bold text-white dark:text-white mb-3.5 line-clamp-2 group-hover:text-yellow-300 dark:group-hover:text-emerald-400 transition-colors duration-200 leading-snug font-display">
                                {article.title}
                              </h3>
                              
                              <p className="text-[13px] text-emerald-50/90 dark:text-white/55 line-clamp-3 mb-5 leading-relaxed">
                                {article.body.replace(/<[^>]*>?/gm, '')}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/10 dark:border-[#07130e]/10 dark:border-white/8">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-white/15 text-yellow-300 dark:text-emerald-400 flex items-center justify-center text-xs font-black" aria-hidden="true">
                                  {article.author?.name ? article.author.name.charAt(0).toUpperCase() : "S"}
                                </div>
                                <span className="text-[13px] font-semibold text-white dark:text-white truncate max-w-[120px]">
                                  {article.author?.name || "SRE UPNVJT"}
                                </span>
                              </div>
                              <div
                                className="w-9 h-9 rounded-full bg-white/10 dark:bg-white/8 flex items-center justify-center group-hover:bg-yellow-300 dark:group-hover:bg-primary group-hover:text-slate-950 dark:group-hover:text-white transition-all duration-300 text-white dark:text-white/50"
                                aria-hidden="true"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
