import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Room, FacultyMember } from './types';
import { Navbar } from './components/layout/Navbar';
import { TimeMachineBar } from './components/layout/TimeMachineBar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';

import { LandingHero } from './components/landing/LandingHero';
import { StatsSection } from './components/landing/StatsSection';
import { FeatureGrid } from './components/landing/FeatureGrid';

import { FacultyFilterBar } from './components/finder/FacultyFilterBar';
import { FacultyGrid } from './components/finder/FacultyGrid';

import { CampusMap } from './components/map/CampusMap';
import { AnalyticsView } from './components/analytics/AnalyticsView';

import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { FacultyDashboard } from './components/dashboard/FacultyDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';

import { FacultyDetailModal } from './components/room/FacultyDetailModal';
import { StudentNoteModal } from './components/room/StudentNoteModal';
import { RoomDetailModal } from './components/room/RoomDetailModal';
import { ReportOccupiedModal } from './components/room/ReportOccupiedModal';
import { FacultyReserveModal } from './components/room/FacultyReserveModal';
import { QRCheckInModal } from './components/room/QRCheckInModal';
import { FutureReadyModal } from './components/simulator/FutureReadyModal';

export const App: React.FC = () => {
  const {
    activeView,
    currentRole,
    selectedRoomId,
    setSelectedRoomId,
    selectedFacultyId,
    setSelectedFacultyId,
    getComputedRooms,
    getComputedFaculty,
  } = useAppStore();

  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [noteFaculty, setNoteFaculty] = useState<FacultyMember | null>(null);

  const [reportRoom, setReportRoom] = useState<Room | null>(null);
  const [reserveRoom, setReserveRoom] = useState<Room | null>(null);
  const [qrRoom, setQrRoom] = useState<Room | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);

  const rooms = getComputedRooms();
  const allFaculty = getComputedFaculty();

  const activeSelectedRoom = selectedRoomId
    ? rooms.find((r) => r.id === selectedRoomId) || null
    : null;

  const activeModalFaculty = selectedFacultyId
    ? allFaculty.find((f) => f.id === selectedFacultyId) || selectedFaculty
    : selectedFaculty;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      
      {/* 1. Time Machine Simulation Bar */}
      <TimeMachineBar />

      {/* 2. Main Navigation Bar */}
      <Navbar onOpenSimulator={() => setIsSimulatorOpen(true)} />

      {/* 3. Dynamic Page View Rendering */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* VIEW: Landing Page */}
        {activeView === 'landing' && (
          <div className="space-y-4">
            <LandingHero />
            <StatsSection />
            <FeatureGrid onOpenSimulator={() => setIsSimulatorOpen(true)} />
          </div>
        )}

        {/* VIEW: Live Faculty Availability & Cabin Locator */}
        {activeView === 'finder' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Faculty Availability & Cabin Locator
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Find where your professors are right now — in their cabin or lecturing in a classroom. Live status calculated automatically from their teaching timetable.
              </p>
            </div>
            <FacultyFilterBar />
            <FacultyGrid
              onOpenDetail={(f) => setSelectedFaculty(f)}
              onOpenNote={(f) => setNoteFaculty(f)}
            />
          </div>
        )}

        {/* VIEW: Interactive Campus Map & Cabin Wings */}
        {activeView === 'map' && (
          <CampusMap
            onOpenDetail={(f) => setSelectedFaculty(f)}
            onOpenReport={(r) => setReportRoom(r)}
            onOpenQR={(r) => setQrRoom(r)}
          />
        )}

        {/* VIEW: Analytics & Heatmaps */}
        {activeView === 'analytics' && <AnalyticsView />}

        {/* VIEW: Role Dashboards */}
        {activeView === 'dashboard' && (
          <div>
            {currentRole === 'faculty' ? (
              <FacultyDashboard onOpenReserve={(r) => setReserveRoom(r)} />
            ) : (
              <StudentDashboard
                onOpenDetail={(f) => setSelectedFaculty(f)}
                onOpenNote={(f) => setNoteFaculty(f)}
              />
            )}
          </div>
        )}

        {/* VIEW: Admin Panel */}
        {activeView === 'admin' && <AdminDashboard />}

      </main>

      {/* 4. Global Footer */}
      <Footer onOpenSimulator={() => setIsSimulatorOpen(true)} />

      {/* 5. Modals Container */}
      <FacultyDetailModal
        faculty={activeModalFaculty}
        onClose={() => {
          setSelectedFaculty(null);
          setSelectedFacultyId(null);
        }}
        onOpenNote={(f) => setNoteFaculty(f)}
      />

      <StudentNoteModal
        faculty={noteFaculty}
        onClose={() => setNoteFaculty(null)}
      />

      <RoomDetailModal
        room={activeSelectedRoom}
        onClose={() => setSelectedRoomId(null)}
        onOpenReport={(r) => setReportRoom(r)}
        onOpenQR={(r) => setQrRoom(r)}
        onOpenReserve={(r) => setReserveRoom(r)}
      />

      <ReportOccupiedModal
        room={reportRoom}
        onClose={() => setReportRoom(null)}
      />

      <FacultyReserveModal
        room={reserveRoom}
        onClose={() => setReserveRoom(null)}
      />

      <QRCheckInModal
        room={qrRoom}
        onClose={() => setQrRoom(null)}
      />

      <FutureReadyModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      {/* 6. Toast Notifications */}
      <ToastContainer />

    </div>
  );
};

export default App;
