"use client";

import React, { useState } from "react";
import { FolderOpen, Search, Filter, ExternalLink, Calendar, User, FileText } from "lucide-react";

const TYPE_COLORS = {
  PDF:    "bg-red-500/15 text-red-400 border-red-500/25",
  SLIDES: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  DOC:    "bg-blue-500/15 text-blue-400 border-blue-500/25",
  VIDEO:  "bg-purple-500/15 text-purple-400 border-purple-500/25",
  OTHER:  "bg-gray-500/15 text-gray-400 border-gray-500/25",
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
    <div className="w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-white">
            <FolderOpen className="w-8 h-8 text-primary" />
            Bank Literatur & Referensi
          </h1>
          <p className="text-gray-400 max-w-xl font-light">
            Cari dan baca berbagai jurnal, bahan bacaan, buku referensi, serta artikel eksternal.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
          <input
            type="text"
            placeholder="Cari judul / penulis..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
            activeCategory === "all"
              ? "bg-primary text-[#050e0a] border-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10"
          }`}
        >
          Semua Kategori
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id.toString())}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
              activeCategory === cat.id.toString()
                ? "bg-primary text-[#050e0a] border-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredItems.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
          <FolderOpen className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Tidak ada literatur ditemukan</h3>
          <p className="text-gray-500 text-sm">Coba cari dengan kata kunci lain atau pilih kategori berbeda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <a
              key={item.id}
              href={item.driveUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col group shadow-lg"
            >
              {/* Category Cover */}
              <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-b border-white/5">
                {item.category?.imageUrl ? (
                  <img
                    src={item.category.imageUrl}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-primary/30">
                    <FolderOpen className="w-8 h-8" />
                  </div>
                )}
                {/* badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                    TYPE_COLORS[item.type] || TYPE_COLORS.OTHER
                  }`}>
                    {item.type || "OTHER"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/55 text-white/80 text-[9px] font-bold uppercase tracking-wider">
                    {item.category?.name}
                  </span>
                </div>
              </div>

              {/* Title & metadata */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug mb-3 group-hover:text-primary transition-all">
                    {item.title}
                  </h3>
                  <div className="space-y-1.5 mb-6">
                    {item.author && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <User className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{item.author}</span>
                      </div>
                    )}
                    {item.year && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Tahun {item.year}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Buka Literatur</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
