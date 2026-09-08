import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CampusBlock } from '../../types';
import {
  Search,
  Filter,
  RotateCcw,
  Clock,
  Layers,
  Users,
  CheckSquare,
  Sparkles,
  Wifi,
  Tv,
  Wind,
  Zap,
} from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, getComputedRooms } = useAppStore();

  const allBlocks: CampusBlock[] = ['A Block', 'B Block', 'C Block', 'D Block'];
  const allFloors = [
    { label: 'Ground Floor', value: 0 },
    { label: '1st Floor', value: 1 },
    { label: '2nd Floor', value: 2 },
    { label: '3rd Floor', value: 3 },
  ];

  const durationOptions = [
    { label: 'Any Duration', value: 0 },
    { label: '30+ Mins', value: 30 },
    { label: '1+ Hour', value: 60 },
    { label: '2+ Hours', value: 120 },
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: '🟢 Available Only', value: 'available' },
    { label: '🟡 Occupied Soon', value: 'soon' },
    { label: '🔴 Occupied', value: 'occupied' },
  ];

  const amenityOptions = [
    { label: 'AC', icon: <Wind className="w-3.5 h-3.5" /> },
    { label: 'Smart Projector', icon: <Tv className="w-3.5 h-3.5" /> },
    { label: 'High-Speed WiFi', icon: <Wifi className="w-3.5 h-3.5" /> },
    { label: 'Power Outlets', icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  const toggleBlock = (block: CampusBlock) => {
    const exists = filters.blocks.includes(block);
    const updated = exists ? filters.blocks.filter((b) => b !== block) : [...filters.blocks, block];
    setFilters({ blocks: updated });
  };

  const toggleFloor = (floor: number) => {
    const exists = filters.floors.includes(floor);
    const updated = exists ? filters.floors.filter((f) => f !== floor) : [...filters.floors, floor];
    setFilters({ floors: updated });
  };

  const toggleAmenity = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    const updated = exists ? filters.amenities.filter((a) => a !== amenity) : [...filters.amenities, amenity];
    setFilters({ amenities: updated });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.blocks.length > 0 ||
    filters.floors.length > 0 ||
    filters.durationMinutes > 0 ||
    filters.amenities.length > 0 ||
    filters.statusFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 mb-6">
      
      {/* Search & Status Row */}
      <div className="flex flex-col lg:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Search by room name (e.g. C-204, D-301), subject, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select
            value={filters.statusFilter}
            onChange={(e) => setFilters({ statusFilter: e.target.value as any })}
            className="w-full lg:w-auto px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Pill Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 pt-2 border-t border-slate-100 text-xs">
        
        {/* Campus Blocks */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Campus Block
          </label>
          <div className="flex flex-wrap gap-1.5">
            {allBlocks.map((block) => {
              const active = filters.blocks.includes(block);
              return (
                <button
                  key={block}
                  onClick={() => toggleBlock(block)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {block}
                </button>
              );
            })}
          </div>
        </div>

        {/* Floor */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700">Floor Level</label>
          <div className="flex flex-wrap gap-1.5">
            {allFloors.map((floor) => {
              const active = filters.floors.includes(floor.value);
              return (
                <button
                  key={floor.value}
                  onClick={() => toggleFloor(floor.value)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {floor.value === 0 ? 'Ground' : `${floor.value}F`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimum Duration Needed */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            Available For
          </label>
          <div className="flex flex-wrap gap-1.5">
            {durationOptions.map((opt) => {
              const active = filters.durationMinutes === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilters({ durationMinutes: opt.value })}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700">Required Amenities</label>
          <div className="flex flex-wrap gap-1.5">
            {amenityOptions.map((am) => {
              const active = filters.amenities.includes(am.label);
              return (
                <button
                  key={am.label}
                  onClick={() => toggleAmenity(am.label)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {am.icon}
                  <span>{am.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
