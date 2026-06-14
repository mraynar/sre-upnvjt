"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Search, Filter, Calendar, FolderKanban, Newspaper, Presentation } from "lucide-react";

export default function LogsClient({ logs }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || log.type === filterType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type) => {
    switch(type) {
      case "project": return <FolderKanban className="w-5 h-5 text-primary" />;
      case "article": return <Newspaper className="w-5 h-5 text-blue-500" />;
      case "event": return <Presentation className="w-5 h-5 text-amber-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case "project": return "bg-primary/10 border-primary/20";
      case "article": return "bg-blue-500/10 border-blue-500/20";
      case "event": return "bg-amber-500/10 border-amber-500/20";
      default: return "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10";
    }
  };

  return (
    <div className="space-y-8 w-full max-w-[1400px] mx-auto pb-20">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2 tracking-tight">System Logs</h1>
        <p className="text-gray-500 dark:text-white/60">Monitor all system activities and events in real-time.</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm dark:shadow-none">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors shadow-sm dark:shadow-none"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setFilterType("all")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide whitespace-nowrap transition-colors ${filterType === "all" ? "bg-gray-900 text-white dark:bg-white dark:text-black shadow-md" : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/10"}`}
          >
            All Logs
          </button>
          <button 
            onClick={() => setFilterType("project")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide whitespace-nowrap transition-colors ${filterType === "project" ? "bg-primary text-[#050e0a] shadow-md shadow-primary/20" : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/10"}`}
          >
            Projects
          </button>
          <button 
            onClick={() => setFilterType("article")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide whitespace-nowrap transition-colors ${filterType === "article" ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/10"}`}
          >
            Articles
          </button>
          <button 
            onClick={() => setFilterType("event")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide whitespace-nowrap transition-colors ${filterType === "event" ? "bg-amber-500 text-white shadow-md shadow-amber-500/20" : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/10"}`}
          >
            Activities
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-[#08120e] border border-gray-100 dark:border-white/5 rounded-3xl p-6 md:p-8 min-h-[500px] shadow-sm dark:shadow-none">
        {filteredLogs.length > 0 ? (
          <div className="relative border-l-2 border-gray-100 dark:border-white/5 ml-4 md:ml-6 space-y-10 pb-4 pt-2">
            {filteredLogs.map((log, index) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-8 md:pl-10 group"
              >
                {/* Timeline Dot */}
                <div className="absolute w-4 h-4 bg-white dark:bg-[#08120e] border-4 border-gray-300 dark:border-white/20 rounded-full -left-[9px] top-1.5 group-hover:border-primary group-hover:scale-125 transition-all duration-300" />
                
                <div className="bg-gray-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getColor(log.type)}`}>
                        {getIcon(log.type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg tracking-tight">{log.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/60 text-[10px] font-bold uppercase tracking-widest">
                            {log.type}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-white/40 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(log.date).toLocaleString("id-ID", { 
                              day: 'numeric', month: 'long', year: 'numeric', 
                              hour: '2-digit', minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pl-[52px]">
                    <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed mb-3">
                      {log.desc}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/5 rounded-lg text-xs text-gray-500 dark:text-white/40">
                      <span className="font-medium">Action by:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{log.user}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/10">
              <Activity className="w-10 h-10 text-gray-300 dark:text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Logs Found</h3>
            <p className="text-gray-500 dark:text-white/50 max-w-md">
              There are no activities matching your search or filter criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
