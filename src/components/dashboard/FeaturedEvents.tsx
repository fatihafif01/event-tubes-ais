import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function FeaturedEvents() {
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const events = [
    {
      id: 1,
      title: "Neon Music Festival 2026",
      date: "20 Jun 2026",
      location: "Jakarta",
      price: "Rp 250.000",
      category: "Konser",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    },
    {
      id: 2,
      title: "Tech Summit Indonesia",
      date: "15 Jul 2026",
      location: "Surabaya",
      price: "Rp 500.000",
      category: "Seminar",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    },
    {
      id: 3,
      title: "UI/UX Design Workshop",
      date: "22 Jul 2026",
      location: "Bandung",
      price: "Rp 150.000",
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800&q=80",
    },
    {
      id: 4,
      title: "Food & Culture Festival",
      date: "5 Agu 2026",
      location: "Yogyakarta",
      price: "Rp 75.000",
      category: "Festival",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    },
    {
      id: 5,
      title: "Electronic Dance Night",
      date: "12 Agu 2026",
      location: "Bali",
      price: "Rp 300.000",
      category: "Konser",
      image: "https://images.unsplash.com/photo-1574361259922-f7affa155dbe?w=800&q=80",
    },
  ];

  const duplicatedEvents = [...events, ...events];
  const scrollDuration = 30000;
  const cardWidth = 336;

  // Restore posisi saat component mount
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    const savedTime = sessionStorage.getItem('scrollStartTime');
    
    if (savedPosition && savedTime && containerRef.current) {
      const position = parseFloat(savedPosition);
      containerRef.current.style.transform = `translateX(-${position}px)`;
      setCurrentPosition(position);
      startTimeRef.current = parseFloat(savedTime);
    }
  }, []);

  // Animation loop
  useEffect(() => {
    if (isPaused) return;

    const animate = () => {
      if (!containerRef.current) return;

      const totalWidth = events.length * cardWidth;
      const now = Date.now();
      
      if (!startTimeRef.current) {
        startTimeRef.current = now;
      }

      const elapsed = now - startTimeRef.current;
      const progress = (elapsed % scrollDuration) / scrollDuration;
      const newPosition = progress * totalWidth;

      setCurrentPosition(newPosition);
      containerRef.current.style.transform = `translateX(-${newPosition}px)`;

      sessionStorage.setItem('scrollPosition', newPosition.toString());
      sessionStorage.setItem('scrollStartTime', (now - (progress * scrollDuration)).toString());

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, events.length]);

  // Handle click pada card
  const handleCardClick = (eventId: number) => {
    setIsPaused(true);
    
    if (containerRef.current) {
      const currentTransform = window.getComputedStyle(containerRef.current).transform;
      const matrix = new DOMMatrix(currentTransform);
      const currentPosition = Math.abs(matrix.m41);
      
      sessionStorage.setItem('scrollPosition', currentPosition.toString());
      sessionStorage.setItem('scrollStartTime', Date.now().toString());
      sessionStorage.setItem('clickedEventId', eventId.toString());
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
      {/* Background dengan rounded corners */}
      <div className="bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 rounded-3xl p-6 md:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-cyan-700 uppercase bg-white rounded-full border border-cyan-200 shadow-sm">
              Featured Events
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Event Populer <span className="text-cyan-600">Minggu Ini</span>
            </h2>
          </div>
          
          <Link
            href="/login"
            className="group flex items-center gap-2 text-cyan-700 hover:text-cyan-800 font-semibold transition"
          >
            Lihat Semua Event
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Scrolling Container */}
        <div className="relative overflow-hidden -mx-2 sm:-mx-4">
          {/* Gradient fade edges - hanya untuk desktop */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-cyan-50 to-transparent z-10 pointer-events-none" />
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-cyan-50 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div 
            ref={containerRef}
            className="flex gap-4 sm:gap-6 px-2 sm:px-4"
            style={{ 
              willChange: 'transform',
              WebkitOverflowScrolling: 'touch',
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedEvents.map((event, index) => (
              <Link
                key={`${event.id}-${index}`}
                href={`/login`}
                onClick={() => handleCardClick(event.id)}
                className="group flex-shrink-0 w-[280px] sm:w-80"
              >
                <div className="bg-white border border-cyan-200 rounded-2xl overflow-hidden hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-300/40 hover:-translate-y-1 transition-all duration-300 h-full">
                  {/* Image Section */}
                  <div className="relative h-48 sm:h-64 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    
                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-cyan-500 text-white border border-cyan-400 rounded-full shadow-sm">
                      {event.category}
                    </span>

                    {/* Price */}
                    <div className="absolute bottom-3 left-3">
                      <p className="text-lg sm:text-2xl font-bold text-white drop-shadow-md">{event.price}</p>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-4 sm:p-5">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors mb-2 sm:mb-3 line-clamp-1">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600 flex-shrink-0">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        <span className="truncate">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600 flex-shrink-0">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/35">
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 