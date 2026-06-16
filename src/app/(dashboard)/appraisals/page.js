"use client";

import { useEffect, useState } from "react";
import { Star, Save, UserCheck, Calendar, MessageSquare, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function AppraisalsPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ evaluateeId: "", score: "", feedback: "", period: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch("/api/appraisals")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setUsers(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/appraisals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: t("appraisals.success_msg") });
        setFormData({ evaluateeId: "", score: "", feedback: "", period: "" });
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: data.error || t("appraisals.error_save") });
      }
    } catch (err) {
      setMessage({ type: 'error', text: t("appraisals.error_network") });
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center gap-4 relative z-10"
      >
        <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-2xl border border-primary/20 shadow-sm">
          <Star className="w-8 h-8 text-primary dark:text-primary" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-gray-900 dark:text-white">{t("appraisals.title")}</h1>
          <p className="text-gray-500 dark:text-white/50 text-sm mt-1">{t("appraisals.subtitle")}</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 p-4 rounded-xl font-medium flex items-center gap-3 border shadow-sm ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'}`}
          >
            {message.type === 'success' ? <Star className="w-5 h-5 fill-current"/> : <AlertCircle className="w-5 h-5"/>}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit} 
        className="bg-white dark:bg-[#08120e] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col gap-6 relative z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-white/[0.02] dark:to-transparent rounded-3xl pointer-events-none" />

        <div className="relative z-10">
          <label className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-primary" /> {t("appraisals.select_member")}
          </label>
          <select 
            required 
            disabled={users.length === 0}
            value={formData.evaluateeId} 
            onChange={e => setFormData({...formData, evaluateeId: e.target.value})}
            className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer font-medium"
          >
            <option value="">-- {t("appraisals.choose_member")} --</option>
            {users.map(u => (
              <option key={u.id} value={u.id} className="bg-white dark:bg-[#08120e] text-gray-900 dark:text-white">
                {u.name} ({u.positionName || 'Staff'})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="relative z-10">
            <label className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" /> {t("appraisals.score")} (1-100)
            </label>
            <input 
              type="number" 
              required 
              min="1"
              max="100"
              value={formData.score}
              onChange={e => setFormData({...formData, score: e.target.value})}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all font-mono font-bold text-lg"
              placeholder={t("appraisals.score_placeholder")}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> {t("appraisals.period")}
            </label>
            <input 
              type="text" 
              required 
              value={formData.period}
              onChange={e => setFormData({...formData, period: e.target.value})}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Contoh: Q3 2026 atau Juni 2026"
            />
          </div>
        </div>

        <div className="relative z-10">
          <label className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> {t("appraisals.feedback")}
          </label>
          <textarea 
            rows="4"
            required
            value={formData.feedback}
            onChange={e => setFormData({...formData, feedback: e.target.value})}
            className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            placeholder={t("appraisals.feedback_placeholder")}
          ></textarea>
        </div>

        <button 
          disabled={submitting} 
          type="submit" 
          className="relative z-10 mt-2 bg-primary hover:bg-primary-focus text-[#050e0a] p-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50 shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-[#050e0a] border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <><Save size={20}/> {t("appraisals.btn_submit")}</>
          )}
        </button>
      </motion.form>
    </div>
  );
}
