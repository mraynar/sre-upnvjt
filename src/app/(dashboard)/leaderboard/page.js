"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full relative">
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-2xl">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-gray-900 dark:text-white">{t("leaderboard.title")}</h1>
          <p className="text-gray-500 dark:text-white/50 text-sm mt-1">{t("leaderboard.subtitle")}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-[#08120e] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="py-4 px-4 text-xs uppercase tracking-widest text-gray-400 dark:text-white/30 font-bold">{t("leaderboard.rank")}</th>
                <th className="py-4 px-4 text-xs uppercase tracking-widest text-gray-400 dark:text-white/30 font-bold">{t("leaderboard.user")}</th>
                <th className="py-4 px-4 text-xs uppercase tracking-widest text-gray-400 dark:text-white/30 font-bold">{t("leaderboard.position")}</th>
                <th className="py-4 px-4 text-xs uppercase tracking-widest text-gray-400 dark:text-white/30 font-bold text-right">{t("leaderboard.points")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={user.id} 
                  className="border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-5 px-4 font-bold">
                    {idx === 0 && <span className="text-yellow-500 flex items-center gap-2"><Medal size={20}/> 1st</span>}
                    {idx === 1 && <span className="text-gray-400 flex items-center gap-2"><Medal size={20}/> 2nd</span>}
                    {idx === 2 && <span className="text-amber-600 flex items-center gap-2"><Medal size={20}/> 3rd</span>}
                    {idx > 2 && <span className="text-gray-400 dark:text-white/40 ml-6">{idx + 1}</span>}
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden border border-gray-200 dark:border-white/5 group-hover:border-primary/50 transition-colors shrink-0">
                        {user.profilePictureUrl ? (
                          <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-white/50 font-bold text-lg">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-sm text-gray-600 dark:text-white/60 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/5">
                      {user.positionName || 'Staff'}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-3 py-1.5 rounded-xl font-black text-lg border border-yellow-100 dark:border-yellow-500/20 shadow-[0_2px_10px_rgba(234,179,8,0.1)]">
                      {user.totalPoints} <Star className="w-4 h-4 fill-current"/>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-16 text-gray-400 dark:text-white/30 font-medium">
              {t("leaderboard.no_data")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
