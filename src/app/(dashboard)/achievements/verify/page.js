"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, ExternalLink, ShieldCheck, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function VerifyAchievementsPage() {
  const { t } = useLanguage();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [pointsInput, setPointsInput] = useState({});

  const fetchClaims = () => {
    fetch("/api/achievements/verify")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setClaims(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleVerify = async (id, action) => {
    setProcessingId(id);
    const points = action === 'APPROVE' ? (pointsInput[id] || 0) : 0;
    
    try {
      const res = await fetch("/api/achievements/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achievementId: id, action, points })
      });
      const data = await res.json();
      if (data.success) {
        // Hapus klaim yang sudah di proses dari list UI
        setClaims(claims.filter(c => c.id !== id));
      } else {
        alert(data.error || t("achievements.fail_verify"));
      }
    } catch (err) {
      alert(t("achievements.sys_error"));
    }
    setProcessingId(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center gap-4 relative z-10"
      >
        <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl border border-emerald-500/20 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-gray-900 dark:text-white">{t("achievements.title_verify")}</h1>
          <p className="text-gray-500 dark:text-white/50 text-sm mt-1">{t("achievements.subtitle_verify")}</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-6 relative z-10">
        <AnimatePresence>
          {claims.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-16 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl bg-white dark:bg-[#08120e]"
            >
              <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Target className="w-10 h-10 text-gray-300 dark:text-white/20" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("achievements.all_good")}</h2>
              <p className="text-gray-500 dark:text-white/50">{t("achievements.no_pending_claims")}</p>
            </motion.div>
          ) : (
            claims.map((claim, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                key={claim.id} 
                className="bg-white dark:bg-[#08120e] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-none hover:border-emerald-500/30 transition-colors group flex flex-col lg:flex-row gap-6 justify-between lg:items-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/20 to-transparent dark:from-white/[0.01] dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {claim.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-white/60 mb-4 leading-relaxed max-w-3xl">
                    {claim.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <span className="font-medium text-gray-600 dark:text-white/40 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10">
                      {t("achievements.by")} <strong className="text-gray-900 dark:text-white">{claim.userName}</strong> ({claim.userNpm || t("achievements.no_npm")})
                    </span>
                    <span className="text-gray-400 dark:text-white/30">
                      {t("achievements.submitted_date")} {new Date(claim.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <a href={claim.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                      <ExternalLink className="w-3.5 h-3.5" /> {t("achievements.open_proof_link")}
                    </a>
                  </div>
                </div>

                {/* Verification Action Box */}
                <div className="shrink-0 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 relative z-10 min-w-[280px]">
                  <label className="block text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2">{t("achievements.give_points")}</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder={t("achievements.points_placeholder")}
                    value={pointsInput[claim.id] || ''}
                    onChange={(e) => setPointsInput({...pointsInput, [claim.id]: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#08120e] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none mb-4 font-bold text-center text-lg"
                  />
                  
                  <div className="flex items-center gap-2">
                    <button 
                      disabled={processingId === claim.id}
                      onClick={() => handleVerify(claim.id, 'REJECT')}
                      className="flex-1 py-3 px-2 flex justify-center items-center gap-1.5 rounded-xl font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> {t("achievements.btn_reject")}
                    </button>
                    <button 
                      disabled={processingId === claim.id || !pointsInput[claim.id]}
                      onClick={() => handleVerify(claim.id, 'APPROVE')}
                      className="flex-[1.5] py-3 px-2 flex justify-center items-center gap-1.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {processingId === claim.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <><CheckCircle className="w-4 h-4" /> {t("achievements.btn_approve")}</>
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
