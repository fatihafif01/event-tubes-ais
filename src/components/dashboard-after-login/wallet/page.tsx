"use client";

import { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import {
  getTransactions,
  addTransaction,
  getBalance,
  getTotalIn,
  getTotalOut,
  getTotalPending,
  formatDate,
  formatRupiah,
  type Transaction,
  type TransactionType,
} from '@/lib/wallet';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

export default function WalletPage() {
  const [user, setUser] = useState<UserData>({ name: '', email: '', avatar: undefined });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txFilter, setTxFilter] = useState<'all' | TransactionType>('all');
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [topupMethod, setTopupMethod] = useState('BCA Virtual Account');
  
  // ✅ State untuk balance & totals (hindari hydration error)
  const [balance, setBalance] = useState<number>(0);
  const [totalIn, setTotalIn] = useState<number>(0);
  const [totalOut, setTotalOut] = useState<number>(0);
  const [totalPending, setTotalPending] = useState<number>(0);

  // ✅ Load data user & transaksi
  useEffect(() => {
    const loadData = () => {
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
        console.error('Gagal load user:', err);
      }
      
      // ✅ Load semua data wallet setelah mount
      setTransactions(getTransactions());
      setBalance(getBalance());
      setTotalIn(getTotalIn());
      setTotalOut(getTotalOut());
      setTotalPending(getTotalPending());
    };

    loadData();

    // ✅ Listener biar auto-refresh saat ada transaksi baru
    const handleUpdate = () => {
      setTransactions(getTransactions());
      setBalance(getBalance());
      setTotalIn(getTotalIn());
      setTotalOut(getTotalOut());
      setTotalPending(getTotalPending());
    };
    
    window.addEventListener('wallet-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('wallet-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // ✅ Filter transaksi
  const filteredTx = txFilter === 'all'
    ? transactions
    : transactions.filter((t) => t.type === txFilter);

  // ✅ Handle Top Up
  const handleTopup = () => {
    const amount = parseInt(topupAmount);
    if (!amount || amount < 10000) {
      alert('Minimal top up Rp 10.000');
      return;
    }

    addTransaction({
      type: 'topup',
      title: 'Top Up Saldo',
      description: `Via ${topupMethod}`,
      amount: amount,
      status: 'success',
      icon: '💳',
    });

    setTopupAmount('');
    setShowTopupModal(false);
  };

  const txTabs = [
    { key: 'all',     label: 'Semua' },
    { key: 'topup',   label: 'Top Up' },
    { key: 'payment', label: 'Pembayaran' },
    { key: 'refund',  label: 'Refund' },
  ];

  const paymentMethods = [
    { name: 'BCA Virtual Account', icon: '🏦' },
    { name: 'Mandiri VA', icon: '🏦' },
    { name: 'GoPay', icon: '💚' },
    { name: 'OVO', icon: '💜' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
      <Navbar user={user} onLogout={() => {}} />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] tracking-tight">
            Dompet Saya
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola saldo dan lihat riwayat transaksi kamu
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ── Balance Card ─────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 rounded-2xl p-6 sm:p-8 text-white overflow-hidden shadow-lg shadow-blue-500/25">
              <div className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full bg-white/10" />
              <div className="absolute bottom-[-40px] left-[-40px] w-32 h-32 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-blue-100">Saldo EventSphere</span>
                </div>

                <div className="mb-6">
                  <p className="text-xs text-blue-200/80 uppercase tracking-wider mb-1">Total Saldo</p>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    {formatRupiah(balance)}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowTopupModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 text-sm font-semibold rounded-xl transition shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Top Up
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold rounded-xl transition backdrop-blur-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    Tarik Dana
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Info Cards - DINAMIS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-white border border-[#BAD5F8]/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-500">Total Masuk</span>
                </div>
                <p className="text-lg font-bold text-[#1E3A5F]">{formatRupiah(totalIn)}</p>
              </div>
              <div className="bg-white border border-[#BAD5F8]/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-500">Total Keluar</span>
                </div>
                <p className="text-lg font-bold text-[#1E3A5F]">{formatRupiah(totalOut)}</p>
              </div>
              <div className="bg-white border border-[#BAD5F8]/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-500">Pending</span>
                </div>
                <p className="text-lg font-bold text-[#1E3A5F]">{formatRupiah(totalPending)}</p>
              </div>
            </div>
          </div>

          {/* ── Payment Methods ──────────────────────────────── */}
          <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-5 h-fit">
            <h3 className="text-base font-bold text-[#1E3A5F] mb-4">Metode Pembayaran</h3>
            <div className="space-y-3">
              {paymentMethods.map((method, idx) => (
                <div
                  key={method.name}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                    idx === 0
                      ? 'bg-[#F0F7FF] border-blue-300'
                      : 'bg-white border-[#BAD5F8]/60 hover:border-blue-300'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#BAD5F8] flex items-center justify-center text-lg">
                    {method.icon}
                  </div>
                  <span className="flex-1 text-sm font-medium text-[#1E3A5F]">{method.name}</span>
                  {idx === 0 && (
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      Utama
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 bg-[#F0F7FF] hover:bg-blue-600 hover:text-white text-blue-600 border border-[#BAD5F8] text-sm font-semibold rounded-xl transition cursor-pointer">
              + Tambah Metode
            </button>
          </div>
        </div>

        {/* ── Transaction History ─────────────────────────────── */}
        <div className="mt-8 bg-white border border-[#BAD5F8]/60 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#BAD5F8]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-base font-bold text-[#1E3A5F]">Riwayat Transaksi</h3>
            <div className="flex flex-wrap gap-1.5 p-1 bg-[#F0F7FF] border border-[#BAD5F8]/60 rounded-lg w-fit">
              {txTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTxFilter(tab.key as any)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    txFilter === tab.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#BAD5F8]/30">
            {filteredTx.length > 0 ? (
              filteredTx.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex items-center gap-4 hover:bg-[#F0F7FF]/50 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#F0F7FF] border border-[#BAD5F8] flex items-center justify-center text-xl flex-shrink-0">
                    {tx.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-semibold text-[#1E3A5F] truncate">{tx.title}</h4>
                      {tx.status === 'pending' && (
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                      {tx.status === 'failed' && (
                        <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
                          Gagal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{tx.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(tx.timestamp)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${tx.amount >= 0 ? 'text-emerald-600' : 'text-[#1E3A5F]'}`}>
                      {formatRupiah(tx.amount)}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wide">
                      {tx.type}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#F0F7FF] border border-[#BAD5F8] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#1E3A5F] mb-1">Belum ada transaksi</p>
                <p className="text-xs text-slate-500">
                  {txFilter === 'all' 
                    ? 'Mulai top up atau beli tiket untuk melihat riwayat'
                    : `Belum ada transaksi ${txFilter.toLowerCase()}`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Top Up Modal ─────────────────────────────────────── */}
      {showTopupModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#BAD5F8]">
            <h3 className="text-lg font-bold text-[#1E3A5F] mb-4">Top Up Saldo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Jumlah (Rp)</label>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="Minimal 10.000"
                  min="10000"
                  className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Metode Pembayaran</label>
                <select
                  value={topupMethod}
                  onChange={(e) => setTopupMethod(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500"
                >
                  {paymentMethods.map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowTopupModal(false)}
                  className="flex-1 py-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-[#BAD5F8] text-sm font-semibold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleTopup}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
                >
                  Top Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}