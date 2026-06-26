"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard-after-login/Navbar';
import Footer from '@/components/dashboard-after-login/Footer';
import { getBalance } from '@/lib/wallet';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  image: string;
}

export default function BuyPage() {
  const params = useParams() ?? {};
  const router = useRouter();
  const eventId = (params?.id as string) || '';
  
  const [user, setUser] = useState<UserData>({ name: '', email: '', avatar: undefined });
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);

  // ✅ Load user data
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
      setBalance(getBalance());
    } catch (err) {
      console.error('Gagal load user:', err);
    }
  }, []);

  // ✅ Load event dari localStorage (SAMA seperti CategoriesSection)
  useEffect(() => {
    setLoading(true);
    setEvent(null);
    setSelectedMethod('');

    const loadEvent = () => {
      // Default events
      const defaultEvents: Event[] = [
        { id: '1', title: 'Summer Music Fest', date: '20 Jun 2026', time: '19:00 WIB', venue: 'Jakarta Convention Center', price: 250000, image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80' },
        { id: '2', title: 'Tech Innovation Summit', date: '15 Jul 2026', time: '09:00 WIB', venue: 'ICE BSD City', price: 450000, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80' },
        { id: '3', title: 'Food & Culture Expo', date: '03 Aug 2026', time: '10:00 WIB', venue: 'Senayan Park', price: 75000, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
        { id: '4', title: 'Art Gallery Opening', date: '10 Jun 2026', time: '18:00 WIB', venue: 'Museum Nasional', price: 0, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
        { id: '5', title: 'Marathon Jakarta', date: '25 Jun 2026', time: '06:00 WIB', venue: 'Gelora Bung Karno', price: 150000, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80' },
        { id: '6', title: 'Coding Workshop', date: '05 Jul 2026', time: '09:00 WIB', venue: 'CoWorking Space', price: 200000, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80' },
      ];

      // Load admin events dari localStorage
      let allEvents = [...defaultEvents];
      try {
        const adminEventsRaw = localStorage.getItem('admin_events');
        if (adminEventsRaw) {
          const adminEvents = JSON.parse(adminEventsRaw);
          const formattedAdminEvents: Event[] = adminEvents.map((ev: any, index: number) => ({
            id: String(100 + index),
            title: ev.title,
            date: ev.date,
            time: ev.time || '00:00 WIB',
            venue: ev.venue,
            price: ev.price || 0,
            image: ev.image,
          }));
          allEvents = [...formattedAdminEvents, ...defaultEvents];
        }
      } catch (err) {
        console.error('Failed to load admin events:', err);
      }

      // Cari event berdasarkan ID
      const foundEvent = allEvents.find(e => e.id === eventId);
      
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        alert(`Event dengan ID ${eventId} tidak ditemukan!`);
        router.push('/dashboard-after-login');
      }
      
      setLoading(false);
    };

    loadEvent();
  }, [eventId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const adminFee = 5000;
  const total = event.price + adminFee;

  const paymentMethods = [
    {
      group: 'Virtual Account',
      items: [
        { id: 'bca-va', name: 'BCA Virtual Account', icon: '🏦', code: 'BCA' },
        { id: 'mandiri-va', name: 'Mandiri Virtual Account', icon: '🏦', code: 'MDR' },
        { id: 'bni-va', name: 'BNI Virtual Account', icon: '🏦', code: 'BNI' },
        { id: 'bri-va', name: 'BRI Virtual Account', icon: '🏦', code: 'BRI' },
      ]
    },
    {
      group: 'E-Wallet & QRIS',
      items: [
        { id: 'qris', name: 'QRIS (Semua Aplikasi)', icon: '📱', code: 'QRIS' },
        { id: 'gopay', name: 'GoPay', icon: '💚', code: 'GPY' },
        { id: 'ovo', name: 'OVO', icon: '💜', code: 'OVO' },
        { id: 'dana', name: 'DANA', icon: '💙', code: 'DNA' },
      ]
    },
    {
      group: 'Saldo EventSphere',
      items: [
        { id: 'wallet', name: 'Bayar dengan Saldo', icon: '💳', code: 'WLT' },
      ]
    }
  ];

  const handleContinue = () => {
    if (!selectedMethod) {
      alert('Pilih metode pembayaran terlebih dahulu');
      return;
    }

    if (selectedMethod === 'wallet') {
      if (balance < total) {
        alert('Saldo tidak cukup! Silakan top up terlebih dahulu.');
        router.push('/dashboard-after-login/wallet');
        return;
      }
      router.push(`/events/${eventId}/success?method=wallet&paid=true`);
      return;
    }

    router.push(`/events/${eventId}/payment?method=${selectedMethod}`);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
      <Navbar user={user} onLogout={() => {}} />
      
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition mb-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] tracking-tight">
            Pilih Metode Pembayaran
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Selesaikan pembayaran dalam 15 menit
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ── Event Summary ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-6">
              <h2 className="text-base font-bold text-[#1E3A5F] mb-4">Detail Pesanan</h2>
              <div className="flex gap-4 pb-4 border-b border-[#BAD5F8]/40">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1E3A5F] mb-1">{event.title}</h3>
                  <p className="text-xs text-slate-500">📅 {event.date} · {event.time}</p>
                  <p className="text-xs text-slate-500">📍 {event.venue}</p>
                  <p className="text-xs text-slate-500 mt-1">🎫 1x Tiket</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Harga Tiket</span>
                  <span>Rp {event.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Layanan</span>
                  <span>Rp {adminFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#BAD5F8]/40 text-[#1E3A5F] font-bold">
                  <span>Total Pembayaran</span>
                  <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-6">
              <h2 className="text-base font-bold text-[#1E3A5F] mb-4">Metode Pembayaran</h2>
              <div className="space-y-5">
                {paymentMethods.map((group) => (
                  <div key={group.group}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {group.group}
                    </p>
                    <div className="space-y-2">
                      {group.items.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                            selectedMethod === method.id
                              ? 'bg-[#F0F7FF] border-blue-400 shadow-sm'
                              : 'bg-white border-[#BAD5F8]/60 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedMethod === method.id}
                            onChange={() => setSelectedMethod(method.id)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="w-9 h-9 rounded-lg bg-white border border-[#BAD5F8] flex items-center justify-center text-lg flex-shrink-0">
                            {method.icon}
                          </div>
                          <span className="flex-1 text-sm font-medium text-[#1E3A5F]">
                            {method.name}
                          </span>
                          {method.id === 'wallet' && (
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              Saldo: Rp {balance.toLocaleString('id-ID')}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar Summary ───────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-5 sticky top-24">
              <h3 className="text-base font-bold text-[#1E3A5F] mb-4">Ringkasan</h3>
              <div className="space-y-2 text-sm pb-4 border-b border-[#BAD5F8]/40">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>Rp {event.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Layanan</span>
                  <span>Rp {adminFee.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <div className="flex justify-between pt-4 pb-5 text-[#1E3A5F] font-bold">
                <span>Total</span>
                <span className="text-blue-600 text-lg">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <button
                onClick={handleContinue}
                disabled={!selectedMethod}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
              >
                Lanjutkan Pembayaran
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-3">
                🔒 Pembayaran aman & terenkripsi
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}