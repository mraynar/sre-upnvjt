"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("Executive Board");

  const structures = [
    { id: "01", title: "Advisory Board", subtitle: "Advisor", desc: "Providing guidance and strategic direction for the organization." },
    { id: "02", title: "Top Leadership", subtitle: "President & Vice President", desc: "Leading SRE UPNVJT towards achieving its vision and mission." },
    { id: "03", title: "Administration", subtitle: "Secretary", desc: "Managing archives, correspondence, and administrative tasks." },
    { id: "04", title: "Financial Keeper", subtitle: "Treasurer", desc: "Responsible for managing the organization's treasury and cash flow." },
    { id: "05", title: "Funding & Budgeting", subtitle: "Finance", desc: "Strategizing fundraising and financial planning." },
    { id: "06", title: "Public Relation • Human Resources", subtitle: "Strategic Resource Management", desc: "Focusing on external relations and internal member development." },
    { id: "07", title: "Competition • Research • Education", subtitle: "Project Management", desc: "Driving innovation through projects, research, and competitive excellence." },
  ];

  const divisionsSliderData = [
    {
      id: "Executive Board",
      title: "Executive Board",
      desc: "Top leadership shaping the vision, strategy, and operational success of SRE UPNVJT.",
      members: [
        { name: "Muhammad Aldin Alifian", role: "Director", dept: "Human Resource (HR)" },
        { name: "Bryan Reinaldo", role: "Director", dept: "Media & Creative (MnC)" },
        { name: "Hilmi Imtiyaz Syahputra", role: "Director", dept: "Public Relations (PR)" },
        { name: "Ninit Agus Ramadhani", role: "Director", dept: "Finance" },
        { name: "Zalva Zahiya P. A.", role: "Director", dept: "ACE" },
      ]
    },
    {
      id: "Human Resources",
      title: "Human Resources",
      desc: "Cultivating talent, fostering internal bonding, and ensuring a thriving community culture.",
      members: [
        { name: "Gilang Tomi Arisaputra", role: "Manager", dept: "HR Development" },
        { name: "Mohammad Fayed Qalby", role: "Staff", dept: "HR Development" },
        { name: "Kemas Fatih A. R.", role: "Staff", dept: "HR Development" },
        { name: "Kaffi Islamay Abraar", role: "Staff", dept: "HR Development" },
        { name: "Herdanto Tri Bagus S. H.", role: "Staff", dept: "HR Development" },
        { name: "Iftitah Nurazizah Salwa", role: "Manager", dept: "HR Management" },
        { name: "Aufa Rukmana Asri", role: "Staff", dept: "HR Management" },
        { name: "Yanis Nabila Jayanti", role: "Staff", dept: "HR Management" },
        { name: "Ozzie Dharma Saputra", role: "Staff", dept: "HR Management" },
        { name: "Sholichin Chamal", role: "Staff", dept: "HR Management" },
      ]
    },
    {
      id: "Finance",
      title: "Finance",
      desc: "Strategizing fundraising, managing sponsorships, and maintaining financial stability.",
      members: [
        { name: "Hilwa Aufa I. D.", role: "Manager", dept: "Funding" },
        { name: "Nayla Dwi Pertiwi", role: "Staff", dept: "Funding" },
        { name: "Jacinda Adya Kaylani", role: "Staff", dept: "Funding" },
        { name: "Nindya Aliyah M.", role: "Staff", dept: "Funding" },
        { name: "Yuda Raharja Eka Putra", role: "Staff", dept: "Funding" },
        { name: "Galih Zaky Tristanaya", role: "Manager", dept: "Sponsorship" },
        { name: "Anggun Syafitri", role: "Staff", dept: "Sponsorship" },
        { name: "Silvia Oktaviani I.", role: "Staff", dept: "Sponsorship" },
        { name: "Dewi Astuti", role: "Staff", dept: "Sponsorship" },
        { name: "Muhammad Fadly A.", role: "Staff", dept: "Sponsorship" },
      ]
    },
    {
      id: "Media & Creative",
      title: "Media & Creative",
      desc: "Membangun identitas visual, mengelola interaksi digital, dan menciptakan inovasi kreatif.",
      members: [
        { name: "Muhammad Raihan Siddiq", role: "Manager", dept: "Creative Design" },
        { name: "Myrna Syafrida", role: "Staff", dept: "Creative Design" },
        { name: "Ivan Baihaqi Pramana", role: "Staff", dept: "Creative Design" },
        { name: "Ahmad Naufal", role: "Staff", dept: "Creative Design" },
        { name: "Faqih Romadon", role: "Staff", dept: "Creative Design" },
        { name: "Nadia Tsabitah", role: "Staff", dept: "Creative Design" },
        { name: "Nazwa Livia D. R.", role: "Staff", dept: "Creative Design" },
        { name: "Nindita Tanaya R. H.", role: "Manager", dept: "Social Media" },
        { name: "Raka Panji R.", role: "Staff", dept: "Social Media" },
        { name: "Athalia Helen H.", role: "Staff", dept: "Social Media" },
        { name: "Naufal Reyhan D.", role: "Staff", dept: "Social Media" },
        { name: "Muhammad Raynar H.", role: "Manager", dept: "Web Development" },
        { name: "Ghulamin Chalim Alwi", role: "Staff", dept: "Web Development" },
        { name: "Riko Fernanda S.", role: "Staff", dept: "Web Development" },
        { name: "Kaka Dimas S. P.", role: "Staff", dept: "Web Development" },
      ]
    },
    {
      id: "Academic Campaign",
      title: "ACE",
      desc: "Meningkatkan wawasan akademik mahasiswa dan menjalankan kampanye kesadaran energi.",
      members: [
        { name: "Desmond Natanael S.", role: "Manager", dept: "Academic" },
        { name: "Hanifah Manzilatu", role: "Staff", dept: "Academic" },
        { name: "Dalilah Baharmus", role: "Staff", dept: "Academic" },
        { name: "Ahmad Risky F.", role: "Staff", dept: "Academic" },
        { name: "Aditya Alvarel", role: "Staff", dept: "Academic" },
        { name: "Muhammad Akmal A.", role: "Staff", dept: "Academic" },
        { name: "Yehezkiel Doni W. N.", role: "Staff", dept: "Academic" },
        { name: "Dygta Azzahwa", role: "Manager", dept: "Campaign" },
        { name: "M. Aziz Syukron", role: "Staff", dept: "Campaign" },
        { name: "Achmad Rizal", role: "Staff", dept: "Campaign" },
        { name: "Muhammad Yusuf Y.", role: "Staff", dept: "Campaign" },
        { name: "Karina Indirasari", role: "Staff", dept: "Campaign" },
        { name: "Athallah Isnindra L.", role: "Staff", dept: "Campaign" },
        { name: "Muhammad Alfath S.", role: "Staff", dept: "Campaign" },
        { name: "Hikmal Akbar Habibie", role: "Manager", dept: "Plan Project" },
        { name: "Binti Maratus S.", role: "Staff", dept: "Plan Project" },
        { name: "Faizal Dany L.", role: "Staff", dept: "Plan Project" },
        { name: "Dani Shofi Nur", role: "Staff", dept: "Plan Project" },
        { name: "Elbra Aliyyah M.", role: "Staff", dept: "Plan Project" },
      ]
    },
    {
      id: "Public Relations",
      title: "Public Relations",
      desc: "Focusing on external relations, strategic partnerships, and internal member development.",
      members: [
        { name: "Raihan Hafizh Pohan", role: "Manager", dept: "External" },
        { name: "Ken Abimanyu", role: "Staff", dept: "External" },
        { name: "Muhammad Rama A. G.", role: "Staff", dept: "External" },
        { name: "Alif Seto Rifai", role: "Staff", dept: "External" },
        { name: "Okvivi Fatrisia M.", role: "Staff", dept: "External" },
        { name: "Shinta Dwi P.", role: "Staff", dept: "External" },
        { name: "Naila Maharani C. P.", role: "Staff", dept: "External" },
        { name: "Nailah Dinda Nur Aini", role: "Manager", dept: "Internal" },
        { name: "Muhammad Dhawin N.", role: "Staff", dept: "Internal" },
        { name: "Muhammad Harish S. I.", role: "Staff", dept: "Internal" },
        { name: "Faza Mujahidah A.", role: "Staff", dept: "Internal" },
        { name: "Azifahtul Nurul F.", role: "Staff", dept: "Internal" },
        { name: "Nino Ahmadiy", role: "Staff", dept: "Internal" },
        { name: "Melisa Fitria R. N.", role: "Staff", dept: "Internal" },
        { name: "Adele Rahmad Y.", role: "Staff", dept: "Internal" },
      ]
    }
  ];

  const activeDivision = divisionsSliderData.find(d => d.id === activeTab);

  return (
    <div className="min-h-screen bg-[#07130e] text-white pt-32 pb-0 selection:bg-[#e8ecc4] selection:text-[#07130e]">
      
      {/* 1. Hero / Visi Misi */}
      <section className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto mb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mb-20">
          <p className="text-[#e8ecc4] text-[12px] md:text-[14px] font-bold tracking-[0.2em] uppercase mb-4">About</p>
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

      {/* 2. Our Structure */}
      <section className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto mb-32">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:w-1/3 lg:sticky lg:top-32">
            <h2 className="text-[40px] md:text-[64px] font-display font-black leading-[0.9] tracking-tighter uppercase mb-6">
              Our <br className="hidden lg:block" /><span className="text-[#e8ecc4]">Structure</span>
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed font-light">
              A solid hierarchy ensures smooth operations. Meet the divisions that drive innovation at SRE UPNVJT.
            </p>
          </motion.div>

          <div className="lg:w-2/3 flex flex-col w-full border-t border-white/10">
            {structures.map((item, index) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group flex flex-col md:flex-row gap-4 md:gap-8 border-b border-white/10 py-8 md:py-12 cursor-default hover:bg-white/[0.02] transition-colors px-4 -mx-4 md:px-6 md:-mx-6">
                <div className="flex items-center gap-3 md:w-[15%]">
                  <span className="text-[14px] font-mono text-[#e8ecc4] font-bold">{item.id}</span>
                  <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#e8ecc4] transition-colors group-hover:rotate-45" />
                </div>
                <div className="md:w-[85%] flex flex-col gap-2">
                  <h3 className="text-[20px] md:text-[28px] font-display font-bold uppercase tracking-tight text-white group-hover:text-[#e8ecc4] transition-colors">{item.title}</h3>
                  <p className="text-[14px] uppercase tracking-[0.1em] text-white/50 font-bold mb-2">{item.subtitle}</p>
                  <p className="text-[15px] text-white/60 font-light leading-relaxed max-w-xl">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Meet the Team (Tabbed Interactive UI) */}
      <section className="bg-[#e8ecc4] text-[#07130e] pt-24 pb-32 mt-32 rounded-t-[40px] relative z-10 overflow-hidden min-h-screen">
        <div className="flex flex-col w-full">
          
          <div className="px-6 md:px-12 lg:px-20 mb-12">
            <h2 className="text-[40px] md:text-[80px] font-display font-black leading-[0.9] tracking-tighter uppercase mb-6 flex flex-col">
              <span>Meet The</span>
              <span className="text-[#0a1c15] opacity-50">Team</span>
            </h2>
            <div className="h-[2px] w-full bg-[#07130e]/10 my-8" />
            
            {/* Division Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-4">
              {divisionsSliderData.map((div) => (
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

          {/* Active Division Content Slider */}
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
                
                {/* Left Column (Info) */}
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
                  
                  {/* Arrows */}
                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full border border-[#07130e]/20 flex items-center justify-center hover:bg-[#07130e] hover:text-[#e8ecc4] transition-colors group">
                      <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button className="w-10 h-10 rounded-full border border-[#07130e]/20 flex items-center justify-center hover:bg-[#07130e] hover:text-[#e8ecc4] transition-colors group">
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Right Column Slider */}
                <div className="flex-1 flex overflow-x-auto gap-6 pr-6 md:pr-12 lg:pr-20 snap-x snap-mandatory pb-12 cursor-grab active:cursor-grabbing hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {activeDivision.members.map((member, i) => (
                    <div key={i} className="w-[280px] md:w-[320px] flex-shrink-0 snap-center relative aspect-[3/4.5] rounded-[32px] overflow-hidden group bg-[#07130e]">
                      {/* Photo */}
                      <img 
                        src={`https://images.unsplash.com/photo-15${5000000000 + (divisionsSliderData.findIndex(d => d.id === activeTab) * 100 + i) * 1234567}?q=80&w=600&auto=format&fit=crop`} 
                        alt={member.name}
                        className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        onError={(e) => { e.target.src = `https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop`; }}
                      />
                      
                      {/* Plus Icon */}
                      <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 group-hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>

                      {/* Gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#07130e] via-[#07130e]/60 to-transparent pointer-events-none" />

                      {/* Content */}
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
