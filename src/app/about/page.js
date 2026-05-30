"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

// Subtle organic scroll reveals mimicking Apple's easing
const fadeInUp = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function About() {
  return (
    <main className="pt-20 w-full flex flex-col overflow-hidden bg-canvas text-ink antialiased">
      {/* 3. [About] Section (Canvas: #ffffff) */}
      <section 
        className="bg-canvas text-ink py-28 px-6 md:px-12 border-b border-divider-soft relative"
      >
        {/* Subtle decoration elements */}
        <div className="absolute right-0 top-1/3 w-[300px] h-[300px] rounded-full bg-canvas-parchment blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full flex flex-col gap-20">
          
          {/* Top Student Solar Group Photo Banner */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full aspect-[21/7] rounded-[18px] overflow-hidden"
            style={{ filter: "drop-shadow(0 20px 40px rgba(19, 31, 28, 0.08))" }}
          >
            <img 
              src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop"
              alt="SRE UPN Veteran Jawa Timur Chapter Members Solar Panel Grid"
              className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f3036]/75 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 text-white z-10">
              <span className="text-[12px] font-semibold tracking-widest uppercase text-primary-on-dark mb-1 block">
                FOUNDING HUB
              </span>
              <h3 className="text-[28px] md:text-[36px] font-display font-semibold tracking-tight uppercase">
                SOCIETY OF RENEWABLE ENERGY
              </h3>
            </div>
          </motion.div>

          {/* Split layout below */}
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left Headline with Gradient Line Underline Accent */}
            <motion.div 
              {...fadeInUp}
              className="flex-1 flex flex-col justify-start"
            >
              <div className="relative pb-6">
                <h2 className="text-[42px] md:text-[52px] font-display font-semibold tracking-tight text-ink leading-none uppercase">
                  ABOUT <br />
                  <span className="text-primary">SRE UPN VJ</span>
                </h2>
                <div className="absolute bottom-0 left-0 w-32 h-1.5 bg-gradient-to-r from-primary to-primary-focus rounded-full" />
              </div>
              <div className="mt-8">
                <p className="text-[14px] font-normal text-ink-muted-48 uppercase tracking-widest">CHAPTER FOCUS</p>
                <p className="text-[17px] font-semibold text-ink mt-1">Operational microgrids, biofuel experiments, & green advocacy.</p>
              </div>
            </motion.div>

            {/* Right Descriptions */}
            <motion.div 
              {...fadeInUp}
              className="flex-[1.5] flex flex-col justify-start gap-8 text-[17px] leading-relaxed text-ink/85 font-light"
            >
              <p className="text-[20px] font-normal text-ink leading-relaxed">
                <strong>Society of Renewable Energy (SRE)</strong> is a student-led organization that aims to spark student’s role in the field of new and renewable energy.
              </p>
              <p>
                <strong>SRE UPN Veteran Jawa Timur</strong>, the key operational student chapter, was established to accelerate Indonesia's energy transition by providing high-fidelity learning programs, practical microgrid field projects, and institutional energy audits for the members.
              </p>
              <div className="pt-4 flex items-center gap-4">
                <a 
                  href="/activity" 
                  className="bg-[#0f3036] hover:bg-[#1b434b] text-white text-[15px] font-semibold rounded-full px-6 py-3 transition-colors duration-300 transform active:scale-95"
                >
                  See Our Activities
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 4. [Map] SRE Indonesia Network Map Section */}
      <section 
        className="bg-surface-tile-1 text-white py-32 px-6 overflow-hidden border-b border-hairline/10 relative"
      >
        {/* Subtle background abstract shapes */}
        <div className="absolute inset-0 bg-[#0f3036]/50 opacity-40 pointer-events-none" />

        {/* Subtle grid mesh backdrop */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20" />

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
          
          {/* Header */}
          <motion.div {...fadeInUp} className="text-center mb-16 max-w-2xl flex flex-col items-center">
            <span className="text-[14px] font-semibold tracking-wider text-primary-on-dark uppercase mb-3">
              NATIONAL CHAPTER COALITION
            </span>
            <h2 className="text-[38px] md:text-[46px] font-display font-semibold tracking-tight uppercase text-white">
              SRE Indonesia Coalition
            </h2>
          </motion.div>

          {/* Network Map Vector Container */}
          <div className="w-full max-w-[1000px] aspect-[21/9] relative flex items-center justify-center">
            
            {/* Custom SVG abstract Indonesia network map */}
            <svg viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60">
              {/* Sumatra path simplified */}
              <path d="M 50 80 L 150 160 L 130 180 L 30 90 Z" fill="#34d399" opacity="0.25" />
              <path d="M 50 80 L 150 160 L 130 180 L 30 90 Z" stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              
              {/* Java path simplified */}
              <path d="M 140 180 L 280 190 L 280 200 L 140 190 Z" fill="#34d399" opacity="0.25" />
              <path d="M 140 180 L 280 190 L 280 200 L 140 190 Z" stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              
              {/* Kalimantan path simplified */}
              <path d="M 190 70 L 260 65 L 280 120 L 190 125 Z" fill="#34d399" opacity="0.25" />
              <path d="M 190 70 L 260 65 L 280 120 L 190 125 Z" stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              
              {/* Sulawesi path simplified */}
              <path d="M 330 80 L 370 75 L 365 130 L 330 110 Z" fill="#34d399" opacity="0.25" />
              <path d="M 330 80 L 370 75 L 365 130 L 330 110 Z" stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              
              {/* Papua path simplified */}
              <path d="M 460 120 L 560 125 L 550 160 L 480 150 Z" fill="#34d399" opacity="0.25" />
              <path d="M 460 120 L 560 125 L 550 160 L 480 150 Z" stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

              {/* Major Chapter Nodes */}
              <circle cx="60" cy="90" r="4" fill="#34d399" className="animate-ping" />
              <circle cx="60" cy="90" r="3.5" fill="#34d399" />
              <circle cx="155" cy="180" r="4" fill="#34d399" className="animate-ping" />
              <circle cx="155" cy="180" r="3.5" fill="#34d399" />
              <circle cx="175" cy="185" r="4" fill="#34d399" className="animate-ping" />
              <circle cx="175" cy="185" r="3.5" fill="#34d399" />
              <circle cx="235" cy="192" r="5" fill="#10b981" className="animate-pulse" />
              <circle cx="235" cy="192" r="4.5" fill="#10b981" />
              <circle cx="245" cy="195" r="4" fill="#34d399" />
              <circle cx="340" cy="115" r="4" fill="#34d399" />
              <circle cx="255" cy="100" r="4" fill="#34d399" />
            </svg>

            {/* Big SRE Logo overlaid perfectly in the center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <motion.h3 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="text-[96px] md:text-[140px] font-display font-semibold tracking-tighter text-white/95 uppercase"
              >
                SRE
              </motion.h3>
            </div>

            {/* Floating Statistic Capsules */}
            <motion.div 
              initial={{ opacity: 0, x: -30, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="absolute top-2 left-4 md:top-6 md:left-12 bg-[#0c2a2f]/80 backdrop-blur-md border border-white/5 px-5 py-3 rounded-[18px] text-left shadow-lg pointer-events-none"
            >
              <p className="text-[11px] font-normal text-body-muted uppercase tracking-wider">WITH MORE THAN</p>
              <p className="text-[16px] font-display font-semibold text-primary-on-dark tracking-tight">2000+ Active Members</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute bottom-2 right-4 md:bottom-6 md:right-12 bg-[#0c2a2f]/80 backdrop-blur-md border border-white/5 px-5 py-3 rounded-[18px] text-left shadow-lg pointer-events-none"
            >
              <p className="text-[11px] font-normal text-body-muted uppercase tracking-wider">WE ARE CURRENTLY SPREAD ACROSS</p>
              <p className="text-[16px] font-display font-semibold text-primary-on-dark tracking-tight">40+ Universities Chapters</p>
            </motion.div>

          </div>
        </div>
      </section>
    </main>
  );
}
