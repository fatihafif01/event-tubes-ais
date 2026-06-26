// src/dashboard-after-login/HeroSlider.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  { 
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80", 
    tag: "Rekomendasi", 
    title: "Neon Music Festival 2026", 
    desc: "Jangan lewatkan lineup artis internasional terbaik tahun ini." 
  },
  { 
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", 
    tag: "Trending", 
    title: "Tech Summit Indonesia", 
    desc: "Networking dengan 500+ founder & developer seluruh Asia." 
  },
  { 
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80", 
    tag: "Promo", 
    title: "Jazz Under The Stars", 
    desc: "Diskon 20% untuk pembelian early bird hingga 1 Juli." 
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden relative h-[300px] sm:h-[350px]">
        
        {slides.map((slide, i) => (
          <div 
            key={i} 
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            
            <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 max-w-2xl">
              <span className="inline-block w-fit px-3 py-1 mb-4 text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full">
                {slide.tag}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                {slide.title}
              </h2>
              <p className="text-zinc-300 mb-6 text-sm sm:text-base">
                {slide.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Indicators */}
        <div className="absolute bottom-6 left-6 sm:left-12 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)} 
              className={`h-1.5 rounded-full transition-all ${
                i === currentSlide ? 'w-8 bg-orange-500' : 'w-1.5 bg-zinc-600'
              }`} 
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}