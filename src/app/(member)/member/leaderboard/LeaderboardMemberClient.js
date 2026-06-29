"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Search, Star, Zap, Award, Flame } from "lucide-react";

export default function LeaderboardMemberClient({ initialLeaderboard, currentUserId }) {
  const [leaderboard] = useState(initialLeaderboard || []);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = leaderboard.filter(item =>
    (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.divisionName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="w-full relative pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-white">
            <Trophy className="w-8 h-8 text-primary animate-pulse" />
            Hall of Fame
          </h1>
          <p className="text-gray-400 max-w-xl font-light">
            Pengurus teraktif SRE UPNVJT dengan akumulasi perolehan XP terbanyak sepanjang semester ini.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
          <input
            type="text"
            placeholder="Cari pengurus..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Podium View (Only shown if no query or matches include top3) */}
      {podiumList.length > 0 && (
        <div className="flex justify-center items-end gap-3 md:gap-8 mb-16 pt-10 px-4">
          {podiumList.map((item) => {
            const isGold = item.rank === 1;
            const isSilver = item.rank === 2;
            const isBronze = item.rank === 3;

            const heightClass = isGold ? "h-48 md:h-56" : isSilver ? "h-36 md:h-44" : "h-28 md:h-36";
            const colorClass = isGold ? "from-amber-400/20 to-amber-500/10 border-amber-400/40" : isSilver ? "from-gray-300/20 to-gray-400/10 border-gray-300/40" : "from-amber-700/20 to-amber-800/10 border-amber-700/40";
            const textRankColor = isGold ? "text-amber-400" : isSilver ? "text-gray-300" : "text-amber-700";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: item.rank * 0.1 }}
                className="flex flex-col items-center select-none w-24 md:w-36"
              >
                {/* Profile Pic with border glow */}
                <div className="relative mb-4">
                  {item.profilePictureUrl ? (
                    <img
                      src={item.profilePictureUrl}
                      alt=""
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 ${
                        isGold ? "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]" : isSilver ? "border-gray-300" : "border-amber-700"
                      }`}
                    />
                  ) : (
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                      isGold ? "bg-amber-400/10 border-amber-400 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]" : isSilver ? "bg-gray-300/10 border-gray-300 text-gray-300" : "bg-amber-700/10 border-amber-700 text-amber-700"
                    }`}>
                      {item.name?.charAt(0)}
                    </div>
                  )}
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-2 py-0.5 rounded-full border bg-[#050e0a] ${
                    isGold ? "border-amber-400 text-amber-400" : isSilver ? "border-gray-300 text-gray-300" : "border-amber-700 text-amber-700"
                  }`}>
                    #{item.rank}
                  </span>
                </div>

                {/* Name */}
                <div className="text-center mb-3">
                  <div className="font-bold text-white text-xs md:text-sm truncate w-24 md:w-32">{item.name}</div>
                  <div className="text-[10px] text-gray-500 font-semibold">{item.divisionName || "SRE Staff"}</div>
                </div>

                {/* Podium Pedestal */}
                <div className={`w-full ${heightClass} bg-gradient-to-b ${colorClass} border border-b-0 rounded-t-3xl flex flex-col justify-end p-4 text-center shadow-2xl`}>
                  <div className="relative">
                    <div className="text-xl md:text-2xl font-black text-white flex items-center justify-center gap-1">
                      <Zap className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
                      {item.xp}
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 tracking-wider uppercase block mt-1">Total XP</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest mt-2 block ${textRankColor}`}>
                      {isGold ? "GOLD" : isSilver ? "SILVER" : "BRONZE"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Rankings List for others */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b border-white/5 bg-white/[0.02]">
              <tr>
                {["Rank", "Anggota", "Divisi", "Badge Kelas", "XP Akumulatif"].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-500">
                    Tidak ada anggota ditemukan
                  </td>
                </tr>
              ) : filtered.map((item) => {
                const isCurrentUser = item.id === currentUserId;
                const badge = getLevelBadge(item.level);

                return (
                  <tr
                    key={item.id}
                    className={`transition-all ${
                      isCurrentUser
                        ? "bg-primary/10 border-y border-primary/20 text-white font-bold"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-400">
                      {isCurrentUser ? (
                        <span className="flex items-center gap-1 text-primary">
                          <Flame className="w-4 h-4 text-primary animate-pulse" />
                          #{item.rank}
                        </span>
                      ) : (
                        <span>#{item.rank}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.profilePictureUrl ? (
                          <img src={item.profilePictureUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
                            {item.name?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white text-sm">{item.name}</div>
                          <span className="text-[10px] text-gray-500">{item.npm}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {item.divisionName || <span className="opacity-30">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>
                        {badge.label} (Lv. {item.level})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-black text-white flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        {item.xp} <span className="text-xs font-semibold text-gray-500">XP</span>
                      </span>
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
