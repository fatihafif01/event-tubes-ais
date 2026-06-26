"use client";

import { useState, useEffect } from 'react';
import { 
  getOrganizerEvents, 
  getCheckIns, 
  addCheckIn,
  subscribeToOrganizerUpdates,
  type OrganizerEvent,
  type CheckIn
} from '@/lib/organizer';

export default function OrganizerCheckin() {
  const [ticketCode, setTicketCode] = useState('');
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const loadData = () => {
      setEvents(getOrganizerEvents());
      setCheckIns(getCheckIns());
    };

    loadData();
    const unsubscribe = subscribeToOrganizerUpdates(loadData);
    return unsubscribe;
  }, []);

  const handleCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    setScanResult(null);
    
    if (!ticketCode) {
      setScanResult({ success: false, message: 'Masukkan kode tiket!' });
      return;
    }

    if (ticketCode.startsWith('TKT-')) {
      const targetEvent = events[0];
      
      if (targetEvent) {
        addCheckIn({
          ticketCode,
          eventId: targetEvent.id,
          eventName: targetEvent.title,
          userName: `Peserta ${ticketCode}`,
        });

        setScanResult({ 
          success: true, 
          message: `✅ Tiket ${ticketCode} berhasil di-check-in ke ${targetEvent.title}!` 
        });
        setTicketCode('');
      } else {
        setScanResult({ success: false, message: 'Tidak ada event aktif untuk check-in!' });
      }
    } else {
      setScanResult({ success: false, message: '❌ Kode tiket tidak valid! (harus diawali "TKT-")' });
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Check-in Peserta</h1>
          <p className="text-gray-600 text-sm mt-1">Verifikasi dan check-in peserta event</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Scan Kode Tiket</h2>
            <p className="text-sm text-gray-600 mt-1">Masukkan kode tiket untuk check-in</p>
          </div>

          <form onSubmit={handleCheckin} className="space-y-4">
            <input
              type="text"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-center text-lg font-mono text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="TKT-2026-001"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
            >
              Check-in Peserta
            </button>
          </form>

          {scanResult && (
            <div className={`mt-6 p-4 rounded-xl border ${
              scanResult.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm font-medium ${scanResult.success ? 'text-emerald-700' : 'text-red-700'}`}>
                {scanResult.message}
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-800 text-center">
              <strong>Demo:</strong> Masukkan kode diawali "TKT-" untuk simulasi check-in berhasil.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">Riwayat Check-in</h3>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {checkIns.length} peserta
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {checkIns.length > 0 ? (
              checkIns.map((checkin) => (
                <div key={checkin.id} className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{checkin.userName}</p>
                      <p className="text-xs text-gray-600 truncate">{checkin.eventName}</p>
                      <p className="text-xs text-gray-500 mt-1 font-mono">{checkin.ticketCode}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Checked-in
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(checkin.checkedInAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600">Belum ada check-in</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}