"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ChevronRight, Calendar, User, ArrowRight, Search, FileText, Image as ImageIcon
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

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
    <div className="min-h-screen bg-[#e8ecc4] dark:bg-[#07130e] text-gray-900 dark:text-white font-sans selection:bg-primary/30">
      
      {/* Hero Section */}
      <section id="hero" className="scroll-mt-20 pt-40 pb-20 px-6 relative overflow-hidden bg-[#e8ecc4] dark:bg-[#07130e]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-0 md:px-6 relative z-10 text-center">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <FileText className="w-4 h-4" /> Latest Updates
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-gray-900 dark:text-white">
              Articles & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Insights</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-white/60 max-w-2xl mx-auto mb-10">
              Read the latest news, research, and updates from the Society of Renewable Energy UPN Veteran Jawa Timur.
            </p>
            
            <div className="relative max-w-xl mx-auto mb-12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search articles by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-2 justify-center overflow-x-auto pb-4 max-w-2xl mx-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
                    activeCategory === cat
                      ? "bg-primary text-[#050e0a] border-primary shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                      : "bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                >
                  {cat === "all" ? "All Topics" : cat}
                </button>
              ))}
            </div>

          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section id="grid" className="scroll-mt-20 py-20 px-6 bg-[#dce0b0] dark:bg-[#050e0a] border-t border-[#d0d6a8] dark:border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-0 md:px-6">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-gray-400 dark:text-white/20" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No Articles Found</h3>
              <p className="text-gray-600 dark:text-white/50">Try adjusting your search or check back later.</p>
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
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className="group"
                    >
                      <Link href={`/articles/${article.slug}`} className="block h-full">
                      <div className="bg-white/60 dark:bg-white/5 border border-[#d0d6a8] dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col hover:border-primary/25 backdrop-blur-sm">
                          <div className="h-56 relative overflow-hidden bg-black/50">
                            {article.imageUrl ? (
                              <img 
                                src={article.imageUrl} 
                                alt={article.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-12 h-12 text-gray-300 dark:text-white/10" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute top-4 left-4 z-10">
                              <span className="px-2.5 py-0.5 rounded bg-black/60 text-white text-[8px] font-black uppercase tracking-widest border border-white/5">
                                {cat}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-primary mb-4">
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                              
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                {article.title}
                              </h3>
                              
                              <p className="text-gray-600 dark:text-white/60 line-clamp-3 mb-6 text-sm leading-relaxed">
                                {article.body.replace(/<[^>]*>?/gm, '')}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-200 dark:border-white/10">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                                  {article.author?.name ? article.author.name.charAt(0) : "A"}
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white truncate w-32 font-medium">
                                  {article.author?.name || "Admin"}
                                </span>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <ArrowRight className="w-4 h-4" />
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
