"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead,
  getUnreadCount 
} from '@/lib/notifications';

interface User {
  name: string;
  email: string;
  avatar?: string;
  id?: string;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Load notifications & listen for updates
  useEffect(() => {
    if (!user?.id) return;

    const loadNotifications = () => {
      const notifs = getNotifications(user.id!);
      setNotifications(notifs.slice(0, 5)); // Ambil 5 terbaru untuk dropdown
    };

    loadNotifications();

    // Listen untuk update real-time
    const handleUpdate = () => loadNotifications();
    window.addEventListener('notifications-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('notifications-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [user?.id]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { name: 'Dashboard',   href: '/dashboard' },
    { name: 'Tiket Saya',  href: '/dashboard-after-login/tickets' },  
    { name: 'Dompet',      href: '/dashboard-after-login/wallet' },
    { name: 'Pengaturan',  href: '/dashboard-after-login/settings' },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/dashboard-after-login') return pathname === '/dashboard-after-login';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const unreadCount = getUnreadCount(user?.id || '');

  const formatTime = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment_approved': return '✅';
      case 'payment_rejected': return '❌';
      case 'ticket_purchased': return '🎫';
      case 'event_reminder': return '📅';
      default: return '🔔';
    }
  };

  const handleMarkAsRead = (id: string) => {
    if (!user?.id) return;
    markAsRead(id, user.id);
  };

  const handleMarkAllAsRead = () => {
    if (!user?.id) return;
    markAllAsRead(user.id);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-[#BAD5F8]/60 shadow-sm shadow-blue-500/5'
          : 'bg-white border-b border-[#BAD5F8]/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

       <Link href="/dashboard" className="flex items-center gap-2.5 group">
  <img
    src="/zenix-logo.png"
    alt="EventSphere"
    className="w-8 h-8 object-contain"
  />
  <span className="text-base font-bold text-[#1E3A5F] tracking-tight">
    Zenix<span className="text-blue-600">Event</span>
  </span>
</Link>

          {/* ── Desktop Nav Links ────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-500 hover:text-[#1E3A5F] hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ── Right Actions ────────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotifMenu(!showNotifMenu); setShowProfileMenu(false); }}
                className="relative p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                aria-label="Notifikasi"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#BAD5F8]/60 rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden z-20">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#BAD5F8]/40">
                    <span className="text-sm font-semibold text-[#1E3A5F]">Notifikasi</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-600 font-medium hover:text-blue-700"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>
                  
                  <div className="divide-y divide-[#BAD5F8]/30 max-h-72 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleMarkAsRead(notif.id)}
                          className={`px-4 py-3 flex gap-3 hover:bg-blue-50/50 transition-colors cursor-pointer ${
                            !notif.read ? 'bg-[#F0F7FF]' : ''
                          }`}
                        >
                          <div className="flex-shrink-0 text-lg">
                            {getTypeIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              !notif.read ? 'text-[#1E3A5F]' : 'text-slate-600'
                            }`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {notif.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {formatTime(notif.createdAt)}
                            </p>
                          </div>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-slate-500">
                        Tidak ada notifikasi
                      </div>
                    )}
                  </div>
                  
                  <div className="px-4 py-2.5 border-t border-[#BAD5F8]/40 text-center">
                    <Link
                      href="/dashboard-after-login/notifications"
                      onClick={() => setShowNotifMenu(false)}
                      className="text-xs text-blue-600 font-medium hover:text-blue-700 transition"
                    >
                      Lihat semua notifikasi
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifMenu(false); }}
                className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 bg-[#F0F7FF] hover:bg-[#E1EFFD] border border-[#BAD5F8] rounded-full transition-all"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-[#BAD5F8]" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {initials}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-[#1E3A5F] max-w-[100px] truncate">
                  {user?.name || 'User'}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#BAD5F8]/60 rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden z-20">
                  <div className="px-4 py-3 border-b border-[#BAD5F8]/40">
                    <div className="flex items-center gap-3">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-[#BAD5F8]" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1E3A5F] truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard-after-login/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06-.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                      </svg>
                      Pengaturan Akun
                    </Link>
                    <Link
                      href="/dashboard-after-login/tickets"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>
                      </svg>
                      Tiket Saya
                    </Link>
                  </div>

                  <div className="border-t border-[#BAD5F8]/40 py-1">
                    <button
                      onClick={() => { setShowProfileMenu(false); onLogout(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
                      </svg>
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}