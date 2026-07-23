"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const InstagramIcon = (props) => (
  <svg className={`fill-current ${props.className || "w-4 h-4"}`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const LinkedinIcon = (props) => (
  <svg className={`fill-current ${props.className || "w-4 h-4"}`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TikTokIcon = (props) => (
  <svg className={`fill-current ${props.className || "w-4 h-4"}`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.27 8.27 0 004.83 1.55V6.82a4.85 4.85 0 01-1.06-.13z"/>
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
    label: "TikTok",
    href: "https://tiktok.com/@sre.upnvjt",
    Icon: TikTokIcon,
    aria: "SRE UPNVJT on TikTok",
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
    <div className="w-full flex flex-col mt-0 relative z-10">
      {/* Main Footer Body */}
      <footer className="bg-[#0bb37e] dark:bg-[#07130e] text-white/90 dark:text-white/70 border-transparent relative overflow-hidden pt-16 lg:pt-20 pb-6">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
          {/* Logo */}
          <Link href="/" className="mb-4" aria-label="SRE UPNVJT Home">
            <Image
              src="/images/logo.png"
              alt="SRE UPNVJT Logo"
              width={160}
              height={64}
              className="h-16 w-auto object-contain brightness-0 invert dark:brightness-0 dark:invert dark:opacity-40 opacity-90 hover:opacity-100 dark:hover:opacity-60 transition-opacity"
            />
          </Link>

          {/* Navigation Links — Large Font */}
          <nav className="mb-4 w-full" aria-label="Footer navigation">
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
                    className="text-lg md:text-xl font-bold tracking-wide text-white dark:text-gray-200 hover:text-yellow-300 dark:hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Media Links — Large Icons */}
          <div className="flex justify-center items-center gap-8 mb-6">
            {SOCIAL_LINKS.map(({ label, href, Icon, aria: ariaLabel }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                aria-label={ariaLabel}
                className="text-white/80 hover:text-yellow-300 dark:text-gray-400 dark:hover:text-emerald-400 transition-all duration-300 transform hover:scale-110"
              >
                <Icon className="w-8 h-8" />
              </a>
            ))}
          </div>

          {/* Bottom Copyright */}
          <div className="text-[12px] text-white/60 dark:text-gray-500 font-medium">
            © {new Date().getFullYear()} Society of Renewable Energy UPN Veteran Jawa Timur. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Wave transition SVG */}
      <div className="w-full leading-[0] pointer-events-none select-none bg-transparent relative z-20">
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isLight ? "#a8f0d0" : "#1a3d2e"} />
              <stop offset="100%" stopColor={isLight ? "#6ee7b7" : "#0f2a1f"} />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isLight ? "#6ee7b7" : "#0f2a1f"} />
              <stop offset="100%" stopColor={isLight ? "#34d399" : "#07130e"} />
            </linearGradient>
          </defs>
          <path d="M0 80 C 360 20, 720 140, 1080 60 C 1260 20, 1380 80, 1440 50 L1440 160 L0 160 Z" fill="url(#waveGrad1)" opacity="0.7" />
          <path d="M0 100 C 300 50, 700 140, 1000 80 C 1200 30, 1360 100, 1440 70 L1440 160 L0 160 Z" fill="url(#waveGrad2)" />
        </svg>
      </div>

    </div>
  );
}
