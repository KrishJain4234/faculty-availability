import React, { useState } from 'react';
import { Room } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { X, Flag, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

interface ReportOccupiedModalProps {
  room: Room | null;
  onClose: () => void;
}

export const ReportOccupiedModal: React.FC<ReportOccupiedModalProps> = ({ room, onClose }) => {
  const { submitReport } = useAppStore();
  const [reason, setReason] = useState<'Room Occupied' | 'Faculty Arrived Early' | 'Equipment Malfunction' | 'Noise / Event'>('Room Occupied');
  const [comment, setComment] = useState('');
  const [reporterName, setReporterName] = useState('');

  if (!room) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      roomId: room.id,
      roomName: room.name,
      reportedBy: reporterName.trim() || 'Anonymous Student',
      reason,
      comment: comment.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Report Status Discrepancy</h3>
              <p className="text-xs text-slate-500">For Classroom {room.name} ({room.block})</p>
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
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 flex items-start gap-2.5 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Instant Verification:</strong> Submitting will mark this room as{' '}
              <span className="font-bold underline">"Verification Needed"</span> across campus displays and alert college administrators.
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Reason for Report</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Room Occupied">Room is physically occupied (unannounced class/group)</option>
              <option value="Faculty Arrived Early">Faculty / Guest arrived earlier than scheduled</option>
              <option value="Equipment Malfunction">Projector / AC / Power malfunction</option>
              <option value="Noise / Event">Event or loud noise in adjacent area</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Your Identifier / Student ID (Optional)</label>
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="e.g. Student #3912 or CSE-3B"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Additional Details / Notes</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. 15 students preparing for hackathon presentation with projector in use..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
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
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
