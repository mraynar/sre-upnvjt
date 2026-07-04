"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Search, Star, Zap, Award, Flame, Medal } from "lucide-react";

export default function LeaderboardMemberClient({ initialLeaderboard, currentUserId }) {
  const [leaderboard] = useState(initialLeaderboard || []);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = leaderboard.filter(item =>
    (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.divisionName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const maxXP = leaderboard[0]?.xp || 100;

  // Group top 3 and others
  const top3 = filtered.filter(item => item.rank <= 3);
  const others = filtered.filter(item => item.rank > 3);

  // Sort top 3 to: [Silver (Rank 2), Gold (Rank 1), Bronze (Rank 3)] for visual podium centering
  const podiumList = [];
  const rank2 = top3.find(t => t.rank === 2);
  const rank1 = top3.find(t => t.rank === 1);
  const rank3 = top3.find(t => t.rank === 3);

  if (rank2) podiumList.push(rank2);
  if (rank1) podiumList.push(rank1);
  if (rank3) podiumList.push(rank3);

  const getLevelBadge = (level) => {
    if (level >= 31) return { label: "Forest", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" };
    if (level >= 16) return { label: "Tree", color: "bg-green-500/10 text-green-400 border-green-500/25" };
    if (level >= 6) return { label: "Sapling", color: "bg-teal-500/10 text-teal-400 border-teal-500/25" };
    return { label: "Seedling", color: "bg-blue-500/10 text-blue-400 border-blue-500/25" };
  };

  return (
    <div className="w-full relative pb-10 select-none">
      
      {/* Ambience glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-primary tracking-wide uppercase">
            Hall of Fame
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white mt-4 flex items-center gap-3">
            <Trophy className="w-9 h-9 text-amber-400 animate-bounce" />
            Peringkat Keaktifan
          </h1>
          <p className="text-white/50 max-w-xl font-medium text-sm mt-2 leading-relaxed">
            Daftar pengurus teraktif SRE UPNVJT dengan akumulasi perolehan poin keaktifan XP terbanyak sepanjang semester ini.
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Cari pengurus..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#08120e] border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 shadow-inner"
          />
        </div>
      </div>

      {/* Podium View */}
      {podiumList.length > 0 && (
        <div className="flex justify-center items-end gap-3 md:gap-8 mb-16 pt-16 px-4">
          {podiumList.map((item) => {
            const isGold = item.rank === 1;
            const isSilver = item.rank === 2;
            const isBronze = item.rank === 3;

            const heightClass = isGold ? "h-52 md:h-64" : isSilver ? "h-40 md:h-52" : "h-32 md:h-40";
            const bgClass = isGold 
              ? "from-amber-500/20 to-amber-600/5 border-amber-500/30" 
              : isSilver 
                ? "from-gray-400/20 to-gray-500/5 border-gray-400/30" 
                : "from-amber-700/20 to-amber-800/5 border-amber-700/30";
            const badgeLabel = isGold ? "1st" : isSilver ? "2nd" : "3rd";
            const textRankColor = isGold ? "text-amber-400" : isSilver ? "text-gray-300" : "text-amber-700";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: item.rank * 0.1 }}
                className="flex flex-col items-center w-24 md:w-36 relative"
              >
                {/* Profile Pic with border glow */}
                <div className="relative mb-6">
                  {item.profilePictureUrl ? (
                    <img
                      src={item.profilePictureUrl}
                      alt=""
                      className={`w-16 h-16 md:w-24 md:h-24 rounded-full object-cover border-4 ${
                        isGold ? "border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)]" : isSilver ? "border-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.2)]" : "border-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.2)]"
                      }`}
                    />
                  ) : (
                    <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center font-black text-xl border-4 ${
                      isGold ? "bg-amber-400/10 border-amber-400 text-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)]" : isSilver ? "bg-gray-400/10 border-gray-400 text-gray-300 shadow-[0_0_15px_rgba(156,163,175,0.2)]" : "bg-amber-700/10 border-amber-700 text-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.2)]"
                    }`}>
                      {item.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-black px-2 py-0.5 rounded-full border bg-[#050e0a] flex items-center gap-0.5 shadow-md ${
                    isGold ? "border-amber-400 text-amber-400" : isSilver ? "border-gray-400 text-gray-300" : "border-amber-700 text-amber-700"
                  }`}>
                    {isGold && <Star className="w-3 h-3 fill-current animate-spin" style={{ animationDuration: "3s" }} />}
                    {badgeLabel}
                  </span>
                </div>

                {/* Name */}
                <div className="text-center mb-3">
                  <div className="font-black text-white text-xs md:text-sm truncate w-24 md:w-32">{item.name}</div>
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-0.5 truncate w-24 md:w-32">{item.divisionName || "SRE Staff"}</div>
                </div>

                {/* Podium Pedestal */}
                <div className={`w-full ${heightClass} bg-gradient-to-b ${bgClass} border border-b-0 rounded-t-[28px] flex flex-col justify-end p-4 text-center shadow-2xl relative`}>
                  <div className="absolute inset-0 bg-grid-pattern opacity-5 rounded-t-[28px]" />
                  <div className="relative z-10">
                    <div className="text-2xl md:text-3xl font-black text-white flex items-center justify-center gap-1 font-mono">
                      <Zap className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0 animate-pulse" />
                      {item.xp}
                    </div>
                    <span className="text-[9px] font-black text-white/30 tracking-widest uppercase block mt-1">XP Points</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest mt-3 block ${textRankColor}`}>
                      {isGold ? "GOLD" : isSilver ? "SILVER" : "BRONZE"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Rankings List */}
      <div className="bg-[#08120e] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead className="border-b border-white/5 bg-white/[0.01]">
              <tr>
                {["Peringkat", "Anggota", "Divisi", "Liga Badge", "Kemajuan Relatif XP"].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-white/30 font-bold text-sm">
                    Tidak ada anggota ditemukan
                  </td>
                </tr>
              ) : filtered.map((item) => {
                const isCurrentUser = item.id === currentUserId;
                const badge = getLevelBadge(item.level);
                const relativeProgressPercent = Math.max(5, (item.xp / maxXP) * 100);

                return (
                  <tr
                    key={item.id}
                    className={`transition-all duration-300 ${
                      isCurrentUser
                        ? "bg-primary/10 border-y border-primary/20 text-white font-bold"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Rank */}
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-white/60">
                      {isCurrentUser ? (
                        <span className="flex items-center gap-1.5 text-primary">
                          <Flame className="w-4 h-4 text-primary animate-pulse" />
                          #{item.rank} (Kamu)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          {item.rank <= 3 ? <Medal className="w-4 h-4 text-amber-500 fill-amber-500/20" /> : <Star className="w-4 h-4 text-white/10" />}
                          #{item.rank}
                        </span>
                      )}
                    </td>

                    {/* Member Details */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {item.profilePictureUrl ? (
                          <img src={item.profilePictureUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-white/10" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/25">
                            {item.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white text-sm">{item.name}</div>
                          <span className="text-[10px] text-white/30">{item.npm || "Pengurus"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Division */}
                    <td className="px-6 py-5 text-sm text-white/60">
                      {item.divisionName || <span className="opacity-20">—</span>}
                    </td>

                    {/* Badge */}
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>
                        {badge.label} • Lvl {item.level}
                      </span>
                    </td>

                    {/* relative XP Progress */}
                    <td className="px-6 py-5 w-60">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-white/60">
                          <span className="flex items-center gap-1 font-mono">
                            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {item.xp} XP
                          </span>
                          <span className="text-[9px] text-white/30">{Math.round(relativeProgressPercent)}% dari top</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
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

    </div>
  );
}
