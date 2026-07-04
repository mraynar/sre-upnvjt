"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Award, Trophy, ClipboardCheck, FolderKanban, Flame, 
  ArrowRight, Star, BookOpen, Clock, ChevronRight, Zap
} from "lucide-react";

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

  // Gamification badges details
  const getLevelBadge = (level) => {
    if (level >= 31) return { label: "Forest Elite", desc: "Penjaga Kelestarian Alam", color: "from-emerald-600 to-emerald-400 text-white shadow-emerald-500/20" };
    if (level >= 16) return { label: "Ancient Tree", desc: "Inovator Energi Hijau", color: "from-green-600 to-green-400 text-white shadow-green-500/20" };
    if (level >= 6) return { label: "Sprouting Sapling", desc: "Pecinta Inovasi Baru", color: "from-teal-600 to-teal-400 text-white shadow-teal-500/20" };
    return { label: "Fresh Seedling", desc: "Pemula Transisi Energi", color: "from-blue-600 to-blue-400 text-white shadow-blue-500/20" };
  };

  const badge = getLevelBadge(profile?.level || 1);

  // Compute next level XP
  const pointsCurrentLevel = (profile?.xp || 0) % 100;
  const pointsRemaining = 100 - pointsCurrentLevel;
  const levelProgressPercent = pointsCurrentLevel;

  // Task Status mapper
  const getTaskStatus = (taskId) => {
    const sub = submissions.find(s => s.taskId === taskId);
    if (!sub) return { label: "Belum Mulai", color: "bg-white/5 text-white/50 border-white/10" };
    if (sub.status === "APPROVED") return { label: "Disetujui", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" };
    if (sub.status === "REJECTED") return { label: "Revisi", color: "bg-red-500/15 text-red-400 border-red-500/20" };
    return { label: "Menunggu Review", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
  };

  return (
    <div className="w-full relative space-y-8 select-none">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      {/* 1. Hero Welcomer & Gamified Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Welcome and Badge Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 bg-[#08120e] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl"
        >
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-primary/10 blur-[50px] pointer-events-none" />
          
          <div className="relative z-10">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-primary tracking-wide">
              E-Learning Member Portal
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white mt-6 leading-none">
              Selamat datang, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
                {user?.name?.split(" ")[0]}!
              </span>
            </h1>
            <p className="text-white/60 text-sm md:text-base font-medium mt-3 max-w-lg leading-relaxed">
              Siap melangkah hari ini? Selesaikan tugas harian, pelajari materi terbaru, dan kumpulkan poin XP untuk menaikkan peringkatmu di Hall of Fame!
            </p>
          </div>

          {/* Gamified level progress bar */}
          <div className="mt-8 relative z-10 bg-white/5 border border-white/5 rounded-2xl p-4 md:p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Star className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Level {profile?.level || 1} • {badge.label}</h4>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{badge.desc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-white/60 sm:text-right">
                {pointsRemaining} XP menuju level berikutnya
              </span>
            </div>
            
            <div className="relative">
              <div className="h-3 w-full bg-[#050d0a] rounded-full overflow-hidden border border-white/5 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
              <span className="absolute -top-6 right-2 text-[10px] font-black text-primary font-mono">{levelProgressPercent}/100 XP</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Profile Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-b from-[#0a1f15] to-[#07130e] border border-primary/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-2xl group"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10 group-hover:scale-105 transition-transform duration-700 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt=""
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center font-black text-3xl text-primary shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            
            <h3 className="text-xl font-black text-white mt-4">{user?.name}</h3>
            <p className="text-xs text-white/50 mt-1">{user?.department?.name || "Pengurus SRE"}</p>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-4 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-black tracking-wider text-primary uppercase">
              <Award className="w-3.5 h-3.5" />
              Lvl {profile?.level || 1}
            </div>
          </div>

          <Link
            href="/member/profil"
            className="w-full mt-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white tracking-wide transition-all flex items-center justify-center gap-2"
          >
            Lihat Profil
            <ChevronRight className="w-4 h-4" />
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
          className="bg-[#08120e] border border-white/5 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group"
        >
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white leading-none">{profile?.xp || 0}</h4>
            <p className="text-xs text-white/40 font-bold uppercase tracking-wider mt-1">Total Poin XP</p>
          </div>
        </motion.div>

        {/* Stat Item: Tasks Completed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-[#08120e] border border-white/5 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group"
        >
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white leading-none">{completedTasksCount}</h4>
            <p className="text-xs text-white/40 font-bold uppercase tracking-wider mt-1">Tugas Disetujui</p>
          </div>
        </motion.div>

        {/* Stat Item: Leaderboard Rank */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#08120e] border border-white/5 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group"
        >
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white leading-none">#{rank}</h4>
            <p className="text-xs text-white/40 font-bold uppercase tracking-wider mt-1">Peringkat Rank</p>
          </div>
        </motion.div>

        {/* Stat Item: Attendance streak */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-[#08120e] border border-white/5 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group"
        >
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-white leading-none">{presentCount}</h4>
            <p className="text-xs text-white/40 font-bold uppercase tracking-wider mt-1">Kehadiran (Absen)</p>
          </div>
        </motion.div>

      </div>

      {/* 3. Lanjutkan Belajar Section */}
      {latestPpt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-[#081b12] to-[#07130e] border border-primary/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-2xl group"
        >
          <div className="flex-1">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
              Lanjutkan Belajar
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-black text-white mt-4 tracking-tight">
              {latestPpt.title}
            </h2>
            <p className="text-white/60 text-xs md:text-sm mt-2 max-w-xl leading-relaxed line-clamp-2">
              {latestPpt.description || "Modul PPT pembelajaran resmi dari Divisi Academic SRE UPN Veteran Jawa Timur."}
            </p>
            <div className="flex items-center gap-6 mt-6">
              <Link 
                href="/member/materi"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-focus hover:scale-105 text-[#050e0a] font-bold px-6 py-3 rounded-2xl text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Mulai Belajar
                <Zap className="w-4 h-4 fill-current" />
              </Link>
            </div>
          </div>
          
          {/* Decorative Carousel representation */}
          <div className="w-full md:w-80 aspect-video rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative shadow-lg">
            {latestPpt.coverImageUrl ? (
              <img 
                src={latestPpt.coverImageUrl} 
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-primary/40">
                <BookOpen className="w-10 h-10 mb-2 animate-bounce" />
                <span className="text-xs font-bold tracking-widest uppercase">Slide Modul</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] font-black text-white uppercase tracking-wider">
              <span>SRE E-Academy</span>
              <span>10 Slide</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. Sub-grid: Tasks, Lit & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Active/Recent Tasks tracker */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-black text-2xl tracking-tight text-white flex items-center gap-2.5">
              <FolderKanban className="w-6 h-6 text-primary" />
              Tugas & Proyek Pengurus
            </h3>
            <Link href="/member/tugas" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group">
              Semua Tugas <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.slice(0, 4).map((tk) => {
              const statusInfo = getTaskStatus(tk.id);
              const deadlineDate = new Date(tk.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
              return (
                <div 
                  key={tk.id}
                  className="bg-[#08120e] border border-white/5 hover:border-primary/20 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-lg hover:-translate-y-1"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <span className={`px-2 py-0.5 border rounded-md text-[9px] font-black uppercase tracking-wider ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 font-mono">
                        +{tk.rewardXp} XP
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white mt-4 line-clamp-1">{tk.title}</h4>
                    <p className="text-white/40 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {tk.description || "Silakan cek detail instruksi tugas untuk pengerjaan lebih lengkap."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 mt-5 pt-3 text-[10px] font-medium text-white/50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-white/30" />
                      DL: {deadlineDate}
                    </span>
                    <Link href="/member/tugas" className="text-primary hover:underline font-bold">
                      Kumpulkan
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity feed / XP logs */}
        <div className="space-y-6">
          <h3 className="font-display font-black text-2xl tracking-tight text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-purple-400" />
            Aktivitas XP Baru
          </h3>

          <div className="bg-[#08120e] border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl">
            {xpLogs.length > 0 ? (
              <div className="space-y-4">
                {xpLogs.map((log) => {
                  const dateString = new Date(log.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={log.id} className="flex items-center justify-between gap-4 pb-3 border-b border-white/5 last:pb-0 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                          {log.sourceType === "task" ? <FolderKanban className="w-4 h-4" /> : 
                           log.sourceType === "quiz" ? <Star className="w-4 h-4" /> : 
                           log.sourceType === "attendance" ? <Flame className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate max-w-[150px]">{log.reason}</p>
                          <p className="text-[10px] text-white/40 mt-0.5">{dateString}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-400 font-mono shrink-0">
                        +{log.amount} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 flex flex-col items-center justify-center">
                <Star className="w-12 h-12 text-white/10 mb-3" />
                <p className="text-xs font-bold text-white/40">Belum ada perolehan XP</p>
                <p className="text-[10px] text-white/20 mt-1 max-w-[200px]">Ayo ikuti kuis, isi absensi, dan submit tugas untuk mengumpulkan XP pertama Anda!</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
