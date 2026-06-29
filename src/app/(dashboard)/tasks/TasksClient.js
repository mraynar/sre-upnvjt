"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, X, Search, CheckCircle2, XCircle,
  AlertTriangle, FolderKanban, FileText, Calendar, Award,
  Clock, Check, Eye, ExternalLink, ShieldCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { hasAccess } from "@/lib/permissions";

const EMPTY_TASK = { title: "", description: "", rewardXp: "30", deadline: "" };

export default function TasksClient({ initialTasks, initialSubmissions, currentUser }) {
  const { data: session } = useSession();
  const user = session?.user ?? currentUser;

  const [activeTab, setActiveTab] = useState("tasks"); // "tasks" | "submissions"
  const [tasks, setTasks] = useState(initialTasks || []);
  const [submissions, setSubmissions] = useState(initialSubmissions || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Task Modal state
  const [taskModal, setTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState(EMPTY_TASK);
  const [targetTask, setTargetTask] = useState(null);
  const [taskDelModal, setTaskDelModal] = useState(false);

  // Review Modal state
  const [reviewModal, setReviewModal] = useState(false);
  const [targetSubmission, setTargetSubmission] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("APPROVED"); // APPROVED | REJECTED
  const [reviewFeedback, setReviewFeedback] = useState("");

  const canCreate = hasAccess(user, "tasks", "create");
  const canUpdate = hasAccess(user, "tasks", "update");
  const canDelete = hasAccess(user, "tasks", "delete");

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenTaskModal = (tk = null) => {
    if (tk) {
      // format deadline date to YYYY-MM-DDThh:mm for datetime-local input
      const date = new Date(tk.deadline);
      const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
      
      setTaskForm({
        title: tk.title,
        description: tk.description,
        rewardXp: tk.rewardXp?.toString() || "30",
        deadline: localISOTime,
      });
    } else {
      setTaskForm({ ...EMPTY_TASK });
    }
    setTargetTask(tk);
    setTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setTaskModal(false);
    setTimeout(() => { setTaskForm(EMPTY_TASK); setTargetTask(null); }, 300);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const isEditing = Boolean(targetTask?.id);

    const url = isEditing ? `/api/tasks/${targetTask.id}` : "/api/tasks";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskForm.title,
          description: taskForm.description,
          rewardXp: parseInt(taskForm.rewardXp),
          deadline: taskForm.deadline,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (isEditing) {
          setTasks(tasks.map(t => t.id === targetTask.id ? { ...data.task, submissionCount: t.submissionCount } : t));
        } else {
          setTasks([data.task, ...tasks]);
        }
        notify("success", isEditing ? "Tugas diperbarui!" : "Tugas baru dibuat!");
        handleCloseTaskModal();
      } else {
        notify("error", data.error || "Gagal menyimpan tugas");
      }
    } catch {
      notify("error", "Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!targetTask?.id) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/tasks/${targetTask.id}`, { method: "DELETE" });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== targetTask.id));
        setSubmissions(submissions.filter(s => s.taskId !== targetTask.id));
        notify("success", "Tugas berhasil dihapus!");
        setTaskDelModal(false);
      } else {
        const data = await res.json();
        notify("error", data.error || "Gagal menghapus tugas");
      }
    } catch {
      notify("error", "Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenReviewModal = (sub) => {
    setTargetSubmission(sub);
    setReviewStatus(sub.status === "PENDING" ? "APPROVED" : sub.status);
    setReviewFeedback(sub.feedback || "");
    setReviewModal(true);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!targetSubmission) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/tasks/${targetSubmission.taskId}/submissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: targetSubmission.id,
          status: reviewStatus,
          feedback: reviewFeedback,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmissions(submissions.map(s => s.id === targetSubmission.id ? { ...s, ...data.submission } : s));
        notify("success", "Submisi berhasil ditinjau!");
        setReviewModal(false);
      } else {
        notify("error", data.error || "Gagal menyimpan review");
      }
    } catch {
      notify("error", "Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter(t =>
    (t.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubmissions = submissions.filter(s =>
    (s.member?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.task?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <FolderKanban className="w-8 h-8 text-primary" />
            Tugas & Penugasan
          </h1>
          <p className="text-gray-500 dark:text-white/50 max-w-xl">
            Kelola penugasan operasional untuk anggota SRE UPNVJT dan tinjau submisi mereka.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
            <input
              type="text"
              placeholder={activeTab === "tasks" ? "Cari tugas..." : "Cari anggota / tugas..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none"
            />
          </div>
          {activeTab === "tasks" && canCreate && (
            <button
              onClick={() => handleOpenTaskModal()}
              className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Plus className="w-5 h-5" />
              <span>Buat Tugas</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 dark:bg-white/[0.03] p-1 rounded-2xl w-fit border border-gray-200 dark:border-white/10">
        {[
          { key: "tasks", label: "Daftar Tugas", icon: FolderKanban },
          { key: "submissions", label: "Submisi Anggota", icon: ShieldCheck },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearchQuery(""); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────
          TAB: TASKS LIST
         ─────────────────────────────────── */}
      {activeTab === "tasks" && (
        <div className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-lg">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-gray-200/50 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                <tr>
                  {["Nama Tugas", "Tenggat Waktu", "XP Reward", "Submisi", "Aksi"].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                <AnimatePresence>
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-white/30">
                          <FolderKanban className="w-10 h-10" />
                          <p className="font-medium">Belum ada tugas dibuat</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredTasks.map(tk => (
                    <tr key={tk.id} className="hover:bg-white/60 dark:hover:bg-white/[0.03] transition-all">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white text-sm">{tk.title}</div>
                        <span className="text-xs text-gray-400 dark:text-white/30 line-clamp-1 mt-0.5 max-w-[320px]">
                          {tk.description}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-white/60">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>
                            {new Date(tk.deadline).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold">
                          <Award className="w-3.5 h-3.5" /> +{tk.rewardXp} XP
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-white/70">
                        {tk.submissionCount || 0} Submisi
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {canUpdate && (
                            <button
                              onClick={() => handleOpenTaskModal(tk)}
                              className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-transparent hover:border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/70 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => { setTargetTask(tk); setTaskDelModal(true); }}
                              className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-transparent hover:border-red-500/20 text-red-400 flex items-center justify-center transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────
          TAB: SUBMISSIONS LIST
         ─────────────────────────────────── */}
      {activeTab === "submissions" && (
        <div className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-lg">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-gray-200/50 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                <tr>
                  {["Nama Anggota", "Tugas", "File Submisi", "Status", "Feedback", "Aksi"].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                <AnimatePresence>
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-white/30">
                          <ShieldCheck className="w-10 h-10" />
                          <p className="font-medium">Belum ada submisi dikirim</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredSubmissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-white/60 dark:hover:bg-white/[0.03] transition-all">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                        {sub.member?.name || `ID User: ${sub.memberId}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-white/70">
                        {sub.task?.title || `ID Tugas: ${sub.taskId}`}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {sub.fileUrl ? (
                          <a
                            href={sub.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary font-bold hover:underline flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-4 h-4" /> Buka Link File
                          </a>
                        ) : (
                          <span className="text-gray-400">Tidak ada file</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                          sub.status === "APPROVED"
                            ? "bg-green-500/10 text-green-400 border-green-500/25"
                            : sub.status === "REJECTED"
                            ? "bg-red-500/10 text-red-400 border-red-500/25"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/25"
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 dark:text-white/50 max-w-[200px] truncate">
                        {sub.feedback || <span className="opacity-30">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        {canUpdate && (
                          <button
                            onClick={() => handleOpenReviewModal(sub)}
                            className="h-8 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all"
                          >
                            Tinjau / Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Add/Edit Modal */}
      <AnimatePresence>
        {taskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseTaskModal} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-primary" />
                  {targetTask ? "Edit Tugas" : "Tugas Baru"}
                </h2>
                <button onClick={handleCloseTaskModal} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <form id="taskForm" onSubmit={handleSaveTask} className="space-y-5">
                  <InputField label="Judul Tugas *">
                    <input type="text" required value={taskForm.title}
                      onChange={e => setTaskForm(p => ({ ...p, title: e.target.value }))}
                      className={inputCls} placeholder="e.g. Laporan Kegiatan Divisi ACE" />
                  </InputField>

                  <InputField label="Deskripsi Tugas *">
                    <textarea required rows={4} value={taskForm.description}
                      onChange={e => setTaskForm(p => ({ ...p, description: e.target.value }))}
                      className={`${textareaCls} h-28`} placeholder="Instruksi dan rincian pengerjaan tugas..." />
                  </InputField>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Tenggat Waktu *">
                      <input type="datetime-local" required value={taskForm.deadline}
                        onChange={e => setTaskForm(p => ({ ...p, deadline: e.target.value }))}
                        className={inputCls} />
                    </InputField>
                    <InputField label="XP Reward">
                      <input type="number" required min="0" value={taskForm.rewardXp}
                        onChange={e => setTaskForm(p => ({ ...p, rewardXp: e.target.value }))}
                        className={inputCls} />
                    </InputField>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50/50 dark:bg-white/[0.02]">
                <button type="button" onClick={handleCloseTaskModal} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10">Batal</button>
                <button type="submit" form="taskForm" disabled={isLoading}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-[#050e0a] hover:bg-primary-focus flex items-center gap-2">
                  {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "Simpan"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Delete Modal */}
      <AnimatePresence>
        {taskDelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setTaskDelModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/25">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Tugas?</h3>
              <p className="text-xs text-gray-500 dark:text-white/40 mb-6">Seluruh data submisi anggota untuk tugas ini juga akan terhapus secara permanen.</p>
              <div className="flex gap-3">
                <button onClick={() => setTaskDelModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5">Batal</button>
                <button onClick={handleDeleteTask} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600">Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Submisi Modal */}
      <AnimatePresence>
        {reviewModal && targetSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setReviewModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Review Submisi Tugas
                </h2>
                <button onClick={() => setReviewModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl">
                  <div className="text-xs font-bold text-gray-400 mb-1">Anggota:</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{targetSubmission.member?.name}</div>
                  <div className="text-xs font-bold text-gray-400 mb-1">Link File Submisi:</div>
                  <a
                    href={targetSubmission.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Buka Submisi
                  </a>
                </div>

                <form id="reviewForm" onSubmit={handleSaveReview} className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">Pilih Status Peninjauan</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: "APPROVED", label: "Setujui (Approve)", color: "border-green-500/20 text-green-400 bg-green-500/5", activeColor: "border-green-500 bg-green-500/20 text-green-300" },
                        { key: "REJECTED", label: "Tolak (Reject)", color: "border-red-500/20 text-red-400 bg-red-500/5", activeColor: "border-red-500 bg-red-500/20 text-red-300" },
                      ].map(st => (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => setReviewStatus(st.key)}
                          className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                            reviewStatus === st.key ? st.activeColor : st.color
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <InputField label="Feedback / Catatan Peninjauan">
                    <textarea rows={3} value={reviewFeedback}
                      onChange={e => setReviewFeedback(e.target.value)}
                      className={`${textareaCls} h-24`} placeholder="Tuliskan catatan perbaikan atau apresiasi..." />
                  </InputField>
                </form>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50/50 dark:bg-white/[0.02]">
                <button type="button" onClick={() => setReviewModal(false)} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10">Batal</button>
                <button type="submit" form="reviewForm" disabled={isLoading}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-[#050e0a] hover:bg-primary-focus flex items-center gap-2">
                  {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "Simpan Review"}
                </button>
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

const inputCls =
  "w-full h-12 px-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all";

const textareaCls =
  "w-full p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all resize-none";

const InputField = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">
      {label}
    </label>
    {children}
  </div>
);
