"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, Flame, Medal, ArrowUp, Crown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getUserLevelData } from "@/lib/leveling";

export default function LeaderboardMemberClient({ initialLeaderboard, currentUserId }) {
  const [leaderboard] = useState(initialLeaderboard || []);
  const { t } = useLanguage();

  const filtered = leaderboard;

  const maxXP = leaderboard[0]?.xp || 100;

  // Group top 3
  const top3 = filtered.filter(item => item.rank <= 3);
  
  // Sort top 3 to: [Silver (Rank 2), Gold (Rank 1), Bronze (Rank 3)] for visual podium centering
  const podiumList = [];
  const rank2 = top3.find(t => t.rank === 2);
  const rank1 = top3.find(t => t.rank === 1);
  const rank3 = top3.find(t => t.rank === 3);

  if (rank2) podiumList.push(rank2);
  if (rank1) podiumList.push(rank1);
  if (rank3) podiumList.push(rank3);



  const currentUserData = leaderboard.find(item => item.id === currentUserId);
  let xpToNextRank = 0;
  if (currentUserData && currentUserData.rank > 1) {
    const personAbove = leaderboard.find(item => item.rank === currentUserData.rank - 1);
    if (personAbove) {
      xpToNextRank = personAbove.xp - currentUserData.xp + 1;
    }
  }

  return (
    <div className="w-full relative pb-10 select-none">
      
      {/* Ambience glow */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 dark:bg-primary/10 rounded-[100%] blur-[100px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[100px] animate-[pulse_12s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 relative z-10">
        <div>
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-primary tracking-wide uppercase">
            {t('leaderboard.badge_hof')}
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-slate-900 dark:text-white mt-4 flex items-center gap-3">
            <Trophy className="w-9 h-9 text-amber-500 dark:text-amber-400 animate-bounce" />
            {t('leaderboard.title')}
          </h1>
          <p className="text-slate-500 dark:text-white/50 max-w-xl font-medium text-sm mt-2 leading-relaxed">
            {t('leaderboard.subtitle')}
          </p>
        </div>
      </div>

      {/* Podium View */}
      {podiumList.length > 0 && (
        <div className="flex justify-center items-end gap-3 md:gap-8 mb-16 pt-16 px-4 relative z-10 perspective-1000">
          
          {/* Floating Podium Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center -z-10">
            <div className="w-1 h-1 bg-amber-400 rounded-full absolute bottom-20 left-[30%] animate-[ping_3s_ease-in-out_infinite]" />
            <div className="w-2 h-2 bg-emerald-400 rounded-full absolute bottom-40 right-[35%] animate-[pulse_2s_ease-in-out_infinite]" />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full absolute bottom-32 left-[45%] animate-[bounce_4s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 w-[500px] h-[200px] bg-gradient-to-t from-primary/10 to-transparent blur-2xl" />
          </div>

          {podiumList.map((item) => {
            const isGold = item.rank === 1;
            const isSilver = item.rank === 2;
            const isBronze = item.rank === 3;

            const heightClass = isGold ? "h-52 md:h-64" : isSilver ? "h-40 md:h-52" : "h-32 md:h-40";
            const bgClass = isGold 
              ? "from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-600/5 border-amber-300 dark:border-amber-500/30" 
              : isSilver 
                ? "from-slate-200 to-slate-50 dark:from-gray-400/20 dark:to-gray-500/5 border-slate-300 dark:border-gray-400/30" 
                : "from-orange-100 to-orange-50 dark:from-amber-700/20 dark:to-amber-800/5 border-orange-300 dark:border-amber-700/30";
            const badgeLabel = isGold ? "1st" : isSilver ? "2nd" : "3rd";
            const textRankColor = isGold ? "text-amber-600 dark:text-amber-400" : isSilver ? "text-slate-500 dark:text-gray-300" : "text-orange-700 dark:text-amber-700";
            
            const avatarBorderColor = isGold ? "border-amber-400" : isSilver ? "border-slate-300 dark:border-gray-400" : "border-orange-500 dark:border-amber-700";
            const avatarShadow = isGold ? "shadow-[0_0_25px_rgba(251,191,36,0.5)]" : isSilver ? "shadow-[0_0_15px_rgba(148,163,184,0.4)]" : "shadow-[0_0_15px_rgba(249,115,22,0.4)]";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: item.rank * 0.1 }}
                className="flex flex-col items-center w-24 md:w-36 relative group transform-gpu hover:-translate-y-4 hover:scale-105 transition-all duration-500 cursor-default"
              >
                <div className="relative mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {isGold && (
                    <motion.div 
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ yoyo: Infinity, duration: 2, ease: "easeInOut" }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]"
                    >
                      <Crown className="w-10 h-10 text-amber-400 fill-amber-400" />
                    </motion.div>
                  )}
                  {item.profilePictureUrl ? (
                    <img
                      src={item.profilePictureUrl}
                      alt=""
                      className={`relative z-10 w-16 h-16 md:w-24 md:h-24 rounded-full object-cover border-4 ${avatarBorderColor} ${avatarShadow}`}
                    />
                  ) : (
                    <div className={`relative z-10 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center font-black text-xl border-4 ${avatarBorderColor} ${avatarShadow} bg-white dark:bg-[#050e0a] ${textRankColor}`}>
                      {item.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-black px-3 py-1 rounded-full border bg-white dark:bg-[#050e0a] flex items-center gap-1 shadow-md z-20 ${avatarBorderColor} ${textRankColor}`}>
                    {isGold && <Star className="w-3 h-3 fill-current animate-spin" style={{ animationDuration: "3s" }} />}
                    {badgeLabel}
                  </span>
                </div>

                {/* Name */}
                <div className="text-center mb-3">
                  <div className="font-black text-slate-800 dark:text-white text-xs md:text-sm truncate w-24 md:w-32">{item.name}</div>
                </div>

                {/* Podium Pedestal */}
                <div className={`w-full ${heightClass} bg-gradient-to-b ${bgClass} border border-b-0 rounded-t-[28px] flex flex-col justify-end p-4 text-center shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group-hover:brightness-125 transition-all duration-500 backdrop-blur-md`}>
                  <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5 rounded-t-[28px] group-hover:scale-110 transition-transform duration-700" />
                  
                  {/* Sweep Light Animation for Gold */}
                  {isGold && <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[30deg] animate-[sweep_2.5s_ease-in-out_infinite]" />}

                  <div className="relative z-10">
                    <div className={`text-2xl md:text-3xl font-black flex items-center justify-center gap-1 font-mono ${isGold ? 'text-amber-600 dark:text-white drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'text-slate-800 dark:text-white'}`}>
                      <Zap className={`w-5 h-5 shrink-0 animate-pulse ${isGold ? 'text-amber-500 fill-amber-500' : isSilver ? 'text-slate-400 fill-slate-400' : 'text-orange-500 fill-orange-500'}`} />
                      {item.xp}
                    </div>
                    <span className="text-[9px] font-black text-slate-500 dark:text-white/40 tracking-widest uppercase block mt-1">{t('leaderboard.xp_points')}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest mt-3 block ${textRankColor}`}>
                      {isGold ? "🏆 MVP GOLD" : isSilver ? "SILVER" : "BRONZE"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Rankings List */}
      <div className="bg-white dark:bg-[#08120e] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl relative z-10">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead className="border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
              <tr>
                {[t('leaderboard.table_rank'), t('leaderboard.table_member'), t('leaderboard.table_badge'), t('leaderboard.table_progress')].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 dark:text-white/30 font-bold text-sm">
                    {t('leaderboard.empty')}
                  </td>
                </tr>
              ) : filtered.map((item) => {
                const isCurrentUser = item.id === currentUserId;
                const levelData = getUserLevelData(item.xp);
                const relativeProgressPercent = Math.max(5, (item.xp / maxXP) * 100);

                return (
                  <tr
                    key={item.id}
                    className={`transition-all duration-300 transform group hover:scale-[1.01] hover:z-10 hover:shadow-lg rounded-xl relative ${
                      isCurrentUser
                        ? "bg-emerald-500/10 dark:bg-primary/10 border border-emerald-500/20 text-slate-900 dark:text-white font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-white/[0.04] border border-transparent"
                    }`}
                    style={isCurrentUser ? { boxShadow: "inset 0 0 20px rgba(16, 185, 129, 0.15)" } : {}}
                  >
                    {/* Rank */}
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-600 dark:text-white/60">
                      {isCurrentUser ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-primary">
                          <Flame className="w-4 h-4 text-emerald-500 dark:text-primary animate-pulse" />
                          #{item.rank} ({t('leaderboard.you')})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          {item.rank <= 3 ? <Medal className="w-4 h-4 text-amber-500 fill-amber-500/20" /> : <Star className="w-4 h-4 text-slate-300 dark:text-white/10" />}
                          #{item.rank}
                        </span>
                      )}
                    </td>

                    {/* Member Details */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {item.profilePictureUrl ? (
                          <img src={item.profilePictureUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-white/10" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-emerald-600 dark:text-primary font-black text-sm border border-primary/25">
                            {item.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-800 dark:text-white text-sm">{item.name}</div>
                          <span className="text-[10px] text-slate-500 dark:text-white/40">{item.npm || "Pengurus"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${levelData.color}`}>
                        {levelData.levelName} • Lvl {levelData.currentLevel}
                      </span>
                    </td>

                    {/* relative XP Progress */}
                    <td className="px-6 py-5 w-60">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-white/60">
                          <span className="flex items-center gap-1 font-mono">
                            <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-current" />
                            {item.xp} XP
                          </span>
                          <span className="text-[9px] text-slate-400 dark:text-white/30">{Math.round(relativeProgressPercent)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                            style={{ width: `${relativeProgressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Rank Widget */}
      <AnimatePresence>
        {currentUserData && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50 pointer-events-none"
          >
            <div className="relative group pointer-events-auto">
              {/* Pulsing Border Effect */}
              <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-emerald-500 via-primary to-blue-500 opacity-30 group-hover:opacity-60 blur-md transition duration-500 animate-[pulse_2s_ease-in-out_infinite]" />
              
              <div className="relative bg-white/95 dark:bg-[#07130e]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 rounded-3xl shadow-[0_20px_50px_-15px_rgba(16,185,129,0.5)] flex items-center justify-between gap-4 hover:scale-[1.02] transition-transform duration-300">
                
                <div className="flex items-center gap-4">
                  {/* Badge Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-primary/10 border border-emerald-500/30 flex items-center justify-center relative shrink-0 shadow-inner">
                    <Flame className="w-7 h-7 text-emerald-500 fill-emerald-500/20 animate-pulse" />
                    <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-amber-400 text-amber-900 border-2 border-white dark:border-[#07130e] flex items-center justify-center font-black text-xs shadow-[0_0_10px_rgba(251,191,36,0.8)]">
                      #{currentUserData.rank}
                    </div>
                  </div>

                  <div className="flex flex-col min-w-[140px]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-0.5 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-500" /> {t('leaderboard.floating_rank')}
                    </span>
                    <span className="text-base font-black text-slate-800 dark:text-white leading-tight">{currentUserData.name}</span>
                  </div>
                </div>
                
                <div className="flex-grow max-w-[300px] text-right">
                  {xpToNextRank > 0 ? (
                    <div className="w-full flex flex-col items-end">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-2">
                        <ArrowUp className="w-3 h-3" /> {xpToNextRank} {t('leaderboard.floating_xp_needed')}
                      </div>
                      {/* Mini Progress Bar */}
                      <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden flex justify-end">
                        <div className="h-full bg-amber-500 animate-[pulse_2s_ease-in-out_infinite]" style={{ width: '75%' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)] w-max ml-auto">
                      <Crown className="w-3.5 h-3.5 fill-current animate-bounce" />
                      {t('leaderboard.floating_top_1')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sweep {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}} />
    </div>
  );
}
