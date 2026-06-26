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

export default function BantuanPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData>({ name: '', email: '', avatar: undefined });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'Bagaimana cara membeli tiket?',
      answer: 'Pilih event yang diinginkan, klik tombol "Beli", pilih metode pembayaran, dan selesaikan pembayaran. Tiket akan dikirim ke email Anda.'
    },
    {
      id: '2',
      question: 'Bagaimana jika saya ingin refund?',
      answer: 'Refund dapat dilakukan maksimal 7 hari sebelum event. Silakan hubungi tim support kami melalui menu Kontak.'
    },
    {
      id: '3',
      question: 'Apakah tiket dapat dipindahtangankan?',
      answer: 'Ya, tiket dapat dipindahtangankan. Silakan hubungi kami untuk proses pemindahan nama.'
    },
    {
      id: '4',
      question: 'Bagaimana cara top up saldo?',
      answer: 'Buka menu Dompet, klik "Top Up", pilih nominal dan metode pembayaran, lalu selesaikan pembayaran.'
    },
    {
      id: '5',
      question: 'Berapa lama proses verifikasi pembayaran?',
      answer: 'Verifikasi pembayaran biasanya memakan waktu 1-24 jam. Anda akan mendapat notifikasi setelah pembayaran diverifikasi.'
    }
  ];

  const contactMethods = [
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat dengan tim support kami',
      action: 'Buka Chat',
      available: 'Tersedia 24/7'
    },
    {
      icon: '📧',
      title: 'Email',
      description: 'Kirim email ke support@eventsphere.com',
      action: 'Kirim Email',
      available: 'Respon dalam 24 jam'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      description: 'Hubungi kami di 0812-3456-7890',
      action: 'Chat WhatsApp',
      available: 'Sen-Jum, 09:00-17:00'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
      <Navbar user={user} onLogout={() => {}} />
      
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        
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
            Pusat Bantuan
          </h1>
          <p className="text-slate-500 mt-2">
            Temukan jawaban untuk pertanyaan Anda
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Cari bantuan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition shadow-sm"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#1E3A5F] mb-4">Pertanyaan yang Sering Diajukan</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-[#BAD5F8]/60 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-blue-50/50 transition"
                >
                  <span className="font-semibold text-[#1E3A5F]">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-blue-600 transition-transform ${
                      expandedFaq === faq.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-5 pb-4 text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Methods */}

      </main>

      <Footer />
    </div>
  );
}