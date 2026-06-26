"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ✅ Admin credentials (hardcoded - tidak perlu di database)
const ADMIN_EMAIL    = 'admin@eventku.com';
const ADMIN_PASSWORD = 'admin2025';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData]         = useState({ email: '', password: '' });
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Email dan password harus diisi');
      return;
    }

    setLoading(true);
    try {
      // ✅ CEK 1: Apakah ini admin? (hardcoded)
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_user', JSON.stringify({
          username: ADMIN_EMAIL,
          name: 'Administrator',
          role: 'super_admin',
          email: ADMIN_EMAIL,
        }));
        router.push('/admin/dashboard');
        return;
      }

      // ✅ CEK 2: Login via Neon Database (user atau organizer)
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // Cek response type
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error: response tidak valid');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      const user = data.user;

      // ✅ CEK 3: Apakah user ini organizer?
      if (user.role === 'organizer') {
        localStorage.setItem('organizer_logged_in', 'true');
        localStorage.setItem('organizer_user', JSON.stringify({
          id: user.id,
          username: user.email,
          name: user.name,
          role: 'organizer',
          email: user.email,
          company: user.company || 'Event Organizer',
        }));
        router.push('/organizer/dashboard');
        return;
      }

      // ✅ CEK 4: Default - login sebagai user biasa
      localStorage.setItem('user_logged_in', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
      }));
      router.push('/dashboard-after-login');

    } catch (err: any) {
      setError(err.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F0F7FF]">

      {/* ── LEFT PANEL: Grid Pattern Only ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1D4ED8] to-[#0EA5E9] items-center justify-center">

        {/* Geometric grid pattern (kotak-kotak) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.15]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Floating accent circles (dekoratif) */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-white/5 border border-white/10" />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full bg-white/5 border border-white/10" />
        <div className="absolute top-1/2 right-16 w-32 h-32 rounded-full bg-[#0EA5E9]/20 blur-2xl" />
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 rounded-full bg-sky-400/10 blur-3xl" />

        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>

      {/* ── RIGHT PANEL: Login Form ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-16 xl:px-24">

        {/* Top bar (mobile logo + back button) */}
        <div className="flex items-center justify-between mb-8 lg:mb-0">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-blue-500/20">
              ES
            </div>
            <span className="text-base font-bold text-[#1E3A5F]">
              Zenix<span className="text-blue-600">Event</span>
            </span>
          </Link>

          {/* Back button */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors group"
            aria-label="Kembali ke beranda"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Kembali
          </button>
        </div>

        {/* Form area — centered vertically */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[400px]">

            {/* Form header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] tracking-tight">
                Selamat datang
              </h2>
              <p className="text-slate-500 mt-1.5 text-sm">
                Masuk untuk melanjutkan ke akun Anda
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <div className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mt-0.5 flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-[#1E3A5F]">
                  Email
                </label>
                <input
                  type="email" id="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="nama@email.com"
                  required
                  className="w-full px-4 py-3 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all shadow-sm"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-[#1E3A5F]">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Lupa password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password" name="password"
                    value={formData.password} onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-12 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" x2="23" y1="1" y2="23"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#BAD5F8] bg-white text-blue-600 focus:ring-blue-500/20 focus:ring-offset-0"
                />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                  Ingat saya selama 30 hari
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-1 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk ke akun
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Info Admin */}
            <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-800 text-center">
                <strong>🔐 Akses Admin:</strong><br />
                Email: <code className="bg-white px-1.5 py-0.5 rounded text-[10px]">admin@eventku.com</code><br />
                Password: <code className="bg-white px-1.5 py-0.5 rounded text-[10px]">admin2025</code>
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#BAD5F8]/60" />
              <span className="text-xs text-slate-400 font-medium">atau lanjutkan dengan</span>
              <div className="flex-1 h-px bg-[#BAD5F8]/60" />
            </div>

            {/* Google SSO */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[#BAD5F8] rounded-xl hover:bg-[#F0F7FF] hover:border-blue-300 transition-all shadow-sm text-sm font-medium text-[#1E3A5F] group"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
              </svg>
              Masuk dengan Google
            </button>

            {/* Register link */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Daftar gratis
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">© 2026 EventSphere. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
} 