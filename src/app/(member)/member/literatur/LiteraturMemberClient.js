"use client";

import React, { useState } from "react";
import { FolderOpen, Search, ExternalLink, Calendar, User, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const TYPE_COLORS = {
  PDF:    "bg-red-500/10 text-red-400 border-red-500/20",
  SLIDES: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  DOC:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  VIDEO:  "bg-purple-500/10 text-purple-400 border-purple-500/20",
  OTHER:  "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function LiteraturMemberClient({ initialItems, categories }) {
  const [items] = useState(initialItems || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems = items.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      (item.title || "").toLowerCase().includes(q) ||
      (item.author || "").toLowerCase().includes(q);
    const matchCat = activeCategory === "all" || item.categoryId?.toString() === activeCategory ||
      item.category?.id?.toString() === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="w-full relative select-none">
      
      {/* Glow Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-wide uppercase">
            E-Learning Library
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white mt-4 flex items-center gap-3">
            <FolderOpen className="w-9 h-9 text-primary animate-pulse" />
            Bank Literatur & Referensi
          </h1>
          <p className="text-white/50 max-w-xl font-medium text-sm mt-2 leading-relaxed">
            Cari dan baca berbagai modul, jurnal akademik, buku referensi, serta artikel eksternal pilihan.
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Cari judul / penulis..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#08120e] border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 shadow-inner"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
            activeCategory === "all"
              ? "bg-primary text-[#050e0a] border-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-[#08120e] text-white/50 border-white/5 hover:text-white hover:bg-white/5"
          }`}
        >
          Semua Kategori
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id.toString())}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
              activeCategory === cat.id.toString()
                ? "bg-primary text-[#050e0a] border-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-[#08120e] text-white/50 border-white/5 hover:text-white hover:bg-white/5"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredItems.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-[#08120e] border border-dashed border-white/5 rounded-3xl">
          <FolderOpen className="w-12 h-12 text-white/10 mb-4 animate-pulse" />
          <h3 className="text-lg font-black text-white mb-1">Tidak ada literatur ditemukan</h3>
          <p className="text-white/40 text-xs max-w-xs leading-relaxed mt-1">Coba cari dengan kata kunci lain atau pilih kategori berbeda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.a
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
              key={item.id}
              href={item.driveUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-gradient-to-b from-white/10 to-[#08120e] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col group shadow-lg"
            >
              {/* Category Cover */}
              <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/10 to-[#08120e] border-b border-white/5">
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                {item.category?.imageUrl ? (
                  <img
                    src={item.category.imageUrl}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-primary/30">
                    <FolderOpen className="w-10 h-10 animate-pulse" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                    TYPE_COLORS[item.type] || TYPE_COLORS.OTHER
                  }`}>
                    {item.type || "OTHER"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 text-white/80 text-[8px] font-black uppercase tracking-widest border border-white/5">
                    {item.category?.name}
                  </span>
                </div>
              </div>

              {/* Title & metadata */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-white text-sm line-clamp-2 leading-snug mb-4 group-hover:text-primary transition-all tracking-tight">
                    {item.title}
                  </h3>
                  <div className="space-y-2 mb-6">
                    {item.author && (
                      <div className="flex items-center gap-2 text-xs text-white/50 font-medium">
                        <User className="w-4 h-4 text-primary shrink-0" />
                        <span className="truncate">{item.author}</span>
                      </div>
                    )}
                    {item.year && (
                      <div className="flex items-center gap-2 text-xs text-white/50 font-medium">
                        <Calendar className="w-4 h-4 text-primary shrink-0" />
                        <span>Tahun {item.year}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                  <span className="text-[10px] font-black text-primary tracking-widest uppercase flex items-center gap-1">
                    Buka Literatur
                  </span>
                  <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-primary group-hover:scale-110 transition-all" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
