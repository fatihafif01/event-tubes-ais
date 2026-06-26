"use client";

import { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

interface UserData {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [profile, setProfile] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    avatar: undefined,
  });

  // ✅ Ambil data user dari localStorage (hasil login)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setProfile({
          name: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          avatar: parsed.avatar || undefined,
        });
      }
    } catch (err) {
      console.error('Gagal load data user:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // ✅ Inisial avatar dinamis dari nama user
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleSave = () => {
    // Simpan update ke localStorage juga
    try {
      const storedUser = localStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : {};
      const updatedUser = {
        ...currentUser,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Gagal simpan:', err);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Loading state biar gak nge-flash data kosong
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center">
        <div className="text-slate-500">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
      <Navbar 
        user={{ 
          name: profile.name, 
          email: profile.email, 
          avatar: profile.avatar 
        }} 
        onLogout={() => {}} 
      />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] tracking-tight">
            Pengaturan Akun
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola informasi profil dan preferensi kamu
          </p>
        </div>

        {/* Success Alert */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-emerald-700">Pengaturan berhasil disimpan!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ── Profile Card ─────────────────────────────────── */}
          <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-6 h-fit">
            <h3 className="text-base font-bold text-[#1E3A5F] mb-5">Foto Profil</h3>
            <div className="flex flex-col items-center text-center">
              {/* ✅ Avatar dinamis */}
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-[#BAD5F8] shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-md shadow-blue-500/20">
                  {getInitials(profile.name)}
                </div>
              )}
              <button className="w-full py-2.5 bg-[#F0F7FF] hover:bg-blue-600 hover:text-white text-blue-600 border border-[#BAD5F8] text-sm font-semibold rounded-xl transition cursor-pointer mb-2">
                Ubah Foto
              </button>
              <button className="w-full py-2 text-sm text-slate-500 hover:text-red-500 transition">
                Hapus Foto
              </button>
            </div>
          </div>

          {/* ── Form ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Data Diri */}
            <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-6">
              <h3 className="text-base font-bold text-[#1E3A5F] mb-5">Data Diri</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Nomor Telepon</label>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition"
                  />
                </div>
              </div>
            </div>

            {/* Preferensi */}
            <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-6">
              <h3 className="text-base font-bold text-[#1E3A5F] mb-5">Preferensi</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Bahasa</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="pt-2 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div>
                      <p className="text-sm font-medium text-[#1E3A5F]">Notifikasi Email</p>
                      <p className="text-xs text-slate-500">Terima update pesanan & event</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-10 h-5 rounded-full bg-slate-200 appearance-none checked:bg-blue-600 relative transition cursor-pointer before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition before:shadow checked:before:translate-x-5"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div>
                      <p className="text-sm font-medium text-[#1E3A5F]">Promo & Penawaran</p>
                      <p className="text-xs text-slate-500">Dapatkan info diskon spesial</p>
                    </div>
                    <input
                      type="checkbox"
                      className="w-10 h-5 rounded-full bg-slate-200 appearance-none checked:bg-blue-600 relative transition cursor-pointer before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition before:shadow checked:before:translate-x-5"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="flex justify-end gap-3">
              <button className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-[#BAD5F8] text-sm font-semibold rounded-xl transition">
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}