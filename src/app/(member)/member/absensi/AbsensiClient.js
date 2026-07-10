"use client";

import React, { useState, useEffect } from "react";
import { ClipboardCheck, Calendar, Info, Clock, AlertTriangle, CheckCircle2, Flame, Award, Trophy, Target, X, Check, FileText, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function AbsensiClient({ initialAttendance, validSessions = [], userRoleName = "Member" }) {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [records, setRecords] = useState(initialAttendance || []);
  const [mounted, setMounted] = useState(false);

  const STATUS_METADATA = {
    PRESENT: { label: t("attendance_member.status_present"), icon: CheckCircle2, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
    ABSENT:  { label: t("attendance_member.status_absent"), icon: AlertTriangle, color: "text-rose-500 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" },
    LATE:    { label: t("attendance_member.status_late"), icon: Clock, color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
    EXCUSED: { label: t("attendance_member.status_excused"), icon: Info, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
  };

  // Modal State
  const [activeSession, setActiveSession] = useState(null);
  const [submitStatus, setSubmitStatus] = useState("PRESENT");
  const [tokenInput, setTokenInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => setMounted(true), []);

  // Calculate effective records (combining real records and auto-alpa for inactive missed sessions)
  const effectiveRecords = [...records];
  const pendingSessions = [];

  for (const session of validSessions) {
    const hasRecord = records.some(r => r.sessionId === session.id);
    if (!hasRecord) {
      if (session.isActive === false) {
        effectiveRecords.push({
          id: `auto-${session.id}`,
          sessionId: session.id,
          session: session,
          status: "ABSENT",
          notes: t("attendance_member.auto_absent_msg"),
          createdAt: session.date
        });
      } else {
        pendingSessions.push(session);
      }
    }
  }

  // Sort effective records by date descending for history table
  effectiveRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getCount = (status) => {
    return effectiveRecords.filter(r => r.status === status).length;
  };

  const totalValid = validSessions.length;
  const presentTotal = getCount("PRESENT") + getCount("LATE");
  const attendanceRate = totalValid === 0 ? 0 : Math.round((presentTotal / totalValid) * 100);

  let currentStreak = 0;
  for (const session of validSessions) {
    const recordForSession = effectiveRecords.find(r => r.sessionId === session.id);
    if (recordForSession && (recordForSession.status === "PRESENT" || recordForSession.status === "LATE")) {
      currentStreak++;
    } else {
      break; 
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeSession) return;
    
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSession.id,
          status: submitStatus,
          notes: notesInput,
          token: (submitStatus === "PRESENT" || submitStatus === "LATE") ? tokenInput : undefined
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim presensi");
      }

      setSuccessMsg(t("attendance_member.modal_success_msg"));
      setRecords(prev => [data.attendance, ...prev]);
      
      setTimeout(() => {
        setActiveSession(null);
        setSuccessMsg("");
        setTokenInput("");
        setNotesInput("");
        router.refresh();
      }, 1500);

    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  if (!mounted) return null;

  return (
    <div className="w-full relative pb-20">
      
      {/* CHECK-IN MODAL */}
      <AnimatePresence>
        {activeSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isLoading && !successMsg && setActiveSession(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between">
                <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white mb-1">{t("attendance_member.modal_title")}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{activeSession.title}</p>
                </div>
                {!isLoading && !successMsg && (
                  <button onClick={() => setActiveSession(null)} className="p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full transition-colors text-slate-600 dark:text-slate-300">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {successMsg ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-10 h-10" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t("attendance_member.modal_success")}</h4>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{successMsg}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Status Selection */}
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        onClick={() => setSubmitStatus("PRESENT")}
                        className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all ${submitStatus === "PRESENT" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : "border-slate-200 dark:border-slate-700 hover:border-emerald-300"}`}
                      >
                        <div className={`p-3 rounded-full ${submitStatus === "PRESENT" ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className={`font-bold text-center text-sm ${submitStatus === "PRESENT" ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500"}`}>{t("attendance_member.status_present")}</span>
                      </div>

                      <div 
                        onClick={() => setSubmitStatus("LATE")}
                        className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all ${submitStatus === "LATE" ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10" : "border-slate-200 dark:border-slate-700 hover:border-amber-300"}`}
                      >
                        <div className={`p-3 rounded-full ${submitStatus === "LATE" ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                          <Clock className="w-6 h-6" />
                        </div>
                        <span className={`font-bold text-center text-sm ${submitStatus === "LATE" ? "text-amber-700 dark:text-amber-400" : "text-slate-500"}`}>{t("attendance_member.status_late")}</span>
                      </div>
                      
                      <div 
                        onClick={() => setSubmitStatus("EXCUSED")}
                        className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all ${submitStatus === "EXCUSED" ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "border-slate-200 dark:border-slate-700 hover:border-blue-300"}`}
                      >
                        <div className={`p-3 rounded-full ${submitStatus === "EXCUSED" ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                          <Info className="w-6 h-6" />
                        </div>
                        <span className={`font-bold text-center text-sm ${submitStatus === "EXCUSED" ? "text-blue-700 dark:text-blue-400" : "text-slate-500"}`}>{t("attendance_member.status_excused")}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {(submitStatus === "PRESENT" || submitStatus === "LATE") ? (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Key className="w-4 h-4 text-emerald-500" /> {t("attendance_member.modal_token_label")}
                          </label>
                          <input 
                            type="text" 
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                            placeholder={t("attendance_member.modal_token_placeholder")}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                          />
                        </motion.div>
                      ) : (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" /> {t("attendance_member.modal_notes_label")}
                          </label>
                          <textarea 
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            placeholder={t("attendance_member.modal_notes_placeholder")}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                            required
                          />
                        </motion.div>
                      )}
                    </div>

                    <AnimatePresence>
                      {errorMsg && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-lg flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> {errorMsg}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className={`w-full py-4 rounded-xl font-black text-white transition-all shadow-xl flex justify-center items-center ${
                        isLoading ? "opacity-70 cursor-not-allowed bg-slate-400" : 
                        submitStatus === "PRESENT" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30 hover:-translate-y-1" : 
                        submitStatus === "LATE" ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30 hover:-translate-y-1" :
                        "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30 hover:-translate-y-1"
                      }`}
                    >
                      {isLoading ? t("attendance_member.modal_processing") : (submitStatus === "PRESENT" || submitStatus === "LATE") ? t("attendance_member.modal_btn_present") : t("attendance_member.modal_btn_excused")}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-5xl font-display font-black tracking-tighter mb-3 flex items-center gap-4 text-slate-900 dark:text-white">
          <ClipboardCheck className="w-10 h-10 text-primary animate-pulse" />
          {t("attendance_member.title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">{userRoleName}</span>
        </h1>
        <p className="text-slate-600 dark:text-white/60 max-w-xl font-medium text-sm md:text-base">
          {t("attendance_member.subtitle")}
        </p>
      </motion.div>

      {/* Pending Sessions Notification */}
      <AnimatePresence>
        {pendingSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-2xl p-4 flex items-start gap-4 shadow-lg shadow-amber-500/5">
              <div className="p-2 bg-amber-500/20 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 dark:text-amber-300 text-lg mb-1">
                  {t("attendance_member.pending_alert_title").replace("{count}", pendingSessions.length)}
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200/80 mb-3">
                  {t("attendance_member.pending_alert_desc")}
                </p>
                <div className="flex flex-col gap-2">
                  {pendingSessions.map(ps => (
                    <div key={ps.id} className="flex items-center justify-between bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-amber-200 dark:border-amber-500/20">
                      <div>
                        <div className="font-bold text-amber-900 dark:text-amber-100 text-sm">{ps.title}</div>
                        <div className="text-xs text-amber-700 dark:text-amber-400/80">
                          {new Date(ps.date).toLocaleDateString(t("system.system_language") === "English" ? "en-US" : "id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                      </div>
                      <button 
                        onClick={() => { setActiveSession(ps); setSubmitStatus("PRESENT"); setErrorMsg(""); setTokenInput(""); setNotesInput(""); }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-full transition-colors shadow-md hover:-translate-y-0.5"
                      >
                        {t("attendance_member.btn_fill")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gamification Highlights */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div variants={item} className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-24 h-24 text-primary" />
          </div>
          <span className="text-[10px] font-black text-slate-500 dark:text-white/40 uppercase tracking-widest block mb-2">{t("attendance_member.rate_title")}</span>
          <div className="flex items-end gap-2 mb-2 relative z-10">
            <div className="text-5xl font-black text-slate-900 dark:text-white">{attendanceRate}%</div>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden mt-4 relative z-10">
            <motion.div initial={{ width: 0 }} animate={{ width: `${attendanceRate}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full" />
          </div>
        </motion.div>

        <motion.div variants={item} className="p-6 rounded-3xl bg-gradient-to-br from-orange-500 to-rose-500 border border-orange-400/50 shadow-xl shadow-orange-500/20 relative overflow-hidden text-white group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-300">
            <Flame className="w-24 h-24 text-white" />
          </div>
          <span className="text-[10px] font-black text-white/80 uppercase tracking-widest block mb-2 relative z-10">{t("attendance_member.streak_title")}</span>
          <div className="flex items-end gap-2 relative z-10">
            <div className="text-5xl font-black">{currentStreak}</div>
            <div className="text-sm font-bold text-white/80 pb-1">{t("attendance_member.streak_subtitle")}</div>
          </div>
          <p className="text-xs font-medium text-white/80 mt-4 leading-relaxed max-w-[85%] relative z-10">
            {currentStreak > 0 ? t("attendance_member.streak_msg_good") : t("attendance_member.streak_msg_bad")}
          </p>
        </motion.div>

        <motion.div variants={item} className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-500">
            <Trophy className="w-24 h-24" />
          </div>
          <span className="text-[10px] font-black text-slate-500 dark:text-white/40 uppercase tracking-widest block mb-2 relative z-10">{t("attendance_member.status_title")}</span>
          <div className="flex items-end gap-2 mb-2 relative z-10">
            <div className={`text-4xl font-black ${attendanceRate >= 80 ? "text-emerald-500" : attendanceRate >= 50 ? "text-amber-500" : "text-rose-500"}`}>
              {attendanceRate >= 80 ? "Excellent" : attendanceRate >= 50 ? "Good" : "Needs Work"}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-600 dark:text-white/60 relative z-10">
            <Award className="w-4 h-4 text-primary" />
            <span>{t("attendance_member.status_req")}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { key: "PRESENT", title: t("attendance_member.status_present"), color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
          { key: "LATE", title: t("attendance_member.status_late"), color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
          { key: "EXCUSED", title: t("attendance_member.status_excused"), color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
          { key: "ABSENT", title: t("attendance_member.status_absent"), color: "text-rose-500 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" },
        ].map(card => (
          <motion.div variants={item} key={card.key} className={`p-4 rounded-2xl border ${card.bg} transition-all hover:scale-105 cursor-default`}>
            <span className="text-[10px] font-black text-slate-600 dark:text-white/50 uppercase tracking-widest block mb-1">{card.title}</span>
            <div className={`text-3xl font-black ${card.color}`}>{getCount(card.key)}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Attendance History Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-transparent">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">{t("attendance_member.history_title")}</h3>
          <span className="text-xs font-bold px-3 py-1 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/70 rounded-full">
            {t("attendance_member.history_count").replace("{count}", effectiveRecords.length)}
          </span>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-slate-50 dark:bg-white/[0.02]">
              <tr>
                {[t("attendance_member.col_session"), t("attendance_member.col_date"), t("attendance_member.col_status"), t("attendance_member.col_notes")].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {effectiveRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardCheck className="w-16 h-16 text-slate-300 dark:text-white/10 mb-4" />
                      <p className="text-slate-500 dark:text-white/40 font-medium">{t("attendance_member.no_history")}</p>
                    </div>
                  </td>
                </tr>
              ) : effectiveRecords.map((rec, idx) => {
                const StatusIcon = STATUS_METADATA[rec.status]?.icon || Info;
                return (
                  <motion.tr initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (idx * 0.05) }} key={rec.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{rec.session?.title || "Sesi Kehadiran"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 dark:text-white/40 shrink-0" />
                        <span className="font-medium">{new Date(rec.session?.date || rec.createdAt).toLocaleDateString(t("system.system_language") === "English" ? "en-US" : "id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${STATUS_METADATA[rec.status]?.bg || "bg-slate-100 text-slate-500 border-slate-200"} ${STATUS_METADATA[rec.status]?.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {STATUS_METADATA[rec.status]?.label || rec.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 dark:text-gray-400 max-w-xs truncate font-medium">
                      {rec.notes || <span className="opacity-40 italic">{t("attendance_member.no_notes")}</span>}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
