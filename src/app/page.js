"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import { getPublicArticles } from "@/app/actions/articleActions";
import { getPublicActivities } from "@/app/actions/activityActions";

export const dynamic = "force-dynamic";

const fadeInUp = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
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

const PARTNERS = ["SRE Indonesia", "UPN Veteran Jawa Timur", "SRE UPNVJT"];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredMerch, setHoveredMerch] = useState(null);
  const [iyrefActive, setIyrefActive] = useState(false);
  const [activeProgram, setActiveProgram] = useState(0);
  const [partnersList, setPartnersList] = useState([]);
  const [publicArticlesList, setPublicArticlesList] = useState([]);
  const [publicActivitiesList, setPublicActivitiesList] = useState([{}, {}, {}, {}, {}]); // Fallback array so layout doesn't break if empty
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPartnersList(data);
      })
      .catch(console.error);

    getPublicActivities().then((res) => {
      if (res.success && res.data.length > 0) {
        setPublicActivitiesList(res.data);
      }
    }).catch(console.error);

    getPublicArticles().then((res) => {
      if (res.success) {
        const formatted = res.data.map((art, index) => ({
          id: art.id,
          title: art.title,
          category: "News",
          date: new Date(art.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase(),
          author: art.author?.name || "SRE UPNVJT",
          readTime: "5 min read",
          desc: art.excerpt || "Baca selengkapnya untuk mengetahui detail lebih lanjut mengenai artikel ini.",
          image: art.thumbnailUrl || "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
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
        {/* 2. [Home] Hero Section */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col justify-center items-start py-24 px-8 sm:px-12 md:px-20 lg:px-24 overflow-hidden bg-[#0a1c15]"
        >
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
          
          <div className="absolute inset-0 bg-[#0a2e24] opacity-80 mix-blend-multiply z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08201a]/30 to-[#08201a]/80 z-0 pointer-events-none" />
          <div className="w-full max-w-7xl mx-auto z-10 flex flex-col justify-center items-start h-full mt-12 md:mt-20">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[46px] sm:text-[72px] md:text-[110px] lg:text-[130px] font-display font-black tracking-[-0.04em] leading-[0.85] uppercase flex flex-col items-start w-full"
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
                <span className="text-white drop-shadow-md">SOCIETY</span>
                <span className="text-[28px] sm:text-[40px] md:text-[64px] lg:text-[72px] font-serif italic font-normal text-[#e8ecc4] normal-case tracking-normal transform -translate-y-1 md:-translate-y-4">of</span>
              </div>
              <div className="text-[#e8ecc4] drop-shadow-md">
                RENEWABLE
              </div>
              <div className="text-white drop-shadow-md">
                ENERGY
              </div>
            </motion.h1>
          </div>

          <div className="absolute bottom-8 md:bottom-12 right-8 md:right-16 lg:right-24 z-10 flex flex-col items-end">
            <span className="text-[12px] sm:text-[14px] font-medium text-white/90 tracking-wide drop-shadow-md text-right">
              Student Organization at <strong className="text-white font-bold block sm:inline">UPN Veteran Jawa Timur</strong>
            </span>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e8ecc4] z-20" />
        </section>

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
          <div className="absolute right-0 top-1/3 w-[300px] h-[300px] rounded-full bg-canvas-parchment blur-3xl opacity-60 pointer-events-none" />

          <div className="w-full relative z-10 flex flex-col gap-16">
            <div className="relative w-full max-w-[1400px] mx-auto z-10 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center lg:items-end mt-12">
               
               <motion.div
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.8, ease: "easeOut" }}
                 className="w-full lg:w-5/12 flex flex-col z-20 lg:pb-12"
               >
                  <div className="flex flex-wrap items-center gap-3 mb-8">
                    <span className="inline-block py-2 px-5 rounded-full bg-[#07130e] text-[#e8ecc4] border border-[#07130e] text-[11px] font-bold tracking-widest uppercase">
                      Who We Are
                    </span>
                    <a href="https://sre.co.id" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2 rounded-full border border-ink/20 text-[11px] font-bold tracking-widest uppercase text-ink/70 hover:text-[#07130e] hover:bg-[#e8ecc4] hover:border-[#e8ecc4] transition-all cursor-pointer group">
                      Member of SRE INDONESIA <ArrowUpRight className="w-3 h-3 group-hover:rotate-45 transition-transform" />
                    </a>
                  </div>
                  
                  <h2 className="text-[50px] sm:text-[70px] md:text-[80px] font-display font-black leading-[0.9] tracking-tighter uppercase mb-12">
                    Sparking <br />
                    <span className="font-serif italic font-normal text-primary lowercase tracking-normal -ml-2">the</span> Future.
                  </h2>

                  <p className="text-[18px] md:text-[22px] font-light text-ink leading-[1.6] tracking-tight mb-8">
                     <strong className="font-semibold text-ink">Society of Renewable Energy (SRE)</strong> is a student-led organization that aims to spark student’s role in the field of new and renewable energy.
                  </p>
                  
                  <div className="relative pl-6 border-l-2 border-primary/40 mb-12">
                    <p className="text-[16px] md:text-[18px] text-ink-muted-80 font-light leading-relaxed">
                      <strong className="font-medium text-ink">SRE UPN Veteran Jawa Timur</strong> was established to accelerate Indonesia's energy transition by providing high-fidelity learning programs, practical microgrid field projects, and institutional energy audits.
                    </p>
                  </div>

                  <a href="#activity" className="group flex items-center gap-5 w-fit cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-[#07130e] text-white flex items-center justify-center group-hover:bg-primary group-hover:text-[#07130e] transition-all duration-500 ease-out shadow-lg group-hover:shadow-primary/30 group-hover:scale-110">
                       <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
                    </div>
                    <span className="text-[13px] font-bold uppercase tracking-widest text-ink group-hover:text-primary transition-colors duration-300">
                      Explore Our Activities
                    </span>
                  </a>
               </motion.div>
            </div>
          </div>

            <div className="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-32 bg-[#050e0a] text-white border-y border-white/5">
              
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div 
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/10 blur-[150px]"
                />
                <motion.div 
                  animate={{ rotate: -360, scale: [1, 1.5, 1] }} 
                  transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                  className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-[#a8d3ba]/5 blur-[120px]"
                />
              </div>

              <div className="flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                
                <div className="w-full lg:w-5/12 lg:sticky lg:top-0 h-auto lg:h-screen flex flex-col justify-center py-24 lg:py-0 pr-0 lg:pr-16">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-4 mb-10"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
                      <Eye className="w-5 h-5 text-primary" />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border border-primary/50"
                      />
                    </div>
                    <span className="text-[12px] tracking-[0.3em] text-white/50 uppercase font-bold">Our Vision</span>
                  </motion.div>

                  <h2 className="text-[48px] sm:text-[60px] md:text-[70px] lg:text-[80px] font-display font-black leading-[0.9] tracking-tighter uppercase mb-8 drop-shadow-2xl">
                     Leading <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#e8ecc4]">Catalyst</span> <br />
                     for Green <br />
                     <span className="font-serif italic font-normal text-white/80 lowercase tracking-normal">transition.</span>
                  </h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-[16px] md:text-[18px] font-light text-white/60 leading-relaxed max-w-md border-l-2 border-primary/40 pl-6"
                  >
                    Fostering a generation of innovators dedicated to sustainable, equitable, and clean energy solutions across the archipelago.
                  </motion.p>
                </div>

                <div className="w-full lg:w-7/12 flex flex-col gap-8 lg:gap-32 py-12 lg:py-32">
                   
                   {[
                      {
                        num: "01",
                        title: "Educate & Empower",
                        desc: "Equipping students with high-fidelity learning programs and deep technical knowledge in renewable energy infrastructures.",
                        img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
                      },
                      {
                        num: "02",
                        title: "Practical Action",
                        desc: "Implementing operational microgrid and biofuel field projects directly to communities across Indonesia.",
                        img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=crop"
                      },
                      {
                        num: "03",
                        title: "Green Advocacy",
                        desc: "Collaborating with state institutions for critical energy audits and policy advocacy at a national scale.",
                        img: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop"
                      }
                   ].map((m, idx) => (
                     <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full rounded-[40px] bg-white/[0.02] border border-white/5 p-8 md:p-12 overflow-hidden group hover:bg-white/[0.08] hover:border-white/10 transition-all duration-500 shadow-2xl"
                     >
                        <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 z-0 mix-blend-screen">
                           <img src={m.img} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale group-hover:grayscale-0" alt={m.title} />
                           <div className="absolute inset-0 bg-[#050e0a]/40" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col justify-between h-full min-h-[250px] md:min-h-[350px]">
                           <div className="flex justify-between items-start mb-12">
                              <span className="text-[70px] md:text-[100px] font-display font-black leading-none tracking-tighter text-white/10 group-hover:text-primary/60 transition-colors duration-500 drop-shadow-lg">
                                {m.num}
                              </span>
                              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-[#07130e] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-500 group-hover:scale-110">
                                 <ArrowUpRight className="w-6 h-6 text-white/50 group-hover:text-[#07130e] group-hover:rotate-45 transition-all duration-500" />
                              </div>
                           </div>
                           
                           <div>
                              <span className="text-[10px] md:text-[12px] font-bold tracking-[0.3em] uppercase text-primary mb-4 block opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                Mission
                              </span>
                              <h3 className="text-[32px] md:text-[48px] font-display font-black uppercase tracking-tight text-white/90 mb-4 group-hover:text-white transition-colors duration-500 leading-[1.05]">
                                {m.title}
                              </h3>
                              <p className="text-[15px] md:text-[18px] text-white/50 font-light leading-relaxed max-w-lg group-hover:text-white/90 transition-colors duration-500">
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

        {/* 5. [Activity] Section */}
        <section
          id="activity"
          className="bg-canvas py-32 px-6 border-b border-divider-soft relative overflow-hidden"
        >
          <div className="w-full relative z-10 flex flex-col items-center">
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="text-center mb-16 max-w-2xl flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[12px] font-bold tracking-[0.2em] text-primary uppercase">
                  WHAT WE DO
                </span>
              </div>
              <h2 className="text-[40px] md:text-[56px] font-display font-black tracking-tight text-ink uppercase leading-[1.1] mb-6">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#86b598]">Programs</span>
              </h2>
              <p className="text-[16px] text-ink/60 max-w-xl mx-auto">
                Explore our main initiatives designed to promote renewable energy awareness, empower communities, and drive sustainable innovation.
              </p>
            </motion.div>

            <div
              className="w-screen relative -mx-6 md:-mx-12 lg:-mx-24 overflow-hidden mb-16"
              style={{ height: cardDims.height + 60 }}
            >
              <motion.div
                animate={{
                  x: `calc(50vw - ${activeProgram * (cardDims.width + cardDims.gap) + cardDims.width / 2}px)`,
                }}
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
                      style={{
                        width: cardDims.width,
                        height: cardDims.height,
                        transformOrigin: "center center",
                      }}
                    >
                      <img
                        src={activity.imageUrl || `https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop&sig=${idx}`}
                        alt={activity.title || "Program Item"}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 transition-all duration-700 ${
                          isActive
                            ? "bg-gradient-to-t from-[#0b120f] via-[#0b120f]/50 to-transparent"
                            : "bg-black/70"
                        }`}
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
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 md:mb-6 border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
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
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                {publicActivitiesList.map((_, i) => (
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
          className="bg-canvas pt-32 pb-24 px-6 relative overflow-hidden"
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {publicArticlesList.filter((art) => art.featured).map((art) => (
                <motion.div
                  key={art.id}
                  {...fadeInUp}
                  className="flex flex-col justify-between border-r-0 lg:border-r border-divider-soft pr-0 lg:pr-12 gap-8"
                >
                  <div className="flex flex-col gap-6">
                    <div className="w-full aspect-[16/9] rounded-[18px] overflow-hidden bg-white/5">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center gap-4 text-[12px] font-normal text-ink-muted-48">
                      <span className="text-primary font-semibold uppercase">
                        {art.category}
                      </span>
                      <span>•</span>
                      <span>{art.date}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h3 className="text-[34px] font-display font-semibold tracking-tight text-ink leading-tight hover:text-primary transition-colors duration-200 line-clamp-3">
                      <a href={`/article/${art.slug}`}>{art.title}</a>
                    </h3>
                    <p className="text-[17px] font-normal text-ink-muted-80 leading-relaxed line-clamp-4">
                      {art.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-divider-soft">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-canvas-parchment border border-hairline flex items-center justify-center font-semibold text-[12px] text-ink uppercase shrink-0">
                        SRE
                      </div>
                      <span className="text-[14px] font-semibold text-ink line-clamp-1">
                        {art.author}
                      </span>
                    </div>
                    <a
                      href={`/article/${art.slug}`}
                      className="bg-[#0f3036] hover:bg-[#1b434b] text-white text-[14px] font-semibold tracking-tight rounded-full px-5 py-2 transition-all duration-300 shrink-0"
                    >
                      Read Article
                    </a>
                  </div>
                </motion.div>
              ))}

              <div className="flex flex-col gap-8">
                <span className="text-[12px] font-semibold tracking-wider text-ink-muted-48 uppercase border-b border-divider-soft pb-2">
                  LATEST DISPATCHES
                </span>

                {publicArticlesList.filter((art) => !art.featured).map((art) => (
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
                    <h4 className="text-[21px] font-display font-semibold tracking-tight text-ink leading-snug hover:text-primary transition-colors duration-200 line-clamp-2">
                      <a href={`/article/${art.slug}`}>{art.title}</a>
                    </h4>
                    <p className="text-[14px] font-normal text-ink-muted-80 line-clamp-2 leading-relaxed">
                      {art.desc}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[12px] font-semibold text-ink-muted-80 line-clamp-1">
                        {art.author}
                      </span>
                      <a
                        href={`/article/${art.slug}`}
                        className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-0.5 shrink-0"
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

        {/* 7. [Partners] Section */}
        {partnersList.length > 0 && (
          <section
            id="partners"
            className="bg-canvas pb-32 px-6 relative overflow-hidden"
          >
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
              <motion.div {...fadeInUp} className="mb-12">
                <span className="text-[14px] font-semibold tracking-wider text-primary uppercase mb-3 block">
                  Collaboration & Synergy
                </span>
                <h2 className="text-[36px] font-display font-black tracking-tight text-ink uppercase">
                  Our Partners
                </h2>
                <p className="text-[15px] text-ink-muted-80 mt-4 max-w-lg mx-auto">
                  Organizations, institutions, and communities we work with to accelerate the sustainable transition.
                </p>
              </motion.div>
              
              <motion.div 
                {...fadeInUp}
                className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-80 mt-8"
              >
                {partnersList.map((partner) => {
                  let sizeClasses = "w-40 h-20 md:w-48 md:h-24"; // MEDIUM
                  if (partner.size === "LARGE") sizeClasses = "w-56 h-28 md:w-72 md:h-36";
                  if (partner.size === "SMALL") sizeClasses = "w-32 h-16 md:w-36 md:h-16";

                  return (
                    <div key={partner.id} className={`${sizeClasses} bg-[#0f3036]/2 rounded-2xl border border-[#0f3036]/5 p-4 flex items-center justify-center hover:bg-[#0f3036]/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer group`}>
                      <img 
                        src={partner.imageUrl} 
                        alt={partner.name} 
                        className="max-w-full max-h-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                        title={partner.name} 
                      />
                    </div>
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
