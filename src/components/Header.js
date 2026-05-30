"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Monitor scroll to update header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Activity", path: "/activity" },
    { name: "Article", path: "/article" },
    { name: "Student", path: "/student" },
    { name: "Merchandise", path: "/merchandise" },
  ];

  return (
    <>
      {/* 1. Global Navigation Bar (frosted glass, highly animated) */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0a1f18]/80 border-b border-white/5 text-white backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : "bg-transparent border-b border-transparent text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo Left */}
          <Link href="/" passHref legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 select-none group font-display font-bold text-[28px] tracking-tight"
            >
              SRE
              <span className="text-primary-on-dark font-light -ml-1.5">.</span>
            </motion.a>
          </Link>

          {/* Links Center */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive =
                pathname === item.path ||
                (pathname.startsWith(item.path) && item.path !== "/");
              return (
                <Link key={item.name} href={item.path} passHref legacyBehavior>
                  <a className="relative text-[14px] font-medium tracking-wide transition-colors duration-300">
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${isActive ? "text-white font-semibold" : "text-white/80 hover:text-white transition-colors"}`}
                    >
                      {item.name}
                    </span>
                  </a>
                </Link>
              );
            })}
          </div>

          {/* Right Section: Action Pill Button */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/#join" passHref legacyBehavior>
              <motion.a
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#ffffff",
                  color: "#0a1f18",
                }}
                whileTap={{ scale: 0.95 }}
                className="border border-white/30 text-white text-[14px] font-semibold tracking-tight rounded-full px-6 py-2.5 transition-all duration-300 flex items-center gap-2 group shadow-lg"
              >
                Join Us
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </motion.a>
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-20 z-30 bg-[#0a1f18]/95 backdrop-blur-2xl text-white px-8 py-12 flex flex-col gap-8 md:hidden border-t border-white/5"
          >
            <motion.div
              initial="initial"
              animate="animate"
              variants={{
                initial: { opacity: 0 },
                animate: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                },
              }}
              className="flex flex-col gap-8"
            >
              {navItems.map((item) => {
                const isActive =
                  pathname === item.path ||
                  (pathname.startsWith(item.path) && item.path !== "/");
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    passHref
                    legacyBehavior
                  >
                    <motion.a
                      variants={{
                        initial: { opacity: 0, x: -20 },
                        animate: { opacity: 1, x: 0 },
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-[32px] font-display font-semibold tracking-tight transition-colors duration-200 ${
                        isActive
                          ? "text-primary-on-dark"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </motion.a>
                  </Link>
                );
              })}
            </motion.div>

            <Link href="/#join" passHref legacyBehavior>
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-white text-[#0a1f18] text-center text-[18px] font-bold tracking-tight rounded-full py-4 mt-8 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group"
              >
                Join Us{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
