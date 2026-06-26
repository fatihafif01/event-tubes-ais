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

export default function KebijakanPrivasiPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData>({ name: '', email: '', avatar: undefined });
  const lastUpdated = '26 Juni 2026';

  const sections = [
    {
      title: '1. Informasi yang Kami Kumpulkan',
      content: 'Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, alamat email, nomor telepon, dan informasi pembayaran. Kami juga mengumpulkan informasi secara otomatis saat Anda menggunakan layanan kami, seperti alamat IP, jenis perangkat, dan aktivitas browsing.'
    },
    {
      title: '2. Bagaimana Kami Menggunakan Informasi Anda',
      content: 'Informasi yang kami kumpulkan digunakan untuk: memproses transaksi Anda, mengirimkan konfirmasi dan tiket, memberikan dukungan pelanggan, mengirimkan notifikasi tentang event, meningkatkan layanan kami, dan mencegah penipuan.'
    },
    {
      title: '3. Berbagi Informasi',
      content: 'Kami tidak akan menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami hanya membagikan informasi Anda kepada: penyelenggara event (untuk keperluan tiket), penyedia layanan pembayaran, dan pihak berwenang jika diwajibkan oleh hukum.'
    },
    {
      title: '4. Keamanan Data',
      content: 'Kami menggunakan teknologi enkripsi SSL/TLS untuk melindungi data Anda. Informasi pembayaran diproses melalui payment gateway yang aman dan tersertifikasi PCI DSS. Kami secara rutin melakukan audit keamanan untuk melindungi sistem kami.'
    },
    {
      title: '5. Cookie dan Teknologi Pelacakan',
      content: 'Kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman Anda, mengingat preferensi, dan menganalisis penggunaan layanan. Anda dapat mengontrol pengaturan cookie melalui browser Anda.'
    },
    {
      title: '6. Hak Anda',
      content: 'Anda memiliki hak untuk: mengakses data pribadi Anda, memperbaiki data yang tidak akurat, menghapus data Anda, menarik persetujuan, dan mengajukan keluhan kepada otoritas perlindungan data.'
    },
    {
      title: '7. Perubahan Kebijakan',
      content: 'Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diberitahukan melalui email atau notifikasi di aplikasi. Dengan terus menggunakan layanan kami, Anda menyetujui kebijakan yang diperbarui.'
    },
    {
      title: '8. Kontak',
      content: 'Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di privacy@eventsphere.com atau melalui menu Bantuan.'
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
            Kebijakan Privasi
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Terakhir diperbarui: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white border border-[#BAD5F8]/60 rounded-xl p-6 mb-8">
          <p className="text-slate-600 leading-relaxed">
            EventSphere ("kami", "kita", atau "layanan kami") berkomitmen untuk melindungi privasi dan keamanan informasi pribadi Anda. 
            Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda 
            menggunakan layanan kami.
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


      </main>

      <Footer />
    </div>
  );
}