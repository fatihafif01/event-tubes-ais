"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../Navbar';
import Footer from '../Footer';

type TicketStatus = 'active' | 'completed' | 'cancelled';

interface Ticket {
  id: string;
  eventName: string;
  venue: string;
  date: string;
  time: string;
  category: string;
  price: string;
  status: TicketStatus;
  seat: string;
  image: string;
  orderDate: string;
}

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-2026-001',
    eventName: 'Summer Music Fest 2026',
    venue: 'Jakarta Convention Center',
    date: '20 Jun 2026',
    time: '19:00 WIB',
    category: 'Musik & Konser',
    price: 'Rp 250.000',
    status: 'active',
    seat: 'A-12',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80',
    orderDate: '10 Jun 2026'
  },
  {
    id: 'TKT-2026-002',
    eventName: 'Tech Innovation Summit',
    venue: 'ICE BSD City',
    date: '15 Jul 2026',
    time: '09:00 WIB',
    category: 'Seminar & Tech',
    price: 'Rp 450.000',
    status: 'active',
    seat: 'B-05',
    image: 'https://images.unsplash.com/photo-1540575467063-178a5f3f588a?w=400&q=80',
    orderDate: '05 Jun 2026'
  },
  {
    id: 'TKT-2026-003',
    eventName: 'Jazz Night Jakarta',
    venue: 'Gedung Kesenian Jakarta',
    date: '28 Jun 2026',
    time: '20:00 WIB',
    category: 'Musik & Konser',
    price: 'Rp 180.000',
    status: 'active',
    seat: 'C-21',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80',
    orderDate: '12 Jun 2026'
  },
  {
    id: 'TKT-2026-004',
    eventName: 'Food & Culture Expo',
    venue: 'Senayan Park',
    date: '03 Aug 2025',
    time: '10:00 WIB',
    category: 'Kuliner',
    price: 'Rp 75.000',
    status: 'completed',
    seat: 'General',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
    orderDate: '25 Jul 2025'
  },
  {
    id: 'TKT-2026-005',
    eventName: 'Art Gallery Opening',
    venue: 'Museum Nasional',
    date: '10 Jun 2025',
    time: '18:00 WIB',
    category: 'Seni & Teater',
    price: 'Gratis',
    status: 'cancelled',
    seat: '-',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
    orderDate: '01 Jun 2025'
  }
];

const statusConfig = {
  active:    { label: 'Aktif',       bg: 'bg-emerald-50',  text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  completed: { label: 'Selesai',     bg: 'bg-slate-50',    text: 'text-slate-600',   border: 'border-slate-200',   dot: 'bg-slate-400'   },
  cancelled: { label: 'Dibatalkan',  bg: 'bg-red-50',      text: 'text-red-600',     border: 'border-red-200',     dot: 'bg-red-500'     }
};

export default function TicketsPage() {
  const [filter, setFilter] = useState<'all' | TicketStatus>('all');
  const [user, setUser] = useState<UserData>({ name: '', email: '', avatar: undefined });
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ Load user data dari localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || 'User',
          email: parsed.email || '',
          avatar: parsed.avatar || undefined,
        });
      }
    } catch (err) {
      console.error('Gagal load data user:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const filteredTickets = filter === 'all' 
    ? mockTickets 
    : mockTickets.filter(t => t.status === filter);

  const tabs = [
    { key: 'all',       label: 'Semua',       count: mockTickets.length },
    { key: 'active',    label: 'Aktif',       count: mockTickets.filter(t => t.status === 'active').length },
    { key: 'completed', label: 'Selesai',     count: mockTickets.filter(t => t.status === 'completed').length },
    { key: 'cancelled', label: 'Dibatalkan',  count: mockTickets.filter(t => t.status === 'cancelled').length },
  ];

  // ✅ Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center">
        <div className="text-slate-500">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
      <Navbar user={user} onLogout={() => {}} />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] tracking-tight">
              Tiket Saya
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Kelola dan lihat semua tiket event yang telah kamu pesan
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-500/20 w-fit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Cari Event
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1.5 bg-white border border-[#BAD5F8]/60 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filter === tab.key
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === tab.key ? 'bg-white/20' : 'bg-[#F0F7FF] text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tickets List */}
        {filteredTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTickets.map((ticket) => {
              const cfg = statusConfig[ticket.status];
              return (
                <div
                  key={ticket.id}
                  className="bg-white border border-[#BAD5F8]/60 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/10 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="sm:w-40 h-40 sm:h-auto relative flex-shrink-0">
                      <img
                        src={ticket.image}
                        alt={ticket.eventName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/400x300/F0F7FF/1E3A5F?text=${encodeURIComponent(ticket.eventName)}`;
                        }}
                      />
                      {/* Status Badge */}
                      <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 ${cfg.bg} ${cfg.border} border rounded-full`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="text-xs text-blue-600 font-medium mb-1">{ticket.category}</p>
                            <h3 className="text-base font-bold text-[#1E3A5F] leading-tight">
                              {ticket.eventName}
                            </h3>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-sm text-slate-500 mb-3">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{ticket.date} · {ticket.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{ticket.venue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#BAD5F8]/40">
                        <div>
                          <p className="text-xs text-slate-400">Kursi</p>
                          <p className="text-sm font-semibold text-[#1E3A5F]">{ticket.seat}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Total</p>
                          <p className="text-sm font-bold text-blue-600">{ticket.price}</p>
                        </div>
                      </div>

                      {ticket.status === 'active' && (
                        <button className="mt-3 w-full py-2 bg-[#F0F7FF] hover:bg-blue-600 hover:text-white text-blue-600 border border-[#BAD5F8] text-sm font-semibold rounded-lg transition cursor-pointer">
                          Lihat QR Code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F0F7FF] border border-[#BAD5F8] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1E3A5F] mb-1">Belum ada tiket</h3>
            <p className="text-sm text-slate-500 mb-5">
              Kamu belum memiliki tiket dengan status ini
            </p>
            <Link
              href="/dashboard-after-login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
            >
              Jelajahi Event
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}