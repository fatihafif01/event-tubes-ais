"use client";

import { useState, useEffect } from 'react';
import { addNotification } from '@/lib/notifications';

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
  proofData: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// ✅ Toast Notification Component
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-in-right ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <span className="text-lg">
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <p className="text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ✅ Confirmation Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmColor?: 'emerald' | 'red' | 'blue';
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  confirmColor = 'emerald',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const confirmColors = {
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    red: 'bg-red-600 hover:bg-red-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            confirmColor === 'emerald' ? 'bg-emerald-50' : 'bg-red-50'
          }`}>
            <span className="text-3xl">
              {confirmColor === 'emerald' ? '✅' : '⚠️'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">{title}</h3>
          <p className="text-sm text-slate-500">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 ${confirmColors[confirmColor]} text-white font-semibold rounded-xl transition`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentProof[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedPayment, setSelectedPayment] = useState<PaymentProof | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // ✅ Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // ✅ Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    payment: PaymentProof | null;
  }>({ isOpen: false, type: 'approve', payment: null });

  // ✅ Toast helper functions
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const proofs = JSON.parse(localStorage.getItem('payment_proofs') || '[]') as PaymentProof[];
    setPayments(proofs);
  };

  const filteredPayments = filter === 'all'
    ? payments
    : payments.filter(p => p.status === filter);

  // ✅ Handle approve dengan custom modal
  const handleApprove = (payment: PaymentProof) => {
    setConfirmModal({
      isOpen: true,
      type: 'approve',
      payment,
    });
  };

  // ✅ Handle reject dengan custom modal
  const handleReject = (payment: PaymentProof) => {
    setConfirmModal({
      isOpen: true,
      type: 'reject',
      payment,
    });
  };

  // ✅ Confirm action dengan NOTIFIKASI REAL-TIME
  const confirmAction = () => {
    if (!confirmModal.payment) return;

    const payment = confirmModal.payment;
    const newStatus: PaymentProof['status'] = confirmModal.type === 'approve' ? 'approved' : 'rejected';

    const updated = payments.map(p =>
      p.orderId === payment.orderId ? { ...p, status: newStatus } : p
    );
    
    localStorage.setItem('payment_proofs', JSON.stringify(updated));
    setPayments(updated);
    setShowModal(false);
    setSelectedPayment(null);
    setConfirmModal({ isOpen: false, type: 'approve', payment: null });
    
    // ✅ CREATE NOTIFICATION untuk user
    if (confirmModal.type === 'approve') {
      addNotification({
        userId: payment.userId,
        title: 'Pembayaran Disetujui! 🎉',
        message: `Pembayaran tiket ${payment.eventName} telah dikonfirmasi. Tiket sudah aktif di akun Anda.`,
        type: 'payment_approved',
        read: false,
        data: {
          orderId: payment.orderId,
          eventName: payment.eventName,
          amount: payment.amount,
        },
      });
      
      addToast(`Pembayaran ${payment.orderId} berhasil disetujui!`, 'success');
    } else {
      addNotification({
        userId: payment.userId,
        title: 'Pembayaran Ditolak',
        message: `Pembayaran untuk ${payment.eventName} tidak dapat diproses. Silakan hubungi admin untuk informasi lebih lanjut.`,
        type: 'payment_rejected',
        read: false,
        data: {
          orderId: payment.orderId,
          eventName: payment.eventName,
        },
      });
      
      addToast(`Pembayaran ${payment.orderId} ditolak.`, 'error');
    }
  };

  const cancelAction = () => {
    setConfirmModal({ isOpen: false, type: 'approve', payment: null });
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRupiah = (amount: number) => {
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-amber-50 text-amber-600 border-amber-200',
      approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      rejected: 'bg-red-50 text-red-600 border-red-200',
    };
    const labels = {
      pending: 'Menunggu',
      approved: 'Disetujui',
      rejected: 'Ditolak',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ✅ Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F]">Verifikasi Pembayaran</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola dan verifikasi bukti pembayaran</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-[#BAD5F8]/60 rounded-xl w-fit">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:bg-blue-50'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'pending' ? 'Menunggu' : f === 'approved' ? 'Disetujui' : 'Ditolak'}
            <span className="ml-2 text-xs opacity-70">
              {f === 'all' ? payments.length : payments.filter(p => p.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F0F7FF] border-b border-[#BAD5F8]/60">
              <tr>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Order ID</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">User</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Event</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Metode</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Jumlah</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Tanggal</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BAD5F8]/30">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.orderId} className="hover:bg-[#F0F7FF]/30">
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono text-[#1E3A5F]">{payment.orderId}</code>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-[#1E3A5F]">{payment.userName}</p>
                        <p className="text-xs text-slate-500">{payment.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#1E3A5F]">{payment.eventName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{payment.paymentMethod}</p>
                      {payment.vaNumber && (
                        <p className="text-xs text-slate-400 font-mono">{payment.vaNumber}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#1E3A5F]">{formatRupiah(payment.amount)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500">{formatDateTime(payment.uploadedAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowModal(true);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Verifikasi
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada pembayaran {filter !== 'all' ? filter : ''}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1E3A5F]">Verifikasi Pembayaran</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPayment(null);
                  setRejectionReason('');
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Payment Info */}
              <div className="bg-[#F0F7FF] border border-[#BAD5F8] rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-mono font-semibold text-[#1E3A5F]">{selectedPayment.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">User</span>
                  <span className="text-[#1E3A5F]">{selectedPayment.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Event</span>
                  <span className="text-[#1E3A5F]">{selectedPayment.eventName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode</span>
                  <span className="text-[#1E3A5F]">{selectedPayment.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#BAD5F8]">
                  <span className="text-slate-500">Jumlah</span>
                  <span className="font-bold text-blue-600">{formatRupiah(selectedPayment.amount)}</span>
                </div>
              </div>

              {/* Proof Image */}
              {selectedPayment.proofData && (
                <div>
                  <p className="text-sm font-semibold text-[#1E3A5F] mb-2">Bukti Transfer:</p>
                  <div className="border border-[#BAD5F8] rounded-xl overflow-hidden">
                    <img
                      src={selectedPayment.proofData}
                      alt="Bukti transfer"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleApprove(selectedPayment)}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Setujui Pembayaran
                </button>
                <button
                  onClick={() => handleReject(selectedPayment)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Confirmation Modal (Replace browser alert) */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'approve' ? 'Setujui Pembayaran?' : 'Tolak Pembayaran?'}
        message={
          confirmModal.type === 'approve'
            ? `Setujui pembayaran ${confirmModal.payment?.orderId}?`
            : `Tolak pembayaran ${confirmModal.payment?.orderId}?`
        }
        confirmText={confirmModal.type === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak'}
        cancelText="Batal"
        confirmColor={confirmModal.type === 'approve' ? 'emerald' : 'red'}
        onConfirm={confirmAction}
        onCancel={cancelAction}
      />

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}