"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Users,
  BookOpen,
  ChevronRight,
  ArrowUpRight,
  Eye,
} from "lucide-react";

// Subtle organic scroll reveals mimicking Apple's easing
const fadeInUp = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  viewport: { once: true, margin: "-100px" },
};

// Custom activities from the screenshots
const REDESIGNED_ACTIVITIES = [
  {
    id: 1,
    title: "REview",
    desc: "Webinar series to learn the fundamental of renewable energy.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Social Project",
    desc: "A community service project to help disadvantaged individuals.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "RE Project",
    desc: "Renewable energy installation project.",
    image:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=600&auto=format&fit=crop",
  },
];

const ARTICLES = [
  {
    id: 1,
    title: "The Role of Biofuels in East Java's Transitioning Green Economy",
    category: "Academic Inquiry",
    date: "MAY 24, 2026",
    author: "R&D Division",
    readTime: "8 min read",
    desc: "An analytical deep-dive into agricultural waste biogas systems, local refinery integration, and the scalability of micro-scale biofuel converters in decentralized communities.",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "Smart Grid Systems: Decarbonizing Campus Power Infrastructures",
    category: "Engineering Analysis",
    date: "APRIL 12, 2026",
    author: "Operations Group",
    readTime: "5 min read",
    desc: "Evaluating real-time demand-response algorithms to optimize micro-generation across institutional campuses.",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 3,
    title: "Evaluating Wind Potential on Jember's Southern Coastline",
    category: "Field Research",
    date: "MARCH 19, 2026",
    author: "Meteorology Team",
    readTime: "6 min read",
    desc: "Field-measured wind shear and velocity vectors analyzed to estimate micro-turbine generator efficiency.",
    image:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=400&auto=format&fit=crop",
    featured: false,
  },
];

const MERCHANDISE = [
  {
    id: 1,
    name: "SRE Signature T-Shirt",
    price: "Rp 149.000",
    desc: "Heavyweight organic cotton in deep sage forest. Clean typographic stamp.",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "SRE Bamboo Tumbler",
    price: "Rp 189.000",
    desc: "Double-walled vacuum insulated stainless steel wrapped in sustainably farmed bamboo.",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "SRE Technical Wind Shell",
    price: "Rp 349.000",
    desc: "Recycled storm ripstop parka featuring weather-sealed zippers and micro-embossed logos.",
    image:
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=600&auto=format&fit=crop",
  },
];

const PARTNERS = ["SRE Indonesia", "UPN Veteran Jawa Timur", "SRE UPNVJT"];

// Helper to generate coordinates for floating background particles
const PARTICLES = [
  { id: 1, top: "15%", left: "10%", size: 6, delay: 0 },
  { id: 2, top: "25%", left: "80%", size: 8, delay: 2 },
  { id: 3, top: "45%", left: "15%", size: 6, delay: 4 },
  { id: 4, top: "60%", left: "85%", size: 10, delay: 1.5 },
  { id: 5, top: "75%", left: "25%", size: 8, delay: 3 },
  { id: 6, top: "85%", left: "70%", size: 6, delay: 5 },
  { id: 7, top: "35%", left: "45%", size: 8, delay: 0.5 },
  { id: 8, top: "65%", left: "55%", size: 6, delay: 2.5 },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredMerch, setHoveredMerch] = useState(null);
  const [iyrefActive, setIyrefActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeProgram, setActiveProgram] = useState(0);

  // Monitor scroll to update active section in sub-navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = [
        "home",
        "about",
        "activity",
        "article",
        "student",
        "merchandise",
      ];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-play the WOW 3D Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProgram((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Responsive card dimensions for the carousel
  const [cardDims, setCardDims] = useState({ width: 760, gap: 32, height: 540 });
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) {
        setCardDims({ width: Math.round(window.innerWidth * 0.82), gap: 16, height: 420 });
      } else if (window.innerWidth < 1024) {
        setCardDims({ width: 520, gap: 24, height: 480 });
      } else {
        setCardDims({ width: 760, gap: 32, height: 540 });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink antialiased">
      {/* Main Stack of Full-Bleed alternating Tiles */}
      <main className="w-full flex flex-col overflow-hidden">
        {/* 2. [Home] Hero Section (Editorial Magazine Design) */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col justify-center items-start py-24 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#0a1c15]"
        >
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1920&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source
              src="/video/hero.mp4"
              type="video/mp4"
            />
          </video>
          
          {/* Solid Green Editorial Overlay (mix-blend-multiply for rich color) */}
          <div className="absolute inset-0 bg-[#0a2e24] opacity-80 mix-blend-multiply z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08201a]/30 to-[#08201a]/80 z-0 pointer-events-none" />

          {/* Top Right Decoration (EST. 2024 & Crosshair Lines) */}
          <div className="absolute top-0 right-8 md:right-16 lg:right-24 w-64 h-32 z-10 hidden md:block">
            {/* <div className="absolute top-[80px] -left-[100vw] w-[200vw] h-[1px] bg-white/20 pointer-events-none" />
            <div className="absolute top-0 right-16 w-[1px] h-[100vh] bg-white/20 pointer-events-none" />
            <span className="absolute top-10 right-20 text-[11px] font-bold tracking-[0.2em] text-[#e8ecc4] uppercase">
              EST. 2024
            </span> */}
          </div>

          <div className="w-full z-10 flex flex-col justify-center items-start h-full mt-12 md:mt-20">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[64px] sm:text-[90px] md:text-[110px] lg:text-[130px] font-display font-black tracking-[-0.04em] leading-[0.85] uppercase flex flex-col items-start"
            >
              <div className="flex items-center gap-3 md:gap-5">
                <span className="text-white drop-shadow-md">SOCIETY</span>
                <span className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[72px] font-serif italic font-normal text-[#e8ecc4] normal-case tracking-normal transform -translate-y-2 md:-translate-y-4">of</span>
              </div>
              <div className="text-[#e8ecc4] drop-shadow-md">
                RENEWABLE
              </div>
              <div className="flex items-center gap-2 md:gap-4 ml-6 sm:ml-12 md:ml-24">
                <span className="text-white drop-shadow-md">ENERGY</span>
              </div>
            </motion.h1>
          </div>

          {/* Bottom Right Text */}
          <div className="absolute bottom-8 md:bottom-12 right-6 md:right-12 lg:right-20 z-10 flex flex-col items-end">
            <span className="text-[12px] sm:text-[14px] font-medium text-white/90 tracking-wide drop-shadow-md text-right">
              Student Organization at <strong className="text-white font-bold block sm:inline">UPN Veteran Jawa Timur</strong>
            </span>
          </div>

          {/* Bottom Thin Yellow Line */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e8ecc4] z-20" />
        </section>

        {/* Seamless Infinite Loop Partner Marquee Scroller */}
        <section className="bg-surface-black border-y border-white/5 py-8 overflow-hidden z-10 select-none flex">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="animate-marquee flex items-center gap-16 px-8"
            >
              {Array(6)
                .fill(PARTNERS)
                .flat()
                .map((p, idx) => (
                  <div key={`${i}-${idx}`} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-on-dark" />
                    <span className="text-[13px] md:text-[14px] font-display font-semibold tracking-widest text-body-muted uppercase">
                      {p}
                    </span>
                  </div>
                ))}
            </div>
          ))}
        </section>

        {/* 3. [About] Section (Canvas: #ffffff) */}
        <section
          id="about"
          className="bg-canvas text-ink py-28 px-6 md:px-12 border-b border-divider-soft relative"
        >
          {/* Subtle decoration elements */}
          <div className="absolute right-0 top-1/3 w-[300px] h-[300px] rounded-full bg-canvas-parchment blur-3xl opacity-60 pointer-events-none" />

          <div className="w-full relative z-10 flex flex-col gap-16">
            {/* WOW Bento Grid Layout for About Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              
              {/* Massive Title Block (Col 1-4) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between bg-[#07130e] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden group"
              >
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <span className="inline-block py-1.5 px-4 rounded-full bg-primary/20 text-primary border border-primary/30 text-[12px] font-bold tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    Who We Are
                  </span>
                  <h2 className="text-[56px] md:text-[72px] lg:text-[64px] xl:text-[80px] font-display font-black leading-[0.9] tracking-tighter uppercase drop-shadow-xl">
                    ABOUT <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-[#a8d3ba]">SRE UPNVJT</span>
                  </h2>
                </div>

                <div className="relative z-10 mt-16 lg:mt-32 border-l-2 border-primary/50 pl-5">
                  <p className="text-[13px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
                    Chapter Focus
                  </p>
                  <p className="text-[17px] font-light text-white/80 leading-relaxed">
                    Operational microgrids, biofuel experiments, & green advocacy.
                  </p>
                </div>
              </motion.div>

              {/* Main Image Banner (Col 5-12) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="lg:col-span-7 xl:col-span-8 relative min-h-[400px] lg:min-h-[auto] rounded-3xl overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
              >
                <img
                  src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop"
                  alt="SRE UPN Veteran Jawa Timur Chapter Members Solar Panel Grid"
                  className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07130e]/90 via-[#07130e]/20 to-transparent pointer-events-none" />
                
                {/* Image Overlay Text */}
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10 pr-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[11px] md:text-[13px] font-bold tracking-[0.3em] uppercase text-white/90">
                      Founding Hub
                    </span>
                  </div>
                  <h3 className="text-[24px] sm:text-[28px] md:text-[40px] font-display font-black tracking-tighter uppercase leading-none drop-shadow-2xl">
                    SOCIETY OF <br className="hidden sm:block" /> RENEWABLE ENERGY
                  </h3>
                </div>
              </motion.div>

              {/* Story Block 1 (Col 1-6) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="lg:col-span-6 bg-white border border-black/[0.04] rounded-3xl p-8 md:p-12 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-shadow duration-500 relative overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute -top-12 -right-12 text-black/[0.02] transform rotate-12">
                  <Users className="w-64 h-64" />
                </div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-[22px] md:text-[26px] font-light text-ink leading-[1.6] tracking-tight">
                    <strong className="font-semibold">Society of Renewable Energy (SRE)</strong> is a
                    student-led organization that aims to spark student’s role in
                    the field of new and renewable energy.
                  </p>
                </div>
              </motion.div>

              {/* Story Block 2 (Col 7-12) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="lg:col-span-6 bg-surface-pearl border border-black/[0.04] rounded-3xl p-8 md:p-12 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-shadow duration-500 flex flex-col justify-between"
              >
                <p className="text-[17px] md:text-[19px] text-ink/75 leading-[1.7] font-light mb-10">
                  <strong className="font-semibold text-ink">SRE UPN Veteran Jawa Timur</strong>, the key
                  operational student chapter, was established to accelerate
                  Indonesia's energy transition by providing high-fidelity
                  learning programs, practical microgrid field projects, and
                  institutional energy audits for the members.
                </p>
                <div className="flex items-center">
                  <a
                    href="#activity"
                    className="group inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-[14px] font-bold uppercase tracking-widest text-ink hover:text-primary"
                  >
                    See Our Activities
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

            {/* Vision & Mission — WOW Editorial Split */}
            <div className="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-32 flex flex-col lg:flex-row min-h-[100vh] border-y border-black/10 overflow-hidden">

              {/* ━━━ LEFT — VISION (Dark, Cinematic, Immersive) ━━━ */}
              <div className="w-full lg:w-1/2 relative flex flex-col justify-center px-8 md:px-14 lg:px-20 py-28 overflow-hidden text-white"
                style={{ background: "linear-gradient(135deg, #061510 0%, #0a1f15 50%, #071812 100%)" }}>

                {/* Floating animated particles */}
                {[
                  { top: "10%", left: "15%", size: 4, dur: 8, delay: 0 },
                  { top: "25%", left: "70%", size: 3, dur: 12, delay: 2 },
                  { top: "55%", left: "8%", size: 5, dur: 10, delay: 1 },
                  { top: "70%", left: "85%", size: 3, dur: 14, delay: 3 },
                  { top: "85%", left: "40%", size: 4, dur: 9, delay: 1.5 },
                  { top: "40%", left: "55%", size: 2, dur: 11, delay: 4 },
                ].map((p, i) => (
                  <motion.div key={i}
                    animate={{ y: [0, -24, 0], x: [0, 12, 0], opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
                    className="absolute rounded-full bg-primary pointer-events-none"
                    style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
                  />
                ))}

                {/* Glowing radial bg pulse */}
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.12, 0.25, 0.12] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(16,185,129,1) 0%, transparent 70%)" }}
                />

                <div className="relative z-10">
                  {/* Eyebrow */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="flex items-center gap-3 mb-14"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-primary" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-xl border border-primary/50"
                      />
                    </div>
                    <span className="text-[11px] tracking-[0.4em] text-primary/70 uppercase font-semibold">Our Vision</span>
                  </motion.div>

                  {/* Giant editorial vision statement */}
                  <div className="mb-12">
                    {[
                      { text: "Leading", accent: false },
                      { text: "student", accent: false },
                      { text: "catalyst", accent: false },
                      { text: "for", accent: false },
                      { text: "new &", accent: true },
                      { text: "renewable", accent: true },
                      { text: "energy", accent: false },
                      { text: "transition.", accent: false },
                    ].map((w, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                        className={`inline-block mr-3 md:mr-4 font-display font-black tracking-tight leading-none text-[52px] md:text-[68px] lg:text-[72px] ${w.accent ? "text-primary" : "text-white"}`}
                      >
                        {w.text}
                      </motion.span>
                    ))}
                  </div>

                  {/* Tagline with animated left border */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex gap-4 items-start"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 1 }}
                      className="w-0.5 bg-primary/50 rounded-full flex-shrink-0 min-h-[48px]"
                    />
                    <p className="text-[17px] font-light text-white/50 leading-relaxed max-w-md">
                      Fostering a generation of innovators dedicated to sustainable, equitable, and clean energy solutions across the archipelago.
                    </p>
                  </motion.div>
                </div>

                {/* Giant ghost watermark */}
                <span className="absolute -bottom-8 -left-4 text-[160px] md:text-[220px] font-display font-black text-white/[0.018] select-none pointer-events-none leading-none tracking-[-0.05em]">
                  VISION
                </span>
              </div>

              {/* ━━━ RIGHT — MISSION (Editorial, Bold, Minimal) ━━━ */}
              <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 md:px-14 lg:px-20 py-28 relative overflow-hidden border-l border-black/5">

                <div className="relative z-10">
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-[11px] font-semibold tracking-[0.4em] text-black/25 uppercase mb-16"
                  >
                    Core Missions
                  </motion.p>

                  {/* Editorial numbered mission rows */}
                  <div className="flex flex-col">
                    {[
                      {
                        num: "01",
                        icon: <BookOpen className="w-5 h-5" />,
                        title: "Educate & Empower",
                        desc: "Equipping students with high-fidelity learning programs and deep technical knowledge in renewable energy.",
                      },
                      {
                        num: "02",
                        icon: <Zap className="w-5 h-5" />,
                        title: "Practical Action",
                        desc: "Implementing operational microgrid and biofuel field projects directly to communities across Indonesia.",
                      },
                      {
                        num: "03",
                        icon: <Users className="w-5 h-5" />,
                        title: "Green Advocacy",
                        desc: "Collaborating with state institutions for critical energy audits and policy advocacy at a national scale.",
                      },
                    ].map((m, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative"
                      >
                        {/* Top animated line */}
                        <div className="relative h-px bg-black/8 overflow-hidden mb-7">
                          <motion.div
                            initial={{ x: "-100%" }}
                            whileInView={{ x: "0%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: idx * 0.15 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 bg-gradient-to-r from-primary to-black/20"
                          />
                        </div>

                        <div className="flex items-start gap-6 pb-9">
                          {/* Large editorial number */}
                          <span className="text-[52px] md:text-[64px] font-display font-black leading-none tracking-tighter text-black/8 flex-shrink-0 select-none group-hover:text-primary/20 transition-colors duration-500 -mt-2">
                            {m.num}
                          </span>

                          <div className="flex-1 pt-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-black/40 group-hover:bg-primary group-hover:text-white transition-all duration-400">
                                {m.icon}
                              </div>
                              <h4 className="text-[20px] md:text-[24px] font-display font-black tracking-tight text-[#0a1410] group-hover:text-primary transition-colors duration-300">
                                {m.title}
                              </h4>
                            </div>
                            <p className="text-[14px] md:text-[15px] text-black/45 leading-relaxed font-light">
                              {m.desc}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Bottom line */}
                    <div className="relative h-px bg-black/8 overflow-hidden">
                      <motion.div
                        initial={{ x: "-100%" }}
                        whileInView={{ x: "0%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 bg-gradient-to-r from-primary to-black/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Ghost watermark */}
                <span className="absolute -bottom-8 -right-4 text-[160px] md:text-[220px] font-display font-black text-black/[0.018] select-none pointer-events-none leading-none tracking-[-0.05em]">
                  MISSION
                </span>
              </div>
            </div>
        </section>

        {/* 5. [Activity] Section */}
        <section
          id="activity"
          className="bg-canvas py-32 px-6 border-b border-divider-soft relative overflow-hidden"
        >
          <div className="w-full relative z-10 flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-16 max-w-xl">
              <span className="text-[14px] font-semibold tracking-wider text-primary uppercase mb-3 block">
                WHAT WE DO
              </span>
              <h2 className="text-[40px] font-display font-semibold tracking-tight text-ink uppercase">
                Our Programs
              </h2>
            </div>

            {/* WOW Auto-Playing Coverflow Carousel - FULLY RESPONSIVE */}
            <div
              className="w-screen relative -mx-6 md:-mx-12 lg:-mx-24 overflow-hidden mb-16"
              style={{ height: cardDims.height + 60 }}
            >
              {/* Sliding Track */}
              <motion.div
                animate={{
                  x: `calc(50vw - ${activeProgram * (cardDims.width + cardDims.gap) + cardDims.width / 2}px)`,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-0 flex items-center h-full"
                style={{ gap: cardDims.gap, willChange: "transform" }}
              >
                {[0, 1, 2, 3, 4].map((idx) => {
                  const isActive = idx === activeProgram;
                  return (
                    <motion.div
                      key={idx}
                      animate={{
                        scale: isActive ? 1 : 0.82,
                        opacity: isActive ? 1 : 0.4,
                        rotateY: isActive ? 0 : idx < activeProgram ? 18 : -18,
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => setActiveProgram(idx)}
                      className="relative flex-shrink-0 rounded-[28px] md:rounded-[40px] overflow-hidden shadow-2xl cursor-pointer group"
                      style={{
                        width: cardDims.width,
                        height: cardDims.height,
                        transformOrigin: "center center",
                      }}
                    >
                      {/* Background Image */}
                      <img
                        src={`https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop&sig=${idx}`}
                        alt="Program Item"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      {/* Gradient Overlay */}
                      <div
                        className={`absolute inset-0 transition-all duration-700 ${
                          isActive
                            ? "bg-gradient-to-t from-[#0b120f] via-[#0b120f]/50 to-transparent"
                            : "bg-black/70"
                        }`}
                      />
                      {/* Active State Content */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="absolute inset-x-0 bottom-0 p-5 md:p-8 lg:p-12 text-white flex flex-col justify-end"
                          >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 md:mb-6 border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white transform group-hover:rotate-45 transition-transform duration-300" />
                            </div>
                            <h3 className="text-[22px] md:text-[32px] lg:text-[40px] font-display font-bold leading-tight mb-2 md:mb-4 tracking-tight">
                              Lorem Ipsum Dolor Sit Amet
                            </h3>
                            <p className="text-[13px] md:text-[16px] lg:text-[18px] font-light text-white/80 leading-relaxed line-clamp-2">
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
              {/* Dot Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                {[0, 1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveProgram(i)}
                    aria-label={`Program ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === activeProgram
                        ? "w-7 bg-primary"
                        : "w-1.5 bg-black/30 hover:bg-black/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* "See More of Our Activities" Pill Button */}
            <motion.div {...fadeInUp} className="mb-20">
              <a
                href="#all-activities"
                className="border border-[#0f3036] hover:bg-[#0f3036] hover:text-white text-[#0f3036] text-[15px] font-semibold rounded-full px-8 py-3.5 transition-all duration-300 inline-flex items-center gap-2 transform active:scale-95"
              >
                See More of Our Activities
              </a>
            </motion.div>
          </div>
        </section>

        {/* 6. [Article] Section */}
        <section
          id="article"
          className="bg-canvas pt-32 pb-56 px-6 relative overflow-hidden"
        >
          <div className="w-full">
            <motion.div {...fadeInUp} className="mb-16">
              <span className="text-[14px] font-semibold tracking-wider text-primary uppercase mb-3 block">
                EDITORIALS & DISCOVERIES
              </span>
              <h2 className="text-[40px] font-display font-semibold tracking-tight text-ink">
                Featured Insights
              </h2>
            </motion.div>

            {/* Magazine layout - Restored and Resized */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Side: Featured Article (50% width now instead of 66%) */}
              {ARTICLES.filter((art) => art.featured).map((art) => (
                <motion.div
                  key={art.id}
                  {...fadeInUp}
                  className="flex flex-col justify-between border-r-0 lg:border-r border-divider-soft pr-0 lg:pr-12 gap-8"
                >
                  <div className="flex flex-col gap-6">
                    {/* Image resized to match standard 16:9 ratio rather than ultra-wide */}
                    <div className="w-full aspect-[16/9] rounded-[18px] overflow-hidden">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    {/* Category tag, date & read time */}
                    <div className="flex items-center gap-4 text-[12px] font-normal text-ink-muted-48">
                      <span className="text-primary font-semibold uppercase">
                        {art.category}
                      </span>
                      <span>•</span>
                      <span>{art.date}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>
                    {/* Large Title */}
                    <h3 className="text-[34px] font-display font-semibold tracking-tight text-ink leading-tight hover:text-primary transition-colors duration-200">
                      <a href="#article-read">{art.title}</a>
                    </h3>
                    {/* Paragraph description */}
                    <p className="text-[17px] font-normal text-ink-muted-80 leading-relaxed">
                      {art.desc}
                    </p>
                  </div>
                  {/* Author and Call */}
                  <div className="flex items-center justify-between pt-6 border-t border-divider-soft">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-canvas-parchment border border-hairline flex items-center justify-center font-semibold text-[12px] text-ink uppercase">
                        SRE
                      </div>
                      <span className="text-[14px] font-semibold text-ink">
                        {art.author}
                      </span>
                    </div>
                    <a
                      href="#read"
                      className="bg-[#0f3036] hover:bg-[#1b434b] text-white text-[14px] font-semibold tracking-tight rounded-full px-5 py-2 transition-all duration-300"
                    >
                      Read Article
                    </a>
                  </div>
                </motion.div>
              ))}

              {/* Right Side: List of Smaller Articles */}
              <div className="flex flex-col gap-8">
                <span className="text-[12px] font-semibold tracking-wider text-ink-muted-48 uppercase border-b border-divider-soft pb-2">
                  LATEST DISPATCHES
                </span>

                {ARTICLES.filter((art) => !art.featured).map((art) => (
                  <motion.div
                    key={art.id}
                    {...fadeInUp}
                    className="flex flex-col gap-4 pb-8 border-b border-divider-soft last:border-b-0"
                  >
                    <div className="flex items-center justify-between text-[12px] font-normal text-ink-muted-48">
                      <span className="text-primary font-semibold uppercase">
                        {art.category}
                      </span>
                      <span>{art.readTime}</span>
                    </div>
                    <h4 className="text-[21px] font-display font-semibold tracking-tight text-ink leading-snug hover:text-primary transition-colors duration-200">
                      <a href="#read">{art.title}</a>
                    </h4>
                    <p className="text-[14px] font-normal text-ink-muted-80 line-clamp-2 leading-relaxed">
                      {art.desc}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[12px] font-semibold text-ink-muted-80">
                        {art.author}
                      </span>
                      <a
                        href="#read"
                        className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-0.5"
                      >
                        Read <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          {/* Rolling Hills Vector Landscape (High-fidelity SVGs overlay with Gradients) */}
          <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none select-none z-0">
            <svg
              viewBox="0 0 1440 240"
              preserveAspectRatio="xMidYMax slice"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-[120px] md:h-auto translate-y-[1px]"
            >
              <defs>
                <linearGradient
                  id="hillGrad1"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#d3e0d8" />
                  <stop offset="100%" stopColor="#b2c0b9" />
                </linearGradient>
                <linearGradient
                  id="hillGrad2"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#b2c0b9" />
                  <stop offset="100%" stopColor="#0f3036" />
                </linearGradient>
                <linearGradient
                  id="hillGrad3"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#0f3036" />
                  <stop offset="100%" stopColor="#0b120f" />
                </linearGradient>
              </defs>

              {/* Layer 1: Back Light Sage Hill */}
              <path
                d="M-50 180 C 250 100, 500 210, 800 130 C 1100 50, 1300 140, 1500 90 L 1500 240 L -50 240 Z"
                fill="url(#hillGrad1)"
                opacity="0.8"
              />

              {/* Layer 2: Middle Sage Hill */}
              <path
                d="M-50 200 C 300 150, 700 230, 1000 160 C 1250 90, 1350 170, 1500 130 L 1500 240 L -50 240 Z"
                fill="url(#hillGrad2)"
              />

              {/* Layer 3: Foreground Deep Teal Hill */}
              <path
                d="M-50 220 C 400 180, 800 240, 1100 190 C 1280 150, 1380 200, 1500 170 L 1500 240 L -50 240 Z"
                fill="url(#hillGrad3)"
              />
            </svg>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-black text-white/70 py-12 px-6">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <h5 className="text-[20px] font-display font-bold tracking-tight text-white uppercase">
              SRE UPNVJT.
            </h5>
            <span className="text-[13px] font-normal text-white/50 text-center md:text-left">
              © 2026 Society of Renewable Energy UPN Veteran Jawa Timur. All
              rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-8 text-[14px] font-medium text-white/80">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              Instagram
            </a>
            <a
              href="mailto:sre.upnjatim@gmail.com"
              className="hover:text-primary transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
