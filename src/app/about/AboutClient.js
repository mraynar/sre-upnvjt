"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, BookOpen, Cpu, Leaf, Users, Mail, MapPin
} from "lucide-react";

export default function AboutClient({ divisionsData }) {
  const [activeTab, setActiveTab] = useState(divisionsData.length > 0 ? divisionsData[0].id : "");

  const activeDivision = divisionsData.find(d => d.id === activeTab);

  // Mission Pillars
  const pillars = [
    { 
      icon: BookOpen, 
      title: "Education", 
      desc: "Providing high-fidelity training, seminars, and workshops to elevate renewable energy literacy among students." 
    },
    { 
      icon: Cpu, 
      title: "Technology", 
      desc: "Developing practical, scalable microgrid, solar power, and bioenergy prototypes for real-world application." 
    },
    { 
      icon: Leaf, 
      title: "Environment", 
      desc: "Promoting sustainability, decarbonization models, and eco-friendly community waste management." 
    },
    { 
      icon: Users, 
      title: "Empowerment", 
      desc: "Collaborating with local villages to implement renewable energy grids directly elevating their socioeconomic level." 
    }
  ];

  // Structures (exist in the project)
  const structures = [
    { id: "01", title: "Executive Board", subtitle: "President & Vice President", desc: "Top leadership shaping the vision, strategy, and overall operational success of SRE UPNVJT." },
    { id: "02", title: "Human Resources", subtitle: "SRM (Strategic Resource Management)", desc: "Focusing on cultivating internal talent, member performance, and team bonding." },
    { id: "03", title: "Finance", subtitle: "Treasury & Sponsorship", desc: "Responsible for managing the budget, treasury books, and fundraising strategies." },
    { id: "04", title: "ACE (Academic, Competition, Education)", subtitle: "Research & Development", desc: "Meningkatkan wawasan akademik mahasiswa dan menjalankan kampanye kesadaran energi." },
    { id: "05", title: "Media & Creative", subtitle: "Visual Design & Social Media", desc: "Membangun identitas visual, mengelola interaksi digital, dan menciptakan inovasi kreatif." },
    { id: "06", title: "Public Relations", subtitle: "Relations & Partnership", desc: "Focusing on external relations, strategic partnerships, and institutional alignments." }
  ];

  return (
    /* overflow-hidden prevents horizontal bleed from content panels */
    <div className="min-h-screen bg-[#07130e] text-white selection:bg-[#e8ecc4] selection:text-[#07130e] antialiased overflow-hidden">
      
      {/* 1. Hero Section — explicit bg prevents navbar overlap */}
      <section id="hero" className="scroll-mt-20 relative pt-44 pb-24 px-6 overflow-hidden border-b border-white/5 bg-[#07130e]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start gap-4 mb-6"
          >
            <span className="inline-block py-2 px-5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest uppercase text-[#e8ecc4]">
              SRE UPN Veteran Jawa Timur
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[60px] md:text-[100px] lg:text-[120px] font-display font-black leading-[0.85] tracking-tighter uppercase mb-6"
          >
            ABOUT <span className="text-[#e8ecc4]">US.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-white/60 max-w-3xl leading-relaxed font-medium"
          >
            Society of Renewable Energy UPN Veteran Jawa Timur adalah komunitas penggerak akselerasi transisi energi bersih dan edukasi lingkungan terkemuka di tingkat mahasiswa.
          </motion.p>
        </div>
      </section>

      {/* 2. Vision & Mission Section */}
      <section id="vision" className="scroll-mt-20 py-24 px-6 md:px-12 lg:px-20 bg-[#050e0a] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black text-primary tracking-widest uppercase block mb-3">Our Ultimate Goal</span>
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase text-white mb-6 tracking-tight">VISION</h2>
            <p className="text-sm md:text-base text-white/70 leading-relaxed font-medium border-l-2 border-primary pl-6 py-1">
              Menjadi wadah esensial bagi mahasiswa dalam mengeksplorasi, mengembangkan, dan mengimplementasikan inovasi di bidang energi baru terbarukan demi masa depan yang berkelanjutan dan mandiri energi.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="text-[10px] font-black text-primary tracking-widest uppercase block mb-3">Core Commitments</span>
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase text-white mb-6 tracking-tight">OUR MISSION</h2>
            <ul className="space-y-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white/60">
              <li className="flex gap-4"><span className="text-primary">—</span> Meningkatkan kesadaran & literasi transisi energi</li>
              <li className="flex gap-4"><span className="text-primary">—</span> Menyelenggarakan riset & proyek EBT tepat guna</li>
              <li className="flex gap-4"><span className="text-primary">—</span> Membangun kolaborasi sinergis lintas sektor</li>
            </ul>
          </motion.div>
        </div>

        {/* Mission Pillars Grid */}
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xs font-black text-white/40 tracking-widest uppercase mb-10 text-center">Empat Pilar Utama Pergerakan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pl, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-primary/25 transition-all group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                    <pl.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tight">{pl.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-medium">{pl.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Our Structure Section */}
      <section id="structure" className="scroll-mt-20 py-24 px-6 md:px-12 lg:px-20 bg-[#07130e] border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-2xl"
          >
            <span className="text-[10px] font-black text-primary tracking-widest uppercase block mb-3">Internal Departments</span>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight">Struktur Organisasi</h2>
            <p className="text-sm text-white/50 mt-4 max-w-lg mx-auto leading-relaxed">
              SRE UPNVJT operates through six focused divisions, each responsible for a critical pillar of our movement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {structures.map((st, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                className="bg-[#050e0a] border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-primary/25 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-4xl font-display font-black text-white/10 group-hover:text-primary/40 transition-colors">{st.id}</span>
                  <span className="text-[9px] font-mono tracking-widest text-[#e8ecc4] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-right max-w-[130px] leading-snug">{st.subtitle}</span>
                </div>
                <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tight">{st.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed font-medium">{st.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Meet the Team Section — hidden when only system/admin users exist */}
      {divisionsData.length > 0 && (
        <section id="divisions" className="scroll-mt-20 py-24 px-6 md:px-12 lg:px-20 bg-[#050e0a] border-b border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 max-w-2xl"
            >
              <span className="text-[10px] font-black text-primary tracking-widest uppercase block mb-3">Chapter Members</span>
              <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight">Kepengurusan Aktif</h2>
            </motion.div>

            {/* Department tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-12 max-w-4xl w-full justify-start md:justify-center scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {divisionsData.map((div) => (
                <button
                  key={div.id}
                  onClick={() => setActiveTab(div.id)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                    activeTab === div.id 
                      ? "bg-primary text-[#050e0a] border-primary shadow-[0_0_12px_rgba(16,185,129,0.25)]" 
                      : "bg-[#07130e] text-white/50 border-white/5 hover:text-white"
                  }`}
                >
                  {div.id}
                </button>
              ))}
            </div>

            {/* Members List Grid */}
            <AnimatePresence mode="wait">
              {activeDivision && (
                <motion.div
                  key={activeDivision.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
                >
                  {activeDivision.members.map((member, i) => (
                    <div 
                      key={i} 
                      className="bg-[#07130e] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/25 transition-all group flex flex-col justify-between"
                    >
                      <div className="aspect-[4/5] bg-black/40 overflow-hidden relative border-b border-white/5">
                    <img 
                          src={member.profilePictureUrl || "/images/default-avatar.svg"} 
                          alt={member.name}
                          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07130e]/80 via-transparent to-transparent pointer-events-none" />
                      </div>
                      <div className="p-5">
                        <span className="text-[9px] font-black tracking-widest uppercase text-primary block mb-1">
                          {member.role}
                        </span>
                        <h4 className="text-sm font-black text-white group-hover:text-primary transition-colors leading-tight line-clamp-1">
                          {member.name}
                        </h4>
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider block mt-1">
                          {member.dept}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* 5. Connect With Us Section — explicit bg-[#07130e] prevents transparency bleed into footer wave */}
      <section id="connect" className="scroll-mt-20 py-24 px-6 md:px-12 lg:px-20 bg-[#07130e] text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center gap-8">
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest uppercase text-primary">
            Get Connected
          </span>
          
          <h2 className="text-4xl sm:text-6xl font-display font-black uppercase leading-tight tracking-tighter text-white">
            LET'S GET <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">CONNECTED</span>
          </h2>
          
          <p className="text-white/60 text-sm max-w-md leading-relaxed">
            Terhubung bersama kami untuk diskusi kemitraan, sponsor, media, atau sekadar bertukar wawasan seputar energi alternatif.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <a
              href="https://instagram.com/sre.upnvjt"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-primary hover:text-[#07130e] hover:border-primary flex items-center justify-center text-white transition-all hover:scale-110"
              aria-label="Instagram Link"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/sre-upnvjt"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-primary hover:text-[#07130e] hover:border-primary flex items-center justify-center text-white transition-all hover:scale-110"
              aria-label="LinkedIn Link"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a
              href="https://youtube.com/@sreupnvjt"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-primary hover:text-[#07130e] hover:border-primary flex items-center justify-center text-white transition-all hover:scale-110"
              aria-label="YouTube Link"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.387.51a3.003 3.003 0 00-2.11 2.108C0 8.025 0 12 0 12s0 3.975.503 5.837a3.003 3.003 0 002.11 2.108c1.862.51 9.387.51 9.387.51s7.525 0 9.387-.51a3.003 3.003 0 002.11-2.108C24 15.975 24 12 24 12s0-3.975-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href="mailto:sre@upnjatim.ac.id"
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-primary hover:text-[#07130e] hover:border-primary flex items-center justify-center text-white transition-all hover:scale-110"
              aria-label="Email Link"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 mt-6">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            Surabaya, Jawa Timur, Indonesia
          </div>
        </div>
      </section>

    </div>
  );
}
