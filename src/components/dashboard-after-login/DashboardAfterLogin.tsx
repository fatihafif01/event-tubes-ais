// src/components/dashboard-after-login/DashboardAfterLogin.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import HeroSlider from './HeroSlider';
import StatsSection from './StatsSection';
import CategoriesSection from './CategoriesSection';
import Footer from './Footer';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function DashboardAfterLogin() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem('user_logged_in');
        const userData = localStorage.getItem('user');

        if (!isLoggedIn || !userData) {
          router.replace('/login');
          return;
        }

        const parsed = JSON.parse(userData);
        setUser({
          id: parsed.id || '',
          name: parsed.name || 'User',
          email: parsed.email || '',
          avatar: parsed.avatar || undefined,
        });
      } catch {
        localStorage.removeItem('user_logged_in');
        localStorage.removeItem('user');
        router.replace('/login');
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user_logged_in');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse">
              <span className="text-white font-bold text-lg">ES</span>
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-blue-300/50 animate-spin" style={{ animationDuration: '2s' }} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-2.5 bg-[#BAD5F8] rounded-full animate-pulse" />
            <div className="w-20 h-2 bg-[#BAD5F8]/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-sm text-slate-400">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-[#1E3A5F] flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="flex-1 pt-16">
        <div className="bg-gradient-to-r from-[#1E3A5F] via-[#1D4ED8] to-[#0EA5E9] px-4 sm:px-6 lg:px-8 py-6 relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" aria-hidden="true">
            <defs>
              <pattern id="dash-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0L0 0 0 40" fill="none" stroke="white" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dash-grid)"/>
          </svg>
          <div className="absolute right-10 top-[-20px] w-40 h-40 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-[-20px] w-32 h-32 rounded-full bg-blue-300/10 blur-2xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sky-200/80 text-sm mb-1">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Selamat datang kembali,{' '}
                <span className="text-sky-300">{user?.name?.split(' ')[0] || 'Pengguna'}</span> 👋
              </h1>
              <p className="text-blue-100/70 text-sm mt-1">Ada event seru yang menunggu kamu hari ini.</p>
            </div>
            <button
              onClick={() => router.push('/events')}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium text-white transition-all backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              Jelajahi Event
            </button>
          </div>
        </div>

        <HeroSlider />
        <StatsSection user={user} />
        <CategoriesSection />
      </main>

      <Footer />
    </div>
  );
}