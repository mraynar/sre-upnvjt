"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderOpen, Plus, Edit2, Trash2, X, Search, ChevronDown, FileText, Download, Link as LinkIcon, FileCheck, FileArchive
} from "lucide-react";
import { createDocument, updateDocument, deleteDocument } from "@/app/actions/documentActions";

const CustomSelect = ({ name, options, value, onChange, placeholder, disabled, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value?.toString() === value?.toString());

  return (
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={dropdownRef}>
      <input type="hidden" name={name} value={value || ""} required={required} />
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white/5 border ${isOpen ? 'border-primary/50 bg-white/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-white/10'} rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer transition-all duration-300`}
      >
        <span className={selectedOption ? 'text-white font-medium' : 'text-white/40'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#0a1f18] border border-white/10 rounded-xl overflow-hidden z-[60] shadow-2xl backdrop-blur-2xl ring-1 ring-black/50"
          >
            <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-white/40 text-sm text-center">No options available</div>
              ) : (
                options.map(option => (
                  <div 
                    key={option.value}
                    onClick={() => { onChange(option.value?.toString()); setIsOpen(false); }}
                    className={`px-4 py-3 rounded-lg text-sm cursor-pointer transition-all flex items-center justify-between ${value?.toString() === option.value?.toString() ? 'bg-primary/20 text-primary font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                  >
                    {option.label}
                    {value?.toString() === option.value?.toString() && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getIconForType = (type) => {
  switch(type) {
    case 'PROPOSAL': return <FileText className="w-10 h-10 text-blue-400" />;
    case 'LPJ': return <FileCheck className="w-10 h-10 text-emerald-400" />;
    case 'SOP': return <FileArchive className="w-10 h-10 text-purple-400" />;
    default: return <FileText className="w-10 h-10 text-gray-400" />;
  }
};

export default function DocumentsClient({ initialDocs }) {
  const [docs, setDocs] = useState(initialDocs);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [selectedType, setSelectedType] = useState("OTHER");

  const filteredDocs = docs.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const refreshData = () => window.location.reload();

  const handleOpenModal = (isEdit, data = null) => {
    setModal({ isOpen: true, isEdit, data });
    setSelectedType(data?.type || "OTHER");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    
    const data = {
      title: formData.get("title"),
      type: formData.get("type"),
      url: formData.get("url"),
      description: formData.get("description"),
    };

    let res;
    if (modal.isEdit) {
      res = await updateDocument(modal.data.id, data);
    } else {
      res = await createDocument(data);
    }

    setLoading(false);
    if (res.success) {
      setModal({ isOpen: false, isEdit: false, data: null });
      refreshData();
    } else {
      setError(res.error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus dokumen ini dari bank data?")) return;
    const res = await deleteDocument(id);
    if (res.success) refreshData();
    else alert("Gagal menghapus: " + res.error);
  };

  const typeOptions = [
    { value: "PROPOSAL", label: "Proposal Kegiatan" },
    { value: "LPJ", label: "Lembar Pertanggungjawaban (LPJ)" },
    { value: "SOP", label: "Standard Operating Procedure (SOP)" },
    { value: "OTHER", label: "Lainnya / Umum" },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-white">
            <FolderOpen className="w-8 h-8 text-primary" />
            Bank Data & Dokumen
          </h1>
          <p className="text-white/50 max-w-xl">
            Repositori terpusat untuk menyimpan dan mengakses dokumen penting SRE UPNVJT.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text"
              placeholder="Cari dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <button 
            onClick={() => handleOpenModal(false)}
            className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Unggah Berkas</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center backdrop-blur-md">
            <FolderOpen className="w-16 h-16 text-white/10 mb-4" />
            <h3 className="text-xl font-display font-bold text-white mb-2">Bank Data Kosong</h3>
            <p className="text-white/40">Belum ada dokumen yang diunggah.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm relative group hover:bg-white/[0.04] transition-all flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  {getIconForType(doc.type)}
                </div>
                
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(true, doc)} className="p-2 text-white/50 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(doc.id)} className="p-2 text-white/50 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="mb-4 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/70">
                    {doc.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2" title={doc.title}>{doc.title}</h3>
                {doc.description && <p className="text-white/40 text-xs line-clamp-2">{doc.description}</p>}
              </div>

              <div className="pt-4 border-t border-white/5 mt-auto">
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded-xl transition-all text-sm font-bold text-white hover:text-primary"
                >
                  <Download className="w-4 h-4" /> Unduh Berkas
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setModal({ isOpen: false, isEdit: false, data: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a1f18] border border-white/10 rounded-3xl p-8 w-full max-w-xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              <button onClick={() => setModal({ isOpen: false, isEdit: false, data: null })} className="absolute top-6 right-6 text-white/50 hover:text-white z-50">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                {modal.isEdit ? "Edit Berkas" : "Unggah Berkas Baru"}
              </h2>
              
              {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 relative">
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Nama / Judul Dokumen</label>
                  <input name="title" type="text" required defaultValue={modal.data?.title} placeholder="Misal: Proposal SRE Mengajar 2026" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors" />
                </div>

                <div className="relative z-[50]">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Tipe Dokumen</label>
                  <CustomSelect 
                    name="type" 
                    options={typeOptions} 
                    value={selectedType} 
                    onChange={setSelectedType} 
                    placeholder="Pilih Tipe..." 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Tautan Berkas (Link GDrive/DropBox)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input name="url" type="url" required defaultValue={modal.data?.url || ""} placeholder="https://drive.google.com/..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Deskripsi (Opsional)</label>
                  <textarea name="description" rows="3" defaultValue={modal.data?.description} placeholder="Keterangan singkat..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors resize-none" />
                </div>

                <div className="pt-4 mt-2 border-t border-white/10">
                  <button type="submit" disabled={loading} className="w-full bg-primary text-[#050e0a] font-bold py-3.5 rounded-xl hover:bg-primary-focus hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                    {loading ? "Menyimpan..." : "Simpan Ke Bank Data"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
