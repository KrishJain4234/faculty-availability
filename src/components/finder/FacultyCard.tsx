import React from 'react';
import { FacultyMember } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { FacultyStatusBadge } from '../common/Badge';
import {
  Clock,
  MapPin,
  Star,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Building2,
  Mail,
  Compass,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface FacultyCardProps {
  faculty: FacultyMember;
  onOpenDetail: (faculty: FacultyMember) => void;
  onOpenNote: (faculty: FacultyMember) => void;
}

export const FacultyCard: React.FC<FacultyCardProps> = ({
  faculty,
  onOpenDetail,
  onOpenNote,
}) => {
  const { toggleFavoriteFaculty } = useAppStore();

  const isInCabin = faculty.currentStatus === 'in_cabin';
  const isInClass = faculty.currentStatus === 'in_class';
  const isSteppedOut = faculty.currentStatus === 'stepped_out';

  // Get initials for avatar badge
  const initials = faculty.shortName
    .replace('Prof.', '')
    .replace('Dr.', '')
    .trim()
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const cardBorderClass = isInCabin
    ? 'border-emerald-200/90 hover:border-emerald-300 shadow-sm hover:shadow-md'
    : isInClass
    ? 'border-rose-200/90 hover:border-rose-300 shadow-sm hover:shadow-md'
    : isSteppedOut
    ? 'border-amber-200/90 hover:border-amber-300'
    : 'border-slate-200 hover:border-slate-300';

  return (
    <div
      className={`bg-white rounded-2xl border ${cardBorderClass} transition-all duration-200 flex flex-col justify-between overflow-hidden group`}
    >
      {/* Card Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            {/* Avatar Badge */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0 ${
                isInCabin
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                  : isInClass
                  ? 'bg-gradient-to-tr from-rose-600 to-red-500'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-500'
              }`}
            >
              {initials}
            </div>

            {/* Name, Title & Dept */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  onClick={() => onOpenDetail(faculty)}
                  className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer truncate"
                >
                  {faculty.name}
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-100 shrink-0">
                  {faculty.shortName}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-0.5 truncate font-medium">
                {faculty.title} • {faculty.department}
              </p>
            </div>
          </div>

          {/* Top Right: Status Badge & Favorite Bookmark */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => toggleFavoriteFaculty(faculty.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                faculty.isFavorite
                  ? 'bg-amber-50 border-amber-200 text-amber-500'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title={faculty.isFavorite ? 'Remove from pinned faculty' : 'Pin faculty'}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
            <FacultyStatusBadge status={faculty.currentStatus} size="sm" />
          </div>

        </div>

        {/* CABIN LOCATION HIGHLIGHT BADGE */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Cabin:</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-blue-700 font-extrabold text-xs">
              {faculty.cabinNumber}
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              ({faculty.cabinBlock}, {faculty.cabinFloor === 0 ? 'Ground' : `${faculty.cabinFloor}${faculty.cabinFloor === 1 ? 'st' : faculty.cabinFloor === 2 ? 'nd' : 'rd'}`} Floor)
            </span>
          </div>

          <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium">
            {faculty.phoneExt}
          </span>
        </div>

        {/* LIVE TIMETABLE STATUS BANNER */}
        <div
          className={`mt-3 p-3 rounded-xl border transition-all ${
            isInCabin
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
              : isInClass
              ? 'bg-rose-50/70 border-rose-200/80 text-rose-900'
              : 'bg-amber-50/70 border-amber-200/80 text-amber-900'
          }`}
        >
          {/* Status Message Line */}
          <div className="flex items-start gap-2">
            {isInCabin && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
            {isInClass && <BookOpen className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
            {isSteppedOut && <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs">
              <div className="font-bold">
                {isInCabin && 'Currently in Cabin • Free for Students'}
                {isInClass && `Busy in Class • Teaching in Room ${faculty.currentClass?.roomName}`}
                {isSteppedOut && 'Stepped Out Temporarily'}
              </div>

              <div className="text-[11px] mt-0.5 leading-snug opacity-90">
                {isInCabin && (
                  <>
                    <span>{faculty.statusMessage}</span>
                    {faculty.nextClass && (
                      <span className="block mt-1 text-emerald-800 font-medium">
                        Next Lecture: <strong>{faculty.nextClass.subject}</strong> at {faculty.nextClass.startsAt} in Room {faculty.nextClass.roomName} ({faculty.nextClass.startsInMinutes}m away)
                      </span>
                    )}
                  </>
                )}

                {isInClass && faculty.currentClass && (
                  <>
                    <p className="font-medium">
                      Subject: <strong>{faculty.currentClass.subject}</strong> ({faculty.currentClass.batch})
                    </p>
                    <p className="mt-1 font-semibold text-rose-800">
                      Returns to {faculty.cabinNumber} at {faculty.currentClass.endsAt} ({faculty.currentClass.endsInMinutes} mins left)
                    </p>
                  </>
                )}

                {isSteppedOut && (
                  <span>Faculty is within department wing. Will return to cabin shortly.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subjects taught */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {faculty.subjects.slice(0, 2).map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
            >
              <BookOpen className="w-3 h-3 text-slate-400" />
              {subject}
            </span>
          ))}
          {faculty.subjects.length > 2 && (
            <span className="text-[10px] text-slate-400 px-1 py-0.5">
              +{faculty.subjects.length - 2} more
            </span>
          )}
        </div>

      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Quick Leave Note Button */}
        <button
          onClick={() => onOpenNote(faculty)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-xs"
          title="Leave a message or meeting query at cabin"
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          <span>Leave Cabin Note</span>
        </button>

        {/* View Full Timetable & Cabin Location */}
        <button
          onClick={() => onOpenDetail(faculty)}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/80 border border-blue-200/60 transition-colors"
        >
          <span>View Timetable & Cabin</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
