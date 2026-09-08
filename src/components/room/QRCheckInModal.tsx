import React, { useState } from 'react';
import { Room } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { X, QrCode, Radio, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface QRCheckInModalProps {
  room: Room | null;
  onClose: () => void;
}

export const QRCheckInModal: React.FC<QRCheckInModalProps> = ({ room, onClose }) => {
  const { addToast } = useAppStore();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [method, setMethod] = useState<'qr' | 'rfid'>('qr');

  if (!room) return null;

  const handleSimulateCheckIn = () => {
    setIsCheckedIn(true);
    addToast({
      type: 'success',
      title: 'Digital Check-in Verified',
      message: `You are now logged into ${room.name} (${room.block}). Session will be tracked.`,
    });
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-slide-up text-center">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-left">
            <h3 className="text-lg font-bold text-slate-900">Room Digital Check-in</h3>
            <p className="text-xs text-slate-500">{room.name} • {room.block}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Method Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setMethod('qr')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                method === 'qr' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Door QR Code</span>
            </button>
            <button
              onClick={() => setMethod('rfid')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                method === 'rfid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>RFID Turnstile Tap</span>
            </button>
          </div>

          {method === 'qr' ? (
            /* QR Code View */
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center space-y-3">
              <div className="w-44 h-44 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center relative group">
                {/* SVG Visual QR Code */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  {/* Outer corner markers */}
                  <rect x="10" y="10" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="16" y="16" width="12" height="12" rx="1" fill="currentColor" />
                  <rect x="66" y="10" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="72" y="16" width="12" height="12" rx="1" fill="currentColor" />
                  <rect x="10" y="66" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="16" y="72" width="12" height="12" rx="1" fill="currentColor" />
                  {/* Data patterns */}
                  <rect x="42" y="12" width="6" height="6" />
                  <rect x="52" y="12" width="6" height="6" />
                  <rect x="42" y="24" width="6" height="14" />
                  <rect x="52" y="24" width="16" height="6" />
                  <rect x="12" y="42" width="16" height="6" />
                  <rect x="36" y="42" width="8" height="8" />
                  <rect x="50" y="42" width="14" height="8" />
                  <rect x="72" y="42" width="16" height="6" />
                  <rect x="42" y="58" width="6" height="12" />
                  <rect x="54" y="58" width="14" height="6" />
                  <rect x="42" y="76" width="18" height="6" />
                  <rect x="68" y="68" width="8" height="14" />
                  <rect x="82" y="78" width="6" height="10" />
                </svg>

                {/* Center Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md font-bold text-[10px]">
                    CS
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-mono font-medium">
                {room.qrCodeId}
              </div>
              <p className="text-[11px] text-slate-400">
                Scan this tag mounted on classroom door entry to log attendance or confirm occupancy.
              </p>
            </div>
          ) : (
            /* RFID Turnstile Simulation */
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100 flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center border-2 border-blue-300 animate-pulse">
                <Radio className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Campus SmartCard Reader</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulating 13.56MHz Mifare / NFC card tap event for Door Lock
                </p>
              </div>
            </div>
          )}

          {/* Simulate Button */}
          <div>
            <button
              onClick={handleSimulateCheckIn}
              disabled={isCheckedIn}
              className={`w-full py-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                isCheckedIn
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-glow-primary'
              }`}
            >
              {isCheckedIn ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check-in Verified!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simulate {method === 'qr' ? 'QR Scan' : 'RFID Tap'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
