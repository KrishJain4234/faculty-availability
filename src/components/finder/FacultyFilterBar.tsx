import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CampusBlock, FacultyStatus } from '../../types';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Building2,
  BookOpen,
  UserCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const FacultyFilterBar: React.FC = () => {
  const { facultyFilter, setFacultyFilter, resetFacultyFilter, getComputedFaculty } = useAppStore();
  const allFaculty = getComputedFaculty();

  const departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'AI & Data Science',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const blocks: CampusBlock[] = ['C Block', 'B Block', 'A Block', 'D Block'];

  // Calculate live counts
  const inCabinCount = allFaculty.filter((f) => f.currentStatus === 'in_cabin').length;
  const inClassCount = allFaculty.filter((f) => f.currentStatus === 'in_class').length;
  const steppedOutCount = allFaculty.filter((f) => f.currentStatus === 'stepped_out').length;

  const isFiltered =
    Boolean(facultyFilter.search) ||
    facultyFilter.status !== 'all' ||
    facultyFilter.departments.length > 0 ||
    facultyFilter.blocks.length > 0;

  const handleDepartmentToggle = (dept: string) => {
    const exists = facultyFilter.departments.includes(dept);
    const updated = exists
      ? facultyFilter.departments.filter((d) => d !== dept)
      : [...facultyFilter.departments, dept];
    setFacultyFilter({ departments: updated });
  };

  const handleBlockToggle = (b: CampusBlock) => {
    const exists = facultyFilter.blocks.includes(b);
    const updated = exists
      ? facultyFilter.blocks.filter((block) => block !== b)
      : [...facultyFilter.blocks, b];
    setFacultyFilter({ blocks: updated });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Search and Status Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={facultyFilter.search}
            onChange={(e) => setFacultyFilter({ search: e.target.value })}
            placeholder="Search faculty (e.g. Harish Sir, Dr. Sharma), Cabin (e.g. C-302), or Subject..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
          />
          {facultyFilter.search && (
            <button
              onClick={() => setFacultyFilter({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/70 overflow-x-auto text-xs font-semibold shrink-0">
          <button
            onClick={() => setFacultyFilter({ status: 'all' })}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              facultyFilter.status === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({allFaculty.length})
          </button>

          <button
            onClick={() => setFacultyFilter({ status: 'in_cabin' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              facultyFilter.status === 'in_cabin'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-white/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>In Cabin ({inCabinCount})</span>
          </button>

          <button
            onClick={() => setFacultyFilter({ status: 'in_class' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              facultyFilter.status === 'in_class'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-white/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>In Class ({inClassCount})</span>
          </button>

          <button
            onClick={() => setFacultyFilter({ status: 'stepped_out' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              facultyFilter.status === 'stepped_out'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-white/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Stepped Out ({steppedOutCount})</span>
          </button>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            onClick={resetFacultyFilter}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Department Filter Pills */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium mr-1">Department:</span>
        {departments.map((dept) => {
          const isSelected = facultyFilter.departments.includes(dept);
          const shortLabel = dept
            .replace('Computer Science & Engineering', 'CSE')
            .replace('Information Technology', 'IT')
            .replace('Electronics & Communication', 'ECE')
            .replace('Mechanical Engineering', 'Mechanical')
            .replace('Civil Engineering', 'Civil');

          return (
            <button
              key={dept}
              onClick={() => handleDepartmentToggle(dept)}
              className={`px-2.5 py-1 rounded-lg transition-all border ${
                isSelected
                  ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {shortLabel}
            </button>
          );
        })}

        {/* Block Filter Pills */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">Cabin Block:</span>
          {blocks.map((b) => {
            const isSelected = facultyFilter.blocks.includes(b);
            return (
              <button
                key={b}
                onClick={() => handleBlockToggle(b)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                  isSelected
                    ? 'bg-purple-50 text-purple-700 border-purple-300'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {b.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
