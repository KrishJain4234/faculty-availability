import React from 'react';
import { TimetableSlot } from '../../types';
import { getRoomDailyTimeline, timeStringToMinutes } from '../../services/timetableEngine';
import { Clock, User, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

interface TimetableTimelineProps {
  roomId: string;
  day: string;
  currentTimeStr: string;
  allSlots: TimetableSlot[];
}

export const TimetableTimeline: React.FC<TimetableTimelineProps> = ({
  roomId,
  day,
  currentTimeStr,
  allSlots,
}) => {
  const timeline = getRoomDailyTimeline(roomId, day, allSlots);
  const currentMinutes = timeStringToMinutes(currentTimeStr);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Today's Daily Schedule Timeline ({day})
        </h4>
        <span className="text-[11px] text-slate-400">8:00 AM – 6:00 PM</span>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 py-2">
        {timeline.map((item, idx) => {
          const itemStartMin = item.startHour * 60;
          const isPast = currentMinutes > (item.startHour + 1) * 60;
          const isCurrent = currentMinutes >= itemStartMin && currentMinutes < (item.startHour + 1) * 60;

          return (
            <div key={idx} className="relative pl-6">
              
              {/* Timeline dot marker */}
              <div
                className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'border-blue-600 ring-4 ring-blue-500/20'
                    : item.isFree
                    ? 'border-emerald-500'
                    : 'border-slate-400'
                }`}
              >
                {isCurrent && <div className="w-2 h-2 rounded-full bg-blue-600" />}
              </div>

              {/* Card */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-50/70 border-blue-200 shadow-xs'
                    : item.isFree
                    ? 'bg-emerald-50/30 border-emerald-100 hover:bg-emerald-50/60'
                    : 'bg-white border-slate-200'
                } ${isPast ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.hourLabel}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white animate-pulse">
                        Current Slot
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      item.isFree
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.isFree ? 'Vacant / Free' : item.slot?.type || 'Class'}
                  </span>
                </div>

                {item.slot ? (
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>
                        {item.slot.subject} ({item.slot.code})
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.slot.teacherName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {item.slot.batch}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-[11px] text-emerald-700 font-medium">
                    Available for study, project work, and discussion.
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
