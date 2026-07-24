"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Users, Zap, Sun, Wind } from "lucide-react";
import { OrgTreeSection } from "@/components/organization/OrgComponents";

export default function DepartmentClient({ dept }) {
  if (!dept) {
    return (
      <div className="min-h-screen bg-[#0bb37e] dark:bg-[#07130e] text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-white/10 dark:bg-emerald-950/20 border border-white/20 dark:border-emerald-500/20 p-8 rounded-3xl shadow-xl">
          <Users className="w-12 h-12 mx-auto text-yellow-300 dark:text-emerald-400 mb-4 animate-bounce" />
          <h2 className="text-2xl font-black uppercase mb-2">Department Not Found</h2>
          <p className="text-sm text-emerald-50/70 dark:text-gray-400 mb-6">
            The requested organization department details could not be found or has not been created yet.
          </p>
          <a
            href="/about#structure"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-yellow-300 dark:bg-emerald-500 text-slate-950 font-black rounded-full text-xs tracking-widest uppercase hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO ABOUT
          </a>
        </div>
      </div>
    );
  }

  // Determine if the department has no members at all (empty state check)
  const hasDirector = !!dept.director;
  const hasDivisions = dept.divisions && dept.divisions.length > 0;
  const hasManagers = hasDivisions && dept.divisions.some(div => div.manager);
  const hasStaff = hasDivisions && dept.divisions.some(div => div.staff && div.staff.length > 0);
  const isEmpty = !hasDirector && !hasManagers && !hasStaff && dept.code?.toUpperCase() !== "EXE";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0bb37e] via-[#0aa373] to-[#099c6d] dark:from-[#07130e] dark:via-[#040e0a] dark:to-[#020805] text-white selection:bg-yellow-300 selection:text-slate-950 antialiased overflow-x-hidden relative pb-24">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
      
      {/* Floating Decorative Icons */}
      <div className="absolute top-[20%] right-[10%] opacity-[0.05] dark:opacity-[0.015] pointer-events-none select-none text-[#e8ecc4] dark:text-emerald-400 hidden lg:block z-0">
        <Sun className="w-12 h-12 animate-pulse" />
      </div>
      <div className="absolute top-[50%] left-[8%] opacity-[0.05] dark:opacity-[0.015] pointer-events-none select-none text-[#e8ecc4] dark:text-emerald-400 hidden lg:block z-0">
        <Zap className="w-10 h-10 animate-bounce" style={{ animationDuration: '4s' }} />
      </div>
      <div className="absolute top-[75%] right-[12%] opacity-[0.05] dark:opacity-[0.015] pointer-events-none select-none text-[#e8ecc4] dark:text-emerald-400 hidden lg:block z-0">
        <Wind className="w-12 h-12" />
      </div>
      
      {/* Wind Turbine Watermark (Left) */}
      <div className="absolute top-[30%] left-[2%] opacity-[0.08] dark:opacity-[0.02] pointer-events-none select-none text-[#e8ecc4] dark:text-emerald-500 hidden xl:block z-0">
        <svg width="200" height="400" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes spin-slow-turbine {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .turbine-spin-watermark-1 {
              animation: spin-slow-turbine 16s linear infinite;
              transform-origin: 50px 80px;
            }
            .turbine-spin-watermark-2 {
              animation: spin-slow-turbine 22s linear infinite;
              transform-origin: 50px 100px;
            }
          `}} />
          <path d="M 48 200 L 50 80 L 52 200 Z" fill="currentColor" />
          <g className="turbine-spin-watermark-1">
            <line x1="50" y1="80" x2="50" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="80" x2="6.7" y2="105" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="80" x2="93.3" y2="105" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="80" r="4.5" fill="currentColor" />
          </g>
        </svg>
      </div>

      {/* Wind Turbine Watermark (Right) */}
      <div className="absolute top-[40%] right-[3%] opacity-[0.06] dark:opacity-[0.015] pointer-events-none select-none text-[#e8ecc4] dark:text-emerald-500 hidden xl:block z-0">
        <svg width="150" height="300" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 49 200 L 50 100 L 51 200 Z" fill="currentColor" />
          <g className="turbine-spin-watermark-2">
            <line x1="50" y1="100" x2="50" y2="60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="50" y1="100" x2="15.4" y2="120" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="50" y1="100" x2="84.6" y2="120" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="100" r="4" fill="currentColor" />
          </g>
        </svg>
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-20 pt-32 relative z-10">
        
        {/* Breadcrumbs & Back Nav */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-emerald-100/60 dark:text-white/30 mb-8">
          <Link href="/" className="hover:text-yellow-300 dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <a href="/about" className="hover:text-yellow-300 dark:hover:text-emerald-400 transition-colors">
            About
          </a>
          <ChevronRight className="w-3.5 h-3.5" />
          <a href="/about#structure" className="hover:text-yellow-300 dark:hover:text-emerald-400 transition-colors">
            Organization
          </a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-yellow-300 dark:text-emerald-400 truncate max-w-[200px] sm:max-w-none">
            {dept.name}
          </span>
        </div>

        {/* Back Button */}
        <a
          href="/about#structure"
          className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-yellow-300 hover:text-white dark:text-emerald-400 dark:hover:text-white transition-colors duration-300 mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Departments
        </a>

        {/* Hero Section */}
        <div className="max-w-4xl mb-12">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#099c6d] dark:bg-white/5 border border-yellow-300/40 dark:border-white/10 text-xs font-black tracking-widest uppercase text-yellow-300 dark:text-emerald-400 mb-4 shadow-sm">
            Department Directory
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight tracking-tight uppercase mb-4 text-white">
            {dept.name}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-emerald-50/90 dark:text-gray-300 leading-relaxed font-bold max-w-3xl">
            {dept.description}
          </p>
        </div>

        {/* Content Areas */}
        {isEmpty ? (
          <div className="max-w-xl mx-auto text-center p-12 bg-white/10 dark:bg-emerald-950/20 border border-white/20 dark:border-emerald-500/20 rounded-3xl shadow-lg mt-12">
            <Users className="w-16 h-16 mx-auto text-yellow-300/60 dark:text-emerald-400/50 mb-4" />
            <h3 className="text-xl font-black text-white mb-2">No Team Members Added</h3>
            <p className="text-sm text-emerald-50/60 dark:text-gray-400">
              There are currently no members or divisions populated in this department. Check back soon for updates!
            </p>
          </div>
        ) : (
          <div className="w-full mt-12">
            <OrgTreeSection dept={dept} />
          </div>
        )}

      </div>
    </div>
  );
}
