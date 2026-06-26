"use client";

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/dashboard-after-login/Navbar';
import Footer from '@/components/dashboard-after-login/Footer';
import Link from 'next/link';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

export default function SuccessPage() {
  const params = useParams() ?? {};
  const searchParams = useSearchParams() ?? new URLSearchParams();
  
  const eventId = (params?.id as string) || '';
  const method = searchParams.get('method') || 'wallet';
  const status = searchParams.get('status') || 'success';
  
  const [user, setUser] = useState<UserData>({ name: '', email: '', avatar: undefined });

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
      console.error(err);
    }
  }, []);

  const orderId = `ORD-${Date.now().toString().slice(-8)}`;
  
  const methodNames: Record<string, string> = {
    'wallet': 'Saldo EventSphere',
    'bca-va': 'BCA Virtual Account',
    'mandiri-va': 'Mandiri Virtual Account',
    'bni-va': 'BNI Virtual Account',
    'bri-va': 'BRI Virtual Account',
    'qris': 'QRIS',
    'gopay': 'GoPay',
    'ovo': 'OVO',
    'dana': 'DANA',
  };

  const isPending = status === 'pending';

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
      <Navbar user={user} onLogout={() => {}} />
      
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
        <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-8 sm:p-12 text-center">
          {/* Icon berdasarkan status */}
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isPending 
              ? 'bg-amber-50 border border-amber-200' 
              : 'bg-emerald-50 border border-emerald-200'
          }`}>
            {isPending ? (
              <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] mb-3">
            {isPending ? 'Bukti Pembayaran Terkirim!' : 'Pembayaran Berhasil!'}
          </h1>
          <p className="text-slate-500 mb-6">
            {isPending 
              ? 'Pembayaran sedang diverifikasi oleh admin. Kamu akan mendapat notifikasi setelah dikonfirmasi.'
              : `Tiket sudah dikirim ke email ${user.email || 'kamu'}`
            }
          </p>

          {/* Order Detail */}
          <div className="bg-[#F0F7FF] border border-[#BAD5F8] rounded-xl p-5 text-left mb-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Order ID</span>
              <span className="font-mono font-bold text-[#1E3A5F]">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Event</span>
              <span className="font-semibold text-[#1E3A5F]">Summer Music Fest 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Metode Bayar</span>
              <span className="text-slate-700">{methodNames[method] || method}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#BAD5F8]/60">
              <span className="text-slate-500">Status</span>
              {isPending ? (
                <span className="inline-flex items-center gap-1.5 text-amber-600 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Menunggu Verifikasi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Lunas
                </span>
              )}
            </div>
          </div>

          {isPending && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-blue-800">
                💡 <strong>Info:</strong> Admin akan memverifikasi pembayaran kamu dalam 1x24 jam. 
                Setelah dikonfirmasi, tiket akan otomatis aktif dan bisa dilihat di halaman "Tiket Saya".
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard-after-login/tickets"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
            >
              Lihat Tiket Saya
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-[#BAD5F8] transition"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}