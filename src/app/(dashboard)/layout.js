"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Users, FileText, CheckSquare, Shield,
  Settings, LogOut, Menu, X, CreditCard, Box, ChevronLeft, ChevronRight, FolderKanban, ClipboardCheck, FolderOpen, Newspaper, Presentation, ShoppingBag
} from "lucide-react";

import { hasAccess } from "@/lib/permissions";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#07130e] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const role = session?.user?.roleName;

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard", module: "overview" },
    { name: "Users", icon: Users, href: "/users", module: "users" },
    { name: "Roles & Access", icon: Shield, href: "/roles", module: "roles" },
    { name: "Departments", icon: FileText, href: "/departments", module: "departments" },
    { name: "Projects", icon: FolderKanban, href: "/projects", module: "projects" },
    { name: "Attendance", icon: ClipboardCheck, href: "/attendance", module: "attendance" },
    { name: "Finances", icon: CreditCard, href: "/finance", module: "finance" },
    { name: "Inventory", icon: Box, href: "/inventory", module: "inventory" },
    { name: "Documents", icon: FolderOpen, href: "/documents", module: "documents" },
    { name: "Articles", icon: Newspaper, href: "/articles", module: "articles" },
    { name: "Activities", icon: Presentation, href: "/activities", module: "activities" },
    { name: "Merchandise", icon: ShoppingBag, href: "/merch", module: "merchandise" },
    { name: "Settings", icon: Settings, href: "/settings", module: "settings" },
  ];

  const allowedNavItems = navItems.filter(item => {
    if (item.module === "overview" || item.module === "settings") return true;
    return hasAccess(session?.user, item.module, "read");
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#050e0a]/80 backdrop-blur-2xl p-6 relative overflow-hidden rounded-3xl border border-white/10">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -left-20 top-20 w-40 h-40 bg-primary/20 blur-[100px] pointer-events-none" />

      {/* Brand */}
      <div className={`mb-12 flex items-center relative z-10 transition-all duration-300 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        <Link href="/" className="font-display font-black text-[28px] tracking-tighter text-white flex items-center gap-1 group">
          <img src="/images/logo.png" alt="SRE Logo" className="h-8 w-auto object-contain" />
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }} 
                animate={{ opacity: 1, width: "auto" }} 
                exit={{ opacity: 0, width: 0 }} 
                className="text-[10px] font-sans font-bold tracking-[0.2em] text-white/50 ml-3 uppercase border border-white/10 bg-white/5 px-2 py-1 rounded-md backdrop-blur-md whitespace-nowrap"
              >
                Portal
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {isMobileMenuOpen && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-white/50 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* User Info Card */}
      <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0, overflow: "hidden" }} 
            className="mb-10 p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 relative z-10 group"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            <div className="text-[15px] font-bold text-white mb-1 tracking-wide">{session?.user?.name}</div>
            <div className="text-[12px] text-white/40 mb-3 truncate">{session?.user?.email}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-1.5 rounded-md bg-primary/20 text-primary border border-primary/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                {role?.replace("_", " ") || "No Role"}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-1.5 rounded-md bg-white/10 text-white/70 border border-white/5">
                {session?.user?.departmentName || "No Dept"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2 pb-4">
        {!isSidebarCollapsed && <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 mb-4 pl-2 shrink-0">Menu</div>}
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-300 group relative overflow-hidden shrink-0 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              title={isSidebarCollapsed ? item.name : undefined}
            >
              {!isActive && <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
              <Icon className={`w-5 h-5 transition-colors duration-300 relative z-10 shrink-0 ${isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] scale-110' : 'group-hover:text-primary group-hover:scale-110'}`} />
              <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }} 
                    animate={{ opacity: 1, width: "auto" }} 
                    exit={{ opacity: 0, width: 0 }} 
                    className="relative z-10 whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={`mt-auto pt-6 border-t border-white/5 relative z-10 flex ${isSidebarCollapsed ? 'justify-center' : ''}`}>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={`flex items-center gap-4 py-3.5 rounded-xl text-[14px] font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group ${isSidebarCollapsed ? 'w-12 h-12 justify-center px-0' : 'w-full px-4'}`}
          title={isSidebarCollapsed ? "Logout Account" : undefined}
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" />
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }} 
                animate={{ opacity: 1, width: "auto" }} 
                exit={{ opacity: 0, width: 0 }} 
                className="whitespace-nowrap"
              >
                Logout Account
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-[100dvh] bg-[#020806] text-white overflow-hidden relative selection:bg-primary/30">
      {/* Decorative Blur */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Desktop Sidebar (Floating & Collapsible) */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 96 : 300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:block shrink-0 h-[calc(100vh-32px)] sticky top-4 z-40 shadow-[20px_0_40px_rgba(0,0,0,0.5)] m-4 rounded-3xl"
      >
        <SidebarContent />
        
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute top-12 -right-4 bg-[#112a20] border border-white/10 p-2 rounded-full text-white/70 hover:text-white hover:bg-primary/40 hover:border-primary/50 transition-all z-50 shadow-xl group flex items-center justify-center"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 group-hover:scale-110" />
          ) : (
            <ChevronLeft className="w-4 h-4 group-hover:scale-110" />
          )}
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 left-0 z-50 lg:hidden w-[280px] h-[100dvh]"
          >
            <div className="h-full w-full bg-[#050e0a]/95 backdrop-blur-3xl flex flex-col p-6 relative overflow-hidden border-r border-white/10">
              {/* Decorative Glow */}
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
              <div className="absolute -left-20 top-20 w-40 h-40 bg-primary/20 blur-[100px] pointer-events-none" />

              {/* Brand */}
              <div className="mb-12 flex items-center justify-between relative z-10">
                <Link href="/" className="font-display font-black text-[28px] tracking-tighter text-white flex items-center gap-1 group">
                  <img src="/images/logo.png" alt="SRE Logo" className="h-8 w-auto object-contain" />
                  <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-white/50 ml-3 uppercase border border-white/10 bg-white/5 px-2 py-1 rounded-md backdrop-blur-md whitespace-nowrap">
                    Portal
                  </span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Info Card */}
              <div className="mb-10 p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 relative z-10 shrink-0">
                <div className="text-[15px] font-bold text-white mb-1 tracking-wide">{session?.user?.name}</div>
                <div className="text-[12px] text-white/40 mb-3 truncate">{session?.user?.email}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-1.5 rounded-md bg-primary/20 text-primary border border-primary/20">
                    {role?.replace("_", " ") || "No Role"}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 flex flex-col gap-2 relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pb-4">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 mb-4 pl-2 shrink-0">Menu</div>
                {allowedNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 py-3.5 px-4 rounded-xl text-[14px] font-medium transition-all duration-300 ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/50'}`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                      <span className="whitespace-nowrap">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="mt-4 pt-6 border-t border-white/5 relative z-10 shrink-0 pb-6">
                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center gap-4 py-3.5 px-4 rounded-xl text-[14px] font-medium text-red-400/80 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span>Logout Account</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#050e0a]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="font-display font-bold text-xl tracking-tight flex items-center gap-1 text-white">
            <img src="/images/logo.png" alt="SRE Logo" className="h-8 w-auto object-contain" />
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-white/70">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
