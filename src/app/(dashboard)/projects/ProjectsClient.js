"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderKanban, Plus, Edit2, Trash2, X, Search, Calendar, Users, Target, ChevronDown, CheckCircle2, Clock, XCircle, UsersRound
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
        className={`w-full bg-white/5 border ${isOpen ? 'border-primary/50 bg-white/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-white/10'} rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer transition-all duration-300`}
      >
        <span className={selectedOption ? 'text-white font-medium' : 'text-white/40'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#0a1f18] border border-white/10 rounded-xl overflow-hidden z-[60] shadow-2xl backdrop-blur-2xl ring-1 ring-black/50"
          >
            <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-white/40 text-sm text-center">No options available</div>
              ) : (
                options.map(option => (
                  <div 
                    key={option.value}
                    onClick={() => {
                      onChange(option.value?.toString());
                      setIsOpen(false);
                    }}
                    className={`px-4 py-3 rounded-lg text-sm cursor-pointer transition-all flex items-center justify-between ${value?.toString() === option.value?.toString() ? 'bg-primary/20 text-primary font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
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
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-white">
            <FolderKanban className="w-8 h-8 text-primary" />
            Program Kerja (Projects)
          </h1>
          <p className="text-white/50 max-w-xl">
            Pusat kendali kegiatan operasional SRE. Manajemen kepanitiaan dan timeline proker.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
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
          <div className="col-span-full bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center backdrop-blur-md">
            <FolderKanban className="w-16 h-16 text-white/10 mb-4" />
            <h3 className="text-xl font-display font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-white/40">Mulai dengan membuat Program Kerja baru.</p>
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
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm relative group hover:bg-white/[0.04] transition-all flex flex-col h-full"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1.5 rounded-lg bg-${statusColor}-500/10 border border-${statusColor}-500/20 flex items-center gap-2`}>
                  <StatusIcon className={`w-4 h-4 text-${statusColor}-400`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest text-${statusColor}-400`}>
                    {getStatusConfig(project.status).text}
                  </span>
                </div>
                
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {canUpdate && (
                    <button onClick={() => handleOpenModal(true, project)} className="p-2 text-white/50 hover:text-white" title="Edit Project">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => handleDelete(project.id)} className="p-2 text-white/50 hover:text-red-400" title="Delete Project">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Desc */}
              <div className="mb-6 flex-1">
                <h3 className="text-xl font-display font-black text-white leading-tight mb-2">{project.title}</h3>
                <p className="text-white/40 text-xs line-clamp-2">{project.description}</p>
              </div>

              {/* Meta Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <Target className="w-4 h-4" />
                  <span>{project.department?.name ?? "—"}</span>
                </div>
              </div>

              {/* Committee Button */}
              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => setCommitteeModal({ isOpen: true, project })}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors group/btn"
                >
                  <div className="flex items-center gap-3 text-sm font-medium text-white/80 group-hover/btn:text-white">
                    <UsersRound className="w-4 h-4 text-primary" />
                    Manajemen Kepanitiaan
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-md text-xs font-bold text-white">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setModal({ isOpen: false, isEdit: false, data: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a1f18] border border-white/10 rounded-3xl p-8 w-full max-w-2xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              <button onClick={() => setModal({ isOpen: false, isEdit: false, data: null })} className="absolute top-6 right-6 text-white/50 hover:text-white z-50">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                {modal.isEdit ? "Edit Program Kerja" : "Buat Program Kerja Baru"}
              </h2>
              
              {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
                
                <div className="col-span-full">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Nama Program Kerja</label>
                  <input name="title" type="text" required defaultValue={modal.data?.title} placeholder="Misal: SRE Mengajar 2026" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors" />
                </div>
                
                <div className="col-span-full">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Deskripsi Kegiatan</label>
                  <textarea name="description" rows="3" required defaultValue={modal.data?.description} placeholder="Jelaskan secara singkat tujuan proker ini..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors resize-none" />
                </div>

                <div className="relative z-50">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Departemen Penanggung Jawab</label>
                  <CustomSelect 
                    name="departmentId" 
                    options={deptOptions} 
                    value={selectedDeptId} 
                    onChange={setSelectedDeptId} 
                    placeholder="Pilih Departemen..." 
                    required 
                  />
                </div>

                <div className="relative z-50">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Status Persetujuan</label>
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
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Tanggal Mulai</label>
                  <input name="startDate" type="date" required defaultValue={modal.data?.startDate ? new Date(modal.data.startDate).toISOString().split('T')[0] : ""} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors [color-scheme:dark]" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Tanggal Selesai (Opsional)</label>
                  <input name="endDate" type="date" defaultValue={modal.data?.endDate ? new Date(modal.data.endDate).toISOString().split('T')[0] : ""} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors [color-scheme:dark]" />
                </div>

                <div className="col-span-full pt-4 mt-2 border-t border-white/10">
                  <button type="submit" disabled={loading} className="w-full bg-primary text-[#050e0a] font-bold py-3.5 rounded-xl hover:bg-primary-focus hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                    {loading ? "Menyimpan..." : "Simpan Program Kerja"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMMITTEE MODAL */}
      <AnimatePresence>
        {committeeModal.isOpen && committeeModal.project && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setCommitteeModal({ isOpen: false, project: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a1f18] border border-white/10 rounded-3xl w-full max-w-3xl relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/10 shrink-0 relative">
                <button onClick={() => setCommitteeModal({ isOpen: false, project: null })} className="absolute top-8 right-8 text-white/50 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Manajemen Kepanitiaan</h2>
                <p className="text-white/50">Proker: <span className="text-primary font-medium">{committeeModal.project.title}</span></p>
              </div>
              
              <div className="p-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
                
                {/* Add Member Form */}
                {canUpdate && (
                  <form onSubmit={handleAddCommittee} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative z-50">
                    <h3 className="text-sm font-bold text-white mb-4">Tambahkan Panitia Baru</h3>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-6 relative z-50">
                        <CustomSelect 
                          name="userId" 
                          options={userOptions} 
                          value={selectedUserId} 
                          onChange={setSelectedUserId} 
                          placeholder="Pilih Anggota..." 
                          required 
                        />
                      </div>
                      <div className="md:col-span-4">
                        <input name="role" type="text" required placeholder="Posisi (e.g. Ketua Pelaksana)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors" />
                      </div>
                      <div className="md:col-span-2">
                        <button type="submit" disabled={loading} className="w-full h-full bg-primary/20 text-primary border border-primary/30 font-bold py-3.5 rounded-xl hover:bg-primary hover:text-[#050e0a] transition-all disabled:opacity-50">
                          {loading ? "..." : "Tambah"}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Member List */}
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/50" /> Daftar Panitia Saat Ini
                </h3>
                
                {committeeModal.project.committees.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-white/10 rounded-2xl">
                    <p className="text-white/30 text-sm">Belum ada panitia yang ditambahkan.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {committeeModal.project.committees.map(member => (
                      <div key={member.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                            {member.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white leading-none mb-1">{member.user?.name ?? "Deleted User"}</p>
                            <p className="text-xs text-primary font-medium">{member.role}</p>
                          </div>
                        </div>
                        {canUpdate && (
                          <button 
                            onClick={() => handleRemoveCommittee(member.id)}
                            className="p-2 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
