export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  image: string;
  description?: string;
}

export const mockEvents: Event[] = [
  // Default events
  {
    id: '1',
    title: 'Summer Music Fest',
    date: '20 Jun 2026',
    time: '19:00 WIB',
    venue: 'Jakarta Convention Center',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80',
  },
  {
    id: '2',
    title: 'Tech Innovation Summit',
    date: '15 Jul 2026',
    time: '09:00 WIB',
    venue: 'ICE BSD City',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
  },
  {
    id: '3',
    title: 'Food & Culture Expo',
    date: '03 Aug 2026',
    time: '10:00 WIB',
    venue: 'Senayan Park',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
  },
  {
    id: '4',
    title: 'Art Gallery Opening',
    date: '10 Jun 2026',
    time: '18:00 WIB',
    venue: 'Museum Nasional',
    price: 0,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
  },
  {
    id: '5',
    title: 'Marathon Jakarta',
    date: '25 Jun 2026',
    time: '06:00 WIB',
    venue: 'Gelora Bung Karno',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80',
  },
  {
    id: '6',
    title: 'Coding Workshop',
    date: '05 Jul 2026',
    time: '09:00 WIB',
    venue: 'CoWorking Space',
    price: 200000,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
  },
  
  // Admin events - TAMBAHKAN SEMUA EVENT YANG KAMU BUAT
  {
    id: '100',
    title: 'sepeda',
    date: '28 Juni 2026',
    time: '08:00 WIB',
    venue: 'Jakarta hall',
    price: 200000,
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&q=80',
  },
  {
    id: '101',
    title: 'Jogging Bareng',
    date: '10 Juli 2026',
    time: '06:00 WIB',
    venue: 'GBK Senayan',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80',
  },
  {
    id: '102',
    title: 'Food & Culture Expo',
    date: '03 Aug 2025',
    time: '10:00 WIB',
    venue: 'Senayan Park',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
  },
];

export function getEventById(id: string): Event | undefined {
  return mockEvents.find(event => event.id === id);
}