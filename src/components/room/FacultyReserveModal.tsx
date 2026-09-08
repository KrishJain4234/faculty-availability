import React, { useState } from 'react';
import { Room } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { X, CalendarCheck, Clock, User, BookOpen, Send } from 'lucide-react';

interface FacultyReserveModalProps {
  room: Room | null;
  onClose: () => void;
}

export const FacultyReserveModal: React.FC<FacultyReserveModalProps> = ({ room, onClose }) => {
  const { createReservation, facultyName } = useAppStore();
  const [purpose, setPurpose] = useState('Extra Tutorial Session');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:30');
  const [department, setDepartment] = useState('Computer Science & Engg');

  if (!room) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReservation({
      roomId: room.id,
      roomName: room.name,
      facultyName: facultyName || 'Dr. Sharma',
      department,
      purpose,
      startTime,
      endTime,
      date: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Faculty Temporary Reservation</h3>
              <p className="text-xs text-slate-500">Claim {room.name} ({room.block}) for special session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Faculty In-Charge</label>
            <input
              type="text"
              defaultValue={facultyName}
              disabled
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Session Purpose</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Extra Tutorial Session">Extra Tutorial / Remedial Lecture</option>
              <option value="Project Viva & Review">Capstone Project Review / Viva</option>
              <option value="Hackathon / Coding Bay">Hackathon Discussion & Coding Bay</option>
              <option value="Online Guest Webinar">Online Guest Webinar / Video Conf</option>
              <option value="Faculty Departmental Meeting">Faculty Departmental Meeting</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Confirm Reservation</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
