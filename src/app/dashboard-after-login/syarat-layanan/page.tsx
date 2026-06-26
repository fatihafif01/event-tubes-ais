"use client";

import { useState } from 'react';
import Navbar from '@/components/dashboard-after-login/Navbar';
import Footer from '@/components/dashboard-after-login/Footer';
import { useRouter } from 'next/navigation';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

export default function SyaratLayananPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData>({ name: '', email: '', avatar: undefined });
  const lastUpdated = '26 Juni 2026';

  const sections = [
    {
      title: '1. Penerimaan Syarat',
      content: 'Dengan menggunakan layanan EventSphere, Anda setuju untuk terikat dengan Syarat dan Ketentuan ini. Jika Anda tidak setuju, harap tidak menggunakan layanan kami.'
    },
    {
      title: '2. Pendaftaran Akun',
      content: 'Anda harus berusia minimal 17 tahun untuk menggunakan layanan ini. Anda bertanggung jawab atas kerahasiaan akun Anda dan semua aktivitas yang terjadi di akun Anda. Anda setuju untuk memberikan informasi yang akurat dan terkini.'
    },
    {
      title: '3. Pembelian Tiket',
      content: 'Semua pembelian tiket bersifat final dan tidak dapat dibatalkan, kecuali ditentukan lain oleh penyelenggara event. Harga tiket dapat berubah tanpa pemberitahuan sebelumnya. Kami berhak membatalkan pesanan yang dicurigai sebagai penipuan.'
    },
    {
      title: '4. Refund dan Pengembalian Dana',
      content: 'Refund hanya tersedia jika: event dibatalkan oleh penyelenggara, event dijadwal ulang dan Anda tidak dapat hadir, atau sesuai kebijakan refund penyelenggara. Permintaan refund harus diajukan minimal 7 hari sebelum event.'
    },
    {
      title: '5. Penggunaan Layanan',
      content: 'Anda setuju untuk tidak: menggunakan layanan untuk tujuan ilegal, mengganggu atau merusak sistem kami, mencoba mengakses akun orang lain, atau menggunakan layanan dengan cara yang dapat membahayakan operasional kami.'
    },
    {
      title: '6. Hak Kekayaan Intelektual',
      content: 'Semua konten, logo, dan materi di platform ini adalah milik EventSphere atau pemberi lisensinya. Anda tidak diperbolehkan menyalin, mendistribusikan, atau menggunakan konten kami tanpa izin tertulis.'
    },
    {
      title: '7. Batasan Tanggung Jawab',
      content: 'EventSphere bertindak sebagai platform perantara antara pembeli dan penyelenggara event. Kami tidak bertanggung jawab atas: kualitas event, perubahan jadwal oleh penyelenggara, atau kerugian tidak langsung yang timbul dari penggunaan layanan.'
    },
    {
      title: '8. Penghentian Layanan',
      content: 'Kami berhak menangguhkan atau mengakhiri akun Anda jika Anda melanggar syarat dan ketentuan ini. Kami dapat menghentikan layanan ini kapan saja dengan atau tanpa pemberitahuan.'
    },
    {
      title: '9. Perubahan Syarat',
      content: 'Kami dapat mengubah syarat dan ketentuan ini dari waktu ke waktu. Perubahan akan diberitahukan melalui email atau notifikasi. Dengan terus menggunakan layanan, Anda menyetujui perubahan tersebut.'
    },
    {
      title: '10. Hukum yang Berlaku',
      content: 'Syarat dan ketentuan ini diatur oleh hukum Indonesia. Setiap sengketa akan diselesaikan melalui musyawarah. Jika tidak tercapai kesepakatan, sengketa akan diselesaikan melalui pengadilan yang berwenang di Indonesia.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
      <Navbar user={user} onLogout={() => {}} />
      
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition mb-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
          <h1 className="text-3xl font-bold text-[#1E3A5F] tracking-tight">
            Syarat dan Ketentuan Layanan
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Terakhir diperbarui: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white border border-[#BAD5F8]/60 rounded-xl p-6 mb-8">
          <p className="text-slate-600 leading-relaxed">
            Selamat datang di EventSphere. Dengan mengakses atau menggunakan layanan kami, Anda setuju untuk terikat dengan 
            Syarat dan Ketentuan ini. Harap baca dengan seksama sebelum menggunakan layanan kami.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white border border-[#BAD5F8]/60 rounded-xl p-6"
            >
              <h2 className="text-lg font-bold text-[#1E3A5F] mb-3">
                {section.title}
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Accept Button */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.push('/dashboard-after-login')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
          >
            Saya Setuju
          </button>
          <button
            onClick={() => router.push('/dashboard-after-login')}
            className="px-8 py-3 bg-white hover:bg-slate-50 text-slate-600 border border-[#BAD5F8] font-semibold rounded-xl transition"
          >
            Tidak Setuju
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
}