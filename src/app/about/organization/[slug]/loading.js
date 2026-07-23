"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0bb37e] dark:bg-[#07130e] text-white flex items-center justify-center p-6">
      <div className="text-center flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-300 dark:text-emerald-400" />
        <p className="text-xs font-black tracking-widest uppercase text-emerald-100/60 dark:text-white/30 animate-pulse">
          Loading Department Details...
        </p>
      </div>
    </div>
  );
}
