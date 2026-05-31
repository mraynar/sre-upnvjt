"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Lock, 
  Save, 
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Settings,
  Mail,
  BadgeIcon,
  Shield
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsClient({ user }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
    npm: user.npm || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (res.ok) {
        setProfileMessage({ type: "success", text: "Profile updated successfully!" });
        router.refresh();
      } else {
        setProfileMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch (error) {
      setProfileMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSavingPassword(true);
    setPasswordMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      setIsSavingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters." });
      setIsSavingPassword(false);
      return;
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordMessage({ type: "error", text: data.error || "Failed to change password." });
      }
    } catch (error) {
      setPasswordMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">Settings</h1>
        <p className="text-white/60">Manage your account preferences and security.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-3 backdrop-blur-xl flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all ${
                activeTab === "profile" 
                  ? "bg-primary text-[#050e0a]" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <User className="w-4 h-4" />
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all ${
                activeTab === "password" 
                  ? "bg-primary text-[#050e0a]" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Lock className="w-4 h-4" />
              Security & Password
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-2">Profile Details</h2>
                    <p className="text-white/50 text-sm">Update your personal information and contact details.</p>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/50 font-bold">Full Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/50 font-bold">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            required
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 max-w-[50%]">
                      <label className="text-xs uppercase tracking-widest text-white/50 font-bold">NPM (Nomor Induk Mahasiswa)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                          <BadgeIcon className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={profileData.npm}
                          onChange={(e) => setProfileData({...profileData, npm: e.target.value})}
                          placeholder="Optional"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mt-8">
                      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" /> Role Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Current Role</p>
                          <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-md text-xs font-bold tracking-widest uppercase border border-primary/30">
                            {user.roleName}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Department</p>
                          <p className="text-sm text-white font-medium">{user.departmentName}</p>
                        </div>
                      </div>
                    </div>

                    {profileMessage && (
                      <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${profileMessage.type === 'success' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {profileMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
                        {profileMessage.text}
                      </div>
                    )}

                    <div className="pt-4 flex justify-end border-t border-white/10">
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="bg-primary hover:bg-primary-focus text-[#050e0a] px-8 py-3 rounded-xl font-bold tracking-wide flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {isSavingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* PASSWORD TAB */}
              {activeTab === "password" && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-2">Change Password</h2>
                    <p className="text-white/50 text-sm">Ensure your account is using a long, random password to stay secure.</p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/50 font-bold">Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/50 font-bold">New Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/50 font-bold">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                      />
                    </div>

                    {passwordMessage && (
                      <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${passwordMessage.type === 'success' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {passwordMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
                        {passwordMessage.text}
                      </div>
                    )}

                    <div className="pt-4 flex justify-end border-t border-white/10">
                      <button
                        type="submit"
                        disabled={isSavingPassword}
                        className="bg-primary hover:bg-primary-focus text-[#050e0a] px-8 py-3 rounded-xl font-bold tracking-wide flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {isSavingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                        Update Password
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
