"use client";

import React, { useState } from "react";
import { ClipboardCheck, Calendar, Info, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

const STATUS_METADATA = {
  PRESENT: { label: "Hadir", color: "bg-green-500/15 text-green-400 border-green-500/25" },
  ABSENT:  { label: "Alpa", color: "bg-red-500/15 text-red-400 border-red-500/25" },
  LATE:    { label: "Terlambat", color: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
  EXCUSED: { label: "Izin/Sakit", color: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
};

export default function AbsensiClient({ initialAttendance }) {
  const [records] = useState(initialAttendance || []);

  // Compute stats for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyRecords = records.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const getCount = (status, currentOnly = true) => {
    const list = currentOnly ? monthlyRecords : records;
    return list.filter(r => r.status === status).length;
  };

  return (
    <div className="w-full relative pb-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-white">
          <ClipboardCheck className="w-8 h-8 text-primary animate-pulse" />
          Riwayat Kehadiran
        </h1>
        <p className="text-gray-400 max-w-xl font-light">
          Tinjau rekapitulasi kehadiran Anda pada agenda kegiatan rutin SRE UPNVJT.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          { key: "PRESENT", title: "Hadir Bulan Ini", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
          { key: "LATE", title: "Terlambat", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
          { key: "EXCUSED", title: "Izin / Sakit", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          { key: "ABSENT", title: "Alpa / Tanpa Keterangan", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
        ].map(card => (
          <div key={card.key} className={`p-5 rounded-3xl border backdrop-blur-md ${card.bg}`}>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{card.title}</span>
            <div className={`text-4xl font-black ${card.color}`}>{getCount(card.key, true)}</div>
            <span className="text-[9px] text-gray-500 font-semibold block mt-1">Total seluruhnya: {getCount(card.key, false)}x</span>
          </div>
        ))}
      </div>

      {/* Attendance History Table */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b border-white/5 bg-white/[0.02]">
              <tr>
                {["Tanggal Agenda", "Status", "Keterangan / Notes"].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center text-gray-500">
                    <ClipboardCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    Belum ada riwayat absensi tercatat
                  </td>
                </tr>
              ) : records.map(rec => (
                <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <span>
                        {new Date(rec.date).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border ${
                      STATUS_METADATA[rec.status]?.color || "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {STATUS_METADATA[rec.status]?.label || rec.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-sm truncate">
                    {rec.notes || <span className="opacity-30">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
