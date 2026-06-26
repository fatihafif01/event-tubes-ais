// src/lib/wallet.ts

export type TransactionType = 'topup' | 'payment' | 'refund';
export type TransactionStatus = 'success' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  description: string;
  amount: number; // positif = masuk, negatif = keluar
  timestamp: number; // Date.now()
  status: TransactionStatus;
  icon: string;
  referenceId?: string; // ID tiket/event terkait
}

const STORAGE_KEY = 'wallet_transactions';

// ✅ Ambil semua transaksi
export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Transaction[];
  } catch {
    return [];
  }
}

// ✅ Tambah transaksi baru
export function addTransaction(tx: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
  const newTx: Transaction = {
    ...tx,
    id: `TRX-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    timestamp: Date.now(),
  };
  const all = getTransactions();
  all.unshift(newTx); // terbaru di atas
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  // Trigger event biar halaman lain auto-refresh
  window.dispatchEvent(new CustomEvent('wallet-updated'));
  return newTx;
}

// ✅ Hapus transaksi
export function removeTransaction(id: string) {
  const all = getTransactions().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent('wallet-updated'));
}

// ✅ Hitung saldo (hanya transaksi sukses)
export function getBalance(): number {
  return getTransactions()
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);
}

// ✅ Hitung total masuk
export function getTotalIn(): number {
  return getTransactions()
    .filter((t) => t.status === 'success' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
}

// ✅ Hitung total keluar
export function getTotalOut(): number {
  return getTransactions()
    .filter((t) => t.status === 'success' && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

// ✅ Hitung total pending
export function getTotalPending(): number {
  return getTransactions()
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

// ✅ Format tanggal
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ✅ Format rupiah
export function formatRupiah(n: number): string {
  const abs = Math.abs(n);
  return (n < 0 ? '- ' : '') + 'Rp ' + abs.toLocaleString('id-ID');
}