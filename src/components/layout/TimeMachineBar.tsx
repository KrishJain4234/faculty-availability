import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Clock, Play, RotateCcw, Calendar, SlidersHorizontal, Sparkles } from 'lucide-react';
import { minutesTo12Hour, timeStringToMinutes } from '../../services/timetableEngine';

export const TimeMachineBar: React.FC = () => {
  const {
    simulatedTime,
    simulatedDay,
    isLiveClock,
    setSimulatedTime,
    setSimulatedDay,
    toggleLiveClock,
    resetToCurrentTime,
  } = useAppStore();

  const currentMinutes = timeStringToMinutes(simulatedTime);

  const presets = [
    { label: '9:00 AM (Morning)', time: '09:00' },
    { label: '11:15 AM (Peak Classes)', time: '11:15' },
    { label: '1:15 PM (Lunch Break)', time: '13:15' },
    { label: '2:30 PM (Afternoon Labs)', time: '14:30' },
    { label: '4:45 PM (Evening Study)', time: '16:45' },
  ];

  const days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'> = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value, 10);
    const h = Math.floor(min / 60);
    const m = min % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    setSimulatedTime(timeStr);
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Left: Indicator & Day Picker */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Timetable Simulation Engine
              </span>
            </div>

            {/* Day Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={simulatedDay}
                onChange={(e) => setSimulatedDay(e.target.value as any)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                {days.map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center: Interactive Time Slider (8 AM - 6 PM = 480 to 1080 min) */}
          <div className="flex items-center gap-3 w-full lg:w-2/5">
            <span className="text-slate-400 font-medium whitespace-nowrap text-[11px]">8:00 AM</span>
            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min="480"
                max="1080"
                step="5"
                value={currentMinutes}
                onChange={handleSliderChange}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
              />
            </div>
            <span className="text-slate-400 font-medium whitespace-nowrap text-[11px]">6:00 PM</span>

            {/* Current Selected Time Badge */}
            <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded-md shadow-sm whitespace-nowrap text-xs flex items-center gap-1.5 border border-blue-400/30">
              <span>{minutesTo12Hour(currentMinutes)}</span>
            </div>
          </div>

          {/* Right: Quick Presets & Reset */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-slate-400 mr-1 hidden xl:inline flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
            </span>
            {presets.map((p) => (
              <button
                key={p.time}
                onClick={() => setSimulatedTime(p.time)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  simulatedTime === p.time
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {p.time === '13:15' ? '1:15 PM' : minutesTo12Hour(timeStringToMinutes(p.time))}
              </button>
            ))}

            <button
              onClick={resetToCurrentTime}
              title="Reset to Actual Current Time"
              className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
