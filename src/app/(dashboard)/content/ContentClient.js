"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Plus, Edit2, Trash2, X, FileText, Check, AlertCircle, Eye, EyeOff, Image as ImageIcon, Loader2
} from "lucide-react";
import { hasAccess } from "@/lib/permissions";
import { createContent, updateContent, deleteContent } from "@/app/actions/contentActions";

export default function ContentClient({ initialContents, currentUser }) {
  const [contents, setContents] = useState(initialContents || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    body: "",
    imageUrl: "",
    isPublished: false
  });

  const userForPerms = { ...currentUser, roleName: currentUser.role?.name || currentUser.roleName };
  const canCreate = hasAccess(userForPerms, "content", "create");
  const canUpdate = hasAccess(userForPerms, "content", "update");
  const canDelete = hasAccess(userForPerms, "content", "delete");

  const filteredContents = useMemo(() => {
    return contents.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contents, searchQuery]);

  const handleOpenModal = (content = null) => {
    setError("");
    if (content) {
      setSelectedContent(content);
      setFormData({
        title: content.title,
        slug: content.slug,
        body: content.body,
        imageUrl: content.imageUrl || "",
        isPublished: content.isPublished
      });
    } else {
      setSelectedContent(null);
      setFormData({
        title: "",
        slug: "",
        body: "",
        imageUrl: "",
        isPublished: false
      });
    }
    setIsModalOpen(true);
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: !selectedContent ? generateSlug(title) : prev.slug
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const dataToSubmit = {
      ...formData,
      updatedById: currentUser.id
    };

    let result;
    if (selectedContent) {
      result = await updateContent(selectedContent.id, dataToSubmit);
    } else {
      result = await createContent(dataToSubmit);
    }

    if (result.success) {
      setIsModalOpen(false);
      // Optimistic update
      if (selectedContent) {
        setContents(prev => prev.map(c => c.id === selectedContent.id ? { ...c, ...dataToSubmit } : c));
      } else {
        setContents(prev => [{ ...dataToSubmit, id: result.data.id, authorName: currentUser.name, createdAt: new Date() }, ...prev]);
      }
    } else {
      setError(result.error || "An error occurred.");
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedContent) return;
    setIsLoading(true);
    const result = await deleteContent(selectedContent.id);
    if (result.success) {
      setContents(prev => prev.filter(c => c.id !== selectedContent.id));
      setIsDeleteModalOpen(false);
    } else {
      setError(result.error || "Failed to delete.");
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 w-full space-y-6">
      {/* Header Stacked Layout */}
      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-primary/90 to-emerald-900 p-8 md:p-12 text-white shadow-2xl shadow-primary/20 mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <FileText className="w-4 h-4" /> Content Manager
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none drop-shadow-sm">
              Articles & News
            </h1>
            <p className="text-white/80 max-w-lg text-sm md:text-base font-medium leading-relaxed">
              Manage your publications, research insights, and organization updates with a seamless editing experience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <div className="relative w-full sm:w-auto">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input 
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all shadow-inner"
              />
            </div>
            {canCreate && (
              <button 
                onClick={() => handleOpenModal()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-emerald-900 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Create New</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {filteredContents.length === 0 ? (
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-white/20 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Content Found</h3>
          <p className="text-gray-500 dark:text-white/50 mb-6 max-w-md mx-auto">Get started by creating your first article or publication to share with the world.</p>
          {canCreate && (
            <button onClick={() => handleOpenModal()} className="inline-flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-6 py-2.5 rounded-xl font-bold transition-colors">
              <Plus className="w-4 h-4" /> Create Content
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredContents.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                className="group relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col"
              >
                {/* Image Header */}
                <div className="h-48 bg-gray-100 dark:bg-black/50 relative overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-300 dark:text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase backdrop-blur-md border ${item.isPublished ? 'bg-primary/20 text-emerald-300 border-primary/30' : 'bg-orange-500/20 text-orange-300 border-orange-500/30'}`}>
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-white/50 line-clamp-2 mb-4 flex-1">
                    {item.body.replace(/<[^>]*>?/gm, '')}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                        {item.authorName.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-white/70">{item.authorName}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canUpdate && (
                        <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => { setSelectedContent(item); setIsDeleteModalOpen(true); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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
                    {selectedContent ? <Edit2 className="w-6 h-6 text-primary" /> : <Plus className="w-6 h-6 text-primary" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                      {selectedContent ? "Edit Content" : "Create New Content"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-white/50">
                      Craft your story. It auto-adapts to light and dark themes.
                    </p>
                  </div>
                </div>
                <button onClick={() => !isLoading && setIsModalOpen(false)} className="p-3 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all hover:rotate-90">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 p-6 md:px-12 md:py-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
                <div className="max-w-4xl mx-auto">
                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-500">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <form id="contentForm" onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 ml-1">Title</label>
                        <input required type="text" value={formData.title} onChange={handleTitleChange} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white transition-all shadow-sm" placeholder="Article Title" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 ml-1">Slug / URL</label>
                        <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white transition-all font-mono shadow-sm" placeholder="article-url-slug" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 ml-1">Cover Image URL</label>
                      <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white transition-all shadow-sm" placeholder="https://example.com/image.jpg" />
                    </div>

                    <div className="space-y-3 flex flex-col h-full">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 ml-1">Content Body</label>
                      <textarea required rows={12} value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} className="w-full flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white transition-all resize-none shadow-sm leading-relaxed" placeholder="Write your content here..." />
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-linear-to-r from-gray-50 to-white dark:from-white/5 dark:to-transparent rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                      <div className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${formData.isPublished ? 'bg-primary' : 'bg-gray-300 dark:bg-white/20'}`} onClick={() => setFormData({...formData, isPublished: !formData.isPublished})}>
                        <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-md" animate={{ x: formData.isPublished ? 28 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                      </div>
                      <div>
                        <div className="text-base font-bold text-gray-900 dark:text-white">Publish Content</div>
                        <div className="text-sm text-gray-500 dark:text-white/50 mt-0.5">Make this article immediately visible to the public.</div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="px-6 md:px-12 py-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#050e0a] flex justify-end gap-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-10 relative">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isLoading} className="px-8 py-3.5 text-base font-bold text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" form="contentForm" disabled={isLoading} className="flex items-center gap-2 px-8 py-3.5 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 active:scale-95">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  {selectedContent ? "Save Changes" : "Create Content"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60" onClick={() => !isLoading && setIsDeleteModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-[#0a1612] rounded-3xl shadow-2xl z-60 overflow-hidden border border-gray-200 dark:border-white/10 p-6 text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Content?</h3>
              <p className="text-sm text-gray-500 dark:text-white/50 mb-6">Are you sure you want to delete "{selectedContent?.title}"? This action cannot be undone.</p>
              
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} disabled={isLoading} className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50">Cancel</button>
                <button onClick={handleDelete} disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
