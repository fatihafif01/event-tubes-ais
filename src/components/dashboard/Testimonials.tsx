export default function Testimonials() {
  const testimonials = [
    {
      name: "Ahmad Rizki",
      role: "Music Enthusiast",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      content:
        "Platform terbaik untuk beli tiket konser! Prosesnya cepat, aman, dan e-ticket langsung terkirim ke email. Sangat recommended!",
      rating: 5,
    },
    {
      name: "Sarah Amelia",
      role: "Event Organizer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      content:
        "Sebagai organizer, EventSphere sangat membantu dalam mengelola penjualan tiket. Dashboard-nya user-friendly dan laporannya lengkap.",
      rating: 5,
    },
    {
      name: "Budi Santoso",
      role: "Workshop Participant",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      content:
        "Sering ikut workshop lewat EventSphere. Harganya kompetitif dan banyak pilihan event berkualitas. Top markotop!",
      rating: 5,
    },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100 rounded-3xl shadow-lg">
      <div className="text-center mb-16">
        {/* Badge/Tag - Cyan Theme */}
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-cyan-700 uppercase bg-white/70 backdrop-blur-sm rounded-full border border-cyan-300 shadow-sm">
          Testimonials
        </span>
        
        {/* Heading - Cyan Theme */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
          Apa Kata <span className="text-cyan-600">Mereka?</span>
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 max-w-2xl mx-auto">
          Testimoni dari pengguna yang telah menggunakan layanan EventSphere
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm border border-cyan-200 rounded-2xl p-6 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-300/40 hover:-translate-y-1 transition-all duration-300"
          >
            {/* Rating Stars - Cyan Color */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#0891b2"
                  stroke="#0891b2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>

            {/* Content - Dark Text for Light Background */}
            <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-cyan-300 shadow-sm"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}