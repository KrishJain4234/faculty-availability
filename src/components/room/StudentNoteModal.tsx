import React, { useState } from 'react';
import { FacultyMember } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { X, MessageSquare, Send, Building2, User, BookOpen } from 'lucide-react';

interface StudentNoteModalProps {
  faculty: FacultyMember | null;
  onClose: () => void;
}

export const StudentNoteModal: React.FC<StudentNoteModalProps> = ({ faculty, onClose }) => {
  const { submitStudentCabinNote } = useAppStore();

  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!faculty) return null;

  const presets = [
    'Assignment / Homework Doubt',
    'Project Review & Sign-off',
    'Lab Manual Submission',
    'Requesting Meeting at Cabin',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !message.trim()) return;

    submitStudentCabinNote({
      facultyId: faculty.id,
      facultyName: faculty.name,
      studentName: studentName.trim(),
      studentRoll: studentRoll.trim() || 'Student',
      subject: subject.trim() || 'General Query',
      message: message.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Leave Cabin Door Message
              </h3>
              <p className="text-xs text-slate-500">
                For {faculty.name} • {faculty.cabinNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Quick Preset:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setSubject(p)}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    subject === p
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Roll No / Batch
              </label>
              <input
                type="text"
                value={studentRoll}
                onChange={(e) => setStudentRoll(e.target.value)}
                placeholder="e.g. CSE-3B (Roll 42)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Subject / Topic
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. DBMS Normalization Doubt"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Your Message for Faculty *
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Sir, I came by your cabin to discuss the indexing question. When is the best time to meet?"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Leave Message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
