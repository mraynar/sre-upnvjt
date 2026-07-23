"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowUpRight, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";

const InstagramIcon = (props) => (
  <svg className={`fill-current ${props.className || "w-5 h-5"}`} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export default function MerchPublicClient() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#07130e] text-[#07130e] dark:text-white pt-24 select-none">
      
      {/* ── 1. Hero Section (Gambar 4 Style) ── */}
      <section className="relative bg-[#0bb37e] dark:bg-[#0c2a20] text-white py-20 px-6 md:px-12 lg:px-20 overflow-hidden">
        {/* Abstract background shapes / pattern texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-400/20 blur-[100px]" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-4xl md:text-6xl font-display font-black leading-tight tracking-tight uppercase">
              OFFICIAL MERCHANDISE <br className="hidden md:inline" />
              <span className="text-yellow-300 dark:text-emerald-400">SRE UPN JATIM!</span>
            </h1>
            <p className="text-lg md:text-xl font-light text-emerald-50 leading-relaxed max-w-xl">
              SRE UPN Veteran Jawa Timur merchandise can now be checked online! Show your support for the green transition with style.
            </p>
          </motion.div>

          {/* Right Placeholder Visual Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[420px] aspect-square mx-auto rounded-3xl border border-white/20 bg-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent" />
            {/* Spinning wind turbine vector inside box */}
            <svg
              className="w-48 h-48 text-white/25 group-hover:text-white/40 transition-colors duration-500"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {/* Stand */}
              <line x1="50" y1="45" x2="50" y2="95" strokeWidth="2.5" />
              {/* Blades Group */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                style={{ transformOrigin: "50px 45px" }}
              >
                <circle cx="50" cy="45" r="3" fill="currentColor" />
                <path d="M50 45 L50 15 L53 30 Z" fill="currentColor" />
                <path d="M50 45 L24 60 L38 52 Z" fill="currentColor" />
                <path d="M50 45 L76 60 L62 52 Z" fill="currentColor" />
              </motion.g>
            </svg>
            
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <span className="text-[11px] font-mono tracking-widest text-white/50 uppercase">COMMING SOON COLLECTION</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Our Special Bundle Section (Gambar 2 Style) ── */}
      <section className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto bg-white dark:bg-[#07130e]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase text-gray-900 dark:text-white tracking-tight relative inline-block">
            OUR SPECIAL BUNDLE
            {/* Yellow / gold accent line underline */}
            <div className="h-[4px] w-full bg-gradient-to-r from-yellow-400 to-amber-500 mt-2 rounded-full" />
          </h2>
        </div>

        {/* Empty Placeholder Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-3xl mx-auto p-12 md:p-16 rounded-3xl border border-amber-500/10 dark:border-white/5 bg-amber-50/10 dark:bg-amber-950/5 flex flex-col items-center justify-center text-center shadow-sm"
        >
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 dark:text-amber-400 mb-6">
            <Package className="w-10 h-10" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">
            No bundle merchandise available yet.
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-light max-w-md">
            Please check back later for exciting bundles! We are working hard to create exclusive gear packages for you.
          </p>
        </motion.div>
      </section>

      {/* ── 3. Our Products Section (Gambar 3 Style) ── */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-[#0bb37e] dark:bg-[#0c2a20] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight relative inline-block">
              OUR PRODUCTS
              <div className="h-[4px] w-full bg-gradient-to-r from-yellow-300 to-amber-400 mt-2 rounded-full" />
            </h2>
          </div>

          {/* Empty Placeholder Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-3xl mx-auto p-12 md:p-16 rounded-3xl border border-white/20 bg-white/10 dark:bg-[#07130e]/40 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-2xl"
          >
            <div className="w-20 h-20 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 mb-6">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">
              No merchandise available yet.
            </h3>
            <p className="text-emerald-100 font-light max-w-md">
              Please check back later for exciting products! Follow our social media updates for launch announcements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 4. Get Official Merchandise bottom CTA (Gambar 3 Bottom Style) ── */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-[#082218] text-white relative overflow-hidden">
        {/* Wind Turbine vector layout on the right side */}
        <div className="absolute right-12 bottom-0 w-80 h-96 opacity-10 pointer-events-none hidden lg:block z-0">
          <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <line x1="50" y1="30" x2="50" y2="100" strokeWidth="2" />
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              style={{ transformOrigin: "50px 30px" }}
            >
              <circle cx="50" cy="30" r="2" fill="currentColor" />
              <path d="M50 30 L50 0 L52 15 Z" fill="currentColor" />
              <path d="M50 30 L24 45 L38 37 Z" fill="currentColor" />
              <path d="M50 30 L76 45 L62 37 Z" fill="currentColor" />
            </motion.g>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 relative z-10">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-display font-black leading-tight uppercase mb-6">
              Get Our Official <br />
              Merchandise at
            </h2>
            <div className="h-[4px] w-24 bg-emerald-500 rounded-full" />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
            {/* Instagram Button */}
            <a
              href="https://instagram.com/sre.upnvjt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/25 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
            >
              <InstagramIcon className="w-5 h-5 text-emerald-400" />
              @sre.upnvjt
            </a>

            {/* Shopee Button */}
            <a
              href="https://shopee.co.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white text-[#082218] hover:bg-emerald-50 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              shopee.co.id/sreupnvjt
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
