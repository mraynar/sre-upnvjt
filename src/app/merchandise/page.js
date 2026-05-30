"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function MerchandisePage() {
  const products = [
    {
      id: "M-01",
      name: "SRE Essential T-Shirt",
      category: "Apparel",
      price: "Rp 115.000",
      status: "Available",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
      desc: "Kaos premium berbahan katun 30s yang menyerap keringat. Tersedia warna Hitam dan Hijau Gelap.",
    },
    {
      id: "M-02",
      name: "Eco-Friendly Tote Bag",
      category: "Accessories",
      price: "Rp 65.000",
      status: "Best Seller",
      img: "https://images.unsplash.com/photo-1597484661643-2f5fef640df1?q=80&w=1200&auto=format&fit=crop",
      desc: "Tas kanvas tebal dengan sablon logo SRE bergaya minimalis. Cocok untuk kuliah dan ramah lingkungan.",
    },
    {
      id: "M-03",
      name: "Energy Lanyard + ID Card Holder",
      category: "Office / Campus",
      price: "Rp 35.000",
      status: "Pre-Order",
      img: "https://images.unsplash.com/photo-1593005510509-d05b264f1c9c?q=80&w=1200&auto=format&fit=crop",
      desc: "Lanyard eksklusif SRE UPNVJT dengan material halus yang nyaman di leher, lengkap dengan tempat ID.",
    },
    {
      id: "M-04",
      name: "Stainless Steel Tumbler",
      category: "Drinkware",
      price: "Rp 120.000",
      status: "Limited",
      img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200&auto=format&fit=crop",
      desc: "Kurangi penggunaan plastik dengan tumbler isolasi ganda yang mampu menahan panas/dingin hingga 12 jam.",
    },
    {
      id: "M-05",
      name: "Renewable Energy Sticker Pack",
      category: "Accessories",
      price: "Rp 15.000",
      status: "Available",
      img: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?q=80&w=1200&auto=format&fit=crop",
      desc: "Set stiker vinyl anti-air dengan desain kampanye energi hijau yang unik. Cocok untuk ditempel di laptop.",
    },
    {
      id: "M-06",
      name: "SRE Windbreaker Jacket",
      category: "Apparel",
      price: "Rp 250.000",
      status: "Sold Out",
      img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop",
      desc: "Jaket tahan angin berbahan parasut premium dengan identitas SRE, sempurna untuk kegiatan lapangan.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07130e] text-white pt-32 pb-0 selection:bg-[#e8ecc4] selection:text-[#07130e]">
      
      {/* 1. Hero Section (Streetwear Drop Style) */}
      <section className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto mb-20 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/10 pb-10">
          <div>
            <p className="text-[#e8ecc4] text-[12px] md:text-[14px] font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              SRE Official Store
            </p>
            <h1 className="text-[60px] md:text-[90px] lg:text-[130px] font-display font-black leading-[0.8] tracking-tighter uppercase">
              Merch <br />
              <span className="text-[#e8ecc4]">Drop</span>
            </h1>
          </div>
          <p className="text-[14px] md:text-[16px] text-white/60 font-medium max-w-xs md:text-right leading-relaxed mb-4">
            Kenakan semangat transisi energi. Dukung pergerakan hijau dengan memiliki *merchandise* resmi dari SRE UPN Veteran Jawa Timur.
          </p>
        </motion.div>
      </section>

      {/* 2. Marquee Banner */}
      <div className="bg-[#e8ecc4] text-[#07130e] py-3 mb-20 overflow-hidden flex select-none">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="flex whitespace-nowrap gap-8 font-mono text-[13px] font-bold tracking-widest uppercase"
        >
          {Array(10).fill("Exclusive Merch • Support Our Movement •").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </motion.div>
      </div>

      {/* 3. Product Grid */}
      <section className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              className="group cursor-pointer flex flex-col"
            >
              {/* Product Image Container */}
              <Link href={product.status === "Sold Out" ? "#" : "/merchandise/order"}>
                <div className="w-full aspect-[4/5] overflow-hidden rounded-[24px] bg-[#0a1c15] mb-6 relative group">
                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-md ${
                    product.status === "Sold Out" ? "bg-red-500/80 text-white" :
                    product.status === "Best Seller" ? "bg-[#e8ecc4]/90 text-[#07130e]" :
                    "bg-black/50 text-white"
                  }`}>
                    {product.status}
                  </div>

                  {/* ID Badge */}
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full border border-white/20 text-[10px] font-mono tracking-widest text-white/50 bg-black/20">
                    {product.id}
                  </div>

                  {/* Hover Add to Cart Overlay */}
                  <div className="absolute inset-0 bg-[#07130e]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 bg-[#e8ecc4] text-[#07130e] px-6 py-3 rounded-full font-bold uppercase tracking-wider text-[12px]">
                      <ShoppingBag className="w-4 h-4" />
                      {product.status === "Sold Out" ? "Out of Stock" : "Order Now"}
                    </div>
                  </div>

                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className={`w-full h-full object-cover filter transition-all duration-700 ease-out group-hover:scale-110 ${product.status === "Sold Out" ? "grayscale opacity-50" : "opacity-90 group-hover:opacity-100"}`}
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="text-[20px] font-display font-bold uppercase tracking-tight text-white leading-tight group-hover:text-[#e8ecc4] transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-[16px] font-mono font-bold text-[#e8ecc4] whitespace-nowrap">
                    {product.price}
                  </span>
                </div>
                
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3 block">
                  {product.category}
                </span>

                <p className="text-[14px] text-white/60 leading-relaxed font-light mb-6">
                  {product.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Footer CTA for Merchandise */}
      <section className="bg-[#e8ecc4] text-[#07130e] py-24 rounded-t-[40px] text-center px-6">
        <h2 className="text-[40px] md:text-[64px] font-display font-black leading-[0.9] tracking-tighter uppercase mb-6">
          How to <br className="md:hidden"/> Order?
        </h2>
        <p className="text-[15px] md:text-[18px] text-[#07130e]/70 max-w-2xl mx-auto mb-10 font-medium">
          Untuk pemesanan seluruh merchandise resmi SRE UPNVJT, silakan hubungi narahubung kami via WhatsApp atau kunjungi stand kami saat event berlangsung.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/merchandise/order">
            <span className="px-8 py-4 rounded-full bg-[#07130e] text-[#e8ecc4] font-bold uppercase tracking-widest text-[13px] hover:bg-[#0a1f18] transition-colors flex items-center gap-2 cursor-pointer">
              Order via Web Form <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>
          <a href="#" className="px-8 py-4 rounded-full border border-[#07130e]/20 text-[#07130e] font-bold uppercase tracking-widest text-[13px] hover:bg-black/5 transition-colors">
            View Size Chart
          </a>
        </div>
      </section>

    </div>
  );
}
