"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Menu,
  X,
  Zap,
  Globe,
  Users,
  BookOpen,
  Calendar,
  Award,
  Cpu,
  Layers,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Share2,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
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

const PARTNERS = [
  "SRE Indonesia",
  "UPN Veteran Jawa Timur",
  "Ministry of Energy (ESDM)",
];

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

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink antialiased">
      {/* Main Stack of Full-Bleed alternating Tiles */}
      <main className="w-full flex flex-col overflow-hidden">
        {/* 2. [Home] Hero Section (Canvas: Custom Grid Pattern Mesh and Floating Energy Particles) */}
        <section
          id="home"
          className="relative min-h-[95vh] flex flex-col justify-center items-start py-24 px-6 md:px-16 overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1920&auto=format&fit=crop')",
          }}
        >
          {/* Deep ocean-teal gradient mask overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f3036]/95 via-[#0f3036]/85 to-[#0b120f]/98 pointer-events-none z-0" />

          {/* Premium CSS tech grid overlay line mesh */}
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60 z-0" />

          {/* Glowing Green Ambient Light Spot (seamless visual depth) */}
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0" />

          {/* Floating Micro-Particle Energy Nodes */}
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-primary-on-dark pointer-events-none opacity-20 z-0"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, 20, 0],
                opacity: [0.15, 0.35, 0.15],
              }}
              transition={{
                duration: 10 + p.delay * 2,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          <div className="max-w-7xl mx-auto w-full z-10 flex flex-col justify-center items-start h-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl text-left flex flex-col items-start"
            >
              <h1 className="text-[44px] md:text-[68px] lg:text-[88px] font-display font-semibold tracking-tight text-white leading-[1.05] uppercase mb-4">
                SOCIETY OF <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-on-dark to-[#8fc3a7] drop-shadow-sm">
                  RENEWABLE ENERGY
                </span>
              </h1>

              <p className="text-[20px] md:text-[28px] font-light text-white/90 leading-relaxed mb-6 font-sans">
                UPN Veteran Jawa Timur
              </p>

              <div className="bg-[#1b434b]/60 border border-white/5 backdrop-blur-md rounded-full px-5 py-2 mb-10 select-none shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                <span className="text-[14px] md:text-[16px] font-semibold tracking-wider text-primary-on-dark uppercase">
                  #REassemblingSRE
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <a
                  href="#about"
                  className="bg-primary hover:bg-primary-focus text-white text-[16px] font-semibold tracking-tight rounded-full px-8 py-3.5 transition-all duration-300 transform active:scale-95 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                >
                  Explore Chapter
                </a>
                <a
                  href="#join"
                  className="border border-white/30 hover:bg-white/10 text-white text-[16px] font-semibold tracking-tight rounded-full px-8 py-3.5 transition-all duration-300 transform active:scale-95"
                >
                  Join Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Seamless Infinite Loop Partner Marquee Scroller */}
        <section className="bg-surface-black border-y border-white/5 py-8 overflow-hidden z-10 select-none">
          <div className="w-full flex items-center">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
              {PARTNERS.concat(PARTNERS).map((p, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-on-dark" />
                  <span className="text-[13px] md:text-[14px] font-display font-semibold tracking-widest text-body-muted uppercase">
                    {p}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. [About] Section (Canvas: #ffffff) */}
        <section
          id="about"
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
              style={{
                filter: "drop-shadow(0 20px 40px rgba(19, 31, 28, 0.08))",
              }}
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
                  <p className="text-[14px] font-normal text-ink-muted-48 uppercase tracking-widest">
                    CHAPTER FOCUS
                  </p>
                  <p className="text-[17px] font-semibold text-ink mt-1">
                    Operational microgrids, biofuel experiments, & green
                    advocacy.
                  </p>
                </div>
              </motion.div>

              {/* Right Descriptions */}
              <motion.div
                {...fadeInUp}
                className="flex-[1.5] flex flex-col justify-start gap-8 text-[17px] leading-relaxed text-ink/85 font-light"
              >
                <p className="text-[20px] font-normal text-ink leading-relaxed">
                  <strong>Society of Renewable Energy (SRE)</strong> is a
                  student-led organization that aims to spark student’s role in
                  the field of new and renewable energy.
                </p>
                <p>
                  <strong>SRE UPN Veteran Jawa Timur</strong>, the key
                  operational student chapter, was established to accelerate
                  Indonesia's energy transition by providing high-fidelity
                  learning programs, practical microgrid field projects, and
                  institutional energy audits for the members.
                </p>
                <div className="pt-4 flex items-center gap-4">
                  <a
                    href="#activity"
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
          id="map"
          className="bg-surface-tile-1 text-white py-32 px-6 overflow-hidden border-b border-hairline/10 relative"
        >
          {/* Subtle background abstract shapes */}
          <div className="absolute inset-0 bg-[#0f3036]/50 opacity-40 pointer-events-none" />

          {/* Subtle grid mesh backdrop */}
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20" />

          <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
            {/* Header */}
            <motion.div
              {...fadeInUp}
              className="text-center mb-16 max-w-2xl flex flex-col items-center"
            >
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
              <svg
                viewBox="0 0 800 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full opacity-60"
              >
                {/* Sumatra path simplified */}
                <path
                  d="M 50 80 L 150 160 L 130 180 L 30 90 Z"
                  fill="#34d399"
                  opacity="0.25"
                />
                <path
                  d="M 50 80 L 150 160 L 130 180 L 30 90 Z"
                  stroke="#34d399"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />

                {/* Java path simplified */}
                <path
                  d="M 140 180 L 280 190 L 280 200 L 140 190 Z"
                  fill="#34d399"
                  opacity="0.25"
                />
                <path
                  d="M 140 180 L 280 190 L 280 200 L 140 190 Z"
                  stroke="#34d399"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />

                {/* Kalimantan path simplified */}
                <path
                  d="M 190 70 L 260 65 L 280 120 L 190 125 Z"
                  fill="#34d399"
                  opacity="0.25"
                />
                <path
                  d="M 190 70 L 260 65 L 280 120 L 190 125 Z"
                  stroke="#34d399"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />

                {/* Sulawesi path simplified */}
                <path
                  d="M 330 80 L 370 75 L 365 130 L 330 110 Z"
                  fill="#34d399"
                  opacity="0.25"
                />
                <path
                  d="M 330 80 L 370 75 L 365 130 L 330 110 Z"
                  stroke="#34d399"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />

                {/* Papua path simplified */}
                <path
                  d="M 460 120 L 560 125 L 550 160 L 480 150 Z"
                  fill="#34d399"
                  opacity="0.25"
                />
                <path
                  d="M 460 120 L 560 125 L 550 160 L 480 150 Z"
                  stroke="#34d399"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />

                {/* Major Chapter Nodes */}
                <circle
                  cx="60"
                  cy="90"
                  r="4"
                  fill="#34d399"
                  className="animate-ping"
                />
                <circle cx="60" cy="90" r="3.5" fill="#34d399" />
                <circle
                  cx="155"
                  cy="180"
                  r="4"
                  fill="#34d399"
                  className="animate-ping"
                />
                <circle cx="155" cy="180" r="3.5" fill="#34d399" />
                <circle
                  cx="175"
                  cy="185"
                  r="4"
                  fill="#34d399"
                  className="animate-ping"
                />
                <circle cx="175" cy="185" r="3.5" fill="#34d399" />
                <circle
                  cx="235"
                  cy="192"
                  r="5"
                  fill="#10b981"
                  className="animate-pulse"
                />
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
                <p className="text-[11px] font-normal text-body-muted uppercase tracking-wider">
                  WITH MORE THAN
                </p>
                <p className="text-[16px] font-display font-semibold text-primary-on-dark tracking-tight">
                  2000+ Active Members
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute bottom-2 right-4 md:bottom-6 md:right-12 bg-[#0c2a2f]/80 backdrop-blur-md border border-white/5 px-5 py-3 rounded-[18px] text-left shadow-lg pointer-events-none"
              >
                <p className="text-[11px] font-normal text-body-muted uppercase tracking-wider">
                  WE ARE CURRENTLY SPREAD ACROSS
                </p>
                <p className="text-[16px] font-display font-semibold text-primary-on-dark tracking-tight">
                  40+ Universities Chapters
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. [Activity] Section */}
        <section
          id="activity"
          className="bg-canvas py-32 px-6 border-b border-divider-soft relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-16 max-w-xl">
              <span className="text-[14px] font-semibold tracking-wider text-primary uppercase mb-3 block">
                WHAT WE DO
              </span>
              <h2 className="text-[40px] font-display font-semibold tracking-tight text-ink uppercase">
                Our Programs
              </h2>
            </div>

            {/* Activities grid cards with rounded corners and solid teal-footers */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16"
            >
              {REDESIGNED_ACTIVITIES.map((act) => (
                <motion.div
                  key={act.id}
                  variants={fadeInUp}
                  className="bg-canvas border border-hairline/80 rounded-[18px] overflow-hidden flex flex-col justify-between h-[460px] transition-all duration-300 hover:scale-[1.01] hover:border-primary/45 group"
                  style={{
                    filter: "drop-shadow(0 15px 30px rgba(19, 31, 28, 0.04))",
                  }}
                >
                  {/* Top Image */}
                  <div className="w-full flex-1 overflow-hidden relative">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                  </div>

                  {/* Deep Teal Footer Band */}
                  <div className="bg-[#0f3036] text-white p-6 flex flex-col justify-center text-center h-[160px] relative z-10">
                    <h3 className="text-[22px] font-display font-semibold tracking-tight uppercase mb-2 text-primary-on-dark">
                      {act.title}
                    </h3>
                    <p className="text-[14px] font-light text-body-muted leading-relaxed line-clamp-3">
                      {act.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Slider Dots indicators */}
            <div className="flex items-center justify-center gap-2.5 mb-12">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="w-2 h-2 rounded-full bg-hairline" />
              <span className="w-2 h-2 rounded-full bg-hairline" />
              <span className="w-2 h-2 rounded-full bg-hairline" />
              <span className="w-2 h-2 rounded-full bg-hairline" />
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

          {/* Rolling Hills Vector Landscape (High-fidelity SVGs overlay with Gradients) */}
          <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none select-none z-0">
            <svg
              viewBox="0 0 1440 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto translate-y-2"
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

              {/* Minimalist vector conifer and pine trees */}
              <g transform="translate(150, 130) scale(0.65)">
                <rect x="-1.5" y="0" width="3" height="8" fill="#131f1c" />
                <polygon points="0,-12 -8,-4 8,-4" fill="#8da396" />
                <polygon points="0,-7 -6,0 6,0" fill="#8da396" />
              </g>

              <g transform="translate(540, 160) scale(0.8)">
                <rect x="-2" y="0" width="4" height="10" fill="#131f1c" />
                <polygon points="0,-15 -9,-5 9,-5" fill="#8da396" />
                <polygon points="0,-9 -7,0 7,0" fill="#8da396" />
              </g>

              <g transform="translate(960, 140) scale(0.9)">
                <rect x="-2" y="0" width="4" height="12" fill="#131f1c" />
                <polygon points="0,-16 -10,-5 10,-5" fill="#1b2621" />
                <polygon points="0,-9 -8,0 8,0" fill="#1b2621" />
              </g>

              <g transform="translate(1380, 160) scale(0.75)">
                <rect x="-1.5" y="0" width="3" height="9" fill="#131f1c" />
                <polygon points="0,-13 -8,-4 8,-4" fill="#0f3036" />
                <polygon points="0,-7 -6,0 6,0" fill="#0f3036" />
              </g>
            </svg>
          </div>
        </section>

        {/* 6. [Article] Section */}
        <section
          id="article"
          className="bg-canvas py-32 px-6 border-b border-divider-soft"
        >
          <div className="max-w-7xl mx-auto w-full">
            <motion.div {...fadeInUp} className="mb-16">
              <span className="text-[14px] font-semibold tracking-wider text-primary uppercase mb-3 block">
                EDITORIALS & DISCOVERIES
              </span>
              <h2 className="text-[40px] font-display font-semibold tracking-tight text-ink">
                Featured Insights
              </h2>
            </motion.div>

            {/* Magazine layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Side: Large Featured Article (2 columns wide) */}
              {ARTICLES.filter((art) => art.featured).map((art) => (
                <motion.div
                  key={art.id}
                  {...fadeInUp}
                  className="lg:col-span-2 flex flex-col justify-between border-r border-divider-soft pr-0 lg:pr-12 gap-8"
                >
                  <div className="flex flex-col gap-6">
                    {/* Large crisp image */}
                    <div className="w-full aspect-[21/9] rounded-[18px] overflow-hidden">
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
        </section>

        {/* 7. [Student] Section (Canvas: surface-tile-2 - Bento Box Glassmorphism) */}
        <section
          id="student"
          className="bg-surface-tile-2 text-white py-32 px-6 border-b border-hairline/15 relative"
        >
          {/* Subtle grid mesh pattern */}
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-10" />

          <div className="max-w-7xl mx-auto w-full relative z-10">
            <motion.div {...fadeInUp} className="mb-20 max-w-xl">
              <span className="text-[14px] font-semibold tracking-wider text-primary-on-dark uppercase mb-3 block">
                ORGANIZATIONAL INFRASTRUCTURE
              </span>
              <h2 className="text-[40px] font-display font-semibold tracking-tight text-white leading-tight">
                Our Student Bento Infrastructure
              </h2>
              <p className="text-[17px] font-normal text-body-muted mt-4 leading-relaxed">
                How our operations are configured to drive clean tech
                integration, rural expansion, and elite academic publishing.
              </p>
            </motion.div>

            {/* Asymmetrical Bento Grid with Premium Translucent Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1 (Large 2-column span on desktop) */}
              <motion.div
                {...fadeInUp}
                className="md:col-span-2 bg-[#1b434b]/15 border border-white/5 backdrop-blur-lg rounded-[18px] p-8 flex flex-col justify-between gap-12 group hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3.5 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors duration-300">
                    <Cpu className="w-6 h-6 text-primary-on-dark" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-primary-on-dark uppercase bg-white/5 border border-white/5 rounded-full px-3 py-1">
                    RESEARCH ENGINE
                  </span>
                </div>
                <div>
                  <h3 className="text-[28px] font-display font-semibold tracking-tight text-white mb-3">
                    Research & Technical Development
                  </h3>
                  <p className="text-[17px] font-light text-body-muted leading-relaxed max-w-2xl">
                    Focuses on computational modeling, hybrid microgrid
                    simulation, and the physical optimization of monocrystalline
                    solar systems. Members run testing rigs for clean hydrogen
                    generation and organic waste biofuels.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    "PV Modeling",
                    "Microgrid Design",
                    "Biofuels Testing",
                    "Hydrogen Labs",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-[12px] font-normal bg-white/5 border border-white/5 px-3 py-1 rounded-full text-body-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Box 2 (1-column span) */}
              <motion.div
                {...fadeInUp}
                className="bg-[#1b434b]/15 border border-white/5 backdrop-blur-lg rounded-[18px] p-8 flex flex-col justify-between gap-10 group hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3.5 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors duration-300">
                    <Globe className="w-6 h-6 text-primary-on-dark" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-primary-on-dark uppercase bg-white/5 border border-white/5 rounded-full px-3 py-1">
                    FIELD DEPLOYMENT
                  </span>
                </div>
                <div>
                  <h3 className="text-[24px] font-display font-semibold tracking-tight text-white mb-2">
                    Community Empowerment
                  </h3>
                  <p className="text-[14px] font-light text-body-muted leading-relaxed">
                    Deploying engineering solutions directly to rural off-grid
                    sectors in East Java. We install solar pumping systems and
                    hybrid battery grids.
                  </p>
                </div>
                <a
                  href="#deploy"
                  className="text-[14px] font-semibold text-primary-on-dark hover:underline flex items-center gap-1 group/link"
                >
                  Explore Deployments
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                </a>
              </motion.div>

              {/* Box 3 (1-column span) */}
              <motion.div
                {...fadeInUp}
                className="bg-[#1b434b]/15 border border-white/5 backdrop-blur-lg rounded-[18px] p-8 flex flex-col justify-between gap-10 group hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3.5 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors duration-300">
                    <Users className="w-6 h-6 text-primary-on-dark" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-primary-on-dark uppercase bg-white/5 border border-white/5 rounded-full px-3 py-1">
                    MENTOR COLLAB
                  </span>
                </div>
                <div>
                  <h3 className="text-[24px] font-display font-semibold tracking-tight text-white mb-2">
                    Professional Networks
                  </h3>
                  <p className="text-[14px] font-light text-body-muted leading-relaxed">
                    Connecting our students directly with renewable energy
                    corporate executives, certification boards, and state
                    engineering mentors.
                  </p>
                </div>
                <a
                  href="#network"
                  className="text-[14px] font-semibold text-primary-on-dark hover:underline flex items-center gap-1 group/link"
                >
                  See Corporate Partners
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                </a>
              </motion.div>

              {/* Box 4 (Large 2-column span on desktop) */}
              <motion.div
                {...fadeInUp}
                className="md:col-span-2 bg-[#1b434b]/15 border border-white/5 backdrop-blur-lg rounded-[18px] p-8 flex flex-col justify-between gap-12 group hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3.5 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors duration-300">
                    <Layers className="w-6 h-6 text-primary-on-dark" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-primary-on-dark uppercase bg-white/5 border border-white/5 rounded-full px-3 py-1">
                    COALITION ALLIANCE
                  </span>
                </div>
                <div>
                  <h3 className="text-[28px] font-display font-semibold tracking-tight text-white mb-3">
                    National Integration (SRE Indonesia)
                  </h3>
                  <p className="text-[17px] font-light text-body-muted leading-relaxed max-w-2xl">
                    UPN Veteran Jawa Timur is a key integrated hub of the larger
                    SRE Indonesia coalition, linking over 40 major active
                    university chapters nationwide in joint technology
                    development, policy submissions, and green summits.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-primary-on-dark" />
                  <span className="text-[12px] font-semibold text-body-muted tracking-tight">
                    Active joint actions across 34 Indonesian provinces.
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 8. [Merchandise] Section */}
        <section
          id="merchandise"
          className="bg-canvas py-32 px-6 border-b border-divider-soft"
        >
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
              <motion.div {...fadeInUp}>
                <span className="text-[14px] font-semibold tracking-wider text-primary uppercase mb-3 block">
                  LIMITED EXCLUSIVES
                </span>
                <h2 className="text-[40px] font-display font-semibold tracking-tight text-ink">
                  SRE Supply Store
                </h2>
              </motion.div>
              <motion.p
                {...fadeInUp}
                className="text-[17px] font-normal text-ink-muted-80 max-w-md leading-relaxed animate-pulse"
              >
                Support our sustainable off-grid project initiatives. 100% of
                store proceeds fund student materials for microgrid community
                deployments.
              </motion.p>
            </div>

            {/* Apple Store grid style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MERCHANDISE.map((item) => (
                <motion.div
                  key={item.id}
                  {...fadeInUp}
                  className="group relative border border-hairline rounded-[18px] bg-canvas overflow-hidden flex flex-col justify-between p-6 h-[480px] transition-transform duration-300 hover:scale-[1.01]"
                  onMouseEnter={() => setHoveredMerch(item.id)}
                  onMouseLeave={() => setHoveredMerch(null)}
                >
                  {/* Subtle hover blur background / overlay */}
                  <div className="absolute inset-0 bg-canvas-parchment opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

                  {/* Centered Image (Square 1:1) */}
                  <div className="w-full aspect-square rounded-[8px] overflow-hidden mb-6 flex items-center justify-center bg-canvas-parchment relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                  </div>

                  {/* Meta Content */}
                  <div>
                    <h3 className="text-[21px] font-display font-semibold tracking-tight text-ink">
                      {item.name}
                    </h3>
                    <p className="text-[14px] font-normal text-ink-muted-48 uppercase tracking-widest mt-1">
                      {item.price}
                    </p>
                    <p className="text-[14px] font-normal text-ink-muted-80 mt-2 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* Action Pill Pre-order */}
                  <div className="mt-6 h-11 relative overflow-hidden">
                    <AnimatePresence>
                      {hoveredMerch === item.id ? (
                        <motion.button
                          initial={{ y: 40, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 40, opacity: 0 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="absolute inset-0 w-full bg-primary hover:bg-primary-focus text-white text-[14px] font-semibold tracking-tight rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
                        >
                          <ShoppingBag className="w-4 h-4" /> Pre-order Now
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ y: 0, opacity: 1 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -40, opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-start text-[14px] font-semibold text-primary"
                        >
                          Hover to inspect
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic call to action at the bottom */}
        <section
          id="join"
          className="bg-surface-black text-white py-32 px-6 flex flex-col justify-center items-center text-center overflow-hidden relative"
        >
          {/* subtle grid background mesh */}
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20" />

          <motion.div
            {...fadeInUp}
            className="max-w-3xl mx-auto flex flex-col items-center relative z-10"
          >
            <span className="text-[14px] font-semibold tracking-wider text-primary-on-dark uppercase mb-4">
              MEMBERSHIP REGISTRATION 2026
            </span>
            <h2 className="text-[44px] md:text-[56px] font-display font-semibold tracking-tighter text-white leading-[1.1] mb-6 uppercase">
              Empower the transition. <br />
              Become a catalyst.
            </h2>
            <p className="text-[21px] font-light text-body-muted max-w-xl leading-relaxed mb-10">
              Applications are officially open for new researchers, engineering
              leads, and campaign managers. Join the movement.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#form"
                className="bg-primary hover:bg-primary-focus text-white text-[17px] font-semibold tracking-tight rounded-full px-8 py-3.5 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Apply Online
              </a>
              <a
                href="mailto:sre.upnjatim@gmail.com"
                className="text-[17px] font-semibold text-primary-on-dark hover:underline flex items-center gap-1 group"
              >
                Inquire via Email{" "}
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-canvas-parchment text-ink-muted-80 py-20 px-6 border-t border-hairline">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            {/* Column 1: About */}
            <div className="flex flex-col gap-4">
              <h5 className="text-[14px] font-display font-semibold tracking-wide text-ink uppercase">
                About Chapter
              </h5>
              <div className="flex flex-col gap-2 text-[14px] font-normal leading-relaxed text-ink-muted-80">
                <a href="#about" className="hover:text-primary">
                  Who We Are
                </a>
                <a href="#about" className="hover:text-primary">
                  Executive Committee
                </a>
                <a href="#student" className="hover:text-primary">
                  Operations Infrastructure
                </a>
                <a href="#join" className="hover:text-primary">
                  Chapters Career
                </a>
              </div>
            </div>

            {/* Column 2: Projects */}
            <div className="flex flex-col gap-4">
              <h5 className="text-[14px] font-display font-semibold tracking-wide text-ink uppercase">
                Active Projects
              </h5>
              <div className="flex flex-col gap-2 text-[14px] font-normal leading-relaxed text-ink-muted-80">
                <a href="#student" className="hover:text-primary">
                  PV Microgrid Labs
                </a>
                <a href="#activity" className="hover:text-primary">
                  Socio-Electrics Grid
                </a>
                <a href="#student" className="hover:text-primary">
                  Biofuels Research
                </a>
                <a href="#student" className="hover:text-primary">
                  Smart Campus Generation
                </a>
              </div>
            </div>

            {/* Column 3: Community */}
            <div className="flex flex-col gap-4">
              <h5 className="text-[14px] font-display font-semibold tracking-wide text-ink uppercase">
                Community Hub
              </h5>
              <div className="flex flex-col gap-2 text-[14px] font-normal leading-relaxed text-ink-muted-80">
                <a href="#join" className="hover:text-primary">
                  Active Memberships
                </a>
                <a href="#activity" className="hover:text-primary">
                  Calendar & Events
                </a>
                <a href="#merchandise" className="hover:text-primary">
                  Supply Store
                </a>
                <a href="#article" className="hover:text-primary">
                  Research Dispatches
                </a>
              </div>
            </div>

            {/* Column 4: SRE Networks */}
            <div className="flex flex-col gap-4">
              <h5 className="text-[14px] font-display font-semibold tracking-wide text-ink uppercase">
                Connect & Alliance
              </h5>
              <div className="flex flex-col gap-2 text-[14px] font-normal leading-relaxed text-ink-muted-80">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary flex items-center gap-1"
                >
                  LinkedIn <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary flex items-center gap-1"
                >
                  Instagram <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="mailto:sre.upnjatim@gmail.com"
                  className="hover:text-primary"
                >
                  Email Outreach
                </a>
                <a
                  href="https://sre.id"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary flex items-center gap-1"
                >
                  SRE Indonesia National <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Legal bar */}
          <div className="pt-8 border-t border-divider-soft flex flex-col md:flex-row items-center justify-between gap-6 text-[12px] font-normal text-ink-muted-48">
            <div className="flex items-center gap-2">
              <span>
                © 2026 Society of Renewable Energy (SRE) UPN Veteran Jawa Timur.
                All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="hover:text-primary">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-primary">
                Terms of Action
              </a>
              <a href="#security" className="hover:text-primary">
                Infrastructure Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
