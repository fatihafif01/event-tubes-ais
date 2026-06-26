"use client";

import { useState, useEffect } from 'react';
import { 
  getOrganizerEvents, 
  saveOrganizerEvents, 
  subscribeToOrganizerUpdates,
  type OrganizerEvent 
} from '@/lib/organizer';

export default function OrganizerEvents() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<OrganizerEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '', date: '', venue: '', price: '', category: '',
    capacity: '', status: 'active' as 'active' | 'draft' | 'ended', image: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadEvents = () => {
      setEvents(getOrganizerEvents());
    };

    loadEvents();
    const unsubscribe = subscribeToOrganizerUpdates(loadEvents);
    return unsubscribe;
  }, []);

  const formatRupiah = (amount: number) => 'Rp ' + amount.toLocaleString('id-ID');

  const handleOpenModal = (event?: OrganizerEvent) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title, date: event.date, venue: event.venue,
        price: event.price.toString(), category: event.category,
        capacity: event.capacity.toString(), status: event.status, image: event.image,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '', date: '', venue: '', price: '', category: '',
        capacity: '', status: 'active', image: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData: OrganizerEvent = {
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      title: formData.title,
      date: formData.date,
      venue: formData.venue,
      price: parseInt(formData.price),
      category: formData.category,
      capacity: parseInt(formData.capacity) || 100,
      status: formData.status,
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
    saveOrganizerEvents(updatedEvents);
    
    setShowModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus event ini?')) {
      const updated = events.filter(ev => ev.id !== id);
      setEvents(updated);
      saveOrganizerEvents(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelola Event</h1>
            <p className="text-gray-600 text-sm mt-1">Tambah, edit, dan kelola event Anda</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">Live</span>
          </div>
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

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-900 px-6 py-3">Event</th>
                <th className="text-left text-xs font-semibold text-gray-900 px-6 py-3">Tanggal</th>
                <th className="text-left text-xs font-semibold text-gray-900 px-6 py-3">Harga</th>
                <th className="text-left text-xs font-semibold text-gray-900 px-6 py-3">Tiket</th>
                <th className="text-left text-xs font-semibold text-gray-900 px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-900 px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-600">{event.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><p className="text-sm text-gray-700">{event.date}</p></td>
                  <td className="px-6 py-4"><p className="text-sm font-semibold text-gray-900">{formatRupiah(event.price)}</p></td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{event.ticketsSold} / {event.capacity}</p>
                      <p className="text-xs text-gray-600">terjual</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      event.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      event.status === 'draft' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {event.status === 'active' ? 'Aktif' : event.status === 'draft' ? 'Draft' : 'Selesai'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(event)} className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition">Edit</button>
                      <button onClick={() => handleDelete(event.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-600">Belum ada event</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingEvent ? 'Edit Event' : 'Tambah Event Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Nama Event *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Tanggal *</label>
                  <input 
                    type="text" 
                    value={formData.date} 
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Kategori *</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" 
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Musik & Konser">Musik & Konser</option>
                    <option value="Seminar & Tech">Seminar & Tech</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Seni & Teater">Seni & Teater</option>
                    <option value="Kuliner">Kuliner</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Lokasi *</label>
                <input 
                  type="text" 
                  value={formData.venue} 
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })} 
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Harga Tiket (Rp) *</label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Kapasitas</label>
                  <input 
                    type="number" 
                    value={formData.capacity} 
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} 
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">URL Gambar</label>
                <input 
                  type="url" 
                  value={formData.image} 
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" 
                  placeholder="https://images.unsplash.com/..." 
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
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