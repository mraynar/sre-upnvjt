"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, Plus, Edit2, Trash2, X, Search, Calendar, FolderKanban, ChevronDown, ArrowDownRight, ArrowUpRight, Wallet, ExternalLink
} from "lucide-react";
import { createFinanceRecord, updateFinanceRecord, deleteFinanceRecord } from "@/app/actions/financeActions";

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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
};

export default function FinanceClient({ initialRecords, projects, currentUser }) {
  const [records, setRecords] = useState(initialRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProjectId, setFilterProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [selectedType, setSelectedType] = useState("EXPENSE");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const filteredRecords = records.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProject = filterProjectId ? r.projectId?.toString() === filterProjectId : true;
    return matchSearch && matchProject;
  });

  const totalIncome = filteredRecords.filter(r => r.type === 'INCOME').reduce((sum, r) => sum + parseFloat(r.amount), 0);
  const totalExpense = filteredRecords.filter(r => r.type === 'EXPENSE').reduce((sum, r) => sum + parseFloat(r.amount), 0);
  const balance = totalIncome - totalExpense;

  const refreshData = () => window.location.reload();

  const handleOpenModal = (isEdit, data = null) => {
    setModal({ isOpen: true, isEdit, data });
    setSelectedType(data?.type || "EXPENSE");
    setSelectedProjectId(data?.projectId?.toString() || filterProjectId || "");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    
    const rawAmount = formData.get("amount").replace(/[^0-9.-]+/g,"");

    const data = {
      title: formData.get("title"),
      amount: rawAmount,
      type: formData.get("type"),
      proofUrl: formData.get("proofUrl"),
      date: formData.get("date"),
      loggedById: currentUser.id,
      projectId: formData.get("projectId"),
    };

    let res;
    if (modal.isEdit) {
      res = await updateFinanceRecord(modal.data.id, data);
    } else {
      res = await createFinanceRecord(data);
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
    if (!confirm("Hapus catatan transaksi ini secara permanen?")) return;
    const res = await deleteFinanceRecord(id);
    if (res.success) refreshData();
    else alert("Gagal menghapus: " + res.error);
  };

  const typeOptions = [
    { value: "INCOME", label: "Pemasukan (Income)" },
    { value: "EXPENSE", label: "Pengeluaran (Expense)" },
  ];
  
  const projectOptions = projects.map(p => ({ value: p.id, label: p.title }));

  return (
    <div className="w-full max-w-[1400px] mx-auto relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-white">
            <CreditCard className="w-8 h-8 text-primary" />
            Buku Kas Digital
          </h1>
          <p className="text-white/50 max-w-xl">
            Transparansi arus kas organisasi. Lacak pemasukan dan pengeluaran secara real-time.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative z-20 w-48 hidden lg:block">
            <CustomSelect 
              name="filterProject" 
              options={[{ value: "", label: "Semua Kas" }, ...projectOptions]} 
              value={filterProjectId} 
              onChange={setFilterProjectId} 
              placeholder="Filter Proker..." 
            />
          </div>
          <button 
            onClick={() => handleOpenModal(false)}
            className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3.5 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Catat Transaksi</span>
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Saldo Aktif</div>
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20"><Wallet className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl lg:text-4xl font-display font-black tracking-tighter text-white relative z-10">
            {formatCurrency(balance)}
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">Total Pemasukan</div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><ArrowDownRight className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl lg:text-4xl font-display font-black tracking-tighter text-white relative z-10">
            {formatCurrency(totalIncome)}
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/10 blur-[40px] rounded-full"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-widest text-red-400/80">Total Pengeluaran</div>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20"><ArrowUpRight className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl lg:text-4xl font-display font-black tracking-tighter text-white relative z-10">
            {formatCurrency(totalExpense)}
          </div>
        </div>
      </div>

      {/* Search Mobile (Hidden on desktop) */}
      <div className="lg:hidden relative w-full mb-6 z-10">
        <CustomSelect 
          name="filterProjectMobile" 
          options={[{ value: "", label: "Semua Kas" }, ...projectOptions]} 
          value={filterProjectId} 
          onChange={setFilterProjectId} 
          placeholder="Filter Proker..." 
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.length === 0 ? (
          <div className="col-span-full bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center backdrop-blur-md">
            <CreditCard className="w-16 h-16 text-white/10 mb-4" />
            <h3 className="text-xl font-display font-bold text-white mb-2">Tidak Ada Transaksi</h3>
            <p className="text-white/40">Belum ada catatan keuangan yang sesuai filter.</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <motion.div 
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm relative group hover:bg-white/[0.04] transition-all flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                {record.type === 'INCOME' ? (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit"><ArrowDownRight className="w-3.5 h-3.5" /> Masuk</span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit"><ArrowUpRight className="w-3.5 h-3.5" /> Keluar</span>
                )}
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(true, record)} className="p-2 text-white/50 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(record.id)} className="p-2 text-white/50 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-2xl font-display font-black text-white tracking-tight mb-2">
                  {formatCurrency(record.amount)}
                </div>
                <h3 className="text-sm font-bold text-white/80 line-clamp-2">{record.title}</h3>
              </div>

              <div className="space-y-3 mt-auto">
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(record.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                {record.project && (
                  <div className="flex items-center gap-3 text-xs text-primary">
                    <FolderKanban className="w-4 h-4" />
                    <span className="line-clamp-1">{record.project.title}</span>
                  </div>
                )}
                {record.proofUrl && (
                  <div className="pt-3 border-t border-white/5 mt-3">
                    <a href={record.proofUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-medium">
                      <ExternalLink className="w-3.5 h-3.5" /> Lihat Bukti Transaksi
                    </a>
                  </div>
                )}
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
                {modal.isEdit ? "Edit Catatan Keuangan" : "Catat Transaksi Baru"}
              </h2>
              
              {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 relative">
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Keterangan Transaksi</label>
                  <input name="title" type="text" required defaultValue={modal.data?.title} placeholder="Misal: Uang Kas Bulan Mei / Beli Konsumsi" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Nominal (Rp)</label>
                  <input name="amount" type="number" step="any" required defaultValue={modal.data?.amount} placeholder="150000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors font-mono" />
                </div>

                <div className="relative z-[50]">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Jenis Transaksi</label>
                  <CustomSelect 
                    name="type" 
                    options={typeOptions} 
                    value={selectedType} 
                    onChange={setSelectedType} 
                    placeholder="Pilih Jenis..." 
                    required 
                  />
                </div>

                <div className="relative z-[49]">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Terkait Proker (Opsional)</label>
                  <CustomSelect 
                    name="projectId" 
                    options={[{ value: "", label: "Uang Kas Organisasi Utama" }, ...projectOptions]} 
                    value={selectedProjectId} 
                    onChange={setSelectedProjectId} 
                    placeholder="Pilih Proker..." 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Tanggal Transaksi</label>
                  <input name="date" type="date" required defaultValue={modal.data?.date ? new Date(modal.data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors [color-scheme:dark]" />
                </div>

                <div className="pt-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Tautan Bukti Transaksi (Struk/Nota)</label>
                  <input name="proofUrl" type="url" defaultValue={modal.data?.proofUrl || ""} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 transition-colors" />
                </div>

                <div className="pt-4 mt-2 border-t border-white/10">
                  <button type="submit" disabled={loading} className="w-full bg-primary text-[#050e0a] font-bold py-3.5 rounded-xl hover:bg-primary-focus hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                    {loading ? "Menyimpan..." : "Simpan Transaksi"}
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
