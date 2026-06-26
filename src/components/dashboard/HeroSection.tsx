import Link from "next/link";

export default function HeroSection() {
  return (
<section className="relative min-h-screen flex items-center overflow-hidden">
  {/* Background Video */}
  <div className="absolute inset-0 z-0">
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/head-video.mp4" type="video/mp4" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80')"
        }}
      />
    </video>
  </div>

  {/* Content - PERBAIKI PADDING */}
  <div className="relative z-10 w-full pt-28 pb-16"> {/* pt-28 = 112px (account for navbar) */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-left text-white drop-shadow-lg">
          Temukan &amp; Pesan{" "}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Event Terbaik
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed mb-10 text-left drop-shadow-md">
          Platform tiket modern untuk konser, seminar, workshop, dan festival. 
          Aman, cepat, dan terintegrasi penuh.
        </p>
      </div>
    </div>
  </div>
</section>
  );
}