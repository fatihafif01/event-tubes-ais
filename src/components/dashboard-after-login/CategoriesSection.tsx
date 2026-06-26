"use client";

import { useState, useEffect } from 'react';

interface Event {
  id: number;
  title: string;
  venue: string;
  date: string;
  price: string;
  category: string;
  image: string;
}

export default function CategoriesSection() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Debounce search query (300ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // ✅ Load events from localStorage (admin) + default events
  useEffect(() => {
    const loadEvents = () => {
      const defaultEvents: Event[] = [
        { 
          id: 1, 
          title: "Summer Music Fest", 
          venue: "Jakarta Convention Center", 
          date: "20 Jun 2026", 
          price: "Rp 250.000", 
          category: "Musik & Konser",
          image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80" 
        },
        { 
          id: 2, 
          title: "Tech Innovation Summit", 
          venue: "ICE BSD City", 
          date: "15 Jul 2026", 
          price: "Rp 450.000", 
          category: "Seminar & Tech",
          image: "https://images.unsplash.com/photo-1540575467063-178a5f3f588a?w=400&q=80" 
        },
        { 
          id: 3, 
          title: "Food & Culture Expo", 
          venue: "Senayan Park", 
          date: "03 Aug 2026", 
          price: "Rp 75.000", 
          category: "Kuliner",
          image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80" 
        },
        { 
          id: 4, 
          title: "Art Gallery Opening", 
          venue: "Museum Nasional", 
          date: "10 Jun 2026", 
          price: "Gratis", 
          category: "Seni & Teater",
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" 
        },
        { 
          id: 5, 
          title: "Marathon Jakarta", 
          venue: "Gelora Bung Karno", 
          date: "25 Jun 2026", 
          price: "Rp 150.000", 
          category: "Olahraga",
          image: "https://images.unsplash.com/photo-1552674605-469523170273?w=400&q=80" 
        },
        { 
          id: 6, 
          title: "Coding Workshop", 
          venue: "CoWorking Space", 
          date: "05 Jul 2026", 
          price: "Rp 200.000", 
          category: "Workshop",
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80" 
        }
      ];

      // ✅ Load events from admin
      try {
        const adminEventsRaw = localStorage.getItem('admin_events');
        if (adminEventsRaw) {
          const adminEvents = JSON.parse(adminEventsRaw);
          
          // Convert admin events format to match user events
          const formattedAdminEvents: Event[] = adminEvents.map((ev: any, index: number) => ({
            id: 100 + index, // Start from 100 to avoid ID conflict
            title: ev.title,
            venue: ev.venue,
            date: ev.date,
            price: ev.price === 0 ? 'Gratis' : `Rp ${ev.price.toLocaleString('id-ID')}`,
            category: ev.category,
            image: ev.image,
          }));

          // ✅ Merge: Admin events + Default events (filter out duplicates by title)
          const mergedEvents = [
            ...formattedAdminEvents,
            ...defaultEvents.filter(defaultEv => 
              !formattedAdminEvents.some(adminEv => adminEv.title === defaultEv.title)
            )
          ];

          setEvents(mergedEvents);
        } else {
          setEvents(defaultEvents);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
        setEvents(defaultEvents);
      }
      
      setIsLoaded(true);
    };

    loadEvents();

    // ✅ Listen for storage changes (real-time sync)
    const handleStorageChange = () => loadEvents();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const categories = [
    { name: "Musik & Konser", count: 42, icon: "🎵" },
    { name: "Seminar & Tech", count: 28, icon: "💻" },
    { name: "Olahraga", count: 15, icon: "⚽" },
    { name: "Seni & Teater", count: 19, icon: "🎭" },
    { name: "Kuliner", count: 34, icon: "🍽️" },
    { name: "Workshop", count: 22, icon: "🛠️" }
  ];

  // Filter events berdasarkan search query dan kategori
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                         event.venue.toLowerCase().includes(debouncedQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle klik tombol Beli
  const handleBuyClick = (e: React.MouseEvent, eventId: number) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/events/${eventId}/buy`;
  };

  if (!isLoaded) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="text-center py-12">
          <p className="text-slate-500">Memuat event...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
      
      {/* Header */}
      <h3 className="text-xl font-bold text-[#1E3A5F] mb-4">Jelajahi Event</h3>

      {/* Search Bar */}
      <div className="relative w-full max-w-md mb-8">
        <input 
          type="text" 
          placeholder="Cari event atau venue..." 
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition text-sm shadow-sm shadow-blue-500/5"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button 
          onClick={() => setSelectedCategory("Semua")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
            selectedCategory === "Semua"
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
              : 'bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-[#BAD5F8]'
          }`}
        >
          <span>🌟</span>
          Semua
        </button>
        {categories.map((cat) => (
          <button 
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory === cat.name
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                : 'bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-[#BAD5F8]'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
            <span className="text-xs opacity-70">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Event Grid - 4 Kolom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredEvents.map((event) => (
          <div 
            key={event.id} 
            className="group bg-white border border-[#BAD5F8]/60 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/10 transition block"
          >
            <div className="h-48 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent z-10" />
              <img 
                src={event.image} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={event.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/400x300/F0F7FF/1E3A5F?text=${encodeURIComponent(event.title)}`;
                }}
              />
              <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-xs font-semibold text-[#1E3A5F] border border-[#BAD5F8]">
                {event.date}
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-[#1E3A5F] font-semibold mb-1 truncate">{event.title}</h4>
              <p className="text-slate-500 text-sm mb-3 truncate">{event.venue}</p>
              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-bold text-sm">{event.price}</span>
                <button 
                  onClick={(e) => handleBuyClick(e, event.id)}
                  className="px-3 py-1.5 text-xs font-medium bg-[#F0F7FF] hover:bg-blue-600 hover:text-white text-blue-600 border border-[#BAD5F8] rounded-lg transition cursor-pointer"
                >
                  Beli
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white border border-[#BAD5F8]/40 rounded-xl">
          <p className="text-slate-500">
            {debouncedQuery 
              ? `Tidak ada event yang ditemukan untuk "${debouncedQuery}"`
              : `Tidak ada event di kategori "${selectedCategory}"`
            }
          </p>
        </div>
      )}
    </section>
  );
}