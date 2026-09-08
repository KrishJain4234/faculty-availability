import { Room, RoomStatus, TimetableSlot, FacultyMember, FacultyStatus } from '../types';

/**
 * Converts a time string "HH:MM" (24h) to total minutes from midnight
 */
export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Formats minutes from midnight into 12-hour format e.g. 1:00 PM
 */
export function minutesTo12Hour(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const padMin = m < 10 ? `0${m}` : m;
  return `${h12}:${padMin} ${period}`;
}

/**
 * Given a faculty member, day, current simulated time "HH:MM", and all timetable slots,
 * calculates the accurate live availability status, whether they are in their cabin or teaching in class,
 * and when they will be back in their cabin.
 */
export function computeFacultyAvailability(
  faculty: FacultyMember,
  day: string,
  currentTimeStr: string,
  allSlots: TimetableSlot[],
  overrideStatus?: FacultyStatus
): {
  status: FacultyStatus;
  statusMessage: string;
  currentClass?: FacultyMember['currentClass'];
  nextClass?: FacultyMember['nextClass'];
  availableUntil?: string;
  currentLocation: string; // e.g. "Cabin C-302" or "Room C-204"
} {
  // Check for manual faculty status override
  if (overrideStatus) {
    if (overrideStatus === 'stepped_out') {
      return {
        status: 'stepped_out',
        statusMessage: `Stepped out briefly • Expected back in ${faculty.cabinNumber} in ~15 mins`,
        currentLocation: faculty.cabinNumber,
        availableUntil: 'Stepped Out',
      };
    }
    if (overrideStatus === 'in_meeting') {
      return {
        status: 'in_meeting',
        statusMessage: `In Faculty Board / Department Meeting • Rejoining cabin later`,
        currentLocation: 'Conference Hall',
        availableUntil: 'In Meeting',
      };
    }
    if (overrideStatus === 'on_leave') {
      return {
        status: 'on_leave',
        statusMessage: `On approved leave today • Not available in cabin`,
        currentLocation: 'Off Campus',
        availableUntil: 'On Leave',
      };
    }
  }

  const currentMinutes = timeStringToMinutes(currentTimeStr);

  // Filter slots for this specific teacher and day, sorted chronologically
  const teacherSlots = allSlots
    .filter((slot) => {
      if (slot.facultyId && slot.facultyId === faculty.id) return true;
      if (slot.teacherName && (
        slot.teacherName === faculty.name ||
        slot.teacherName.toLowerCase().includes(faculty.shortName.toLowerCase()) ||
        faculty.name.toLowerCase().includes(slot.teacherName.toLowerCase())
      )) {
        return true;
      }
      return false;
    })
    .filter((slot) => slot.day === day)
    .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

  // Check if there is an active class/lecture being taught right now
  const activeSlot = teacherSlots.find((slot) => {
    const startMin = timeStringToMinutes(slot.startTime);
    const endMin = timeStringToMinutes(slot.endTime);
    return currentMinutes >= startMin && currentMinutes < endMin;
  });

  if (activeSlot) {
    // Faculty is currently teaching in a classroom!
    const endMin = timeStringToMinutes(activeSlot.endTime);
    const minutesLeft = endMin - currentMinutes;
    const roomDisplayName = activeSlot.roomId.toUpperCase();

    // Find next class after this one
    const futureSlots = teacherSlots.filter((slot) => timeStringToMinutes(slot.startTime) >= endMin);
    const nextSlot = futureSlots[0];

    const currentClassInfo = {
      subject: activeSlot.subject,
      code: activeSlot.code,
      roomId: activeSlot.roomId,
      roomName: roomDisplayName,
      batch: activeSlot.batch,
      endsAt: minutesTo12Hour(endMin),
      endsInMinutes: minutesLeft,
    };

    const nextClassInfo = nextSlot
      ? {
          subject: nextSlot.subject,
          code: nextSlot.code,
          roomId: nextSlot.roomId,
          roomName: nextSlot.roomId.toUpperCase(),
          batch: nextSlot.batch,
          startsAt: minutesTo12Hour(timeStringToMinutes(nextSlot.startTime)),
          startsInMinutes: timeStringToMinutes(nextSlot.startTime) - currentMinutes,
        }
      : undefined;

    return {
      status: 'in_class',
      statusMessage: `Teaching ${activeSlot.subject} in Room ${roomDisplayName} • Returns to ${faculty.cabinNumber} at ${minutesTo12Hour(endMin)}`,
      currentLocation: `Room ${roomDisplayName}`,
      availableUntil: `Back in Cabin at ${minutesTo12Hour(endMin)}`,
      currentClass: currentClassInfo,
      nextClass: nextClassInfo,
    };
  }

  // Faculty does NOT have a class right now -> They are in their CABIN!
  const upcomingSlots = teacherSlots.filter((slot) => timeStringToMinutes(slot.startTime) > currentMinutes);

  if (upcomingSlots.length === 0) {
    // Free in cabin for the rest of working day
    return {
      status: 'in_cabin',
      statusMessage: `In ${faculty.cabinNumber} • Available for doubts & queries (Rest of Day)`,
      currentLocation: faculty.cabinNumber,
      availableUntil: '05:00 PM (Rest of Day)',
      nextClass: undefined,
    };
  }

  const nextSlot = upcomingSlots[0];
  const nextStartMin = timeStringToMinutes(nextSlot.startTime);
  const minutesUntilNext = nextStartMin - currentMinutes;

  const nextClassInfo = {
    subject: nextSlot.subject,
    code: nextSlot.code,
    roomId: nextSlot.roomId,
    roomName: nextSlot.roomId.toUpperCase(),
    batch: nextSlot.batch,
    startsAt: minutesTo12Hour(nextStartMin),
    startsInMinutes: minutesUntilNext,
  };

  return {
    status: 'in_cabin',
    statusMessage: `In ${faculty.cabinNumber} • Available until ${minutesTo12Hour(nextStartMin)} (Next: ${nextSlot.subject} in ${nextSlot.roomId.toUpperCase()})`,
    currentLocation: faculty.cabinNumber,
    availableUntil: `In Cabin until ${minutesTo12Hour(nextStartMin)} (${minutesUntilNext} min left)`,
    nextClass: nextClassInfo,
  };
}

/**
 * Generates an hourly breakdown (8 AM to 6 PM) for a faculty member's schedule today:
 * indicates whether they are in their cabin or teaching in a specific classroom.
 */
export function getFacultyDailyTimeline(
  faculty: FacultyMember,
  day: string,
  allSlots: TimetableSlot[]
): Array<{
  hourLabel: string;
  startHour: number;
  location: string; // "Cabin C-302" or "Room C-204"
  activity: string; // "Available in Cabin" or "Lecture: DBMS (CS204)"
  type: 'cabin' | 'lecture' | 'lab' | 'tutorial';
  slot?: TimetableSlot;
}> {
  const teacherSlots = allSlots.filter((slot) => {
    if (slot.facultyId && slot.facultyId === faculty.id) return true;
    if (slot.teacherName && (
      slot.teacherName === faculty.name ||
      slot.teacherName.toLowerCase().includes(faculty.shortName.toLowerCase()) ||
      faculty.name.toLowerCase().includes(slot.teacherName.toLowerCase())
    )) {
      return true;
    }
    return false;
  }).filter((s) => s.day === day);

  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]; // 8 AM to 5 PM slots

  return hours.map((hour) => {
    const hourStartMin = hour * 60;
    const hourEndMin = (hour + 1) * 60;

    const matchingSlot = teacherSlots.find((s) => {
      const sStart = timeStringToMinutes(s.startTime);
      const sEnd = timeStringToMinutes(s.endTime);
      return Math.max(hourStartMin, sStart) < Math.min(hourEndMin, sEnd);
    });

    const hourLabel = hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;

    if (matchingSlot) {
      return {
        hourLabel,
        startHour: hour,
        location: `Room ${matchingSlot.roomId.toUpperCase()}`,
        activity: `${matchingSlot.type}: ${matchingSlot.subject} (${matchingSlot.batch})`,
        type: matchingSlot.type === 'Lab' ? 'lab' : matchingSlot.type === 'Tutorial' ? 'tutorial' : 'lecture',
        slot: matchingSlot,
      };
    }

    return {
      hourLabel,
      startHour: hour,
      location: faculty.cabinNumber,
      activity: 'In Cabin (Available for Consultations)',
      type: 'cabin',
    };
  });
}

/**
 * Given a room, day, current simulated time "HH:MM", and all timetable slots,
 * calculates the accurate live availability status, "available until" time, and next class.
 */
export function computeRoomAvailability(
  room: Room,
  day: string,
  currentTimeStr: string,
  allSlots: TimetableSlot[],
  overrideStatus?: RoomStatus
): {
  status: RoomStatus;
  availableUntil?: string;
  nextClass?: Room['nextClass'];
  currentClass?: TimetableSlot;
} {
  if (overrideStatus && overrideStatus === 'verification_needed') {
    return {
      status: 'verification_needed',
      availableUntil: 'Under Review',
      nextClass: room.nextClass,
    };
  }

  const currentMinutes = timeStringToMinutes(currentTimeStr);

  // Filter slots for this specific room and day, sorted chronologically
  const daySlots = allSlots
    .filter((slot) => slot.roomId === room.id && slot.day === day)
    .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

  // Check if there is a class actively running right now
  const activeSlot = daySlots.find((slot) => {
    const startMin = timeStringToMinutes(slot.startTime);
    const endMin = timeStringToMinutes(slot.endTime);
    return currentMinutes >= startMin && currentMinutes < endMin;
  });

  if (activeSlot) {
    // Room is currently occupied
    const endMin = timeStringToMinutes(activeSlot.endTime);
    // Find next class after this one
    const futureSlots = daySlots.filter((slot) => timeStringToMinutes(slot.startTime) >= endMin);
    const nextSlot = futureSlots[0];

    return {
      status: 'occupied',
      availableUntil: `Occupied until ${minutesTo12Hour(endMin)}`,
      currentClass: activeSlot,
      nextClass: nextSlot
        ? {
            subject: nextSlot.subject,
            code: nextSlot.code,
            teacher: nextSlot.teacherName,
            time: minutesTo12Hour(timeStringToMinutes(nextSlot.startTime)),
            startsInMinutes: timeStringToMinutes(nextSlot.startTime) - currentMinutes,
          }
        : undefined,
    };
  }

  // Room is NOT occupied right now. Find the upcoming class today.
  const upcomingSlots = daySlots.filter((slot) => timeStringToMinutes(slot.startTime) > currentMinutes);

  if (upcomingSlots.length === 0) {
    // Free for the rest of college hours (e.g. 6:00 PM)
    return {
      status: 'available',
      availableUntil: '6:00 PM (Rest of Day)',
      nextClass: undefined,
    };
  }

  const nextSlot = upcomingSlots[0];
  const nextStartMin = timeStringToMinutes(nextSlot.startTime);
  const minutesUntilNext = nextStartMin - currentMinutes;

  const nextClassInfo = {
    subject: nextSlot.subject,
    code: nextSlot.code,
    teacher: nextSlot.teacherName,
    time: minutesTo12Hour(nextStartMin),
    startsInMinutes: minutesUntilNext,
  };

  // If next class is starting within 30 minutes, status is 'soon' (Occupied Soon / Yellow)
  if (minutesUntilNext <= 30) {
    return {
      status: 'soon',
      availableUntil: `${minutesTo12Hour(nextStartMin)} (${minutesUntilNext} min left)`,
      nextClass: nextClassInfo,
    };
  }

  // Otherwise, safely available
  return {
    status: 'available',
    availableUntil: minutesTo12Hour(nextStartMin),
    nextClass: nextClassInfo,
  };
}

/**
 * Generates an hourly breakdown (8 AM to 6 PM) for room timeline visualization
 */
export function getRoomDailyTimeline(
  roomId: string,
  day: string,
  allSlots: TimetableSlot[]
): Array<{
  hourLabel: string;
  startHour: number;
  slot?: TimetableSlot;
  isFree: boolean;
}> {
  const roomSlots = allSlots.filter((s) => s.roomId === roomId && s.day === day);
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]; // 8 AM to 5 PM slots

  return hours.map((hour) => {
    const hourStartMin = hour * 60;
    const hourEndMin = (hour + 1) * 60;

    const matchingSlot = roomSlots.find((s) => {
      const sStart = timeStringToMinutes(s.startTime);
      const sEnd = timeStringToMinutes(s.endTime);
      return Math.max(hourStartMin, sStart) < Math.min(hourEndMin, sEnd);
    });

    const hourLabel = hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;

    return {
      hourLabel,
      startHour: hour,
      slot: matchingSlot,
      isFree: !matchingSlot,
    };
  });
}

