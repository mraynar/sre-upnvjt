"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit2, Trash2, X, Search, CheckCircle2, 
  XCircle, AlertTriangle, ShoppingBag, ExternalLink
} from "lucide-react";
import { createMerchandise, updateMerchandise, deleteMerchandise } from "@/app/actions/merchandiseActions";
import { useSession } from "next-auth/react";
import { hasAccess } from "@/lib/permissions";

const EMPTY_MERCH = {
  name: "",
  price: "",
  description: "",
  imageUrl: "",
  linkUrl: "",
  isAvailable: true,
};

export default function MerchClient({ initialMerchandise }) {
  const { data: session } = useSession();
  const [merchandise, setMerchandise] = useState(initialMerchandise || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentMerch, setCurrentMerch] = useState(EMPTY_MERCH);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const isEditing = Boolean(currentMerch.id);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const canCreate = hasAccess(session?.user, 'merchandise', 'create');
  const canUpdate = hasAccess(session?.user, 'merchandise', 'update');
  const canDelete = hasAccess(session?.user, 'merchandise', 'delete');

  const handleOpenModal = (merch) => {
    if (merch) {
      setCurrentMerch({ ...merch });
    } else {
      setCurrentMerch({ ...EMPTY_MERCH });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setCurrentMerch({ ...EMPTY_MERCH }), 300);
  };

  const handleOpenDeleteModal = (merch) => {
    setCurrentMerch({ ...merch });
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTimeout(() => setCurrentMerch({ ...EMPTY_MERCH }), 300);
  };

  const handleSaveMerch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const price = parseFloat(String(currentMerch.price) || "0");
    const dataToSave = { ...currentMerch, price };

    if (isEditing) {
      const res = await updateMerchandise(currentMerch.id, dataToSave);
      if (res.success) {
        setMerchandise(merchandise.map(m => m.id === currentMerch.id ? res.merchandise : m));
        showNotification("success", "Merchandise updated successfully!");
        handleCloseModal();
      } else {
        showNotification("error", res.error);
      }
    } else {
      const res = await createMerchandise(dataToSave);
      if (res.success) {
        setMerchandise([res.merchandise, ...merchandise]);
        showNotification("success", "Merchandise created successfully!");
        handleCloseModal();
      } else {
        showNotification("error", res.error);
      }
    }
    setIsLoading(false);
  };

  const handleDeleteMerch = async () => {
    if (!currentMerch.id) return;
    setIsLoading(true);
    const res = await deleteMerchandise(currentMerch.id);
    if (res.success) {
      setMerchandise(merchandise.filter(m => m.id !== currentMerch.id));
      showNotification("success", "Merchandise deleted successfully!");
      handleCloseDeleteModal();
    } else {
      showNotification("error", res.error);
    }
    setIsLoading(false);
  };

  const filteredMerchandise = merchandise.filter(m =>
    (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[12px] font-bold tracking-[0.2em] text-primary uppercase">Toko SRE</span>
            </div>
            <h1 className="text-[32px] md:text-[40px] font-display font-bold text-white tracking-tight">
              Merchandise
            </h1>
            <p className="text-white/50 text-[15px] mt-2 max-w-xl">
              Kelola produk dan merchandise SRE UPNVJT yang akan ditampilkan ke publik.
            </p>
          </div>
          {canCreate && (
            <button
              onClick={() => handleOpenModal()}
              className="h-12 px-6 rounded-xl bg-primary text-[#050e0a] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#a8d3ba] transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Produk</span>
            </button>
          )}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Cari nama produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Merch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredMerchandise.length > 0 ? (
              filteredMerchandise.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all flex flex-col"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-black/50 border-b border-white/5">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                        <ShoppingBag className="w-10 h-10 mb-2" />
                        <span className="text-[12px]">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                        item.isAvailable
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}>
                        {item.isAvailable ? "In Stock" : "Sold Out"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-[16px] font-bold text-white mb-1 leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
                    <div className="text-[14px] font-medium text-[#e8ecc4] mb-3">
                      Rp {parseFloat(item.price || 0).toLocaleString("id-ID")}
                    </div>
                    <p className="text-[12px] text-white/50 line-clamp-2 mb-4 flex-1">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                      {item.linkUrl ? (
                        <a href={item.linkUrl} target="_blank" rel="noreferrer" className="text-[11px] text-primary hover:underline flex items-center gap-1">
                          Buy Link <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-white/30">No Link</span>
                      )}
                      
                      <div className="flex gap-2">
                        {canUpdate && (
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all border border-transparent hover:border-white/10"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => {
                              setCurrentMerch(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center transition-all border border-transparent hover:border-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/[0.02] border border-white/5 rounded-2xl border-dashed">
                <ShoppingBag className="w-12 h-12 text-white/20 mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">Belum ada produk</h3>
                <p className="text-white/40 text-sm">Tambahkan merchandise baru untuk ditampilkan di landing page.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      {/* Merch Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-[#050e0a]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a1612] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {isEditing ? "Edit Produk" : "Produk Baru"}
                </h2>
                <button onClick={handleCloseModal} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <form id="merchForm" onSubmit={handleSaveMerch} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-1">
                      <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-2">Nama Produk</label>
                      <input
                        type="text"
                        required
                        value={currentMerch.name}
                        onChange={(e) => setCurrentMerch(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
                        placeholder="e.g. SRE Signature T-Shirt"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-2">Harga (Rp)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={currentMerch.price}
                        onChange={(e) => setCurrentMerch(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
                        placeholder="e.g. 149000"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-2">Deskripsi</label>
                      <textarea
                        required
                        value={currentMerch.description}
                        onChange={(e) => setCurrentMerch(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all resize-none h-24"
                        placeholder="Detail bahan, ukuran, dll..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-2">Foto Produk (URL)</label>
                      <div className="flex gap-4">
                        {currentMerch.imageUrl && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                            <img src={currentMerch.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <input
                          type="url"
                          value={currentMerch.imageUrl}
                          onChange={(e) => setCurrentMerch(prev => ({ ...prev, imageUrl: e.target.value }))}
                          className="flex-1 h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-2">Tautan Pembelian (Opsional)</label>
                      <input
                        type="url"
                        value={currentMerch.linkUrl}
                        onChange={(e) => setCurrentMerch(prev => ({ ...prev, linkUrl: e.target.value }))}
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
                        placeholder="Link Shopee / Tokopedia / WhatsApp"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div>
                        <div className="text-white font-medium text-[14px]">Stok Tersedia</div>
                        <div className="text-white/40 text-[12px]">Aktifkan jika barang sedang in-stock</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={currentMerch.isAvailable}
                          onChange={(e) => setCurrentMerch(prev => ({ ...prev, isAvailable: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-white/10 flex justify-end gap-3 shrink-0 bg-white/[0.02]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="merchForm"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl font-bold bg-primary text-[#050e0a] hover:bg-[#a8d3ba] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#050e0a]/30 border-t-[#050e0a] rounded-full animate-spin" />
                  ) : (
                    "Simpan Produk"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDeleteModal}
              className="absolute inset-0 bg-[#050e0a]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0a1612] border border-white/10 rounded-2xl shadow-2xl p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Hapus Produk</h2>
              <p className="text-white/50 mb-8">
                Apakah Anda yakin ingin menghapus <strong className="text-white">{currentMerch.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseDeleteModal}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-white/70 hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteMerch}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Hapus Produk"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
              notification.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
