import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';
import {
  Compass,
  MapPin,
  BarChart3,
  UserCheck,
  GraduationCap,
  ShieldCheck,
  Search,
  Layers,
  Cpu,
  Building2,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSimulator }) => {
  const { activeView, setActiveView, currentRole, setRole, getComputedFaculty, setFacultyFilter } = useAppStore();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const facultyMembers = getComputedFaculty();
  const inCabinCount = facultyMembers.filter((f) => f.currentStatus === 'in_cabin').length;

  const navLinks = [
    { id: 'finder', label: 'Faculty & Cabins', icon: <Compass className="w-4 h-4" /> },
    { id: 'map', label: 'Campus & Cabin Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const roles: { role: UserRole; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: 'student',
      title: 'Student Portal',
      desc: 'Track faculty cabins & leave notes',
      icon: <GraduationCap className="w-4 h-4 text-blue-600" />,
    },
    {
      role: 'faculty',
      title: 'Faculty Cabin Portal',
      desc: 'Set live cabin status & view schedule',
      icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
    },
    {
      role: 'admin',
      title: 'Admin Panel',
      desc: 'Manage timetables & faculty wings',
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand / Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform duration-200">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">FacultySync</span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{inCabinCount} Faculty in Cabin Now</span>
                </div>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveView(link.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </button>
                );
              })}

              {/* Portal Tab */}
              <button
                onClick={() => setActiveView(currentRole === 'admin' ? 'admin' : 'dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeView === 'dashboard' || activeView === 'admin'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {currentRole === 'admin' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    Admin Panel
                  </>
                ) : currentRole === 'faculty' ? (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    Faculty Space
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    Student Space
                  </>
                )}
              </button>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            
            {/* Future Architecture simulator button */}
            <button
              onClick={onOpenSimulator}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors shadow-xs"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>RFID / IoT Doors</span>
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all text-xs font-medium text-slate-800 shadow-xs"
              >
                <span className="text-slate-400 font-normal">Role:</span>
                <span className="font-semibold capitalize text-slate-900 flex items-center gap-1.5">
                  {currentRole === 'student' && <GraduationCap className="w-3.5 h-3.5 text-blue-600" />}
                  {currentRole === 'faculty' && <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  {currentRole === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />}
                  {currentRole}
                </span>
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-premium border border-slate-200 py-1 z-50 animate-fadeIn"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                      Switch Role Mode
                    </p>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setRole(r.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                        currentRole === r.role ? 'bg-blue-50/50 border-l-2 border-blue-600' : ''
                      }`}
                    >
                      <div className="mt-0.5 p-1 rounded-md bg-slate-100">{r.icon}</div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{r.title}</div>
                        <div className="text-[11px] text-slate-500 leading-tight">{r.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Find CTA */}
            <button
              onClick={() => setActiveView('finder')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm hover:shadow-glow-primary transition-all flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Find Faculty Cabin</span>
              <span className="sm:hidden">Find</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
