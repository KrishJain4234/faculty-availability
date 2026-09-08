import { HourlyOccupancy, BlockUtilization } from '../types';

export const mockHourlyOccupancy: HourlyOccupancy[] = [
  { hour: '08:00 AM', occupiedRooms: 2, availableRooms: 16, occupancyPercentage: 11 },
  { hour: '09:00 AM', occupiedRooms: 7, availableRooms: 11, occupancyPercentage: 39 },
  { hour: '10:00 AM', occupiedRooms: 12, availableRooms: 6, occupancyPercentage: 67 },
  { hour: '11:00 AM', occupiedRooms: 15, availableRooms: 3, occupancyPercentage: 83 },
  { hour: '12:00 PM', occupiedRooms: 13, availableRooms: 5, occupancyPercentage: 72 },
  { hour: '01:00 PM', occupiedRooms: 6, availableRooms: 12, occupancyPercentage: 33 }, // Lunch break dip
  { hour: '02:00 PM', occupiedRooms: 14, availableRooms: 4, occupancyPercentage: 78 },
  { hour: '03:00 PM', occupiedRooms: 11, availableRooms: 7, occupancyPercentage: 61 },
  { hour: '04:00 PM', occupiedRooms: 6, availableRooms: 12, occupancyPercentage: 33 },
  { hour: '05:00 PM', occupiedRooms: 3, availableRooms: 15, occupancyPercentage: 17 },
  { hour: '06:00 PM', occupiedRooms: 1, availableRooms: 17, occupancyPercentage: 6 },
];

export const mockBlockUtilization: BlockUtilization[] = [
  { block: 'C Block', totalRooms: 5, occupiedRooms: 3, availableRooms: 2, utilizationRate: 60 },
  { block: 'D Block', totalRooms: 4, occupiedRooms: 3, availableRooms: 1, utilizationRate: 75 },
  { block: 'B Block', totalRooms: 5, occupiedRooms: 2, availableRooms: 3, utilizationRate: 40 },
  { block: 'A Block', totalRooms: 4, occupiedRooms: 2, availableRooms: 2, utilizationRate: 50 },
];

export const mockRoomLeaderboard = {
  mostUsed: [
    { roomName: 'D-301 (AI Lab)', block: 'D Block', weeklyHours: 34, utilization: '85%' },
    { roomName: 'C-101 (Lecture Hall)', block: 'C Block', weeklyHours: 32, utilization: '80%' },
    { roomName: 'A-203 (Mech Core)', block: 'A Block', weeklyHours: 30, utilization: '75%' },
    { roomName: 'B-107 (IT Lecture)', block: 'B Block', weeklyHours: 28, utilization: '70%' },
  ],
  leastUsed: [
    { roomName: 'A-104 (Discussion Room)', block: 'A Block', weeklyHours: 8, utilization: '20%' },
    { roomName: 'B-204 (Discussion Room)', block: 'B Block', weeklyHours: 11, utilization: '27%' },
    { roomName: 'C-102 (Discussion Room)', block: 'C Block', weeklyHours: 14, utilization: '35%' },
    { roomName: 'D-105 (Seminar Hall)', block: 'D Block', weeklyHours: 16, utilization: '40%' },
  ],
};

export const mockHeatmapData = [
  { day: 'Mon', '9 AM': 45, '10 AM': 75, '11 AM': 90, '12 PM': 80, '1 PM': 30, '2 PM': 85, '3 PM': 65, '4 PM': 40 },
  { day: 'Tue', '9 AM': 50, '10 AM': 80, '11 AM': 85, '12 PM': 75, '1 PM': 35, '2 PM': 70, '3 PM': 60, '4 PM': 30 },
  { day: 'Wed', '9 AM': 40, '10 AM': 70, '11 AM': 95, '12 PM': 85, '1 PM': 25, '2 PM': 90, '3 PM': 75, '4 PM': 45 },
  { day: 'Thu', '9 AM': 55, '10 AM': 85, '11 AM': 80, '12 PM': 70, '1 PM': 30, '2 PM': 80, '3 PM': 50, '4 PM': 25 },
  { day: 'Fri', '9 AM': 60, '10 AM': 90, '11 AM': 85, '12 PM': 65, '1 PM': 20, '2 PM': 55, '3 PM': 40, '4 PM': 20 },
];
