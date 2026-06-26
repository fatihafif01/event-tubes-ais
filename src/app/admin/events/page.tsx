"use client";

import { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  price: number;
  category: string;
  status: 'active' | 'draft' | 'ended';
  image: string;
  ticketsSold: number;
  capacity: number;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    venue: '',
    price: '',
    category: '',
    capacity: '',
    status: 'active' as 'active' | 'draft' | 'ended',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [saved, setSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const categories = [
    'Musik & Konser',
    'Seminar & Tech',
    'Olahraga',
    'Seni & Teater',
    'Kuliner',
    'Workshop',
  ];

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('admin_events');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (err) {
        console.error('Failed to parse events:', err);
        setEvents(getDefaultEvents());
      }
    } else {
      setEvents(getDefaultEvents());
    }
    setIsLoaded(true);
  }, []);

  const getDefaultEvents = (): Event[] => {
    return [
      {
        id: '1',
        title: 'Summer Music Fest 2026',
        date: '20 Jun 2026',
        venue: 'Jakarta Convention Center',
        price: 250000,
        category: 'Musik & Konser',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80',
        ticketsSold: 342,
        capacity: 1000,
      },
      {
        id: '2',
        title: 'Tech Innovation Summit',
        date: '15 Jul 2026',
        venue: 'ICE BSD City',
        price: 450000,
        category: 'Seminar & Tech',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1540575467063-178a5f3f588a?w=400&q=80',
        ticketsSold: 156,
        capacity: 500,
      },
      {
        id: '3',
        title: 'Food & Culture Expo',
        date: '03 Aug 2025',
        venue: 'Senayan Park',
        price: 75000,
        category: 'Kuliner',
        status: 'ended',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
        ticketsSold: 892,
        capacity: 1000,
      },
    ];
  };

  const formatRupiah = (amount: number) => {
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      draft: 'bg-slate-50 text-slate-600 border-slate-200',
      ended: 'bg-red-50 text-red-600 border-red-200',
    };
    const labels = {
      active: 'Aktif',
      draft: 'Draft',
      ended: 'Selesai',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        venue: event.venue,
        price: event.price.toString(),
        category: event.category,
        capacity: event.capacity.toString(),
        status: event.status,
        image: event.image,
      });
      setImagePreview(event.image);
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        date: '',
        venue: '',
        price: '',
        category: '',
        capacity: '',
        status: 'active',
        image: '',
      });
      setImagePreview('');
    }
    setShowModal(true);
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.venue || !formData.price || !formData.category) {
      alert('Semua field wajib diisi!');
      return;
    }

    const eventData: Event = {
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      title: formData.title,
      date: formData.date,
      venue: formData.venue,
      price: parseInt(formData.price),
      category: formData.category,
      capacity: parseInt(formData.capacity) || 100,
      status: formData.status,
      // ✅ Gunakan URL gambar atau placeholder
      image: formData.image || `https://placehold.co/400x300/F0F7FF/1E3A5F?text=${encodeURIComponent(formData.title)}`,
      ticketsSold: editingEvent ? editingEvent.ticketsSold : 0,
    };

    let updatedEvents;
    if (editingEvent) {
      updatedEvents = events.map(ev => ev.id === editingEvent.id ? eventData : ev);
    } else {
      updatedEvents = [...events, eventData];
    }

    setEvents(updatedEvents);
    
    // ✅ Simpan ke localStorage dengan error handling
    try {
      localStorage.setItem('admin_events', JSON.stringify(updatedEvents));
    } catch (err) {
      console.error('LocalStorage penuh:', err);
      alert('LocalStorage penuh! Hapus beberapa event lama terlebih dahulu.');
      return;
    }
    
    setShowModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus event ini?')) {
      const updated = events.filter(ev => ev.id !== id);
      setEvents(updated);
      try {
        localStorage.setItem('admin_events', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save:', err);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center">
        <div className="text-slate-500">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F]">Kelola Event</h1>
          <p className="text-slate-500 text-sm mt-1">Tambah, edit, dan kelola event</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-500/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Event
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium text-emerald-700">Event berhasil disimpan!</p>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white border border-[#BAD5F8]/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F0F7FF] border-b border-[#BAD5F8]/60">
              <tr>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Event</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Tanggal</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Lokasi</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Harga</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Tiket</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-[#1E3A5F] px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BAD5F8]/30">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-[#F0F7FF]/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover" onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/F0F7FF/1E3A5F?text=Event';
                      }} />
                      <div>
                        <p className="text-sm font-semibold text-[#1E3A5F]">{event.title}</p>
                        <p className="text-xs text-slate-500">{event.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{event.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{event.venue}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[#1E3A5F]">{formatRupiah(event.price)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#1E3A5F]">{event.ticketsSold} / {event.capacity}</p>
                      <p className="text-xs text-slate-500">terjual</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(event.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenModal(event)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1E3A5F]">
                {editingEvent ? 'Edit Event' : 'Tambah Event Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Nama Event *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
                  placeholder="Contoh: Summer Music Fest 2026"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Tanggal *</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
                    placeholder="Contoh: 20 Jun 2026"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Lokasi *</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
                  placeholder="Contoh: Jakarta Convention Center"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Harga Tiket (Rp) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
                    placeholder="Contoh: 250000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Kapasitas</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
                    placeholder="Contoh: 1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
                >
                  <option value="active">Aktif</option>
                  <option value="draft">Draft</option>
                  <option value="ended">Selesai</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-1.5">URL Gambar</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#BAD5F8] rounded-xl text-[#1E3A5F] text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 mb-2"
                  placeholder="https://images.unsplash.com/..."
                />
                {imagePreview && (
                  <div className="w-full h-48 rounded-xl overflow-hidden border border-[#BAD5F8]">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/F0F7FF/1E3A5F?text=Preview+Error';
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  💡 Gunakan URL gambar dari Unsplash atau sumber lain. Contoh: https://images.unsplash.com/photo-xxx
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
                >
                  {editingEvent ? 'Simpan Perubahan' : 'Tambah Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}