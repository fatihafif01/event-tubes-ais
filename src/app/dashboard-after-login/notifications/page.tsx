"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard-after-login/Navbar';
import Footer from '@/components/dashboard-after-login/Footer';
import Link from 'next/link';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification 
} from '@/lib/notifications';

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

interface UserData {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<UserData>({ name: '', email: '', avatar: undefined });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({
          id: parsed.id,
          name: parsed.name || 'User',
          email: parsed.email || '',
          avatar: parsed.avatar || undefined,
        });
      }
    } catch (err) {
      console.error('Gagal load user:', err);
    }
  }, []);

  // Load notifications
  useEffect(() => {
    if (!user.id) return;

    const loadNotifications = () => {
      const notifs = getNotifications(user.id!);
      setNotifications(notifs);
      setIsLoaded(true);
    };

    loadNotifications();

    // Real-time sync
    const handleUpdate = () => loadNotifications();
    window.addEventListener('notifications-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('notifications-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [user.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    if (!user.id) return;
    markAsRead(id, user.id);
  };

  const handleMarkAllAsRead = () => {
    if (!user.id) return;
    markAllAsRead(user.id);
  };

  const handleDelete = (id: string) => {
    if (!user.id) return;
    deleteNotification(id, user.id);
  };

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
    
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment_approved': return 'bg-emerald-50 border-emerald-200';
      case 'payment_rejected': return 'bg-red-50 border-red-200';
      case 'ticket_purchased': return 'bg-blue-50 border-blue-200';
      case 'event_reminder': return 'bg-purple-50 border-purple-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center">
        <div className="text-slate-500">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
      <Navbar user={{ name: user.name, email: user.email, avatar: user.avatar }} onLogout={() => {}} />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] tracking-tight">
                Notifikasi
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {unreadCount > 0 
                  ? `Kamu memiliki ${unreadCount} notifikasi belum dibaca` 
                  : 'Semua notifikasi sudah dibaca'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl overflow-hidden">
          {notifications.length > 0 ? (
            <div className="divide-y divide-[#BAD5F8]/30">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-5 flex gap-4 hover:bg-[#F0F7FF]/50 transition-colors ${
                    !notif.read ? 'bg-[#F0F7FF]' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center text-2xl ${getTypeColor(notif.type)}`}>
                    {getTypeIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className={`text-sm font-semibold ${
                        !notif.read ? 'text-[#1E3A5F]' : 'text-slate-600'
                      }`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">{notif.message}</p>
                    
                    <div className="flex items-center gap-3">
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Tandai dibaca
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="text-xs text-slate-400 hover:text-red-500 font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F0F7FF] border border-[#BAD5F8] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#1E3A5F] mb-1">Tidak ada notifikasi</h3>
              <p className="text-sm text-slate-500">Kamu belum memiliki notifikasi</p>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard-after-login/tickets"
            className="px-4 py-2 bg-white border border-[#BAD5F8] hover:border-blue-300 text-slate-600 hover:text-blue-600 text-sm font-medium rounded-xl transition"
          >
            Lihat Tiket Saya
          </Link>
          <Link
            href="/dashboard-after-login"
            className="px-4 py-2 bg-white border border-[#BAD5F8] hover:border-blue-300 text-slate-600 hover:text-blue-600 text-sm font-medium rounded-xl transition"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}