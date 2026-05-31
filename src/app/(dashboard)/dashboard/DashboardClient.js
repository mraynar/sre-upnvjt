"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Users, FileText, CheckSquare, TrendingUp, AlertCircle, Calendar, Activity } from "lucide-react";

export default function DashboardClient({ stats }) {
  const { data: session } = useSession();
  const role = session?.user?.roleName;

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

  const Widget = ({ title, value, subtitle, icon: Icon, color = "primary" }) => (
    <motion.div variants={item} className="bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-sm border border-white/5 rounded-2xl p-6 relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-${color}/10 blur-[40px] group-hover:bg-${color}/20 group-hover:scale-150 transition-all duration-700`}></div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="text-white/40 text-xs font-bold tracking-[0.1em] uppercase mb-1.5">{title}</p>
          <h3 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter">{value}</h3>
        </div>
        <div className={`p-3.5 rounded-xl bg-white/5 border border-white/10 text-${color} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-xs text-white/50 flex items-center gap-1.5 font-medium relative z-10">
        <span className={`w-1.5 h-1.5 rounded-full bg-${color} animate-pulse`}></span>
        {subtitle}
      </p>
    </motion.div>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto relative">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter mb-3">
          Welcome back, <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">{session?.user?.name?.split(" ")[0]}</span>
        </h1>
        <p className="text-white/50 text-sm md:text-base max-w-xl font-light">
          Here's a quick overview of what's happening in your department today. Keep pushing the boundaries of renewable energy.
        </p>
      </motion.div>

      {/* PENDING ACTIONS (Attendance) */}
      {stats?.pendingAttendance?.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-amber-500/20 via-primary/20 to-blue-500/20 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-2xl"></div>
          <div className="bg-[#050e0a] rounded-xl p-6 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
                <AlertCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Action Required: Attendance</h3>
                <p className="text-sm text-white/60">You have {stats.pendingAttendance.length} active session(s) requiring your response.</p>
              </div>
            </div>
            <a 
              href="/attendance"
              className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap"
            >
              Fill Attendance Now
            </a>
          </div>
        </motion.div>
      )}

      {/* Role-based Content */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        
        {/* SUPER_ADMIN View */}
        {role === "SUPER_ADMIN" && (
          <>
            <Widget title="Total Users" value={stats?.totalUsers || "0"} subtitle="Active members across all depts" icon={Users} color="primary" />
            <Widget title="Active Projects" value={stats?.activeProjects || "0"} subtitle={`${stats?.pendingReports || "0"} pending approvals`} icon={FileText} color="blue-400" />
            <Widget title="System Health" value={stats?.systemHealth || "100%"} subtitle="All services operational" icon={TrendingUp} color="emerald-400" />
            <Widget title="Pending Reports" value={stats?.pendingReports || "0"} subtitle="Requires review" icon={AlertCircle} color="amber-400" />
          </>
        )}

        {/* DIRECTOR (Daily Officer) View */}
        {role === "DIRECTOR" && (
          <>
            <Widget title="Dept Performance" value={stats?.deptPerformance || "94%"} subtitle="+2% from last month" icon={TrendingUp} color="primary" />
            <Widget title="Active Projects" value={stats?.activeProjects || "0"} subtitle="In execution phase" icon={FileText} color="blue-400" />
            <Widget title="Pending Approvals" value={stats?.pendingApprovals || "0"} subtitle="Requires your signature" icon={CheckSquare} color="amber-400" />
            <Widget title="Upcoming Meetings" value={stats?.upcomingMeetings || "0"} subtitle="Next: Pleno at 15:00" icon={Calendar} color="purple-400" />
          </>
        )}

        {/* MANAGER View */}
        {role === "MANAGER" && (
          <>
            <Widget title="Team Tasks" value={stats?.teamTasks || "0"} subtitle="8 due this week" icon={CheckSquare} color="primary" />
            <Widget title="Staff Attendance" value={stats?.staffAttendance || "92%"} subtitle="Last week's average" icon={Users} color="blue-400" />
            <Widget title="Project Progress" value={stats?.projectProgress || "0"} subtitle="SRE Mengajar 2026" icon={TrendingUp} color="emerald-400" />
            <Widget title="Pending Reviews" value={stats?.pendingReviews || "0"} subtitle="Staff submissions" icon={AlertCircle} color="amber-400" />
          </>
        )}

        {/* STAFF View */}
        {role === "STAFF" && (
          <>
            <Widget title="My Tasks" value={stats?.myTasks || "0"} subtitle="2 high priority" icon={CheckSquare} color="primary" />
            <Widget title="My Attendance" value={stats?.myAttendance || "100%"} subtitle="Perfect streak" icon={TrendingUp} color="emerald-400" />
            <Widget title="Upcoming Events" value={stats?.upcomingEvents || "0"} subtitle="Divisional Meeting" icon={Calendar} color="blue-400" />
            <Widget title="Announcements" value={stats?.announcements || "0"} subtitle="Unread messages" icon={AlertCircle} color="purple-400" />
          </>
        )}
      </motion.div>

      {/* Main Content Area Placeholder */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10"
      >
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-8 min-h-[400px] flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          <h3 className="font-display font-bold text-xl tracking-tight mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Activity Overview
          </h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
            <p className="text-white/30 font-medium text-sm tracking-wide">Interactive Chart (Coming Soon)</p>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 min-h-[400px] flex flex-col relative overflow-hidden">
          <h3 className="font-display font-bold text-xl tracking-tight mb-6">Recent Activity</h3>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {stats?.recentActivities?.length > 0 ? (
              stats.recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors cursor-default">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{activity.title}</h4>
                    <span className="text-[10px] text-white/40 whitespace-nowrap ml-2">
                      {new Date(activity.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <p className="text-xs text-white/50">{activity.desc}</p>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                <p className="text-white/30 font-medium text-sm tracking-wide">No recent activities</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
