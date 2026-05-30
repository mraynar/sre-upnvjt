"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function ArticlePage() {
  const articles = [
    {
      id: 1,
      title: "The Future of Solar Energy in Indonesia",
      category: "Renewable Energy",
      date: "May 20, 2026",
      author: "Aditya Alvarel",
      img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
      desc: "Exploring the vast potential of solar power adoption across the archipelago and the policies driving its growth.",
    },
    {
      id: "2",
      title: "Wind Turbines: Efficiency and Environmental Impact",
      category: "Technology",
      date: "April 15, 2026",
      author: "Dalilah Baharmus",
      img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop",
      desc: "An in-depth look at how modern wind turbines are balancing high energy output with minimal ecological disruption.",
    },
    {
      id: "3",
      title: "Biomass as an Alternative Fuel Source",
      category: "Research",
      date: "March 10, 2026",
      author: "Ahmad Risky Firdiansyah",
      img: "https://images.unsplash.com/photo-1511496155998-3236e792e86b?q=80&w=1200&auto=format&fit=crop",
      desc: "How agricultural waste is being transformed into a viable and sustainable alternative to fossil fuels in rural areas.",
    },
    {
      id: "4",
      title: "The Role of Youth in Energy Transition",
      category: "Campaign",
      date: "February 28, 2026",
      author: "Dygta Azzahwa",
      img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=1200&auto=format&fit=crop",
      desc: "Highlighting the initiatives driven by students and young professionals to advocate for a greener future.",
    },
    {
      id: "5",
      title: "Understanding Carbon Credits and Trading",
      category: "Economy",
      date: "January 15, 2026",
      author: "Ninit Agus Ramadhani",
      img: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1200&auto=format&fit=crop",
      desc: "A beginner's guide to the carbon market, how it works, and its impact on corporate sustainability efforts.",
    },
    {
      id: "6",
      title: "Geothermal Power: Indonesia's Hidden Gem",
      category: "Renewable Energy",
      date: "December 05, 2025",
      author: "Desmond Natanael Sinaga",
      img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=1200&auto=format&fit=crop",
      desc: "With one of the world's largest geothermal reserves, how can Indonesia fully capitalize on this stable energy source?",
    },
  ];

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-[#e8ecc4] text-[#07130e] pt-32 pb-0 selection:bg-[#07130e] selection:text-[#e8ecc4]">
      
      {/* 1. Header / Title */}
      <section className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-[#07130e] pb-8 gap-8">
            <div>
              <p className="text-[#07130e]/60 text-[12px] md:text-[14px] font-bold tracking-[0.2em] uppercase mb-4">
                SRE UPNVJT Journal
              </p>
              <h1 className="text-[60px] md:text-[90px] lg:text-[130px] font-display font-black leading-[0.8] tracking-tighter uppercase">
                Insights <br />
                <span className="font-serif italic font-normal normal-case opacity-70 pr-4 text-[70px] md:text-[100px] lg:text-[140px]">&amp;</span>
                Articles
              </h1>
            </div>
            <p className="text-[14px] md:text-[16px] text-[#07130e]/80 font-medium max-w-xs md:text-right leading-relaxed">
              Perspektif, riset, dan opini terbaru seputar transisi energi, inovasi teknologi, dan keberlanjutan lingkungan.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 2. Featured Article */}
      <section className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="group cursor-pointer grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
        >
          {/* Image */}
          <div className="w-full aspect-[4/3] lg:aspect-[4/4] overflow-hidden rounded-[32px] bg-black/5 relative">
            <img 
              src={featuredArticle.img} 
              alt={featuredArticle.title} 
              className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
            />
            {/* Overlay badge */}
            <div className="absolute top-6 left-6 bg-[#07130e] text-[#e8ecc4] px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase">
              Featured
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#07130e]/60 font-bold border border-[#07130e]/20 px-3 py-1 rounded-full">
                {featuredArticle.category}
              </span>
              <span className="text-[13px] font-bold text-[#07130e]/60 uppercase tracking-widest">
                {featuredArticle.date}
              </span>
            </div>
            
            <h2 className="text-[40px] md:text-[64px] font-display font-black leading-[0.95] tracking-tight uppercase text-[#07130e] mb-6 group-hover:opacity-70 transition-opacity">
              {featuredArticle.title}
            </h2>
            
            <p className="text-[16px] md:text-[18px] text-[#07130e]/80 leading-relaxed font-medium mb-10 max-w-xl">
              {featuredArticle.desc}
            </p>

            <div className="flex items-center justify-between border-t border-[#07130e]/10 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#07130e]/10 flex items-center justify-center font-display font-bold text-[#07130e]">
                  {featuredArticle.author.charAt(0)}
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-[#07130e]/50 mb-0.5">Written by</span>
                  <span className="block text-[14px] font-bold uppercase tracking-tight text-[#07130e]">{featuredArticle.author}</span>
                </div>
              </div>
              
              <div className="w-12 h-12 rounded-full border border-[#07130e]/20 flex items-center justify-center group-hover:bg-[#07130e] group-hover:text-[#e8ecc4] transition-colors">
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Article Grid */}
      <section className="bg-[#07130e] text-[#e8ecc4] pt-24 pb-32 rounded-t-[40px]">
        <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
          
          <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
            <h3 className="text-[32px] md:text-[48px] font-display font-black tracking-tighter uppercase text-white">
              Latest Reads
            </h3>
            <span className="text-[14px] font-mono uppercase tracking-widest text-white/50">
              {regularArticles.length} Articles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 gap-y-16">
            {regularArticles.map((article, index) => (
              <motion.div 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="w-full aspect-[4/3] overflow-hidden rounded-2xl bg-white/5 mb-6">
                  <img 
                    src={article.img} 
                    alt={article.title} 
                    className="w-full h-full object-cover filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                </div>

                {/* Tags */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#e8ecc4] border border-[#e8ecc4]/30 px-2 py-1 rounded-sm">
                    {article.category}
                  </span>
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                    {article.date}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-[24px] font-display font-bold uppercase tracking-tight text-white mb-3 group-hover:text-[#e8ecc4] transition-colors leading-[1.1]">
                  {article.title}
                </h4>

                {/* Desc */}
                <p className="text-[14px] text-white/60 leading-relaxed mb-6 line-clamp-2">
                  {article.desc}
                </p>

                {/* Author & Read More */}
                <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-white/50">
                    By {article.author}
                  </span>
                  <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#e8ecc4] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-20 flex justify-center">
            <button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-[#07130e] text-white transition-colors text-[13px] font-bold uppercase tracking-widest">
              Load More Articles
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
