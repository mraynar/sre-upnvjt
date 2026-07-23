"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import Image from "next/image";
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

        {/* ── About / Who We Are Section ──────────────────────────────────────── */}
        <section id="about" className="scroll-mt-20 bg-white dark:bg-[#07130e] text-[#07130e] dark:text-white py-24 border-b border-slate-200 dark:border-white/5 relative overflow-hidden">
          <div className="absolute right-0 top-1/3 w-[300px] h-[300px] rounded-full bg-slate-100 dark:bg-primary/5 blur-3xl opacity-60 pointer-events-none" aria-hidden="true" />
          <div className="site-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-6">
               
               <motion.div
                 initial={{ opacity: 0, x: -28 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                 className="flex flex-col z-20"
               >
                  <div className="flex flex-wrap items-center gap-3 mb-8">
                    <span className="inline-block py-2 px-5 rounded-full bg-emerald-700 dark:bg-primary text-white dark:text-[#07130e] border border-emerald-700 dark:border-transparent text-[11px] font-bold tracking-widest uppercase">
                      Who We Are
                    </span>
                    <a href="https://sre.co.id" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#07130e]/25 dark:border-white/15 text-[11px] font-bold tracking-widest uppercase text-[#07130e]/70 dark:text-white/60 hover:text-white dark:hover:text-white hover:bg-emerald-700 dark:hover:bg-white/10 hover:border-emerald-700 dark:hover:border-white/30 transition-all cursor-pointer group focus-visible:outline-primary">
                      Member of SRE INDONESIA <ArrowUpRight className="w-3 h-3 group-hover:rotate-45 transition-transform" aria-hidden="true" />
                    </a>
                  </div>
                  
                  <h2 className="text-[50px] sm:text-[70px] md:text-[80px] font-display font-black leading-[0.9] tracking-tighter uppercase mb-10 text-[#07130e] dark:text-white">
                    Sparking <br />
                    <span className="font-serif italic font-normal text-primary lowercase tracking-normal -ml-2">the</span> <span className="text-emerald-700 dark:text-white">Future.</span>
                  </h2>

                  <p className="text-[17px] md:text-[20px] font-light text-[#07130e] dark:text-white leading-[1.65] tracking-tight mb-8">
                    <strong className="font-semibold text-emerald-800 dark:text-white">Society of Renewable Energy (SRE)</strong>{' '}is a student-led organization that aims to spark student&apos;s role in the field of new and renewable energy.
                  </p>
                  
                  <div className="relative pl-6 border-l-2 border-[#07130e]/30 dark:border-white/30 mb-10">
                    <p className="text-[15px] md:text-[17px] text-[#07130e]/70 dark:text-white/70 font-light leading-relaxed">
                      <strong className="font-medium text-ink dark:text-white">SRE UPN Veteran Jawa Timur</strong>{' '}was established to accelerate Indonesia&apos;s energy transition by providing high-fidelity learning programs, practical microgrid field projects, and institutional energy audits.
                    </p>
                  </div>

                  <a href="#activity" className="group flex items-center gap-5 w-fit cursor-pointer focus-visible:outline-primary focus-visible:rounded-full">
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: 45 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="w-14 h-14 rounded-full bg-[#07130e] dark:bg-white/10 text-[#e8ecc4] dark:text-white flex items-center justify-center group-hover:bg-primary group-hover:text-[#07130e] transition-colors duration-300 ease-out shadow-lg group-hover:shadow-primary/30"
                    >
                       <ArrowUpRight className="w-6 h-6" aria-hidden="true" />
                    </motion.div>
                    <span className="text-[13px] font-bold uppercase tracking-widest text-[#07130e] dark:text-white group-hover:text-primary transition-colors duration-300">
                      Explore Our Activities
                    </span>
                  </a>
               </motion.div>

               {/* Right Image Column */}
               <motion.div
                 initial={{ opacity: 0, x: 28 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
                 className="flex justify-center lg:justify-end z-20"
               >
                 <div className="relative w-full aspect-[4/3] max-w-lg rounded-3xl overflow-hidden border border-[#07130e]/15 shadow-2xl group bg-white/10">
                   <Image
                     src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop"
                     alt="SRE UPNVJT Renewable Energy event"
                     fill
                     sizes="(max-width: 1024px) 90vw, 42vw"
                     className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                     loading="lazy"
                   />
                   <div className="absolute inset-0 bg-[#07130e]/10 group-hover:bg-transparent transition-colors duration-500" aria-hidden="true" />
                 </div>
               </motion.div>
            </div>
          </div>

          {/* Vision/Mission full-bleed dark/light panel */}
          <div className="w-full border-y mt-24 relative overflow-hidden transition-colors duration-300 bg-slate-50 dark:bg-[#050e0a] text-[#07130e] dark:text-white border-slate-200 dark:border-white/5">
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/10 blur-[150px]"
              />
              <motion.div 
                animate={{ rotate: -360, scale: [1, 1.5, 1] }} 
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full blur-[120px] bg-[#a8d3ba]/10 dark:bg-[#a8d3ba]/5"
              />
            </div>

            <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
              <div className="w-full lg:w-5/12 lg:sticky lg:top-20 h-auto lg:h-[calc(100vh-80px)] flex flex-col justify-center py-24 lg:py-0 pr-0 lg:pr-16">
                <motion.div
                  initial={{ opacity: 0, x: -28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.75 }}
                  className="flex items-center gap-4 mb-10"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center relative bg-[#07130e]/5 dark:bg-white/5 border border-[#07130e]/10 dark:border-white/10">
                    <Eye className="w-5 h-5 text-primary" aria-hidden="true" />
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-primary/50"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-[12px] tracking-[0.3em] uppercase font-bold text-emerald-600 dark:text-white/50">Our Vision</span>
                </motion.div>

                <h2 className="text-[48px] sm:text-[60px] md:text-[70px] lg:text-[80px] font-display font-black leading-[0.9] tracking-tighter uppercase mb-8">
                   Leading <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-700 dark:to-[#e8ecc4]">Catalyst</span> <br />
                   for Green <br />
                   <span className="font-serif italic font-normal text-emerald-700 dark:text-white/80 lowercase tracking-normal">transition.</span>
                </h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75, delay: 0.2 }}
                  className="text-[16px] md:text-[18px] font-light leading-relaxed max-w-md border-l-2 border-primary/40 pl-6 text-[#07130e]/70 dark:text-white/60"
                >
                  Fostering a generation of innovators dedicated to sustainable, equitable, and clean energy solutions across the archipelago.
                </motion.p>
              </div>

              <div className="w-full lg:w-7/12 flex flex-col gap-8 lg:gap-32 py-12 lg:py-32">
                {[
                   { num: "01", title: "Educate & Empower", desc: "Equipping students with high-fidelity learning programs and deep technical knowledge in renewable energy infrastructures.", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop" },
                   { num: "02", title: "Practical Action", desc: "Implementing operational microgrid and biofuel field projects directly to communities across Indonesia.", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=crop" },
                   { num: "03", title: "Green Advocacy", desc: "Collaborating with state institutions for critical energy audits and policy advocacy at a national scale.", img: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop" }
                ].map((m, idx) => (
                  <motion.div
                     key={idx}
                     initial={{ opacity: 0, y: 60 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-80px" }}
                     transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                     className="relative w-full rounded-[40px] p-8 md:p-12 overflow-hidden group transition-all duration-500 shadow-2xl bg-white dark:bg-white/[0.02] border border-emerald-600/20 dark:border-white/5 group-hover:bg-[#050e0a] dark:group-hover:bg-white/[0.08] group-hover:border-primary dark:group-hover:border-white/10 group-hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] dark:group-hover:shadow-[0_0_40px_rgba(16,185,129,0.08)]"
                  >
                     <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 z-0 mix-blend-screen" aria-hidden="true">
                        <img src={m.img} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale group-hover:grayscale-0" alt="" />
                        <div className="absolute inset-0 bg-[#050e0a]/40" />
                     </div>
                     <div className="relative z-10 flex flex-col justify-between h-full min-h-[250px] md:min-h-[350px]">
                        <div className="flex justify-between items-start mb-12">
                           <span className="text-[70px] md:text-[100px] font-display font-black leading-none tracking-tighter transition-colors duration-500 text-primary/10 dark:text-white/10 group-hover:text-primary/75 dark:group-hover:text-primary/60" aria-hidden="true">
                             {m.num}
                           </span>
                           <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 bg-[#07130e]/5 dark:bg-white/5 border border-[#07130e]/10 dark:border-white/10 group-hover:bg-primary group-hover:border-primary group-hover:text-[#07130e] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:scale-110">
                              <ArrowUpRight className="w-6 h-6 group-hover:text-[#07130e] group-hover:rotate-45 transition-all duration-500 text-emerald-600 dark:text-white/50" aria-hidden="true" />
                           </div>
                        </div>
                        <div>
                           <span className="text-[10px] md:text-[12px] font-bold tracking-[0.3em] uppercase text-primary mb-4 block opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                             Mission
                           </span>
                           <h3 className="text-[32px] md:text-[48px] font-display font-black uppercase tracking-tight mb-4 transition-colors duration-500 leading-[1.05] text-emerald-950 dark:text-white/90 group-hover:text-white">
                             {m.title}
                           </h3>
                           <p className="text-[15px] md:text-[18px] font-light leading-relaxed max-w-lg transition-colors duration-500 text-emerald-900/70 dark:text-white/50 group-hover:text-white/90">
                             {m.desc}
                           </p>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </div>
            </div>
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
