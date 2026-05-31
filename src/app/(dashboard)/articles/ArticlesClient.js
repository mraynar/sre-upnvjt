"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Newspaper, Plus, Edit2, Trash2, X, Search, Image as ImageIcon, Calendar, Eye, EyeOff
} from "lucide-react";
import { createArticle, updateArticle, deleteArticle } from "@/app/actions/articleActions";

const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export default function ArticlesClient({ initialArticles, currentUser }) {
  const [articles, setArticles] = useState(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [titleInput, setTitleInput] = useState("");
  const [slugInput, setSlugInput] = useState("");

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (a.excerpt && a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const refreshData = () => window.location.reload();

  const handleOpenModal = (isEdit, data = null) => {
    setModal({ isOpen: true, isEdit, data });
    setTitleInput(data?.title || "");
    setSlugInput(data?.slug || "");
    setError(null);
  };

  const handleTitleChange = (e) => {
    setTitleInput(e.target.value);
    if (!modal.isEdit) {
      setSlugInput(generateSlug(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    
    const data = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      content: formData.get("content"),
      excerpt: formData.get("excerpt"),
      thumbnailUrl: formData.get("thumbnailUrl"),
      isPublished: formData.get("isPublished") === "true",
      authorId: currentUser.id,
    };

    let res;
    if (modal.isEdit) {
      res = await updateArticle(modal.data.id, data);
    } else {
      res = await createArticle(data);
    }

    setLoading(false);
    if (res.success) {
      setModal({ isOpen: false, isEdit: false, data: null });
      refreshData();
    } else {
      setError(res.error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus artikel ini secara permanen?")) return;
    const res = await deleteArticle(id);
    if (res.success) refreshData();
    else alert("Gagal menghapus: " + res.error);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-white">
            <Newspaper className="w-8 h-8 text-primary" />
            CMS Publikasi
          </h1>
          <p className="text-white/50 max-w-xl">
            Sistem manajemen konten untuk artikel, berita, dan press release SRE UPNVJT.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <button 
            onClick={() => handleOpenModal(false)}
            className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Tulis Artikel</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center backdrop-blur-md">
            <Newspaper className="w-16 h-16 text-white/10 mb-4" />
            <h3 className="text-xl font-display font-bold text-white mb-2">Belum Ada Artikel</h3>
            <p className="text-white/40">Mulai tulis press release atau berita kegiatan SRE.</p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm relative group hover:bg-white/[0.04] transition-all flex flex-col h-full"
            >
              {/* Thumbnail Area */}
              <div className="h-40 w-full bg-white/5 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-white/5">
                {article.thumbnailUrl ? (
                  <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-white/10" />
                )}
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => handleOpenModal(true, article)} className="p-3 bg-white/10 hover:bg-primary text-white hover:text-[#050e0a] rounded-xl backdrop-blur-md transition-colors shadow-xl">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(article.id)} className="p-3 bg-white/10 hover:bg-red-500 text-white rounded-xl backdrop-blur-md transition-colors shadow-xl">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute top-3 left-3 flex gap-2">
                  {article.isPublished ? (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-[#050e0a] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg">
                      <Eye className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-white/20 text-white backdrop-blur-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg border border-white/10">
                      <EyeOff className="w-3 h-3" /> Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2" title={article.title}>{article.title}</h3>
                <p className="text-white/40 text-xs line-clamp-3 mb-4">{article.excerpt}</p>
                
                <div className="mt-auto flex items-center justify-between text-xs text-white/30 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <span className="font-medium text-white/50">{article.author?.name}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setModal({ isOpen: false, isEdit: false, data: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a1f18] border border-white/10 rounded-3xl w-full max-w-4xl relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-8 border-b border-white/10 shrink-0 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white">
                  {modal.isEdit ? "Edit Artikel" : "Tulis Artikel Baru"}
                </h2>
                <button onClick={() => setModal({ isOpen: false, isEdit: false, data: null })} className="text-white/50 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 md:p-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
                
                <form id="article-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Col - Editor */}
                  <div className="lg:col-span-2 space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Judul Artikel</label>
                      <input name="title" type="text" required value={titleInput} onChange={handleTitleChange} placeholder="Judul yang menarik..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors text-lg font-bold" />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Konten / Isi Artikel (HTML / Teks Bebas)</label>
                      <textarea name="content" required defaultValue={modal.data?.content} placeholder="Tuliskan isi berita atau artikel di sini..." rows="12" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors resize-none font-mono text-sm leading-relaxed" />
                      <p className="text-[10px] text-white/30 mt-2">Mendukung input tag HTML dasar jika diperlukan (seperti &lt;br&gt;, &lt;b&gt;, &lt;a&gt;).</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Kutipan Singkat (Excerpt)</label>
                      <textarea name="excerpt" rows="2" defaultValue={modal.data?.excerpt} placeholder="Ringkasan 1-2 kalimat untuk ditampilkan di kartu artikel..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors resize-none text-sm" />
                    </div>
                  </div>

                  {/* Right Col - Settings */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Slug (URL)</label>
                      <input name="slug" type="text" required value={slugInput} onChange={(e) => setSlugInput(e.target.value)} placeholder="judul-artikel-ini" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/70 focus:outline-none focus:border-primary/50 transition-colors font-mono text-xs" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Tautan Thumbnail (Cover)</label>
                      <input name="thumbnailUrl" type="url" defaultValue={modal.data?.thumbnailUrl} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors text-sm" />
                      {modal.data?.thumbnailUrl && (
                        <div className="mt-3 aspect-video bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                          <img src={modal.data.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Status Publikasi</label>
                      <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="radio" name="isPublished" value="true" defaultChecked={modal.data ? modal.data.isPublished : true} className="w-4 h-4 accent-primary" />
                          <span className="text-sm font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2"><Eye className="w-4 h-4" /> Publikasi (Live)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="radio" name="isPublished" value="false" defaultChecked={modal.data ? !modal.data.isPublished : false} className="w-4 h-4 accent-primary" />
                          <span className="text-sm font-medium text-white/50 group-hover:text-white transition-colors flex items-center gap-2"><EyeOff className="w-4 h-4" /> Simpan sbg Draft</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-white/10 shrink-0 flex justify-end gap-3">
                <button type="button" onClick={() => setModal({ isOpen: false, isEdit: false, data: null })} className="px-6 py-3 rounded-xl font-bold text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                  Batal
                </button>
                <button form="article-form" type="submit" disabled={loading} className="bg-primary text-[#050e0a] px-8 py-3 rounded-xl font-bold hover:bg-primary-focus hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                  {loading ? "Menyimpan..." : (modal.isEdit ? "Perbarui Artikel" : "Terbitkan Artikel")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
