// src/lib/organizer.ts

export interface OrganizerEvent {
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
  organizerId?: string;
}

export interface CheckIn {
  id: string;
  ticketCode: string;
  eventId: string;
  eventName: string;
  userName: string;
  checkedInAt: string;
}

const EVENTS_KEY = 'admin_events';
const CHECKIN_KEY = 'organizer_checkins';
const EVENT_NAME = 'organizer-data-updated';

// ✅ Get semua event
export function getOrganizerEvents(): OrganizerEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
  } catch {
    return [];
  }
}

// ✅ Save events & dispatch event
export function saveOrganizerEvents(events: OrganizerEvent[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'events' } }));
}

// ✅ Get check-ins
export function getCheckIns(): CheckIn[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CHECKIN_KEY) || '[]');
  } catch {
    return [];
  }
}

// ✅ Add check-in & dispatch event
export function addCheckIn(checkin: Omit<CheckIn, 'id' | 'checkedInAt'>): CheckIn {
  const newCheckIn: CheckIn = {
    ...checkin,
    id: `CHK-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    checkedInAt: new Date().toISOString(),
  };
  
  const all = getCheckIns();
  all.unshift(newCheckIn);
  localStorage.setItem(CHECKIN_KEY, JSON.stringify(all));
  
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'checkin' } }));
  return newCheckIn;
}

// ✅ Update tickets sold (saat ada pembelian)
export function updateTicketsSold(eventId: string, increment: number = 1) {
  const events = getOrganizerEvents();
  const updated = events.map(ev => 
    ev.id === eventId 
      ? { ...ev, ticketsSold: Math.min(ev.ticketsSold + increment, ev.capacity) }
      : ev
  );
  saveOrganizerEvents(updated);
}

// ✅ Subscribe ke event updates
export function subscribeToOrganizerUpdates(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}