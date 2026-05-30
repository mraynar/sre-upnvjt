"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlugZap, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07130e] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Animated Background Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Cute Animated Plug Icon */}
        <motion.div
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm">
            <PlugZap className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          </div>
          {/* Unplugged cable animation */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 40, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-primary to-transparent rounded-full"
          />
        </motion.div>

        {/* 404 Glitch Text */}
        <div className="relative inline-block mb-4">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[80px] md:text-[120px] font-display font-black text-white leading-none tracking-tighter select-none"
          >
            404
          </motion.h1>
          <motion.div
            animate={{ x: [-2, 2, -2], opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
            className="absolute inset-0 text-[80px] md:text-[120px] font-display font-black text-primary leading-none tracking-tighter select-none mix-blend-screen opacity-50"
            style={{ marginLeft: "4px" }}
          >
            404
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-[24px] md:text-[32px] font-display font-semibold text-white mb-4">
            Energy Not Found!
          </h2>
          <p className="text-white/60 text-[16px] md:text-[18px] mb-10 max-w-md mx-auto leading-relaxed">
            Oops! It seems this page has run out of battery or the solar panels
            didn't catch enough sunlight. Let's get you back to the grid.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/">
            <div className="group relative inline-flex items-center gap-3 bg-primary text-white font-semibold rounded-full px-8 py-4 overflow-hidden transition-transform active:scale-95 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]">
              <Home className="w-5 h-5 group-hover:-translate-y-1 group-hover:text-white transition-transform" />
              <span className="relative z-10 text-[16px]">Recharge & Go Home</span>
              {/* Button hover effect */}
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
