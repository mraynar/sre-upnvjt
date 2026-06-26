"use client";
import React from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const adminRoutes = ["/dashboard", "/roles", "/users", "/departments", "/articles", "/activities", "/merch", "/settings"];
  const isDashboardRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));
  if (pathname === "/login" || isDashboardRoute) return null;

  // Determine the background color of the wave container based on the page's last section
  const getWaveBgColor = () => {
    if (pathname === "/") {
      return "bg-canvas";
    }
    if (pathname.startsWith("/articles")) {
      return "bg-[#07130e]";
    }
    return "bg-[#e8ecc4]";
  };

  return (
    <div className="w-full flex flex-col mt-auto relative z-10">
      <div className={`w-full leading-[0] pointer-events-none select-none ${getWaveBgColor()}`}>
        <svg
          viewBox="0 0 1440 240"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[120px] md:h-auto block"
        >
          <defs>
            <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d3e0d8" />
              <stop offset="100%" stopColor="#b2c0b9" />
            </linearGradient>
            <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#b2c0b9" />
              <stop offset="100%" stopColor="#0f3036" />
            </linearGradient>
            <linearGradient id="hillGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f3036" />
              <stop offset="100%" stopColor="#07130e" />
            </linearGradient>
          </defs>
          <path d="M-50 180 C 250 100, 500 210, 800 130 C 1100 50, 1300 140, 1500 90 L 1500 240 L -50 240 Z" fill="url(#hillGrad1)" opacity="0.8" />
          <path d="M-50 200 C 300 150, 700 230, 1000 160 C 1250 90, 1350 170, 1500 130 L 1500 240 L -50 240 Z" fill="url(#hillGrad2)" />
          <path d="M-50 220 C 400 180, 800 240, 1100 190 C 1280 150, 1380 200, 1500 170 L 1500 240 L -50 240 Z" fill="url(#hillGrad3)" />
        </svg>
      </div>

      <footer className="bg-[#07130e] text-white/70 py-12 px-6">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <h5 className="text-[20px] font-display font-bold tracking-tight text-white uppercase">
              SRE UPNVJT.
            </h5>
            <span className="text-[13px] font-normal text-white/50 text-center md:text-left">
              © 2026 Society of Renewable Energy UPN Veteran Jawa Timur. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-8 text-[14px] font-medium text-white/80">
            <a href="https://linkedin.com/company/sre-upnvjt" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="https://instagram.com/sre.upnvjt" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Instagram</a>
            <a href="mailto:sre.upnjatim@gmail.com" className="hover:text-primary transition-colors">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
