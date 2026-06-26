  "use client";

  import { useParams, useSearchParams, useRouter } from 'next/navigation';
  import { useState, useEffect, useRef } from 'react';
  import Navbar from '@/components/dashboard-after-login/Navbar';
  import Footer from '@/components/dashboard-after-login/Footer';
  import { addTransaction, getBalance } from '@/lib/wallet';
  import { addNotification } from '@/lib/notifications';

  interface UserData {
    name: string;
    email: string;
    avatar?: string;
    id?: string;
  }

  // ✅ Generate nomor VA yang KONSISTEN (tidak berubah)
  function generateConsistentVA(userId: string, eventId: string, prefix: string): string {
    const combined = `${userId}-${eventId}-${prefix}`;
    
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const absHash = Math.abs(hash).toString().padStart(8, '0').slice(0, 8);
    const formatted = `${absHash.slice(0, 4)} ${absHash.slice(4, 8)}`;
    
    return `${prefix} ${formatted}`;
  }

  // ✅ Simpan nomor VA ke localStorage
  function saveVANumber(userId: string, eventId: string, method: string, vaNumber: string) {
    const key = `va_${userId}_${eventId}_${method}`;
    localStorage.setItem(key, vaNumber);
  }

  // ✅ Ambil nomor VA yang tersimpan
  function getSavedVANumber(userId: string, eventId: string, method: string): string | null {
    const key = `va_${userId}_${eventId}_${method}`;
    return localStorage.getItem(key);
  }

  // ✅ Generate QR Code visual (SVG pattern)
  function QRCodeVisual({ value }: { value: string }) {
    const size = 25;
    const cells: boolean[][] = [];
    
    let seed = 0;
    for (let i = 0; i < value.length; i++) {
      seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
    }
    
    const rand = () => {
      seed = (seed * 1103515245 + 12345) >>> 0;
      return (seed / 0xffffffff);
    };
    
    for (let y = 0; y < size; y++) {
      cells[y] = [];
      for (let x = 0; x < size; x++) {
        const isFinderCorner = 
          (x < 7 && y < 7) || 
          (x >= size - 7 && y < 7) || 
          (x < 7 && y >= size - 7);
        
        if (isFinderCorner) {
          const fx = x < 7 ? x : x - (size - 7);
          const fy = y < 7 ? y : y - (size - 7);
          const isOuter = fx === 0 || fx === 6 || fy === 0 || fy === 6;
          const isInner = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4;
          cells[y][x] = isOuter || isInner;
        } else {
          cells[y][x] = rand() > 0.5;
        }
      }
    }
    
    const cellSize = 8;
    const svgSize = size * cellSize;
    
    return (
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="mx-auto">
        <rect width={svgSize} height={svgSize} fill="white" />
        {cells.map((row, y) =>
          row.map((cell, x) =>
            cell ? (
              <rect
                key={`${x}-${y}`}
                x={x * cellSize}
                y={y * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#1E3A5F"
              />
            ) : null
          )
        )}
      </svg>
    );
  }

  export default function PaymentPage() {
    const params = useParams() ?? {};
    const searchParams = useSearchParams() ?? new URLSearchParams();
    const router = useRouter();
    const eventId = (params?.id as string) || '';
    const method = searchParams.get('method') || 'bca-va';
    
    const [user, setUser] = useState<UserData>({ name: '', email: '', avatar: undefined, id: undefined });
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [expired, setExpired] = useState(false);
    const [copied, setCopied] = useState(false);
    const [vaNumber, setVaNumber] = useState<string>('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Event data
    const event = {
      id: eventId,
      title: 'Summer Music Fest 2026',
      price: 250000,
      adminFee: 5000,
    };
    const total = event.price + event.adminFee;

    const vaConfig: Record<string, { bank: string; prefix: string; instructions: string[] }> = {
      'bca-va': {
        bank: 'BCA Virtual Account',
        prefix: '8805',
        instructions: [
          'Login ke BCA Mobile/KlikBCA',
          'Pilih m-Transfer → BCA Virtual Account',
          `Masukkan nomor VA: {VA_NUMBER}`,
          `Pastikan nama "EventSphere - {EVENT_TITLE}"`,
          `Masukkan jumlah: Rp ${total.toLocaleString('id-ID')}`,
          'Konfirmasi dan masukkan PIN',
          'Screenshot bukti transfer',
        ]
      },
      'mandiri-va': {
        bank: 'Mandiri Virtual Account',
        prefix: '8960',
        instructions: [
          'Login ke Livin by Mandiri',
          'Pilih Bayar → Multi Payment',
          `Masukkan kode perusahaan: 70012`,
          `Masukkan nomor VA: {VA_NUMBER}`,
          `Masukkan jumlah: Rp ${total.toLocaleString('id-ID')}`,
          'Konfirmasi pembayaran',
          'Screenshot bukti transfer',
        ]
      },
      'bni-va': {
        bank: 'BNI Virtual Account',
        prefix: '8808',
        instructions: [
          'Login ke BNI Mobile Banking',
          'Pilih Menu Transfer',
          `Masukkan nomor VA: {VA_NUMBER}`,
          `Pastikan nama merchant "EventSphere"`,
          `Masukkan jumlah: Rp ${total.toLocaleString('id-ID')}`,
          'Konfirmasi dengan PIN',
          'Screenshot bukti transfer',
        ]
      },
      'bri-va': {
        bank: 'BRI Virtual Account',
        prefix: '8881',
        instructions: [
          'Login ke BRImo',
          'Pilih Pembayaran → BRIVA',
          `Masukkan nomor VA: {VA_NUMBER}`,
          `Cek detail transaksi`,
          `Masukkan jumlah: Rp ${total.toLocaleString('id-ID')}`,
          'Konfirmasi dengan PIN',
          'Screenshot bukti transfer',
        ]
      },
      'qris': {
        bank: 'QRIS',
        prefix: '',
        instructions: [
          'Buka aplikasi e-wallet (GoPay, OVO, DANA, ShopeePay)',
          'Pilih menu Scan / Bayar',
          'Arahkan kamera ke QR Code di atas',
          `Pastikan nominal: Rp ${total.toLocaleString('id-ID')}`,
          'Konfirmasi pembayaran',
          'Screenshot bukti pembayaran',
        ]
      },
      'gopay': {
        bank: 'GoPay',
        prefix: '',
        instructions: [
          'Buka aplikasi Gojek',
          'Pilih GoPay → Bayar',
          'Scan QR Code di atas',
          `Pastikan nominal: Rp ${total.toLocaleString('id-ID')}`,
          'Konfirmasi dengan PIN',
          'Screenshot bukti pembayaran',
        ]
      },
      'ovo': {
        bank: 'OVO',
        prefix: '',
        instructions: [
          'Buka aplikasi OVO',
          'Pilih Scan → Bayar',
          'Arahkan ke QR Code',
          `Pastikan nominal: Rp ${total.toLocaleString('id-ID')}`,
          'Konfirmasi dengan Security Code',
          'Screenshot bukti pembayaran',
        ]
      },
      'dana': {
        bank: 'DANA',
        prefix: '',
        instructions: [
          'Buka aplikasi DANA',
          'Pilih Scan / Bayar',
          'Arahkan ke QR Code',
          `Pastikan nominal: Rp ${total.toLocaleString('id-ID')}`,
          'Konfirmasi dengan PIN',
          'Screenshot bukti pembayaran',
        ]
      },
    };

    const config = vaConfig[method] || vaConfig['bca-va'];
    const isQRIS = ['qris', 'gopay', 'ovo', 'dana'].includes(method);
    const isVA = !isQRIS;

    // Load user & generate VA number & load balance
    useEffect(() => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const userData = {
            name: parsed.name || 'User',
            email: parsed.email || '',
            avatar: parsed.avatar || undefined,
            id: parsed.id || 'user-' + Date.now(),
          };
          setUser(userData);
          setBalance(getBalance());

          // ✅ Generate atau ambil VA number yang tersimpan
          if (isVA) {
            const savedVA = getSavedVANumber(userData.id, eventId, method);
            if (savedVA) {
              setVaNumber(savedVA);
            } else {
              const newVA = generateConsistentVA(userData.id, eventId, config.prefix);
              setVaNumber(newVA);
              saveVANumber(userData.id, eventId, method, newVA);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, [eventId, method, isVA, config.prefix]);

    // Countdown timer
    useEffect(() => {
      if (expired || uploadSuccess) return;
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [expired, uploadSuccess]);

    const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };

    const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    // ✅ Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('Harap upload file gambar (JPG, PNG)');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('Ukuran file maksimal 5MB');
          return;
        }

        setUploadFile(file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    // ✅ Upload bukti pembayaran
    const handleUploadProof = async () => {
      if (!uploadFile || !uploadPreview) {
        alert('Harap upload bukti transfer terlebih dahulu');
        return;
      }

      setIsUploading(true);

      try {
        const proofData = {
          orderId: `ORD-${Date.now()}`,
          eventId: event.id,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          eventName: event.title,
          amount: total,
          paymentMethod: config.bank,
          vaNumber: isVA ? vaNumber : '',
          proofFile: uploadFile.name,
          proofData: uploadPreview,
          uploadedAt: new Date().toISOString(),
          status: 'pending',
        };

        const existingProofs = JSON.parse(localStorage.getItem('payment_proofs') || '[]');
        existingProofs.push(proofData);
        localStorage.setItem('payment_proofs', JSON.stringify(existingProofs));

        addTransaction({
          type: 'payment',
          title: 'Pembayaran Tiket',
          description: `${event.title} via ${config.bank}`,
          amount: -total,
          status: 'pending',
          icon: '🎫',
          referenceId: eventId,
        });

        setUploadSuccess(true);
        
        setTimeout(() => {
          router.push(`/events/${eventId}/success?method=${method}&status=pending`);
        }, 2000);

      } catch (err) {
        console.error('Upload error:', err);
        alert('Terjadi kesalahan saat upload. Silakan coba lagi.');
      } finally {
        setIsUploading(false);
      }
    };

    // ✅ HANDLE PEMBAYARAN DENGAN SALDO
    const handlePayWithWallet = () => {
      if (balance < total) {
        alert(`Saldo tidak cukup! Saldo Anda: Rp ${balance.toLocaleString('id-ID')}. Silakan top up terlebih dahulu.`);
        router.push('/dashboard-after-login/wallet');
        return;
      }

      if (!confirm(`Bayar Rp ${total.toLocaleString('id-ID')} dengan saldo EventSphere Anda?`)) {
        return;
      }

      // ✅ Catat transaksi
      addTransaction({
        type: 'payment',
        title: 'Pembayaran Tiket',
        description: event.title,
        amount: -total,
        status: 'success',
        icon: '🎫',
        referenceId: eventId,
      });

      // ✅ BUAT NOTIFIKASI otomatis
      addNotification({
        userId: user.id || 'user-' + Date.now(),
        title: 'Pembayaran Berhasil! 🎉',
        message: `Pembayaran tiket ${event.title} sebesar Rp ${total.toLocaleString('id-ID')} berhasil. Tiket sudah aktif di akun Anda.`,
        type: 'payment_approved',
        read: false,
        data: {
          orderId: `ORD-${Date.now()}`,
          eventName: event.title,
          amount: total,
          paymentMethod: 'Saldo EventSphere',
        },
      });

      // Redirect ke success page
      router.push(`/events/${eventId}/success?method=wallet&paid=true`);
    };

    const handleCancel = () => {
      if (confirm('Yakin ingin membatalkan pembayaran?')) {
        router.push(`/events/${eventId}/buy`);
      }
    };

    const formattedInstructions = config.instructions.map((inst) =>
      inst.replace('{VA_NUMBER}', vaNumber).replace('{EVENT_TITLE}', event.title)
    );

    const timerColor = timeLeft > 300 ? 'text-emerald-600' : timeLeft > 60 ? 'text-amber-600' : 'text-red-600';
    const timerBg = timeLeft > 300 ? 'bg-emerald-50 border-emerald-200' : timeLeft > 60 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

    if (expired) {
      return (
        <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
          <Navbar user={user} onLogout={() => {}} />
          <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full flex items-center">
            <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-8 text-center w-full">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-50 border border-red-200 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#1E3A5F] mb-2">Pembayaran Kedaluwarsa</h1>
              <p className="text-slate-500 text-sm mb-6">
                Batas waktu pembayaran telah habis. Silakan lakukan pemesanan ulang.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
                >
                  Pesan Ulang
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-[#BAD5F8] transition"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    if (uploadSuccess) {
      return (
        <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
          <Navbar user={user} onLogout={() => {}} />
          <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full flex items-center">
            <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-8 text-center w-full">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#1E3A5F] mb-2">Bukti Pembayaran Terkirim!</h1>
              <p className="text-slate-500 text-sm mb-6">
                Pembayaran sedang diverifikasi oleh admin. Kamu akan mendapat notifikasi setelah pembayaran dikonfirmasi.
              </p>
              <p className="text-xs text-slate-400">
                Mengalihkan ke halaman sukses...
              </p>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
        <Navbar user={user} onLogout={() => {}} />
        
        <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
          
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition mb-3"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] tracking-tight">
              Pembayaran
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Upload bukti pembayaran sebelum waktu habis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ── Payment Detail ─────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Timer */}
              <div className={`flex items-center justify-between p-4 rounded-xl border ${timerBg}`}>
                <div className="flex items-center gap-3">
                  <svg className={`w-5 h-5 ${timerColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-500">Batas Waktu Pembayaran</p>
                    <p className={`text-lg font-bold ${timerColor}`}>
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  {timeLeft > 60 ? 'Segera upload bukti pembayaran' : 'Segera! Waktu hampir habis'}
                </p>
              </div>

              {/* Payment Info */}
              <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#BAD5F8]/40">
                  <div className="w-10 h-10 rounded-lg bg-[#F0F7FF] border border-[#BAD5F8] flex items-center justify-center text-xl">
                    {isQRIS ? '📱' : '🏦'}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Metode Pembayaran</p>
                    <p className="font-bold text-[#1E3A5F]">{config.bank}</p>
                  </div>
                </div>

                {/* VA Number atau QRIS */}
                {isQRIS ? (
                  <div className="py-6 text-center">
                    <p className="text-sm text-slate-500 mb-4">Scan QR Code dengan aplikasi e-wallet</p>
                    <div className="inline-block p-4 bg-white border-2 border-[#BAD5F8] rounded-xl">
                      <QRCodeVisual value={`QRIS-EVENTSPHERE-${eventId}-${total}`} />
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                      Pastikan nominal sesuai: <span className="font-bold text-[#1E3A5F]">Rp {total.toLocaleString('id-ID')}</span>
                    </p>
                  </div>
                ) : (
                  <div className="py-6">
                    <p className="text-sm text-slate-500 mb-2">Nomor Virtual Account</p>
                    <div className="flex items-center justify-between p-4 bg-[#F0F7FF] border border-[#BAD5F8] rounded-xl">
                      <code className="text-xl font-bold text-[#1E3A5F] tracking-wider">
                        {vaNumber}
                      </code>
                      <button
                        onClick={() => handleCopy(vaNumber)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-blue-600 border border-[#BAD5F8] text-xs font-semibold rounded-lg transition"
                      >
                        {copied ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Tersalin
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Salin
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      💡 Nomor VA ini tersimpan dan tidak akan berubah
                    </p>
                  </div>
                )}

                {/* Instructions */}
                <div className="pt-4 border-t border-[#BAD5F8]/40">
                  <p className="text-sm font-bold text-[#1E3A5F] mb-3">Cara Pembayaran:</p>
                  <ol className="space-y-2">
                    {formattedInstructions.map((inst, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Upload Bukti Transfer */}
              <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-6">
                <h3 className="text-base font-bold text-[#1E3A5F] mb-3">Upload Bukti Pembayaran</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Upload screenshot bukti transfer/pembayaran untuk diverifikasi oleh admin
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {!uploadFile ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-[#BAD5F8] rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition flex flex-col items-center gap-2"
                  >
                    <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-slate-500">Klik untuk upload bukti transfer</span>
                    <span className="text-xs text-slate-400">Format: JPG, PNG (Max 5MB)</span>
                  </button>
                ) : uploadPreview ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <img
                        src={uploadPreview}
                        alt="Preview bukti transfer"
                        className="w-full h-48 object-cover rounded-xl border border-[#BAD5F8]"
                      />
                      <button
                        onClick={() => {
                          setUploadFile(null);
                          setUploadPreview(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#F0F7FF] border border-[#BAD5F8] rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-[#1E3A5F]">{uploadFile.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {(uploadFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                ) : null}

                <button
                  onClick={handleUploadProof}
                  disabled={!uploadFile || !uploadPreview || isUploading}
                  className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload Bukti Pembayaran
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ── Sidebar ─────────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-5 sticky top-24 space-y-4">
                <h3 className="text-base font-bold text-[#1E3A5F]">Detail Transaksi</h3>
                
                <div className="space-y-2 text-sm pb-4 border-b border-[#BAD5F8]/40">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Event</span>
                    <span className="font-medium text-[#1E3A5F] text-right">{event.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Harga Tiket</span>
                    <span className="text-slate-700">Rp {event.price.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Biaya Layanan</span>
                    <span className="text-slate-700">Rp {event.adminFee.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex justify-between text-[#1E3A5F] font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
                </div>

                {/* Saldo Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs text-blue-800 mb-1">Saldo EventSphere Anda</p>
                  <p className={`text-lg font-bold ${balance >= total ? 'text-blue-600' : 'text-red-600'}`}>
                    Rp {balance.toLocaleString('id-ID')}
                  </p>
                  {balance < total && (
                    <p className="text-xs text-red-500 mt-1">Saldo tidak cukup</p>
                  )}
                </div>

                {/* Bayar dengan Saldo Button */}
                {balance >= total && (
                  <button
                    onClick={handlePayWithWallet}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Bayar dengan Saldo
                  </button>
                )}

                {balance < total && (
                  <button
                    onClick={() => router.push('/dashboard-after-login/wallet')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
                  >
                    Top Up Saldo
                  </button>
                )}

                <button
                  onClick={handleCancel}
                  className="w-full py-2.5 text-sm text-slate-500 hover:text-red-500 transition"
                >
                  Batalkan Pesanan
                </button>

                <div className="pt-3 border-t border-[#BAD5F8]/40">
                  <p className="text-[11px] text-slate-400 text-center">
                    💡 Pembayaran dengan saldo langsung aktif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }