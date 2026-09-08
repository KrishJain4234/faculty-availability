import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { FacultyMember } from '../../types';
import { FacultyCard } from './FacultyCard';
import { UserCheck, Sparkles, Building2, SearchX, RotateCcw } from 'lucide-react';

interface FacultyGridProps {
  onOpenDetail: (faculty: FacultyMember) => void;
  onOpenNote: (faculty: FacultyMember) => void;
}

export const FacultyGrid: React.FC<FacultyGridProps> = ({
  onOpenDetail,
  onOpenNote,
}) => {
  const { getComputedFaculty, facultyFilter, resetFacultyFilter } = useAppStore();
  const allFaculty = getComputedFaculty();

  // Apply filters
  const filteredFaculty = allFaculty.filter((faculty) => {
    // 1. Search Query
    if (facultyFilter.search) {
      const q = facultyFilter.search.toLowerCase().trim();
      const matchName = faculty.name.toLowerCase().includes(q);
      const matchShort = faculty.shortName.toLowerCase().includes(q);
      const matchCabin = faculty.cabinNumber.toLowerCase().includes(q);
      const matchDept = faculty.department.toLowerCase().includes(q);
      const matchSubject = faculty.subjects.some((s) => s.toLowerCase().includes(q));

      if (!matchName && !matchShort && !matchCabin && !matchDept && !matchSubject) {
        return false;
      }
    }

    // 2. Status
    if (facultyFilter.status !== 'all') {
      if (faculty.currentStatus !== facultyFilter.status) {
        return false;
      }
    }

    // 3. Departments
    if (facultyFilter.departments.length > 0) {
      if (!facultyFilter.departments.includes(faculty.department)) {
        return false;
      }
    }

    // 4. Cabin Blocks
    if (facultyFilter.blocks.length > 0) {
      if (!facultyFilter.blocks.includes(faculty.cabinBlock)) {
        return false;
      }
    }

    return true;
  });

  const inCabinCount = filteredFaculty.filter((f) => f.currentStatus === 'in_cabin').length;

  return (
    <div className="space-y-4">
      {/* Grid Meta Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <div>
          Showing <span className="font-bold text-slate-900">{filteredFaculty.length}</span> Faculty Members
          {' • '}
          <span className="text-emerald-700 font-semibold">{inCabinCount} Available in Cabin Right Now</span>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Timetable Synchronized</span>
        </div>
      </div>

      {/* Grid Display */}
      {filteredFaculty.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Faculty Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No faculty members matched your current filter criteria. Try clearing search keywords or department filters.
          </p>
          <button
            onClick={resetFacultyFilter}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-sm hover:bg-blue-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFaculty.map((faculty) => (
            <FacultyCard
              key={faculty.id}
              faculty={faculty}
              onOpenDetail={onOpenDetail}
              onOpenNote={onOpenNote}
            />
          ))}
        </div>
      )}
    </div>
  );
};
