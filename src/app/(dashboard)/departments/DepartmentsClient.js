"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Plus, Edit2, Trash2, ChevronDown, ChevronRight, X, FolderTree, Users
} from "lucide-react";
import { 
  createDepartment, updateDepartment, deleteDepartment, 
  createDivision, updateDivision, deleteDivision 
} from "@/app/actions/departmentActions";
import { useSession } from "next-auth/react";
import { hasAccess } from "@/lib/permissions";

export default function DepartmentsClient({ initialDepartments }) {
  const { data: session } = useSession();
  const [departments, setDepartments] = useState(initialDepartments);
  const [expandedDept, setExpandedDept] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canCreate = hasAccess(session?.user, 'departments', 'create');
  const canUpdate = hasAccess(session?.user, 'departments', 'update');
  const canDelete = hasAccess(session?.user, 'departments', 'delete');

  const [deptModal, setDeptModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [divModal, setDivModal] = useState({ isOpen: false, isEdit: false, data: null, deptId: null });


  const refreshData = async () => {
    window.location.reload();
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      code: formData.get("code")?.toUpperCase(),
      description: formData.get("description"),
    };

    let res;
    if (deptModal.isEdit) {
      res = await updateDepartment(deptModal.data?.id, data);
    } else {
      res = await createDepartment(data);
    }

    setLoading(false);
    if (res.success) {
      setDeptModal({ isOpen: false, isEdit: false, data: null });
      refreshData();
    } else {
      setError(res.error);
    }
  };

  const handleDivSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      departmentId: divModal.deptId
    };

    let res;
    if (divModal.isEdit) {
      res = await updateDivision(divModal.data?.id, data);
    } else {
      res = await createDivision(data);
    }

    setLoading(false);
    if (res.success) {
      setDivModal({ isOpen: false, isEdit: false, data: null, deptId: null });
      refreshData();
    } else {
      setError(res.error);
    }
  };

  const handleDeleteDept = async (id) => {
    if (!confirm("Are you sure you want to delete this department? All associated divisions will also be deleted.")) return;
    const res = await deleteDepartment(id);
    if (res.success) refreshData();
    else alert("Failed to delete department: " + res.error);
  };

  const handleDeleteDiv = async (id) => {
    if (!confirm("Are you sure you want to delete this division?")) return;
    const res = await deleteDivision(id);
    if (res.success) refreshData();
    else alert("Failed to delete division: " + res.error);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-white">
            <FolderTree className="w-8 h-8 text-primary" />
            Departments & Divisions
          </h1>
          <p className="text-white/50 max-w-xl">
            Manage the organizational structure of SRE UPNVJT.
          </p>
        </div>
        {canCreate && (
          <button 
            onClick={() => setDeptModal({ isOpen: true, isEdit: false, data: null })}
            className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-5 h-5" />
            Add Department
          </button>
        )}
      </div>

      {/* Departments List */}
      <div className="grid grid-cols-1 gap-6">
        {departments.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center backdrop-blur-md">
            <FolderTree className="w-16 h-16 text-white/10 mb-4" />
            <h3 className="text-xl font-display font-bold text-white mb-2">No Departments Found</h3>
            <p className="text-white/40">Start by adding a new department to build your organizational structure.</p>
          </div>
        ) : (
          departments.map((dept) => (
            <motion.div 
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm"
            >
              {/* Department Header */}
              <div 
                className="p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-transform ${expandedDept === dept.id ? 'rotate-90' : ''}`}>
                    <ChevronRight className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-white tracking-tight">{dept.name}</h2>
                    <p className="text-white/50 text-sm mt-1 max-w-2xl">{dept.description || "No description provided."}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-white/40 font-medium">
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {dept._count?.users || 0} Members</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                      <span>{dept.divisions?.length || 0} Divisions</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-4" onClick={e => e.stopPropagation()}>
                  {canUpdate && (
                    <button 
                      onClick={() => setDeptModal({ isOpen: true, isEdit: true, data: dept })}
                      className="p-2.5 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
                      title="Edit Department"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      onClick={() => handleDeleteDept(dept.id)}
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/10"
                      title="Delete Department"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Divisions Content */}
              <AnimatePresence>
                {expandedDept === dept.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 bg-[#030906]"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Divisions</h3>
                        {canUpdate && (
                          <button 
                            onClick={() => setDivModal({ isOpen: true, isEdit: false, data: null, deptId: dept.id })}
                            className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-focus flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" /> Add Division
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dept.divisions.length === 0 ? (
                          <div className="col-span-full py-8 text-center border border-dashed border-white/10 rounded-2xl">
                            <p className="text-white/30 text-sm">No divisions assigned to this department yet.</p>
                          </div>
                        ) : (
                          dept.divisions.map((div) => (
                            <div key={div.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors group relative">
                              <h4 className="font-bold text-white mb-1 pr-16">{div.name}</h4>
                              <p className="text-white/50 text-xs line-clamp-2">{div.description || "No description."}</p>
                              
                              <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
                                {canUpdate && (
                                  <button 
                                    onClick={() => setDivModal({ isOpen: true, isEdit: true, data: div, deptId: dept.id })}
                                    className="p-2 text-white/50 hover:text-white transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {canDelete && (
                                  <button 
                                    onClick={() => handleDeleteDiv(div.id)}
                                    className="p-2 text-white/50 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      {/* DEPARTMENT MODAL */}
      <AnimatePresence>
        {deptModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeptModal({ isOpen: false, isEdit: false, data: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a1f18] border border-white/10 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl"
            >
              <button onClick={() => setDeptModal({ isOpen: false, isEdit: false, data: null })} className="absolute top-6 right-6 text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                {deptModal.isEdit ? "Edit Department" : "Add Department"}
              </h2>
              
              {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
              
              <form onSubmit={handleDeptSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Department Name</label>
                  <input 
                    name="name" type="text" required defaultValue={deptModal.data?.name}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors"
                    placeholder="e.g. Badan Pengurus Harian"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Department Code</label>
                  <input 
                    name="code" type="text" required defaultValue={deptModal.data?.code}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors uppercase"
                    placeholder="e.g. BPH"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Description</label>
                  <textarea 
                    name="description" rows="3" defaultValue={deptModal.data?.description}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors resize-none"
                    placeholder="Brief description of the department's role..."
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={loading} className="w-full bg-primary text-[#050e0a] font-bold py-3.5 rounded-xl hover:bg-primary-focus hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                    {loading ? "Saving..." : "Save Department"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIVISION MODAL */}
      <AnimatePresence>
        {divModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDivModal({ isOpen: false, isEdit: false, data: null, deptId: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a1f18] border border-white/10 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl"
            >
              <button onClick={() => setDivModal({ isOpen: false, isEdit: false, data: null, deptId: null })} className="absolute top-6 right-6 text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                {divModal.isEdit ? "Edit Division" : "Add Division"}
              </h2>
              
              {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
              
              <form onSubmit={handleDivSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Division Name</label>
                  <input 
                    name="name" type="text" required defaultValue={divModal.data?.name}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors"
                    placeholder="e.g. Media & Information"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Description</label>
                  <textarea 
                    name="description" rows="3" defaultValue={divModal.data?.description}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors resize-none"
                    placeholder="Brief description..."
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={loading} className="w-full bg-primary text-[#050e0a] font-bold py-3.5 rounded-xl hover:bg-primary-focus hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                    {loading ? "Saving..." : "Save Division"}
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
