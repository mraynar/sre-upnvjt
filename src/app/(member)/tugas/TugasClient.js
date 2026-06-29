"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban, Calendar, Award, CheckCircle2, XCircle, Clock,
  ExternalLink, Send, ArrowRight, X, AlertTriangle, Info,
} from "lucide-react";

export default function TugasClient({ initialTasks, initialSubmissions }) {
  const [tasks] = useState(initialTasks || []);
  const [submissions, setSubmissions] = useState(initialSubmissions || []);
  const [activeTask, setActiveTask] = useState(null); // task for details view
  const [fileUrl, setFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getTaskStatus = (taskId) => {
    const sub = submissions.find(s => s.taskId === taskId);
    if (!sub) return { key: "NOT_STARTED", label: "Belum Dikerjakan", color: "bg-white/5 text-gray-400 border-white/10" };
    if (sub.status === "APPROVED") return { key: "APPROVED", label: "Disetujui", color: "bg-green-500/15 text-green-400 border-green-500/25" };
    if (sub.status === "REJECTED") return { key: "REJECTED", label: "Perlu Perbaikan", color: "bg-red-500/15 text-red-400 border-red-500/25" };
    return { key: "PENDING", label: "Menunggu Review", color: "bg-amber-500/15 text-amber-400 border-amber-500/25" };
  };

  const handleOpenDetail = (tk) => {
    const sub = submissions.find(s => s.taskId === tk.id);
    setActiveTask(tk);
    setFileUrl(sub?.fileUrl || "");
    setError("");
    setSuccess("");
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!activeTask) return;
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/tasks/${activeTask.id}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmissions(prev => {
          const filtered = prev.filter(s => s.taskId !== activeTask.id);
          return [...filtered, data.submission];
        });
        setSuccess("Jawaban tugas berhasil dikirim!");
        // Refresh details
        setTimeout(() => setActiveTask(null), 1500);
      } else {
        setError(data.error || "Gagal mengirim jawaban");
      }
    } catch {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-white">
          <FolderKanban className="w-8 h-8 text-primary" />
          Daftar Tugas & Penugasan
        </h1>
        <p className="text-gray-400 max-w-xl font-light">
          Pantau penugasan divisi dan kumpulkan laporan hasil pengerjaan tepat waktu untuk mengumpulkan XP.
        </p>
      </div>

      {/* Task Cards Grid */}
      {tasks.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
          <FolderKanban className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Tidak ada tugas saat ini</h3>
          <p className="text-gray-500 text-sm">Kerja bagus! Semua tugas operasional Anda telah diselesaikan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tasks.map(tk => {
            const status = getTaskStatus(tk.id);
            return (
              <div
                key={tk.id}
                onClick={() => handleOpenDetail(tk)}
                className="bg-white/5 border border-white/5 rounded-3xl p-5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-lg"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
                      <Award className="w-3.5 h-3.5" /> +{tk.rewardXp} XP
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm line-clamp-1 mb-2 group-hover:text-primary transition-all">
                    {tk.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-6">
                    {tk.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 mt-auto">
                  <div className="flex items-center gap-1 text-gray-500 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{new Date(tk.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                  </div>
                  <span className="text-primary font-bold flex items-center gap-1 group-hover:underline">
                    Detail <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Detail Modal */}
      <AnimatePresence>
        {activeTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveTask(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a1612] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-primary" />
                  Detail Tugas
                </h2>
                <button onClick={() => setActiveTask(null)} className="text-gray-400 hover:text-white p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{activeTask.title}</h3>
                  <div className="flex gap-4 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Award className="w-3.5 h-3.5" /> {activeTask.rewardXp} XP Reward
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      Deadline: {new Date(activeTask.deadline).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {activeTask.description}
                  </div>
                </div>

                {/* Submisi status & Form */}
                <div className="border-t border-white/5 pt-6">
                  {(() => {
                    const status = getTaskStatus(activeTask.id);
                    const sub = submissions.find(s => s.taskId === activeTask.id);

                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase">Status Pengumpulan</span>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${status.color}`}>
                            {status.label}
                          </span>
                        </div>

                        {/* Admin Feedback */}
                        {sub?.feedback && (
                          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex gap-2">
                            <Info className="w-4 h-4 shrink-0" />
                            <div>
                              <div className="font-bold mb-1">Catatan Peninjau:</div>
                              <p>"{sub.feedback}"</p>
                            </div>
                          </div>
                        )}

                        {/* Submission URL Link for viewing */}
                        {sub && (
                          <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                            <span className="text-gray-400 font-medium">File yang dikirim:</span>
                            <a
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary font-bold hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Lihat File Submisi
                            </a>
                          </div>
                        )}

                        {/* Submission input form */}
                        {(status.key === "NOT_STARTED" || status.key === "REJECTED") && (
                          <form onSubmit={handleSubmitTask} className="space-y-4">
                            <div>
                              <label className="block text-[10px] font-black tracking-wider text-gray-500 uppercase mb-2">Link File Pengumpulan (Google Drive / GitHub / URL) *</label>
                              <input
                                type="url"
                                required
                                value={fileUrl}
                                onChange={e => setFileUrl(e.target.value)}
                                className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all"
                                placeholder="https://..."
                              />
                            </div>

                            {error && <div className="text-xs font-semibold text-red-400 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> {error}</div>}
                            {success && <div className="text-xs font-semibold text-green-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {success}</div>}

                            <button
                              type="submit"
                              disabled={isLoading}
                              className="w-full py-3.5 bg-primary text-[#050e0a] hover:bg-primary-focus transition-all rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                              {isLoading ? (
                                <div className="w-5 h-5 border-2 border-[#050e0a]/30 border-t-[#050e0a] rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  <span>Kumpulkan Tugas</span>
                                </>
                              )}
                            </button>
                          </form>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
