"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Search, Star, Award, Zap, X, CheckCircle2, XCircle,
  Plus, AlertTriangle, ShieldAlert,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function LeaderboardClient({ initialLeaderboard, members, currentUser }) {
  const { data: session } = useSession();
  const user = session?.user ?? currentUser;
  const isSuperAdmin = user?.roleName === "SUPER_ADMIN";

  const [leaderboard, setLeaderboard] = useState(initialLeaderboard || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modal state
  const [modal, setModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenModal = () => {
    setUserId("");
    setAmount("");
    setReason("");
    setModal(true);
  };

  const handleAwardXp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/leaderboard/manual-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount: parseInt(amount), reason }),
      });

      const data = await res.json();
      if (res.ok) {
        notify("success", "XP berhasil diberikan secara manual!");
        setModal(false);
        // Refresh rankings from server
        const fresh = await fetch("/api/leaderboard");
        const freshData = await fresh.json();
        if (Array.isArray(freshData)) {
          setLeaderboard(freshData);
        }
      } else {
        notify("error", data.error || "Gagal memberikan XP");
      }
    } catch {
      notify("error", "Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter(item =>
    (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.divisionName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <Trophy className="w-8 h-8 text-primary animate-bounce" />
            Rankings & Leaderboard
          </h1>
          <p className="text-gray-500 dark:text-white/50 max-w-xl">
            Tinjau kontribusi dan perkembangan XP/Level seluruh anggota SRE UPNVJT.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
            <input
              type="text"
              placeholder="Cari anggota / divisi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none"
            />
          </div>
          {isSuperAdmin && (
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah XP Manual</span>
            </button>
          )}
        </div>
      </div>

      {/* Rankings List */}
      <div className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-lg">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b border-gray-200/50 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
              <tr>
                {["Rank", "Anggota", "Divisi", "Level", "XP Akumulatif"].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              <AnimatePresence>
                {filteredLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-white/30">
                        <Trophy className="w-10 h-10" />
                        <p className="font-medium">Belum ada data anggota</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredLeaderboard.map(item => {
                  const isTop3 = item.rank <= 3;
                  const rankColors = {
                    1: "bg-amber-400 text-gray-900 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]",
                    2: "bg-gray-300 text-gray-900 border-gray-200 shadow-[0_0_15px_rgba(209,213,219,0.4)]",
                    3: "bg-amber-700 text-white border-amber-600 shadow-[0_0_15px_rgba(180,83,9,0.4)]",
                  };
                  return (
                    <tr key={item.id} className="hover:bg-white/60 dark:hover:bg-white/[0.03] transition-all">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isTop3 ? (
                          <span className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-sm ${rankColors[item.rank]}`}>
                            {item.rank}
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-gray-400 pl-3">
                            #{item.rank}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.profilePictureUrl ? (
                            <img src={item.profilePictureUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-white/10" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
                              {item.name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</div>
                            <span className="text-[10px] text-gray-400 dark:text-white/30">{item.npm}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-white/60">
                        {item.divisionName || <span className="opacity-30">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 text-xs font-bold">
                          Lv. {item.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                          {item.xp} <span className="text-xs font-semibold text-gray-400">XP</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual XP Award Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Berikan XP Manual
                </h2>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <form id="awardXpForm" onSubmit={handleAwardXp} className="space-y-5">
                  <InputField label="Pilih Anggota *">
                    <select
                      required
                      value={userId}
                      onChange={e => setUserId(e.target.value)}
                      className="w-full h-12 px-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none"
                    >
                      <option value="">— Pilih Anggota —</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id.toString()}>{m.name}</option>
                      ))}
                    </select>
                  </InputField>

                  <InputField label="Jumlah XP (Bisa Negatif untuk Pengurangan) *">
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full h-12 px-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none"
                      placeholder="e.g. 50"
                    />
                  </InputField>

                  <InputField label="Alasan Pemberian *">
                    <input
                      type="text"
                      required
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      className="w-full h-12 px-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none"
                      placeholder="e.g. Panitia Aktif SRE Event 2026"
                    />
                  </InputField>
                </form>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50/50 dark:bg-white/[0.02]">
                <button type="button" onClick={() => setModal(false)} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10">Batal</button>
                <button type="submit" form="awardXpForm" disabled={isLoading}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-[#050e0a] hover:bg-primary-focus flex items-center gap-2">
                  {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "Berikan XP"}
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

const InputField = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">
      {label}
    </label>
    {children}
  </div>
);
