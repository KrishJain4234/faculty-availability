import React from 'react';
import { Room } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { StatusBadge, AmenityBadge } from '../common/Badge';
import {
  Clock,
  Users,
  Building,
  Star,
  Flag,
  Calendar,
  Sparkles,
  QrCode,
  ArrowRight,
  Tv,
  Wind,
  Wifi,
  Zap,
} from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onOpenReport: (room: Room) => void;
  onOpenQR: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onOpenReport, onOpenQR }) => {
  const { setSelectedRoomId, toggleFavorite } = useAppStore();

  const getAmenityIcon = (name: string) => {
    switch (name) {
      case 'AC':
        return <Wind className="w-3 h-3 text-blue-500" />;
      case 'Smart Projector':
      case 'Dual Projectors':
        return <Tv className="w-3 h-3 text-indigo-500" />;
      case 'High-Speed WiFi':
        return <Wifi className="w-3 h-3 text-emerald-500" />;
      case 'Power Outlets':
        return <Zap className="w-3 h-3 text-amber-500" />;
      default:
        return null;
    }
  };

  const isFree = room.currentStatus === 'available';
  const isSoon = room.currentStatus === 'soon';
  const isOccupied = room.currentStatus === 'occupied';

  const cardBorderClass = isFree
    ? 'border-emerald-200/90 hover:border-emerald-300'
    : isSoon
    ? 'border-amber-200/90 hover:border-amber-300'
    : 'border-slate-200 hover:border-slate-300';

  return (
    <div
      className={`bg-white rounded-2xl border ${cardBorderClass} shadow-xs hover:shadow-premium transition-all duration-200 flex flex-col justify-between overflow-hidden group`}
    >
      {/* Top Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3
                onClick={() => setSelectedRoomId(room.id)}
                className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer"
              >
                {room.name}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                {room.type}
              </span>
            </div>

            {/* Block, Floor & Capacity */}
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-medium">
              <span>{room.block}</span>
              <span>•</span>
              <span>{room.floor === 0 ? 'Ground Floor' : `${room.floor}${room.floor === 1 ? 'st' : room.floor === 2 ? 'nd' : 'rd'} Floor`}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-700">
                <Users className="w-3 h-3 text-slate-400" />
                {room.capacity} Seats
              </span>
            </p>
          </div>

          {/* Top Right: Status Badge & Favorite */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => toggleFavorite(room.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                room.isFavorite
                  ? 'bg-amber-50 border-amber-200 text-amber-500'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title={room.isFavorite ? 'Remove from favorites' : 'Bookmark room'}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
            <StatusBadge status={room.currentStatus} size="sm" />
          </div>
        </div>

        {/* Availability Banner */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Current Status:</span>
            </div>
            <span
              className={`font-bold ${
                isFree
                  ? 'text-emerald-700'
                  : isSoon
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {isFree
                ? `Available Until ${room.availableUntil}`
                : isSoon
                ? `Free Until ${room.availableUntil}`
                : `${room.availableUntil || 'In Session'}`}
            </span>
          </div>

          {/* Next Scheduled Class */}
          {room.nextClass && (
            <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 flex items-center justify-between">
              <span className="text-slate-500">Next Scheduled Class:</span>
              <span className="font-medium text-slate-800 truncate ml-2 text-right">
                {room.nextClass.subject} ({room.nextClass.time})
              </span>
            </div>
          )}
        </div>

        {/* Amenities Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {room.amenities.slice(0, 3).map((amenity) => (
            <AmenityBadge key={amenity} label={amenity} icon={getAmenityIcon(amenity)} />
          ))}
          {room.amenities.length > 3 && (
            <span className="text-[10px] text-slate-400 px-1.5 py-1 font-medium">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* QR Code / RFID trigger */}
          <button
            onClick={() => onOpenQR(room)}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Scan QR Code / RFID Check-in"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Student Report Occupied Button */}
          <button
            onClick={() => onOpenReport(room)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
            title="Report inaccurate room status"
          >
            <Flag className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>

        {/* View Details / Timetable Button */}
        <button
          onClick={() => setSelectedRoomId(room.id)}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/70 border border-blue-200/60 transition-colors"
        >
          <span>View Timetable</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
