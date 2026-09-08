import React, { useState } from 'react';
import {
  mockHourlyOccupancy,
  mockBlockUtilization,
  mockRoomLeaderboard,
  mockHeatmapData,
} from '../../data/mockAnalytics';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Layers,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Download,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'weekly' | 'semester'>('weekly');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Campus Real Estate Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Classroom Occupancy & Utilization Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data-driven insights to eliminate campus overcrowding and optimize timetable allocations.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setSelectedTimeframe('today')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTimeframe === 'today' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Today (Live)
          </button>
          <button
            onClick={() => setSelectedTimeframe('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTimeframe === 'weekly' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedTimeframe('semester')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTimeframe === 'semester' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Semester Avg
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Peak Occupancy Hour
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">11:00 AM</div>
          <div className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>83% campus rooms occupied</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Most Utilized Block
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">D Block (AI)</div>
          <div className="text-xs text-purple-700 font-semibold flex items-center gap-1 mt-1">
            <span>75% avg weekly utilization</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Avg Campus Utilization
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">56.2%</div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <span>Healthy baseline capacity</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Daily Vacant Hours
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">78.5 Hrs</div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Available for self-study & clubs
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Peak Occupancy Line Chart + Block Utilization Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peak Occupancy Hours Line Graph */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Campus Occupancy Curve Throughout Day</h3>
              <p className="text-xs text-slate-500">Hourly percentage of occupied classrooms (8 AM - 6 PM)</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              Line Chart
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHourlyOccupancy} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Occupancy Rate']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="occupancyPercentage"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2563EB' }}
                  activeDot={{ r: 6, fill: '#1D4ED8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Block Utilization Comparison Bar Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Block-by-Block Utilization Rate</h3>
              <p className="text-xs text-slate-500">Comparative capacity utilization across A, B, C, and D Blocks</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Bar Chart
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockBlockUtilization} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="block" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Utilization']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="utilizationRate" radius={[8, 8, 0, 0]}>
                  {mockBlockUtilization.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.block === 'D Block'
                          ? '#8B5CF6'
                          : entry.block === 'C Block'
                          ? '#2563EB'
                          : entry.block === 'A Block'
                          ? '#F59E0B'
                          : '#10B981'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Weekly Occupancy Heatmap */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Weekly Schedule Intensity Heatmap</h3>
            <p className="text-xs text-slate-500">Day-by-hour campus occupancy density</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-100 rounded"></span> Free (&lt;35%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-400 rounded"></span> Medium (35-70%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-700 rounded"></span> Rush (70%+)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-2 px-3 text-left">Day</th>
                <th className="py-2 px-3">9 AM</th>
                <th className="py-2 px-3">10 AM</th>
                <th className="py-2 px-3">11 AM</th>
                <th className="py-2 px-3">12 PM</th>
                <th className="py-2 px-3">1 PM (Lunch)</th>
                <th className="py-2 px-3">2 PM</th>
                <th className="py-2 px-3">3 PM</th>
                <th className="py-2 px-3">4 PM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockHeatmapData.map((row) => (
                <tr key={row.day}>
                  <td className="py-3 px-3 font-bold text-slate-800 text-left">{row.day}</td>
                  {(['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'] as const).map(
                    (slot) => {
                      const val = row[slot];
                      const bgClass =
                        val >= 75
                          ? 'bg-blue-600 text-white font-bold'
                          : val >= 50
                          ? 'bg-blue-300 text-blue-900 font-semibold'
                          : val >= 30
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-50 text-emerald-800';

                      return (
                        <td key={slot} className="py-2.5 px-2">
                          <div className={`py-1.5 rounded-lg text-xs transition-all ${bgClass}`}>
                            {val}%
                          </div>
                        </td>
                      );
                    }
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leaderboard: Most Used vs Least Used Classrooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Most Used */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Highest Demand Rooms (Overloaded)</h3>
              <p className="text-xs text-slate-500">Rooms with maximum scheduled class hours</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {mockRoomLeaderboard.mostUsed.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{item.roomName}</span>
                  <p className="text-slate-500 text-[11px]">{item.block}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-rose-600">{item.utilization}</span>
                  <p className="text-slate-400 text-[11px]">{item.weeklyHours} hrs/week</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Least Used */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Underutilized Rooms (Ideal for Study)</h3>
              <p className="text-xs text-slate-500">Rooms with highest weekly vacancy hours</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {mockRoomLeaderboard.leastUsed.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{item.roomName}</span>
                  <p className="text-slate-500 text-[11px]">{item.block}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600">{item.utilization}</span>
                  <p className="text-slate-400 text-[11px]">{item.weeklyHours} hrs/week</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
