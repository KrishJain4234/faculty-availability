import React from 'react';
import { Room } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { StatusBadge, AmenityBadge } from '../common/Badge';
import { TimetableTimeline } from './TimetableTimeline';
import {
  X,
  Users,
  Building,
  Clock,
  QrCode,
  Flag,
  CalendarCheck,
  Star,
  Wind,
  Tv,
  Wifi,
  Zap,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onOpenReport: (room: Room) => void;
  onOpenQR: (room: Room) => void;
  onOpenReserve: (room: Room) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  onClose,
  onOpenReport,
  onOpenQR,
  onOpenReserve,
}) => {
  const { simulatedDay, simulatedTime, timetableSlots, toggleFavorite, currentRole } = useAppStore();

  if (!room) return null;

  const getAmenityIcon = (name: string) => {
    switch (name) {
      case 'AC':
        return <Wind className="w-3.5 h-3.5 text-blue-500" />;
      case 'Smart Projector':
      case 'Dual Projectors':
        return <Tv className="w-3.5 h-3.5 text-indigo-500" />;
      case 'High-Speed WiFi':
        return <Wifi className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Power Outlets':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return null;
    }
  };

  // Mock occupancy curve for this specific room
  const occupancyData = [
    { time: '8 AM', occupancy: 0 },
    { time: '9 AM', occupancy: room.currentStatus === 'occupied' ? 100 : 0 },
    { time: '10 AM', occupancy: 90 },
    { time: '11 AM', occupancy: 95 },
    { time: '12 PM', occupancy: 80 },
    { time: '1 PM', occupancy: 10 },
    { time: '2 PM', occupancy: 70 },
    { time: '3 PM', occupancy: 60 },
    { time: '4 PM', occupancy: 20 },
    { time: '5 PM', occupancy: 0 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {room.name}
              </h2>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-200/80 text-slate-700 font-semibold">
                {room.type}
              </span>
              <StatusBadge status={room.currentStatus} size="md" />
            </div>

            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-medium">
              <span>{room.block}</span>
              <span>•</span>
              <span>{room.floor === 0 ? 'Ground Floor' : `${room.floor}nd Floor`}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-700">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                Capacity: {room.capacity} Students
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(room.id)}
              className={`p-2 rounded-xl border transition-colors ${
                room.isFavorite
                  ? 'bg-amber-50 border-amber-200 text-amber-500'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title="Bookmark room"
            >
              <Star className="w-5 h-5 fill-current" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-700">
          
          {/* Availability Status Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                <Clock className="w-4 h-4" />
                <span>Live Availability Window</span>
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {room.currentStatus === 'available'
                  ? `Free Until ${room.availableUntil}`
                  : room.currentStatus === 'soon'
                  ? `Free Until ${room.availableUntil}`
                  : `${room.availableUntil || 'Occupied in Lecture'}`}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Simulated for {simulatedDay} at {simulatedTime}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <CalendarCheck className="w-4 h-4 text-blue-600" />
                <span>Next Scheduled Class</span>
              </div>
              {room.nextClass ? (
                <div className="mt-1">
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {room.nextClass.subject} ({room.nextClass.code})
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    By {room.nextClass.teacher} • Starts at {room.nextClass.time}
                  </div>
                </div>
              ) : (
                <div className="text-sm font-medium text-emerald-600 mt-2">
                  No further classes scheduled today!
                </div>
              )}
            </div>
          </div>

          {/* Amenities Badges */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Available Room Equipment & Amenities
            </h4>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <AmenityBadge key={amenity} label={amenity} icon={getAmenityIcon(amenity)} />
              ))}
            </div>
          </div>

          {/* Occupancy Graph (Recharts) */}
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Today's Estimated Occupancy Graph (%)
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Avg: {room.todayOccupancyRate}% Busy
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`${val}% Occupied`, 'Utilization']}
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="occupancy"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOccupancy)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Timetable Timeline Breakdown */}
          <div className="pt-2">
            <TimetableTimeline
              roomId={room.id}
              day={simulatedDay}
              currentTimeStr={simulatedTime}
              allSlots={timetableSlots}
            />
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* QR Check-in Simulator */}
            <button
              onClick={() => onOpenQR(room)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors shadow-xs"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>QR / RFID Check-in</span>
            </button>

            {/* Student Report Occupied */}
            <button
              onClick={() => onOpenReport(room)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-semibold transition-colors shadow-xs"
            >
              <Flag className="w-4 h-4 text-rose-500" />
              <span>Report Incorrect Status</span>
            </button>
          </div>

          {/* Faculty Reservation Button */}
          {currentRole === 'faculty' && (
            <button
              onClick={() => onOpenReserve(room)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow-glow-primary transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Reserve Room for Session</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
