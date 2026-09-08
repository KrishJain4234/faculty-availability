import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Building2, Heart, Shield, Terminal, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC<{ onOpenSimulator: () => void }> = ({ onOpenSimulator }) => {
  const { setActiveView } = useAppStore();

  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900">ClassSpace AI</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Real-time campus classroom availability intelligence & schedule optimization engine.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>Campus Systems Operational</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView('finder')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Live Room Finder
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('map')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Interactive Campus Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('analytics')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Occupancy Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Role Portals
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Blocks */}
          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Campus Zones
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>A Block — Mechanical & Civil Core</li>
              <li>B Block — Electrical & Science</li>
              <li>C Block — Computing & Software IT</li>
              <li>D Block — AI & Research Labs</li>
            </ul>
          </div>

          {/* Col 4: Integrations & Docs */}
          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Developer & ERP
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenSimulator}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>ERP & RFID Gateway</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>
              </li>
              <li className="text-slate-400">REST API v1 (Node / Express)</li>
              <li className="text-slate-400">Supabase DB Synchronization</li>
              <li className="text-slate-400">JWT Campus SSO Ready</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© 2026 ClassSpace AI Inc. University Deployment Build.</p>
          <div className="flex items-center gap-4">
            <span>Engineering College Ready</span>
            <span>•</span>
            <span>WCAG 2.1 Compliant</span>
            <span>•</span>
            <span>Privacy Preserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
