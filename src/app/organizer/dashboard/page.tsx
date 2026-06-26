"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getOrganizerEvents, 
  subscribeToOrganizerUpdates,
  type OrganizerEvent 
} from '@/lib/organizer';

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0, activeEvents: 0, totalTicketsSold: 0, totalRevenue: 0,
  });

  useEffect(() => {
    const loadStats = () => {
      const parsed = getOrganizerEvents();
      setEvents(parsed);
      
      const totalRevenue = parsed.reduce((sum: number, ev: OrganizerEvent) => 
        sum + (ev.price * ev.ticketsSold), 0
      );
      
      setStats({
        totalEvents: parsed.length,
        activeEvents: parsed.filter((e: OrganizerEvent) => e.status === 'active').length,
        totalTicketsSold: parsed.reduce((sum: number, ev: OrganizerEvent) => sum + ev.ticketsSold, 0),
        totalRevenue,
      });
    };

    loadStats();
    const unsubscribe = subscribeToOrganizerUpdates(loadStats);
    return unsubscribe;
  }, []);

  const formatRupiah = (amount: number) => 'Rp ' + amount.toLocaleString('id-ID');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Organizer</h1>
          <p className="text-gray-600 text-sm mt-1">Overview event dan penjualan Anda</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Event</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">🎪</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Event Aktif</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.activeEvents}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Tiket Terjual</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalTicketsSold}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">🎫</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Pendapatan</p>
              <p className="text-2xl font-bold text-emerald-600">{formatRupiah(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl">💰</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Event Terbaru</h3>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-600">{event.date} · {event.venue}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">{event.ticketsSold} tiket</p>
                  <p className="text-xs text-gray-600">{formatRupiah(event.price * event.ticketsSold)}</p>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-gray-600 text-center py-4">Belum ada event</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 rounded-2xl p-6 text-white">
          <h3 className="text-base font-bold mb-2">Quick Actions</h3>
          <p className="text-sm text-blue-100 mb-4">Kelola event dan pantau penjualan</p>
          <div className="space-y-3">
            <Link href="/organizer/events" className="block w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-center font-semibold transition">
              🎪 Kelola Event
            </Link>
            <Link href="/organizer/sales" className="block w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-center font-semibold transition">
              💰 Lihat Penjualan
            </Link>
            <Link href="/organizer/checkin" className="block w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-center font-semibold transition">
              ✅ Check-in Peserta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}