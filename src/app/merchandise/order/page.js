"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { getPublicMerchandise } from "@/app/actions/merchandiseActions";

const CustomSelect = ({ label, options, value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col gap-2 w-full">
      <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold">
        {label}
      </label>
      
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between border-b pb-2 text-[16px] transition-colors ${
          disabled ? 'border-white/10 opacity-30 cursor-not-allowed' : 'border-white/20 cursor-pointer hover:border-[#e8ecc4]'
        }`}
      >
        <span className="truncate pr-4">
          {options.find(o => o.value === value)?.label || value}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      <AnimatePresence>
        {isOpen && !disabled && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-[100%] left-0 right-0 mt-3 bg-[#0a1f18] border border-white/10 rounded-2xl overflow-hidden z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="max-h-[250px] overflow-y-auto hide-scrollbar">
                {options.map((opt) => (
                  <div 
                    key={opt.value}
                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                    className={`px-5 py-4 text-[14px] cursor-pointer transition-colors flex items-center justify-between ${
                      value === opt.value ? 'bg-[#e8ecc4] text-[#07130e] font-bold' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {value === opt.value && (
                      <motion.div layoutId="check" className="w-2 h-2 rounded-full bg-[#07130e]" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function OrderPage() {
  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    phone: "",
    item: "SRE Essential T-Shirt",
    size: "L",
    qty: 1,
    notes: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [itemOptions, setItemOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    getPublicMerchandise().then(res => {
      if (res.success && res.data.length > 0) {
        const options = res.data.map(m => ({
          value: m.name,
          label: `${m.name} - Rp ${parseFloat(m.price).toLocaleString('id-ID')}`
        }));
        setItemOptions(options);
        setFormData(prev => ({ ...prev, item: options[0].value }));
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const sizeOptions = [
    { value: "S", label: "Size S (Small)" },
    { value: "M", label: "Size M (Medium)" },
    { value: "L", label: "Size L (Large)" },
    { value: "XL", label: "Size XL (Extra Large)" },
    { value: "XXL", label: "Size XXL (Double XL)" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct WhatsApp Message
    const adminPhone = "6281234567890"; // Ganti dengan nomor WhatsApp Admin SRE yang sesungguhnya
    let message = `Halo Admin SRE UPNVJT, saya ingin memesan merchandise:\n\n`;
    message += `*Nama:* ${formData.name}\n`;
    message += `*NPM/NIM:* ${formData.nim}\n`;
    message += `*No WhatsApp:* ${formData.phone}\n\n`;
    message += `*Pesanan:*\n`;
    message += `- Barang: ${formData.item}\n`;
    if (formData.item.toLowerCase().includes("t-shirt") || formData.item.toLowerCase().includes("kaos") || formData.item.toLowerCase().includes("shirt") || formData.item.toLowerCase().includes("polo")) {
      message += `- Ukuran: ${formData.size}\n`;
    }
    message += `- Jumlah: ${formData.qty}\n`;
    if (formData.notes) {
      message += `\n*Catatan/Alamat:*\n${formData.notes}\n`;
    }
    
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#e8ecc4] text-[#07130e] flex flex-col items-center justify-center pt-32 pb-20 px-6 selection:bg-[#07130e] selection:text-[#e8ecc4]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#07130e] text-[#e8ecc4] p-12 md:p-16 rounded-[40px] max-w-xl w-full text-center flex flex-col items-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-[#e8ecc4] text-[#07130e] rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-[32px] md:text-[48px] font-display font-black leading-tight uppercase mb-4">
            Order <br/> Received!
          </h2>
          <p className="text-[#e8ecc4]/70 mb-10 text-[15px] max-w-sm">
            Terima kasih telah memesan merchandise SRE UPNVJT. Admin kami akan segera menghubungi kamu via WhatsApp untuk konfirmasi pembayaran.
          </p>
          <Link href="/merchandise">
            <button className="px-8 py-4 rounded-full border border-[#e8ecc4]/30 hover:bg-[#e8ecc4] hover:text-[#07130e] transition-colors font-bold uppercase tracking-widest text-[12px]">
              Back to Catalog
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8ecc4] text-[#07130e] pt-32 pb-24 selection:bg-[#07130e] selection:text-[#e8ecc4]">
      
      <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }}
          className="lg:w-2/5 flex flex-col"
        >
          <Link href="/merchandise" className="text-[12px] font-bold tracking-[0.2em] uppercase mb-12 flex items-center gap-2 hover:opacity-50 transition-opacity w-fit">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Catalog
          </Link>
          
          <h1 className="text-[60px] md:text-[90px] font-display font-black leading-[0.85] tracking-tighter uppercase mb-8">
            Order <br />
            <span className="font-serif italic font-normal normal-case opacity-50 pr-4 text-[70px] md:text-[100px]">the</span>
            Form
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#07130e]/70 leading-relaxed font-medium max-w-sm mb-12">
            Lengkapi data dirimu untuk melakukan pemesanan. Pastikan nomor WhatsApp aktif untuk keperluan konfirmasi pembayaran dan pengiriman.
          </p>

          <div className="bg-[#07130e]/5 p-8 rounded-3xl mb-8">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#07130e]/50 font-bold block mb-4">Payment Method</span>
            <ul className="text-[14px] font-bold space-y-2 opacity-80">
              <li>BCA: 1234567890 (a.n. SRE UPNVJT)</li>
              <li>Mandiri: 0987654321 (a.n. SRE UPNVJT)</li>
              <li>ShopeePay/GoPay: 081234567890</li>
            </ul>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-3/5 bg-[#07130e] text-white p-8 md:p-12 lg:p-16 rounded-[40px] shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-transparent border-b border-white/20 pb-2 text-[16px] focus:outline-none focus:border-[#e8ecc4] transition-colors placeholder:text-white/20"
                  placeholder="Budi Santoso"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold">NPM / NIM</label>
                <input 
                  type="text" 
                  required
                  value={formData.nim}
                  onChange={(e) => setFormData({...formData, nim: e.target.value})}
                  className="bg-transparent border-b border-white/20 pb-2 text-[16px] focus:outline-none focus:border-[#e8ecc4] transition-colors placeholder:text-white/20"
                  placeholder="23081010..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold">WhatsApp Number</label>
              <input 
                type="tel" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-transparent border-b border-white/20 pb-2 text-[16px] focus:outline-none focus:border-[#e8ecc4] transition-colors placeholder:text-white/20"
                placeholder="0812xxxxxx"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-y border-white/10 py-10 relative">
              <div className="md:col-span-2">
                <CustomSelect 
                  label={isLoading ? "Loading Items..." : "Select Item"}
                  options={itemOptions.length > 0 ? itemOptions : [{ value: formData.item, label: formData.item }]}
                  value={formData.item}
                  onChange={(val) => setFormData({...formData, item: val})}
                  disabled={isLoading || itemOptions.length === 0}
                />
              </div>

              <div className="flex gap-6">
                <div className="w-1/2">
                  <CustomSelect 
                    label="Size"
                    options={sizeOptions}
                    value={formData.size}
                    onChange={(val) => setFormData({...formData, size: val})}
                    disabled={!formData.item.toLowerCase().includes("t-shirt") && !formData.item.toLowerCase().includes("kaos") && !formData.item.toLowerCase().includes("shirt") && !formData.item.toLowerCase().includes("polo")}
                  />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                  <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold">Qty</label>
                  <div className="flex items-center justify-between border-b border-white/20 pb-1 focus-within:border-[#e8ecc4] transition-colors">
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, qty: Math.max(1, parseInt(prev.qty || 1) - 1)}))}
                      className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-white/50 hover:text-[#e8ecc4] hover:bg-white/5 rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input 
                      type="number" 
                      min="1"
                      required
                      value={formData.qty}
                      onChange={(e) => setFormData({...formData, qty: e.target.value})}
                      className="bg-transparent w-full text-center text-[16px] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      style={{ MozAppearance: 'textfield' }}
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, qty: parseInt(prev.qty || 0) + 1}))}
                      className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-white/50 hover:text-[#e8ecc4] hover:bg-white/5 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold">Additional Notes / Address</label>
              <textarea 
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="bg-transparent border-b border-white/20 pb-2 text-[16px] focus:outline-none focus:border-[#e8ecc4] transition-colors placeholder:text-white/20 resize-none"
                placeholder="Tulis alamat lengkap atau request khusus..."
              ></textarea>
            </div>

            <div className="mt-4">
              <button 
                type="submit"
                className="w-full bg-[#e8ecc4] text-[#07130e] py-5 rounded-full font-bold uppercase tracking-widest text-[14px] hover:bg-white transition-colors flex justify-center items-center gap-2 group"
              >
                Submit Order <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-[11px] text-white/40 mt-4">
                By submitting, you will be redirected to WhatsApp to confirm your order.
              </p>
            </div>

          </form>
        </motion.div>

      </div>
    </div>
  );
}
