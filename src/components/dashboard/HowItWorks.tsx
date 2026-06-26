export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Cari Event",
      description: "Jelajahi ribuan event menarik dari berbagai kategori dan lokasi",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Pilih Tiket",
      description: "Pilih jenis tiket dan jumlah yang diinginkan dengan harga terbaik",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
          <path d="M13 11v2" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Pembayaran",
      description: "Bayar dengan mudah menggunakan berbagai metode pembayaran yang aman",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Nikmati Event",
      description: "Tunjukkan e-ticket kamu dan nikmati pengalaman event yang tak terlupakan",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 rounded-3xl">
      <div className="text-center mb-16">
        {/* Badge - Cyan Theme */}
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-cyan-700 uppercase bg-white/70 backdrop-blur-sm rounded-full border border-cyan-200 shadow-sm">
          How It Works
        </span>
        
        {/* Heading - Cyan Theme */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
          Cara <span className="text-cyan-600">Memesan Tiket</span>
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 max-w-2xl mx-auto">
          Proses pemesanan yang mudah dan cepat, hanya dalam 4 langkah sederhana
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index}>
            {/* ✅ Card Step - Light Theme */}
            <div className="relative bg-white/80 backdrop-blur-sm border border-cyan-200 rounded-2xl p-6 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-300/40 hover:-translate-y-1 transition-all duration-300 group h-full">
              
              {/* Step Number - Cyan Color */}
              <div className="text-5xl font-bold text-cyan-100 absolute top-4 right-4 select-none">
                {step.number}
              </div>
              
              {/* Icon - Cyan Gradient */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
                {step.icon}
              </div>
              
              {/* Title - Dark Text */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              
              {/* Description - Dark Gray Text */}
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}