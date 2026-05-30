"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Lock, KeyRound, ServerCrash, ZapOff } from "lucide-react";

export default function StatusErrorPage({ params }) {
  // Use `use()` to unwrap the params promise in Next.js 14+
  const unwrappedParams = use(params);
  const code = unwrappedParams.code || "Unknown";

  let config = {
    icon: <ZapOff className="w-16 h-16 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />,
    title: "Anomaly Detected",
    desc: "We encountered an unknown fluctuation in the power grid. Try heading back to safety.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
    glow: "bg-yellow-500/10",
  };

  if (code === "403") {
    config = {
      icon: <Lock className="w-16 h-16 text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />,
      title: "Grid Locked (Forbidden)",
      desc: "Access denied! You don't have the required security clearance to enter this sector of the grid.",
      color: "text-purple-500",
      bg: "bg-purple-500/20",
      border: "border-purple-500/30",
      glow: "bg-purple-500/10",
    };
  } else if (code === "401") {
    config = {
      icon: <KeyRound className="w-16 h-16 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />,
      title: "Access Card Required",
      desc: "Who goes there? You need to authenticate your identity before accessing these blueprints.",
      color: "text-blue-500",
      bg: "bg-blue-500/20",
      border: "border-blue-500/30",
      glow: "bg-blue-500/10",
    };
  } else if (code === "503") {
    config = {
      icon: <ServerCrash className="w-16 h-16 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />,
      title: "Grid Overload",
      desc: "Service Unavailable! The main generator is currently down for maintenance. We'll be back online soon.",
      color: "text-orange-500",
      bg: "bg-orange-500/20",
      border: "border-orange-500/30",
      glow: "bg-orange-500/10",
    };
  } else if (code === "502") {
    config = {
      icon: <ServerCrash className="w-16 h-16 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />,
      title: "Bad Gateway",
      desc: "The connection to the main power plant failed. Our transmission lines might be compromised.",
      color: "text-red-500",
      bg: "bg-red-500/20",
      border: "border-red-500/30",
      glow: "bg-red-500/10",
    };
  }

  return (
    <div className="min-h-screen bg-[#07130e] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Animated Background Orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/3 right-1/4 w-96 h-96 ${config.glow} rounded-full blur-[120px] pointer-events-none`}
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className={`absolute bottom-1/3 left-1/4 w-80 h-80 ${config.bg} rounded-full blur-[100px] pointer-events-none`}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Animated Icon */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-8"
        >
          <div className={`w-32 h-32 bg-white/5 border ${config.border} rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm`}>
            {config.icon}
          </div>
        </motion.div>

        {/* Status Code Glitch Text */}
        <div className="relative inline-block mb-4">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[80px] md:text-[120px] font-display font-black text-white leading-none tracking-tighter select-none"
          >
            {code}
          </motion.h1>
          <motion.div
            animate={{ x: [-2, 2, -2], opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
            className={`absolute inset-0 text-[80px] md:text-[120px] font-display font-black ${config.color} leading-none tracking-tighter select-none mix-blend-screen opacity-50`}
            style={{ marginLeft: "4px" }}
          >
            {code}
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={`text-[24px] md:text-[32px] font-display font-semibold ${config.color} mb-4`}>
            {config.title}
          </h2>
          <p className="text-white/60 text-[16px] md:text-[18px] mb-10 max-w-md mx-auto leading-relaxed">
            {config.desc}
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/">
            <div className="group relative inline-flex items-center gap-3 bg-white text-[#07130e] font-semibold rounded-full px-8 py-4 overflow-hidden transition-transform active:scale-95 shadow-lg">
              <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              <span className="relative z-10 text-[16px]">Return to Base</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
