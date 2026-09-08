import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TimetableSlot, RoomStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import {
  ShieldCheck,
  Flag,
  Upload,
  Sliders,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  Database,
  Building2,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    reports,
    resolveReport,
    timetableSlots,
    addTimetableSlot,
    deleteTimetableSlot,
    importTimetable,
    rooms,
    roomOverrides,
    setRoomOverride,
    addToast,
  } = useAppStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'reports' | 'overrides' | 'timetable' | 'import'>('reports');

  // New Slot Form State
  const [newRoomId, setNewRoomId] = useState('c-204');
  const [newDay, setNewDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('10:00');
  const [newSubject, setNewSubject] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newBatch, setNewBatch] = useState('CSE-3A');
  const [newType, setNewType] = useState<'Lecture' | 'Lab' | 'Tutorial' | 'Seminar'>('Lecture');

  // CSV / JSON Import Text
  const [importText, setImportText] = useState('');

  const pendingReports = reports.filter((r) => r.status === 'pending');

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newTeacher) {
      addToast({ type: 'error', title: 'Missing Information', message: 'Subject and teacher are required.' });
      return;
    }

    addTimetableSlot({
      roomId: newRoomId,
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      subject: newSubject,
      code: newCode || 'CS101',
      teacherName: newTeacher,
      teacherDepartment: newDept,
      batch: newBatch,
      type: newType,
    });

    setNewSubject('');
    setNewCode('');
    setNewTeacher('');
  };

  const handleBulkImport = () => {
    try {
      if (!importText.trim()) return;

      if (importText.trim().startsWith('[')) {
        // Parse JSON
        const parsed = JSON.parse(importText);
        importTimetable(parsed);
      } else {
        // Parse CSV format: roomId,day,startTime,endTime,subject,code,teacher,dept,batch,type
        const lines = importText.trim().split('\n');
        const parsedSlots: TimetableSlot[] = [];

        lines.forEach((line, i) => {
          if (i === 0 && line.toLowerCase().includes('roomid')) return; // Skip header
          const parts = line.split(',').map((p) => p.trim());
          if (parts.length >= 7) {
            parsedSlots.push({
              id: `imported-${Date.now()}-${i}`,
              roomId: parts[0],
              day: (parts[1] as any) || 'Monday',
              startTime: parts[2] || '09:00',
              endTime: parts[3] || '10:00',
              subject: parts[4] || 'Course',
              code: parts[5] || 'CRS101',
              teacherName: parts[6] || 'Faculty',
              teacherDepartment: parts[7] || 'General',
              batch: parts[8] || 'Batch-A',
              type: (parts[9] as any) || 'Lecture',
            });
          }
        });

        if (parsedSlots.length > 0) {
          importTimetable(parsedSlots);
        } else {
          throw new Error('No valid rows found in CSV data.');
        }
      }

      setImportText('');
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Import Failed',
        message: err.message || 'Invalid CSV or JSON formatting.',
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Campus Admin Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Classroom Operations & Timetable Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage real-time room overrides, timetable schedules, and crowd-verified incident reports.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveAdminTab('reports')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'reports' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Reports ({pendingReports.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('overrides')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'overrides' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Room Overrides</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('timetable')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'timetable' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Timetable Slots</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('import')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'import' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk CSV / JSON</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Student Incident Reports Triage */}
      {activeAdminTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Pending Student Incident Reports</h3>
              <p className="text-xs text-slate-500">
                Crowdsourced feedback on rooms marked free in timetable but physically occupied.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              {pendingReports.length} Pending Actions
            </span>
          </div>

          {pendingReports.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
              All incident reports have been reviewed and resolved!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{rep.roomName}</span>
                      <span className="text-slate-500">• Reported by {rep.reportedBy}</span>
                      <span className="text-slate-400 text-[11px]">at {rep.reportedAt}</span>
                    </div>
                    <div className="font-semibold text-rose-700 mt-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{rep.reason}</span>
                    </div>
                    {rep.comment && <p className="text-slate-600 mt-1 italic">"{rep.comment}"</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => resolveReport(rep.id, 'verify_occupied')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Occupied</span>
                    </button>
                    <button
                      onClick={() => resolveReport(rep.id, 'restore_free')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark As Free</span>
                    </button>
                    <button
                      onClick={() => resolveReport(rep.id, 'dismiss')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Manual Room Status Overrides */}
      {activeAdminTab === 'overrides' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Manual Classroom Status Overrides</h3>
            <p className="text-xs text-slate-500">
              Force override live automated timetable calculation (e.g. for maintenance or exams).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {rooms.map((room) => {
              const activeOverride = roomOverrides[room.id];
              return (
                <div
                  key={room.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-sm text-slate-900">{room.name}</span>
                      <p className="text-slate-500 text-[11px]">{room.block} • Floor {room.floor}</p>
                    </div>
                    {activeOverride ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        Overridden: {activeOverride}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Auto Calculated</span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-1">
                    <button
                      onClick={() => setRoomOverride(room.id, 'available')}
                      className="flex-1 py-1 rounded bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 font-semibold text-[11px]"
                    >
                      Free
                    </button>
                    <button
                      onClick={() => setRoomOverride(room.id, 'occupied')}
                      className="flex-1 py-1 rounded bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 font-semibold text-[11px]"
                    >
                      Occupied
                    </button>
                    {activeOverride && (
                      <button
                        onClick={() => setRoomOverride(room.id, null)}
                        className="py-1 px-2 rounded bg-slate-200 text-slate-700 font-semibold text-[11px]"
                        title="Reset to Auto Timetable"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Timetable Slot Manager */}
      {activeAdminTab === 'timetable' && (
        <div className="space-y-6">
          {/* Add Slot Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Schedule New Timetable Slot</h3>
            </div>

            <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Room</label>
                <select
                  value={newRoomId}
                  onChange={(e) => setNewRoomId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.block})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Day of Week</label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Start Time</label>
                <input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">End Time</label>
                <input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Systems"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Course Code</label>
                <input
                  type="text"
                  placeholder="CS401"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Faculty Name</label>
                <input
                  type="text"
                  placeholder="Dr. Sharma"
                  value={newTeacher}
                  onChange={(e) => setNewTeacher(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Timetable Slot</span>
                </button>
              </div>
            </form>
          </div>

          {/* Timetable Slots Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-700">
                All Active Campus Scheduled Slots ({timetableSlots.length})
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Room</th>
                    <th className="py-2.5 px-4">Day & Time</th>
                    <th className="py-2.5 px-4">Subject & Code</th>
                    <th className="py-2.5 px-4">Teacher</th>
                    <th className="py-2.5 px-4">Batch & Type</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {timetableSlots.map((slot) => (
                    <tr key={slot.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">{slot.roomId.toUpperCase()}</td>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {slot.day} • {slot.startTime}–{slot.endTime}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-slate-900">{slot.subject}</span> ({slot.code})
                      </td>
                      <td className="py-2.5 px-4">{slot.teacherName}</td>
                      <td className="py-2.5 px-4">
                        {slot.batch} • <span className="font-medium text-blue-600">{slot.type}</span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => deleteTimetableSlot(slot.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Bulk CSV / JSON Import */}
      {activeAdminTab === 'import' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Bulk Timetable CSV / JSON Importer</h3>
              <p className="text-xs text-slate-500">
                Paste timetable data exported from university ERP or scheduling software.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
            <strong>Expected CSV Header:</strong><br />
            roomId,day,startTime,endTime,subject,code,teacherName,department,batch,type<br />
            <strong>Example Row:</strong><br />
            c-204,Monday,09:00,10:00,Data Structures,CS201,Dr. Sharma,CSE,CSE-3A,Lecture
          </div>

          <textarea
            rows={8}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste CSV rows or JSON array here..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setImportText(
                  `roomId,day,startTime,endTime,subject,code,teacherName,department,batch,type\nc-204,Thursday,11:00,12:00,Graph Theory,CS308,Dr. Sharma,CSE,CSE-5A,Lecture\nb-107,Friday,14:00,16:00,Embedded Systems Lab,EC309,Prof. Gupta,IT,IT-5A,Lab`
                );
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Load Sample CSV Data
            </button>
            <button
              onClick={handleBulkImport}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import & Sync Timetable</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
