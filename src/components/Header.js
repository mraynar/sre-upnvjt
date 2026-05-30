"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Animated Hamburger Icon – Asymmetrical to X with hover effects
function HamburgerIcon({ isOpen, onClick, isLightBackground }) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle menu"
      className="md:hidden relative w-12 h-12 flex flex-col items-center justify-center z-[70] group rounded-full overflow-hidden"
    >
      {/* Glassmorphic background when open */}
      <div 
        className={`absolute inset-0 transition-all duration-500 rounded-full ${
          isOpen ? 'bg-white/10 backdrop-blur-md border border-white/20 scale-100' : 'bg-transparent scale-90'
        }`} 
      />
      
      {/* Lines container - right aligned */}
      <div className="relative w-6 h-[18px] flex flex-col justify-between items-end">
        {/* Top line - starts short (50%) */}
        <motion.span
          initial={false}
          animate={isOpen ? { rotate: 45, y: 8, width: "100%" } : { rotate: 0, y: 0, width: "50%" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`block h-[2px] rounded-full origin-center group-hover:w-full transition-all duration-300 group-hover:bg-primary drop-shadow-sm ${isLightBackground && !isOpen ? "bg-[#0a1f18]" : "bg-white"}`}
        />
        {/* Middle line - always full */}
        <motion.span
          initial={false}
          animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1, width: "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`block w-full h-[2px] rounded-full origin-center group-hover:bg-primary transition-colors drop-shadow-sm ${isLightBackground && !isOpen ? "bg-[#0a1f18]" : "bg-white"}`}
        />
        {/* Bottom line - starts medium (75%) */}
        <motion.span
          initial={false}
          animate={isOpen ? { rotate: -45, y: -8, width: "100%" } : { rotate: 0, y: 0, width: "75%" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`block h-[2px] rounded-full origin-center group-hover:w-full transition-all duration-300 group-hover:bg-primary drop-shadow-sm ${isLightBackground && !isOpen ? "bg-[#0a1f18]" : "bg-white"}`}
        />
      </div>
    </button>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Monitor scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Activity", path: "/activity" },
    { name: "Article", path: "/article" },
    { name: "Merchandise", path: "/merchandise" },
  ];

  const close = () => setMobileMenuOpen(false);

  // Hide header on login page
  if (pathname === "/login") return null;

  const isLightBackground = 
    (pathname.startsWith("/article") || pathname.startsWith("/merchandise/order")) && 
    !isScrolled;

  return (
    <>
      {/* Global Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0a1f18]/80 border-b border-white/5 text-white backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : `bg-transparent border-b border-transparent ${isLightBackground ? "text-[#0a1f18]" : "text-white"}`
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 select-none group font-display font-bold text-[28px] tracking-tight cursor-pointer z-[60] relative"
            >
              SRE
              <span className={`font-light -ml-1.5 ${isLightBackground ? "text-[#0a1f18]" : "text-primary-on-dark"}`}>.</span>
            </motion.div>
          </Link>

          {/* Desktop Links Center */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive =
                pathname === item.path ||
                (pathname.startsWith(item.path) && item.path !== "/");
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className="relative text-[14px] font-medium tracking-wide transition-colors duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full ${isLightBackground ? "bg-[#0a1f18]" : "bg-white"}`}
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative z-10 font-medium ${
                      isActive
                        ? (isLightBackground ? "text-[#0a1f18] font-bold" : "text-white font-bold")
                        : (isLightBackground ? "text-[#0a1f18]/70 hover:text-[#0a1f18] transition-colors" : "text-white/80 hover:text-white transition-colors")
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/login">
              <motion.div
                whileHover={isLightBackground ? { scale: 1.05, backgroundColor: "#0a1f18", color: "#e8ecc4" } : { scale: 1.05, backgroundColor: "#ffffff", color: "#0a1f18" }}
                whileTap={{ scale: 0.95 }}
                className={`border text-[14px] font-semibold tracking-tight rounded-full px-6 py-2.5 transition-all duration-300 flex items-center gap-2 group shadow-lg cursor-pointer ${isLightBackground ? "border-[#0a1f18]/30 text-[#0a1f18]" : "border-white/30 text-white"}`}
              >
                Login
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </motion.div>
            </Link>
          </div>

        </div>
      </motion.nav>

      <div className="fixed top-0 right-6 h-20 flex items-center z-[70] md:hidden">
        <HamburgerIcon
          isOpen={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((v) => !v)}
          isLightBackground={isLightBackground}
        />
      </div>

      {/* Premium Full-Screen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop blur layer */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={close}
              className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-sm"
            />

            {/* Menu Panel – slides in from top */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 top-0 z-50 md:hidden bg-[#07130e] min-h-screen flex flex-col px-7 pt-32 pb-12"
              style={{
                background:
                  "linear-gradient(160deg, #0a1f18 0%, #071410 60%, #0b1a10 100%)",
              }}
            >
              {/* Main Content Container */}
              <div className="flex-1 flex flex-col justify-center w-full px-2 relative z-10">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-[11px] font-bold tracking-[0.2em] text-[#e8ecc4]/60 uppercase mb-6 block"
                >
                  Navigation
                </motion.span>

                {/* Primary Links */}
                <nav className="flex flex-col gap-1">
                  {['Home', 'About', 'Merchandise'].map((name, i) => {
                    const item = navItems.find((n) => n.name === name);
                    if (!item) return null;
                    return (
                      <Link key={name} href={item.path} onClick={close}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="text-[52px] sm:text-[64px] font-display font-bold text-[#e8ecc4] tracking-tighter leading-[1.05] hover:text-white transition-colors cursor-pointer"
                        >
                          {name}
                        </motion.div>
                      </Link>
                    )
                  })}
                </nav>

                {/* Thin Divider */}
                <motion.div 
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[280px] h-px bg-[#e8ecc4]/20 my-10 origin-left"
                />

                {/* Secondary Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-6"
                >
                  {['Activity', 'Article'].map((name) => {
                    const item = navItems.find((n) => n.name === name);
                    if (!item) return null;
                    return (
                      <Link key={name} href={item.path} onClick={close}>
                        <span className="text-[13px] font-bold tracking-widest text-[#e8ecc4]/80 uppercase hover:text-[#e8ecc4] transition-colors cursor-pointer">
                          {name}
                        </span>
                      </Link>
                    )
                  })}
                </motion.div>
              </div>

              {/* Footer Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-auto flex justify-between items-end text-[#e8ecc4]/60 text-[11px] sm:text-[12px] px-2 relative z-10"
              >
                <div className="flex flex-col gap-1">
                  <span>Society of Renewable Energy</span>
                  <span>UPN Veteran Jawa Timur</span>
                </div>
                <div className="flex gap-5 font-bold tracking-wide">
                  <a href="https://instagram.com/sre.upnvjt" target="_blank" rel="noreferrer" className="hover:text-[#e8ecc4] transition-colors">Instagram</a>
                  <a href="https://linkedin.com/company/sre-upnvjt" target="_blank" rel="noreferrer" className="hover:text-[#e8ecc4] transition-colors">LinkedIn</a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
