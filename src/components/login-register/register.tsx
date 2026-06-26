"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const getPasswordStrength = (password: string) => {
  if (!password)           return null;
  if (password.length < 6) return { level: 0, label: 'Lemah',       bar: 1, color: '#EF4444', bg: '#FEE2E2', text: 'text-red-500'   };
  if (password.length < 8) return { level: 1, label: 'Cukup',       bar: 2, color: '#F59E0B', bg: '#FEF3C7', text: 'text-amber-500' };
  if (password.length < 10)return { level: 2, label: 'Kuat',        bar: 3, color: '#2563EB', bg: '#DBEAFE', text: 'text-blue-600'  };
  return                          { level: 3, label: 'Sangat Kuat', bar: 4, color: '#16A34A', bg: '#DCFCE7', text: 'text-green-600' };
};

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'user' as 'user' | 'organizer',
    company: '',
  });
  const [error, setError]                             = useState('');
  const [loading, setLoading]                         = useState(false);
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms]             = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Semua field harus diisi'); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok'); return;
    }
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter'); return;
    }
    if (formData.role === 'organizer' && !formData.company) {
      setError('Nama perusahaan/organisasi wajib diisi untuk role Organizer'); return;
    }
    if (!acceptedTerms) {
      setError('Anda harus menyetujui Syarat & Ketentuan'); return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          company: formData.role === 'organizer' ? formData.company : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }

      alert(`Registrasi berhasil sebagai ${formData.role === 'organizer' ? 'Organizer' : 'User'}! Silakan login.`);
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);
  const passwordMatch = formData.confirmPassword
    ? formData.password === formData.confirmPassword
    : null;

  return (
    <div className="min-h-screen flex bg-[#F0F7FF]">

      {/* ── LEFT PANEL: Branding ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1D4ED8] to-[#0EA5E9] flex-col justify-between p-12">

        {/* Geometric grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="grid-reg" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M50 0L0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-reg)"/>
        </svg>

        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full border border-white/8" />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full border border-white/8" />
        <div className="absolute top-1/2 right-20 w-28 h-28 rounded-full bg-sky-400/10 blur-2xl" />

        {/* Logo */}
       
      </div>

      {/* ── RIGHT PANEL: Register Form ────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-12 xl:px-20 overflow-y-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 lg:mb-0 flex-shrink-0">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-blue-500/20">
              ES
            </div>
            <span className="text-base font-bold text-[#1E3A5F]">
              Event<span className="text-blue-600">Sphere</span>
            </span>
          </Link>

          {/* Back button */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors group ml-auto"
            aria-label="Kembali ke beranda"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Kembali
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center py-6">
          <div className="w-full max-w-[400px]">

            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] tracking-tight">Buat akun</h2>
              <p className="text-slate-500 mt-1.5 text-sm">Daftar untuk mulai menjelajahi event</p>
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

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ✅ Role Selection - DROPDOWN */}
              <div className="space-y-1.5">
                <label htmlFor="role" className="block text-sm font-medium text-[#1E3A5F]">Daftar sebagai</label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="user"> User - Beli tiket & ikuti event</option>
                    <option value="organizer"> Organizer - Buat & kelola event</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Nama */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-medium text-[#1E3A5F]">Nama Lengkap</label>
                <input
                  type="text" id="name" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder="John Doe" required
                  className="w-full px-4 py-3 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-sm"
                />
              </div>

              {/* ✅ Company Field (hanya muncul kalau role organizer) */}
              {formData.role === 'organizer' && (
                <div className="space-y-1.5">
                  <label htmlFor="company" className="block text-sm font-medium text-[#1E3A5F]">
                    Nama Perusahaan/Organisasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" id="company" name="company"
                    value={formData.company} onChange={handleChange}
                    placeholder="PT Event Organizer Indonesia" required
                    className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-[#1E3A5F] placeholder-slate-400 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 transition-all shadow-sm"
                  />
                  <p className="text-xs text-slate-500">
                    Digunakan untuk verifikasi organizer
                  </p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-[#1E3A5F]">Email</label>
                <input
                  type="email" id="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="nama@email.com" required
                  className="w-full px-4 py-3 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-sm"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-[#1E3A5F]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} id="password" name="password"
                    value={formData.password} onChange={handleChange}
                    placeholder="Minimal 6 karakter" required
                    className="w-full px-4 py-3 pr-12 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors" aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}>
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

                {/* Password strength meter */}
                {strength && (
                  <div className="pt-1 space-y-1.5">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{ background: i < strength.bar ? strength.color : '#E2E8F0' }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Kekuatan password</span>
                      <span className="text-xs font-medium" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1E3A5F]">Konfirmasi Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword"
                    value={formData.confirmPassword} onChange={handleChange}
                    placeholder="Ulangi password" required
                    className={`w-full px-4 py-3 pr-12 bg-white border rounded-xl text-[#1E3A5F] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${
                      passwordMatch === null
                        ? 'border-[#BAD5F8] focus:border-blue-500 focus:ring-blue-500/15'
                        : passwordMatch
                        ? 'border-green-300 focus:border-green-400 focus:ring-green-500/15'
                        : 'border-red-300 focus:border-red-400 focus:ring-red-500/15'
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors" aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}>
                    {showConfirmPassword ? (
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

                {/* Match indicator */}
                {passwordMatch !== null && (
                  <p className={`text-xs flex items-center gap-1.5 ${passwordMatch ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordMatch ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Password cocok
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                        Password tidak cocok
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer group pt-1">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-[#BAD5F8] bg-white text-blue-600 focus:ring-blue-500/20 focus:ring-offset-0 flex-shrink-0"
                />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors leading-relaxed">
                  Saya setuju dengan{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline underline-offset-2">
                    Syarat & Ketentuan
                  </button>{' '}
                  yang berlaku
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 mt-1 text-white text-sm font-semibold rounded-xl transition-all shadow-lg hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 ${
                  formData.role === 'organizer'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/25 hover:shadow-purple-500/35'
                    : 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 shadow-blue-500/25 hover:shadow-blue-500/35'
                }`}
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
                    {formData.role === 'organizer' ? 'Daftar sebagai Organizer' : 'Buat akun gratis'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-slate-500">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center flex-shrink-0">
          <p className="text-xs text-slate-400">© 2026 EventSphere. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}