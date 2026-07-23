"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  ArrowUpRight, BookOpen, Cpu, Leaf, Users, Mail, MapPin, ChevronLeft, ChevronRight
} from "lucide-react";
import Image from "next/image";

// ─── Animation Variants ────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
});

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// Hero word-by-word reveal
const wordReveal = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const wordChild = {
  hidden: { opacity: 0, y: 20, rotateX: -15 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const PILLARS = [
  { 
    icon: BookOpen, 
    num: "01",
    title: "Education", 
    desc: "Providing high-fidelity training, seminars, and workshops to elevate renewable energy literacy among students." 
  },
  { 
    icon: Cpu, 
    num: "02",
    title: "Technology", 
    desc: "Developing practical, scalable microgrid, solar power, and bioenergy prototypes for real-world application." 
  },
  { 
    icon: Leaf, 
    num: "03",
    title: "Environment", 
    desc: "Promoting sustainability, decarbonization models, and eco-friendly community waste management." 
  },
  { 
    icon: Users, 
    num: "04",
    title: "Empowerment", 
    desc: "Collaborating with local villages to implement renewable energy grids directly elevating their socioeconomic level." 
  }
];

const MISSION_ITEMS = [
  { desc: "Meningkatkan kesadaran & literasi transisi energi di kalangan mahasiswa dan masyarakat luas." },
  { desc: "Menyelenggarakan riset dan proyek energi baru terbarukan yang berdampak dan tepat guna." },
  { desc: "Membangun kolaborasi sinergis lintas sektor: akademisi, industri, dan komunitas." },
];

// ─── Member Card ───────────────────────────────────────────────────────────────

function MemberCard({ member, index }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      variants={staggerChild}
      className="group relative bg-white/10 dark:bg-[#07130e] border border-white/10 dark:border-white/5 rounded-3xl overflow-hidden hover:border-yellow-300/40 dark:hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col"
    >
      <div className="aspect-[4/5] bg-black/40 overflow-hidden relative">
        <Image
          src={member.profilePictureUrl || "/images/default-avatar.svg"}
          alt={`${member.name} — ${member.role}`}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
          className={`object-cover transition-all duration-700 ease-out ${prefersReduced ? "" : "filter grayscale group-hover:grayscale-0 group-hover:scale-105"}`}
          loading="lazy"
        />
        {/* Always-visible gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07130e]/90 dark:from-[#07130e]/90 via-[#07130e]/20 to-transparent pointer-events-none" />
        {/* Division badge — top left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[8px] font-black tracking-widest uppercase text-white/70 backdrop-blur-sm">
            {member.dept}
          </span>
        </div>
      </div>
      <div className="p-5 flex-1">
        <span className="text-[9px] font-black tracking-widest uppercase text-yellow-300 dark:text-emerald-400 block mb-1.5">
          {member.role}
        </span>
        <h4 className="text-sm font-black text-white dark:text-white group-hover:text-yellow-300 dark:group-hover:text-emerald-400 transition-colors leading-tight line-clamp-1">
          {member.name}
        </h4>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AboutClient({ divisionsData }) {
  const [activeTab, setActiveTab] = useState(divisionsData.length > 0 ? divisionsData[0].id : "");
  const tabListRef = useRef(null);

  const activeDivision = divisionsData.find(d => d.id === activeTab);
  const activeIndex = divisionsData.findIndex(d => d.id === activeTab);

  // Touch swipe state for mobile team navigation
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < divisionsData.length - 1) {
        setActiveTab(divisionsData[activeIndex + 1].id);
      } else if (diff < 0 && activeIndex > 0) {
        setActiveTab(divisionsData[activeIndex - 1].id);
      }
    }
    touchStartX.current = null;
  };

  // Keyboard nav for the tab row
  const handleTabKeyDown = (e, idx) => {
    if (e.key === "ArrowRight") {
      const next = divisionsData[idx + 1];
      if (next) { setActiveTab(next.id); tabListRef.current?.children[idx + 1]?.focus(); }
    }
    if (e.key === "ArrowLeft") {
      const prev = divisionsData[idx - 1];
      if (prev) { setActiveTab(prev.id); tabListRef.current?.children[idx - 1]?.focus(); }
    }
  };

  return (
    <div className="min-h-screen bg-[#0bb37e] dark:bg-[#07130e] text-white dark:text-white selection:bg-yellow-300 selection:text-[#07130e] antialiased overflow-hidden">

      {/* ── 1. Hero Section ─────────────────────────────────────────────────── */}
      <section id="hero" className="scroll-mt-20 relative pt-44 pb-24 px-6 overflow-hidden border-b border-slate-200 dark:border-white/5 bg-[#0bb37e] dark:bg-[#07130e]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start gap-4 mb-6"
          >
            <span className="inline-block py-2 px-5 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-[10px] font-black tracking-widest uppercase text-white dark:text-[#e8ecc4]">
              SRE UPN Veteran Jawa Timur
            </span>
          </motion.div>

          {/* Word-by-word reveal for the headline */}
          <motion.h1
            variants={wordReveal}
            initial="hidden"
            animate="show"
            className="text-[60px] md:text-[100px] lg:text-[120px] font-display font-black leading-[0.85] tracking-tighter uppercase mb-6 flex flex-wrap gap-x-6 perspective-[1000px]"
          >
            {["ABOUT", "US."].map((word, i) => (
              <motion.span
                key={i}
                variants={wordChild}
                className={i === 1 ? "text-yellow-300 dark:text-emerald-400" : ""}
                style={{ display: "inline-block" }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="text-base sm:text-lg md:text-xl text-emerald-50/90 dark:text-white/60 max-w-3xl leading-relaxed font-medium"
          >
            Society of Renewable Energy UPN Veteran Jawa Timur adalah komunitas penggerak akselerasi transisi energi bersih dan edukasi lingkungan terkemuka di tingkat mahasiswa.
          </motion.p>
        </div>
      </section>

      {/* ── 2. Vision & Mission Section ─────────────────────────────────────── */}
      <section id="vision" className="scroll-mt-20 py-24 px-6 md:px-12 lg:px-20 bg-[#0aa373] dark:bg-[#050e0a] border-b border-slate-200 dark:border-white/5 relative overflow-hidden">
        {/* Ambient decoration */}
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary/4 blur-[140px] rounded-full pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto">
          
          {/* Vision + Mission — side by side with strong visual contrast */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0 mb-24 rounded-[32px] overflow-hidden border border-white/10 dark:border-white/5">
            
            {/* Vision — left dark panel */}
            <motion.div
              {...fadeUp(0)}
              className="bg-white/10 dark:bg-[#07130e] p-10 md:p-14 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Large decorative "V" */}
              <div className="absolute -top-8 -right-4 text-[200px] font-display font-black text-white/[0.03] select-none pointer-events-none leading-none" aria-hidden="true">
                V
              </div>
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-8 h-8 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-yellow-300 dark:text-emerald-400 text-[10px] font-black">
                    01
                  </span>
                  <span className="text-[10px] font-black text-yellow-300 dark:text-emerald-400 tracking-[0.3em] uppercase">Our Vision</span>
                </div>
                <h2 className="text-[36px] md:text-[48px] font-display font-black uppercase text-white dark:text-white mb-6 tracking-tight leading-[1.05]">
                  Menjadi wadah{" "}
                  <span className="text-yellow-300 dark:text-emerald-400">
                    esensial
                  </span>{" "}
                  mahasiswa
                </h2>
                <p className="text-[15px] md:text-[17px] text-white/90 dark:text-white/55 leading-relaxed font-light border-l-2 border-yellow-300/40 dark:border-emerald-500/40 pl-5">
                  Dalam mengeksplorasi, mengembangkan, dan mengimplementasikan inovasi di bidang energi baru terbarukan demi masa depan yang berkelanjutan dan mandiri energi.
                </p>
              </div>
              {/* Accent line at bottom */}
              <div className="mt-10 pt-6 border-t border-white/10 dark:border-white/5">
                <span className="text-[11px] text-white/40 dark:text-white/20 tracking-widest uppercase font-bold">SRE UPNVJT Vision Statement</span>
              </div>
            </motion.div>

            {/* Mission — right slightly lighter panel */}
            <motion.div
              {...fadeUp(0.1)}
              className="bg-white/5 dark:bg-[#0a1a12] p-10 md:p-14 relative overflow-hidden flex flex-col justify-between border-t border-white/10 dark:border-white/5 lg:border-t-0 lg:border-l border-white/10 dark:border-white/5"
            >
              <div className="absolute -bottom-8 -left-4 text-[200px] font-display font-black text-white/[0.03] select-none pointer-events-none leading-none" aria-hidden="true">
                M
              </div>
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-8 h-8 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-yellow-300 dark:text-emerald-400 text-[10px] font-black">
                    02
                  </span>
                  <span className="text-[10px] font-black text-yellow-300 dark:text-emerald-400 tracking-[0.3em] uppercase">Our Mission</span>
                </div>
                <h2 className="text-[36px] md:text-[48px] font-display font-black uppercase text-white dark:text-white mb-8 tracking-tight leading-[1.05]">
                  Core{" "}
                  <span className="font-serif italic font-normal text-white/80 dark:text-white/70 normal-case tracking-normal">
                    commitments
                  </span>
                </h2>
                <ul className="space-y-5">
                  {MISSION_ITEMS.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: idx * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="flex gap-4 items-start"
                    >
                      <span className="shrink-0 w-7 h-7 rounded-full border border-yellow-300/30 dark:border-emerald-500/30 bg-white/10 dark:bg-emerald-500/10 flex items-center justify-center text-yellow-300 dark:text-emerald-400 text-[10px] font-black mt-0.5">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[14px] md:text-[15px] text-white/85 dark:text-white/65 leading-relaxed font-medium">
                        {item.desc}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 pt-6 border-t border-white/10 dark:border-white/5">
                <span className="text-[11px] text-white/40 dark:text-white/20 tracking-widest uppercase font-bold">SRE UPNVJT Mission Statement</span>
              </div>
            </motion.div>
          </div>

          {/* ── Mission Pillars Grid ─────────────────────────────────────────── */}
          <motion.div
            {...fadeUp(0)}
            className="mb-4"
          >
            <h3 className="text-[10px] font-black text-white/70 dark:text-white/30 tracking-[0.3em] uppercase text-center mb-10">
              Empat Pilar Utama Pergerakan
            </h3>
          </motion.div>
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {PILLARS.map((pl) => (
              <motion.div
                key={pl.num}
                variants={staggerChild}
                className="bg-white/10 dark:bg-white/[0.03] border border-white/20 dark:border-white/5 p-7 rounded-2xl flex flex-col justify-between hover:border-yellow-300/40 hover:bg-white/15 dark:hover:bg-white/[0.06] hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden bg-diagonal-texture shadow-sm"
              >
                {/* Large decorative number */}
                <span className="absolute top-3 right-4 text-[72px] font-display font-black text-white/[0.06] dark:text-white/[0.06] group-hover:text-yellow-300/20 transition-colors duration-500 select-none pointer-events-none leading-none" aria-hidden="true">
                  {pl.num}
                </span>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-[#07130e] group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-500 relative">
                    <pl.icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h4 className="text-[17px] font-black text-[#07130e] dark:text-white mb-2.5 uppercase tracking-tight">{pl.title}</h4>
                  <p className="text-[13px] text-[#07130e]/60 dark:text-white/45 leading-relaxed font-medium">{pl.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 3. Org Structure Section ─────────────────────────────────────────── */}
      <section id="structure" className="scroll-mt-20 py-24 px-6 md:px-12 lg:px-20 bg-[#0bb37e] dark:bg-[#07130e] border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div 
            {...fadeUp(0)}
            className="text-center mb-16 max-w-2xl"
          >
            <span className="text-[10px] font-black text-yellow-300 dark:text-emerald-400 tracking-[0.3em] uppercase block mb-3">Internal Departments</span>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white dark:text-white uppercase tracking-tight">Struktur Organisasi</h2>
            <p className="text-sm text-emerald-50/90 dark:text-white/40 mt-4 max-w-lg mx-auto leading-relaxed">
              SRE UPNVJT operates through six focused divisions, each responsible for a critical pillar of our movement.
            </p>
          </motion.div>

          {/* Org cards — dynamically numbered, not hardcoded */}
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            {[
              { id: "01", name: "Research & Development", desc: "Focuses on solar power, bioenergy, and environmental audit studies." },
              { id: "02", name: "Human Resource Development", desc: "Unites student chapters, managing onboarding and training plans." },
              { id: "03", name: "Project Management", desc: "Oversees local community solar microgrids and deployment setups." },
              { id: "04", name: "Public Relations", desc: "Coordinates national partnerships and external institutional visits." },
              { id: "05", name: "Media & Information", desc: "Drives academic journals, graphics designs, and social reach." },
              { id: "06", name: "Business Development", desc: "Creates chapter assets, merchandise gear, and sustainable funding." }
            ].map((org, idx) => (
              <motion.div
                key={org.id}
                variants={staggerChild}
                className="bg-white/10 dark:bg-white/[0.03] border border-white/20 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-yellow-300 dark:hover:border-emerald-500/30 hover:bg-white/15 dark:hover:bg-[#0a1f15] hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                <div className="absolute top-4 right-6 text-[44px] font-display font-black text-white/5 group-hover:text-yellow-300/10 transition-colors">
                  {org.id}
                </div>
                <div>
                  <h4 className="text-xl font-bold uppercase tracking-tight text-white dark:text-white mb-3">{org.name}</h4>
                  <p className="text-[13px] text-emerald-50/80 dark:text-white/50 leading-relaxed font-light">{org.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            {...fadeUp(0)}
            className="text-center mt-32 mb-16 max-w-2xl"
          >
            <span className="text-[10px] font-black text-yellow-300 dark:text-emerald-400 tracking-[0.3em] uppercase block mb-3">Our Core Team</span>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white dark:text-white uppercase tracking-tight">Kepengurusan Aktif</h2>
            <p className="text-sm text-emerald-50/90 dark:text-white/40 mt-4 max-w-lg mx-auto">
              Meet the team driving renewable energy awareness at UPNVJT.
            </p>
          </motion.div>

          {/* Tab row + arrow navigation */}
          <div className="flex items-center gap-3 w-full max-w-4xl mb-12">
            <button
              onClick={() => activeIndex > 0 && setActiveTab(divisionsData[activeIndex - 1].id)}
              disabled={activeIndex === 0}
              aria-label="Previous division"
              className="shrink-0 w-9 h-9 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 flex items-center justify-center text-white dark:text-white/50 hover:bg-yellow-300 hover:text-slate-900 hover:border-yellow-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 focus-visible:outline-yellow-300"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Scrollable tab list */}
            <div
              ref={tabListRef}
              role="tablist"
              aria-label="Division selection"
              className="flex gap-2 overflow-x-auto pb-1 flex-1 scrollbar-none hide-scrollbar"
            >
              {divisionsData.map((div, idx) => (
                <button
                  key={div.id}
                  role="tab"
                  aria-selected={activeTab === div.id}
                  aria-controls={`division-panel-${div.id}`}
                  id={`division-tab-${div.id}`}
                  onClick={() => setActiveTab(div.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  tabIndex={activeTab === div.id ? 0 : -1}
                  className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shrink-0 border focus-visible:outline-yellow-300 ${
                    activeTab === div.id 
                      ? "bg-yellow-300 dark:bg-emerald-500 text-slate-950 dark:text-slate-950 border-yellow-300 dark:border-emerald-500 shadow-[0_0_12px_rgba(245,158,11,0.25)] dark:shadow-[0_0_12px_rgba(16,185,129,0.25)]" 
                      : "bg-white/10 dark:bg-[#07130e] text-white dark:text-white/40 border-white/20 dark:border-white/5 hover:text-yellow-300 dark:hover:text-white hover:border-white/30 dark:hover:border-white/15"
                  }`}
                >
                  {div.id}
                </button>
              ))}
            </div>

            <button
              onClick={() => activeIndex < divisionsData.length - 1 && setActiveTab(divisionsData[activeIndex + 1].id)}
              disabled={activeIndex === divisionsData.length - 1}
              aria-label="Next division"
              className="shrink-0 w-9 h-9 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 flex items-center justify-center text-white dark:text-white/50 hover:bg-yellow-300 hover:text-slate-900 hover:border-yellow-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 focus-visible:outline-yellow-300"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Members grid — swipe-able on mobile */}
          <AnimatePresence mode="wait">
            {activeDivision && (
              <motion.div
                key={activeDivision.id}
                id={`division-panel-${activeDivision.id}`}
                role="tabpanel"
                aria-labelledby={`division-tab-${activeDivision.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  variants={staggerParent}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full"
                >
                  {activeDivision.members.map((member, i) => (
                    <MemberCard key={`${member.name}-${i}`} member={member} index={i} />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swipe hint on mobile */}
          {divisionsData.length > 1 && (
            <p className="text-[11px] text-white/50 dark:text-white/20 mt-8 sm:hidden tracking-wider">
              ← Swipe to switch division →
            </p>
          )}
        </div>
      </section>

      {/* ── 5. Get Connected Section ─────────────────────────────────────────── */}
      <section id="connect" className="scroll-mt-20 py-24 px-6 md:px-12 lg:px-20 bg-[#0aa373] dark:bg-[#07130e] text-white dark:text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center gap-10">
          <motion.div {...fadeUp(0)} className="flex flex-col items-center gap-5">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black tracking-widest uppercase text-yellow-300 dark:text-emerald-400">
              Get Connected
            </span>
            <h2 className="text-4xl sm:text-6xl font-display font-black uppercase leading-tight tracking-tighter text-white dark:text-white">
              LET&apos;S GET{" "}
              <span className="text-yellow-300 dark:text-emerald-400">
                CONNECTED
              </span>
            </h2>
            <p className="text-emerald-50/90 dark:text-white/50 text-[15px] max-w-md leading-relaxed">
              Terhubung bersama kami untuk diskusi kemitraan, sponsor, media, atau sekadar bertukar wawasan seputar energi alternatif.
            </p>
          </motion.div>

          {/* Social icons */}
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              {
                href: "https://instagram.com/sre.upnvjt",
                label: "Instagram",
                aria: "Follow SRE UPNVJT on Instagram",
                icon: (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                )
              },
              {
                href: "https://linkedin.com/company/sre-upnvjt",
                label: "LinkedIn",
                aria: "SRE UPNVJT on LinkedIn",
                icon: (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                )
              },
              {
                href: "https://youtube.com/@sreupnvjt",
                label: "YouTube",
                aria: "SRE UPNVJT on YouTube",
                icon: (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.387.51a3.003 3.003 0 00-2.11 2.108C0 8.025 0 12 0 12s0 3.975.503 5.837a3.003 3.003 0 002.11 2.108c1.862.51 9.387.51 9.387.51s7.525 0 9.387-.51a3.003 3.003 0 002.11-2.108C24 15.975 24 12 24 12s0-3.975-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                )
              },
              {
                href: "mailto:sre@upnjatim.ac.id",
                label: "Email",
                aria: "Email SRE UPNVJT",
                icon: <Mail className="w-5 h-5" aria-hidden="true" />
              },
            ].map(({ href, label, aria: ariaLabel, icon }) => (
              <motion.a
                key={label}
                variants={staggerChild}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                aria-label={ariaLabel}
                className="w-12 h-12 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-yellow-300 hover:text-slate-900 hover:border-yellow-300 flex items-center justify-center text-white dark:text-white transition-all duration-300 hover:scale-110 focus-visible:outline-yellow-300"
              >
                {icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Location */}
          <motion.div {...fadeUp(0.1)} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#07130e]/40 dark:text-white/25">
            <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            Surabaya, Jawa Timur, Indonesia
          </motion.div>

          {/* ── Google Maps Embed ─────────────────────────────────────────────── */}
          <motion.div
            {...fadeUp(0.15)}
            className="w-full max-w-3xl"
          >
            <div className="rounded-[24px] overflow-hidden border border-[#07130e]/15 dark:border-white/10 shadow-2xl dark:shadow-black/50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.5746707745677!2d112.7183887!3d-7.2868858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbd3d75e4a39%3A0x7e3a00f2f4fea8a7!2sUPN%20Veteran%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1720839600000!5m2!1sid!2sid"
                width="100%"
                height="340"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                title="Lokasi UPN Veteran Jawa Timur, Surabaya"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
            {/* Fallback link for direct navigation */}
            <div className="mt-4 text-center">
              <a
                href="https://maps.google.com/?q=UPN+Veteran+Jawa+Timur+Surabaya"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-[12px] font-bold tracking-widest uppercase text-[#07130e]/45 dark:text-white/30 hover:text-primary transition-colors duration-200 focus-visible:outline-primary"
                aria-label="Open UPN Veteran Jawa Timur location in Google Maps"
              >
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                Open in Google Maps
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
