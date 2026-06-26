'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash2, GripVertical, Save, ArrowLeft, Eye, XCircle, Edit3, ClipboardCheck, ChevronDown, SplitSquareVertical, User } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelect = ({ options, value, onChange, placeholder }) => {
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

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative z-20 min-w-[200px]" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white dark:bg-white/5 border ${isOpen ? 'border-primary/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all duration-300 font-medium`}
      >
        <span className={selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-white/40'}>
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
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0a1f18] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-2xl"
          >
            <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
              {options.map(option => (
                <div 
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm cursor-pointer transition-all flex items-center justify-between ${value === option.value ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  {option.label}
                  {value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function EditForm() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { id: Date.now().toString(), type: 'text', question: '', options: [''], required: false, points: 0 }
  ]);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchForm();
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      const res = await fetch(`/api/forms/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title || '');
        setDescription(data.description || '');
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        }
      }
    } catch (err) {
      console.error('Error fetching form', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);

  const typeOptions = [
    { value: 'text', label: 'Jawaban Singkat' },
    { value: 'paragraph', label: 'Paragraf' },
    { value: 'radio', label: 'Pilihan Ganda' },
    { value: 'checkbox', label: 'Kotak Centang' },
    { value: 'dropdown', label: 'Dropdown (Tarik-Turun)' },
    { value: 'page_break', label: 'Pembatas Halaman (Page Break)' },
    { value: 'hidden_user', label: 'Info Pengguna (Hidden & Otomatis)' },
  ];

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now().toString(), type: 'text', question: '', options: [''], required: false, points: 0 }
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, options: [...q.options, ''] } : q
    ));
  };

  const updateOption = (questionId, index, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[index] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const removeOption = (questionId, index) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: q.options.filter((_, i) => i !== index) };
      }
      return q;
    }));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Judul form wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, questions })
      });

      if (res.ok) {
        router.push('/forms');
      } else {
        const err = await res.json();
        alert(`Gagal menyimpan form: ${err.error}`);
      }
    } catch (error) {
      console.error('Save error', error);
      alert('Terjadi kesalahan saat menyimpan form');
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setDraggedOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && draggedOverIndex !== null && draggedIndex !== draggedOverIndex) {
      const newQuestions = [...questions];
      const draggedItem = newQuestions[draggedIndex];
      newQuestions.splice(draggedIndex, 1);
      newQuestions.splice(draggedOverIndex, 0, draggedItem);
      setQuestions(newQuestions);
    }
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Pagination Logic for Preview
  const pages = [];
  let currentPage = [];
  questions.forEach((q) => {
    if (q.type === 'page_break') {
      pages.push(currentPage);
      currentPage = [];
    } else {
      currentPage.push(q);
    }
  });
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return (
    <div className="p-6 w-full pb-24 text-gray-900 dark:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div className="flex items-center gap-4">
          <Link href="/forms" className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm self-start mt-1">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
              <ClipboardCheck className="w-8 h-8 text-primary" />
              {showPreview ? 'Preview Form' : 'Edit Form'}
            </h1>
            <p className="text-gray-500 dark:text-white/50 max-w-xl">
              Perbarui susunan pertanyaan untuk form Anda.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setShowPreview(!showPreview);
              setPreviewPage(0);
            }}
            className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
          >
            {showPreview ? <><Edit3 size={18} /> Kembali Edit</> : <><Eye size={18} /> Preview Form</>}
          </button>
          {!showPreview && (
            <button 
              onClick={handleSave}
              disabled={saving || loadingData}
              className="flex items-center gap-2 bg-primary hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Save size={18} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          )}
        </div>
      </div>

      {showPreview ? (
        // PREVIEW MODE
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-white/40 dark:bg-[#050e0a]/40 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 mb-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

            {previewPage === 0 && (
              <div className="mb-12">
                <h1 className="text-4xl md:text-6xl font-black font-display mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">{title || 'Judul Form'}</h1>
                <p className="text-gray-600 dark:text-white/70 text-lg md:text-xl leading-relaxed whitespace-pre-wrap max-w-2xl">{description}</p>
              </div>
            )}
            
            {pages.length > 1 && (
              <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-gray-900/5 dark:bg-white/5 rounded-full border border-gray-900/10 dark:border-white/10">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-bold text-gray-600 dark:text-white/60 uppercase tracking-widest">
                  Halaman {previewPage + 1} dari {pages.length}
                </span>
              </div>
            )}

            <div className="space-y-12">
              {pages[previewPage]?.map((q, index) => (
                <div key={q.id} className="relative pl-6 md:pl-10 group">
                  {/* Decorative timeline line */}
                  <div className="absolute left-0 top-3 bottom-0 w-[2px] bg-gradient-to-b from-primary/30 to-transparent rounded-full group-hover:from-primary/60 transition-colors"></div>
                  
                  {/* Question Number Indicator */}
                  <div className="absolute left-[-11px] top-2 w-6 h-6 rounded-full bg-white dark:bg-[#050e0a] border-2 border-primary flex items-center justify-center text-[10px] font-black text-primary shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    {questions.filter(qt => qt.type !== 'page_break').findIndex(qt => qt.id === q.id) + 1}
                  </div>

                  <h3 className="font-bold text-xl md:text-2xl mb-6 text-gray-900 dark:text-white tracking-tight leading-snug">
                    {q.question || 'Pertanyaan tidak ada judul'} 
                    {q.required && <span className="text-red-500 ml-2">*</span>}
                  </h3>
                  
                  {q.type === 'text' && (
                    <div className="relative">
                      <input type="text" placeholder="Ketik jawaban Anda..." className="w-full bg-transparent border-b-2 border-gray-200 dark:border-white/10 px-2 py-3 focus:outline-none focus:border-primary transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-lg md:text-xl font-medium peer" />
                      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 peer-focus:w-full"></div>
                    </div>
                  )}
                  {q.type === 'paragraph' && (
                    <textarea rows={4} placeholder="Ketik jawaban lengkap Anda di sini..." className="w-full bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-lg md:text-xl font-medium hover:bg-white dark:hover:bg-white/10" />
                  )}
                  {q.type === 'radio' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, i) => (
                        <label key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 has-[:checked]:shadow-lg group">
                          <div className="relative flex items-center justify-center shrink-0">
                            <input type="radio" name={`preview_${q.id}`} className="peer sr-only" />
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-white/30 peer-checked:border-primary peer-checked:border-[7px] transition-all duration-200 bg-white dark:bg-white/5 shadow-inner"></div>
                          </div>
                          <span className="text-gray-700 dark:text-white/90 text-lg font-medium group-has-[:checked]:text-primary group-has-[:checked]:font-bold transition-colors">{opt || `Opsi ${i+1}`}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === 'checkbox' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, i) => (
                        <label key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 has-[:checked]:shadow-lg group">
                          <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                            <input type="checkbox" className="peer sr-only" />
                            <div className="absolute inset-0 rounded-[6px] border-2 border-gray-300 dark:border-white/30 peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 bg-white dark:bg-white/5 shadow-inner"></div>
                            <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-all duration-200 scale-50 peer-checked:scale-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-700 dark:text-white/90 text-lg font-medium group-has-[:checked]:text-primary group-has-[:checked]:font-bold transition-colors">{opt || `Opsi ${i+1}`}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === 'dropdown' && (
                    <div className="relative max-w-sm">
                      <select defaultValue="" className="w-full bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm text-gray-900 dark:text-white text-lg font-medium appearance-none hover:bg-white dark:hover:bg-white/10 cursor-pointer">
                        <option value="" disabled>Pilih salah satu...</option>
                        {q.options.map((opt, i) => (
                          <option key={i} value={opt} className="text-gray-900">{opt || `Opsi ${i+1}`}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-gray-400 dark:text-white/40" />
                      </div>
                    </div>
                  )}
                  {q.type === 'hidden_user' && (
                    <div className="w-full bg-gradient-to-r from-gray-100/80 to-transparent dark:from-white/5 dark:to-transparent border border-gray-200/50 dark:border-white/5 rounded-2xl px-6 py-5 flex items-center gap-4 opacity-70">
                      <div className="p-3 bg-white dark:bg-white/10 rounded-xl shadow-sm">
                        <User className="w-6 h-6 text-gray-500 dark:text-white/60" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-bold mb-1">Identitas Pengguna</p>
                        <p className="text-gray-500 dark:text-white/50 text-sm">Nama dan ID akan terekam secara otomatis dan rahasia.</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-16 flex justify-between items-center pt-8 border-t border-gray-200 dark:border-white/10">
              {previewPage > 0 ? (
                <button 
                  onClick={() => setPreviewPage(previewPage - 1)}
                  className="px-8 py-3.5 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-white font-bold rounded-2xl border border-gray-200 dark:border-white/10 transition-all shadow-sm hover:shadow-md"
                >
                  Kembali
                </button>
              ) : <div></div>}

              {previewPage < pages.length - 1 ? (
                <button 
                  onClick={() => setPreviewPage(previewPage + 1)}
                  className="px-8 py-3.5 bg-primary hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-1"
                >
                  Selanjutnya
                </button>
              ) : (
                <button 
                  onClick={() => alert('Ini hanya simulasi! Jawaban Anda tidak disimpan di database.')}
                  className="px-8 py-3.5 bg-gradient-to-r from-primary to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-1 flex items-center gap-2"
                >
                  Kirim (Simulasi)
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        // EDIT MODE
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-[#050e0a]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 mb-8 border-t-8 border-t-primary shadow-xl">
            <input 
              type="text" 
              placeholder="Judul Form" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-200 dark:border-white/10 text-4xl font-black font-display text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 pb-3 mb-4 focus:outline-none focus:border-primary transition-colors"
            />
            <textarea 
              placeholder="Deskripsi Form"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 placeholder-gray-400 dark:placeholder-white/30 pb-2 focus:outline-none focus:border-primary transition-colors resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-6">
            {questions.map((q, index) => {
              const isDragging = draggedIndex === index;
              const isDraggedOver = draggedOverIndex === index;
              
              if (q.type === 'page_break') {
                return (
                  <div 
                    key={q.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    className={`relative py-4 flex items-center group cursor-grab active:cursor-grabbing transition-all ${isDragging ? 'opacity-50' : 'opacity-100'} ${isDraggedOver ? 'pt-12' : ''}`}
                  >
                    {isDraggedOver && <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-full"></div>}
                    <div className="absolute left-0 -ml-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      <div className="p-2 text-gray-400 bg-gray-100 dark:bg-white/10 rounded-lg cursor-grab">
                        <GripVertical size={16} />
                      </div>
                      <button 
                        onClick={() => removeQuestion(q.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                        title="Hapus Pembatas"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex-1 border-b-2 border-dashed border-gray-300 dark:border-white/20"></div>
                    <div className="px-4 text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-white/40 flex items-center gap-2">
                      <SplitSquareVertical size={16} />
                      Pembatas Halaman
                    </div>
                    <div className="flex-1 border-b-2 border-dashed border-gray-300 dark:border-white/20"></div>
                  </div>
                );
              }

              return (
                <div 
                  key={q.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  className={`bg-white/80 dark:bg-[#050e0a]/80 backdrop-blur-2xl border ${isDraggedOver ? 'border-primary border-t-4' : 'border-gray-200 dark:border-white/10'} rounded-2xl p-6 shadow-sm relative group transition-all hover:border-gray-300 dark:hover:border-white/20 ${isDragging ? 'opacity-50 scale-[0.98]' : 'opacity-100'} cursor-grab active:cursor-grabbing`}
                  style={{ zIndex: 100 - index }}
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 bg-gray-100 dark:bg-white/10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 dark:border-white/10 hidden md:block">
                    <GripVertical size={16} className="text-gray-500 dark:text-white/50" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input 
                      type="text" 
                      placeholder={`Pertanyaan ${index + 1}`}
                      value={q.question}
                      onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                    />
                    <CustomSelect 
                      options={typeOptions}
                      value={q.type}
                      onChange={(val) => updateQuestion(q.id, 'type', val)}
                      placeholder="Pilih Tipe"
                    />
                  </div>

                  <div className="ml-2 mb-8">
                    {(q.type === 'radio' || q.type === 'checkbox' || q.type === 'dropdown') ? (
                      <div className="space-y-3">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-3 group/opt">
                            {q.type === 'dropdown' ? (
                              <div className="w-6 h-6 rounded bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-white/50 flex items-center justify-center text-xs font-bold">{optIdx + 1}</div>
                            ) : (
                              <div className={`w-5 h-5 border-2 border-gray-300 dark:border-white/30 ${q.type === 'radio' ? 'rounded-full' : 'rounded'}`}></div>
                            )}
                            <input 
                              type="text" 
                              placeholder={`Opsi ${optIdx + 1}`}
                              value={opt}
                              onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                              className="flex-1 bg-transparent border-b border-transparent hover:border-gray-200 dark:hover:border-white/10 focus:border-primary dark:focus:border-primary text-gray-700 dark:text-white/90 px-2 py-1.5 focus:outline-none transition-colors"
                            />
                            {q.options.length > 1 && (
                              <button onClick={() => removeOption(q.id, optIdx)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover/opt:opacity-100 p-1 transition-all">
                                <XCircle size={20} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button 
                          onClick={() => addOption(q.id)}
                          className="flex items-center gap-2 text-sm text-primary hover:text-emerald-600 dark:hover:text-emerald-400 mt-4 px-2 font-medium"
                        >
                          <Plus size={16} /> Tambah Opsi
                        </button>
                      </div>
                    ) : (
                      <div className="border-b-2 border-dashed border-gray-200 dark:border-white/10 pb-3 text-gray-400 dark:text-white/40 pt-2 font-medium">
                        {q.type === 'text' && 'Teks jawaban singkat'}
                        {q.type === 'paragraph' && 'Teks jawaban panjang'}
                        {q.type === 'hidden_user' && 'Data pengguna (nama & id) akan direkam otomatis dan disembunyikan saat pengisian'}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end items-center gap-6 pt-5 border-t border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-600 dark:text-white/70 font-semibold">Poin</span>
                      <input 
                        type="number" 
                        min="0"
                        value={q.points || 0}
                        onChange={(e) => updateQuestion(q.id, 'points', parseInt(e.target.value) || 0)}
                        className="w-20 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-center text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all font-bold"
                      />
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-white/10"></div>
                    <button 
                      onClick={() => removeQuestion(q.id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                      title="Hapus Pertanyaan"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="h-8 w-px bg-gray-200 dark:bg-white/10"></div>
                    <label className="flex items-center gap-3 cursor-pointer text-gray-600 dark:text-white/70 text-sm select-none">
                      <span className="font-semibold">Wajib diisi</span>
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${q.required ? 'bg-primary' : 'bg-gray-300 dark:bg-white/20'}`}>
                        <input type="checkbox" className="sr-only" checked={q.required} onChange={(e) => updateQuestion(q.id, 'required', e.target.checked)} />
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${q.required ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center pb-10">
            <button 
              onClick={addQuestion}
              className="flex items-center gap-2 bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 text-gray-900 dark:text-white px-6 py-3 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg transition-all transform hover:scale-105 font-bold"
            >
              <Plus size={20} />
              Tambah Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
