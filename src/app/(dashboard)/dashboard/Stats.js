"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { ChartLine } from "lucide-react";

const data = [
  { month: "Jan", users: 30 },
  { month: "Feb", users: 50 },
  { month: "Mar", users: 80 },
  { month: "Apr", users: 65 },
  { month: "Mei", users: 120 },
];

export default function ChartUsers() {
  return (
    <div className="w-full rounded-2xl bg-white dark:bg-[#08120e] shadow-sm p-4 sm:p-6 lg:p-8">
      
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <ChartLine className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
        <h3 className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-white">
          User Growth
        </h3>
      </div>

      {/* CHART */}
      <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            
            {/* GRID */}
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />

            {/* AXIS */}
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }} 
              stroke="#888"
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              stroke="#888"
            />

            {/* TOOLTIP */}
            <Tooltip 
              contentStyle={{ 
                borderRadius: "10px", 
                border: "none" 
              }} 
            />

            {/* LINE */}
            <Line
              type="monotone"
              dataKey="users"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}