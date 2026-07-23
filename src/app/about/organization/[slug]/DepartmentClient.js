"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Users } from "lucide-react";
import { DirectorCard, ManagerSection, StaffGrid } from "@/components/organization/OrgComponents";

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
          <Link
            href="/about#structure"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-yellow-300 dark:bg-emerald-500 text-slate-950 font-black rounded-full text-xs tracking-widest uppercase hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO ABOUT
          </Link>
        </div>
      </div>
    );
  }

  // Determine if the department has no members at all (empty state check)
  const hasDirector = !!dept.director;
  const hasDivisions = dept.divisions && dept.divisions.length > 0;
  const hasManagers = hasDivisions && dept.divisions.some(div => div.manager);
  const hasStaff = hasDivisions && dept.divisions.some(div => div.staff && div.staff.length > 0);
  const isEmpty = !hasDirector && !hasManagers && !hasStaff;

  return (
    <div className="min-h-screen bg-[#0bb37e] dark:bg-[#07130e] text-white selection:bg-yellow-300 selection:text-slate-950 antialiased overflow-hidden pb-24">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        
        {/* ─── Breadcrumbs & Back Nav ─── */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-emerald-100/60 dark:text-white/30 mb-8">
          <Link href="/" className="hover:text-yellow-300 dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/about" className="hover:text-yellow-300 dark:hover:text-emerald-400 transition-colors">
            About
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/about#structure" className="hover:text-yellow-300 dark:hover:text-emerald-400 transition-colors">
            Organization
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-yellow-300 dark:text-emerald-400 truncate max-w-[200px] sm:max-w-none">
            {dept.name}
          </span>
        </div>

        {/* ─── Back Button ─── */}
        <Link
          href="/about#structure"
          className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-yellow-300 hover:text-white dark:text-emerald-400 dark:hover:text-white transition-colors duration-300 mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Departments
        </Link>

        {/* ─── Hero Section ─── */}
        <div className="max-w-4xl mb-20">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#099c6d] dark:bg-white/5 border border-yellow-300/40 dark:border-white/10 text-[10px] font-black tracking-widest uppercase text-yellow-300 dark:text-emerald-400 mb-4 shadow-sm">
            Department Directory
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight tracking-tight uppercase mb-4 text-white">
            {dept.name}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-emerald-50/90 dark:text-gray-300 leading-relaxed font-bold max-w-3xl">
            {dept.description}
          </p>
        </div>

        {/* ─── Content Areas ─── */}
        {isEmpty ? (
          /* Empty State */
          <div className="max-w-xl mx-auto text-center p-12 bg-white/10 dark:bg-emerald-950/20 border border-white/20 dark:border-emerald-500/20 rounded-3xl shadow-lg mt-12">
            <Users className="w-16 h-16 mx-auto text-yellow-300/60 dark:text-emerald-400/50 mb-4" />
            <h3 className="text-xl font-black text-white mb-2">No Team Members Added</h3>
            <p className="text-sm text-emerald-50/60 dark:text-gray-400">
              There are currently no members or divisions populated in this department. Check back soon for updates!
            </p>
          </div>
        ) : (
          /* Structured Sections */
          <div className="space-y-24">
            
            {/* Director Section */}
            {hasDirector && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-sm font-black text-yellow-300 dark:text-emerald-400 tracking-[0.25em] uppercase mb-1">
                    Department Leader
                  </h3>
                  <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">
                    Director
                  </h2>
                </div>
                <DirectorCard director={dept.director} fallbackRole={`Director of ${dept.name}`} />
              </div>
            )}

            {/* Managers Section */}
            {hasManagers && (
              <ManagerSection divisions={dept.divisions} />
            )}

            {/* Staff Section */}
            {hasStaff && (
              <StaffGrid divisions={dept.divisions} />
            )}
            
          </div>
        )}

      </div>
    </div>
  );
}
