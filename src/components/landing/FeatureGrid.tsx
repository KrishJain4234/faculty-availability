import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Compass,
  MapPin,
  Filter,
  CalendarDays,
  BarChart3,
  MessageSquare,
  Cpu,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const FeatureGrid: React.FC<{ onOpenSimulator: () => void }> = ({ onOpenSimulator }) => {
  const { setActiveView } = useAppStore();

  const features = [
    {
      title: 'Live Faculty & Cabin Locator',
      description:
        'Find any professor (e.g. Harish Sir, Dr. Sharma) and see their assigned cabin number, current availability, and expected return time.',
      icon: <Compass className="w-6 h-6 text-blue-600" />,
      action: () => setActiveView('finder'),
      actionText: 'Find Faculty Cabins',
      tag: 'Core Feature',
    },
    {
      title: 'Teacher Timetable Integration',
      description:
        'Live schedules automatically determine if a teacher is available in their cabin or actively teaching a lecture/lab in a specific classroom.',
      icon: <CalendarDays className="w-6 h-6 text-purple-600" />,
      action: () => setActiveView('finder'),
      actionText: 'View Schedules',
      tag: 'Smart Timetable',
    },
    {
      title: 'Digital Cabin Door Notes',
      description:
        'Need to meet a professor who is in class? Leave a digital message on their cabin door portal with your roll number and question.',
      icon: <MessageSquare className="w-6 h-6 text-emerald-600" />,
      action: () => setActiveView('finder'),
      actionText: 'Leave Cabin Note',
      tag: 'Student-Teacher Sync',
    },
    {
      title: 'Campus & Cabin Wing Map',
      description:
        'Explore faculty wings across Blocks A, B, C, and D. Visual indicators pinpoint which cabins are occupied and who is inside.',
      icon: <MapPin className="w-6 h-6 text-indigo-600" />,
      action: () => setActiveView('map'),
      actionText: 'Open Wing Map',
      tag: 'Visual Navigator',
    },
    {
      title: '1-Touch Faculty Status Controls',
      description:
        'Professors can quickly set their digital cabin sign to "In Cabin", "Stepped out for 15m", "In Meeting", or "On Leave".',
      icon: <Building2 className="w-6 h-6 text-amber-600" />,
      action: () => setActiveView('dashboard'),
      actionText: 'Faculty Space',
      tag: 'Faculty Controls',
    },
    {
      title: 'Future IoT & RFID Door Sensors',
      description:
        'Simulate electronic door sensors, RFID cabin badge taps, and university ERP integrations for autonomous door status updates.',
      icon: <Cpu className="w-6 h-6 text-teal-600" />,
      action: onOpenSimulator,
      actionText: 'Explore IoT Simulator',
      tag: 'Future-Ready',
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Faculty & Cabin Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything Students & Faculty Need
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Engineered to bridge student inquiries with faculty schedules through intelligent cabin tracking.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform duration-200">
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={feature.action}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
                >
                  <span>{feature.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
