"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, X, Search, CheckCircle2,
  XCircle, AlertTriangle, ImageIcon, Presentation, UploadCloud
} from "lucide-react";
import { createActivity, updateActivity, deleteActivity } from "@/app/actions/activityActions";

const EMPTY_ACTIVITY = {
  title: "",
  description: "",
  imageUrl: "",
  isPublished: true,
};

export default function ActivityClient({ initialActivities }) {
  const [activities, setActivities] = useState(initialActivities || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(EMPTY_ACTIVITY);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const isEditing = Boolean(currentActivity.id);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "activities");

    try {
      setIsLoading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setCurrentActivity(prev => ({ ...prev, imageUrl: data.url }));
        showNotification("success", "Image uploaded successfully");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      showNotification("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (activity) => {
    if (activity) {
      setCurrentActivity({ ...activity });
    } else {
      setCurrentActivity({ ...EMPTY_ACTIVITY });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setCurrentActivity({ ...EMPTY_ACTIVITY }), 300);
  };

  const handleOpenDeleteModal = (activity) => {
    setCurrentActivity({ ...activity });
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTimeout(() => setCurrentActivity({ ...EMPTY_ACTIVITY }), 300);
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isEditing) {
      const res = await updateActivity(currentActivity.id, currentActivity);
      if (res.success) {
        setActivities(activities.map(a => a.id === currentActivity.id ? res.activity : a));
        showNotification("success", "Activity updated successfully!");
        handleCloseModal();
      } else {
        showNotification("error", res.error);
      }
    } else {
      const res = await createActivity(currentActivity);
      if (res.success) {
        setActivities([res.activity, ...activities]);
        showNotification("success", "Activity created successfully!");
        handleCloseModal();
      } else {
        showNotification("error", res.error);
      }
    }
    setIsLoading(false);
  };

  const handleDeleteActivity = async () => {
    if (!currentActivity.id) return;
    setIsLoading(true);
    const res = await deleteActivity(currentActivity.id);
    if (res.success) {
      setActivities(activities.filter(a => a.id !== currentActivity.id));
      showNotification("success", "Activity deleted successfully!");
      handleCloseDeleteModal();
    } else {
      showNotification("error", res.error);
    }
    setIsLoading(false);
  };

  const filteredActivities = activities.filter(a =>
    (a.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <Presentation className="w-8 h-8 text-primary" />
            Programs & Activities
          </h1>
          <p className="text-gray-500 dark:text-white/50 max-w-xl">
            Kelola program utama dan aktivitas organisasi yang ditampilkan di carousel beranda (landing page).
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/30" />
            <input 
              type="text"
              placeholder="Cari aktivitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Tambah Aktivitas</span>
          </button>
        </div>
      </div>



        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-3xl overflow-hidden backdrop-blur-xl relative group hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-black/50 border-b border-gray-200 dark:border-white/5">
                    {activity.imageUrl ? (
                      <img
                        src={activity.imageUrl}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-white/20">
                        <ImageIcon className="w-10 h-10 mb-2" />
                        <span className="text-[12px]">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                        activity.isPublished
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-white dark:bg-white/10 shadow-sm dark:shadow-none text-gray-500 dark:text-white/60 border-gray-200 dark:border-white/20"
                      }`}>
                        {activity.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-primary transition-colors">{activity.title}</h3>
                    <p className="text-[13px] text-gray-500 dark:text-white/50 line-clamp-2 mb-4 flex-1">
                      {activity.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10 mt-auto">
                      <span className="text-[11px] text-gray-500 dark:text-white/30">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(activity)}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/10 text-gray-500 dark:text-white/70 hover:text-gray-900 dark:text-white flex items-center justify-center transition-all border border-transparent hover:border-gray-200 dark:border-white/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(activity)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center transition-all border border-transparent hover:border-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/5 rounded-3xl backdrop-blur-md shadow-sm border-dashed">
                <Presentation className="w-12 h-12 text-gray-500 dark:text-white/20 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No activities found</h3>
                <p className="text-gray-500 dark:text-white/40 text-sm">Create a new activity to showcase on the landing page.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      {/* Activity Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-white dark:bg-[#050e0a]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {isEditing ? "Edit Activity" : "New Activity"}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-500 dark:text-white/50 hover:text-gray-900 dark:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <form id="activityForm" onSubmit={handleSaveActivity} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">Activity Title</label>
                      <input
                        type="text"
                        required
                        value={currentActivity.title}
                        onChange={(e) => setCurrentActivity(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full h-12 px-4 bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
                        placeholder="e.g. SRE Mengajar 2026"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">Description</label>
                      <textarea
                        required
                        value={currentActivity.description}
                        onChange={(e) => setCurrentActivity(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-4 bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:text-white/20 focus:outline-none focus:border-primary/50 transition-all resize-none h-24"
                        placeholder="Short description for the carousel..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">Cover Image</label>
                      <div className="flex gap-4">
                        {currentActivity.imageUrl && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-white/10 bg-black">
                            <img src={currentActivity.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <input
                          type="text"
                          value={currentActivity.imageUrl}
                          onChange={(e) => setCurrentActivity(prev => ({ ...prev, imageUrl: e.target.value }))}
                          className="flex-1 h-12 px-4 bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
                          placeholder="https://images.unsplash.com/..."
                        />
                        <div className="relative overflow-hidden w-12 h-12 bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <UploadCloud className="w-5 h-5 text-gray-500 dark:text-white/50" />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between p-4 bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl">
                      <div>
                        <div className="text-gray-900 dark:text-white font-medium text-[14px]">Publish Activity</div>
                        <div className="text-gray-500 dark:text-white/40 text-[12px]">Make this activity visible on the landing page</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={currentActivity.isPublished}
                          onChange={(e) => setCurrentActivity(prev => ({ ...prev, isPublished: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-white dark:bg-white/10 shadow-sm dark:shadow-none peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl font-semibold text-gray-500 dark:text-white/70 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="activityForm"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl font-bold bg-primary text-[#050e0a] hover:bg-[#a8d3ba] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#050e0a]/30 border-t-[#050e0a] rounded-full animate-spin" />
                  ) : (
                    "Save Activity"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDeleteModal}
              className="absolute inset-0 bg-white dark:bg-[#050e0a]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Activity</h2>
              <p className="text-gray-500 dark:text-white/50 mb-8">
                Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{currentActivity.title}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseDeleteModal}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-500 dark:text-white/70 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteActivity}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-500 text-gray-900 dark:text-white hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-200 dark:border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Delete Activity"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
              notification.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
