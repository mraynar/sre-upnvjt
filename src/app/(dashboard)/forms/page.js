'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

export default function FormsList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await fetch('/api/forms');
      if (res.ok) {
        const data = await res.json();
        setForms(data);
      }
    } catch (error) {
      console.error('Failed to load forms', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (id) => {
    if (!confirm('Are you sure you want to delete this form?')) return;
    try {
      const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchForms();
      } else {
        alert('Failed to delete form');
      }
    } catch (error) {
      console.error('Error deleting form', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <ClipboardCheck className="w-8 h-8 text-primary" />
            Form Builder
          </h1>
          <p className="text-gray-500 dark:text-white/50 max-w-xl">
            Buat dan kelola form kustom untuk penugasan member.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link 
            href="/forms/create"
            className="flex items-center justify-center gap-2 bg-primary text-[#050e0a] px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-emerald-500 hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)] w-full md:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Buat Form</span>
          </Link>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-[#050e0a]/80 backdrop-blur-2xl rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
        {forms.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-400 dark:text-white/30" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum ada form</h3>
            <p className="text-gray-500 dark:text-white/60 mb-6">Mulai buat form pertama Anda untuk digunakan pada penugasan.</p>
            <Link 
              href="/forms/create"
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              Buat Form Baru
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/50 text-sm uppercase tracking-wider border-b border-gray-200 dark:border-white/10">
                  <th className="p-5 font-bold">Judul Form</th>
                  <th className="p-5 font-bold hidden md:table-cell">Deskripsi</th>
                  <th className="p-5 font-bold text-center">Soal</th>
                  <th className="p-5 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5">
                      <div className="font-bold text-gray-900 dark:text-white">{form.title}</div>
                      <div className="text-xs text-gray-400 dark:text-white/40 mt-1 md:hidden truncate max-w-[200px]">{form.description}</div>
                    </td>
                    <td className="p-5 text-gray-500 dark:text-white/60 font-medium hidden md:table-cell max-w-xs truncate">
                      {form.description || '-'}
                    </td>
                    <td className="p-5 text-center">
                      <span className="inline-flex items-center justify-center bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm border border-primary/20">
                        {form.questions?.filter(q => q.type !== 'page_break' && q.type !== 'hidden_user').length || 0}
                      </span>
                    </td>
                    <td className="p-5 flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/forms/edit/${form.id}`}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Edit2 size={20} />
                      </Link>
                      <button 
                        onClick={() => deleteForm(form.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                        title="Hapus"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
