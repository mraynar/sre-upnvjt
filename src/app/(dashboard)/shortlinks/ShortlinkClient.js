"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Search, X, Check, Loader2, AlertCircle, Link as LinkIcon, Copy, ExternalLink, BarChart2 } from "lucide-react";
import { createShortlink, updateShortlink, deleteShortlink } from "@/app/actions/shortlinkActions";
import { hasAccess } from "@/lib/permissions";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function ShortlinkClient({ initialData, user }) {
  const { t } = useLanguage();
  const [shortlinks, setShortlinks] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedShortlink, setSelectedShortlink] = useState(null);
  
  const [formData, setFormData] = useState({
    slug: "",
    originalUrl: "",
    isActive: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canCreate = hasAccess(user, "shortlinks", "create");
  const canUpdate = hasAccess(user, "shortlinks", "update");
  const canDelete = hasAccess(user, "shortlinks", "delete");

  const filteredData = shortlinks.filter(item => 
    item.slug.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setSelectedShortlink(null);
    setFormData({
      slug: Math.random().toString(36).substring(2, 8),
      originalUrl: "",
      isActive: true
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedShortlink(item);
    setFormData({
      slug: item.slug,
      originalUrl: item.originalUrl,
      isActive: item.isActive
    });
    setError("");
    setIsModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedShortlink(item);
    setIsDeleteModalOpen(true);
  };

  const handleSlugGenerate = () => {
    setFormData({ ...formData, slug: Math.random().toString(36).substring(2, 8) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let res;
      if (selectedShortlink) {
        res = await updateShortlink(selectedShortlink.id, formData);
      } else {
        res = await createShortlink(formData);
      }

      if (!res.success) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await deleteShortlink(selectedShortlink.id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        window.location.reload();
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (slug) => {
    const url = `${window.location.origin}/s/${slug}`;
    navigator.clipboard.writeText(url);
    alert("Shortlink copied to clipboard!");
  };

  return (
    <div className="p-6 w-full space-y-6">
      {/* Header Stacked Layout */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/90 to-emerald-900 p-8 md:p-12 text-white shadow-2xl shadow-primary/20 mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <LinkIcon className="w-4 h-4" /> URL Shortener
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none drop-shadow-sm">
              {t("shortlinks.title")}
            </h1>
            <p className="text-white/80 max-w-lg text-sm md:text-base font-medium leading-relaxed">
              {t("shortlinks.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <div className="relative w-full sm:w-auto">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input 
                type="text"
                placeholder={t("shortlinks.search")}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all shadow-inner"
              />
            </div>
            {canCreate && (
              <button 
                onClick={openCreateModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-emerald-900 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>{t("shortlinks.create")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredData.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-white dark:bg-[#050e0a] rounded-[2rem] border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.isActive ? 'bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-400'}`} />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">
                        {item.isActive ? t("shortlinks.active") : t("shortlinks.inactive")}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight break-all">
                      /{item.slug}
                    </h3>
                  </div>
                  <div className="flex bg-gray-50 dark:bg-white/5 rounded-2xl p-1 border border-gray-100 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copyToClipboard(item.slug)} className="p-2 text-gray-400 hover:text-primary transition-colors" title="Copy Shortlink">
                      <Copy className="w-4 h-4" />
                    </button>
                    {canUpdate && (
                      <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-primary transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={() => openDeleteModal(item)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 mb-6 border border-gray-100 dark:border-white/5">
                  <div className="text-xs uppercase font-bold text-gray-400 dark:text-white/30 mb-1 flex items-center gap-1"><LinkIcon className="w-3 h-3"/> {t("shortlinks.original_url")}</div>
                  <a href={item.originalUrl} target="_blank" rel="noreferrer" className="text-sm text-gray-600 dark:text-white/70 line-clamp-2 hover:text-primary hover:underline transition-colors flex items-center gap-1 group/link">
                    {item.originalUrl}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-white/50">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    <span className="font-bold text-gray-900 dark:text-white">{item.clicks}</span>
                    <span className="text-sm">{t("shortlinks.clicks")}</span>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-20 bg-white/40 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 border-dashed">
          <LinkIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-white/20 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("shortlinks.no_shortlinks")}</h3>
          <p className="text-gray-500 dark:text-white/50">{t("shortlinks.no_shortlinks_desc")}</p>
        </div>
      )}

      {/* Create/Edit Modal - FULLSCREEN */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 md:inset-4 lg:inset-8 bg-white dark:bg-[#0a1612] md:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-white/10">
              
              <div className="px-6 md:px-12 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    {selectedShortlink ? <Edit2 className="w-6 h-6 text-primary" /> : <Plus className="w-6 h-6 text-primary" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                      {selectedShortlink ? t("shortlinks.edit_title") : t("shortlinks.create_title")}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-white/50">
                      {t("shortlinks.modal_desc")}
                    </p>
                  </div>
                </div>
                <button onClick={() => !isLoading && setIsModalOpen(false)} className="p-3 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all hover:rotate-90">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 p-6 md:px-12 md:py-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 flex items-center justify-center">
                <div className="w-full max-w-2xl">
                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-500">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <form id="shortlinkForm" onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-[#050e0a] p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl">
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 ml-1">{t("shortlinks.dest_url")}</label>
                      <input required type="url" value={formData.originalUrl} onChange={e => setFormData({...formData, originalUrl: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white transition-all shadow-sm" placeholder="https://very-long-url.com/event/registration-form" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 ml-1">{t("shortlinks.custom_slug")}</label>
                        <button type="button" onClick={handleSlugGenerate} className="text-xs font-bold text-primary hover:text-primary-focus transition-colors">{t("shortlinks.generate")}</button>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-gray-100 dark:bg-white/10 border border-r-0 border-gray-200 dark:border-white/10 rounded-l-2xl px-4 py-4 text-gray-500 dark:text-white/50 font-mono text-sm shrink-0 flex items-center h-[58px]">
                          {typeof window !== 'undefined' ? window.location.host : 'sre-upnvjt.com'}/s/
                        </div>
                        <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-r-2xl px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white transition-all font-mono shadow-sm h-[58px]" placeholder="my-event" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-white dark:from-white/5 dark:to-transparent rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm mt-8">
                      <div className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${formData.isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-white/20'}`} onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
                        <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-md" animate={{ x: formData.isActive ? 28 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                      </div>
                      <div>
                        <div className="text-base font-bold text-gray-900 dark:text-white">{t("shortlinks.active_status")}</div>
                        <div className="text-sm text-gray-500 dark:text-white/50 mt-0.5">{t("shortlinks.active_desc")}</div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="px-6 md:px-12 py-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#050e0a] flex justify-end gap-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-10 relative">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isLoading} className="px-8 py-3.5 text-base font-bold text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-colors disabled:opacity-50">{t("shortlinks.cancel")}</button>
                <button type="submit" form="shortlinkForm" disabled={isLoading} className="flex items-center gap-2 px-8 py-3.5 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 active:scale-95">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  {selectedShortlink ? t("shortlinks.save") : t("shortlinks.create_link")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isLoading && setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white dark:bg-[#0a1f18] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-red-100 dark:border-red-900/30 text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">{t("shortlinks.delete_title")}</h3>
              <p className="text-gray-500 dark:text-white/60 mb-8 leading-relaxed">
                {t("shortlinks.delete_desc")} <span className="font-bold text-gray-900 dark:text-white">/{selectedShortlink?.slug}</span>{t("shortlinks.delete_desc2")}
              </p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} disabled={isLoading} className="flex-1 px-6 py-3.5 text-base font-bold text-gray-600 dark:text-white/70 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-2xl transition-colors disabled:opacity-50">
                  {t("shortlinks.cancel")}
                </button>
                <button onClick={handleDelete} disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  {t("shortlinks.delete")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
