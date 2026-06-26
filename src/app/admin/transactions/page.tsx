"use client";

import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'topup' | 'payment' | 'refund';
  title: string;
  description: string;
  amount: number;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
  userName?: string;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadData = () => {
      const txs = JSON.parse(localStorage.getItem('wallet_transactions') || '[]') as Transaction[];
      setTransactions(txs);
    };

    // Load pertama kali
    loadData();

    // ✅ Real-time listeners
    const handleUpdate = () => loadData();
    window.addEventListener('wallet-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('wallet-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRupiah = (amount: number) => {
    return (amount >= 0 ? '+ ' : '- ') + 'Rp ' + Math.abs(amount).toLocaleString('id-ID');
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      topup: 'bg-emerald-50 text-emerald-600',
      payment: 'bg-blue-50 text-blue-600',
      refund: 'bg-amber-50 text-amber-600',
    };
    const labels = {
      topup: 'Top Up',
      payment: 'Pembayaran',
      refund: 'Refund',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badges[type as keyof typeof badges]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F]">Riwayat Transaksi</h1>
          <p className="text-slate-500 text-sm mt-1">Semua transaksi sistem</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">Live</span>
        </div>
      </div>

      <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F0F7FF] border-b border-[#BAD5F8]/60">
              <tr>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Transaksi ID</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Tipe</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Deskripsi</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Jumlah</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Waktu</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BAD5F8]/30">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#F0F7FF]/30">
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono text-[#1E3A5F]">{tx.id}</code>
                    </td>
                    <td className="px-6 py-4">
                      {getTypeBadge(tx.type)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-[#1E3A5F]">{tx.title}</p>
                        <p className="text-xs text-slate-500">{tx.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm font-bold ${tx.amount >= 0 ? 'text-emerald-600' : 'text-[#1E3A5F]'}`}>
                        {formatRupiah(tx.amount)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500">{formatDateTime(tx.timestamp)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold ${
                        tx.status === 'success' ? 'text-emerald-600' :
                        tx.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {tx.status === 'success' ? 'Berhasil' :
                         tx.status === 'pending' ? 'Pending' : 'Gagal'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Belum ada transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}