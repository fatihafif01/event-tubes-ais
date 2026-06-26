"use client";

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'EventSphere',
    siteDescription: 'Platform ticketing event profesional',
    emailSupport: 'support@eventsphere.com',
    phoneSupport: '+62 21 1234 5678',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Simpan ke localStorage (untuk demo)
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F]">Pengaturan</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola pengaturan sistem</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium text-emerald-700">Pengaturan berhasil disimpan!</p>
        </div>
      )}

      <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-6 space-y-6">
        <h3 className="text-base font-bold text-[#1E3A5F]">Informasi Website</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Nama Website</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Deskripsi</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Email Support</label>
              <input
                type="email"
                value={settings.emailSupport}
                onChange={(e) => setSettings({ ...settings, emailSupport: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Telepon Support</label>
              <input
                type="tel"
                value={settings.phoneSupport}
                onChange={(e) => setSettings({ ...settings, phoneSupport: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-6 space-y-6">
        <h3 className="text-base font-bold text-[#1E3A5F]">Pengaturan Sistem</h3>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-[#F0F7FF] border border-[#BAD5F8] rounded-xl cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-[#1E3A5F]">Maintenance Mode</p>
              <p className="text-xs text-slate-500">Website tidak dapat diakses saat mode ini aktif</p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="w-10 h-5 rounded-full bg-slate-200 appearance-none checked:bg-blue-600 relative transition cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-[#F0F7FF] border border-[#BAD5F8] rounded-xl cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-[#1E3A5F]">Izinkan Registrasi</p>
              <p className="text-xs text-slate-500">User baru dapat mendaftar akun</p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowRegistration}
              onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
              className="w-10 h-5 rounded-full bg-slate-200 appearance-none checked:bg-blue-600 relative transition cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-[#F0F7FF] border border-[#BAD5F8] rounded-xl cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-[#1E3A5F]">Notifikasi Email</p>
              <p className="text-xs text-slate-500">Kirim notifikasi via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="w-10 h-5 rounded-full bg-slate-200 appearance-none checked:bg-blue-600 relative transition cursor-pointer"
            />
          </label>
        </div>
      </div>

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
  );
}