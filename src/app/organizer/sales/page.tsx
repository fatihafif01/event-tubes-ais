"use client";

import { useState, useEffect } from 'react';
import { 
  getOrganizerEvents, 
  subscribeToOrganizerUpdates,
  type OrganizerEvent 
} from '@/lib/organizer';

export default function OrganizerSales() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const loadData = () => {
      const parsed = getOrganizerEvents();
      setEvents(parsed);
      const revenue = parsed.reduce((sum: number, ev: OrganizerEvent) => 
        sum + (ev.price * ev.ticketsSold), 0
      );
      setTotalRevenue(revenue);
    };

    loadData();
    const unsubscribe = subscribeToOrganizerUpdates(loadData);
    return unsubscribe;
  }, []);

  const formatRupiah = (amount: number) => 'Rp ' + amount.toLocaleString('id-ID');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Penjualan Tiket</h1>
          <p className="text-gray-600 text-sm mt-1">Pantau penjualan dan pendapatan Anda</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">Live</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-sky-600 rounded-2xl p-6 text-white">
        <p className="text-sm text-blue-100 mb-1">Total Pendapatan</p>
        <p className="text-3xl font-bold">{formatRupiah(totalRevenue)}</p>
        <p className="text-sm text-blue-100 mt-2">
          Dari {events.reduce((sum, ev) => sum + ev.ticketsSold, 0)} tiket terjual
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-900 px-6 py-3">Event</th>
                <th className="text-left text-xs font-semibold text-gray-900 px-6 py-3">Harga</th>
                <th className="text-left text-xs font-semibold text-gray-900 px-6 py-3">Terjual</th>
                <th className="text-left text-xs font-semibold text-gray-900 px-6 py-3">Pendapatan</th>
                <th className="text-left text-xs font-semibold text-gray-900 px-6 py-3">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => {
                const revenue = event.price * event.ticketsSold;
                const progress = event.capacity > 0 ? (event.ticketsSold / event.capacity) * 100 : 0;
                return (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{formatRupiah(event.price)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{event.ticketsSold} / {event.capacity}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-blue-600">{formatRupiah(revenue)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-blue-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{progress.toFixed(1)}%</p>
                    </td>
                  </tr>
                );
              })}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-600">Belum ada data penjualan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}