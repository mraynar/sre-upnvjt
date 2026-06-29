"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Trophy, ClipboardCheck, FolderKanban, Menu, X, 
  ChevronDown, LogOut, Bell, User, Star, Settings, Award
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function MemberNavbarClient({ user, profile }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [academicDropdownOpen, setAcademicDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const academicRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (academicRef.current && !academicRef.current.contains(event.target)) {
        setAcademicDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on path changes
  useEffect(() => {
    setIsOpen(false);
    setAcademicDropdownOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Beranda", href: "/member" },
    { name: "Tugas", href: "/member/tugas", icon: FolderKanban },
    { name: "Leaderboard", href: "/member/leaderboard", icon: Trophy },
    { name: "Absensi", href: "/member/absensi", icon: ClipboardCheck },
  ];

  const getLevelBadge = (level) => {
    if (level >= 31) return { label: "Forest", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    if (level >= 16) return { label: "Tree", color: "bg-green-500/10 text-green-400 border-green-500/20" };
    if (level >= 6) return { label: "Sapling", color: "bg-teal-500/10 text-teal-400 border-teal-500/20" };
    return { label: "Seedling", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
  };

  const badge = getLevelBadge(profile?.level || 1);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-[#07130e]/80 border-b border-white/5 backdrop-blur-md shadow-xl" 
        : "bg-[#07130e]/40 border-b border-transparent backdrop-blur-xs"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/member" className="flex items-center gap-2 group">
              <div 
                className="h-12 w-36 bg-primary dark:bg-white transition-all duration-300" 
                style={{ 
                  WebkitMaskImage: "url(/images/logo.png)", 
                  WebkitMaskSize: "contain", 
                  WebkitMaskRepeat: "no-repeat", 
                  WebkitMaskPosition: "left center", 
                  maskImage: "url(/images/logo.png)", 
                  maskSize: "contain", 
                  maskRepeat: "no-repeat", 
                  maskPosition: "left center" 
                }}
              />
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/25 text-primary font-bold px-2 py-0.5 rounded-md">
                Member
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Beranda Link */}
            <Link 
              href="/member"
              className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
                pathname === "/member" 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              Beranda
            </Link>

            {/* Academic Dropdown */}
            <div className="relative" ref={academicRef}>
              <button
                onClick={() => setAcademicDropdownOpen(!academicDropdownOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 border ${
                  pathname.startsWith("/member/literatur") || pathname.startsWith("/member/materi")
                    ? "bg-primary/10 text-primary border-primary/20" 
                    : "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
                }`}
              >
                Academic
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${academicDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {academicDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-56 rounded-2xl bg-[#08120e] border border-white/5 shadow-2xl p-2 z-[60] overflow-hidden"
                  >
                    <Link
                      href="/member/literatur"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                        pathname.startsWith("/member/literatur")
                          ? "bg-primary/20 text-primary"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      Bank Literatur
                    </Link>
                    <Link
                      href="/member/materi"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                        pathname.startsWith("/member/materi")
                          ? "bg-primary/20 text-primary"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <FolderKanban className="w-4 h-4" />
                      Modul PPT
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other links */}
            {navLinks.slice(1).map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link 
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Section (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Notification Bell (Visual only) */}
            <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl pl-3 pr-4 py-1.5 text-left transition-all"
              >
                {user?.profilePictureUrl || user?.image ? (
                  <img
                    src={user.profilePictureUrl || user.image}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-sm text-primary">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="max-w-[100px]">
                  <p className="text-xs font-black text-white truncate">{user?.name?.split(" ")[0]}</p>
                  <p className="text-[9px] font-bold text-primary tracking-wide">Lv. {profile?.level || 1} {badge.label}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/50" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 rounded-3xl bg-[#08120e] border border-white/5 shadow-2xl p-4 z-[60] overflow-hidden"
                  >
                    {/* User summary details */}
                    <div className="pb-4 mb-4 border-b border-white/5 flex items-center gap-3">
                      {user?.profilePictureUrl || user?.image ? (
                        <img
                          src={user.profilePictureUrl || user.image}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-lg text-primary">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-black text-white leading-none mb-1">{user?.name}</h4>
                        <p className="text-xs text-white/40 truncate w-40">{user?.email}</p>
                      </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-1.5 text-white/60">
                        <span>XP: {profile?.xp || 0}</span>
                        <span>Lvl {profile?.level || 1}</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                          style={{ width: `${Math.min(((profile?.xp || 0) % 100), 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-1 mb-4">
                      <Link
                        href="/member/profil"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-white/70 hover:bg-white/5 hover:text-white transition-all"
                      >
                        <User className="w-4 h-4 text-primary" />
                        Detail Profil
                      </Link>
                      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-white/70">
                        <span className="flex items-center gap-3">
                          <Star className="w-4 h-4 text-emerald-400" />
                          Tema
                        </span>
                        <ThemeToggle />
                      </div>
                    </div>

                    {/* Sign out */}
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-red-400 bg-red-500/10 border border-red-500/15 hover:bg-red-500/25 font-bold transition-all text-xs"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Hamburger menu button (Mobile) */}
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-white/5 text-white/70 hover:text-white transition-all border border-white/5"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#07130e] border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link
                href="/member"
                className={`block px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                  pathname === "/member" ? "bg-primary/20 text-primary" : "text-white/70 hover:bg-white/5"
                }`}
              >
                Beranda
              </Link>
              
              <div className="px-4 py-2 text-xs font-black uppercase tracking-widest text-white/30 border-t border-white/5 mt-2 pt-4">
                Academic Pages
              </div>
              <Link
                href="/member/literatur"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                  pathname.startsWith("/member/literatur") ? "bg-primary/20 text-primary" : "text-white/70 hover:bg-white/5"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Bank Literatur
              </Link>
              <Link
                href="/member/materi"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                  pathname.startsWith("/member/materi") ? "bg-primary/20 text-primary" : "text-white/70 hover:bg-white/5"
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                Modul PPT
              </Link>

              <div className="h-[1px] bg-white/5 my-2" />

              {navLinks.slice(1).map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                      isActive ? "bg-primary/20 text-primary" : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* User settings details (Mobile) */}
              <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3 px-4">
                  {user?.profilePictureUrl || user?.image ? (
                    <img
                      src={user.profilePictureUrl || user.image}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-sm text-primary">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-black text-white">{user?.name}</h4>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Level {profile?.level || 1} • {badge.label}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 px-2">
                  <Link
                    href="/member/profil"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                  >
                    <User className="w-4 h-4" />
                    Profil
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/15 hover:bg-red-500/20 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}
