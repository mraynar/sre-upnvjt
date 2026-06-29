"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ChevronRight,
  ArrowUpRight,
  Eye,
  ArrowDown,
  Users,
  Calendar,
  FileText,
  Activity,
  Award,
  Zap,
  TrendingUp,
  MessageSquare,
  BookOpen
} from "lucide-react";
import { getPublicContent } from "@/app/actions/contentActions";

export const dynamic = "force-dynamic";

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

// Animated Number Counter Component
function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const target = parseInt(value);
    if (isNaN(target)) {
      setCount(value);
      return;
    }

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const rate = Math.min(progress / duration, 1);
      setCount(Math.floor(rate * target));
      if (rate < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const suffix = value.toString().replace(/[0-9]/g, "");
  return <span>{count}{suffix}</span>;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [activeProgram, setActiveProgram] = useState(0);
  const [partnersList, setPartnersList] = useState([]);
  const [publicArticlesList, setPublicArticlesList] = useState([]);
  const [publicActivitiesList, setPublicActivitiesList] = useState([]);
  const [publicTestimonialsList, setPublicTestimonialsList] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  // Parallax Scroll logic
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const heroVideoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPartnersList(data);
      })
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
          setPublicActivitiesList(formatted);
        }
      })
      .catch(console.error);

    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPublicTestimonialsList(data);
      })
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (publicActivitiesList.length > 0) {
      const timer = setInterval(() => {
        setActiveProgram((prev) => (prev + 1) % publicActivitiesList.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [publicActivitiesList.length]);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-[#020806] text-white antialiased overflow-x-hidden selection:bg-primary/30 selection:text-white">
      
      {/* 1. Fullscreen Hero Section with Parallax Video */}
      <section
        id="home"
        className="relative h-screen w-full flex flex-col justify-center items-center px-6 md:px-20 text-center overflow-hidden"
      >
        <motion.div style={{ y: heroVideoY, opacity: heroOpacity }} className="absolute inset-0 w-full h-full z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1920&auto=format&fit=crop"
            className="w-full h-full object-cover grayscale opacity-60"
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#020806]/85 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020806]/20 to-[#020806] pointer-events-none" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest uppercase text-primary"
          >
            <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
            Accelerating Sustainable Transition
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-black leading-[1.05] tracking-tighter uppercase"
          >
            SRE UPN Veteran <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
              Jawa Timur
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-base sm:text-lg text-white/60 font-medium max-w-2xl leading-relaxed"
          >
            Melahirkan inovator muda untuk transisi energi hijau di Indonesia melalui riset akademik, proyek pengembangan masyarakat, serta audit energi operasional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mt-6"
          >
            <a
              href="#about"
              className="px-8 py-4 rounded-full bg-primary text-[#020806] font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:bg-primary-focus hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]"
            >
              Kenali Kami Lebih Dekat
            </a>
            <a
              href="/join"
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105"
            >
              Gabung Pengurus
            </a>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10 text-white/40 hover:text-white transition-colors"
          onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}
        >
          <span className="text-[9px] font-black uppercase tracking-widest">Scroll Down</span>
          <ArrowDown className="w-4 h-4 text-primary" />
        </motion.div>
      </section>

      {/* 2. About Snippet Section */}
      <section
        id="about"
        className="relative bg-white text-[#131f1c] py-28 px-6 md:px-12 lg:px-20 overflow-hidden border-b border-divider-soft rounded-t-[40px] z-10 shadow-2xl"
      >
        <div className="absolute right-0 top-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Visi Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 flex flex-col"
          >
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="inline-block py-2 px-5 rounded-full bg-[#020806] text-white text-[10px] font-black tracking-widest uppercase">
                Siapa SRE UPNVJT?
              </span>
              <a 
                href="https://sre.co.id" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-black/10 text-[10px] font-black tracking-widest uppercase text-black/50 hover:text-white hover:bg-black transition-all cursor-pointer group"
              >
                SRE Indonesia Chapter <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              </a>
            </div>

            <h2 className="text-5xl sm:text-6xl font-display font-black leading-[0.95] tracking-tighter uppercase mb-8">
              Menggerakkan <br />
              <span className="font-serif italic font-normal text-primary lowercase tracking-normal -ml-1">transisi</span> <br />
              Energi Hijau.
            </h2>

            <p className="text-lg md:text-xl font-medium text-[#131f1c] leading-relaxed mb-6">
              <strong>Society of Renewable Energy (SRE) UPN Veteran Jawa Timur</strong> merupakan wadah pergerakan dan akselerasi edukasi energi baru terbarukan di lingkungan kampus dan masyarakat sekitar.
            </p>

            <div className="pl-6 border-l-2 border-primary/50 mb-10 text-black/60 font-medium text-sm leading-relaxed">
              Kami berkomitmen untuk memperluas jangkauan pemahaman transisi energi berkelanjutan melalui kolaborasi interdisipliner, riset berkualitas tinggi, pengabdian sosial teknologi tepat guna, serta advokasi kebijakan publik.
            </div>

            <button 
              onClick={() => document.getElementById("activity").scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-4 w-fit group select-none cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#020806] text-white flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-lg shadow-emerald-500/20">
                <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[#020806] group-hover:text-primary transition-colors">
                Lihat Kegiatan Kami
              </span>
            </button>
          </motion.div>

          {/* Visi Right Column (Glow Card) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 p-8 md:p-12 rounded-3xl bg-emerald-50/50 border border-primary/10 shadow-lg relative overflow-hidden"
          >
            <h3 className="text-2xl font-display font-black tracking-tight text-[#020806] mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              Visi Kami
            </h3>
            <p className="text-[#131f1c]/70 text-base leading-relaxed mb-10 font-medium">
              Menjadi episentrum dan penggerak utama gerakan mahasiswa dalam mendukung program kemandirian energi dan transisi nasional di Jawa Timur melalui inovasi nyata yang berdampak langsung.
            </p>

            <div className="h-[1px] w-full bg-black/5 mb-10" />

            <h3 className="text-xl font-display font-black tracking-tight text-[#020806] mb-6">
              Misi Strategis
            </h3>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-wider text-[#131f1c]/60">
              <li className="flex gap-3"><span className="text-primary">—</span> Mengedukasi & Membangun Minat Anggota</li>
              <li className="flex gap-3"><span className="text-primary">—</span> Menyelenggarakan Riset & Diskusi Inovatif</li>
              <li className="flex gap-3"><span className="text-primary">—</span> Meluncurkan Aksi Lapangan Teknologi Hijau</li>
              <li className="flex gap-3"><span className="text-primary">—</span> Menjalin Kolaborasi Lintas Institusi</li>
            </ul>
          </motion.div>

        </div>
      </section>

      {/* 3. Stats Counter Section */}
      <section className="bg-[#020806] py-24 px-6 relative overflow-hidden z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <span className="text-[10px] font-black text-primary tracking-widest uppercase block mb-3">Organisasi dalam Angka</span>
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-white">Dampak Nyata Kami</h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "100+", label: "Pengurus Aktif", icon: Users, color: "text-primary" },
              { value: "15+", label: "Kegiatan Kampanye", icon: Calendar, color: "text-blue-400" },
              { value: "5+", label: "Proyek Sosial EBT", icon: Zap, color: "text-amber-400" },
              { value: "12+", label: "Modul Pembelajaran", icon: BookOpen, color: "text-purple-400" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center shadow-lg group hover:border-primary/20 transition-all duration-300"
              >
                <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-4xl md:text-5xl font-display font-black text-white leading-none tracking-tight">
                  <AnimatedCounter value={stat.value} />
                </h3>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Programs / Departments Section */}
      <section
        id="activity"
        className="bg-white text-[#131f1c] py-28 px-6 overflow-hidden rounded-b-[40px] z-10 shadow-2xl relative"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-2xl"
          >
            <span className="text-[10px] font-black text-primary tracking-widest uppercase block mb-3">Apa Kegiatan Kami?</span>
            <h2 className="text-4xl md:text-5xl font-display font-black text-[#020806] uppercase tracking-tight mb-4">Program Unggulan</h2>
            <p className="text-black/50 text-sm leading-relaxed max-w-lg mx-auto">Tinjau berbagai inisiatif besar SRE UPNVJT dalam mengedukasi dan memfasilitasi minat riset mahasiswa.</p>
          </motion.div>

          {publicActivitiesList.length > 0 ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicActivitiesList.slice(0, 6).map((activity, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                  key={activity.id || idx}
                  className="bg-[#020806] rounded-3xl overflow-hidden shadow-2xl relative aspect-[4/5] flex flex-col justify-end p-6 group hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={activity.imageUrl || "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=600&auto=format&fit=crop"}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020806] via-[#020806]/40 to-transparent pointer-events-none z-0" />
                  
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:border-primary group-hover:text-[#020806] transition-all">
                      <ArrowUpRight className="w-4 h-4 text-white group-hover:text-[#020806] group-hover:rotate-45 transition-all" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-black text-white mb-2 uppercase leading-tight tracking-tight line-clamp-1">{activity.title}</h3>
                    <p className="text-white/60 text-xs line-clamp-2 leading-relaxed font-medium">{activity.description || "Stay tuned for more details regarding this activity. SRE is committed to green transition."}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-black/30 font-bold text-sm">
              Belum ada program unggulan dirilis.
            </div>
          )}
        </div>
      </section>

      {/* 5. Featured Articles Section */}
      <section
        id="article"
        className="bg-[#020806] py-28 px-6 relative overflow-hidden z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <span className="text-[10px] font-black text-primary tracking-widest uppercase block mb-3">Editorial & Artikel</span>
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-white">Artikel & Berita</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {publicArticlesList.slice(0, 3).map((art, index) => (
              <motion.div
                key={art.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-primary/20 transition-all group"
              >
                <div>
                  <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#020806] mb-5">
                    <img
                      src={art.image}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-wider block mb-2">{art.category}</span>
                  <h3 className="text-lg font-black text-white leading-snug line-clamp-2 hover:text-primary transition-all tracking-tight">
                    <a href={`/articles/${art.slug}`}>{art.title}</a>
                  </h3>
                  <p className="text-white/40 text-xs line-clamp-2 leading-relaxed mt-2 font-medium">{art.desc}</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 mt-6 pt-4 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                  <span>Oleh {art.author}</span>
                  <a href={`/articles/${art.slug}`} className="text-primary hover:underline font-black flex items-center gap-0.5">
                    Baca <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      {publicTestimonialsList.length > 0 && (
        <section className="bg-white text-[#131f1c] py-28 px-6 relative overflow-hidden rounded-t-[40px] z-10 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-[10px] font-black text-primary tracking-widest uppercase block mb-3">Apa Kata Mereka?</span>
              <h2 className="text-4xl md:text-5xl font-display font-black text-[#020806] uppercase tracking-tight">Testimoni Pengurus</h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
              {publicTestimonialsList.slice(0, 3).map((test, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={test.id || index}
                  className="bg-emerald-50/30 border border-primary/10 p-6 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group"
                >
                  <p className="text-sm italic text-[#131f1c]/70 leading-relaxed mb-6 font-medium">"{test.content}"</p>
                  <div className="flex items-center gap-3">
                    {test.authorPhotoUrl ? (
                      <img src={test.authorPhotoUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-primary/20" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                        {test.authorName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-xs text-[#020806]">{test.authorName}</div>
                      <div className="text-[10px] text-black/40 font-bold uppercase tracking-wider mt-0.5">{test.authorPosition}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Partners Section */}
      {partnersList.length > 0 && (
        <section
          id="partners"
          className="bg-white text-[#131f1c] pb-32 px-6 relative overflow-hidden z-10"
        >
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <span className="text-[10px] font-black text-primary tracking-widest uppercase block mb-3">Kolaborasi & Sinergi</span>
              <h2 className="text-4xl md:text-5xl font-display font-black text-[#020806] uppercase tracking-tight">Kemitraan Kami</h2>
            </motion.div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-80">
              {partnersList.map((partner) => {
                let sizeClasses = "w-40 h-20 md:w-44 md:h-24";
                if (partner.tier === "LARGE") sizeClasses = "w-48 h-24 md:w-56 md:h-28";
                if (partner.tier === "SMALL") sizeClasses = "w-32 h-16 md:w-36 md:h-16";

                return (
                  <div key={partner.id} className={`${sizeClasses} bg-black/[0.01] border border-black/5 rounded-2xl p-4 flex items-center justify-center hover:bg-black/5 hover:-translate-y-1 transition-all duration-300 group`}>
                    <img 
                      src={partner.logoUrl} 
                      alt={partner.name} 
                      className="max-w-full max-h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8. Footer CTA Section */}
      <section className="bg-[#020806] py-32 px-6 relative overflow-hidden z-10 border-t border-white/5 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center gap-8">
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest uppercase text-primary">
            Mari Bergabung
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-black uppercase leading-tight tracking-tighter text-white">
            Siap Menjadi Bagian dari <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Transisi Energi Hijau?</span>
          </h2>
          <p className="text-white/60 text-sm max-w-xl leading-relaxed">
            Dapatkan pengalaman berharga dalam proyek operasional EBT dan perluas jejaring profesional di industri energi Indonesia.
          </p>
          <a
            href="/join"
            className="px-8 py-4 rounded-full bg-primary text-[#020806] font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:bg-primary-focus hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            Gabung Pengurus Sekarang
          </a>
        </div>
      </section>

    </div>
  );
}
