"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function ActivityPage() {
  const activities = [
    {
      id: "01",
      title: "SRE Goes To School",
      category: "Education & Campaign",
      date: "October 2025",
      desc: "Mengedukasi siswa SMA/SMK tentang pentingnya transisi energi hijau sejak dini melalui workshop interaktif.",
      img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "02",
      title: "Renewable Energy Talk",
      category: "Seminar & Talkshow",
      date: "November 2025",
      desc: "Diskusi panel bersama pakar industri energi terbarukan membahas potensi Solar PV di Jawa Timur.",
      img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "03",
      title: "Eco-Campus Initiative",
      category: "Project Implementation",
      date: "December 2025",
      desc: "Instalasi purwarupa panel surya berskala kecil untuk fasilitas pengisian daya di area kampus UPNVJT.",
      img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "04",
      title: "Beach Clean Up & Mangrove",
      category: "Social Action",
      date: "January 2026",
      desc: "Aksi sosial membersihkan kawasan pesisir dan menanam bibit mangrove untuk mencegah abrasi.",
      img: "https://images.unsplash.com/photo-1618477461853-cf6ed80fbea5?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07130e] text-white pt-32 pb-0 selection:bg-[#e8ecc4] selection:text-[#07130e]">
      
      {/* 1. Hero Section */}
      <section className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto mb-32 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10">
          <p className="text-[#e8ecc4] text-[12px] md:text-[14px] font-bold tracking-[0.2em] uppercase mb-4">
            Our Portfolio
          </p>
          <h1 className="text-[50px] md:text-[80px] lg:text-[120px] font-display font-black leading-[0.85] tracking-tighter uppercase mb-8">
            Driving <br />
            <span className="text-white/40 italic font-serif lowercase font-normal tracking-normal text-[60px] md:text-[90px] lg:text-[130px] pr-4">the</span>
            <span className="text-[#e8ecc4]">Impact</span>
          </h1>
          <p className="text-[16px] md:text-[20px] text-white/60 leading-relaxed font-light max-w-xl">
            Dari kampanye edukasi hingga implementasi proyek nyata, lihat bagaimana SRE UPNVJT mengambil peran aktif dalam mengawal transisi energi hijau.
          </p>
        </motion.div>

        {/* Decorative Graphic */}
        <div className="absolute top-0 right-10 md:right-20 lg:right-40 opacity-20 hidden md:block">
           <svg width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin-slow">
              <path d="M100 0L110 90L200 100L110 110L100 200L90 110L0 100L90 90L100 0Z" fill="#e8ecc4"/>
           </svg>
        </div>
      </section>

      {/* 2. Highlighted Featured Activity */}
      <section className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="group relative w-full aspect-[4/3] md:aspect-[21/9] rounded-[40px] overflow-hidden bg-white/5 cursor-pointer"
        >
          {/* Background Image */}
          <img 
            src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2000&auto=format&fit=crop" 
            alt="Featured Activity" 
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-105"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-[#07130e] opacity-40 mix-blend-multiply group-hover:opacity-20 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07130e] via-[#07130e]/40 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-8 left-8 right-8 md:bottom-16 md:left-16 md:right-16 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="flex flex-col gap-4 max-w-2xl">
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#e8ecc4]/40 text-[#e8ecc4] text-[10px] md:text-[12px] font-bold uppercase tracking-widest backdrop-blur-md w-fit">
                Featured Activity • 2026
              </span>
              <h2 className="text-[32px] md:text-[56px] lg:text-[72px] font-display font-black leading-[0.9] tracking-tighter uppercase text-white group-hover:text-[#e8ecc4] transition-colors">
                Grand Launching SRE UPNVJT
              </h2>
            </div>
            
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-[#e8ecc4] group-hover:text-[#07130e] text-white transition-all duration-500">
              <ArrowUpRight className="w-8 h-8 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Activity List (Bento/List Style) */}
      <section className="bg-[#e8ecc4] text-[#07130e] pt-32 pb-40 rounded-t-[40px] relative z-10">
        <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
            <div>
              <span className="text-[12px] font-mono tracking-widest uppercase mb-4 block text-[#07130e]/50 font-bold">
                Archive
              </span>
              <h2 className="text-[40px] md:text-[64px] font-display font-black leading-[0.9] tracking-tighter uppercase">
                Recent <br />Programs
              </h2>
            </div>
            <button className="px-8 py-4 rounded-full border border-[#07130e]/20 hover:bg-[#07130e] hover:text-[#e8ecc4] transition-colors text-[13px] font-bold uppercase tracking-widest">
              View All Archive
            </button>
          </div>

          <div className="flex flex-col">
            {activities.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex flex-col lg:flex-row gap-6 md:gap-12 py-10 md:py-16 border-t border-[#07130e]/10 hover:bg-[#07130e]/5 transition-colors -mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-20 lg:px-20 cursor-pointer"
              >
                
                {/* Number & Date */}
                <div className="lg:w-1/4 flex flex-col justify-between">
                  <span className="text-[16px] font-mono text-[#07130e]/40 font-bold mb-4 lg:mb-0">
                    {item.id}
                  </span>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#07130e]/50 block mb-1">Date</span>
                    <span className="text-[14px] font-bold uppercase tracking-wide text-[#07130e]">{item.date}</span>
                  </div>
                </div>

                {/* Title & Category */}
                <div className="lg:w-1/2 flex flex-col justify-center">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#07130e]/50 block mb-3">
                    {item.category}
                  </span>
                  <h3 className="text-[28px] md:text-[40px] font-display font-black uppercase tracking-tight leading-[1.1] text-[#07130e] mb-4 group-hover:opacity-70 transition-opacity">
                    {item.title}
                  </h3>
                  <p className="text-[#07130e]/70 text-[15px] leading-relaxed max-w-lg">
                    {item.desc}
                  </p>
                </div>

                {/* Image Reveal */}
                <div className="lg:w-1/4 flex items-center justify-end">
                  <div className="w-full lg:w-48 aspect-video lg:aspect-[4/5] overflow-hidden rounded-2xl relative">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                    />
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
