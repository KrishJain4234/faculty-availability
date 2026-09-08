import React from 'react';
import { Building2, GraduationCap, Users, Clock3, UserCheck, BookOpen } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      value: '120+',
      label: 'Faculty Cabins Mapped',
      description: 'Fully indexed cabins across Block A, B, C and D wings',
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
      color: 'from-blue-500/10 to-indigo-500/5',
      badge: 'Cabins Indexed',
    },
    {
      value: '100%',
      label: 'Timetables Integrated',
      description: 'Synchronized with weekly department lecture schedules',
      icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
      color: 'from-indigo-500/10 to-purple-500/5',
      badge: 'Live Sync',
    },
    {
      value: '8,000+',
      label: 'Active Students',
      description: 'Finding professors for project doubts, counseling & approvals',
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      color: 'from-emerald-500/10 to-teal-500/5',
      badge: 'Campus-wide',
    },
    {
      value: 'Zero',
      label: 'Wasted Hallway Trips',
      description: 'Know if Harish Sir is in his cabin before you climb the stairs',
      icon: <Clock3 className="w-6 h-6 text-amber-600" />,
      color: 'from-amber-500/10 to-orange-500/5',
      badge: 'Time Saved',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1.5">
            Faculty & Cabin Intelligence
          </h2>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Connecting Students and Faculty Seamlessly
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-slate-200/90 shadow-xs hover:shadow-md transition-all relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-100">
                  {stat.icon}
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                  {stat.badge}
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-800 mt-1">
                {stat.label}
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
