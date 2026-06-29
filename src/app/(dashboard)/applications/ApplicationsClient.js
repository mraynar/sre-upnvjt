"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Search, X, CheckCircle2, XCircle, AlertTriangle,
  User, Mail, BookOpen, Clock, Check,
} from "lucide-react";

export default function ApplicationsClient({ initialApplications, currentUser }) {
  const [applications, setApplications] = useState(initialApplications || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Review Modal state
  const [modal, setModal] = useState(false);
  const [targetApp, setTargetApp] = useState(null);

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReview = async (appId, status) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (res.ok) {
        setApplications(applications.map(a => a.id === appId ? data.application : a));
        notify("success", `Pendaftaran berhasil di-${status.toLowerCase()}!`);
        setModal(false);
      } else {
        notify("error", data.error || "Gagal memperbarui status");
      }
    } catch {
      notify("error", "Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = applications.filter(a =>
    (a.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.npm || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.faculty || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Member Applications
          </h1>
          <p className="text-gray-500 dark:text-white/50 max-w-xl">
            Tinjau pendaftaran calon pengurus baru, baca lembar motivasi mereka, dan tentukan hasil seleksi.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
          <input
            type="text"
            placeholder="Cari pendaftar..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-lg">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-gray-200/50 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
              <tr>
                {["Nama Lengkap", "Email", "NPM", "Fakultas / Prodi", "Tanggal", "Status", "Aksi"].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-white/30">
                        <ShieldCheck className="w-10 h-10" />
                        <p className="font-medium">Belum ada data pendaftar</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map(app => (
                  <tr key={app.id} className="hover:bg-white/60 dark:hover:bg-white/[0.03] transition-all">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                      {app.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-white/70">
                      {app.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-white/70">
                      {app.npm}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-white/50">
                      {app.faculty}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-white/50">
                      {new Date(app.appliedAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${
                        app.status === "APPROVED"
                          ? "bg-green-500/10 text-green-400 border-green-500/25"
                          : app.status === "REJECTED"
                          ? "bg-red-500/10 text-red-400 border-red-500/25"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/25"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => { setTargetApp(app); setModal(true); }}
                        className="h-8 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all"
                      >
                        Tinjau Motivasi
                      </button>
                    </td>
                  </tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Motivation Modal */}
      <AnimatePresence>
        {modal && targetApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Review Motivasi Calon Pengurus
                </h2>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-gray-400 font-bold mb-0.5">Nama Pendaftar:</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{targetApp.fullName}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 font-bold mb-0.5">Fakultas / Prodi:</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{targetApp.faculty}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Esai Motivasi</h4>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-sm text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap italic">
                    "{targetApp.motivation}"
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-between bg-gray-50/50 dark:bg-white/[0.02] shrink-0">
                <button onClick={() => setModal(false)} className="px-5 py-2.5 rounded-xl font-semibold text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-xs">
                  Tutup
                </button>
                {targetApp.status === "PENDING" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(targetApp.id, "REJECTED")}
                      disabled={isLoading}
                      className="px-5 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all text-xs flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Tolak
                    </button>
                    <button
                      onClick={() => handleReview(targetApp.id, "APPROVED")}
                      disabled={isLoading}
                      className="px-5 py-2.5 rounded-xl font-bold bg-primary text-[#050e0a] hover:bg-primary-focus transition-all text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Terima
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 font-semibold self-center">Hasil Keputusan: {targetApp.status}</span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Toast */}
      <Toast notification={notification} onClose={() => setNotification(null)} />
    </div>
  );
}

// Extracted toast component
function Toast({ notification, onClose }) {
  return (
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
          {notification.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-medium text-xs">{notification.message}</span>
          <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
