"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardCheck, Plus, Trash2, X, Search, Calendar, FolderKanban, ChevronDown, Clock, CheckCircle2, FileWarning, ExternalLink, Users, Lock, Unlock
} from "lucide-react";
import { createAttendanceSession, closeAttendanceSession, deleteAttendanceSession, submitAttendance } from "@/app/actions/attendanceActions";

const CustomSelect = ({ name, options, value, onChange, placeholder, disabled, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value?.toString() === value?.toString());

  return (
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={dropdownRef}>
      <input type="hidden" name={name} value={value || ""} required={required} />
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border ${isOpen ? 'border-primary/50 bg-white dark:bg-white/10 shadow-sm dark:shadow-none shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer transition-all duration-300`}
      >
        <span className={selectedOption ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-white/40'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0a1f18] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden z-[60] shadow-2xl backdrop-blur-2xl ring-1 ring-black/5"
          >
            <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 dark:text-white/40 text-sm text-center">No options available</div>
              ) : (
                options.map(option => (
                  <div 
                    key={option.value}
                    onClick={() => { onChange(option.value?.toString()); setIsOpen(false); }}
                    className={`px-4 py-3 rounded-lg text-sm cursor-pointer transition-all flex items-center justify-between ${value?.toString() === option.value?.toString() ? 'bg-primary/20 text-primary font-bold' : 'text-gray-500 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:text-white'}`}
                  >
                    {option.label}
                    {value?.toString() === option.value?.toString() && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getStatusBadge = (status) => {
  switch(status) {
    case 'HADIR': return <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit"><CheckCircle2 className="w-3.5 h-3.5" /> Hadir</span>;
    case 'IZIN': return <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit"><Clock className="w-3.5 h-3.5" /> Izin</span>;
    case 'SAKIT': return <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit"><FileWarning className="w-3.5 h-3.5" /> Sakit</span>;
    case 'ALFA': return <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit"><X className="w-3.5 h-3.5" /> Alfa</span>;
    default: return <span className="px-2.5 py-1 rounded-md bg-white dark:bg-white/10 shadow-sm dark:shadow-none text-gray-500 dark:text-white/70 border border-gray-200 dark:border-white/20 text-xs font-bold uppercase tracking-widest w-fit">{status || 'Belum Absen'}</span>;
  }
};

export default function AttendanceClient({ attendanceSessions, users, projects, currentUser, canManage }) {
  const [sessions, setSessions] = useState(attendanceSessions);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitModal, setSubmitModal] = useState({ isOpen: false, session: null });
  const [recapModal, setRecapModal] = useState({ isOpen: false, session: null });
  
  const [selectedStatus, setSelectedStatus] = useState("HADIR");
  const [selectedProjectId, setSelectedProjectId] = useState("");


  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refreshData = () => window.location.reload();

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    
    const data = {
      title: formData.get("title"),
      date: formData.get("date"),
      createdById: currentUser?.id,
      projectId: formData.get("projectId"),
    };

    const res = await createAttendanceSession(data);
    setLoading(false);
    if (res.success) {
      setCreateModalOpen(false);
      refreshData();
    } else {
      setError(res.error);
    }
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    
    let finalProofUrl = null;

    try {
      const proofFile = formData.get("proofFile");
      if (proofFile && proofFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", proofFile);
        uploadFormData.append("folder", "attendance_proofs");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          throw new Error("Gagal mengunggah file bukti.");
        }

        const uploadData = await uploadRes.json();
        finalProofUrl = uploadData.url;
      }

      const data = {
        sessionId: submitModal.session?.id,
        userId: currentUser?.id,
        status: formData.get("status"),
        proofUrl: finalProofUrl,
      };

      const res = await submitAttendance(data);
      if (res.success) {
        setSubmitModal({ isOpen: false, session: null });
        refreshData();
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat memproses data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSession = async (id) => {
    if (!confirm("Are you sure you want to close this session? No more attendances can be submitted.")) return;
    const res = await closeAttendanceSession(id);
    if (res.success) refreshData();
    else alert("Gagal menutup sesi: " + res.error);
  };

  const handleDeleteSession = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this session and all its records?")) return;
    const res = await deleteAttendanceSession(id);
    if (res.success) refreshData();
    else alert("Gagal menghapus: " + res.error);
  };

  const statusOptions = [
    { value: "HADIR", label: "Hadir (Present)" },
    { value: "IZIN", label: "Izin (Permitted)" },
    { value: "SAKIT", label: "Sakit (Sick)" },
  ];
  
  const projectOptions = projects.map(p => ({ value: p.id, label: p.title }));

  const getRecapData = (session) => {
    if (!session) return [];
    
    const attendanceMap = {};
    session.attendances.forEach(a => {
      attendanceMap[a.userId] = a;
    });

    return users.map(u => ({
      ...u,
      attendance: attendanceMap[u.id] || null
    }));
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <ClipboardCheck className="w-8 h-8 text-primary" />
            Sistem Presensi
          </h1>
          <p className="text-gray-500 dark:text-white/50 max-w-xl">
            {canManage 
              ? "Manajemen sesi kehadiran, buat sesi absensi, dan lihat rekapitulasi anggota."
              : "Daftar sesi kehadiran aktif. Silakan isi presensi Anda pada sesi yang tersedia."}
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/30" />
            <input 
              type="text"
              placeholder="Cari sesi rapat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          {canManage && (
            <button 
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Buat Sesi Absen</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.length === 0 ? (
          <div className="col-span-full bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-sm rounded-3xl p-12 text-center flex flex-col items-center justify-center backdrop-blur-md">
            <ClipboardCheck className="w-16 h-16 text-gray-500 dark:text-white/10 mb-4" />
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">Belum Ada Sesi Presensi</h3>
            <p className="text-gray-500 dark:text-white/40">Belum ada rapat atau sesi presensi yang dibuat.</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const hasAttended = currentUser ? session.attendances.find(a => a.userId === currentUser.id) : null;
            const totalAttendees = session.attendances.filter(a => a.status === 'HADIR').length;

            return (
              <motion.div 
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/40 dark:bg-white/[0.02] border ${session.isActive ? 'border-primary/50 shadow-[0_8px_30px_rgba(16,185,129,0.15)] dark:shadow-[0_8px_30px_rgba(16,185,129,0.1)]' : 'border-gray-200/50 dark:border-white/10 shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]'} rounded-3xl p-6 backdrop-blur-xl relative group hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col h-full overflow-hidden`}
              >
                {/* Status Indicator */}
                {session.isActive && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-primary"></div>
                )}

                <div className="flex justify-between items-start mb-4">
                  {session.isActive ? (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold tracking-wide flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ACTIVE SESSION
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-white dark:bg-white/5 shadow-sm dark:shadow-none text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/10 text-xs font-bold tracking-wide flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> CLOSED
                    </span>
                  )}

                  {canManage && (
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {session.isActive && (
                        <button onClick={() => handleCloseSession(session.id)} className="p-2 text-gray-500 dark:text-white/50 hover:text-amber-400" title="Tutup Sesi"><Lock className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => handleDeleteSession(session.id)} className="p-2 text-gray-500 dark:text-white/50 hover:text-red-400" title="Hapus Sesi"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{session.title}</h3>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-white/40 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(session.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="space-y-3 mt-auto pt-4 border-t border-gray-200 dark:border-white/5">
                  {session.project && (
                    <div className="flex items-center gap-3 text-xs text-primary font-medium">
                      <FolderKanban className="w-4 h-4" />
                      <span>{session.project.title}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/50">
                    <Users className="w-4 h-4" />
                    <span>{session.attendances.length} Responds ({totalAttendees} Hadir)</span>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    {/* User Action Button */}
                    <button 
                      onClick={() => setSubmitModal({ isOpen: true, session })}
                      disabled={!session.isActive && !hasAttended}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
                        hasAttended 
                          ? 'bg-white dark:bg-white/5 shadow-sm border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/10' 
                          : session.isActive 
                            ? 'bg-primary text-[#050e0a] hover:bg-primary-focus hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                            : 'bg-gray-100 dark:bg-white/5 shadow-inner text-gray-400 dark:text-white/20 cursor-not-allowed'
                      }`}
                    >
                      {hasAttended ? 'Ubah Presensi' : session.isActive ? 'Isi Presensi' : 'Sesi Ditutup'}
                    </button>

                    {/* Admin Recap Button */}
                    {canManage && (
                      <button 
                        onClick={() => setRecapModal({ isOpen: true, session })}
                        className="p-2.5 rounded-xl bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:text-white transition-all"
                        title="Lihat Rekapitulasi"
                      >
                        <ClipboardCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {hasAttended && (
                    <div className="mt-3 flex items-center justify-between bg-white dark:bg-white/5 shadow-sm dark:shadow-none p-3 rounded-xl border border-gray-200 dark:border-white/5">
                      <span className="text-xs text-gray-500 dark:text-white/40">Status Anda:</span>
                      {getStatusBadge(hasAttended.status)}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* CREATE SESSION MODAL (Admin) */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setCreateModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0a1f18] border border-gray-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-xl relative z-10 shadow-2xl"
            >
              <button onClick={() => setCreateModalOpen(false)} className="absolute top-6 right-6 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:text-white z-50">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                Buat Sesi Presensi Baru
              </h2>
              
              {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
              
              <form onSubmit={handleCreateSession} className="grid grid-cols-1 gap-5 relative">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Nama Sesi / Agenda Rapat</label>
                  <input name="title" type="text" required placeholder="Misal: Rapat Pleno 1" className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 focus:bg-white dark:bg-white/10 shadow-sm dark:shadow-none transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Tanggal Sesi</label>
                  <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 focus:bg-white dark:bg-white/10 shadow-sm dark:shadow-none transition-colors [color-scheme:dark]" />
                </div>

                <div className="relative z-[50]">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Terkait Proker (Opsional)</label>
                  <CustomSelect 
                    name="projectId" 
                    options={[{ value: "", label: "Tidak Terkait Proker" }, ...projectOptions]} 
                    value={selectedProjectId} 
                    onChange={setSelectedProjectId} 
                    placeholder="Pilih Proker..." 
                  />
                </div>

                <div className="pt-4 mt-2 border-t border-gray-200 dark:border-white/10">
                  <button type="submit" disabled={loading} className="w-full bg-primary text-[#050e0a] font-bold py-3.5 rounded-xl hover:bg-primary-focus hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                    {loading ? "Menyimpan..." : "Buat Sesi Aktif"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUBMIT ATTENDANCE MODAL (User) */}
      <AnimatePresence>
        {submitModal.isOpen && submitModal.session && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSubmitModal({ isOpen: false, session: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0a1f18] border border-gray-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-xl relative z-10 shadow-2xl"
            >
              <button onClick={() => setSubmitModal({ isOpen: false, session: null })} className="absolute top-6 right-6 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:text-white z-50">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                Isi Presensi
              </h2>
              <p className="text-gray-500 dark:text-white/50 text-sm mb-6 pb-6 border-b border-gray-200 dark:border-white/10">{submitModal.session.title}</p>
              
              {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
              
              {!submitModal.session.isActive && !submitModal.session.attendances.find(a => a.userId === currentUser?.id) ? (
                <div className="text-center py-8">
                  <Lock className="w-12 h-12 text-gray-500 dark:text-white/10 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sesi Telah Ditutup</h3>
                  <p className="text-gray-500 dark:text-white/40">Anda tidak dapat mengisi presensi karena sesi ini sudah ditutup oleh Admin.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitAttendance} className="grid grid-cols-1 gap-5 relative">
                  <div className="relative z-[49]">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Status Kehadiran</label>
                    <CustomSelect 
                      name="status" 
                      options={statusOptions} 
                      value={selectedStatus} 
                      onChange={setSelectedStatus} 
                      placeholder="Pilih Status..." 
                      required 
                    />
                  </div>

                  <AnimatePresence>
                    {(selectedStatus === 'IZIN' || selectedStatus === 'SAKIT') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-1">
                          <label className="block text-xs font-bold uppercase tracking-widest text-amber-400/80 mb-2">Unggah Surat Izin/Sakit (File)</label>
                          <input name="proofFile" type="file" required={selectedStatus === 'IZIN' || selectedStatus === 'SAKIT'} className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500/50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-500 hover:file:bg-amber-500/30" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-4 mt-2 border-t border-gray-200 dark:border-white/10">
                    <button type="submit" disabled={loading} className="w-full bg-primary text-[#050e0a] font-bold py-3.5 rounded-xl hover:bg-primary-focus hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                      {loading ? "Menyimpan..." : "Simpan Kehadiran"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RECAP MODAL (Admin) */}
      <AnimatePresence>
        {recapModal.isOpen && recapModal.session && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setRecapModal({ isOpen: false, session: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0a1f18] border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-4xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 md:p-8 border-b border-gray-200 dark:border-white/10 flex items-start justify-between bg-gray-50 dark:bg-white/[0.02]">
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Rekapitulasi Kehadiran</h2>
                  <p className="text-gray-500 dark:text-white/50 text-sm">{recapModal.session.title} - {new Date(recapModal.session.date).toLocaleDateString('id-ID')}</p>
                </div>
                <button onClick={() => setRecapModal({ isOpen: false, session: null })} className="p-2 bg-white dark:bg-white/5 shadow-sm dark:shadow-none rounded-xl text-gray-500 dark:text-white/50 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="overflow-x-auto w-full">
                  <table className="w-full min-w-[600px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-white/10">
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">Anggota</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">Status</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">Bukti Izin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {getRecapData(recapModal.session).map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{u.name}</p>
                          {u.npm && <p className="text-[10px] text-gray-500 dark:text-white/30">{u.npm}</p>}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(u.attendance?.status)}
                        </td>
                        <td className="py-3 px-4">
                          {u.attendance?.proofUrl ? (
                            <a href={u.attendance.proofUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1.5">
                              <ExternalLink className="w-3.5 h-3.5" /> Buka Tautan
                            </a>
                          ) : (
                            <span className="text-gray-500 dark:text-white/20 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
