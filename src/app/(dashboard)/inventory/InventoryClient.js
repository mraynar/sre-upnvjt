"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Plus, Edit2, Trash2, X, Search, ChevronDown, CheckCircle2, XCircle, AlertTriangle, Layers, MapPin
} from "lucide-react";
import { createInventoryItem, updateInventoryItem, deleteInventoryItem } from "@/app/actions/inventoryActions";
import { useSession } from "next-auth/react";
import { hasAccess } from "@/lib/permissions";
import { useLanguage } from "@/i18n/LanguageProvider";

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
                <div className="px-4 py-3 text-gray-500 dark:text-white/40 text-sm text-center">No options available</div>
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

export default function InventoryClient({ initialItems }) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canCreate = hasAccess(session?.user, 'inventory', 'create');
  const canUpdate = hasAccess(session?.user, 'inventory', 'update');
  const canDelete = hasAccess(session?.user, 'inventory', 'delete');

  const [modal, setModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [selectedCategory, setSelectedCategory] = useState("GENERAL");
  const [selectedCondition, setSelectedCondition] = useState("GOOD");

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (i.code && i.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const refreshData = () => window.location.reload();

  const handleOpenModal = (isEdit, data = null) => {
    setModal({ isOpen: true, isEdit, data });
    setSelectedCategory(data?.category || "GENERAL");
    setSelectedCondition(data?.condition || "GOOD");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    
    const data = {
      name: formData.get("name"),
      code: formData.get("code"),
      category: formData.get("category"),
      quantity: formData.get("quantity"),
      location: formData.get("location"),
      condition: formData.get("condition"),
      isAvailable: formData.get("isAvailable") === "true",
    };

    let res;
    if (modal.isEdit) {
      res = await updateInventoryItem(modal.data?.id, data);
    } else {
      res = await createInventoryItem(data);
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
    if (!confirm(t("inventory.delete_confirm"))) return;
    const res = await deleteInventoryItem(id);
    if (res.success) refreshData();
    else alert(t("inventory.fail_delete") + res.error);
  };

  const categoryOptions = [
    { value: "GENERAL", label: t("inventory.cat_general") },
    { value: "ELECTRONIC", label: t("inventory.cat_electronic") },
    { value: "FURNITURE", label: t("inventory.cat_furniture") },
    { value: "RESEARCH", label: t("inventory.cat_research") },
  ];

  const conditionOptions = [
    { value: "GOOD", label: t("inventory.cond_good") },
    { value: "FAIR", label: t("inventory.cond_fair") },
    { value: "POOR", label: t("inventory.cond_poor") },
    { value: "BROKEN", label: t("inventory.cond_broken") },
  ];

  return (
    <div className="w-full relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <Box className="w-8 h-8 text-primary" />
            {t("inventory.title")}
          </h1>
          <p className="text-gray-500 dark:text-white/50 max-w-xl">
            {t("inventory.subtitle")}
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/30" />
            <input 
              type="text"
              placeholder={t("inventory.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          {canCreate && (
            <button 
              onClick={() => handleOpenModal(false)}
              className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">{t("inventory.add")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center backdrop-blur-md shadow-sm">
            <Box className="w-16 h-16 text-gray-500 dark:text-white/10 mb-4" />
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">{t("inventory.no_items")}</h3>
            <p className="text-gray-500 dark:text-white/40">{t("inventory.no_items_desc")}</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-3xl p-6 backdrop-blur-xl relative group hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                  item.isAvailable 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}>
                  {item.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {item.isAvailable ? t("inventory.available") : t("inventory.borrowed")}
                </div>
                
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {canUpdate && (
                    <button onClick={() => handleOpenModal(true, item)} className="p-2 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:text-white"><Edit2 className="w-4 h-4" /></button>
                  )}
                  {canDelete && (
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 dark:text-white/50 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-display font-black text-gray-900 dark:text-white mb-1 line-clamp-1">{item.name}</h3>
                {item.code && <p className="text-primary text-xs font-mono bg-primary/10 w-fit px-2 py-0.5 rounded border border-primary/20">{item.code}</p>}
              </div>

              <div className="space-y-3 mt-auto">
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/50">
                  <Layers className="w-4 h-4" />
                  <span>{t("inventory.category")}{categoryOptions.find(o => o.value === item.category)?.label || item.category}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{t("inventory.condition")}{conditionOptions.find(o => o.value === item.condition)?.label || item.condition}</span>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white bg-white dark:bg-white/10 shadow-sm dark:shadow-none px-2 py-0.5 rounded">Qty: {item.quantity}</div>
                </div>
                {item.location && (
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/50">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{item.location}</span>
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
                {modal.isEdit ? t("inventory.edit") : t("inventory.new")}
              </h2>
              
              {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
                
                <div className="col-span-full">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("inventory.item_name")}</label>
                  <input name="name" type="text" required defaultValue={modal.data?.name} placeholder={t("inventory.item_name_ph")} className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 focus:bg-white dark:bg-white/10 shadow-sm dark:shadow-none transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("inventory.item_code")}</label>
                  <input name="code" type="text" defaultValue={modal.data?.code || ""} placeholder="SRE-INV-001" className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 focus:bg-white dark:bg-white/10 shadow-sm dark:shadow-none transition-colors font-mono" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("inventory.qty")}</label>
                  <input name="quantity" type="number" min="1" required defaultValue={modal.data?.quantity || 1} className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 focus:bg-white dark:bg-white/10 shadow-sm dark:shadow-none transition-colors" />
                </div>

                <div className="relative z-[50]">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("inventory.cat_label")}</label>
                  <CustomSelect 
                    name="category" 
                    options={categoryOptions} 
                    value={selectedCategory} 
                    onChange={setSelectedCategory} 
                    placeholder={t("inventory.cat_select")} 
                    required 
                  />
                </div>

                <div className="relative z-[49]">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("inventory.cond_label")}</label>
                  <CustomSelect 
                    name="condition" 
                    options={conditionOptions} 
                    value={selectedCondition} 
                    onChange={setSelectedCondition} 
                    placeholder={t("inventory.cond_select")} 
                    required 
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">{t("inventory.location")}</label>
                  <input name="location" type="text" defaultValue={modal.data?.location || ""} placeholder={t("inventory.location_ph")} className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 focus:bg-white dark:bg-white/10 shadow-sm dark:shadow-none transition-colors" />
                </div>

                <div className="col-span-full flex items-center gap-3 mt-2">
                  <input type="hidden" name="isAvailable" value="false" />
                  <input 
                    type="checkbox" 
                    name="isAvailable" 
                    id="isAvailable" 
                    value="true" 
                    defaultChecked={modal.isEdit ? modal.data?.isAvailable : true}
                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                  />
                  <label htmlFor="isAvailable" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">{t("inventory.is_available")}</label>
                </div>

                <div className="col-span-full pt-4 mt-2 border-t border-gray-200 dark:border-white/10">
                  <button type="submit" disabled={loading} className="w-full bg-primary text-[#050e0a] font-bold py-3.5 rounded-xl hover:bg-primary-focus hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                    {loading ? t("departments.saving") : t("inventory.save")}
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
