"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Shield, BookOpen, Layers, Award, Clock,
  UploadCloud, Settings, Edit2, X, CheckCircle2, XCircle,
  ExternalLink, FileText, Check, AlertTriangle, Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const LEVEL_METADATA = {
  Seedling: { name: "Seedling", label: "Pangkat Baru", desc: "Level 1-5. Terus kerjakan kuis dan tugas!", color: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400" },
  Sapling:  { name: "Sapling", label: "Tunas Aktif", desc: "Level 6-15. Kontribusi kamu mulai terlihat!", color: "from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-400" },
  Tree:     { name: "Tree", label: "Pohon Kuat", desc: "Level 16-30. Mentor andalan bagi divisi!", color: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400" },
  Forest:   { name: "Forest", label: "Hutan Pengaruh", desc: "Level 31+. Pengurus legendaris SRE UPNVJT!", color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400" },
};

export default function ProfilClient({ user, recentTasks, recentQuizzes }) {
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
    npm: user.npm || "",
    profilePictureUrl: user.profilePictureUrl || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const xp = user.xp || 0;
  const level = user.level || 1;
  const levelProgress = xp % 100;

  let levelKey = "Seedling";
  if (level >= 6 && level <= 15) levelKey = "Sapling";
  else if (level >= 16 && level <= 30) levelKey = "Tree";
  else if (level >= 31) levelKey = "Forest";

  const levelMeta = LEVEL_METADATA[levelKey];

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { notify("error", "Harap pilih file gambar"); return; }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "profiles");
    setIsLoading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setProfileData(p => ({ ...p, profilePictureUrl: data.url }));
        notify("success", "Foto profil berhasil diunggah!");
      } else {
        notify("error", data.error || "Gagal mengunggah foto");
      }
    } catch {
      notify("error", "Terjadi kesalahan saat upload");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();
      if (res.ok) {
        notify("success", "Profil berhasil disimpan!");
        setModal(false);
        router.refresh();
      } else {
        notify("error", data.error || "Gagal memperbarui profil");
      }
    } catch {
      notify("error", "Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative pb-10">
      {/* Profile Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 items-stretch">
        <div className="lg:col-span-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Profile Picture */}
          <div className="relative shrink-0 select-none">
            {profileData.profilePictureUrl ? (
              <img src={profileData.profilePictureUrl} alt="" className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary shadow-[0_0_20px_rgba(16,185,129,0.25)]" />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary text-3xl font-black text-primary">
                {profileData.name?.charAt(0)}
              </div>
            )}
          </div>

          {/* User Bio Details */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white">{profileData.name}</h1>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">{profileData.email}</p>
              </div>
              <button
                onClick={() => setModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white/5 border border-white/5 hover:bg-white/10 text-primary rounded-xl cursor-pointer transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profil
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs text-gray-400">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">NPM</span>
                <span className="font-semibold text-white">{profileData.npm || "Belum diisi"}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Role / Jabatan</span>
                <span className="font-semibold text-white capitalize">{user.positionName || user.roleName?.replace("_", " ")}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Departemen</span>
                <span className="font-semibold text-white">{user.departmentName || "General"}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Divisi Kerja</span>
                <span className="font-semibold text-white">{user.divisionName || "SRE Staff"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level & Badge Card */}
        <div className={`bg-gradient-to-br border rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between ${levelMeta.color}`}>
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pangkat Kelas</span>
              <span className="text-xs font-black px-2 py-0.5 rounded border border-current">{levelMeta.name}</span>
            </div>
            <h2 className="text-3xl font-black mb-1">Level {level}</h2>
            <p className="text-[11px] leading-relaxed opacity-85 mt-2">{levelMeta.desc}</p>
          </div>

          <div className="mt-6 border-t border-white/5 pt-4">
            <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5 opacity-70">
              <span>{levelProgress} / 100 XP</span>
              <span>Total: {xp} XP</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${levelProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Activities Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Recent Tasks */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Tugas Terakhir
          </h2>
          {recentTasks.length === 0 ? (
            <p className="text-xs text-gray-500 py-10 text-center">Belum ada tugas yang dikumpulkan.</p>
          ) : (
            <div className="space-y-4">
              {recentTasks.map(tSub => (
                <div key={tSub.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center gap-4 text-xs">
                  <div>
                    <h3 className="font-bold text-white mb-1 line-clamp-1">{tSub.task?.title}</h3>
                    <div className="flex gap-2 text-[10px] text-gray-500 font-semibold">
                      <span>{new Date(tSub.submittedAt).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                    tSub.status === "APPROVED"
                      ? "bg-green-500/10 text-green-400 border-green-500/25"
                      : tSub.status === "REJECTED"
                      ? "bg-red-500/10 text-red-400 border-red-500/25"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                  }`}>
                    {tSub.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quizzes */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Hasil Kuis Terakhir
          </h2>
          {recentQuizzes.length === 0 ? (
            <p className="text-xs text-gray-500 py-10 text-center">Belum ada kuis yang diselesaikan.</p>
          ) : (
            <div className="space-y-4">
              {recentQuizzes.map(qSub => (
                <div key={qSub.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center gap-4 text-xs">
                  <div>
                    <h3 className="font-bold text-white mb-1 line-clamp-1">{qSub.quiz?.title}</h3>
                    <div className="flex gap-2 text-[10px] text-gray-500 font-semibold">
                      <span>{new Date(qSub.submittedAt).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">Score: {qSub.totalScore ?? qSub.mcqScore}%</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                      qSub.isPassed
                        ? "bg-green-500/10 text-green-400 border-green-500/25"
                        : "bg-red-500/10 text-red-400 border-red-500/25"
                    }`}>
                      {qSub.isPassed ? "Pass" : "Fail"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a1612] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Edit Data Profil
                </h2>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <form id="editProfileForm" onSubmit={handleSaveProfile} className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">Nama Lengkap *</label>
                    <input type="text" required value={profileData.name}
                      onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">Email Utama *</label>
                    <input type="email" required value={profileData.email}
                      onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))}
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">NPM / NIM *</label>
                    <input type="text" required value={profileData.npm}
                      onChange={e => setProfileData(p => ({ ...p, npm: e.target.value }))}
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">Foto Profil (URL atau Upload)</label>
                    <div className="flex gap-3 items-start">
                      {profileData.profilePictureUrl && (
                        <img src={profileData.profilePictureUrl} alt="" className="w-16 h-16 rounded-full object-cover shrink-0 border border-white/10 bg-gray-900" />
                      )}
                      <div className="flex-1 flex flex-col gap-2">
                        <input type="text" value={profileData.profilePictureUrl}
                          onChange={e => setProfileData(p => ({ ...p, profilePictureUrl: e.target.value }))}
                          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none" />
                        <label className={`relative overflow-hidden flex items-center gap-2 h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-500 hover:bg-white/10 transition-colors cursor-pointer ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <UploadCloud className="w-4 h-4 text-primary" /> Upload foto baru
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-white/[0.02]">
                <button type="button" onClick={() => setModal(false)} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 dark:text-white/70 hover:bg-white/10">Batal</button>
                <button type="submit" form="editProfileForm" disabled={isLoading}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-[#050e0a] hover:bg-primary-focus flex items-center gap-2">
                  {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "Simpan"}
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
