"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowUpRight,
  Eye,
  Sprout,
  Globe,
  Building2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { getPublicContent } from "@/app/actions/contentActions";

export const dynamic = "force-dynamic";

// ── Shared animation primitives ───────────────────────────────────────────────
// All whileInView uses viewport={{ once: true }} to prevent re-trigger on scroll-up.
const fadeInUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
};

// Stagger parent — children stagger with a capped budget (~500ms for 3 items)
const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const ARTICLES = [
  {
    id: 1,
    title: "The Role of Biofuels in East Java's Transitioning Green Economy",
    category: "Academic Inquiry",
    date: "MAY 24, 2026",
    author: "R&D Division",
    readTime: "8 min read",
    desc: "An analytical deep-dive into agricultural waste biogas systems, local refinery integration, and the scalability of micro-scale biofuel converters in decentralized communities.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=400&auto=format&fit=crop",
    featured: false,
  },
];

const PARTNERS = ["SRE Indonesia", "UPN Veteran Jawa Timur", "SRE UPNVJT"];

const MOCK_ACTIVITIES = [
  {
    id: "mock-1",
    title: "RENEWABLE ENERGY CAMP",
    description: "A comprehensive training program on solar microgrids and local biogas system designs for youth leaders.",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "mock-2",
    title: "CAMPUS ENERGY AUDIT",
    description: "Conducting high-fidelity electrical consumption analysis and building-level energy efficiency audits across UPNVJT.",
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "mock-3",
    title: "ECO-INNOVATION COMPETITION",
    description: "Student innovation challenge focused on designing low-cost, decentralized green energy solutions for rural farming communities.",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
  }
];

export default function Home() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && (theme === "light" || resolvedTheme === "light");

  const [activeSection, setActiveSection] = useState("home");
  const [activeProgram, setActiveProgram] = useState(0);
  const [partnersList, setPartnersList] = useState([]);
  const [publicArticlesList, setPublicArticlesList] = useState([]);
  const [publicActivitiesList, setPublicActivitiesList] = useState([]);
  const [publicTestimonialsList, setPublicTestimonialsList] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPartnersList(data); })
      .catch(console.error);
    
    fetch('/api/events/public')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formatted = data.map(ev => ({
            id: ev.id,
            title: ev.title,
            description: ev.description,
            imageUrl: ev.bannerUrl,
          }));
          setPublicActivitiesList(formatted.length > 0 ? formatted : MOCK_ACTIVITIES);
        } else {
          setPublicActivitiesList(MOCK_ACTIVITIES);
        }
      })
      .catch(() => { setPublicActivitiesList(MOCK_ACTIVITIES); });

    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPublicTestimonialsList(data); })
      .catch(console.error);
    
    getPublicContent().then(res => {
      if (res.success && res.data) {
        const formatted = res.data.map((art, index) => ({
          id: art.id,
          title: art.title,
          category: "News",
          date: new Date(art.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase(),
          author: art.author?.name || "SRE UPNVJT",
          readTime: "5 min read",
          desc: art.body.substring(0, 150).replace(/<[^>]*>?/gm, '') + "...",
          image: art.imageUrl || "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
          featured: index === 0,
          slug: art.slug
        }));
        setPublicArticlesList(formatted.length > 0 ? formatted : ARTICLES);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = ["home", "about", "activity", "article", "student", "merchandise"];
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

  useEffect(() => {
    if (publicActivitiesList.length > 0) {
      const timer = setInterval(() => {
        setActiveProgram((prev) => (prev + 1) % publicActivitiesList.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [publicActivitiesList.length]);

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
      <main className="w-full flex flex-col overflow-hidden">

        {/* ══════════════════════════════════════════════════════════════════════
            HERO SECTION — DO NOT MODIFY
            ══════════════════════════════════════════════════════════════════════ */}
        <section
          id="home"
          className={`relative min-h-screen flex flex-col justify-center items-start py-24 px-8 sm:px-12 md:px-20 lg:px-24 overflow-hidden ${
            isLight ? "bg-white" : "bg-[#0a1c15]"
          }`}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1920&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          
          {isLight ? (
            <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }} />
          ) : (
            <>
              {/* Dark green multiply overlay for crisp dark mode contrast */}
              <div className="absolute inset-0 bg-[#0a2e24] opacity-80 mix-blend-multiply z-0 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#08201a]/30 to-[#08201a]/80 z-0 pointer-events-none" />
            </>
          )}

          <div className="w-full max-w-7xl mx-auto z-10 flex flex-col justify-center items-start h-full mt-12 md:mt-20">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[46px] sm:text-[72px] md:text-[110px] lg:text-[130px] font-display font-black tracking-[-0.04em] leading-[0.85] uppercase flex flex-col items-start w-full"
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
                <span className={isLight ? "text-white" : "text-white drop-shadow-md"}>SOCIETY</span>
                <span className={`text-[28px] sm:text-[40px] md:text-[64px] lg:text-[72px] font-serif italic font-normal normal-case tracking-normal transform -translate-y-1 md:-translate-y-4 ${
                  isLight ? "text-white" : "text-[#e8ecc4]"
                }`}>of</span>
              </div>
              <div className={isLight ? "text-white" : "text-[#e8ecc4] drop-shadow-md"}>RENEWABLE</div>
              <div className={isLight ? "text-white" : "text-white drop-shadow-md"}>ENERGY</div>
            </motion.h1>
          </div>

          <div className="absolute bottom-8 md:bottom-12 right-8 md:right-16 lg:right-24 z-10 flex flex-col items-end">
            <span className={`text-[12px] sm:text-[14px] font-medium tracking-wide text-right ${
              isLight ? "text-white" : "text-white/90 drop-shadow-md"
            }`}>
              Student Organization at <strong className="text-white font-bold block sm:inline">UPN Veteran Jawa Timur</strong>
            </span>
          </div>

          <div className={`absolute bottom-0 left-0 w-full h-[2px] z-20 ${
            isLight ? "bg-slate-200" : "bg-[#e8ecc4]"
          }`} />
        </section>
        {/* ══════════════════════════════════════════════════════════════════════
            END HERO — DO NOT MODIFY ABOVE
            ══════════════════════════════════════════════════════════════════════ */}

        {/* Marquee ticker */}
        <div className="bg-white dark:bg-[#050e09] border-y border-slate-200 dark:border-white/5 py-5 overflow-hidden flex select-none relative z-10" aria-hidden="true">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex whitespace-nowrap gap-16 px-8 items-center shrink-0 min-w-full"
          >
            {Array(16).fill(PARTNERS).flat().map((p, idx) => (
              <div key={idx} className="flex items-center gap-6 shrink-0">
                <span className="text-[13px] md:text-[14px] font-display font-semibold tracking-widest text-[#07130e] dark:text-white/50 uppercase">{p}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#07130e] dark:bg-white/30 shrink-0" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── About / Who We Are Section — 100vh Editorial ──────────────────── */}
        <section
          id="about"
          className="scroll-mt-20 relative overflow-hidden border-b border-slate-200 dark:border-white/5"
          style={{ minHeight: "100vh" }}
        >
          {/* Light mode: faint green tint bg */}
          <div className="absolute inset-0 bg-[rgba(16,185,129,0.03)] dark:bg-transparent pointer-events-none" aria-hidden="true" />
          {/* Dark mode: dot-grid texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none hidden dark:block opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />
          {/* Decorative "01" watermark bottom-right */}
          <span
            className="absolute bottom-0 right-4 lg:right-12 font-display font-black text-[180px] lg:text-[220px] leading-none select-none pointer-events-none text-[#07130e] dark:text-white opacity-[0.04] tracking-tighter"
            aria-hidden="true"
          >
            01
          </span>

          <div className="relative z-10 w-full h-full max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col lg:flex-row min-h-screen">

            {/* ── LEFT COLUMN: Giant Identity Typography (40%) ── */}
            <motion.div
              initial={{ opacity: 0, x: -48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-[40%] flex flex-col justify-center py-20 lg:py-0 lg:pr-12 shrink-0"
            >
              {/* WHO WE ARE plain label */}
              <div className="flex items-center gap-2 mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-primary" aria-hidden="true" />
                <span className="text-[13px] sm:text-[14px] font-bold tracking-[0.28em] text-emerald-800 dark:text-primary uppercase">
                  WHO WE ARE
                </span>
              </div>

              {/* Giant Stacked Type */}
              <div className="flex flex-col items-start leading-[0.88] tracking-tight select-none">
                {/* "SRE" — outline/stroke style */}
                <span
                  className="font-display font-black uppercase text-[72px] sm:text-[96px] lg:text-[120px] text-transparent"
                  style={{
                    WebkitTextStroke: "2px currentColor",
                    color: "transparent",
                  }}
                  aria-hidden="true"
                >
                  <span className="text-emerald-600 dark:text-primary" style={{ WebkitTextStroke: "2.5px" }}>SRE</span>
                </span>
                {/* "INDONESIA" — solid bold */}
                <span className="font-display font-black uppercase text-[60px] sm:text-[80px] lg:text-[96px] text-[#07130e] dark:text-white leading-none">
                  INDONESIA
                </span>
                {/* "× UPN JATIM" — smaller accent in green */}
                <span className="font-display font-black uppercase text-[28px] sm:text-[36px] lg:text-[48px] text-emerald-700 dark:text-primary leading-tight mt-2">
                  × UPN JATIM
                </span>
              </div>

              {/* 1-line descriptor */}
              <p className="mt-8 text-[13px] sm:text-[14px] tracking-[0.18em] font-medium text-[#07130e]/50 dark:text-white/40 uppercase">
                Student Chapter · Est. 2021 · Surabaya
              </p>
            </motion.div>

            {/* ── RIGHT COLUMN: Content Blocks (60%) ── */}
            <motion.div
              initial={{ opacity: 0, x: 48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="w-full lg:w-[60%] flex flex-col justify-center py-16 lg:py-0 lg:pl-12 lg:border-l lg:border-slate-200 lg:dark:border-white/8"
            >

              {/* ── Block 1: About SRE Indonesia ── */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-[2px] h-10 bg-emerald-600 dark:bg-primary shrink-0 rounded-full" aria-hidden="true" />
                  <span className="text-[12px] sm:text-[13px] font-bold tracking-[0.28em] text-emerald-800 dark:text-primary uppercase">
                    ABOUT SRE INDONESIA
                  </span>
                </div>
                <p className="text-[15px] sm:text-[16px] lg:text-[17px] font-light text-[#07130e]/75 dark:text-white/65 leading-[1.75] max-w-lg">
                  <strong className="font-semibold text-[#07130e] dark:text-white">Society of Renewable Energy (SRE) Indonesia</strong> is the national student organization dedicated to accelerating Indonesia&apos;s transition to clean and sustainable energy. Founded to unite student chapters across universities, SRE Indonesia drives education, research, and grassroots action on renewable energy at a national scale.
                </p>
              </div>

              {/* Thin green divider */}
              <div className="w-full h-px bg-gradient-to-r from-emerald-600/40 dark:from-primary/40 via-emerald-400/20 dark:via-primary/20 to-transparent mb-10" aria-hidden="true" />

              {/* ── Block 2: Our Chapter ── */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-[2px] h-10 bg-emerald-600 dark:bg-primary shrink-0 rounded-full" aria-hidden="true" />
                  <span className="text-[12px] sm:text-[13px] font-bold tracking-[0.28em] text-emerald-800 dark:text-primary uppercase">
                    OUR CHAPTER
                  </span>
                </div>
                <p className="text-[15px] sm:text-[16px] lg:text-[17px] font-light text-[#07130e]/75 dark:text-white/65 leading-[1.75] max-w-lg">
                  <strong className="font-semibold text-[#07130e] dark:text-white">SRE UPN Veteran Jawa Timur</strong> is an official local chapter of SRE Indonesia based in Surabaya. Since 2021, we have been empowering students through hands-on renewable energy programs, campus energy audits, and community-driven sustainability initiatives across East Java.
                </p>
              </div>

              {/* ── Badge Row ── */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                }}
                className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10"
              >
                {[
                  { text: "Est. 2021", Icon: Sprout },
                  { text: "SRE Indonesia Member", Icon: Globe },
                  { text: "UPN Veteran Jawa Timur", Icon: Building2 },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                    }}
                    className="group inline-flex items-center gap-2 pb-0.5 border-b border-emerald-600/30 dark:border-primary/30 hover:border-emerald-600 dark:hover:border-primary transition-colors duration-200 cursor-default"
                  >
                    <stat.Icon className="w-3.5 h-3.5 text-emerald-700 dark:text-primary shrink-0" aria-hidden="true" />
                    <span className="text-[13px] font-semibold text-[#07130e]/80 dark:text-white/70 tracking-wide">
                      {stat.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* ── CTA ── */}
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 w-fit focus-visible:outline-emerald-600 focus-visible:outline-offset-4 rounded"
              >
                <span className="relative text-[13px] sm:text-[14px] font-bold tracking-[0.18em] uppercase text-[#07130e] dark:text-white group-hover:text-emerald-700 dark:group-hover:text-primary transition-colors duration-250 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-emerald-600 dark:after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
                  LEARN MORE ABOUT US
                </span>
                <motion.span
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="text-emerald-700 dark:text-primary"
                >
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </motion.span>
              </Link>

            </motion.div>
          </div>
        </section>


        {/* ── Programs / Activity Section ──────────────────────────────────────── */}
        <section id="activity" className="scroll-mt-20 bg-white dark:bg-[#050e09] py-24 border-b border-slate-200 dark:border-white/5 relative overflow-hidden">
          <div className="w-full relative z-10 flex flex-col items-center">
            <div className="site-container">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true"></span>
                  <span className="text-[12px] font-bold tracking-[0.2em] text-primary uppercase">WHAT WE DO</span>
                </div>
                <h2 className="text-[40px] md:text-[56px] font-display font-black tracking-tight text-[#07130e] dark:text-white uppercase leading-[1.1] mb-6">
                  Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#86b598]">Programs</span>
                </h2>
                <p className="text-[16px] text-[#07130e]/60 dark:text-white/50 max-w-xl mx-auto">
                  Explore our main initiatives designed to promote renewable energy awareness, empower communities, and drive sustainable innovation.
                </p>
              </motion.div>
            </div>

            {/* Full-width carousel */}
            <div className="w-screen relative overflow-hidden mb-16" style={{ height: cardDims.height + 60 }}>
              <motion.div
                animate={{ x: `calc(50vw - ${activeProgram * (cardDims.width + cardDims.gap) + cardDims.width / 2}px)` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-0 flex items-center h-full"
                style={{ gap: cardDims.gap, willChange: "transform" }}
              >
                {publicActivitiesList.map((activity, idx) => {
                  const isActive = idx === activeProgram;
                  return (
                    <motion.div
                      key={activity.id || idx}
                      animate={{
                        scale: isActive ? 1 : 0.82,
                        opacity: isActive ? 1 : 0.4,
                        rotateY: isActive ? 0 : idx < activeProgram ? 18 : -18,
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => setActiveProgram(idx)}
                      className="relative flex-shrink-0 rounded-[28px] md:rounded-[40px] overflow-hidden shadow-2xl cursor-pointer group"
                      style={{ width: cardDims.width, height: cardDims.height, transformOrigin: "center center" }}
                    >
                      <img
                        src={activity.imageUrl || `https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop&sig=${idx}`}
                        alt={activity.title || "Program Item"}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 transition-all duration-700 ${isActive ? "bg-gradient-to-t from-[#0b120f] via-[#0b120f]/50 to-transparent" : "bg-black/70"}`}
                        aria-hidden="true"
                      />
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="absolute inset-x-0 bottom-0 p-5 md:p-8 lg:p-12 text-white flex flex-col justify-end"
                          >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 md:mb-6 border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300" aria-hidden="true">
                              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white transform group-hover:rotate-45 transition-transform duration-300" />
                            </div>
                            <h3 className="text-[22px] md:text-[32px] lg:text-[40px] font-display font-bold leading-tight mb-2 md:mb-4 tracking-tight line-clamp-1">
                              {activity.title || "SRE Activity Program"}
                            </h3>
                            <p className="text-[13px] md:text-[16px] lg:text-[18px] font-light text-white/80 leading-relaxed line-clamp-2">
                              {activity.description || "Stay tuned for more details regarding this activity. SRE is committed to green transition."}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Progress dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-50" role="tablist" aria-label="Program navigation">
                {publicActivitiesList.map((activity, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === activeProgram}
                    aria-label={`View program: ${activity.title || `Program ${i + 1}`}`}
                    onClick={() => setActiveProgram(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-primary ${i === activeProgram ? "w-6 bg-primary dark:bg-white" : "w-1.5 bg-[#07130e]/20 dark:bg-white/20 hover:bg-[#07130e]/40 dark:hover:bg-white/40"}`}
                  />
                ))}
              </div>
            </div>

            <div className="site-container text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-12"
              >
                <motion.a
                  href="#all-activities"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="border border-[#07130e]/20 dark:border-white/20 hover:bg-[#07130e] dark:hover:bg-white/10 hover:text-[#e8ecc4] dark:hover:text-white text-[#07130e] dark:text-white/70 text-[15px] font-semibold rounded-full px-8 py-3.5 transition-colors duration-300 inline-flex items-center gap-2 focus-visible:outline-primary"
                >
                  See More of Our Activities
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </motion.a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Featured <span className="text-emerald-700 dark:text-white">Insights</span> / Articles Section ─────────────────────────────── */}
        <section id="article" className="scroll-mt-20 bg-white dark:bg-[#07130e] pt-24 pb-20 relative overflow-hidden border-b border-slate-200 dark:border-white/5">
          <div className="site-container">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16"
            >
              <span className="text-[14px] font-semibold tracking-wider text-primary uppercase mb-3 block">
                EDITORIALS &amp; DISCOVERIES
              </span>
              <h2 className="text-[40px] font-display font-semibold tracking-tight text-[#07130e] dark:text-white">
                Featured <span className="text-emerald-700 dark:text-white">Insights</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {publicArticlesList.filter((art) => art.featured).map((art) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col justify-between border-r-0 lg:border-r border-slate-200 dark:border-white/5 pr-0 lg:pr-12 gap-8"
                >
                  <div className="flex flex-col gap-6">
                    <div className="w-full aspect-[16/9] rounded-[18px] overflow-hidden bg-white/5 group/img">
                      <Image
                        src={art.image}
                        alt={art.title}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-center gap-4 text-[12px] font-normal text-ink-muted-48">
                      <span className="text-primary font-semibold uppercase">{art.category}</span>
                      <span>•</span>
                      <span>{art.date}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h3 className="text-[34px] font-display font-semibold tracking-tight text-ink leading-tight hover:text-primary transition-colors duration-200 line-clamp-3">
                      <a href={`/articles/${art.slug}`}>{art.title}</a>
                    </h3>
                    <p className="text-[17px] font-normal text-[#07130e]/80 leading-relaxed line-clamp-4 font-light">
                      {art.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/40 dark:bg-white/10 border border-[#d0d6a8] dark:border-white/10 flex items-center justify-center font-semibold text-[12px] text-[#07130e] dark:text-white uppercase shrink-0">SRE</div>
                      <span className="text-[14px] font-semibold text-[#07130e] dark:text-white line-clamp-1">{art.author}</span>
                    </div>
                    <a
                      href={`/articles/${art.slug}`}
                      className="bg-[#07130e] dark:bg-white/10 hover:bg-primary hover:text-[#07130e] text-[#e8ecc4] dark:text-white text-[14px] font-semibold tracking-tight rounded-full px-5 py-2 transition-all duration-300 shrink-0 focus-visible:outline-primary"
                    >
                      Read Article
                    </a>
                  </div>
                </motion.div>
              ))}

              <div className="flex flex-col gap-8">
                <span className="text-[12px] font-semibold tracking-wider text-[#07130e]/50 dark:text-white/30 uppercase border-b border-[#d0d6a8] dark:border-white/10 pb-2">
                  LATEST DISPATCHES
                </span>
                {publicArticlesList.filter((art) => !art.featured).map((art, idx) => (
                  <motion.div
                    key={art.id}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: Math.min(idx * 0.08, 0.4) }}
                    className="flex flex-col gap-4 pb-8 border-b border-slate-200 dark:border-white/10 last:border-b-0"
                  >
                    <div className="flex items-center justify-between text-[12px] font-normal text-ink-muted-48">
                      <span className="text-primary font-semibold uppercase">{art.category}</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h4 className="text-[21px] font-display font-semibold tracking-tight text-ink leading-snug hover:text-primary transition-colors duration-200 line-clamp-2">
                      <a href={`/articles/${art.slug}`}>{art.title}</a>
                    </h4>
                    <p className="text-[14px] font-normal text-[#07130e]/70 line-clamp-2 leading-relaxed font-light">{art.desc}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[12px] font-semibold text-[#07130e]/70 line-clamp-1 font-light">{art.author}</span>
                      <a href={`/articles/${art.slug}`} className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-0.5 shrink-0 focus-visible:outline-primary">
                        Read <ChevronRight className="w-3 h-3" aria-hidden="true" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials Section ──────────────────────────────────────────────── */}
        {publicTestimonialsList.length > 0 && (
          <section className="bg-white dark:bg-[#07130e] border-t border-slate-200 dark:border-white/5 py-24 relative overflow-hidden">
            <div className="site-container flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-12 text-center"
              >
                <span className="text-[14px] font-semibold tracking-wider text-primary uppercase mb-3 block">Testimonials & Review</span>
                <h2 className="text-[36px] font-display font-black tracking-tight text-ink uppercase">What Members Say</h2>
                <p className="text-[15px] text-ink/60 mt-4 max-w-lg mx-auto">
                  Hear directly from members about their learning journey, growth, and team experiences at SRE UPNVJT.
                </p>
              </motion.div>
              
              <motion.div
                variants={staggerParent}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl"
              >
                {publicTestimonialsList.map((test) => (
                  <motion.div
                    key={test.id}
                    variants={staggerChild}
                    className="bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/8 p-6 rounded-3xl flex flex-col justify-between shadow-sm relative group hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm"
                  >
                    <p className="text-sm italic text-[#07130e]/70 dark:text-white/60 mb-6 leading-relaxed">&ldquo;{test.content}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      {test.authorPhotoUrl ? (
                        <img src={test.authorPhotoUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-[#0f3036]/10" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm" aria-hidden="true">
                          {test.authorName?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-sm text-[#07130e] dark:text-white">{test.authorName}</div>
                        <div className="text-[11px] text-[#07130e]/50 dark:text-white/40">{test.authorPosition}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* ── Partners Section ──────────────────────────────────────────────────── */}
        {partnersList.length > 0 && (
          <section id="partners" className="scroll-mt-20 bg-white dark:bg-[#07130e] pb-24 relative overflow-hidden">
            <div className="site-container flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-12"
              >
                <span className="text-[14px] font-semibold tracking-wider text-primary uppercase mb-3 block">Collaboration & Synergy</span>
                <h2 className="text-[36px] font-display font-black tracking-tight text-ink uppercase">Our Partners</h2>
                <p className="text-[15px] text-ink-muted-80 mt-4 max-w-lg mx-auto">
                  Organizations, institutions, and communities we work with to accelerate the sustainable transition.
                </p>
              </motion.div>
              
              <motion.div
                variants={staggerParent}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-80 mt-8"
              >
                {partnersList.map((partner) => {
                  let sizeClasses = "w-40 h-20 md:w-48 md:h-24";
                  if (partner.tier === "LARGE") sizeClasses = "w-56 h-28 md:w-72 md:h-36";
                  if (partner.tier === "SMALL") sizeClasses = "w-32 h-16 md:w-36 md:h-16";
                  return (
                    <motion.div
                      key={partner.id}
                      variants={staggerChild}
                      className={`${sizeClasses} bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 rounded-2xl border border-slate-200 dark:border-white/8 p-4 flex items-center justify-center hover:border-[#07130e]/20 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                    >
                      <img 
                        src={partner.logoUrl} 
                        alt={partner.name} 
                        className="max-w-full max-h-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                        title={partner.name}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
