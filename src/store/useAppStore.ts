import { create } from 'zustand';
import {
  Room,
  RoomStatus,
  TimetableSlot,
  StudentReport,
  FacultyReservation,
  UserRole,
  FilterState,
  CampusBlock,
  FacultyMember,
  FacultyStatus,
  FacultyFilterState,
  StudentCabinNote,
} from '../types';
import { initialRooms } from '../data/mockRooms';
import { initialFaculty } from '../data/mockFaculty';
import { mockTimetableSlots } from '../data/mockTimetable';
import {
  computeRoomAvailability,
  computeFacultyAvailability,
  timeStringToMinutes,
} from '../services/timetableEngine';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppState {
  // Authentication & Role
  currentRole: UserRole;
  facultyName: string;
  activeFacultyId: string;
  setRole: (role: UserRole) => void;
  setFacultyName: (name: string) => void;
  setActiveFacultyId: (id: string) => void;

  // Time Machine & Clock
  simulatedTime: string; // "11:15"
  simulatedDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  isLiveClock: boolean;
  setSimulatedTime: (time: string) => void;
  setSimulatedDay: (day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday') => void;
  toggleLiveClock: () => void;
  resetToCurrentTime: () => void;

  // Faculty & Cabins
  facultyList: FacultyMember[];
  selectedFacultyId: string | null;
  setSelectedFacultyId: (id: string | null) => void;
  favoriteFacultyIds: string[];
  toggleFavoriteFaculty: (facultyId: string) => void;
  facultyOverrides: Record<string, FacultyStatus>;
  setFacultyOverride: (facultyId: string, status: FacultyStatus | null) => void;

  // Faculty Filters
  facultyFilter: FacultyFilterState;
  setFacultyFilter: (filter: Partial<FacultyFilterState>) => void;
  resetFacultyFilter: () => void;

  // Student Cabin Notes / Door Messages
  studentNotes: StudentCabinNote[];
  submitStudentCabinNote: (note: Omit<StudentCabinNote, 'id' | 'timestamp'>) => void;

  // Rooms & Timetable
  rooms: Room[];
  timetableSlots: TimetableSlot[];
  roomOverrides: Record<string, RoomStatus>;
  favoriteRoomIds: string[];
  selectedRoomId: string | null;
  activeView: 'landing' | 'finder' | 'map' | 'analytics' | 'dashboard' | 'admin';

  // Room Filters
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Student Reports
  reports: StudentReport[];
  submitReport: (report: Omit<StudentReport, 'id' | 'reportedAt' | 'status'>) => void;
  resolveReport: (reportId: string, action: 'verify_occupied' | 'restore_free' | 'dismiss') => void;

  // Faculty Reservations
  reservations: FacultyReservation[];
  createReservation: (reservation: Omit<FacultyReservation, 'id' | 'status'>) => void;
  cancelReservation: (reservationId: string) => void;

  // Timetable Operations (Admin)
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  deleteTimetableSlot: (slotId: string) => void;
  importTimetable: (slots: TimetableSlot[]) => void;
  setRoomOverride: (roomId: string, status: RoomStatus | null) => void;

  // Navigation & UI
  setActiveView: (view: 'landing' | 'finder' | 'map' | 'analytics' | 'dashboard' | 'admin') => void;
  setSelectedRoomId: (roomId: string | null) => void;
  toggleFavorite: (roomId: string) => void;

  // Toasts
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;

  // Computed Selectors
  getComputedFaculty: () => FacultyMember[];
  getComputedRooms: () => Room[];
}

const defaultFacultyFilters: FacultyFilterState = {
  search: '',
  departments: [],
  status: 'all',
  blocks: [],
  floors: [],
};

const defaultRoomFilters: FilterState = {
  search: '',
  blocks: [],
  floors: [],
  capacityRange: [0, 200],
  durationMinutes: 0,
  amenities: [],
  statusFilter: 'all',
  roomType: 'all',
};

export const useAppStore = create<AppState>((set, get) => ({
  // Authentication & Role
  currentRole: 'student',
  facultyName: 'Prof. Harish Kumar',
  activeFacultyId: 'fac-harish',
  setRole: (role) => set({ currentRole: role }),
  setFacultyName: (name) => set({ facultyName: name }),
  setActiveFacultyId: (id) => set({ activeFacultyId: id }),

  // Time Machine & Clock
  simulatedTime: '11:15',
  simulatedDay: 'Monday',
  isLiveClock: false,
  setSimulatedTime: (time) => set({ simulatedTime: time }),
  setSimulatedDay: (day) => set({ simulatedDay: day }),
  toggleLiveClock: () => set((state) => ({ isLiveClock: !state.isLiveClock })),
  resetToCurrentTime: () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    set({ simulatedTime: `${hours}:${minutes}`, isLiveClock: true });
  },

  // Faculty & Cabins
  facultyList: initialFaculty,
  selectedFacultyId: null,
  setSelectedFacultyId: (id) => set({ selectedFacultyId: id }),
  favoriteFacultyIds: ['fac-harish', 'fac-sharma', 'fac-rao'],
  toggleFavoriteFaculty: (facultyId) => {
    set((state) => {
      const exists = state.favoriteFacultyIds.includes(facultyId);
      return {
        favoriteFacultyIds: exists
          ? state.favoriteFacultyIds.filter((id) => id !== facultyId)
          : [...state.favoriteFacultyIds, facultyId],
      };
    });
  },
  facultyOverrides: {},
  setFacultyOverride: (facultyId, status) => {
    set((state) => {
      const updated = { ...state.facultyOverrides };
      if (status === null) {
        delete updated[facultyId];
      } else {
        updated[facultyId] = status;
      }
      return { facultyOverrides: updated };
    });
    get().addToast({
      type: 'success',
      title: 'Cabin Status Updated',
      message: status ? `Status updated to ${status.replace('_', ' ').toUpperCase()}` : 'Reset to automatic timetable schedule',
    });
  },

  // Faculty Filters
  facultyFilter: defaultFacultyFilters,
  setFacultyFilter: (newFilters) =>
    set((state) => ({
      facultyFilter: { ...state.facultyFilter, ...newFilters },
    })),
  resetFacultyFilter: () => set({ facultyFilter: defaultFacultyFilters }),

  // Student Cabin Notes / Door Messages
  studentNotes: [
    {
      id: 'note-1',
      facultyId: 'fac-harish',
      facultyName: 'Prof. Harish Kumar',
      studentName: 'Aarav Patel (CSE-3B)',
      studentRoll: '2024-CSE-042',
      subject: 'DBMS Assignment 2 doubt & ER diagram review',
      message: 'Hello Harish Sir, I came to your cabin regarding Normalization doubt in Question 4. I will visit again around 12:15 PM once your DBMS class finishes.',
      timestamp: '11:05 AM',
    },
    {
      id: 'note-2',
      facultyId: 'fac-harish',
      facultyName: 'Prof. Harish Kumar',
      studentName: 'Ananya Gupta (CSE-7A)',
      studentRoll: '2022-CSE-018',
      subject: 'Final Year Capstone Project Sign-off',
      message: 'Sir, our team has completed the indexing optimization module. We need your signature on the project review form.',
      timestamp: '10:30 AM',
    },
  ],
  submitStudentCabinNote: (noteData) => {
    const newNote: StudentCabinNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    set((state) => ({
      studentNotes: [newNote, ...state.studentNotes],
    }));
    get().addToast({
      type: 'success',
      title: 'Cabin Note Left',
      message: `Your note has been submitted to ${noteData.facultyName}'s cabin portal.`,
    });
  },

  // Rooms & Timetable
  rooms: initialRooms,
  timetableSlots: mockTimetableSlots,
  roomOverrides: {},
  favoriteRoomIds: ['c-204', 'd-301'],
  selectedRoomId: null,
  activeView: 'landing',

  // Room Filters
  filters: defaultRoomFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultRoomFilters }),

  // Student Reports
  reports: [
    {
      id: 'rep-1',
      roomId: 'c-205',
      roomName: 'C-205',
      reportedBy: 'Student #3912',
      reportedAt: '10:45 AM',
      reason: 'Room Occupied',
      comment: 'Ad-hoc project group occupying the room with laptops connected.',
      status: 'pending',
    },
  ],
  submitReport: (reportData) => {
    const newReport: StudentReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
    };

    set((state) => ({
      reports: [newReport, ...state.reports],
      roomOverrides: {
        ...state.roomOverrides,
        [reportData.roomId]: 'verification_needed',
      },
    }));

    get().addToast({
      type: 'warning',
      title: 'Report Submitted',
      message: `${reportData.roomName} marked for verification. Admin notified.`,
    });
  },
  resolveReport: (reportId, action) => {
    set((state) => {
      const report = state.reports.find((r) => r.id === reportId);
      if (!report) return state;

      const updatedOverrides = { ...state.roomOverrides };
      if (action === 'verify_occupied') {
        updatedOverrides[report.roomId] = 'occupied';
      } else if (action === 'restore_free' || action === 'dismiss') {
        delete updatedOverrides[report.roomId];
      }

      return {
        reports: state.reports.map((r) => (r.id === reportId ? { ...r, status: 'resolved' as const } : r)),
        roomOverrides: updatedOverrides,
      };
    });

    get().addToast({
      type: 'success',
      title: 'Report Resolved',
      message: `Room status updated successfully.`,
    });
  },

  reservations: [
    {
      id: 'res-1',
      roomId: 'b-201',
      roomName: 'B-201',
      facultyName: 'Prof. Harish Kumar',
      department: 'CSE',
      purpose: 'Guest Lecture & Hackathon Prep',
      startTime: '15:00',
      endTime: '17:00',
      date: '2026-09-08',
      status: 'active',
    },
  ],
  createReservation: (resData) => {
    const newRes: FacultyReservation = {
      ...resData,
      id: `res-${Date.now()}`,
      status: 'active',
    };
    set((state) => ({
      reservations: [newRes, ...state.reservations],
      roomOverrides: {
        ...state.roomOverrides,
        [resData.roomId]: 'reserved',
      },
    }));

    get().addToast({
      type: 'success',
      title: 'Reservation Confirmed',
      message: `${resData.roomName} reserved from ${resData.startTime} to ${resData.endTime}.`,
    });
  },
  cancelReservation: (reservationId) => {
    set((state) => {
      const res = state.reservations.find((r) => r.id === reservationId);
      const updatedOverrides = { ...state.roomOverrides };
      if (res) {
        delete updatedOverrides[res.roomId];
      }
      return {
        reservations: state.reservations.filter((r) => r.id !== reservationId),
        roomOverrides: updatedOverrides,
      };
    });
    get().addToast({
      type: 'info',
      title: 'Reservation Released',
      message: 'Room is now available for other students and faculty.',
    });
  },

  addTimetableSlot: (slotData) => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: `ts-${Date.now()}`,
    };
    set((state) => ({
      timetableSlots: [...state.timetableSlots, newSlot],
    }));
    get().addToast({
      type: 'success',
      title: 'Slot Added',
      message: `Scheduled ${slotData.subject} in ${slotData.roomId.toUpperCase()}.`,
    });
  },
  deleteTimetableSlot: (slotId) => {
    set((state) => ({
      timetableSlots: state.timetableSlots.filter((s) => s.id !== slotId),
    }));
    get().addToast({
      type: 'info',
      title: 'Slot Removed',
      message: 'Class schedule updated.',
    });
  },
  importTimetable: (newSlots) => {
    set((state) => ({
      timetableSlots: [...state.timetableSlots, ...newSlots],
    }));
    get().addToast({
      type: 'success',
      title: 'Timetable Imported',
      message: `Successfully loaded ${newSlots.length} schedule entries.`,
    });
  },
  setRoomOverride: (roomId, status) => {
    set((state) => {
      const updated = { ...state.roomOverrides };
      if (status === null) {
        delete updated[roomId];
      } else {
        updated[roomId] = status;
      }
      return { roomOverrides: updated };
    });
  },

  setActiveView: (view) => set({ activeView: view }),
  setSelectedRoomId: (roomId) => set({ selectedRoomId: roomId }),
  toggleFavorite: (roomId) => {
    set((state) => {
      const exists = state.favoriteRoomIds.includes(roomId);
      return {
        favoriteRoomIds: exists
          ? state.favoriteRoomIds.filter((id) => id !== roomId)
          : [...state.favoriteRoomIds, roomId],
      };
    });
  },

  toasts: [],
  addToast: (toastData) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toastData, id }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4500);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Computed Faculty Selector (evaluates live timetable against simulated time & day)
  getComputedFaculty: () => {
    const {
      facultyList,
      timetableSlots,
      simulatedTime,
      simulatedDay,
      facultyOverrides,
      favoriteFacultyIds,
    } = get();

    return facultyList.map((faculty) => {
      const override = facultyOverrides[faculty.id];
      const comp = computeFacultyAvailability(
        faculty,
        simulatedDay,
        simulatedTime,
        timetableSlots,
        override
      );

      return {
        ...faculty,
        currentStatus: comp.status,
        statusMessage: comp.statusMessage,
        currentClass: comp.currentClass,
        nextClass: comp.nextClass,
        isFavorite: favoriteFacultyIds.includes(faculty.id),
      };
    });
  },

  getComputedRooms: () => {
    const { rooms, timetableSlots, simulatedTime, simulatedDay, roomOverrides, favoriteRoomIds } = get();
    return rooms.map((room) => {
      const override = roomOverrides[room.id];
      const comp = computeRoomAvailability(room, simulatedDay, simulatedTime, timetableSlots, override);

      let finalStatus: RoomStatus = override || comp.status;

      return {
        ...room,
        currentStatus: finalStatus,
        availableUntil: comp.availableUntil || room.availableUntil,
        nextClass: comp.nextClass,
        isFavorite: favoriteRoomIds.includes(room.id),
      };
    });
  },
}));
