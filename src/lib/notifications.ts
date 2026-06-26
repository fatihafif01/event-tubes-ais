// src/lib/notifications.ts

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'payment_approved' | 'payment_rejected' | 'ticket_purchased' | 'event_reminder' | 'general';
  read: boolean;
  createdAt: string;
  data?: any;
}

const STORAGE_KEY = 'eventsphere_notifications';

// ✅ Get all notifications for a user
export function getNotifications(userId: string): Notification[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return all.filter((n: Notification) => n.userId === userId)
              .sort((a: Notification, b: Notification) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
  } catch {
    return [];
  }
}

// ✅ Add new notification
export function addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    all.push(newNotification);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    
    // Trigger event untuk sync real-time
    window.dispatchEvent(new CustomEvent('notifications-updated', { 
      detail: { userId: notification.userId } 
    }));
  } catch (err) {
    console.error('Failed to save notification:', err);
  }

  return newNotification;
}

// ✅ Mark notification as read
export function markAsRead(notificationId: string, userId: string): void {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = all.map((n: Notification) =>
      n.id === notificationId && n.userId === userId ? { ...n, read: true } : n
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { userId } }));
  } catch (err) {
    console.error('Failed to mark as read:', err);
  }
}

// ✅ Mark all as read
export function markAllAsRead(userId: string): void {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = all.map((n: Notification) =>
      n.userId === userId ? { ...n, read: true } : n
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { userId } }));
  } catch (err) {
    console.error('Failed to mark all as read:', err);
  }
}

// ✅ Get unread count
export function getUnreadCount(userId: string): number {
  return getNotifications(userId).filter(n => !n.read).length;
}

// ✅ Delete notification
export function deleteNotification(notificationId: string, userId: string): void {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = all.filter((n: Notification) => 
      !(n.id === notificationId && n.userId === userId)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { userId } }));
  } catch (err) {
    console.error('Failed to delete notification:', err);
  }
}