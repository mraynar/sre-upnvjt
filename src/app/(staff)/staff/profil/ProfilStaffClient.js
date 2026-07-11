"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Shield, CheckCircle2, 
  UploadCloud, Settings, Edit2, X,
  Lock, Camera, Activity, Server, Zap
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilStaffClient({ user }) {
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
    npm: user.npm || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        notify("error", "Masukkan password saat ini untuk keamanan!");
        return;
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        notify("error", "Konfirmasi password baru tidak cocok!");
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui profil");
      
      notify("success", "Profil berhasil diperbarui!");
      setModal(false);
      router.refresh();
    } catch (err) {
      notify("error", err.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] mt-20 pt-8 bg-slate-50 dark:bg-[#08120e] p-4 md:p-8 relative overflow-hidden font-sans">
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              notification.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
            }`}
          >
            {notification.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <p className="font-bold">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/60 dark:bg-[#08120e]/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden group"
        >
          {/* Decorative Glow Removed */}
          
          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] blur-xl opacity-40 animate-pulse" />
              <div className="relative w-40 h-40 rounded-[2rem] bg-slate-100 dark:bg-black/50 border-4 border-white dark:border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
                {user.profilePictureUrl ? (
                  <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-slate-400 dark:text-white/20" />
                )}
                
                {/* Floating Badges */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white dark:border-[#0a1610] text-white">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">
                  <Server className="w-3.5 h-3.5" /> Akses Staff
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  {user.name}
                </h1>
                <p className="text-lg text-slate-500 dark:text-white/50 font-medium">
                  {user.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-slate-700 dark:text-white/70">{user.roleName || "Staff"}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold text-slate-700 dark:text-white/70">{user.departmentName || "General"}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModal(true)}
              className="lg:self-start flex items-center gap-2 px-6 py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-[0_6px_0_0_#047857] hover:shadow-[0_2px_0_0_#047857] hover:translate-y-[4px] transition-all active:shadow-none active:translate-y-[6px]"
            >
              <Edit2 className="w-5 h-5" />
              Edit Profil
            </motion.button>
          </div>
        </motion.div>

        {/* Info Cards (Removed as requested) */}

      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal(false)}
              className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0a1610] border border-slate-200 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                      <Settings className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Pengaturan Akun</h2>
                  </div>
                  <button
                    onClick={() => setModal(false)}
                    className="p-2 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-white/80">Nama Lengkap</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        required
                      />
                    </div>

                    <div className="space-y-1.5 opacity-60">
                      <label className="text-sm font-bold text-slate-700 dark:text-white/80">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        readOnly
                        className="w-full p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white/50 cursor-not-allowed"
                        required
                      />
                      <p className="text-xs text-slate-500 dark:text-white/40">Email tidak dapat diubah.</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 mt-6 mb-4">
                      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-500" /> Keamanan Sandi
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-white/80">Password Saat Ini</label>
                      <input
                        type="password"
                        placeholder="Wajib diisi jika ingin mengganti sandi"
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-white/80">Password Baru</label>
                        <input
                          type="password"
                          placeholder="Sandi baru"
                          value={profileData.newPassword}
                          onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                          className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-white/80">Konfirmasi Sandi Baru</label>
                        <input
                          type="password"
                          placeholder="Ulangi sandi baru"
                          value={profileData.confirmPassword}
                          onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                          className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setModal(false)}
                      className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold shadow-[0_4px_0_0_#047857] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#047857] active:shadow-none active:translate-y-[4px] disabled:opacity-50 transition-all"
                    >
                      {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
