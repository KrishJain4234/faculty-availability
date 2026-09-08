import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CampusBlock, Room, FacultyMember } from '../../types';
import { StatusBadge, FacultyStatusBadge } from '../common/Badge';
import {
  Building2,
  Layers,
  MapPin,
  Clock,
  Users,
  Compass,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface CampusMapProps {
  onOpenDetail?: (faculty: FacultyMember) => void;
  onOpenReport?: (room: Room) => void;
  onOpenQR?: (room: Room) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  onOpenDetail,
  onOpenReport,
  onOpenQR,
}) => {
  const { getComputedRooms, getComputedFaculty, setSelectedRoomId, setSelectedFacultyId } = useAppStore();
  const [selectedBlock, setSelectedBlock] = useState<CampusBlock>('C Block');
  const [selectedFloor, setSelectedFloor] = useState<number>(3);

  const allRooms = getComputedRooms();
  const allFaculty = getComputedFaculty();

  const blocksMeta: Array<{
    name: CampusBlock;
    title: string;
    department: string;
    description: string;
    totalFloors: number;
  }> = [
    {
      name: 'C Block',
      title: 'Computing & IT Center',
      department: 'CSE, IT & Software Engg • Harish Sir / Dr. Sharma Cabins',
      description: 'Houses CSE faculty cabins, smart lecture halls, and computing labs.',
      totalFloors: 4,
    },
    {
      name: 'B Block',
      title: 'Science & Electronics Block',
      department: 'ECE, IT • Prof. Gupta / Dr. Malhotra Cabins',
      description: 'Faculty suites, communication labs, and lecture theaters.',
      totalFloors: 4,
    },
    {
      name: 'D Block',
      title: 'AI & Research Complex',
      department: 'AI & Data Science • Dr. Rao Cabin',
      description: 'AI Lab Director cabin, GPU compute bays, and seminar hall.',
      totalFloors: 4,
    },
    {
      name: 'A Block',
      title: 'Engineering Core Block',
      department: 'Mechanical & Civil • Prof. Venkatesh / Dr. Shalini Cabins',
      description: 'Workshops, engineering chambers, and multi-tier lecture spaces.',
      totalFloors: 4,
    },
  ];

  const currentBlockRooms = allRooms.filter((r) => r.block === selectedBlock);
  const floorRooms = currentBlockRooms.filter((r) => r.floor === selectedFloor);

  // Faculty cabins on this selected floor and block
  const floorFaculty = allFaculty.filter(
    (f) => f.cabinBlock === selectedBlock && f.cabinFloor === selectedFloor
  );

  return (
    <div className="space-y-6">
      
      {/* Map Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Campus Cabin & Floor Blueprint</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Interactive Campus & Faculty Wing Map
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select any block and floor level to inspect faculty cabins (e.g. Harish Sir in Cabin C-302) and academic lecture halls.
            </p>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/70 text-xs shrink-0">
            <span className="font-semibold text-slate-600 mr-1">Cabin Status:</span>
            <span className="flex items-center gap-1.5 font-bold text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> In Cabin
            </span>
            <span className="flex items-center gap-1.5 font-bold text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> In Class
            </span>
            <span className="flex items-center gap-1.5 font-bold text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Stepped Out
            </span>
          </div>
        </div>
      </div>

      {/* Campus Blocks Grid (4 Blocks) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {blocksMeta.map((block) => {
          const isSelected = selectedBlock === block.name;
          const blockFaculty = allFaculty.filter((f) => f.cabinBlock === block.name);

          return (
            <div
              key={block.name}
              onClick={() => {
                setSelectedBlock(block.name);
                setSelectedFloor(block.name === 'C Block' ? 3 : block.name === 'B Block' ? 2 : 2);
              }}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-white shadow-md ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-lg text-slate-900">{block.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isSelected ? 'Viewing' : 'Select'}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-700">{block.title}</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">{block.department}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-blue-700">{blockFaculty.length} Faculty Cabins</span>
                <span className="text-slate-400 text-[11px]">4 Floors</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Block Floor Level Inspector */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Floor Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {selectedBlock} Floor Blueprint (Floor {selectedFloor === 0 ? 'Ground' : selectedFloor})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {floorFaculty.length} Faculty Cabins • {floorRooms.length} Classrooms on this floor
              </p>
            </div>
          </div>

          {/* Floor Level Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            {[0, 1, 2, 3].map((fl) => (
              <button
                key={fl}
                onClick={() => setSelectedFloor(fl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFloor === fl
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {fl === 0 ? 'Ground' : `Floor ${fl}`}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 1: FACULTY CABIN WING */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Faculty Cabin Wing — Floor {selectedFloor}
              </h4>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {floorFaculty.length} Faculty Assigned
            </span>
          </div>

          {floorFaculty.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
              No faculty cabins situated on Floor {selectedFloor} of {selectedBlock}. Try Floor 2 or Floor 3.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {floorFaculty.map((faculty) => (
                <div
                  key={faculty.id}
                  onClick={() => {
                    setSelectedFacultyId(faculty.id);
                    if (onOpenDetail) onOpenDetail(faculty);
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group bg-white shadow-xs hover:shadow-md ${
                    faculty.currentStatus === 'in_cabin'
                      ? 'border-emerald-200/80 hover:border-emerald-300'
                      : 'border-rose-200/80 hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-extrabold text-xs">
                          {faculty.cabinNumber}
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                          {faculty.name}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {faculty.shortName} • {faculty.department}
                      </p>
                    </div>

                    <FacultyStatusBadge status={faculty.currentStatus} size="sm" />
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium truncate max-w-[280px]">
                      {faculty.statusMessage}
                    </span>
                    <span className="text-blue-600 font-bold flex items-center gap-1 shrink-0">
                      Cabin Details &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: CLASSROOMS & LECTURE HALLS ON THIS FLOOR */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Classrooms & Lecture Halls — Floor {selectedFloor}
              </h4>
            </div>
          </div>

          {floorRooms.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
              No lecture halls registered on Floor {selectedFloor}.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {floorRooms.map((room) => {
                const isFree = room.currentStatus === 'available';
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{room.name}</div>
                        <div className="text-[11px] text-slate-500">{room.type} • {room.capacity} Seats</div>
                      </div>
                      <StatusBadge status={room.currentStatus} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
