import React, { useState } from 'react';
import { FacultyMember, TimetableSlot } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { FacultyStatusBadge } from '../common/Badge';
import { getFacultyDailyTimeline } from '../../services/timetableEngine';
import {
  X,
  Building2,
  MapPin,
  Clock,
  Calendar,
  BookOpen,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Star,
  Layers,
  Sparkles,
} from 'lucide-react';

interface FacultyDetailModalProps {
  faculty: FacultyMember | null;
  onClose: () => void;
  onOpenNote: (faculty: FacultyMember) => void;
}

export const FacultyDetailModal: React.FC<FacultyDetailModalProps> = ({
  faculty,
  onClose,
  onOpenNote,
}) => {
  const { simulatedDay, timetableSlots, toggleFavoriteFaculty, setActiveView } = useAppStore();
  const [selectedDayTab, setSelectedDayTab] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');

  if (!faculty) return null;

  const isInCabin = faculty.currentStatus === 'in_cabin';
  const isInClass = faculty.currentStatus === 'in_class';

  // Get daily timeline for simulated day
  const dailyTimeline = getFacultyDailyTimeline(faculty, simulatedDay, timetableSlots);

  // Get all weekly slots for this faculty
  const weeklySlots = timetableSlots.filter((slot) => {
    if (slot.facultyId && slot.facultyId === faculty.id) return true;
    if (slot.teacherName && (
      slot.teacherName === faculty.name ||
      slot.teacherName.toLowerCase().includes(faculty.shortName.toLowerCase()) ||
      faculty.name.toLowerCase().includes(slot.teacherName.toLowerCase())
    )) {
      return true;
    }
    return false;
  });

  const selectedDaySlots = weeklySlots.filter((s) => s.day === selectedDayTab);

  const days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-md ${
                isInCabin
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                  : isInClass
                  ? 'bg-gradient-to-tr from-rose-600 to-red-500'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-500'
              }`}
            >
              {faculty.shortName
                .replace('Prof.', '')
                .replace('Dr.', '')
                .trim()
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {faculty.name}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                  {faculty.shortName}
                </span>
                <FacultyStatusBadge status={faculty.currentStatus} size="sm" />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                {faculty.title} • {faculty.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleFavoriteFaculty(faculty.id)}
              className={`p-2 rounded-xl border transition-colors ${
                faculty.isFavorite
                  ? 'bg-amber-50 border-amber-200 text-amber-500'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title="Bookmark Faculty"
            >
              <Star className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Cabin Location & Live Status Hero */}
          <div
            className={`p-5 rounded-2xl border ${
              isInCabin
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 border-emerald-200 text-emerald-950'
                : isInClass
                ? 'bg-gradient-to-r from-rose-50 to-red-50/50 border-rose-200 text-rose-950'
                : 'bg-gradient-to-r from-amber-50 to-orange-50/50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                    Assigned Cabin
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white font-extrabold text-blue-700 border border-slate-200">
                    {faculty.cabinNumber}
                  </span>
                </div>

                <div className="text-lg font-black mt-1">
                  {faculty.cabinNumber} • {faculty.cabinBlock} ({faculty.cabinFloor === 0 ? 'Ground' : `${faculty.cabinFloor}${faculty.cabinFloor === 1 ? 'st' : faculty.cabinFloor === 2 ? 'nd' : 'rd'}`} Floor)
                </div>

                <p className="text-xs font-medium mt-1 opacity-90">
                  {faculty.statusMessage}
                </p>
              </div>

              {/* Action: Leave note button */}
              <button
                onClick={() => {
                  onClose();
                  onOpenNote(faculty);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Leave Cabin Note</span>
              </button>
            </div>

            {/* Cabin Notice Note if any */}
            {faculty.cabinNotes && (
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-start gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Faculty Cabin Notice: </span>
                  <span>{faculty.cabinNotes}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Cabin Contact & Office Hours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-slate-400 font-semibold mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Office Hours</span>
              </div>
              <p className="font-bold text-slate-800">{faculty.officeHours}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-slate-400 font-semibold mb-1">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Cabin Intercom</span>
              </div>
              <p className="font-bold text-slate-800">{faculty.phoneExt}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-slate-400 font-semibold mb-1">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Email Address</span>
              </div>
              <p className="font-bold text-slate-800 truncate">{faculty.email}</p>
            </div>
          </div>

          {/* TODAY'S HOURLY SCHEDULE TIMELINE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Today's Live Schedule Timeline ({simulatedDay})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Live Status Computed from Timetable
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {dailyTimeline.slice(1, 10).map((slot) => {
                const isLecture = slot.type !== 'cabin';
                return (
                  <div
                    key={slot.hourLabel}
                    className={`p-2.5 rounded-xl border text-xs transition-all ${
                      isLecture
                        ? 'bg-rose-50 border-rose-200 text-rose-900 font-medium'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
                    }`}
                  >
                    <div className="font-bold text-[11px] opacity-75">{slot.hourLabel}</div>
                    <div className="font-bold mt-1 truncate">
                      {isLecture ? slot.location : faculty.cabinNumber}
                    </div>
                    <div className="text-[10px] truncate opacity-90 mt-0.5">
                      {isLecture ? slot.slot?.subject : 'In Cabin'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FULL WEEKLY TIMETABLE SCHEDULE */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Full Weekly Teaching Timetable
                </h3>
              </div>
            </div>

            {/* Day Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDayTab(d)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedDayTab === d
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Slots for selected day */}
            {selectedDaySlots.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No scheduled lectures on {selectedDayTab}. Faculty is available in {faculty.cabinNumber} during official hours.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDaySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{slot.subject}</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold text-[10px]">
                          {slot.code}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-medium">{slot.batch}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Classroom: <strong className="text-slate-700">Room {slot.roomId.toUpperCase()}</strong> ({slot.type})
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-blue-700">
                        {slot.startTime} – {slot.endTime}
                      </div>
                      <span className="text-[10px] text-slate-400">Lecture Period</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/80 rounded-b-3xl flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              setActiveView('map');
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <MapPin className="w-4 h-4" />
            <span>Locate {faculty.cabinNumber} on Campus Map</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-xs text-slate-800 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
