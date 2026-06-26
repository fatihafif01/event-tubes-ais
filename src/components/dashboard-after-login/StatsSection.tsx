// src/dashboard-after-login/StatsSection.tsx
"use client";

import { useState, useEffect, useRef } from 'react';

interface User {
  name: string;
}

interface StatsSectionProps {
  user: User | null;
}

// Animated Counter Component
const AnimatedCounter = ({ end, prefix = "", suffix = "", duration = 2000 }: { 
  end: number; prefix?: string; suffix?: string; duration?: number 
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let start: number | null = null;
        
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 4);
          setCount(ease * end);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  const format = (n: number) => n >= 1000 ? `${(n/1000).toFixed(n>=10000?0:1)}K` : Math.floor(n);
  
  return (
    <div ref={ref} className="text-3xl sm:text-4xl font-bold text-[#1E3A5F]">
      {prefix}{format(count)}{suffix}
    </div>
  );
};

export default function StatsSection({ user }: StatsSectionProps) {
  const stats = [
    { label: "Tiket Aktif", value: 4, icon: "🎫", trend: "2 upcoming" },
    { label: "Event Dihadiri", value: 12, icon: "🎪", trend: "2026" },
    { label: "Saldo Dompet", value: 450000, icon: "💳", trend: "Rp", prefix: "Rp ", isCurrency: true },
    { label: "Poin Reward", value: 2450, icon: "⭐", trend: "Tukar diskon" }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-white border border-[#BAD5F8]/60 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/10 transition-all group cursor-default"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">{stat.icon}</span>
              <span className="text-xs font-medium text-blue-600 bg-[#F0F7FF] border border-[#BAD5F8] px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <div className="text-slate-500 text-sm mb-1">{stat.label}</div>
            <div className="text-[#1E3A5F]">
              {stat.prefix && <span className="text-lg font-medium text-slate-500">{stat.prefix}</span>}
              <AnimatedCounter 
                end={stat.value} 
                suffix={stat.isCurrency ? "" : ""} 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}