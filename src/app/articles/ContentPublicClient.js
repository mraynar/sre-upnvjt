"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ChevronRight, Calendar, User, ArrowRight, Search, FileText, Image as ImageIcon, Sparkles
} from "lucide-react";

export default function ContentPublicClient({ initialArticles }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "Academic", "Energy Transition", "Chapter News", "Insights"];

  const getArticleCategory = (article) => {
    // Map articles to categorized tags or fallback to Insights
    if (article.title.toLowerCase().includes("biogas") || article.title.toLowerCase().includes("biofuel")) return "Energy Transition";
    if (article.title.toLowerCase().includes("smart grid") || article.title.toLowerCase().includes("microgrid")) return "Academic";
    if (article.title.toLowerCase().includes("mou") || article.title.toLowerCase().includes("partnership") || article.title.toLowerCase().includes("chapter")) return "Chapter News";
    return "Insights";
  };

  const filteredArticles = initialArticles.filter(art => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = art.title.toLowerCase().includes(q) || (art.author?.name || "").toLowerCase().includes(q);
    const category = getArticleCategory(art);
    const matchesCategory = activeCategory === "all" || category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#020806] text-white selection:bg-primary/30 antialiased select-none pb-20">
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
              <FileText className="w-3.5 h-3.5" /> Editorial & Discoveries
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mb-6 leading-none">
              Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Articles</span>
            </h1>
            <p className="text-base text-white/50 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Jelajahi tulisan riset akademik, berita resmi organisasi, serta pandangan kritis pengurus SRE UPN Veteran Jawa Timur mengenai transisi energi.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input 
                type="text"
                placeholder="Cari artikel berdasarkan judul atau penulis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#08120e] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 shadow-inner transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all border ${
                activeCategory === cat
                  ? "bg-primary text-[#020806] border-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "bg-[#08120e] text-white/50 border-white/5 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat === "all" ? "Semua Topik" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Section */}
      <section className="px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-[#08120e] border border-dashed border-white/5 rounded-3xl">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white/20 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-white mb-1">Artikel Tidak Ditemukan</h3>
              <p className="text-white/40 text-xs">Coba cari dengan kata kunci lain atau pilih topik berbeda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredArticles.map((article, index) => {
                  const cat = getArticleCategory(article);
                  return (
                    <motion.div
                      layout
                      key={article.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="group"
                    >
                      <Link href={`/articles/${article.slug}`} className="block h-full">
                        <div className="bg-gradient-to-b from-white/10 to-[#08120e] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col shadow-lg">
                          
                          {/* Banner Image */}
                          <div className="h-56 relative overflow-hidden bg-black">
                            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                            {article.imageUrl ? (
                              <img 
                                src={article.imageUrl} 
                                alt={article.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-12 h-12 text-white/10 animate-pulse" />
                              </div>
                            )}
                            
                            <div className="absolute top-4 left-4 z-10">
                              <span className="px-2.5 py-0.5 rounded bg-black/60 text-white text-[8px] font-black uppercase tracking-widest border border-white/5">
                                {cat}
                              </span>
                            </div>
                          </div>
                          
                          {/* Details */}
                          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary mb-4">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                              
                              <h3 className="text-lg font-black text-white mb-4 line-clamp-2 group-hover:text-primary transition-colors tracking-tight leading-snug">
                                {article.title}
                              </h3>
                              
                              <p className="text-white/50 line-clamp-3 mb-6 text-xs leading-relaxed font-medium">
                                {article.body.replace(/<[^>]*>?/gm, '')}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">
                                  {article.author?.name ? article.author.name.charAt(0).toUpperCase() : "A"}
                                </div>
                                <span className="text-xs font-bold text-white/70 truncate w-32">
                                  {article.author?.name || "SRE Staff"}
                                </span>
                              </div>
                              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-[#020806] transition-colors duration-300">
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
