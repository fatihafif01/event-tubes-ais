"use client";

import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/dashboard/Navbar';

// Animated Counter Component
interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  end, 
  suffix = "", 
  prefix = "",
  duration = 2500,
  decimals = 0
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number | null = null;
          
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = easeOutQuart * end;
            setCount(currentCount);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) {
      const thousands = num / 1000;
      return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
    }
    return num.toFixed(decimals);
  };

  return (
    <div ref={counterRef} className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
      {prefix}{formatNumber(count)}{suffix}
    </div>
  );
};

export default function TentangKami() {
  const router = useRouter();
  
  // Team scrolling state
  const [isTeamPaused, setIsTeamPaused] = useState(false);
  const teamContainerRef = useRef<HTMLDivElement>(null);
  const teamAnimationRef = useRef<number | null>(null);
  const teamStartTimeRef = useRef<number>(0);

  const teamMembers = [
    { name: "Desna Nugraha", role: "Founder & CEO", img: "https://i.pravatar.cc/300?img=11" },
    { name: "Miracle Yoel", role: "Head of Product", img: "https://i.pravatar.cc/300?img=5" },
    { name: "Fatih Afifurrahman", role: "Tech Lead", img: "https://i.pravatar.cc/300?img=3" },
    { name: "Adriansyah", role: "Partnerships", img: "https://i.pravatar.cc/300?img=9" },
    { name: "Ferdi Siregar", role: "Community Lead", img: "https://i.pravatar.cc/300?img=12" },
  ];

  // Duplicate for seamless loop
  const duplicatedTeam = [...teamMembers, ...teamMembers];
  const teamScrollDuration = 35000;
  const teamCardWidth = 288;

  // Team infinite scroll animation
  useEffect(() => {
    if (isTeamPaused) return;

    const animate = () => {
      if (!teamContainerRef.current) return;
      const totalWidth = teamMembers.length * teamCardWidth;
      const now = Date.now();
      
      if (!teamStartTimeRef.current) teamStartTimeRef.current = now;
      const elapsed = now - teamStartTimeRef.current;
      const progress = (elapsed % teamScrollDuration) / teamScrollDuration;
      const newPosition = progress * totalWidth;

      teamContainerRef.current.style.transform = `translateX(-${newPosition}px)`;
      teamAnimationRef.current = requestAnimationFrame(animate);
    };

    teamAnimationRef.current = requestAnimationFrame(animate);
    return () => {
      if (teamAnimationRef.current) cancelAnimationFrame(teamAnimationRef.current);
    };
  }, [isTeamPaused, teamMembers.length]);

  return (
    <>
      <Head>
        <title>Tentang Zenix - Platform Tiket Modern</title>
        <meta name="description" content="Membangun infrastruktur event yang transparan dan efisien untuk Indonesia." />
      </Head>

      <div className="min-h-screen">
        
        {/* ==================== NAVBAR ==================== */}
        <Navbar />

        {/* ==================== HERO SECTION dengan VIDEO ==================== */}
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background - OPTIMIZED FOR QUALITY */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/company-video-poster.jpg"
              className="absolute inset-0 w-full h-full object-cover"
              disablePictureInPicture
              controlsList="nodownload"
            >
              {/* High quality sources - urutan prioritas */}
              <source src="/company-video-hd.mp4" type='video/mp4; codecs="avc1.640028"' />
              <source src="/company-video.mp4" type='video/mp4; codecs="avc1.42E01E"' />
              <source src="/company-video.webm" type='video/webm; codecs="vp9"' />
              <source src="/company-video-fallback.mp4" type="video/mp4" />
              
              {/* Fallback image jika browser tidak support video */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/company-image.jpg')" }}
              />
            </video>
            
            {/* Overlay untuk kontras yang lebih baik */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-cyan-900/60" />
          </div>
      
        </section>

        {/* ==================== STATS SECTION - Light Background ==================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="text-center">
                <AnimatedCounter end={58000} suffix="+" />
                <div className="text-sm sm:text-base text-gray-600">Pengguna Aktif</div>
              </div>
              <div className="text-center">
                <AnimatedCounter end={1240} suffix="+" />
                <div className="text-sm sm:text-base text-gray-600">Event Tersedia</div>
              </div>
              <div className="text-center">
                <AnimatedCounter end={500} suffix="+" />
                <div className="text-sm sm:text-base text-gray-600">Penyelenggara</div>
              </div>
              <div className="text-center">
                <AnimatedCounter end={99.9} suffix="%" decimals={1} />
                <div className="text-sm sm:text-base text-gray-600">Uptime Sistem</div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== MISSION STATEMENT - White Background ==================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Kami percaya bahwa setiap event layak mendapatkan{" "}
              <span className="text-cyan-600">platform yang andal</span> dan{" "}
              <span className="text-cyan-600">transparan</span>.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dari konser musik skala besar hingga workshop komunitas, Zenix hadir untuk 
              memastikan setiap penyelenggara memiliki akses ke teknologi yang sama—tanpa biaya tersembunyi, 
              tanpa ribet, dan dengan dukungan yang responsif.
            </p>
          </div>
        </section>

        {/* ==================== TEAM SECTION - Light Blue Background ==================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Dipimpin oleh tim yang passionate</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Profesional dengan pengalaman di industri teknologi dan event management
              </p>
            </div>
            
            {/* Infinite Scrolling Team Container */}
            <div className="relative">
              {/* Gradient fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cyan-50 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cyan-50 to-transparent z-10 pointer-events-none" />
              
              {/* Scrolling Track */}
              <div 
                ref={teamContainerRef}
                className="flex gap-6"
                style={{ willChange: 'transform' }}
                onMouseEnter={() => setIsTeamPaused(true)}
                onMouseLeave={() => setIsTeamPaused(false)}
              >
                {duplicatedTeam.map((member, index) => (
                  <div 
                    key={`${member.name}-${index}`}
                    className="group flex-shrink-0 w-72 text-center cursor-default"
                  >
                    <div className="relative mb-4 inline-block">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all mx-auto">
                        <img 
                          src={member.img} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CTA SECTION - White Background ==================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Siap mengembangkan bisnis event Anda?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ratusan penyelenggara yang telah mempercayakan event mereka pada Zenix.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-full transition-all shadow-lg shadow-blue-500/25">
                Daftar Gratis
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/tentang" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-full transition-all hover:bg-gray-50">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== FOOTER - Light Background ==================== */}
        <footer className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-r from-cyan-50 to-blue-50 border-t border-cyan-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© 2026 Zenix. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-cyan-600 transition">Privacy</a>
              <a href="#" className="hover:text-cyan-600 transition">Terms</a>
              <a href="#" className="hover:text-cyan-600 transition">Contact</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}