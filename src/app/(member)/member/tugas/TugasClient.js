"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban, Calendar, Award, CheckCircle2, XCircle, Clock,
  ExternalLink, Send, ArrowRight, X, AlertTriangle, Info, Sparkles, Zap, Flame, UploadCloud, Link as LinkIcon
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function TugasClient({ user, initialTasks, initialSubmissions }) {
  const [tasks] = useState(initialTasks || []);
  const [submissions, setSubmissions] = useState(initialSubmissions || []);
  const [activeTask, setActiveTask] = useState(null); // task for details view
  const [submissionType, setSubmissionType] = useState("link"); // 'link' or 'file'
  const [fileUrl, setFileUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const { language, t } = useLanguage();

  const getTaskVisuals = (taskId) => {
    const sub = submissions.find(s => s.taskId === taskId);
    if (!sub) return { 
      key: "NOT_STARTED", 
      label: t('member_tasks.status_not_started'), 
      badge: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25",
      borderHover: "hover:border-blue-500/50",
      glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
      gradient: "from-blue-500/10 via-transparent to-transparent"
    };
    if (sub.status === "APPROVED") return { 
      key: "APPROVED", 
      label: t('member_tasks.status_approved'), 
      badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
      borderHover: "hover:border-emerald-500/50",
      glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
      gradient: "from-emerald-500/10 via-transparent to-transparent"
    };
    if (sub.status === "REJECTED") return { 
      key: "REJECTED", 
      label: t('member_tasks.status_rejected'), 
      badge: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25",
      borderHover: "hover:border-rose-500/50",
      glow: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]",
      gradient: "from-rose-500/10 via-transparent to-transparent"
    };
    return { 
      key: "PENDING", 
      label: t('member_tasks.status_pending'), 
      badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
      borderHover: "hover:border-amber-500/50",
      glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
      gradient: "from-amber-500/10 via-transparent to-transparent"
    };
  };

  const handleOpenDetail = (tk) => {
    const sub = submissions.find(s => s.taskId === tk.id);
    setActiveTask(tk);
    setFileUrl(sub?.fileUrl || "");
    setFiles([]);
    
    if (tk.submissionType === 'FILE') {
      setSubmissionType("file");
    } else if (tk.submissionType === 'LINK') {
      setSubmissionType("link");
    } else {
      setSubmissionType("link");
    }
    
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
      const formData = new FormData();
      formData.append("type", submissionType);
      if (submissionType === "link") {
        formData.append("fileUrl", fileUrl);
      } else {
        if (!files || files.length === 0) {
          setError(t('member_tasks.error_no_file'));
          setIsLoading(false);
          return;
        }

        let totalSizeMb = 0;
        files.forEach(f => { totalSizeMb += f.size / (1024 * 1024); });
        const maxMb = activeTask.maxUploadSizeMb || 2;
        if (totalSizeMb > maxMb) {
          setError(`Total ukuran file melebihi batas maksimal (${maxMb} MB)`);
          setIsLoading(false);
          return;
        }

        files.forEach(f => {
          const originalName = f.name;
          const lastDotIdx = originalName.lastIndexOf('.');
          const extension = lastDotIdx !== -1 ? originalName.substring(lastDotIdx) : '';
          const oldNameNoExt = lastDotIdx !== -1 ? originalName.substring(0, lastDotIdx) : originalName;
          
          const safeTaskTitle = activeTask.title.replace(/[^a-zA-Z0-9]/g, '_');
          const safeUserName = (user?.name || 'User').replace(/[^a-zA-Z0-9]/g, '_');
          const safeOriginalName = oldNameNoExt.replace(/[^a-zA-Z0-9]/g, '_');
          
          const newFileName = `${safeTaskTitle}_${safeUserName}_${safeOriginalName}${extension}`;
          const renamedFile = new File([f], newFileName, { type: f.type });
          
          formData.append("file", renamedFile);
        });
      }

      const res = await fetch(`/api/tasks/${activeTask.id}/submissions`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setSubmissions(prev => {
          const filtered = prev.filter(s => s.taskId !== activeTask.id);
          return [...filtered, data.submission];
        });
        setSuccess(t('member_tasks.submit_success'));
        setTimeout(() => setActiveTask(null), 1500);
      } else {
        setError(data.error || t('member_tasks.submit_error'));
      }
    } catch {
      setError(t('member_tasks.submit_network_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative transition-colors duration-500 min-h-[70vh] flex flex-col">
      
      {/* Colorful Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-[pulse_12s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/5 dark:bg-blue-500/10 rounded-[100%] blur-[80px] mix-blend-multiply dark:mix-blend-screen opacity-50" />
      </div>

      {/* Header */}
      <div className="mb-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm mb-6"
        >
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-black tracking-widest uppercase text-slate-600 dark:text-gray-300">Penugasan SRE</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tighter mb-4 text-slate-900 dark:text-white"
        >
          {t('member_tasks.title').split(' ').map((word, i) => (
            <span key={i} className={i % 2 === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400" : ""}>
              {word}{" "}
            </span>
          ))}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-500 dark:text-gray-400 max-w-2xl text-lg font-medium"
        >
          {t('member_tasks.subtitle')}
        </motion.p>
      </div>

      {/* Task Cards Grid */}
      {tasks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="py-24 flex flex-col items-center justify-center text-center bg-white/50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-3xl backdrop-blur-sm shadow-xl"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t('member_tasks.empty_title')}</h3>
          <p className="text-slate-500 dark:text-gray-400 text-base max-w-sm leading-relaxed">{t('member_tasks.empty_desc')}</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 relative z-10">
          {tasks.map((tk, index) => {
            const visual = getTaskVisuals(tk.id);
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: index * 0.1 }}
                key={tk.id}
                onClick={() => handleOpenDetail(tk)}
                className={`
                  group relative overflow-hidden bg-slate-900 border border-white/10 rounded-2xl p-6 
                  cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]
                  shadow-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]
                `}
              >
                {/* Cyberpunk/RPG Animated Border Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} opacity-0 group-hover:opacity-100 transition-duration-500`} />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[pulse_2s_ease-in-out_infinite]" />
                
                {/* Tech Grid Background */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full">
                  
                  {/* Floating Hexagon XP Badge */}
                  <div className="absolute -top-3 -right-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-500 blur-md opacity-40 rounded-full animate-pulse group-hover:opacity-80 transition-opacity" />
                      <div className="relative bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-200/50 rounded-xl px-4 py-2 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] transform rotate-3 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                        <Zap className="w-4 h-4 text-amber-900 mr-1 fill-amber-900" />
                        <span className="font-black text-amber-900 text-sm tracking-widest">{tk.rewardXp} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Quest Type / Status Label */}
                  <div className="mb-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border-l-[3px] ${visual.badge}`}>
                      <Flame className="w-3 h-3" />
                      {visual.label}
                    </span>
                  </div>

                  {/* Quest Title */}
                  <h3 className="text-xl md:text-2xl font-black text-white line-clamp-3 mb-3 leading-snug group-hover:text-primary transition-colors" title={tk.title}>
                    {tk.title}
                  </h3>
                  
                  {/* Quest Description */}
                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-6 font-medium flex-1">
                    {tk.description}
                  </p>

                  {/* Bottom Action Bar */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center border border-slate-700">
                        <Clock className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Deadline</span>
                        <span className="text-xs font-bold text-slate-300" suppressHydrationWarning>
                          {new Date(tk.deadline).toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center px-4 py-2 rounded-md bg-primary text-[#050e0a] font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] group-hover:bg-primary-focus transition-all duration-300 transform group-hover:scale-105">
                      {t('member_tasks.start_mission')} <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Task Detail Modal */}
      <AnimatePresence>
        {activeTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveTask(null)} 
              className="absolute inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-md" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#07130e] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Colorful Header Background */}
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-primary/20 via-emerald-500/10 to-transparent pointer-events-none" />

              <div className="relative p-6 md:p-8 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary backdrop-blur-sm">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">{t('member_tasks.modal_title')}</h2>
                    <p className="text-xs font-bold text-primary mt-0.5">SRE UPNVJT</p>
                  </div>
                </div>
                <button onClick={() => setActiveTask(null)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative p-6 md:p-8 pt-0 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
                
                {/* Title and Meta */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{activeTask.title}</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="text-sm font-black">+{activeTask.rewardXp} <span className="font-bold text-xs uppercase opacity-70">{t('member_tasks.reward')}</span></span>
                    </div>
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold" suppressHydrationWarning>
                        <span className="opacity-60 font-medium mr-1">{t('member_tasks.deadline')}</span> 
                        {new Date(activeTask.deadline).toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
                          day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-black tracking-widest uppercase text-slate-400 dark:text-gray-500 mb-3">Instruksi Tugas</h4>
                  <div className="p-5 md:p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-sm text-slate-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                    {activeTask.description}
                  </div>
                </div>

                {/* Submisi status & Form */}
                <div className="pt-8 border-t border-slate-200 dark:border-white/10">
                  {(() => {
                    const visual = getTaskVisuals(activeTask.id);
                    const sub = submissions.find(s => s.taskId === activeTask.id);

                    return (
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <div>
                            <h4 className="text-xs font-black tracking-widest uppercase text-slate-400 dark:text-gray-500 mb-1">{t('member_tasks.submission_status')}</h4>
                            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium max-w-[200px]">Periksa status peninjauan hasil kerja Anda</p>
                          </div>
                          <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border shadow-sm ${visual.badge}`}>
                            {visual.label}
                          </span>
                        </div>

                        {/* Admin Feedback */}
                        {sub?.feedback && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <div className="font-black text-sm text-amber-700 dark:text-amber-400 mb-1">{t('member_tasks.reviewer_note')}</div>
                              <p className="text-sm text-amber-600/80 dark:text-amber-400/80 font-medium italic">"{sub.feedback}"</p>
                            </div>
                          </motion.div>
                        )}

                        {/* Submission URL Link for viewing */}
                        {sub && (
                          <div className="flex justify-between items-center p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 group hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center">
                                <ExternalLink className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">{t('member_tasks.submitted_file')}</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-gray-300 truncate max-w-[150px] sm:max-w-[250px]">{sub.fileUrl}</span>
                              </div>
                            </div>
                            <a
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 rounded-xl bg-white dark:bg-[#07130e] border border-slate-200 dark:border-white/10 text-primary font-bold text-xs hover:border-primary transition-colors flex items-center gap-2"
                            >
                              {t('member_tasks.view_submission')}
                            </a>
                          </div>
                        )}

                        {/* Submission input form */}
                        {(visual.key === "NOT_STARTED" || visual.key === "REJECTED") && (
                          <form onSubmit={handleSubmitTask} className="space-y-5 pt-4">
                            
                            {/* Type Toggle */}
                            {(!activeTask.submissionType || activeTask.submissionType === 'BOTH') && (
                              <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                                <button
                                  type="button"
                                  onClick={() => setSubmissionType("link")}
                                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${submissionType === "link" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-white"}`}
                                >
                                  <LinkIcon className="w-4 h-4" /> {t('member_tasks.type_link')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSubmissionType("file")}
                                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${submissionType === "file" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-white"}`}
                                >
                                  <UploadCloud className="w-4 h-4" /> {t('member_tasks.type_file')}
                                </button>
                              </div>
                            )}

                            <div>
                              <label className="block text-xs font-black tracking-widest text-slate-700 dark:text-gray-300 uppercase mb-3 ml-1">
                                {submissionType === "link" ? t('member_tasks.form_label') : t('member_tasks.form_label_file')}
                              </label>
                              
                              {submissionType === "link" ? (
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <ExternalLink className="w-5 h-5 text-slate-400" />
                                  </div>
                                  <input
                                    type="url"
                                    required
                                    value={fileUrl}
                                    onChange={e => setFileUrl(e.target.value)}
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                    placeholder="https://drive.google.com/..."
                                  />
                                </div>
                              ) : (
                                <div className="relative flex items-center justify-center w-full">
                                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl cursor-pointer bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-primary/50 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <UploadCloud className="w-8 h-8 mb-2 text-slate-400 group-hover:text-primary" />
                                      <p className="mb-1 text-sm font-bold text-slate-600 dark:text-gray-300">
                                        {files.length > 0 ? `${files.length} file dipilih` : t('member_tasks.choose_file')}
                                      </p>
                                      {!files.length && <p className="text-xs text-slate-500 dark:text-gray-500">Maks. {activeTask.maxUploadSizeMb || 2} MB</p>}
                                    </div>
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      required={files.length === 0}
                                      multiple={activeTask.allowMultipleFiles}
                                      onChange={(e) => setFiles(Array.from(e.target.files))}
                                    />
                                  </label>
                                </div>
                              )}
                            </div>

                            {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-3 rounded-xl bg-red-500/10 text-xs font-bold text-red-500 dark:text-red-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {error}</motion.div>}
                            {success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-3 rounded-xl bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {success}</motion.div>}

                            <button
                              type="submit"
                              disabled={isLoading}
                              className="w-full h-14 bg-gradient-to-r from-primary to-emerald-400 text-white dark:text-[#050e0a] hover:from-primary-focus hover:to-emerald-500 transition-all rounded-2xl font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.4)] hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none mt-4"
                            >
                              {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 dark:border-[#050e0a]/30 border-t-white dark:border-t-[#050e0a] rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  <span>{t('member_tasks.form_submit')}</span>
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

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}} />
    </div>
  );
}
