"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Mail } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Articles", href: "/articles" },
  { label: "Merchandise", href: "/merchandise" },
];

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.387.51a3.003 3.003 0 00-2.11 2.108C0 8.025 0 12 0 12s0 3.975.503 5.837a3.003 3.003 0 002.11 2.108c1.862.51 9.387.51 9.387.51s7.525 0 9.387-.51a3.003 3.003 0 002.11-2.108C24 15.975 24 12 24 12s0-3.975-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com/sre.upnvjt",
    Icon: InstagramIcon,
    aria: "Follow SRE UPNVJT on Instagram",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/sre-upnvjt",
    Icon: LinkedinIcon,
    aria: "SRE UPNVJT on LinkedIn",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@sreupnvjt",
    Icon: YoutubeIcon,
    aria: "SRE UPNVJT on YouTube",
  },
  {
    label: "Email",
    href: "mailto:sre.upnjatim@gmail.com",
    Icon: Mail,
    aria: "Send an email to SRE UPNVJT",
  },
];

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Footer() {
  const pathname = usePathname();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const isLight = mounted && (theme === "light" || resolvedTheme === "light");

  const adminRoutes = ["/dashboard", "/roles", "/users", "/departments", "/activities", "/merch", "/settings"];
  const isDashboardRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));
  if (pathname === "/login" || isDashboardRoute) return null;

  return (
    <div className="w-full flex flex-col mt-auto relative z-10">
      {/* Main Footer Body */}
      <footer className="bg-white dark:bg-[#07130e] text-[#07130e]/70 dark:text-white/70 border-t border-slate-200 dark:border-transparent relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-16 pb-10 relative z-10"
        >
          {/* Top grid — 4 columns on desktop, 2 on tablet, 1 on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14 border-b border-[#07130e]/10 dark:border-white/8 pb-14">

            {/* Col 1 — Logo + Tagline + Copyright */}
            <motion.div variants={fadeUp} className="flex flex-col gap-5 lg:col-span-1">
              <Link href="/" aria-label="SRE UPNVJT Home" className="w-fit focus-visible:outline-offset-4">
                <Image
                  src="/images/logo.png"
                  alt="SRE UPNVJT Logo"
                  width={120}
                  height={48}
                  className="h-12 w-auto object-contain dark:brightness-0 dark:invert opacity-90 hover:opacity-100 transition-opacity"
                  priority={false}
                />
              </Link>
              <p className="text-[13px] font-light text-[#07130e]/60 dark:text-white/50 leading-relaxed max-w-[200px]">
                Accelerating the Green Transition in East Java and beyond.
              </p>
              <div className="flex items-start gap-2 text-[11px] text-[#07130e]/40 dark:text-white/30 font-medium mt-auto">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>Surabaya, Jawa Timur<br />Indonesia</span>
              </div>
            </motion.div>

            {/* Col 2 — Quick Navigation */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#07130e]/40 dark:text-white/30 mb-1">
                Navigation
              </span>
              <nav aria-label="Footer navigation">
                <ul className="flex flex-col gap-3">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`text-[14px] font-medium transition-colors duration-200 group flex items-center gap-2 w-fit focus-visible:outline-primary ${
                            isActive ? "text-primary" : "text-[#07130e]/60 dark:text-white/60 hover:text-[#07130e] dark:hover:text-white"
                          }`}
                        >
                          <span className={`w-4 h-[1px] bg-current transition-all duration-300 ${isActive ? "w-6" : "group-hover:w-6"}`} aria-hidden="true" />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>

            {/* Col 3 — Social Links */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#07130e]/40 dark:text-white/30 mb-1">
                Connect
              </span>
              <ul className="flex flex-col gap-3">
                {SOCIAL_LINKS.map(({ label, href, Icon, aria: ariaLabel }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                      aria-label={ariaLabel}
                      className="text-[14px] font-medium text-[#07130e]/60 dark:text-white/60 hover:text-primary transition-colors duration-200 flex items-center gap-3 group w-fit focus-visible:outline-primary"
                    >
                      <span className="w-8 h-8 rounded-full bg-[#07130e]/5 dark:bg-white/5 border border-slate-200 dark:border-white/8 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-[#07130e] transition-all duration-300 group-hover:scale-110 shrink-0">
                        <Icon />
                      </span>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Col 4 — About SRE */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#07130e]/40 dark:text-white/30 mb-1">
                About SRE
              </span>
              <p className="text-[13px] text-[#07130e]/50 dark:text-white/40 leading-relaxed font-light">
                Society of Renewable Energy (SRE) is a national student network dedicated to accelerating Indonesia&apos;s clean energy transition.
              </p>
              <a
                href="https://sre.co.id"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 inline-flex items-center gap-2 text-[12px] font-bold tracking-widest uppercase text-primary hover:text-primary-focus dark:hover:text-[#e8ecc4] transition-colors group w-fit focus-visible:outline-primary"
                aria-label="Visit SRE Indonesia national website"
              >
                SRE Indonesia
                <span className="w-4 h-4 rounded-full border border-primary/40 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-[#07130e] transition-all duration-300 text-[8px]" aria-hidden="true">
                  ↗
                </span>
              </a>
            </motion.div>
          </div>

          {/* Bottom bar — copyright */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[12px] text-[#07130e]/30 dark:text-white/25"
          >
            <span>© {new Date().getFullYear()} Society of Renewable Energy UPN Veteran Jawa Timur. All rights reserved.</span>
            <span className="font-mono tracking-wider">SRE UPNVJT</span>
          </motion.div>
        </motion.div>
      </footer>

      {/* Wave transition SVG — placed at the very bottom of the page */}
      <div className="w-full leading-[0] pointer-events-none select-none bg-white dark:bg-[#07130e]">
        <svg
          viewBox="0 0 1440 240"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[120px] md:h-auto block"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isLight ? "#ffffff" : "#d3e0d8"} />
              <stop offset="100%" stopColor={isLight ? "#ecfdf5" : "#b2c0b9"} />
            </linearGradient>
            <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isLight ? "#ecfdf5" : "#b2c0b9"} />
              <stop offset="100%" stopColor={isLight ? "#d1fae5" : "#0f3036"} />
            </linearGradient>
            <linearGradient id="hillGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isLight ? "#d1fae5" : "#0f3036"} />
              <stop offset="100%" stopColor={isLight ? "#a7f3d0" : "#07130e"} />
            </linearGradient>
          </defs>
          <path d="M-50 180 C 250 100, 500 210, 800 130 C 1100 50, 1300 140, 1500 90 L 1500 240 L -50 240 Z" fill="url(#hillGrad1)" opacity="0.8" />
          <path d="M-50 200 C 300 150, 700 230, 1000 160 C 1250 90, 1350 170, 1500 130 L 1500 240 L -50 240 Z" fill="url(#hillGrad2)" />
          <path d="M-50 220 C 400 180, 800 240, 1100 190 C 1280 150, 1380 200, 1500 170 L 1500 240 L -50 240 Z" fill="url(#hillGrad3)" />
        </svg>
      </div>
    </div>
  );
}
