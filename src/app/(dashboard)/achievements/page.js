"use client";

import { useEffect, useState } from "react";
import { Target, Upload, CheckCircle, Award, ExternalLink, Clock, AlertCircle, Link as LinkIcon, FileUp } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function AchievementsPage() {
  const { t } = useLanguage();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", description: "", proofUrl: "" });
  const [submitting, setSubmitting] = useState(false);
  
  const [inputType, setInputType] = useState('link'); // 'link' or 'upload'
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchList = () => {
    fetch("/api/achievements")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setAchievements(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    let finalProofUrl = formData.proofUrl;

    try {
      // 1. Jika mode upload file, unggah file dulu
      if (inputType === 'upload' && selectedFile) {
        const fileData = new FormData();
        fileData.append('file', selectedFile);
        fileData.append('folder', 'achievements');

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fileData
        });
        const uploadResult = await uploadRes.json();
        
        if (uploadResult.success) {
          finalProofUrl = uploadResult.url;
        } else {
          alert(t("achievements.fail_upload") + uploadResult.error);
          setSubmitting(false);
          return;
        }
      }

      // 2. Simpan klaim prestasi
      const payload = { ...formData, proofUrl: finalProofUrl };

      const res = await fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        setFormData({ title: "", description: "", proofUrl: "" });
        setSelectedFile(null);
        fetchList();
      } else {
        alert(data.error || t("achievements.fail_save"));
      }
    } catch (err) {
      alert(t("achievements.sys_error"));
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full flex flex-col lg:flex-row gap-10 relative">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      {/* Form Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 lg:max-w-xl relative z-10"
      >
        <div className="mb-8 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl border border-emerald-500/20 shadow-sm">
            <Target className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-gray-900 dark:text-white">{t("achievements.title_claim")}</h1>
            <p className="text-gray-500 dark:text-white/50 text-sm mt-1">{t("achievements.subtitle_claim")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#08120e] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-white/[0.02] dark:to-transparent rounded-3xl pointer-events-none" />

          <div className="relative z-10">
            <label className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" /> {t("achievements.achievement_title_label")}
            </label>
            <input 
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium" 
              placeholder={t("achievements.achievement_title_placeholder")} 
            />
          </div>

          <div className="relative z-10">
            <label className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              {t("achievements.short_desc_label")}
            </label>
            <textarea 
              required 
              rows="3" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none" 
              placeholder={t("achievements.short_desc_placeholder")} 
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {inputType === 'link' ? <ExternalLink className="w-4 h-4 text-emerald-500" /> : <FileUp className="w-4 h-4 text-emerald-500" />} 
                {t("achievements.proof_label")}
              </label>
              
              <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                <button 
                  type="button" 
                  onClick={() => setInputType('link')}
                  className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition-colors ${inputType === 'link' ? 'bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <LinkIcon className="w-3 h-3" /> {t("achievements.link_btn")}
                </button>
                <button 
                  type="button" 
                  onClick={() => setInputType('upload')}
                  className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition-colors ${inputType === 'upload' ? 'bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <FileUp className="w-3 h-3" /> {t("achievements.upload_btn")}
                </button>
              </div>
            </div>

            {inputType === 'link' ? (
              <input 
                required 
                type="url" 
                value={formData.proofUrl} 
                onChange={e => setFormData({...formData, proofUrl: e.target.value})} 
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                placeholder={t("achievements.link_placeholder")} 
              />
            ) : (
              <div className="w-full p-4 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors text-center relative cursor-pointer group">
                <input 
                  required={!selectedFile}
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={e => setSelectedFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <FileUp className="w-6 h-6 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/70 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {selectedFile ? selectedFile.name : t("achievements.upload_placeholder")}
                  </span>
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-400 dark:text-white/40 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {inputType === 'link' ? t("achievements.link_hint") : t("achievements.upload_hint")}
            </p>
          </div>

          <button 
            disabled={submitting} 
            type="submit" 
            className="relative z-10 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50 shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <><Upload size={20}/> {t("achievements.btn_submit_claim")}</>
            )}
          </button>
        </form>
      </motion.div>

      {/* History Section */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-[1.5] relative z-10"
      >
        <div className="flex items-center justify-between mb-6 pt-4 lg:pt-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-500" />
            {t("achievements.claim_history")}
          </h2>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">
            {achievements.length} {t("achievements.total")}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {achievements.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl bg-white dark:bg-[#08120e]">
              <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-gray-300 dark:text-white/20" />
              </div>
              <p className="text-gray-500 dark:text-white/40 font-bold">{t("achievements.no_history")}</p>
              <p className="text-sm text-gray-400 dark:text-white/30 mt-1">{t("achievements.no_history_desc")}</p>
            </div>
          ) : (
            achievements.map((a, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                key={a.id} 
                className="p-5 md:p-6 bg-white dark:bg-[#08120e] border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm dark:shadow-none hover:border-emerald-500/30 transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pr-4">{a.title}</h3>
                  <span className={`shrink-0 text-[10px] md:text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-widest flex items-center gap-1 ${a.status === 'APPROVED' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20'}`}>
                    {a.status === 'APPROVED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {a.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-white/60 mb-5 leading-relaxed">{a.description}</p>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-sm border-t border-gray-100 dark:border-white/5 pt-4">
                  <a href={a.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    <ExternalLink className="w-4 h-4" /> {t("achievements.view_proof_doc")}
                  </a>
                  
                  {a.status === 'APPROVED' && (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl font-black border border-emerald-500/20">
                      +{a.pointsAwarded} {t("achievements.leaderboard_points")}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
