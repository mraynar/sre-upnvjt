"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, CheckCircle, Clock, CheckSquare, X, Save, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAs, setViewAs] = useState("assignedToMe"); // 'assignedToMe' or 'createdByme'
  
  const [showModal, setShowModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    targetRoleIds: [],
    deadline: "",
    requireWeeklyReport: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportText, setReportText] = useState({});
  const [submittingReport, setSubmittingReport] = useState({});

  const permissions = session?.user?.permissions || {};
  const hasTaskCreatePermission = Array.isArray(permissions.tasks) && permissions.tasks.includes('create');
  const canCreateTask = session?.user?.roleName === 'SUPER_ADMIN' || hasTaskCreatePermission;

  useEffect(() => {
    fetchTasks();
  }, [viewAs]);

  useEffect(() => {
    if (canCreateTask && roles.length === 0) {
      fetch("/api/roles")
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setRoles(data); })
        .catch(err => console.error("Error fetching roles:", err));
    }
  }, [canCreateTask, roles.length]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?viewAs=${viewAs}`);
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const submitReport = async (taskId) => {
    const text = reportText[taskId];
    if (!text) return;
    setSubmittingReport({...submittingReport, [taskId]: true});
    try {
      const res = await fetch("/api/tasks/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, reportText: text })
      });
      if (res.ok) {
        setReportText({ ...reportText, [taskId]: "" });
        fetchTasks();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal mengirim laporan");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem");
    } finally {
      setSubmittingReport({...submittingReport, [taskId]: false});
    }
  };

  const handleRoleToggle = (roleId) => {
    const current = newTask.targetRoleIds;
    if (current.includes(roleId)) {
      setNewTask({ ...newTask, targetRoleIds: current.filter(id => id !== roleId) });
    } else {
      setNewTask({ ...newTask, targetRoleIds: [...current, roleId] });
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        setShowModal(false);
        setNewTask({ title: "", description: "", targetRoleIds: [], deadline: "", requireWeeklyReport: false });
        fetchTasks();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal membuat tugas");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <CheckSquare className="w-6 h-6" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/60">
              Todolist & Tugas
            </span>
          </h1>
          <p className="text-gray-500 dark:text-white/50 text-sm md:text-base font-medium">Kelola dan pantau tugas antar Role di organisasimu.</p>
        </div>
        
        {canCreateTask && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-xl font-bold tracking-wide flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Buat Tugas Baru
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-8 p-1 bg-gray-100/50 dark:bg-white/[0.02] rounded-2xl border border-gray-200/50 dark:border-white/5 w-max max-w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
        <button 
          onClick={() => setViewAs('assignedToMe')}
          className={`px-6 py-2.5 rounded-xl font-bold tracking-wider uppercase text-[11px] transition-all duration-300 relative ${viewAs === 'assignedToMe' ? 'text-primary shadow-sm' : 'text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white'}`}
        >
          {viewAs === 'assignedToMe' && (
            <motion.div layoutId="activeTab" className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-200/50 dark:border-white/5" />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5" />
            Tugas Role Saya
          </span>
        </button>
        {canCreateTask && (
          <button 
            onClick={() => setViewAs('createdByme')}
            className={`px-6 py-2.5 rounded-xl font-bold tracking-wider uppercase text-[11px] transition-all duration-300 relative ${viewAs === 'createdByme' ? 'text-primary shadow-sm' : 'text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white'}`}
          >
            {viewAs === 'createdByme' && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-200/50 dark:border-white/5" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Save className="w-3.5 h-3.5" />
              Tugas yang Saya Berikan
            </span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-white/10 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center p-20 bg-white/[0.02] rounded-3xl border border-gray-200 dark:border-white/5 backdrop-blur-xl">
          <CheckCircle className="mx-auto h-16 w-16 text-gray-500 dark:text-white/20 mb-6" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tidak ada tugas</h3>
          <p className="text-gray-500 dark:text-white/50">Belum ada tugas yang masuk dalam daftar ini.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map(task => (
            <div key={task.id} className="bg-white dark:bg-[#08130e] border border-gray-200/60 dark:border-white/10 p-6 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:shadow-none dark:hover:shadow-[0_0_40px_rgba(16,185,129,0.08)] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col h-full relative overflow-hidden">
              {/* Decorative Card Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-x-10 -translate-y-10"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full flex items-center gap-2 border backdrop-blur-sm
                  ${task.status === 'TODO' ? 'bg-gray-100/80 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200/80 dark:border-white/10' : 
                    task.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' : 
                    task.status === 'DONE' ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 
                    'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'}`}>
                  {task.status === 'TODO' && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                  {task.status === 'IN_PROGRESS' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
                  {task.status === 'DONE' && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
                  {task.status.replace('_', ' ')}
                </div>
                <div className="flex items-center text-[11px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-gray-100 dark:border-white/5">
                  <Clock size={12} className="mr-1.5 text-gray-400" />
                  {new Date(task.deadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                </div>
              </div>
              
              <h3 className="text-xl font-display font-black text-gray-900 dark:text-white mb-3 relative z-10 leading-tight group-hover:text-primary transition-colors duration-300">{task.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-3 relative z-10 leading-relaxed">{task.description}</p>
              
              <div className="mt-auto pt-6 flex flex-col gap-5 relative z-10">
                <div className="flex flex-col gap-1.5 bg-gray-50/80 dark:bg-white/[0.03] p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                  {viewAs === 'assignedToMe' ? (
                    <div className="flex justify-between items-center">
                      <span className="uppercase font-bold tracking-widest text-[9px] text-gray-400 dark:text-gray-500">Diberikan Oleh</span>
                      <span className="font-bold text-xs text-gray-800 dark:text-gray-200">{task.assignedBy?.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      <span className="uppercase font-bold tracking-widest text-[9px] text-gray-400 dark:text-gray-500">Target Role</span>
                      <div className="flex flex-wrap gap-2">
                        {task.targetRoles?.map(role => (
                          <span key={role.id} className="bg-white dark:bg-white/10 shadow-sm border border-gray-200/50 dark:border-white/5 px-3 py-1 rounded-lg text-gray-700 dark:text-gray-200 text-[10px] font-bold">{role.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {viewAs === 'assignedToMe' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Ubah Status</label>
                    <div className="relative">
                      <select
                        value={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                        className="w-full appearance-none text-xs bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 px-4 py-3 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer text-gray-800 dark:text-white shadow-sm"
                      >
                        <option value="TODO">To Do (Mulai)</option>
                        <option value="IN_PROGRESS">In Progress (Sedang Dikerjakan)</option>
                        <option value="DONE">Done (Selesai)</option>
                        <option value="OVERDUE">Overdue (Terlambat)</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                )}
                
                {task.requireWeeklyReport && (
                  <div className="mt-2 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
                      <span className="uppercase font-black tracking-widest text-[9px] text-primary/80">Laporan Mingguan</span>
                      <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
                    </div>
                    
                    {task.reports && task.reports.length > 0 ? (
                      <div className="space-y-2.5 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                        {task.reports.map(report => (
                          <div key={report.id} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm relative group/report">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/30 rounded-l-xl"></div>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 block mb-1.5">{new Date(report.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{report.reportText}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic font-medium">Belum ada laporan progres.</p>
                      </div>
                    )}
                    
                    {viewAs === 'assignedToMe' && (
                      <div className="relative mt-1">
                        <textarea 
                          value={reportText[task.id] || ""}
                          onChange={e => setReportText({...reportText, [task.id]: e.target.value})}
                          placeholder="Ketik laporan mingguan di sini..."
                          className="w-full bg-white dark:bg-black/20 text-xs px-4 pt-3.5 pb-[44px] pr-4 rounded-[16px] border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none text-gray-800 dark:text-white shadow-inner placeholder:text-gray-400 transition-all leading-relaxed"
                          rows="2"
                        />
                        <button 
                          onClick={() => submitReport(task.id)}
                          disabled={!reportText[task.id] || submittingReport[task.id]}
                          className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all flex items-center justify-center gap-1.5 font-bold text-[10px] uppercase tracking-wide
                            ${(!reportText[task.id] || submittingReport[task.id]) 
                              ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed' 
                              : 'bg-primary hover:bg-primary/90 text-white shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:scale-105 active:scale-95'
                            }`}
                          title="Kirim Laporan"
                        >
                          {submittingReport[task.id] ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                              <span>Kirim</span>
                            </>
                          ) : (
                            <>
                              <span>Kirim</span>
                              <Send className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white dark:bg-[#050e0a] border border-gray-200 dark:border-white/10 rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Modal Header Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

              <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/10 flex justify-between items-center relative z-10">
                <div>
                  <h2 className="text-2xl font-display font-black tracking-tight text-gray-900 dark:text-white mb-1">Buat Tugas Baru</h2>
                  <p className="text-sm font-medium text-gray-500 dark:text-white/50">Tugaskan pekerjaan ke divisi atau role tertentu.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="flex flex-col overflow-hidden">
                <div className="p-6 md:p-8 overflow-y-auto space-y-8 relative z-10 custom-scrollbar">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Judul Tugas</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-white/20" 
                      value={newTask.title} 
                      onChange={e => setNewTask({...newTask, title: e.target.value})} 
                      placeholder="Contoh: Desain Banner Event"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Deskripsi Detail</label>
                    <textarea 
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-white/20" 
                      rows="4" 
                      value={newTask.description} 
                      onChange={e => setNewTask({...newTask, description: e.target.value})} 
                      placeholder="Jelaskan instruksi atau detail dari tugas ini..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-white/50 mb-3">Tugaskan ke Role <span className="text-gray-400 dark:text-white/30 normal-case font-medium tracking-normal">(Bisa pilih lebih dari 1)</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
                      {roles.map(role => {
                        const isSelected = newTask.targetRoleIds.includes(role.id);
                        return (
                          <div 
                            key={role.id} 
                            onClick={() => handleRoleToggle(role.id)}
                            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 ${isSelected ? 'bg-primary/10 border-primary text-primary shadow-[0_4px_15px_rgba(16,185,129,0.1)]' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'}`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 dark:border-white/30 bg-white dark:bg-transparent'}`}>
                              {isSelected && <CheckCircle size={14} className="text-black" />}
                            </div>
                            <span className="font-bold text-sm tracking-wide">{role.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Tenggat Waktu (Deadline)</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all dark:[color-scheme:dark]" 
                      value={newTask.deadline} 
                      onChange={e => setNewTask({...newTask, deadline: e.target.value})} 
                    />
                  </div>
                  
                  <div className="flex items-center bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-200 dark:border-white/10 transition-colors hover:border-primary/50 cursor-pointer" onClick={() => setNewTask({...newTask, requireWeeklyReport: !newTask.requireWeeklyReport})}>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${newTask.requireWeeklyReport ? 'bg-primary border-primary' : 'border-gray-300 dark:border-white/30 bg-white dark:bg-transparent'}`}>
                      {newTask.requireWeeklyReport && <CheckCircle size={14} className="text-black" />}
                    </div>
                    <label className="ml-3 text-sm font-bold text-gray-900 dark:text-white cursor-pointer select-none">
                      Wajibkan Laporan Mingguan untuk Tugas Ini
                    </label>
                  </div>
                </div>
                
                <div className="p-6 md:p-8 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col-reverse sm:flex-row justify-end gap-3 relative z-10">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3.5 rounded-2xl font-bold tracking-wide text-gray-500 dark:text-white/60 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90 text-black px-8 py-3.5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm w-full sm:w-auto"
                    disabled={isSubmitting || newTask.targetRoleIds.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" /> 
                        Buat Tugas
                      </>
                    )}
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
