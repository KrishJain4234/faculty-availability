import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { FacultyMember } from '../../types';
import { FacultyStatusBadge } from '../common/Badge';
import {
  GraduationCap,
  Star,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  BookOpen,
  Building2,
  MessageSquare,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface StudentDashboardProps {
  onOpenDetail: (faculty: FacultyMember) => void;
  onOpenNote: (faculty: FacultyMember) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenDetail,
  onOpenNote,
}) => {
  const { getComputedFaculty, studentNotes, setSelectedFacultyId, setActiveView } = useAppStore();
  const allFaculty = getComputedFaculty();

  const favoriteFaculty = allFaculty.filter((f) => f.isFavorite);
  const inCabinFaculty = allFaculty.filter((f) => f.currentStatus === 'in_cabin');

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-premium relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Faculty Availability Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Find Your Professors In Their Cabins
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Never walk all the way to a faculty cabin only to find a locked door. FacultySync AI synchronizes faculty weekly timetables so you always know if Harish Sir or your professors are in their cabin or teaching in a lecture hall.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setActiveView('finder')}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-sm hover:bg-blue-50 transition-all flex items-center gap-1.5"
            >
              <span>Explore All Faculty Cabins</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveView('map')}
              className="px-4 py-2.5 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white font-semibold text-xs border border-blue-400/40 transition-all"
            >
              Campus Wing Map
            </button>
          </div>
        </div>
      </div>

      {/* Bookmarked / Pinned Faculty Members */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h3 className="text-base font-bold text-slate-900">Your Pinned Faculty</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {favoriteFaculty.length} Pinned
          </span>
        </div>

        {favoriteFaculty.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
            No faculty pinned yet. Click the star icon on any faculty card to pin them here for rapid cabin tracking!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteFaculty.map((faculty) => (
              <div
                key={faculty.id}
                onClick={() => onOpenDetail(faculty)}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {faculty.name} ({faculty.shortName})
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {faculty.department}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-extrabold text-xs">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{faculty.cabinNumber}</span>
                    </div>
                  </div>
                  <FacultyStatusBadge status={faculty.currentStatus} size="sm" />
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 truncate max-w-[170px]">
                    {faculty.statusMessage}
                  </span>
                  <span className="text-blue-600 font-bold flex items-center gap-1">
                    Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available in Cabin Right Now (Quick Walk-in Doubts) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Free in Cabin Right Now ({inCabinFaculty.length})
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Open for Doubt Clearance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {inCabinFaculty.slice(0, 4).map((f) => (
            <div
              key={f.id}
              onClick={() => onOpenDetail(f)}
              className="p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50/50 transition-all cursor-pointer"
            >
              <div className="font-bold text-slate-900 text-sm">{f.name}</div>
              <div className="text-[11px] text-slate-500">{f.shortName}</div>
              <div className="mt-2 text-xs font-bold text-emerald-800">
                {f.cabinNumber}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Floor {f.cabinFloor} • {f.cabinBlock}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Cabin Notes / Messages Left */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Your Sent Cabin Door Messages ({studentNotes.length})
            </h3>
          </div>
        </div>

        <div className="space-y-2.5">
          {studentNotes.map((note) => (
            <div
              key={note.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">To: {note.facultyName}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-blue-700">{note.subject}</span>
                </div>
                <p className="text-slate-600 mt-0.5 line-clamp-1">{note.message}</p>
              </div>
              <span className="text-slate-400 text-[11px] shrink-0 font-medium">
                Sent at {note.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
