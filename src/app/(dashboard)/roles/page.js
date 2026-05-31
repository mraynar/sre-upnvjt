"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Shield, X, Save } from "lucide-react";

const availableModules = [
  "overview", "users", "roles", "departments", "projects", 
  "attendance", "finance", "inventory", "documents", 
  "articles", "activities", "merchandise", "settings"
];
const actions = ["create", "read", "update", "delete"];

export default function RolesManagementPage() {
  const { data: session } = useSession();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ name: "", permissions: {} });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roles");
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({ name: role.name, permissions: role.permissions || {} });
    } else {
      setEditingRole(null);
      setFormData({ name: "", permissions: {} });
    }
    setIsModalOpen(true);
  };

  const handlePermissionChange = (module, action) => {
    const newPerms = { ...formData.permissions };
    if (!newPerms[module]) newPerms[module] = [];
    
    if (newPerms[module].includes(action)) {
      newPerms[module] = newPerms[module].filter(a => a !== action);
    } else {
      newPerms[module].push(action);
    }
    
    setFormData({ ...formData, permissions: newPerms });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = editingRole ? `/api/roles/${editingRole.id}` : "/api/roles";
    const method = editingRole ? "PUT" : "POST";
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchRoles();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      const res = await fetch(`/api/roles/${id}`, { method: "DELETE" });
      if (res.ok) fetchRoles();
    } catch (error) {
      console.error(error);
    }
  };

  if (session?.user?.roleName !== "SUPER_ADMIN") {
    return <div className="p-10 text-center text-red-500">Access Denied. Super Admin only.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Roles & Permissions
          </h1>
          <p className="text-white/50">Manage access levels and module permissions for all staff.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-xl font-bold tracking-wide flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Create Role
        </button>
      </div>

      {/* Roles Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] text-left">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Role Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Active Users</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Configured Permissions</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10 text-white/30">Loading...</td></tr>
            ) : roles.map((role) => (
              <tr key={role.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase ${role.name === 'SUPER_ADMIN' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/10 text-white/80'}`}>
                    {role.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/70 font-medium">
                  {role._count?.users || 0} Users
                </td>
                <td className="px-6 py-4 text-white/50 text-sm">
                  {Object.keys(role.permissions || {}).length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {Object.keys(role.permissions).map(mod => (
                        <span key={mod} className="text-[10px] uppercase bg-white/5 border border-white/10 px-2 py-1 rounded">
                          {mod}: {role.permissions[mod].length} rules
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="italic">No permissions configured</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleOpenModal(role)} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {role.name !== "SUPER_ADMIN" && (
                    <button onClick={() => handleDelete(role.id)} className="p-2 text-red-400/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[#07130e] border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-xl font-display font-bold tracking-tight">
                  {editingRole ? "Edit Role Permissions" : "Create New Role"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="mb-8">
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Role Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    disabled={editingRole?.name === "SUPER_ADMIN"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary disabled:opacity-50"
                    placeholder="e.g. Finance Staff"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-4 font-bold flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Granular Permissions (ABAC)
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableModules.map(module => (
                      <div key={module} className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h4 className="font-bold text-primary uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          {module}
                        </h4>
                        <div className="flex gap-2 flex-wrap">
                          {actions.map(action => {
                            const isSelected = formData.permissions[module]?.includes(action);
                            return (
                              <button
                                key={action}
                                onClick={() => handlePermissionChange(module, action)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${isSelected ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                              >
                                {action}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold tracking-wide text-white/60 hover:text-white hover:bg-white/5">
                  Cancel
                </button>
                <button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-black px-6 py-2.5 rounded-xl font-bold tracking-wide flex items-center gap-2 transition-all">
                  <Save className="w-4 h-4" /> Save Role
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
