"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, X, Search, CheckCircle2, XCircle,
  AlertTriangle, Calendar, ClipboardCheck, Filter, User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { hasAccess } from "@/lib/permissions";

const STATUS_OPTIONS = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];

const STATUS_METADATA = {
  PRESENT: { label: "Hadir", color: "bg-green-500/15 text-green-400 border-green-500/25" },
  ABSENT:  { label: "Alpa", border: "bg-red-500/15 text-red-400 border-red-500/25" },
  LATE:    { label: "Terlambat", color: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
  EXCUSED: { label: "Izin/Sakit", color: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
};

const EMPTY_ATTENDANCE = { memberId: "", date: "", status: "PRESENT", notes: "" };

export default function AttendanceClient({ initialAttendance, members, currentUser }) {
  const { data: session } = useSession();
  const userObj = session?.user ?? currentUser;

  const [records, setRecords] = useState(initialAttendance || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMember, setFilterMember] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modal State
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_ATTENDANCE);
  const [targetRecord, setTargetRecord] = useState(null);
  const [delModal, setDelModal] = useState(false);

  const canCreate = hasAccess(userObj, "attendance", "create");
  const canUpdate = hasAccess(userObj, "attendance", "update");
  const canDelete = hasAccess(userObj, "attendance", "delete");

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenModal = (rec = null) => {
    if (rec) {
      // YYYY-MM-DD format for date input
      const dateStr = new Date(rec.date).toISOString().split("T")[0];
      setForm({
        memberId: rec.memberId?.toString() || "",
        date: dateStr,
        status: rec.status,
        notes: rec.notes || "",
      });
    } else {
      setForm({
        ...EMPTY_ATTENDANCE,
        date: new Date().toISOString().split("T")[0],
      });
    }
    setTargetRecord(rec);
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
    setTimeout(() => { setForm(EMPTY_ATTENDANCE); setTargetRecord(null); }, 300);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const isEditing = Boolean(targetRecord?.id);

    const url = isEditing ? `/api/attendance/${targetRecord.id}` : "/api/attendance";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: parseInt(form.memberId),
          date: form.date,
          status: form.status,
          notes: form.notes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (isEditing) {
          setRecords(records.map(r => r.id === targetRecord.id ? data.attendance : r));
        } else {
          setRecords([data.attendance, ...records]);
        }
        notify("success", isEditing ? "Absensi diperbarui!" : "Absensi baru ditambahkan!");
        handleCloseModal();
      } else {
        notify("error", data.error || "Gagal menyimpan absensi");
      }
    } catch {
      notify("error", "Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!targetRecord?.id) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/attendance/${targetRecord.id}`, { method: "DELETE" });
      if (res.ok) {
        setRecords(records.filter(r => r.id !== targetRecord.id));
        notify("success", "Absensi dihapus!");
        setDelModal(false);
      } else {
        const data = await res.json();
        notify("error", data.error || "Gagal menghapus absensi");
      }
    } catch {
      notify("error", "Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecords = records.filter(r => {
    const name = r.member?.name || "";
    const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.notes || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchMember = filterMember === "all" || r.memberId?.toString() === filterMember;
    return matchSearch && matchStatus && matchMember;
  });

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <ClipboardCheck className="w-8 h-8 text-primary" />
            Absensi Pengurus & Anggota
          </h1>
          <p className="text-gray-500 dark:text-white/50 max-w-xl">
            Catat dan tinjau kehadiran anggota di setiap kegiatan rutin SRE UPNVJT.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
            <input
              type="text"
              placeholder="Cari pengurus / catatan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none"
            />
          </div>
          {canCreate && (
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Absensi</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-3 mb-6 bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 rounded-2xl p-4 backdrop-blur-md items-center">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mr-2">
          <Filter className="w-4 h-4 text-primary" />
          <span>Filter Kehadiran:</span>
        </div>
        <select
          value={filterMember}
          onChange={e => setFilterMember(e.target.value)}
          className="h-10 px-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none"
        >
          <option value="all">Semua Anggota</option>
          {members.map(m => (
            <option key={m.id} value={m.id.toString()}>{m.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="h-10 px-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none"
        >
          <option value="all">Semua Status</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{STATUS_METADATA[opt]?.label || opt}</option>
          ))}
        </select>
        <span className="text-xs text-gray-500 dark:text-white/40 ml-auto font-medium">
          {filteredRecords.length} Catatan Absensi
        </span>
      </div>

      {/* Table grid */}
      <div className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-lg">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b border-gray-200/50 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
              <tr>
                {["Nama Anggota", "NPM", "Tanggal", "Status", "Catatan/Notes", "Aksi"].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              <AnimatePresence>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-white/30">
                        <ClipboardCheck className="w-10 h-10" />
                        <p className="font-medium">Belum ada catatan absensi ditemukan</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-white/60 dark:hover:bg-white/[0.03] transition-all">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                      {rec.member?.name || `ID User: ${rec.memberId}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-white/60">
                      {rec.member?.npm || <span className="opacity-30">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-white/60">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>
                          {new Date(rec.date).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${
                        STATUS_METADATA[rec.status]?.color || "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {STATUS_METADATA[rec.status]?.label || rec.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-white/50 max-w-[240px] truncate">
                      {rec.notes || <span className="opacity-30">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {canUpdate && (
                          <button
                            onClick={() => handleOpenModal(rec)}
                            className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-transparent hover:border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/70 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => { setTargetRecord(rec); setDelModal(true); }}
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

      {/* Attendance Add/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseModal} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-primary" />
                  {targetRecord ? "Edit Catatan Absensi" : "Catat Kehadiran Baru"}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <form id="attendanceForm" onSubmit={handleSave} className="space-y-5">
                  <InputField label="Pilih Anggota *">
                    <select
                      required
                      value={form.memberId}
                      onChange={e => setForm(p => ({ ...p, memberId: e.target.value }))}
                      className={inputCls}
                    >
                      <option value="">— Pilih Anggota —</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id.toString()}>{m.name} ({m.npm || "NPM Kosong"})</option>
                      ))}
                    </select>
                  </InputField>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Tanggal Kegiatan *">
                      <input
                        type="date"
                        required
                        value={form.date}
                        onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                        className={inputCls}
                      />
                    </InputField>

                    <InputField label="Status Kehadiran *">
                      <select
                        required
                        value={form.status}
                        onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                        className={inputCls}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{STATUS_METADATA[opt]?.label || opt}</option>
                        ))}
                      </select>
                    </InputField>
                  </div>

                  <InputField label="Catatan / Notes">
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                      className={`${textareaCls} h-24`}
                      placeholder="e.g. Terlambat 10 menit karena macet..."
                    />
                  </InputField>
                </form>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50/50 dark:bg-white/[0.02]">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10">Batal</button>
                <button type="submit" form="attendanceForm" disabled={isLoading}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-[#050e0a] hover:bg-primary-focus flex items-center gap-2">
                  {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "Simpan"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {delModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDelModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/25">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Catatan Absensi?</h3>
              <p className="text-xs text-gray-500 dark:text-white/40 mb-6">Data kehadiran terpilih akan dihapus secara permanen.</p>
              <div className="flex gap-3">
                <button onClick={() => setDelModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5">Batal</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600">Hapus</button>
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
