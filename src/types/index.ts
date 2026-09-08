export type RoomStatus = 'available' | 'soon' | 'occupied' | 'verification_needed' | 'reserved';

export type FacultyStatus = 'in_cabin' | 'in_class' | 'stepped_out' | 'in_meeting' | 'on_leave';

export type CampusBlock = 'A Block' | 'B Block' | 'C Block' | 'D Block';

export interface RoomAmenity {
  id: string;
  name: string;
  icon: string;
}

export interface Room {
  id: string;
  name: string; // e.g. "C-204"
  block: CampusBlock;
  floor: number; // 0 for Ground, 1 for 1st, 2 for 2nd, 3 for 3rd
  capacity: number;
  type: 'Classroom' | 'Lecture Hall' | 'Computer Lab' | 'Seminar Hall' | 'Discussion Room';
  amenities: string[]; // 'AC', 'Projector', 'WiFi', 'Whiteboard', 'Power Outlets', 'Smart Podium'
  currentStatus: RoomStatus;
  availableUntil?: string; // e.g. "1:00 PM"
  nextClass?: {
    subject: string;
    code: string;
    teacher: string;
    time: string;
    startsInMinutes: number;
  };
  todayOccupancyRate: number; // percentage e.g. 68
  qrCodeId: string;
  isFavorite?: boolean;
}

export interface FacultyMember {
  id: string;
  name: string; // e.g. "Prof. Harish Kumar"
  shortName: string; // e.g. "Harish Sir"
  title: string; // e.g. "Associate Professor & HOD"
  department: string; // e.g. "Computer Science & Engineering"
  cabinNumber: string; // e.g. "Cabin C-302"
  cabinBlock: CampusBlock; // "C Block"
  cabinFloor: number; // 3
  officeHours: string; // "Mon-Fri 02:00 PM - 04:30 PM"
  email: string;
  phoneExt: string;
  avatarUrl?: string;
  subjects: string[]; // e.g. ['Data Structures', 'DBMS', 'Algorithms']
  currentStatus: FacultyStatus;
  statusMessage?: string; // "Available in Cabin C-302 until 02:00 PM"
  currentClass?: {
    subject: string;
    code: string;
    roomId: string;
    roomName: string;
    batch: string;
    endsAt: string;
    endsInMinutes: number;
  };
  nextClass?: {
    subject: string;
    code: string;
    roomId: string;
    roomName: string;
    batch: string;
    startsAt: string;
    startsInMinutes: number;
  };
  cabinNotes?: string;
  isFavorite?: boolean;
}

export interface TimetableSlot {
  id: string;
  facultyId?: string;
  roomId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // '09:00'
  endTime: string;   // '10:00'
  subject: string;
  code: string;
  teacherName: string;
  teacherDepartment: string;
  batch: string; // 'CSE-3A', 'IT-2B', etc.
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar' | 'Cabin Hours';
}

export interface StudentCabinNote {
  id: string;
  facultyId: string;
  facultyName: string;
  studentName: string;
  studentRoll: string;
  subject: string;
  message: string;
  timestamp: string;
}

export interface StudentReport {
  id: string;
  roomId: string;
  roomName: string;
  reportedBy: string; // "Student #4829" or custom name
  reportedAt: string;
  reason: 'Room Occupied' | 'Faculty Arrived Early' | 'Equipment Malfunction' | 'Noise / Event';
  comment?: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface FacultyReservation {
  id: string;
  roomId: string;
  roomName: string;
  facultyName: string;
  department: string;
  purpose: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
}

export type UserRole = 'student' | 'faculty' | 'admin';

export interface FacultyFilterState {
  search: string;
  departments: string[];
  status: 'all' | 'in_cabin' | 'in_class' | 'stepped_out';
  blocks: CampusBlock[];
  floors: number[];
}

export interface FilterState {
  search: string;
  blocks: CampusBlock[];
  floors: number[];
  capacityRange: [number, number]; // [min, max]
  durationMinutes: number; // 0 (any), 30, 60, 120
  amenities: string[];
  statusFilter: 'all' | 'available' | 'soon' | 'occupied';
  roomType: string;
}

export interface HourlyOccupancy {
  hour: string; // "09:00", "10:00", etc.
  occupiedRooms: number;
  availableRooms: number;
  occupancyPercentage: number;
}

export interface BlockUtilization {
  block: CampusBlock;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  utilizationRate: number;
}

