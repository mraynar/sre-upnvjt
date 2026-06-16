"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, Plus, Edit2, Trash2, X, Search, Calendar, FolderKanban, ChevronDown, ArrowDownRight, ArrowUpRight, Wallet, ExternalLink, LinkIcon
} from "lucide-react";
import { createFinanceRecord, updateFinanceRecord, deleteFinanceRecord } from "@/app/actions/financeActions";
import { useLanguage } from "@/i18n/LanguageProvider";

const CustomSelect = ({ name, options, value, onChange, placeholder, disabled, required, t }) => {
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
        className={`w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border ${isOpen ? 'border-primary/50 bg-white dark:bg-white/10 shadow-sm dark:shadow-none shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer transition-all duration-300`}
      >
        <span className={selectedOption ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-white/40'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0a1f18] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden z-[60] shadow-2xl backdrop-blur-2xl ring-1 ring-black/5"
          >
            <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 dark:text-white/40 text-sm text-center">{t("finance.no_options")}</div>
              ) : (
                options.map(option => (
                  <div 
                    key={option.value}
                    onClick={() => { onChange(option.value?.toString()); setIsOpen(false); }}
                    className={`px-4 py-3 rounded-lg text-sm cursor-pointer transition-all flex items-center justify-between ${value?.toString() === option.value?.toString() ? 'bg-primary/20 text-primary font-bold' : 'text-gray-500 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:text-white'}`}
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
  const { t } = useLanguage();
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

    let finalProofUrl = formData.get("proofUrl") || null;

    try {
      const proofFile = formData.get("proofFile");
      if (proofFile && proofFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", proofFile);
        uploadFormData.append("folder", "finance_proofs");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          throw new Error("Gagal mengunggah file bukti.");
        }

        const uploadData = await uploadRes.json();
        finalProofUrl = uploadData.url;
      }

      if (modal.isEdit && !finalProofUrl && (!proofFile || proofFile.size === 0)) {
        // If editing and no new file uploaded or link provided, keep the old proofUrl
        finalProofUrl = modal.data?.proofUrl || null;
      }

      const data = {
        title: formData.get("title"),
        amount: rawAmount,
        type: formData.get("type"),
        proofUrl: finalProofUrl,
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

      if (res.success) {
        setModal({ isOpen: false, isEdit: false, data: null });
        refreshData();
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat memproses data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t("finance.delete_confirm"))) return;
    const res = await deleteFinanceRecord(id);
    if (res.success) refreshData();
    else alert(t("finance.fail_delete") + res.error);
  };

  const typeOptions = [
    { value: "INCOME", label: t("finance.type_income") },
    { value: "EXPENSE", label: t("finance.type_expense") },
  ];
  
  const projectOptions = projects.map(p => ({ value: p.id, label: p.title }));

  return (
    <div className="w-full relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <CreditCard className="w-8 h-8 text-primary" />
            {t("finance.title")}
          </h1>
          <p className="text-gray-500 dark:text-white/50 max-w-xl">
            {t("finance.subtitle")}
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative z-20 w-48 hidden lg:block">
            <CustomSelect 
              name="filterProject" 
              options={[{ value: "", label: t("finance.all_cash") }, ...projectOptions]} 
              value={filterProjectId} 
              onChange={setFilterProjectId} 
              placeholder={t("finance.filter_project")} 
              t={t}
            />
          </div>
          <button 
            onClick={() => handleOpenModal(false)}
            className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3.5 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t("finance.btn_record")}</span>
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-md dark:shadow-none rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">{t("finance.total_balance")}</div>
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20"><Wallet className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl lg:text-4xl font-display font-black tracking-tighter text-gray-900 dark:text-white relative z-10">
            {formatCurrency(balance)}
          </div>
        </div>
        <div className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-md dark:shadow-none rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">{t("finance.total_income")}</div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><ArrowDownRight className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl lg:text-4xl font-display font-black tracking-tighter text-gray-900 dark:text-white relative z-10">
            {formatCurrency(totalIncome)}
          </div>
        </div>
        <div className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-md dark:shadow-none rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/10 blur-[40px] rounded-full"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-widest text-red-400/80">{t("finance.total_expense")}</div>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20"><ArrowUpRight className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl lg:text-4xl font-display font-black tracking-tighter text-gray-900 dark:text-white relative z-10">
            {formatCurrency(totalExpense)}
          </div>
        </div>
      </div>

      {/* Search Mobile (Hidden on desktop) */}
      <div className="lg:hidden relative w-full mb-6 z-10">
        <CustomSelect 
          name="filterProjectMobile" 
          options={[{ value: "", label: t("finance.all_cash") }, ...projectOptions]} 
          value={filterProjectId} 
          onChange={setFilterProjectId} 
          placeholder={t("finance.filter_project")} 
          t={t}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.length === 0 ? (
          <div className="col-span-full bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center backdrop-blur-md shadow-sm">
            <CreditCard className="w-16 h-16 text-gray-500 dark:text-white/10 mb-4" />
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">{t("finance.no_transactions")}</h3>
            <p className="text-gray-500 dark:text-white/40">{t("finance.no_transactions_desc")}</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <motion.div 
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-3xl p-6 backdrop-blur-xl relative group hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                {record.type === 'INCOME' ? (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit"><ArrowDownRight className="w-3.5 h-3.5" /> {t("finance.income_badge")}</span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit"><ArrowUpRight className="w-3.5 h-3.5" /> {t("finance.expense_badge")}</span>
                )}
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(true, record)} className="p-2 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:text-white"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(record.id)} className="p-2 text-gray-500 dark:text-white/50 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-2xl font-display font-black text-gray-900 dark:text-white tracking-tight mb-2">
                  {formatCurrency(record.amount)}
                </div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-white/80 line-clamp-2">{record.title}</h3>
              </div>

              <div className="space-y-3 mt-auto">
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/50">
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
                  <div className="pt-3 border-t border-gray-200 dark:border-white/5 mt-3">
                    <a href={record.proofUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-medium">
                      <ExternalLink className="w-3.5 h-3.5" /> {t("finance.view_proof")}
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
              className="bg-white dark:bg-[#0a1f18] border border-gray-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              <button onClick={() => setModal({ isOpen: false, isEdit: false, data: null })} className="absolute top-6 right-6 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:text-white z-50">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                {modal.isEdit ? t("finance.modal_edit") : t("finance.modal_create")}
              </h2>
              
              {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 relative">
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("finance.desc_label")}</label>
                  <input name="title" type="text" required defaultValue={modal.data?.title} placeholder={t("finance.desc_placeholder")} className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 focus:bg-white dark:bg-white/10 shadow-sm dark:shadow-none transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("finance.amount_label")}</label>
                  <input name="amount" type="number" step="any" required defaultValue={modal.data?.amount} placeholder="150000" className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 focus:bg-white dark:bg-white/10 shadow-sm dark:shadow-none transition-colors font-mono" />
                </div>

                <div className="relative z-[50]">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("finance.type_label")}</label>
                  <CustomSelect 
                    name="type" 
                    options={typeOptions} 
                    value={selectedType} 
                    onChange={setSelectedType} 
                    placeholder={t("finance.select_type")} 
                    required 
                    t={t}
                  />
                </div>

                <div className="relative z-[49]">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("finance.related_project")}</label>
                  <CustomSelect 
                    name="projectId" 
                    options={[{ value: "", label: t("finance.main_cash") }, ...projectOptions]} 
                    value={selectedProjectId} 
                    onChange={setSelectedProjectId} 
                    placeholder={t("finance.select_project")} 
                    t={t}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("finance.date_label")}</label>
                  <input name="date" type="date" required defaultValue={modal.data?.date ? new Date(modal.data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 focus:bg-white dark:bg-white/10 shadow-sm dark:shadow-none transition-colors dark:[color-scheme:dark]" />
                </div>

                <div className="pt-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("finance.upload_proof")}</label>
                  <input name="proofFile" type="file" className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-gray-200 dark:bg-white/10"></div>
                  <span className="text-xs font-bold text-gray-400">{t("finance.or_link")}</span>
                  <div className="h-[1px] flex-1 bg-gray-200 dark:bg-white/10"></div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("finance.proof_link")}</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/30" />
                    <input name="proofUrl" type="url" defaultValue={modal.data?.proofUrl || ""} placeholder="https://drive.google.com/..." className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 focus:bg-white dark:bg-white/10 shadow-sm dark:shadow-none transition-colors" />
                  </div>
                  {modal.isEdit && modal.data?.proofUrl && (
                    <div className="mt-3 text-xs text-gray-500 dark:text-white/40">
                      {t("finance.current_file")} <a href={modal.data.proofUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline line-clamp-1">{t("finance.view_file")}</a>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-2 border-t border-gray-200 dark:border-white/10">
                  <button type="submit" disabled={loading} className="w-full bg-primary text-[#050e0a] font-bold py-3.5 rounded-xl hover:bg-primary-focus hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                    {loading ? t("finance.saving") : t("finance.btn_save")}
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
