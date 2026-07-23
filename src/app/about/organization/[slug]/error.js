"use client";

import React, { useEffect } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0bb37e] dark:bg-[#07130e] text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center bg-white/10 dark:bg-emerald-950/20 border border-white/20 dark:border-emerald-500/20 p-8 rounded-3xl shadow-xl">
        <AlertTriangle className="w-12 h-12 mx-auto text-yellow-300 dark:text-emerald-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-black uppercase mb-2">Something went wrong!</h2>
        <p className="text-sm text-emerald-50/70 dark:text-gray-400 mb-6">
          An error occurred while loading this department details.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-yellow-300 dark:bg-emerald-500 text-slate-950 font-black rounded-full text-xs tracking-widest uppercase hover:scale-105 transition-all duration-300"
          >
            Try Again
          </button>
          <Link
            href="/about#structure"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 border border-white/20 text-white font-black rounded-full text-xs tracking-widest uppercase hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
