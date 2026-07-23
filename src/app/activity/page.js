"use client";
import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight, Sparkles, Target, Users, BookOpen } from "lucide-react";

export default function ActivityPage() {
  const pastEvents = [
    {
      title: "Renewable Energy Camp",
      description: "A comprehensive training program on solar microgrids and local biogas system designs for youth leaders.",
      date: "October 12, 2025",
      location: "Surabaya, Indonesia",
      category: "Social Project",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Campus Energy Audit",
      description: "Conducting high-fidelity electrical consumption analysis and building-level energy efficiency audits across UPNVJT.",
      date: "December 18, 2025",
      location: "UPN Veteran Jatim",
      category: "Internal Program",
      image: "/images/about/PanelSurya.jpg"
    },
    {
      title: "Career Talks",
      description: "Talk show and mentoring sessions with renewable energy experts regarding green jobs.",
      date: "January 24, 2026",
      location: "Hybrid / Zoom",
      category: "Talkshow",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Company Visit",
      description: "One day visit to renewable energy related companies to get to know their product and work flow.",
      date: "March 15, 2026",
      location: "Paiton Power Plant",
      category: "Field Trip",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0bb37e] dark:bg-[#07130e] text-white pt-20">
      {/* ── HERO BANNER SECTION (Gambar 5 style) ── */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        {/* Background Image with Dark Multiply Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/about/PanelSurya.jpg"
            alt="SRE UPN Jatim Team Banner"
            className="w-full h-full object-cover filter brightness-75 grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-[#0a2e24] opacity-80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07130e] via-[#07130e]/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              SRE UPN JATIM PROGRAMS
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight uppercase leading-tight text-white mb-6">
              OUR <span className="text-emerald-400">PROGRAM</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-8">
              Welcome to a new world. SRE invites you to keep updated with amazing clean energy events, professional developments, and community advocacy.
            </p>
            <div className="flex gap-4">
              <a
                href="#programs"
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-emerald-900/40 text-sm uppercase tracking-wider"
              >
                See More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── EXTERNAL PROGRAM SECTION (Gambar 4 style) ── */}
      <section id="programs" className="py-24 px-6 md:px-12 bg-[#0bb37e] dark:bg-[#07130e] text-white border-t-2 border-white/25 dark:border-white/15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Interactive Group Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/25 dark:border-white/15"
          >
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
              alt="External program collaboration"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-xs uppercase tracking-widest text-yellow-300 dark:text-emerald-400 font-bold mb-1 block">• TEAM COLLABORATION</span>
              <h4 className="text-xl font-bold">Building Clean Energy Foundations</h4>
            </div>
          </motion.div>

          {/* Right: Text description */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <span className="text-xs uppercase tracking-widest text-yellow-300 dark:text-emerald-400 font-black">
              OUTREACH & SYNERGY
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black uppercase text-white dark:text-white tracking-tight leading-tight">
              External Program
            </h2>
            <p className="text-white dark:text-gray-200 leading-relaxed font-semibold text-base">
              External programs organized by the Society of Renewable Energy at UPN Veteran Jawa Timur involve activities and events that extend beyond the boundaries of the student organization to engage external stakeholders. 
            </p>
            <p className="text-white dark:text-gray-200 leading-relaxed font-semibold text-base">
              These include clean energy outreach campaigns, technology partnerships with other academic institutions, and community-based solar implementations designed to promote awareness and accelerate decentralized sustainable transition on the ground.
            </p>

            {/* Core Values Row */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col items-center p-4 rounded-xl bg-[#056041] border-2 border-yellow-300/50 dark:bg-emerald-950/60 dark:border-emerald-500/40 text-center shadow-md">
                <Target className="w-6 h-6 text-yellow-300 dark:text-emerald-400 mb-2" />
                <span className="text-xs font-black uppercase text-white dark:text-gray-200">Outreach</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-[#056041] border-2 border-yellow-300/50 dark:bg-emerald-950/60 dark:border-emerald-500/40 text-center shadow-md">
                <Users className="w-6 h-6 text-yellow-300 dark:text-emerald-400 mb-2" />
                <span className="text-xs font-black uppercase text-white dark:text-gray-200">Partnership</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-[#056041] border-2 border-yellow-300/50 dark:bg-emerald-950/60 dark:border-emerald-500/40 text-center shadow-md">
                <BookOpen className="w-6 h-6 text-yellow-300 dark:text-emerald-400 mb-2" />
                <span className="text-xs font-black uppercase text-white dark:text-gray-200">Awareness</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PAST EVENTS SECTION (Gambar 4 style) ── */}
      <section className="py-24 px-6 md:px-12 bg-[#0aa373] dark:bg-[#050e09] border-t-2 border-white/25 dark:border-white/15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center max-w-xl mx-auto">
            <span className="text-xs font-black text-yellow-300 dark:text-emerald-400 tracking-widest uppercase mb-2 block">• EXPLORE PAST DISPATCHES</span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white dark:text-white uppercase leading-[1.1]">
              Our Past Events
            </h2>
            <div className="h-[3px] w-16 bg-gradient-to-r from-white to-yellow-300 dark:from-emerald-500 dark:to-emerald-400 mx-auto mt-4" aria-hidden="true" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((ev, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group flex flex-col bg-[#056041] dark:bg-[#0d1f17] border-2 border-white/25 dark:border-white/15 rounded-2xl overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                {/* Image top with category overlay */}
                <div className="relative aspect-video w-full overflow-hidden bg-emerald-950">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-black/55 text-yellow-300 dark:text-emerald-400 border border-white/5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md">
                      {ev.category}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white dark:text-white group-hover:text-yellow-300 dark:group-hover:text-emerald-400 transition-colors duration-200 mb-2">
                      {ev.title}
                    </h3>
                    <p className="text-white dark:text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                      {ev.description}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="pt-4 border-t-2 border-white/20 dark:border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-white/90 dark:text-gray-400 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-yellow-300 dark:text-emerald-400 shrink-0" />
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/90 dark:text-gray-400 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-yellow-300 dark:text-emerald-400 shrink-0" />
                      <span>{ev.location}</span>
                    </div>
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
