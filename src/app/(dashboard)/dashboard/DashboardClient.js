"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, FileText, CheckSquare, TrendingUp, AlertCircle, Calendar, Activity, 
  ArrowRight, Clock, Plus, BarChart2, Star, Zap, Trophy
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function DashboardClient({ stats, user }) {
  const { data: session } = useSession();
  const { t, language } = useLanguage();
  const role = session?.user?.roleName;
  const [greeting, setGreeting] = useState("Welcome");
  const [currentDate, setCurrentDate] = useState("");
  const [topLeaders, setTopLeaders] = useState([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting(t("dashboard.greeting.morning"));
    else if (hour >= 12 && hour < 18) setGreeting(t("dashboard.greeting.afternoon"));
    else if (hour >= 18 && hour < 22) setGreeting(t("dashboard.greeting.evening"));
    else setGreeting(t("dashboard.greeting.night"));
    
    setCurrentDate(new Date().toLocaleDateString(language === 'id' ? "id-ID" : "en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
    
    fetch("/api/leaderboard")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setTopLeaders(data.slice(0, 5));
      });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const chartData = stats?.chartData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const rawChartData = stats?.rawChartData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const Widget = ({ title, value, subtitle, icon: Icon, color = "primary", trend = "+5%" }) => (
    <motion.div variants={item} className="bg-white dark:bg-[#08120e] hover:bg-gray-50 dark:hover:bg-[#0a1611] border border-gray-100 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none dark:hover:shadow-[0_10px_40px_rgba(16,185,129,0.1)]">
      {/* Decorative Glows */}
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full bg-${color}/10 blur-[40px] group-hover:bg-${color}/20 group-hover:scale-150 transition-all duration-700`}></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-${color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm dark:shadow-none`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-4xl md:text-5xl font-display font-black text-gray-900 dark:text-white tracking-tighter mb-2">{value}</h3>
        <p className="text-gray-900 dark:text-white font-bold text-sm tracking-wide mb-1">{title}</p>
        <p className="text-xs text-gray-500 dark:text-white/40 font-medium">
          {subtitle}
        </p>
      </div>
      
      {/* Mini sparkline mock */}
      <div className="absolute bottom-0 left-0 w-full h-12 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,20 L10,15 L20,18 L30,10 L40,12 L50,5 L60,8 L70,2 L80,6 L90,1 L100,5 L100,20 Z" className={`fill-${color}`} />
        </svg>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full relative pb-20">
      {/* Background Ambience */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"
        style={{ animationDuration: "6s" }}
      ></div>
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      {/* Header and ID Card */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 pt-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-white/60 mb-6 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {currentDate}
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-[1.1]">
            {greeting}, <br className="md:hidden" />
            <span className="text-primary dark:text-emerald-400">
              {session?.user?.name?.split(" ")[0]}
            </span>
          </h1>
          <p className="text-gray-500 dark:text-white/50 text-base md:text-lg max-w-xl font-light mb-8 leading-relaxed">
            {t("dashboard.welcome_msg")}
          </p>
        </motion.div>

        {/* Premium Membership Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              duration: 1,
              delay: 0.2,
              type: "spring",
              bounce: 0.4,
            }}
            className="w-full xl:w-[420px] shrink-0"
            style={{ perspective: 1200 }}
          >
            <motion.div
              whileHover={{ rotateY: -10, rotateX: 10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full aspect-[1.586/1] rounded-3xl p-[1px] group cursor-default shadow-2xl dark:shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Premium Gradient Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-300 via-primary to-blue-600 opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Card Body */}
              <div className="absolute inset-[1px] bg-gradient-to-br from-[#0a140f] to-[#040806] rounded-3xl overflow-hidden backdrop-blur-3xl">
                {/* Holographic Glare Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 -translate-x-[150%] group-hover:translate-x-[150%] transition-all duration-[1.5s] ease-in-out pointer-events-none z-20"></div>

                {/* Ambient Background Glows */}
                <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/40 rounded-full blur-[60px] group-hover:bg-primary/60 transition-colors duration-500"></div>
                <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-blue-600/30 rounded-full blur-[60px] group-hover:bg-blue-500/50 transition-colors duration-500"></div>

                {/* Noise Texture Overlay */}
                <div
                  className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
                  }}
                ></div>

                {/* SRE Watermark */}
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[160px] font-black text-white/[0.02] rotate-[-90deg] select-none pointer-events-none font-display leading-none tracking-tighter mix-blend-plus-lighter">
                  SRE
                </div>

                <div
                  className="relative z-10 p-7 h-full flex flex-col justify-between"
                  style={{ transform: "translateZ(40px)" }}
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/30 ring-1 ring-white/20">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold tracking-[0.25em] text-[11px] uppercase opacity-95 drop-shadow-sm">
                          SRE UPNVJT
                        </h3>
                        <p className="text-emerald-400 text-[9px] tracking-[0.3em] uppercase font-black drop-shadow-sm mt-0.5">
                          {t("dashboard.id_card.official_access")}
                        </p>
                      </div>
                    </div>
                    {/* Smart Chip Graphic */}
                    <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 opacity-90 flex flex-col justify-evenly p-1.5 shadow-inner border border-amber-300/50">
                      <div className="w-full h-[1px] bg-black/30"></div>
                      <div className="w-full h-[1px] bg-black/30"></div>
                      <div className="w-full h-[1px] bg-black/30"></div>
                    </div>
                  </div>

                  {/* Card Body / User Info */}
                  <div className="mt-auto">
                    <p className="text-white/40 text-[9px] uppercase tracking-[0.3em] mb-1.5">
                      {t("dashboard.id_card.cardholder")}
                    </p>
                    <h2 className="text-2xl font-display font-black text-white tracking-widest uppercase drop-shadow-md mb-3 line-clamp-1">
                      {user.name}
                    </h2>

                    <div className="flex flex-row items-end justify-between mt-5">
                      <div>
                        <p className="text-white/40 text-[8px] uppercase tracking-[0.3em] mb-1.5">
                          {t("dashboard.id_card.id_number")}
                        </p>
                        <p className="text-emerald-300 font-mono text-sm tracking-[0.2em] bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-inner">
                          {user.npm || "0000000000"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/40 text-[8px] uppercase tracking-[0.3em] mb-1.5">
                          {t("dashboard.id_card.role_dept")}
                        </p>
                        <p className="text-white font-bold text-[12px] tracking-widest uppercase mb-1">
                          {user.role?.name?.replace(/_/g, " ") || "MEMBER"}
                        </p>
                        <p className="text-white/60 text-[10px] tracking-widest uppercase truncate max-w-[130px]">
                          {user.department?.name || "General"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* PENDING ACTIONS (Attendance) */}
      <AnimatePresence>
        {stats?.pendingAttendance?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 rounded-3xl bg-gradient-to-r from-amber-500 via-primary to-blue-500 p-[1px] shadow-xl dark:shadow-[0_10px_30px_rgba(245,158,11,0.15)]"
          >
            <div className="bg-white dark:bg-[#08120e] rounded-[23px] p-6 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none"></div>

              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    {t("dashboard.pending_actions.action_required")}
                    <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] uppercase tracking-widest font-bold">
                      {t("dashboard.pending_actions.urgent")}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-white/60">
                    {t("dashboard.pending_actions.attendance_msg").replace(
                      "{count}",
                      stats.pendingAttendance.length,
                    )}
                  </p>
                </div>
              </div>
              <Link
                href="/attendance"
                className="relative z-10 px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_20px_rgba(255,255,255,0.2)] whitespace-nowrap flex items-center gap-2 group"
              >
                {t("dashboard.pending_actions.fill_attendance")}{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role-based Widgets Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* SUPER_ADMIN View */}
        {role === "SUPER_ADMIN" && (
          <>
            <Widget
              title={t("dashboard.widgets.total_members")}
              value={stats?.totalUsers || "0"}
              subtitle=""
              icon={Users}
              color="primary"
              trend="+"
            />
            <Widget
              title={t("dashboard.widgets.active_projects")}
              value={stats?.activeProjects || "0"}
              subtitle=""
              icon={CheckSquare}
              color="blue-500"
              trend="Active"
            />
            <Widget
              title={t("dashboard.widgets.published_articles")}
              value={stats?.publishedArticles || "0"}
              subtitle=""
              icon={FileText}
              color="emerald-500"
              trend="Content"
            />
            <Widget
              title={t("dashboard.widgets.departments")}
              value={stats?.totalDepartments || "0"}
              subtitle=""
              icon={Activity}
              color="amber-500"
              trend="Stable"
            />
          </>
        )}

        {/* DIRECTOR (Daily Officer) View */}
        {role === "DIRECTOR" && (
          <>
            <Widget
              title={t("dashboard.widgets.dept_performance")}
              value={stats?.deptPerformance || "94%"}
              subtitle=""
              icon={TrendingUp}
              color="primary"
              trend="+2%"
            />
            <Widget
              title={t("dashboard.widgets.active_projects")}
              value={stats?.activeProjects || "0"}
              subtitle=""
              icon={FileText}
              color="blue-500"
              trend="On Track"
            />
            <Widget
              title={t("dashboard.widgets.pending_approvals")}
              value={stats?.pendingApprovals || "0"}
              subtitle=""
              icon={CheckSquare}
              color="amber-500"
              trend="Action"
            />
            <Widget
              title={t("dashboard.widgets.upcoming_meetings")}
              value={stats?.upcomingMeetings || "0"}
              subtitle=""
              icon={Calendar}
              color="purple-500"
              trend="Soon"
            />
          </>
        )}

        {/* MANAGER View */}
        {role === "MANAGER" && (
          <>
            <Widget
              title={t("dashboard.widgets.team_tasks")}
              value={stats?.teamTasks || "0"}
              subtitle=""
              icon={CheckSquare}
              color="primary"
              trend="-1"
            />
            <Widget
              title={t("dashboard.widgets.staff_attendance")}
              value={stats?.staffAttendance || "92%"}
              subtitle=""
              icon={Users}
              color="blue-500"
              trend="+4%"
            />
            <Widget
              title={t("dashboard.widgets.project_progress")}
              value={stats?.projectProgress || "0"}
              subtitle=""
              icon={TrendingUp}
              color="emerald-500"
              trend="Good"
            />
            <Widget
              title={t("dashboard.widgets.pending_reviews")}
              value={stats?.pendingReviews || "0"}
              subtitle=""
              icon={AlertCircle}
              color="amber-500"
              trend="Action"
            />
          </>
        )}

        {/* STAFF View */}
        {role === "STAFF" && (
          <>
            <Widget
              title={t("dashboard.widgets.my_tasks")}
              value={stats?.myTasks || "0"}
              subtitle=""
              icon={CheckSquare}
              color="primary"
              trend="Focus"
            />
            <Widget
              title={t("dashboard.widgets.my_attendance")}
              value={stats?.myAttendance || "100%"}
              subtitle=""
              icon={TrendingUp}
              color="emerald-500"
              trend="Great"
            />
            <Widget
              title={t("dashboard.widgets.upcoming_events")}
              value={stats?.upcomingEvents || "0"}
              subtitle=""
              icon={Calendar}
              color="blue-500"
              trend="Soon"
            />
            <Widget
              title={t("dashboard.widgets.announcements")}
              value={stats?.announcements || "0"}
              subtitle=""
              icon={AlertCircle}
              color="purple-500"
              trend="New"
            />
          </>
        )}
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"
      >
        {/* Top 5 Leaderboard */}
        <div className="bg-white dark:bg-[#08120e] border border-gray-100 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[60px] pointer-events-none" />

          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="font-display font-bold text-2xl tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              {t("dashboard.leaderboard.title")}
            </h3>
            <Link
              href="/leaderboard"
              className="text-xs font-bold uppercase tracking-widest text-primary hover:text-emerald-600 transition-colors"
            >
              {t("dashboard.leaderboard.view_all")}
            </Link>
          </div>

          <div className="flex flex-col gap-4 relative z-10">
            {topLeaders.length > 0 ? (
              topLeaders.map((u, idx) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-white dark:bg-white/10 flex items-center justify-center font-bold shadow-sm overflow-hidden text-gray-500 dark:text-white/60 text-lg border border-gray-200 dark:border-white/10">
                        {u.profilePictureUrl ? (
                          <img
                            src={u.profilePictureUrl}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          u.name.charAt(0)
                        )}
                      </div>
                      {idx < 3 && (
                        <div
                          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-[#08120e] ${idx === 0 ? "bg-yellow-400 text-yellow-900" : idx === 1 ? "bg-gray-300 text-gray-800" : "bg-amber-600 text-white"}`}
                        >
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                        {u.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-white/40">
                        {u.positionName || "Staff"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 font-black bg-yellow-50 dark:bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-100 dark:border-yellow-500/20">
                    {u.totalPoints}{" "}
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-48 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium text-gray-400">
                {t("dashboard.leaderboard.loading")}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="bg-white dark:bg-[#08120e] border border-gray-100 dark:border-white/5 rounded-3xl p-8 min-h-[440px] flex flex-col relative overflow-hidden shadow-sm dark:shadow-none lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display font-bold text-2xl tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-500" />
              {t("dashboard.timeline.title")}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
            {stats?.recentActivities?.length > 0 ? (
              <div className="relative border-l-2 border-gray-100 dark:border-white/5 ml-3 space-y-8 pb-4 pt-2">
                {stats.recentActivities.map((activity, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    key={activity.id}
                    className="relative pl-6 group"
                  >
                    {/* Timeline Node */}
                    <div className="absolute w-3.5 h-3.5 bg-white dark:bg-[#08120e] border-2 border-primary rounded-full -left-[8.5px] top-1 group-hover:scale-150 group-hover:bg-primary transition-all duration-300" />

                    <div className="bg-gray-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-gray-100 dark:border-white/5 group-hover:border-primary/30 transition-colors">
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 pr-2">
                          {activity.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-white/50 mb-3">
                        {activity.desc}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          {activity.type}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-white/40 font-medium">
                          {new Date(activity.date).toLocaleDateString(
                            language === "id" ? "id-ID" : "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-white/[0.01] h-48">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 text-gray-300 dark:text-white/20" />
                </div>
                <p className="text-gray-400 dark:text-white/30 font-bold text-sm tracking-wide">
                  {t("dashboard.timeline.quiet")}
                </p>
                <p className="text-xs text-gray-400 dark:text-white/20 mt-1">
                  {t("dashboard.timeline.no_activities")}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

    
    </div>
  );
}

