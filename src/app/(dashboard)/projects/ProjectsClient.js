"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderKanban, Plus, Edit2, Trash2, X, Search, Calendar, Users, Target, ChevronDown, CheckCircle2, Clock, XCircle, UsersRound, Save
} from "lucide-react";
import { 
  createProject, updateProject, deleteProject,
  addCommitteeMember, removeCommitteeMember
} from "@/app/actions/projectActions";
import { useSession } from "next-auth/react";
import { hasAccess } from "@/lib/permissions";

const CustomSelect = ({ name, options, value, onChange, placeholder, disabled, required }) => {
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

  const selectedOption = options.find(o => o.value?.toString() === value?.toString());

  return (
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={dropdownRef}>
      <input type="hidden" name={name} value={value || ""} required={required} />
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-gray-50 dark:bg-white/5 border ${isOpen ? 'border-primary/50 ring-2 ring-primary/50' : 'border-gray-200 dark:border-white/10'} rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer transition-all duration-300`}
      >
        <span className={selectedOption ? 'text-gray-900 dark:text-white font-medium text-sm' : 'text-gray-400 dark:text-white/40 text-sm'}>
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
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#08130e] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden z-[60] shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 dark:ring-black/50"
          >
            <div className="max-h-60 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 dark:text-white/40 text-sm text-center">No options available</div>
              ) : (
                options.map(option => (
                  <div 
                    key={option.value}
                    onClick={() => {
                      onChange(option.value?.toString());
                      setIsOpen(false);
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all flex items-center justify-between mb-1 last:mb-0 ${value?.toString() === option.value?.toString() ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    {option.label}
                    {value?.toString() === option.value?.toString() && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getStatusConfig = (status) => {
  switch(status) {
    case 'APPROVED': return { color: 'emerald', icon: CheckCircle2, text: 'Approved' };
    case 'COMPLETED': return { color: 'blue', icon: Target, text: 'Completed' };
    case 'REJECTED': return { color: 'red', icon: XCircle, text: 'Rejected' };
    default: return { color: 'amber', icon: Clock, text: 'Pending' };
  }
};

export default function ProjectsClient({ initialProjects = [], departments = [], users = [] }) {
  const { data: session } = useSession();
  const [projects, setProjects] = useState(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canCreate = hasAccess(session?.user, 'projects', 'create');
  const canUpdate = hasAccess(session?.user, 'projects', 'update');
  const canDelete = hasAccess(session?.user, 'projects', 'delete');

  const [modal, setModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [committeeModal, setCommitteeModal] = useState({ isOpen: false, project: null });

  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("PENDING");

  const [selectedUserId, setSelectedUserId] = useState("");

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.department?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refreshData = () => window.location.reload();

  const handleOpenModal = (isEdit, data = null) => {
    setModal({ isOpen: true, isEdit, data });
    setSelectedDeptId(data?.departmentId?.toString() || "");
    setSelectedStatus(data?.status || "PENDING");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      departmentId: formData.get("departmentId"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      status: formData.get("status"),
    };

    let res;
    if (modal.isEdit) {
      res = await updateProject(modal.data?.id, data);
    } else {
      res = await createProject(data);
    }

    setLoading(false);
    if (res.success) {
      setModal({ isOpen: false, isEdit: false, data: null });
      refreshData();
    } else {
      setError(res.error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project? All associated committees, finances, and attendance will be deleted.")) return;
    const res = await deleteProject(id);
    if (res.success) refreshData();
    else alert("Failed to delete project: " + res.error);
  };

  const handleAddCommittee = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.target);
    const data = {
      projectId: committeeModal.project?.id,
      userId: formData.get("userId"),
      role: formData.get("role")
    };

    const res = await addCommitteeMember(data);
    setLoading(false);
    
    if (res.success) {
      setSelectedUserId("");
      refreshData();
    } else {
      setError(res.error);
    }
  };

  const handleRemoveCommittee = async (id) => {
    if (!confirm("Remove this user from the committee?")) return;
    const res = await removeCommitteeMember(id);
    if (res.success) refreshData();
    else alert("Failed to remove member: " + res.error);
  };

  const deptOptions = (departments || []).map(d => ({ value: d?.id, label: d?.name }));
  const statusOptions = [
    { value: "PENDING", label: "Pending (Menunggu Persetujuan)" },
    { value: "APPROVED", label: "Approved (Disetujui)" },
    { value: "COMPLETED", label: "Completed (Selesai)" },
    { value: "REJECTED", label: "Rejected (Ditolak)" },
  ];
  
  const availableUsers = (users || []).filter(u => 
    u && committeeModal.project?.committees && !committeeModal.project.committees.some(c => c?.userId === u.id)
  );
  const userOptions = availableUsers.map(u => ({ value: u?.id, label: `${u?.name} (${u?.role?.name?.replace("_", " ") ?? "No Role"})` }));

  return (
    <div className="w-full max-w-[1400px] mx-auto relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <FolderKanban className="w-8 h-8 text-primary" />
            Program Kerja (Projects)
          </h1>
          <p className="text-gray-500 dark:text-white/50 max-w-xl">
            Pusat kendali kegiatan operasional SRE. Manajemen kepanitiaan dan timeline proker.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/30" />
            <input 
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          {canCreate && (
            <button 
              onClick={() => handleOpenModal(false)}
              className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center backdrop-blur-md">
            <FolderKanban className="w-16 h-16 text-gray-500 dark:text-white/10 mb-4" />
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">No Projects Found</h3>
            <p className="text-gray-500 dark:text-white/40">Mulai dengan membuat Program Kerja baru.</p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const StatusIcon = getStatusConfig(project.status).icon;
            const statusColor = getStatusConfig(project.status).color;
            
            return (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#08130e] border border-gray-200/60 dark:border-white/10 p-6 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:shadow-none dark:hover:shadow-[0_0_40px_rgba(16,185,129,0.08)] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col h-full relative overflow-hidden"
            >
              {/* Decorative Card Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-x-10 -translate-y-10"></div>
              
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full flex items-center gap-2 border backdrop-blur-sm bg-${statusColor}-500/10 text-${statusColor}-600 dark:text-${statusColor}-400 border-${statusColor}-500/20 shadow-[0_0_10px_rgba(var(--tw-color-${statusColor}-500),0.1)]`}>
                  <StatusIcon className={`w-3.5 h-3.5`} />
                  {getStatusConfig(project.status).text}
                </div>
                
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-black/40 rounded-full shadow-sm dark:shadow-none border border-gray-100 dark:border-white/5 p-1">
                  {canUpdate && (
                    <button onClick={() => handleOpenModal(true, project)} className="p-1.5 text-gray-400 hover:text-primary transition-colors" title="Edit Project">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => handleDelete(project.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete Project">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Desc */}
              <div className="mb-6 flex-1 relative z-10">
                <h3 className="text-xl font-display font-black text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-primary transition-colors duration-300">{project.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">{project.description}</p>
              </div>

              {/* Meta Info */}
              <div className="flex flex-col gap-2 bg-gray-50/80 dark:bg-white/[0.03] p-4 rounded-2xl border border-gray-100 dark:border-white/5 mb-5 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="uppercase font-bold tracking-widest text-[9px] text-gray-400 dark:text-gray-500">Timeline</span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 px-2 py-1 rounded-md shadow-sm border border-gray-100 dark:border-white/5">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span>
                      {new Date(project.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="uppercase font-bold tracking-widest text-[9px] text-gray-400 dark:text-gray-500">Departemen</span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700 dark:text-gray-300">
                    <Target className="w-3 h-3 text-primary" />
                    <span>{project.department?.name ?? "—"}</span>
                  </div>
                </div>
              </div>

              {/* Committee Button */}
              <div className="relative z-10">
                <button 
                  onClick={() => setCommitteeModal({ isOpen: true, project })}
                  className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 dark:bg-white/5 hover:bg-primary hover:border-primary/50 dark:hover:bg-primary/20 border border-gray-200 dark:border-white/10 rounded-xl transition-all duration-300 group/btn"
                >
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-300 group-hover/btn:text-gray-900 dark:group-hover/btn:text-white transition-colors">
                    <UsersRound className="w-4 h-4 text-primary group-hover/btn:scale-110 transition-transform" />
                    Manajemen Kepanitiaan
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-white/10 shadow-sm rounded-md text-[10px] font-black text-gray-900 dark:text-white">
                    {project._count?.committees || 0}
                  </div>
                </button>
              </div>
            </motion.div>
          )})
        )}
      </div>

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {modal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setModal({ isOpen: false, isEdit: false, data: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#050e0a] border border-gray-200 dark:border-white/10 rounded-[32px] w-full max-w-2xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

              <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/10 flex justify-between items-center relative z-10 shrink-0">
                <div>
                  <h2 className="text-2xl font-display font-black tracking-tight text-gray-900 dark:text-white mb-1">
                    {modal.isEdit ? "Edit Program Kerja" : "Buat Program Kerja Baru"}
                  </h2>
                  <p className="text-sm font-medium text-gray-500 dark:text-white/50">Atur detail program kerja dan jadwal pelaksanaan.</p>
                </div>
                <button onClick={() => setModal({ isOpen: false, isEdit: false, data: null })} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10">
                {error && <div className="p-4 mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold flex items-center gap-2"><XCircle className="w-5 h-5" /> {error}</div>}
                
                <form id="project-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  
                  <div className="col-span-full">
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Nama Program Kerja</label>
                    <input name="title" type="text" required defaultValue={modal.data?.title} placeholder="Misal: SRE Mengajar 2026" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-white/20" />
                  </div>
                  
                  <div className="col-span-full">
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Deskripsi Kegiatan</label>
                    <textarea name="description" rows="3" required defaultValue={modal.data?.description} placeholder="Jelaskan secara singkat tujuan proker ini..." className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-white/20 resize-none" />
                  </div>

                  <div className="relative z-[60]">
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Departemen Penanggung Jawab</label>
                    <CustomSelect 
                      name="departmentId" 
                      options={deptOptions} 
                      value={selectedDeptId} 
                      onChange={setSelectedDeptId} 
                      placeholder="Pilih Departemen..." 
                      required 
                    />
                  </div>

                  <div className="relative z-[50]">
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Status Persetujuan</label>
                    <CustomSelect 
                      name="status" 
                      options={statusOptions} 
                      value={selectedStatus} 
                      onChange={setSelectedStatus} 
                      placeholder="Pilih Status..." 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Tanggal Mulai</label>
                    <input name="startDate" type="date" required defaultValue={modal.data?.startDate ? new Date(modal.data.startDate).toISOString().split('T')[0] : ""} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all dark:[color-scheme:dark]" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-white/50 mb-2">Tanggal Selesai (Opsional)</label>
                    <input name="endDate" type="date" defaultValue={modal.data?.endDate ? new Date(modal.data.endDate).toISOString().split('T')[0] : ""} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all dark:[color-scheme:dark]" />
                  </div>
                </form>
              </div>

              <div className="p-6 md:p-8 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col sm:flex-row justify-end gap-3 shrink-0 relative z-10">
                <button type="button" onClick={() => setModal({ isOpen: false, isEdit: false, data: null })} disabled={loading} className="px-6 py-3.5 rounded-2xl font-bold tracking-wide text-gray-500 dark:text-white/60 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm w-full sm:w-auto">
                  Batal
                </button>
                <button form="project-form" type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-black px-8 py-3.5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm w-full sm:w-auto">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {modal.isEdit ? "Simpan Perubahan" : "Buat Program Kerja"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMMITTEE MODAL */}
      <AnimatePresence>
        {committeeModal.isOpen && committeeModal.project && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setCommitteeModal({ isOpen: false, project: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#050e0a] border border-gray-200 dark:border-white/10 rounded-[32px] w-full max-w-3xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

              <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/10 flex justify-between items-center relative z-10 shrink-0">
                <div>
                  <h2 className="text-2xl font-display font-black tracking-tight text-gray-900 dark:text-white mb-1">Manajemen Kepanitiaan</h2>
                  <p className="text-sm font-medium text-gray-500 dark:text-white/50">Proker: <span className="text-primary font-bold">{committeeModal.project.title}</span></p>
                </div>
                <button onClick={() => setCommitteeModal({ isOpen: false, project: null })} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 md:p-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10">
                {error && <div className="p-4 mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold flex items-center gap-2"><XCircle className="w-5 h-5" /> {error}</div>}
                
                {/* Add Member Form */}
                {canUpdate && (
                  <form onSubmit={handleAddCommittee} className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-8 relative z-50">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white mb-4">Tambahkan Panitia Baru</h3>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-5 relative z-50">
                        <CustomSelect 
                          name="userId" 
                          options={userOptions} 
                          value={selectedUserId} 
                          onChange={setSelectedUserId} 
                          placeholder="Pilih Anggota..." 
                          required 
                        />
                      </div>
                      <div className="md:col-span-5">
                        <input name="role" type="text" required placeholder="Posisi (e.g. Ketua Pelaksana)" className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
                      </div>
                      <div className="md:col-span-2">
                        <button type="submit" disabled={loading} className="w-full h-full bg-primary/20 text-primary border border-primary/30 font-bold py-3.5 rounded-xl hover:bg-primary hover:text-black transition-all disabled:opacity-50 flex items-center justify-center">
                          {loading ? <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div> : "Tambah"}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Member List */}
                <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-white/50 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Daftar Panitia Saat Ini
                </h3>
                
                {committeeModal.project.committees.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl bg-gray-50/50 dark:bg-transparent">
                    <Users className="w-12 h-12 text-gray-300 dark:text-white/10 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-white/40 text-sm font-medium">Belum ada panitia yang ditambahkan.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {committeeModal.project.committees.map(member => (
                      <div key={member.id} className="bg-white dark:bg-white/5 shadow-sm border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg shadow-inner">
                            {member.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">{member.user?.name ?? "Deleted User"}</p>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded-md text-[10px] font-bold text-gray-600 dark:text-gray-300 tracking-wide uppercase">{member.role}</span>
                          </div>
                        </div>
                        {canUpdate && (
                          <button 
                            onClick={() => handleRemoveCommittee(member.id)}
                            className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100"
                            title="Hapus Anggota"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
