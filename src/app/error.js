"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07130e] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Animated Background Orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Cute Animated Warning Icon */}
        <motion.div
          animate={{
            rotate: [0, -5, 5, -5, 5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 bg-white/5 border border-red-500/30 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
            <AlertTriangle className="w-16 h-16 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          </div>
          {/* Sparks animation */}
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full blur-[2px]"
          />
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatDelay: 1.5,
              delay: 0.2,
            }}
            className="absolute -bottom-2 -left-2 w-3 h-3 bg-red-400 rounded-full blur-[2px]"
          />
        </motion.div>

        {/* 500 Glitch Text */}
        <div className="relative inline-block mb-4">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[60px] md:text-[80px] font-display font-black text-white leading-none tracking-tighter select-none"
          >
            SYSTEM FAULT
          </motion.h1>
          <motion.div
            animate={{ x: [-3, 3, -3], opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.15, repeat: Infinity, repeatType: "mirror" }}
            className="absolute inset-0 text-[60px] md:text-[80px] font-display font-black text-red-500 leading-none tracking-tighter select-none mix-blend-screen opacity-50"
            style={{ marginLeft: "4px" }}
          >
            SYSTEM FAULT
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-[20px] md:text-[28px] font-display font-semibold text-red-400 mb-4">
            Short Circuit Detected!
          </h2>
          <p className="text-white/60 text-[16px] md:text-[18px] mb-10 max-w-md mx-auto leading-relaxed">
            Yikes! A wire crossed somewhere and our grid is experiencing a temporary outage. Don't worry, our engineers are on it.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => reset()}
            className="group relative inline-flex items-center justify-center gap-3 bg-red-500/10 border border-red-500/50 text-red-400 font-semibold rounded-full px-8 py-4 overflow-hidden transition-all hover:bg-red-500/20 hover:border-red-500 active:scale-95"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="relative z-10 text-[16px]">Reboot System</span>
          </button>

          <Link href="/">
            <div className="group relative inline-flex items-center justify-center gap-3 bg-white text-[#07130e] font-semibold rounded-full px-8 py-4 overflow-hidden transition-transform active:scale-95 shadow-lg">
              <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              <span className="relative z-10 text-[16px]">Return to Base</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
