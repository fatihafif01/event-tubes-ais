"use client";

import { useState, useEffect } from 'react';

interface PaymentProof {
  orderId: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  eventName: string;
  amount: number;
  paymentMethod: string;
  vaNumber: string;
  proofFile: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  timestamp: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalPayments: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    totalRevenue: 0,
    totalEvents: 5,
    totalUsers: 12,
  });

  useEffect(() => {
    // Load data from localStorage
    const proofs = JSON.parse(localStorage.getItem('payment_proofs') || '[]') as PaymentProof[];
    const transactions = JSON.parse(localStorage.getItem('wallet_transactions') || '[]') as Transaction[];

    setStats({
      totalPayments: proofs.length,
      pendingPayments: proofs.filter(p => p.status === 'pending').length,
      approvedPayments: proofs.filter(p => p.status === 'approved').length,
      totalRevenue: proofs.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0),
      totalEvents: 5, // Mock data
      totalUsers: 12, // Mock data
    });
  }, []);

  const statCards = [
    {
      title: 'Total Pembayaran',
      value: stats.totalPayments,
      icon: '💳',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
    },
    {
      title: 'Menunggu Verifikasi',
      value: stats.pendingPayments,
      icon: '⏳',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-600',
    },
    {
      title: 'Disetujui',
      value: stats.approvedPayments,
      icon: '✅',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-600',
    },
    {
      title: 'Total Pendapatan',
      value: `Rp ${(stats.totalRevenue / 1000000).toFixed(1)}Jt`,
      icon: '💰',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F]">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview sistem EventSphere</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.title} className={`bg-white border ${stat.border} rounded-2xl p-5`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-6">
          <h3 className="text-base font-bold text-[#1E3A5F] mb-4">Aksi Cepat</h3>
          <div className="space-y-3">
            <a
              href="/admin/payments"
              className="flex items-center gap-3 p-3 bg-[#F0F7FF] border border-[#BAD5F8] rounded-xl hover:border-blue-400 transition"
            >
              <span className="text-2xl">✅</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1E3A5F]">Verifikasi Pembayaran</p>
                {stats.pendingPayments > 0 && (
                  <p className="text-xs text-amber-600">{stats.pendingPayments} pembayaran menunggu</p>
                )}
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/admin/events"
              className="flex items-center gap-3 p-3 bg-white border border-[#BAD5F8] rounded-xl hover:border-blue-400 transition"
            >
              <span className="text-2xl">🎪</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1E3A5F]">Kelola Event</p>
                <p className="text-xs text-slate-500">{stats.totalEvents} event aktif</p>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 rounded-2xl p-6 text-white">
          <h3 className="text-base font-bold mb-2">EventSphere Admin</h3>
          <p className="text-sm text-blue-100 mb-4">
            Sistem manajemen event dan pembayaran ticketing
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-white/20">
              <span className="text-blue-100">Total Pengguna</span>
              <span className="font-semibold">{stats.totalUsers} user</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/20">
              <span className="text-blue-100">Event Aktif</span>
              <span className="font-semibold">{stats.totalEvents} event</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-blue-100">Revenue Bulan Ini</span>
              <span className="font-semibold">Rp {(stats.totalRevenue / 1000000).toFixed(1)}Jt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}