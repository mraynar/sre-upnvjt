"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Animation Variants ────────────────────────────────────────────────────────

// Stagger parent — capped total budget ~600ms for 3-col grid
const staggerGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MerchPublicClient({ merchandise }) {
  const fallbackProducts = [
    {
      id: "M-01",
      name: "SRE Essential T-Shirt",
      category: "Apparel",
      price: 115000,
      status: "Available",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
      desc: "Kaos premium berbahan katun 30s yang menyerap keringat. Tersedia warna Hitam dan Hijau Gelap.",
    }
  ];

  const displayProducts = merchandise && merchandise.length > 0 ? merchandise : fallbackProducts;

  return (
    <div className="min-h-screen bg-white dark:bg-[#07130e] text-[#07130e] dark:text-white pt-32 pb-0 selection:bg-[#e8ecc4] dark:bg-[#050e09] selection:text-[#07130e]">
      
      {/* ── 1. Hero Section ─────────────────────────────────────────────────── */}
      <section id="hero" className="scroll-mt-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-[#07130e]/10 dark:border-white/10 pb-10"
        >
          <div>
            <p className="text-primary dark:text-[#e8ecc4] text-[12px] md:text-[14px] font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              SRE Official Store
            </p>
            <h1 className="text-[60px] md:text-[90px] lg:text-[130px] font-display font-black leading-[0.8] tracking-tighter uppercase">
              Merch <br />
              <span className="text-primary dark:text-[#e8ecc4]">Drop</span>
            </h1>
          </div>
          <p className="text-[14px] md:text-[16px] text-[#07130e]/60 dark:text-white/55 font-medium max-w-xs md:text-right leading-relaxed mb-4">
            Kenakan semangat transisi energi. Dukung pergerakan hijau dengan memiliki merchandise resmi dari SRE UPN Veteran Jawa Timur.
          </p>
        </motion.div>
      </section>

      {/* ── 2. Marquee Banner ───────────────────────────────────────────────── */}
      <div className="bg-slate-50 dark:bg-[#050e09] text-[#07130e] dark:text-white/70 py-3 mb-20 border-y border-slate-200 dark:border-white/5 overflow-hidden flex select-none" aria-hidden="true">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          className="flex whitespace-nowrap gap-8 font-mono text-[13px] font-bold tracking-widest uppercase"
        >
          {Array(20).fill("EXCLUSIVE MERCH • SUPPORT OUR MOVEMENT •").map((text, i) => (
            <span key={i} className="shrink-0">{text}&nbsp;</span>
          ))}
        </motion.div>
      </div>

      {/* ── 3. Product Grid ──────────────────────────────────────────────────── */}
      <section id="catalog" className="scroll-mt-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-32" aria-label="Product catalog">
        <motion.div
          variants={staggerGrid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-x-8 gap-y-16"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            justifyItems: "stretch",
          }}
        >
          {displayProducts.map((product) => {
            const isSoldOut = product.isAvailable === false || product.status === "Sold Out";
            const statusLabel = product.status || (product.isAvailable ? "Available" : "Sold Out");
            const productImage = product.imageUrl || product.img;

            return (
              <motion.article
                key={product.id}
                variants={cardVariant}
                className="group cursor-pointer flex flex-col"
                aria-label={`${product.name}${isSoldOut ? " — Sold Out" : ""}`}
              >
                <a
                  href={isSoldOut ? undefined : (product.linkUrl || "/merchandise/order")}
                  target={product.linkUrl ? "_blank" : "_self"}
                  rel={product.linkUrl ? "noreferrer noopener" : undefined}
                  aria-disabled={isSoldOut}
                  tabIndex={isSoldOut ? -1 : 0}
                  className="focus-visible:outline-primary focus-visible:rounded-[24px]"
                >
                  <div className={`w-full aspect-[4/5] overflow-hidden rounded-[24px] bg-[#0a1c15] mb-6 relative ${isSoldOut ? "cursor-not-allowed" : ""}`}>
                    {/* Status badge */}
                    <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-md border ${
                      isSoldOut
                        ? "bg-red-500/80 text-white border-red-400/30"
                        : statusLabel === "Best Seller"
                        ? "bg-primary/20 text-primary-focus border-primary/30 dark:bg-[#050e09]/90 dark:text-white"
                        : "bg-black/50 text-white/80 border-[#07130e]/15 dark:border-white/10"
                    }`}>
                      {statusLabel}
                    </div>

                    {/* Product ID tag */}
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full border border-white/15 text-[10px] font-mono tracking-widest text-white/40 bg-black/30 backdrop-blur-sm">
                      {product.id}
                    </div>

                    {/* Hover CTA overlay */}
                    {!isSoldOut && (
                      <div className="absolute inset-0 bg-[#07130e]/50 opacity-0 group-hover:opacity-100 transition-all duration-400 z-10 flex items-center justify-center">
                        <motion.div
                          initial={{ y: 12, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          className="translate-y-4 group-hover:translate-y-0 transition-all duration-400 flex items-center gap-2 bg-[#07130e] text-white dark:bg-white dark:text-[#07130e] px-6 py-3 rounded-full font-bold uppercase tracking-wider text-[12px] shadow-xl"
                        >
                          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                          Order Now
                        </motion.div>
                      </div>
                    )}

                    {/* Product image */}
                    {productImage ? (
                      <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 30vw"
                        className={`object-cover transition-all duration-700 ease-out group-hover:scale-108 ${isSoldOut ? "grayscale opacity-40" : "opacity-90 group-hover:opacity-100"}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/15" aria-label="No product image available">
                        <ShoppingBag className="w-12 h-12 mb-2 opacity-40" aria-hidden="true" />
                        <span className="text-[12px]">No Image Available</span>
                      </div>
                    )}
                  </div>
                </a>

                {/* Product info */}
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-4 mb-1.5">
                    <h3 className="text-[19px] font-display font-bold uppercase tracking-tight text-[#07130e] dark:text-white leading-tight group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h3>
                    <span className="text-[16px] font-mono font-bold text-primary-focus dark:text-primary whitespace-nowrap">
                      {typeof product.price === "string" && product.price.startsWith("Rp")
                        ? product.price
                        : `Rp ${parseFloat(product.price).toLocaleString("id-ID")}`}
                    </span>
                  </div>
                  
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#07130e]/40 dark:text-white/35 mb-3 block">
                    {product.category || "Official Merch"}
                  </span>

                  <p className="text-[14px] text-[#07130e]/60 dark:text-white/50 leading-relaxed font-light mb-5 line-clamp-3">
                    {product.description || product.desc}
                  </p>

                  {/* CTA link visible below card */}
                  {!isSoldOut && (
                    <a
                      href={product.linkUrl || "/merchandise/order"}
                      target={product.linkUrl ? "_blank" : "_self"}
                      rel={product.linkUrl ? "noreferrer noopener" : undefined}
                      className="mt-auto inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-widest text-primary hover:text-primary-focus transition-colors duration-200 group/link focus-visible:outline-primary"
                      aria-label={`Order ${product.name}`}
                    >
                      Order Now
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:rotate-45 transition-transform duration-300" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      {/* ── 4. How to Order CTA ─────────────────────────────────────────────── */}
      <section id="order" className="scroll-mt-20 bg-slate-50 text-[#07130e] dark:bg-[#07130e] dark:text-white py-24 border-t border-slate-200 dark:border-transparent rounded-t-[40px] text-center px-6" aria-label="How to order merchandise">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-[40px] md:text-[64px] font-display font-black leading-[0.9] tracking-tighter uppercase mb-6">
            How to <br className="md:hidden" />Order?
          </h2>
          <p className="text-[15px] md:text-[18px] text-[#07130e]/65 dark:text-white/65 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Untuk pemesanan seluruh merchandise resmi SRE UPNVJT, silakan hubungi narahubung kami via WhatsApp atau kunjungi stand kami saat event berlangsung.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/merchandise/order">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex px-8 py-4 rounded-full bg-[#07130e] text-white hover:bg-[#0f2a20] dark:bg-primary dark:text-[#07130e] dark:hover:bg-emerald-400 font-bold uppercase tracking-widest text-[13px] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 cursor-pointer items-center gap-2 shadow-xl"
              >
                Order via Web Form <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
