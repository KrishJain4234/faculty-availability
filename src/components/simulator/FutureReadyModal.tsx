import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  X,
  Cpu,
  Radio,
  FileCode,
  CheckCircle2,
  Send,
  Zap,
  Layers,
  ArrowRight,
  Sparkles,
  Terminal,
} from 'lucide-react';

interface FutureReadyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FutureReadyModal: React.FC<FutureReadyModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useAppStore();
  const [activeTab, setActiveTab] = useState<'erp' | 'rfid' | 'api' | 'qr'>('erp');
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '2026-09-05 11:05:01 [SYSTEM] ClassSpace Core Gateway v1.0 initialized',
    '2026-09-05 11:05:02 [ERP] Campus Timetable sync channel active (WebSocket ID #4092)',
    '2026-09-05 11:05:03 [RFID] 24 IoT Door Turnstiles connected across Blocks A, B, C, D',
  ]);

  if (!isOpen) return null;

  const triggerSimulation = (type: string) => {
    setIsSimulating(true);
    const timestamp = new Date().toLocaleTimeString();
    let newLog = '';

    if (type === 'erp') {
      newLog = `${timestamp} [ERP] Webhook received: 12 lecture adjustments synced from University Banner ERP.`;
    } else if (type === 'rfid') {
      newLog = `${timestamp} [RFID] Mifare Card #9824-A tapped at Block C-204 Door Lock. Occupancy verified.`;
    } else if (type === 'qr') {
      newLog = `${timestamp} [QR] Mobile App student check-in event logged for Room D-301 (AI Lab).`;
    }

    setTimeout(() => {
      setLogs((prev) => [newLog, ...prev]);
      setIsSimulating(false);
      addToast({
        type: 'success',
        title: `${type.toUpperCase()} Event Simulated`,
        message: newLog,
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-900 text-white">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30 mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Future-Ready University Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Hardware & Enterprise ERP Gateway
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Plug ClassSpace AI into existing college infrastructure with standardized APIs and IoT turnstiles.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('erp')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'erp'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ERP Synchronization</span>
          </button>
          <button
            onClick={() => setActiveTab('rfid')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'rfid'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>RFID Turnstiles</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'api'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>REST API Docs</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-700 text-xs">
          
          {activeTab === 'erp' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                <Layers className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <h4 className="font-bold text-slate-900 text-sm">ERP Timetable Webhook Ingestion</h4>
                  <p className="text-slate-600 text-xs mt-1">
                    Connects directly with university ERP databases (SAP Student Lifecycle Management, Oracle Campus Solutions, Banner by Ellucian, or custom college MySQL databases).
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">Simulate ERP Sync Event</span>
                  <span className="text-slate-500 text-[11px]">Send mock webhook payload from College Timetable DB</span>
                </div>
                <button
                  onClick={() => triggerSimulation('erp')}
                  disabled={isSimulating}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isSimulating ? 'Syncing...' : 'Trigger ERP Webhook'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'rfid' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <Radio className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <h4 className="font-bold text-slate-900 text-sm">IoT Door Access & Smart Locks</h4>
                  <p className="text-slate-600 text-xs mt-1">
                    ESP32 / Raspberry Pi IoT turnstiles mounted on classroom doors emit real-time attendance signals. When faculty or student badge swipes occur, room status switches automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">Simulate RFID Smart Badge Swipe</span>
                  <span className="text-slate-500 text-[11px]">Emit Mifare / NFC RFID signal to door reader</span>
                </div>
                <button
                  onClick={() => triggerSimulation('rfid')}
                  disabled={isSimulating}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>{isSimulating ? 'Transmitting...' : 'Swipe RFID Card'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
                <div className="text-blue-400 font-bold">// GET /api/v1/classrooms/available</div>
                <pre className="text-slate-300 overflow-x-auto whitespace-pre">
{`curl -X GET "https://api.classspace.ai/v1/rooms?block=C%20Block&min_duration=60" \\
  -H "Authorization: Bearer <CAMPUS_JWT_TOKEN>"`}
                </pre>
                
                <div className="text-emerald-400 font-bold pt-2">// POST /api/v1/rfid/tap (Door Hardware Hook)</div>
                <pre className="text-slate-300 overflow-x-auto whitespace-pre">
{`curl -X POST "https://api.classspace.ai/v1/rfid/tap" \\
  -H "Content-Type: application/json" \\
  -d '{"roomId": "c-204", "badgeId": "CARD-9824A", "eventType": "FACULTY_ENTER"}'`}
                </pre>
              </div>
            </div>
          )}

          {/* Live System Event Log Stream */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Real-Time Integration Stream Logs</span>
            </h4>
            <div className="bg-slate-950 p-3.5 rounded-2xl font-mono text-[11px] text-emerald-400 max-h-36 overflow-y-auto space-y-1 border border-slate-800">
              {logs.map((log, i) => (
                <div key={i} className="leading-tight">{log}</div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
