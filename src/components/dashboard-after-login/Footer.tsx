export default function Footer() {
  return (
    <footer className="border-t border-[#BAD5F8]/60 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm shadow-blue-500/20">
              ES
            </div>
            <span className="text-sm font-semibold text-[#1E3A5F]">
              Event<span className="text-blue-600">Sphere</span> Dashboard
            </span>
          </div>
          
          {/* Links - UPDATED dengan href yang benar */}
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="/dashboard-after-login/bantuan" className="hover:text-blue-600 transition">Bantuan</a>
            <a href="/dashboard-after-login/kebijakan-privasi" className="hover:text-blue-600 transition">Kebijakan Privasi</a>
            <a href="/dashboard-after-login/syarat-layanan" className="hover:text-blue-600 transition">Syarat Layanan</a>
          </div>
          
          {/* Copyright */}
          <p className="text-xs text-slate-400">
            © 2026 ZenixEvent. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}