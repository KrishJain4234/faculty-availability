import React from 'react';
import { RoomStatus } from '../../types';

interface BadgeProps {
  status?: RoomStatus;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const StatusBadge: React.FC<{ status: RoomStatus; size?: 'sm' | 'md' | 'lg'; pulse?: boolean }> = ({
  status,
  size = 'md',
  pulse = true,
}) => {
  const configs = {
    available: {
      label: 'Available',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      pulseColor: 'bg-emerald-400',
    },
    soon: {
      label: 'Occupied Soon',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dotColor: 'bg-amber-500',
      pulseColor: 'bg-amber-400',
    },
    occupied: {
      label: 'Occupied',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dotColor: 'bg-rose-500',
      pulseColor: 'bg-rose-400',
    },
    verification_needed: {
      label: 'Verification Needed',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      dotColor: 'bg-purple-500',
      pulseColor: 'bg-purple-400',
    },
    reserved: {
      label: 'Faculty Reserved',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dotColor: 'bg-blue-500',
      pulseColor: 'bg-blue-400',
    },
  };

  const config = configs[status] || configs.available;

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeStyles[size]} transition-all duration-200 shadow-sm`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && status === 'available' && (
          <span className={`animate-ping-slow absolute inline-flex h-full w-full rounded-full opacity-75 ${config.pulseColor}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotColor}`} />
      </span>
      <span>{config.label}</span>
    </span>
  );
};

export const AmenityBadge: React.FC<{ label: string; icon?: React.ReactNode }> = ({ label, icon }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100/80 text-slate-700 border border-slate-200 hover:bg-slate-200/60 transition-colors">
    {icon}
    {label}
  </span>
);

export const FacultyStatusBadge: React.FC<{
  status: import('../../types').FacultyStatus;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}> = ({ status, size = 'md', pulse = true }) => {
  const configs = {
    in_cabin: {
      label: 'In Cabin (Available)',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
      dotColor: 'bg-emerald-500',
      pulseColor: 'bg-emerald-400',
    },
    in_class: {
      label: 'In Class (Teaching)',
      bg: 'bg-rose-50 text-rose-800 border-rose-300 font-semibold',
      dotColor: 'bg-rose-500',
      pulseColor: 'bg-rose-400',
    },
    stepped_out: {
      label: 'Stepped Out (~15m)',
      bg: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',
      dotColor: 'bg-amber-500',
      pulseColor: 'bg-amber-400',
    },
    in_meeting: {
      label: 'In Meeting',
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-300 font-semibold',
      dotColor: 'bg-indigo-500',
      pulseColor: 'bg-indigo-400',
    },
    on_leave: {
      label: 'On Leave Today',
      bg: 'bg-slate-100 text-slate-600 border-slate-300 font-semibold',
      dotColor: 'bg-slate-400',
      pulseColor: 'bg-slate-300',
    },
  };

  const config = configs[status] || configs.in_cabin;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeStyles[size]} transition-all duration-200 shadow-xs`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (status === 'in_cabin' || status === 'in_class') && (
          <span
            className={`animate-ping-slow absolute inline-flex h-full w-full rounded-full opacity-75 ${config.pulseColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotColor}`} />
      </span>
      <span>{config.label}</span>
    </span>
  );
};

