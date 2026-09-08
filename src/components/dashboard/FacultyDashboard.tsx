import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Room, FacultyStatus } from '../../types';
import { FacultyStatusBadge } from '../common/Badge';
import {
  UserCheck,
  CalendarCheck,
  BookOpen,
  Clock,
  CheckCircle2,
  Building2,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Coffee,
  Briefcase,
  CalendarOff,
  RotateCcw,
} from 'lucide-react';

interface FacultyDashboardProps {
  onOpenReserve: (room: Room) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onOpenReserve }) => {
  const {
    facultyName,
    setFacultyName,
    timetableSlots,
    facultyList,
    facultyOverrides,
    setFacultyOverride,
    studentNotes,
    simulatedDay,
    simulatedTime,
    getComputedFaculty,
    getComputedRooms,
  } = useAppStore();

  const allComputed = getComputedFaculty();
  const currentFaculty = allComputed.find((f) => f.name === facultyName) || allComputed[0];
  const currentOverride = facultyOverrides[currentFaculty.id];

  // Get lectures for this faculty today
  const myClasses = timetableSlots.filter((slot) => {
    if (slot.facultyId && slot.facultyId === currentFaculty.id) return true;
    if (slot.teacherName && (
      slot.teacherName === currentFaculty.name ||
      slot.teacherName.toLowerCase().includes(currentFaculty.shortName.toLowerCase())
    )) {
      return true;
    }
    return false;
  }).filter((s) => s.day === simulatedDay);

  // Student notes for this faculty
  const myNotes = studentNotes.filter((n) => n.facultyId === currentFaculty.id || n.facultyName === currentFaculty.name);

  return (
    <div className="space-y-6">
      
      {/* Faculty Profile Switcher Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-md">
              {currentFaculty.shortName
                .replace('Prof.', '')
                .replace('Dr.', '')
                .trim()
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{currentFaculty.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                  {currentFaculty.shortName}
                </span>
                <FacultyStatusBadge status={currentFaculty.currentStatus} size="sm" />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {currentFaculty.title} • {currentFaculty.department}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-700 font-semibold">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Assigned: </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded font-extrabold text-blue-700">
                  {currentFaculty.cabinNumber}
                </span>
                <span className="text-slate-400 font-normal">
                  ({currentFaculty.cabinBlock}, Floor {currentFaculty.cabinFloor})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Switcher dropdown for Demo */}
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium pl-1">Switch Faculty:</span>
            <select
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              {facultyList.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name} ({f.shortName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 1-TOUCH CABIN DOOR STATUS CONTROLS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Live Cabin Door Status Control ({currentFaculty.cabinNumber})
              </h3>
              <p className="text-xs text-slate-500">
                Click to instantly update what visiting students see on your digital cabin sign & app.
              </p>
            </div>
          </div>

          {currentOverride && (
            <button
              onClick={() => setFacultyOverride(currentFaculty.id, null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Automatic Timetable</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {/* 1. In Cabin */}
          <button
            onClick={() => setFacultyOverride(currentFaculty.id, 'in_cabin')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              currentFaculty.currentStatus === 'in_cabin' && !currentOverride
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                : currentOverride === 'in_cabin'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md font-bold'
                : 'bg-slate-50 hover:bg-emerald-50/50 border-slate-200 text-slate-700'
            }`}
          >
            <CheckCircle2 className={`w-5 h-5 mb-2 ${currentOverride === 'in_cabin' ? 'text-white' : 'text-emerald-600'}`} />
            <div className="text-xs font-bold">In Cabin</div>
            <div className={`text-[11px] mt-0.5 ${currentOverride === 'in_cabin' ? 'text-emerald-100' : 'text-slate-500'}`}>
              Free for student queries
            </div>
          </button>

          {/* 2. Stepped Out */}
          <button
            onClick={() => setFacultyOverride(currentFaculty.id, 'stepped_out')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              currentOverride === 'stepped_out'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md font-bold'
                : 'bg-slate-50 hover:bg-amber-50/50 border-slate-200 text-slate-700'
            }`}
          >
            <Coffee className={`w-5 h-5 mb-2 ${currentOverride === 'stepped_out' ? 'text-white' : 'text-amber-600'}`} />
            <div className="text-xs font-bold">Stepped Out</div>
            <div className={`text-[11px] mt-0.5 ${currentOverride === 'stepped_out' ? 'text-amber-100' : 'text-slate-500'}`}>
              Back in ~15 mins
            </div>
          </button>

          {/* 3. In Meeting */}
          <button
            onClick={() => setFacultyOverride(currentFaculty.id, 'in_meeting')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              currentOverride === 'in_meeting'
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md font-bold'
                : 'bg-slate-50 hover:bg-indigo-50/50 border-slate-200 text-slate-700'
            }`}
          >
            <Briefcase className={`w-5 h-5 mb-2 ${currentOverride === 'in_meeting' ? 'text-white' : 'text-indigo-600'}`} />
            <div className="text-xs font-bold">In Meeting</div>
            <div className={`text-[11px] mt-0.5 ${currentOverride === 'in_meeting' ? 'text-indigo-100' : 'text-slate-500'}`}>
              Department discussion
            </div>
          </button>

          {/* 4. In Class */}
          <button
            onClick={() => setFacultyOverride(currentFaculty.id, 'in_class')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              currentFaculty.currentStatus === 'in_class' && !currentOverride
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20 shadow-xs'
                : currentOverride === 'in_class'
                ? 'bg-rose-600 text-white border-rose-700 shadow-md font-bold'
                : 'bg-slate-50 hover:bg-rose-50/50 border-slate-200 text-slate-700'
            }`}
          >
            <BookOpen className={`w-5 h-5 mb-2 ${currentOverride === 'in_class' ? 'text-white' : 'text-rose-600'}`} />
            <div className="text-xs font-bold">In Class</div>
            <div className={`text-[11px] mt-0.5 ${currentOverride === 'in_class' ? 'text-rose-100' : 'text-slate-500'}`}>
              Lecturing in Room
            </div>
          </button>

          {/* 5. On Leave */}
          <button
            onClick={() => setFacultyOverride(currentFaculty.id, 'on_leave')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              currentOverride === 'on_leave'
                ? 'bg-slate-700 text-white border-slate-800 shadow-md font-bold'
                : 'bg-slate-50 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            <CalendarOff className={`w-5 h-5 mb-2 ${currentOverride === 'on_leave' ? 'text-white' : 'text-slate-500'}`} />
            <div className="text-xs font-bold">On Leave</div>
            <div className={`text-[11px] mt-0.5 ${currentOverride === 'on_leave' ? 'text-slate-300' : 'text-slate-500'}`}>
              Not on campus today
            </div>
          </button>
        </div>
      </div>

      {/* STUDENT CABIN MESSAGES / NOTES INBOX */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Messages Left at Your Cabin Door ({myNotes.length})
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
            Student Inquiries
          </span>
        </div>

        {myNotes.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
            No notes left at your cabin door yet.
          </div>
        ) : (
          <div className="space-y-3">
            {myNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{note.studentName}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold text-[10px]">
                      {note.studentRoll}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">{note.timestamp}</span>
                  </div>
                  <div className="font-bold text-blue-700">{note.subject}</div>
                  <p className="text-slate-600 leading-relaxed max-w-2xl">{note.message}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2 pt-2 sm:pt-0">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                    Received at Door
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TODAY'S TEACHING SCHEDULE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Your Scheduled Teaching Load Today ({simulatedDay})
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
            {myClasses.length} Lectures Assigned
          </span>
        </div>

        {myClasses.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
            No scheduled classes for {currentFaculty.name} on {simulatedDay}. You are free in {currentFaculty.cabinNumber} for research and mentoring.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myClasses.map((cls) => (
              <div
                key={cls.id}
                className="p-4 rounded-2xl border border-blue-200/80 bg-blue-50/30 hover:bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                      {cls.type}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">{cls.subject}</h4>
                    <p className="text-xs text-slate-500">
                      Code: {cls.code} • Batch: {cls.batch}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-extrabold">
                    Room {cls.roomId.toUpperCase()}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      {cls.startTime} – {cls.endTime}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Returns to Cabin at {cls.endTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
