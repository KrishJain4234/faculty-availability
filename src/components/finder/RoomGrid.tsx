import React, { useState } from 'react';
import { Room } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { RoomCard } from './RoomCard';
import { LayoutGrid, List, Sparkles, Building, AlertCircle, RotateCcw } from 'lucide-react';
import { StatusBadge } from '../common/Badge';

interface RoomGridProps {
  onOpenReport: (room: Room) => void;
  onOpenQR: (room: Room) => void;
}

export const RoomGrid: React.FC<RoomGridProps> = ({ onOpenReport, onOpenQR }) => {
  const { getComputedRooms, filters, resetFilters, setSelectedRoomId } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const allRooms = getComputedRooms();

  // Apply filters
  const filteredRooms = allRooms.filter((room) => {
    // Search query filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = room.name.toLowerCase().includes(q);
      const matchBlock = room.block.toLowerCase().includes(q);
      const matchType = room.type.toLowerCase().includes(q);
      const matchNextClass = room.nextClass?.subject.toLowerCase().includes(q);
      if (!matchName && !matchBlock && !matchType && !matchNextClass) {
        return false;
      }
    }

    // Block filter
    if (filters.blocks.length > 0 && !filters.blocks.includes(room.block)) {
      return false;
    }

    // Floor filter
    if (filters.floors.length > 0 && !filters.floors.includes(room.floor)) {
      return false;
    }

    // Status filter
    if (filters.statusFilter !== 'all' && room.currentStatus !== filters.statusFilter) {
      return false;
    }

    // Duration filter
    if (filters.durationMinutes > 0) {
      if (room.currentStatus !== 'available') return false;
      // If available, check if next class starts later than durationMinutes
      if (room.nextClass && room.nextClass.startsInMinutes < filters.durationMinutes) {
        return false;
      }
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      const hasAll = filters.amenities.every((a) => room.amenities.includes(a));
      if (!hasAll) return false;
    }

    return true;
  });

  const availableCount = filteredRooms.filter((r) => r.currentStatus === 'available').length;
  const soonCount = filteredRooms.filter((r) => r.currentStatus === 'soon').length;
  const occupiedCount = filteredRooms.filter((r) => r.currentStatus === 'occupied').length;

  return (
    <div className="space-y-4">
      
      {/* Top Metrics / Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-slate-800">
            Showing {filteredRooms.length} of {allRooms.length} Classrooms
          </span>
          <span className="text-slate-300">|</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-medium border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {availableCount} Available Now
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md font-medium border border-amber-200/60">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            {soonCount} Occupied Soon (&lt;30m)
          </span>
          <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md font-medium border border-rose-200/60">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            {occupiedCount} In Session
          </span>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-medium border transition-colors ${
              viewMode === 'grid'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-medium border transition-colors ${
              viewMode === 'table'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Classrooms Match Your Filter</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Try adjusting your block selection, lowering duration requirement, or clearing active filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onOpenReport={onOpenReport} onOpenQR={onOpenQR} />
          ))}
        </div>
      ) : (
        /* Table Layout */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Room</th>
                  <th className="py-3.5 px-4">Block & Floor</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Availability Window</th>
                  <th className="py-3.5 px-4">Next Class</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <button
                        onClick={() => setSelectedRoomId(room.id)}
                        className="hover:text-blue-600 transition-colors text-left font-bold"
                      >
                        {room.name}
                      </button>
                      <div className="text-[11px] text-slate-400 font-normal">{room.type}</div>
                    </td>
                    <td className="py-3 px-4">
                      {room.block} • {room.floor === 0 ? 'Ground' : `${room.floor}F`}
                    </td>
                    <td className="py-3 px-4">{room.capacity} Seats</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={room.currentStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {room.availableUntil || 'In Session'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {room.nextClass ? (
                        <span>
                          <strong className="text-slate-700">{room.nextClass.subject}</strong> ({room.nextClass.time})
                        </span>
                      ) : (
                        <span className="text-slate-400">None today</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedRoomId(room.id)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
