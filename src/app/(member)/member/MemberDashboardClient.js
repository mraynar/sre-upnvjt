"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Award, Trophy, ClipboardCheck, FolderKanban, Flame, 
  ArrowRight, Star, BookOpen, Clock, ChevronRight, Zap, Shield, Medal, Play, Activity
} from "lucide-react";
import { getUserLevelData } from "@/lib/leveling";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function MemberDashboardClient({
  user,
  profile,
  rank,
  tasks,
  submissions,
  completedTasksCount,
  presentCount,
  latestPpt,
  latestLiterature,
  xpLogs
}) {
  const { t } = useLanguage();

  const [pptProgress, setPptProgress] = useState(0);

  useEffect(() => {
    if (latestPpt) {
      const savedProgress = localStorage.getItem(`sre_materi_progress_${latestPpt.id}`);
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          const maxIdx = parsed.maxSlideIdx || 0;
          const currentIdx = parsed.currentSlideIdx || 0;
          const totalSlides = latestPpt.slides?.length || maxIdx + 1 || 10;
          
          if (totalSlides > 1) {
            setPptProgress(Math.round((currentIdx / (totalSlides - 1)) * 100));
          } else if (currentIdx >= 0) {
            setPptProgress(100);
          }
        } catch (e) {}
      }
    }
  }, [latestPpt]);

  // Compute next level XP using standardized utility
  const levelData = getUserLevelData(profile?.xp || user?.totalPoints || 0);
  const pointsRemaining = levelData.nextLevelXp ? levelData.nextLevelXp - levelData.totalXp : 0;
  const levelProgressPercent = levelData.progressPercentage;

  const getTaskStatus = (taskId) => {
    const sub = submissions.find(s => s.taskId === taskId);
    if (!sub) return { label: t('member_dashboard.tasks.status_not_started'), color: "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 border-slate-200 dark:border-white/10" };
    if (sub.status === "APPROVED") return { label: t('member_dashboard.tasks.status_completed'), color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" };
    if (sub.status === "REJECTED") return { label: t('member_dashboard.tasks.status_revising'), color: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20" };
    return { label: t('member_dashboard.tasks.status_reviewing'), color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20" };
  };

  return (
    <div className="w-full relative space-y-8 select-none transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      {/* 1. Hero Welcomer & Gamified Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Welcome and Badge Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 bg-white dark:bg-[#08120e] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl dark:shadow-2xl transition-colors duration-500"
        >
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-primary/20 dark:bg-primary/10 blur-[50px] pointer-events-none" />
          
          <div className="relative z-10">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-primary tracking-wide">
              Member Portal
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-slate-900 dark:text-white mt-6 leading-none">
              {t('member_dashboard.greeting.morning').split(" ")[0]} {t('member_dashboard.greeting.morning').split(" ")[1] || ""}, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 dark:to-emerald-300 inline-block max-w-full truncate align-bottom">
                {user?.name?.split(" ")[0]}!
              </span>
            </h1>
            <p className="text-slate-500 dark:text-white/60 text-sm md:text-base font-medium mt-3 max-w-lg leading-relaxed break-words">
              {t('member_dashboard.welcome_msg')}
            </p>
          </div>

          {/* Gamified level progress bar */}
          <div className="mt-8 relative z-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-6 backdrop-blur-md transition-colors duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center border border-primary/20 dark:border-primary/30">
                  <Star className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white mt-1">Level {levelData.currentLevel} • {levelData.levelName}</h3>
                  <p className="text-[10px] text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider">{t('member_dashboard.stats.energy_adventure')}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-white/60 sm:text-right">
                {pointsRemaining > 0 ? `${pointsRemaining} XP menuju level berikutnya` : 'Level Maksimal'}
              </span>
            </div>
            
            <div className="relative">
              <div className="h-3 w-full bg-slate-200 dark:bg-[#050d0a] rounded-full overflow-hidden border border-slate-300 dark:border-white/5 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 dark:to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
              <span className="absolute -top-6 right-2 text-[10px] font-black text-primary font-mono">{levelData.totalXp} XP</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Profile Summary Card (Hidden on Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden lg:flex bg-gradient-to-b from-emerald-50 dark:from-[#0a1f15] to-white dark:to-[#07130e] border border-slate-200 dark:border-primary/20 rounded-3xl p-8 flex-col justify-between items-center text-center relative overflow-hidden shadow-xl dark:shadow-2xl group transition-colors duration-500"
        >
          {/* Decorative glowing background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-slate-100 dark:from-white/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center w-full">
            {/* Avatar with spinning dashed border */}
            <div className="relative">
              <div className="absolute -inset-2 rounded-full border border-dashed border-primary/40 animate-[spin_10s_linear_infinite]" />
              <div className="absolute -inset-3 rounded-full border border-dashed border-emerald-500/20 animate-[spin_15s_linear_infinite_reverse]" />
              {user?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt=""
                  className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-[#07130e] shadow-[0_0_40px_rgba(16,185,129,0.1)] dark:shadow-[0_0_40px_rgba(16,185,129,0.3)] relative z-10"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-primary/10 border-4 border-white dark:border-[#07130e] flex items-center justify-center font-black text-4xl text-primary shadow-[0_0_40px_rgba(16,185,129,0.1)] dark:shadow-[0_0_40px_rgba(16,185,129,0.3)] relative z-10">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Rank Badge Indicator */}
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white dark:text-[#07130e] rounded-full p-1.5 border-4 border-white dark:border-[#07130e] z-20 shadow-lg" title="Top Member">
                <Medal className="w-5 h-5 fill-current" />
              </div>
            </div>
            
            <div className="w-full px-4">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-6 truncate">{user?.name}</h3>
              <p className="text-xs md:text-sm font-bold tracking-widest uppercase text-emerald-600 dark:text-primary/70 mt-1 truncate">{user?.department?.name || "Member"}</p>
            </div>
            
            {/* Level & Title Pill */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 mt-4 rounded-full ${levelData.color} border text-[10px] font-black tracking-widest uppercase shadow-sm dark:shadow-inner`}>
              <Award className="w-4 h-4" />
              Lvl {levelData.currentLevel} • {levelData.levelName}
            </div>

            {/* Mini Stats Row to fill space */}
            <div className="flex items-center justify-between w-full mt-6 px-4 py-3 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 transition-colors duration-500">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400 dark:text-white/40 font-bold uppercase">{t('member_dashboard.profile.rank')}</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">#{rank}</span>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400 dark:text-white/40 font-bold uppercase">{t('member_dashboard.profile.attendance')}</span>
                <span className="text-sm font-black text-emerald-500 dark:text-emerald-400">{presentCount}</span>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400 dark:text-white/40 font-bold uppercase">{t('member_dashboard.profile.tasks')}</span>
                <span className="text-sm font-black text-amber-500 dark:text-amber-400">{completedTasksCount}</span>
              </div>
            </div>
          </div>

          <Link
            href="/member/profil"
            className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-emerald-400 hover:from-primary-focus hover:to-emerald-500 text-xs font-black text-[#050e0a] tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:scale-[1.02]"
          >
            {t('member_dashboard.profile.view_full')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>

      {/* 2. Duolingo-style Gamified Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Item: Total XP */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-[#08120e] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group shadow-sm dark:shadow-none transition-colors duration-500"
        >
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{profile?.xp || 0}</h4>
            <p className="text-xs text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider mt-1">{t('member_dashboard.stats.total_xp')}</p>
          </div>
        </motion.div>

        {/* Stat Item: Tasks Completed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-white dark:bg-[#08120e] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group shadow-sm dark:shadow-none transition-colors duration-500"
        >
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{completedTasksCount}</h4>
            <p className="text-xs text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider mt-1">{t('member_dashboard.stats.tasks_approved')}</p>
          </div>
        </motion.div>

        {/* Stat Item: Leaderboard Rank */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-[#08120e] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group shadow-sm dark:shadow-none transition-colors duration-500"
        >
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none">#{rank}</h4>
            <p className="text-xs text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider mt-1">{t('member_dashboard.stats.rank')}</p>
          </div>
        </motion.div>

        {/* Stat Item: Attendance streak */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white dark:bg-[#08120e] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group shadow-sm dark:shadow-none transition-colors duration-500"
        >
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{presentCount}</h4>
            <p className="text-xs text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider mt-1">{t('member_dashboard.stats.attendance')}</p>
          </div>
        </motion.div>

      </div>

      {/* 3. Lanjutkan Belajar Section - GAMIFIED */}
      {latestPpt && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative rounded-[2rem] p-[2px] overflow-hidden group shadow-[0_20px_40px_rgba(16,185,129,0.1)]"
        >
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-[length:200%_auto] animate-gradient opacity-80" />
          
          <div className="relative bg-[#050e0a]/95 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8 h-full">
            
            {/* Gamified Background Ambient */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none transition-transform duration-1000 group-hover:scale-150" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-500/20 rounded-full blur-[100px] pointer-events-none transition-transform duration-1000 group-hover:scale-150" />

            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <Activity className="w-3 h-3" />
                  Quest Aktif
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  <Zap className="w-3 h-3 fill-current" />
                  +10 XP
                </span>
              </div>
              
              <h2 className="text-2xl md:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight line-clamp-2 md:line-clamp-none break-words">
                {latestPpt.title}
              </h2>
              
              <p className="text-white/50 text-xs md:text-sm mt-3 max-w-xl font-medium leading-relaxed line-clamp-2 break-words">
                {latestPpt.description || "Modul PPT pembelajaran resmi dari Divisi Academic SRE UPN Veteran Jawa Timur."}
              </p>

              {/* Real Progress Bar */}
              <div className="mt-6 max-w-md">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Progress</span>
                  <span className="text-xs font-black text-emerald-400">{pptProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full relative overflow-hidden transition-all duration-1000" 
                    style={{ width: `${pptProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <Link 
                  href="/member/materi"
                  className="relative group/btn inline-flex items-center gap-3 bg-emerald-500 text-[#050e0a] font-black px-8 py-4 rounded-2xl text-sm tracking-widest uppercase overflow-hidden transition-transform active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2">
                    <Play className="w-5 h-5 fill-current" />
                    Mulai Eksekusi
                  </span>
                </Link>
              </div>
            </div>
            
            {/* Gamified Thumbnail */}
            <div className="w-full md:w-80 aspect-[4/3] rounded-[1.5rem] bg-black/50 border-2 border-white/10 overflow-hidden relative shadow-[0_0_30px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/50 transition-colors duration-500 z-10">
              {latestPpt.coverImageUrl ? (
                <img 
                  src={latestPpt.coverImageUrl} 
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-emerald-500/40 group-hover:text-emerald-500/60 transition-colors">
                  <BookOpen className="w-12 h-12 mb-3 animate-pulse" />
                  <span className="text-sm font-black tracking-widest uppercase">Target File</span>
                </div>
              )}
              
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050e0a] via-[#050e0a]/20 to-transparent opacity-90" />
              
              <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center text-[10px] font-black text-white/80 uppercase tracking-widest">                <span className="px-2 py-1 bg-white/10 rounded backdrop-blur-md border border-white/10">{latestPpt.slides?.length || 10} Slide</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. Sub-grid: Tasks, Lit & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
        
        {/* Active/Recent Tasks tracker */}
        <div className="xl:col-span-2 flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-black text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <FolderKanban className="w-6 h-6 text-primary" />
              {t('member_dashboard.tasks.title')}
            </h3>
            <Link 
              href="/member/tugas" 
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs font-black text-primary hover:bg-primary hover:text-white dark:hover:text-[#050e0a] hover:border-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              {t('member_dashboard.tasks.view_all')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex-1 bg-white dark:bg-[#08120e] border border-slate-200 dark:border-white/5 rounded-3xl p-5 flex flex-col space-y-3 shadow-xl dark:shadow-2xl transition-colors duration-500">
            {tasks.length > 0 ? (
              [...tasks]
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .slice(0, 5)
                .map((tk) => {
                const statusInfo = getTaskStatus(tk.id);
                const deadlineDate = new Date(tk.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                return (
                  <Link 
                    href="/member/tugas"
                    key={tk.id}
                    className="group relative bg-slate-50 dark:bg-[#08120e] border border-slate-200 dark:border-white/5 hover:border-primary/30 rounded-2xl p-3 flex flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:scale-[1.01] overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Left: Icon & Info */}
                    <div className="relative z-10 flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                        <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-white/50 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{tk.title}</h4>
                        <div className="flex items-center gap-3 mt-1 sm:mt-1.5">
                          <span className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-white/50 bg-slate-200 dark:bg-white/5 px-1.5 sm:px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary/70" />
                            {t('member_dashboard.tasks.deadline')}: {deadlineDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Badges & Action */}
                    <div className="relative z-10 flex items-center gap-2 sm:gap-4 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <span className={`hidden sm:flex px-2.5 py-1 border rounded-lg text-[9px] font-black uppercase tracking-widest ${statusInfo.color} shadow-sm`}>
                          {statusInfo.label}
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[9px] sm:text-[10px] font-black text-amber-400 font-mono shadow-sm">
                          <Zap className="w-3 h-3" />
                          +{tk.rewardXp} XP
                        </span>
                      </div>
                      
                      <div className="hidden sm:flex w-9 h-9 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 items-center justify-center group-hover:bg-primary group-hover:text-white dark:group-hover:text-[#050e0a] group-hover:border-primary text-slate-500 dark:text-white/50 transition-all flex-shrink-0">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <FolderKanban className="w-8 h-8 text-primary/50" />
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">{t('member_dashboard.tasks.no_tasks')}</h4>
                <p className="text-xs text-slate-500 dark:text-white/40 mt-2 max-w-sm">{t('member_dashboard.tasks.no_tasks_desc')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity feed / XP logs */}
        <div className="flex flex-col space-y-6">
          <h3 className="font-display font-black text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-purple-400" />
            {t('member_dashboard.xp_logs.title')}
          </h3>

          <div className="flex-1 bg-white dark:bg-[#08120e] border border-slate-200 dark:border-white/5 rounded-3xl p-5 flex flex-col space-y-3 shadow-xl dark:shadow-2xl transition-colors duration-500">
            {xpLogs.length > 0 ? (
              <div className="flex flex-col space-y-3">
                {[...xpLogs]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((log) => {
                  const dateString = new Date(log.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                  return (
                    <div 
                      key={log.id} 
                      className="group flex flex-row items-center justify-between gap-3 sm:gap-4 p-3 rounded-2xl border border-transparent hover:border-slate-300 dark:hover:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300 hover:shadow-lg cursor-default"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 group-hover:from-primary/20 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                          {log.sourceType === "task" ? <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-rotate-12 transition-transform" /> : 
                           log.sourceType === "quiz" ? <Star className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-spin" /> : 
                           log.sourceType === "attendance" ? <Flame className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce" /> : <Award className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{log.reason}</p>
                          <div className="flex items-center gap-3 mt-1 sm:mt-1.5">
                            <p className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-white/50 bg-slate-100 dark:bg-white/5 px-1.5 sm:px-2 py-0.5 rounded-md">
                              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary/70" />
                              {dateString}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] sm:text-[10px] font-black text-emerald-400 font-mono shrink-0 shadow-sm group-hover:bg-emerald-500/20 transition-colors">
                          <Zap className="w-3 h-3" />
                          +{log.amount} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 flex flex-col items-center justify-center">
                <Star className="w-12 h-12 text-slate-300 dark:text-white/10 mb-3" />
                <p className="text-xs font-bold text-slate-500 dark:text-white/40">{t('member_dashboard.xp_logs.no_xp')}</p>
                <p className="text-[10px] text-slate-400 dark:text-white/20 mt-1 max-w-[200px]">{t('member_dashboard.xp_logs.no_xp_desc')}</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
