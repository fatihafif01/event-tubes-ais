import Link from "next/link";

export default function CTASection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
      <div className="relative bg-gradient-to-br from-cyan-100 via-sky-100 to-blue-200 border border-cyan-300 rounded-3xl p-8 md:p-16 overflow-hidden">
        {/* Background Effects - Cyan/Blue Theme */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-300/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/30 rounded-full blur-3xl -z-10" />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Punya Event Seru?{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Jual Tiket Di Sini!
              </span>
            </h2>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Bergabunglah dengan ribuan organizer yang telah mempercayakan penjualan tiket mereka di Zenix. 
              Kelola event dengan mudah dan jangkau lebih banyak peserta.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Dashboard organizer yang lengkap",
                "Sistem pembayaran terintegrasi",
                "Laporan penjualan real-time",
                "Promosi event ke ribuan pengguna",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0891b2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>

          {/* Illustration/Stats - Light Theme */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm border border-cyan-200 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-4xl font-bold text-cyan-600 mb-2">10K+</p>
                <p className="text-sm text-gray-600">Event Organizer</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-4xl font-bold text-blue-600 mb-2">98%</p>
                <p className="text-sm text-gray-600">Kepuasan Organizer</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-white/80 backdrop-blur-sm border border-cyan-200 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-4xl font-bold text-cyan-600 mb-2">500K+</p>
                <p className="text-sm text-gray-600">Tiket Terjual</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-4xl font-bold text-blue-600 mb-2">24/7</p>
                <p className="text-sm text-gray-600">Support Tim</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}