"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Mail } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { MapPin, Mail, Instagram, Linkedin, Youtube } from "lucide-react";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com/sre.upnvjt",
    Icon: Instagram,
    aria: "Follow SRE UPNVJT on Instagram",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/sre-upnvjt",
    Icon: Linkedin,
    aria: "SRE UPNVJT on LinkedIn",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@sreupnvjt",
    Icon: Youtube,
    aria: "SRE UPNVJT on YouTube",
  },
  {
    label: "Email",
    href: "mailto:sre.upnjatim@gmail.com",
    Icon: Mail,
    aria: "Send an email to SRE UPNVJT",
  },
];

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
      <footer className="bg-white dark:bg-[#07130e] text-[#07130e]/70 dark:text-white/70 border-t border-slate-200 dark:border-transparent relative overflow-hidden py-16">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
          {/* Logo */}
          <Link href="/" className="mb-8" aria-label="SRE UPNVJT Home">
            <Image
              src="/images/logo.png"
              alt="SRE UPNVJT Logo"
              width={160}
              height={64}
              className="h-16 w-auto object-contain dark:brightness-0 dark:invert opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>

          {/* Navigation Links — Large Font */}
          <nav className="mb-8 w-full" aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-4">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Activity", href: "/activity" },
                { label: "Articles", href: "/articles" },
                { label: "Merchandise", href: "/merchandise" }
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-lg md:text-xl font-bold tracking-wide text-gray-700 dark:text-gray-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Media Links — Large Icons */}
          <div className="flex justify-center items-center gap-8 mb-10">
            {SOCIAL_LINKS.map(({ label, href, Icon, aria: ariaLabel }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                aria-label={ariaLabel}
                className="text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 transition-all duration-300 transform hover:scale-110"
              >
                <Icon className="w-8 h-8" />
              </a>
            ))}
          </div>

          {/* Bottom Copyright */}
          <div className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">
            © {new Date().getFullYear()} Society of Renewable Energy UPN Veteran Jawa Timur. All rights reserved.
          </div>
        </div>
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
