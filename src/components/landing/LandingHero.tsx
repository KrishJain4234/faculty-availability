import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Search, ArrowRight, Sparkles, Building2, Clock, CheckCircle2, BookOpen, ShieldAlert, Cpu } from 'lucide-react';
import { FacultyStatusBadge } from '../common/Badge';

export const LandingHero: React.FC = () => {
  const { setActiveView, getComputedFaculty, setSelectedFacultyId, setFacultyFilter } = useAppStore();
  const [heroSearch, setHeroSearch] = useState('');

  const allFaculty = getComputedFaculty();
  const inCabinCount = allFaculty.filter((f) => f.currentStatus === 'in_cabin').length;
  const inClassCount = allFaculty.filter((f) => f.currentStatus === 'in_class').length;

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFacultyFilter({ search: heroSearch });
    setActiveView('finder');
  };

  const previewFaculty = allFaculty.slice(0, 3);

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-blue-50/40 via-[#F8FAFC] to-[#F8FAFC]">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-blue-400/10 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-400/10 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tag */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Faculty Availability & Cabin Locator Engine</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Find Your Professors In Their{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
              Cabins in Seconds
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Stop wandering corridor to corridor facing locked faculty doors. FacultySync AI integrates teacher timetables so you immediately know whether <strong>Harish Sir</strong>, <strong>Dr. Sharma</strong>, and other professors are free in their cabin or lecturing in a classroom.
          </p>

          {/* Quick Search Bar & Action Buttons */}
          <div className="pt-3 max-w-2xl mx-auto">
            <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl shadow-premium border border-slate-200/90">
              <div className="relative flex-1 w-full flex items-center pl-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search faculty (e.g. Harish Sir, Dr. Sharma) or Cabin (e.g. C-302)..."
                  className="w-full px-3 py-2.5 text-sm bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm hover:shadow-glow-primary transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Locate Cabin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-slate-500">
              <span>Quick Faculty Shortcuts:</span>
              <button
                onClick={() => {
                  setFacultyFilter({ search: 'Harish' });
                  setActiveView('finder');
                }}
                className="hover:text-blue-600 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
              >
                Prof. Harish Sir (Cabin C-302)
              </button>
              <button
                onClick={() => {
                  setFacultyFilter({ search: 'Sharma' });
                  setActiveView('finder');
                }}
                className="hover:text-blue-600 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
              >
                Dr. Sharma (Cabin C-304)
              </button>
              <button
                onClick={() => {
                  setFacultyFilter({ search: 'Gupta' });
                  setActiveView('finder');
                }}
                className="hover:text-blue-600 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
              >
                Prof. Gupta (Cabin B-210)
              </button>
            </div>
          </div>
        </div>

        {/* Live Mini Preview Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {previewFaculty.map((f) => {
            const isInCabin = f.currentStatus === 'in_cabin';
            return (
              <div
                key={f.id}
                onClick={() => {
                  setFacultyFilter({ search: f.shortName });
                  setActiveView('finder');
                }}
                className="p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer text-left space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{f.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{f.shortName} • {f.department.split('&')[0]}</p>
                  </div>
                  <FacultyStatusBadge status={f.currentStatus} size="sm" />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>{f.cabinNumber}</span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-medium">{f.cabinBlock}</span>
                </div>

                <div className="text-[11px] font-semibold text-slate-600 line-clamp-1">
                  {f.statusMessage}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
