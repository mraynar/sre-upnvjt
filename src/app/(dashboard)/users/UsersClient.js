"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Plus, Edit2, Trash2, X, Search, Shield, Building2, UserCircle, ChevronDown
} from "lucide-react";
import { 
  createUser, updateUser, deleteUser 
} from "@/app/actions/userActions";
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
      {/* Hidden input to make sure the standard HTML form submission works */}
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

export default function UsersClient({ initialUsers, roles, departments, divisions }) {
  const { data: session } = useSession();
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canCreate = hasAccess(session?.user, 'users', 'create');
  const canUpdate = hasAccess(session?.user, 'users', 'update');
  const canDelete = hasAccess(session?.user, 'users', 'delete');

  const [modal, setModal] = useState({ isOpen: false, isEdit: false, data: null });
  
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedDivId, setSelectedDivId] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.npm && u.npm.includes(searchQuery))
  );

  const availableDivisions = selectedDeptId 
    ? divisions.filter(d => d.departmentId === parseInt(selectedDeptId))
    : [];

  const refreshData = () => window.location.reload();

  const handleOpenModal = (isEdit, data = null) => {
    setModal({ isOpen: true, isEdit, data });
    setSelectedRoleId(data?.roleId?.toString() || "");
    setSelectedDeptId(data?.departmentId?.toString() || "");
    setSelectedDivId(data?.divisionId?.toString() || "");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      npm: formData.get("npm"),
      positionName: formData.get("positionName"),
      isActive: formData.getAll("isActive").includes("true"),
      roleId: formData.get("roleId"),
      departmentId: formData.get("departmentId"),
      divisionId: formData.get("divisionId"),
    };

    let res;
    if (modal.isEdit) {
      res = await updateUser(modal.data?.id, data);
    } else {
      res = await createUser(data);
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
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await deleteUser(id);
    if (res.success) refreshData();
    else alert("Failed to delete user: " + res.error);
  };

  const roleOptions = (roles || []).map(r => ({ value: r?.id, label: r?.name?.replace("_", " ") }));
  const deptOptions = (departments || []).map(d => ({ value: d?.id, label: d?.name }));
  const divOptions = (availableDivisions || []).map(d => ({ value: d?.id, label: d?.name }));

  return (
    <div className="w-full max-w-[1400px] mx-auto relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-white">
            <Users className="w-8 h-8 text-primary" />
            User Management
          </h1>
          <p className="text-white/50 max-w-xl">
            Manage members, roles, and access across the organization.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text"
              placeholder="Search users..."
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
              <span className="hidden sm:inline">Add User</span>
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead className="border-b border-white/10 bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Department</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <UserCircle className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/40">No users match your current filters.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-white font-bold tracking-wide text-sm">{user.name}</h3>
                          <p className="text-white/40 text-xs">{user.email}</p>
                          {user.npm && <p className="text-white/30 text-[10px] mt-0.5">NPM: {user.npm}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white/70 text-xs font-medium">
                          {user.role.name.replace("_", " ")}
                        </span>
                        {user.positionName && (
                          <span className="text-[10px] text-primary/70 font-semibold">{user.positionName}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white/80 text-sm font-medium">{user.department?.name || "-"}</span>
                        {user.division && <span className="text-white/40 text-xs">{user.division.name}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          INACTIVE
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        {canUpdate && (
                          <button 
                            onClick={() => handleOpenModal(true, user)} 
                            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button 
                            onClick={() => handleDelete(user.id)} 
                            className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER MODAL */}
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
                {modal.isEdit ? "Edit User" : "Add New User"}
              </h2>
              
              {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
                
                {/* Basic Info */}
                <div className="col-span-full">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 border-b border-white/10 pb-2">Basic Info</h3>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Full Name</label>
                  <input name="name" type="text" required defaultValue={modal.data?.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Email</label>
                  <input name="email" type="email" required defaultValue={modal.data?.email} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">NPM (NIM)</label>
                  <input name="npm" type="text" defaultValue={modal.data?.npm || ""} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Password</label>
                  <input name="password" type={modal.isEdit ? "password" : "text"} required={!modal.isEdit} placeholder={modal.isEdit ? "Leave blank to keep unchanged" : "Set password..."} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors" />
                </div>

                {/* Organization Structure */}
                <div className="col-span-full mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 border-b border-white/10 pb-2">Organization Structure</h3>
                </div>

                {/* --- COOL CUSTOM SELECTS --- */}
                <div className="relative z-50">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Role Level</label>
                  <CustomSelect 
                    name="roleId" 
                    options={roleOptions} 
                    value={selectedRoleId} 
                    onChange={setSelectedRoleId} 
                    placeholder="Select Role..." 
                    required 
                  />
                </div>

                <div className="relative z-[49]">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Specific Position (Optional)</label>
                  <input name="positionName" type="text" defaultValue={modal.data?.positionName || ""} placeholder="e.g. Kepala Departemen" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors" />
                </div>

                <div className="relative z-[48]">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Department</label>
                  <CustomSelect 
                    name="departmentId" 
                    options={[{ value: "", label: "No Department" }, ...deptOptions]} 
                    value={selectedDeptId} 
                    onChange={(val) => {
                      setSelectedDeptId(val);
                      setSelectedDivId("");
                    }} 
                    placeholder="Select Department..." 
                  />
                </div>

                <div className="relative z-[47]">
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Division</label>
                  <CustomSelect 
                    name="divisionId" 
                    options={[{ value: "", label: "No Division" }, ...divOptions]} 
                    value={selectedDivId} 
                    onChange={setSelectedDivId} 
                    placeholder="Select Division..." 
                    disabled={!selectedDeptId} 
                  />
                </div>
                {/* --------------------------- */}

                <div className="col-span-full flex items-center gap-3 mt-4">
                  <input type="hidden" name="isActive" value="false" />
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    id="isActive" 
                    value="true" 
                    defaultChecked={modal.isEdit ? modal.data?.isActive : true}
                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-white cursor-pointer">Account is Active</label>
                </div>

                <div className="col-span-full pt-4 mt-2 border-t border-white/10">
                  <button type="submit" disabled={loading} className="w-full bg-primary text-[#050e0a] font-bold py-3.5 rounded-xl hover:bg-primary-focus hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                    {loading ? "Saving..." : "Save User Account"}
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
