"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function AboutClient({ divisionsData }) {
  const [activeTab, setActiveTab] = useState(divisionsData.length > 0 ? divisionsData[0].id : "");
  const [openSocials, setOpenSocials] = useState(null);

  const structures = [
    { id: "01", title: "Advisory Board", subtitle: "Advisor", desc: "Providing guidance and strategic direction for the organization." },
    { id: "02", title: "Top Leadership", subtitle: "President & Vice President", desc: "Leading SRE UPNVJT towards achieving its vision and mission." },
    { id: "03", title: "Administration", subtitle: "Secretary", desc: "Managing archives, correspondence, and administrative tasks." },
    { id: "04", title: "Financial Keeper", subtitle: "Treasurer", desc: "Responsible for managing the organization's treasury and cash flow." },
    { id: "05", title: "Funding & Budgeting", subtitle: "Finance", desc: "Strategizing fundraising and financial planning." },
    { id: "06", title: "Public Relation • Human Resources", subtitle: "Strategic Resource Management", desc: "Focusing on external relations and internal member development." },
    { id: "07", title: "Competition • Research • Education", subtitle: "Project Management", desc: "Driving innovation through projects, research, and competitive excellence." },
  ];

  const activeDivision = divisionsData.find(d => d.id === activeTab);

  return (
    <div className="min-h-screen bg-[#07130e] text-white pt-32 pb-0 selection:bg-[#e8ecc4] selection:text-[#07130e]">
      
      {/* 1. Hero / Visi Misi */}
      <section className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto mb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mb-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <p className="text-[#e8ecc4] text-[12px] md:text-[14px] font-bold tracking-[0.2em] uppercase">About</p>
            <a href="https://sre.co.id" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-white/70 hover:text-[#07130e] hover:bg-[#e8ecc4] hover:border-[#e8ecc4] transition-all cursor-pointer group">
               Member of SRE INDONESIA <ArrowUpRight className="w-3 h-3 group-hover:rotate-45 transition-transform" />
            </a>
          </div>
          <h1 className="text-[50px] md:text-[80px] lg:text-[100px] font-display font-black leading-[0.9] tracking-tighter uppercase">
            SRE <span className="text-white/40 italic font-serif lowercase font-normal tracking-normal">at</span> <br />
            UPN Veteran <br />
            <span className="text-[#e8ecc4]">Jawa Timur</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-[24px] md:text-[32px] font-display font-bold mb-4 text-[#e8ecc4] tracking-tight">VISI</h2>
            <p className="text-[16px] md:text-[18px] text-white/70 leading-relaxed font-light">
              Menjadi wadah esensial bagi mahasiswa dalam mengeksplorasi, mengembangkan, dan mengimplementasikan inovasi di bidang energi baru terbarukan demi masa depan yang berkelanjutan.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            <h2 className="text-[24px] md:text-[32px] font-display font-bold mb-4 text-[#e8ecc4] tracking-tight">MISI</h2>
            <ul className="text-[16px] md:text-[18px] text-white/70 leading-relaxed font-light space-y-4 list-none">
              <li className="flex gap-4"><span className="text-[#e8ecc4] font-bold">—</span>Meningkatkan kesadaran dan literasi mahasiswa terhadap pentingnya transisi energi.</li>
              <li className="flex gap-4"><span className="text-[#e8ecc4] font-bold">—</span>Memfasilitasi riset, diskusi, dan proyek kolaboratif yang aplikatif di sektor energi hijau.</li>
              <li className="flex gap-4"><span className="text-[#e8ecc4] font-bold">—</span>Membangun jaringan sinergis dengan institusi, industri, dan masyarakat demi dampak yang nyata.</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 2. Meet the Team (Tabbed Interactive UI) */}
      <section className="bg-[#e8ecc4] text-[#07130e] pt-24 pb-32 mt-32 rounded-t-[40px] relative z-10 overflow-hidden min-h-screen">
        <div className="flex flex-col w-full">
          
          <div className="px-6 md:px-12 lg:px-20 mb-12">
            <h2 className="text-[40px] md:text-[80px] font-display font-black leading-[0.9] tracking-tighter uppercase mb-6 flex flex-col">
              <span>Meet The</span>
              <span className="text-[#0a1c15] opacity-50">Team</span>
            </h2>
            <div className="h-[2px] w-full bg-[#07130e]/10 my-8" />
            
            <div className="flex flex-wrap gap-2 md:gap-4">
              {divisionsData.map((div) => (
                <button
                  key={div.id}
                  onClick={() => setActiveTab(div.id)}
                  className={`px-5 py-2.5 rounded-full text-[12px] md:text-[14px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                    activeTab === div.id 
                      ? "bg-[#07130e] text-[#e8ecc4] border-[#07130e]" 
                      : "bg-transparent text-[#07130e]/50 border-[#07130e]/20 hover:border-[#07130e]/50 hover:text-[#07130e]"
                  }`}
                >
                  {div.id}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#07130e]/10 mb-12" />

          <AnimatePresence mode="wait">
            {activeDivision && (
              <motion.div 
                key={activeDivision.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col xl:flex-row gap-12 w-full pl-6 md:pl-12 lg:pl-20"
              >
                
                <div className="xl:w-[400px] flex-shrink-0 xl:sticky xl:top-40 xl:self-start z-10 pr-6">
                  <span className="text-[12px] font-mono tracking-widest uppercase mb-4 block text-[#07130e]/50 font-bold">
                    Division Focus
                  </span>
                  <h2 className="text-[48px] md:text-[64px] font-display font-black leading-[0.9] tracking-tighter uppercase mb-6 whitespace-pre-line">
                    {activeDivision.title}
                  </h2>
                  <p className="text-[#07130e]/60 text-[14px] leading-relaxed mb-10 max-w-sm font-medium">
                    {activeDivision.desc}
                  </p>
                  
                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full border border-[#07130e]/20 flex items-center justify-center hover:bg-[#07130e] hover:text-[#e8ecc4] transition-colors group">
                      <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button className="w-10 h-10 rounded-full border border-[#07130e]/20 flex items-center justify-center hover:bg-[#07130e] hover:text-[#e8ecc4] transition-colors group">
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex overflow-x-auto gap-6 pr-6 md:pr-12 lg:pr-20 snap-x snap-mandatory pb-12 cursor-grab active:cursor-grabbing hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {activeDivision.members.map((member, i) => (
                    <div key={i} className="w-[280px] md:w-[320px] flex-shrink-0 snap-center relative aspect-[3/4.5] rounded-[32px] overflow-hidden group bg-[#07130e]">
                      <img 
                        src={member.profilePictureUrl || "/images/default-avatar.svg"} 
                        alt={member.name}
                        className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        onError={(e) => { e.target.src = "/images/default-avatar.svg"; }}
                      />
                      <button 
                        onClick={() => setOpenSocials(openSocials === i ? null : i)}
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-black/80 hover:text-white transition-colors z-20 cursor-pointer"
                      >
                        <Plus className={`w-4 h-4 transition-transform ${openSocials === i ? 'rotate-45' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {openSocials === i && (member.instagramUrl || member.linkedinUrl) && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 20 }}
                            className="absolute top-16 right-5 flex flex-col gap-2 z-20"
                          >
                            {member.instagramUrl && (
                              <a href={member.instagramUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#07130e]/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#e8ecc4] hover:text-[#07130e] transition-colors border border-white/10 shadow-lg">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                              </a>
                            )}
                            {member.linkedinUrl && (
                              <a href={member.linkedinUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#07130e]/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#e8ecc4] hover:text-[#07130e] transition-colors border border-white/10 shadow-lg">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                              </a>
                            )}
                          </motion.div>
                        )}
                        {openSocials === i && (!member.instagramUrl && !member.linkedinUrl) && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 20 }}
                            className="absolute top-16 right-5 bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-20 border border-white/10"
                          >
                            No links added
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#07130e] via-[#07130e]/60 to-transparent pointer-events-none" />

                      <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col items-start pointer-events-none">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-6 h-[1.5px] bg-[#e8ecc4]" />
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#e8ecc4] font-bold">
                            {member.role}
                          </span>
                        </div>
                        <h3 className="text-[20px] md:text-[24px] font-display font-black uppercase tracking-tight leading-[1.1] mb-1 group-hover:text-[#e8ecc4] transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-[10px] md:text-[11px] uppercase tracking-widest text-white/50 font-bold mt-1">
                          {member.dept}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

    </div>
  );
}
