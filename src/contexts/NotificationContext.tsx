import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Interfejs powiadomienia
export interface Notification {
  id: string;
  type: 'new_publication' | 'comment' | 'like' | 'follow' | 'mention' | 'event';
  title: string;
  message: string;
  articleId?: number;
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Kontekst do zarządzania powiadomieniami użytkownika
 * TODO: Zastąp localStorage prawdziwym API backendu
 * Przykład:
 * - addNotification: await fetch(`/api/users/${userId}/notifications`, { method: 'POST', body: JSON.stringify(notification) })
 * - markAsRead: await fetch(`/api/users/${userId}/notifications/${id}/read`, { method: 'PATCH' })
 * - notifications: const response = await fetch(`/api/users/${userId}/notifications`)
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (!user) return [];
    
    // Wczytaj powiadomienia z localStorage (placeholder dla prawdziwego API)
    const saved = localStorage.getItem(`notifications_${user.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    
    // Domyślne powiadomienia dla nowych użytkowników
    return [
      {
        id: '1',
        type: 'new_publication',
        title: 'Nowy artykuł w Twojej dziedzinie',
        message: 'Dr. Elena Rodriguez opublikowała nowy artykuł o Quantum Computing',
        articleId: 1,
        authorName: 'Dr. Elena Rodriguez',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: '2',
        type: 'comment',
        title: 'Nowy komentarz',
        message: 'Prof. James Chen skomentował Twój artykuł',
        articleId: 2,
        authorName: 'Prof. James Chen',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
    ];
  });

  // Zapisz powiadomienia do localStorage przy każdej zmianie (TODO: zastąp prawdziwym API)
  useEffect(() => {
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Wyczyść powiadomienia gdy użytkownik się wyloguje
  useEffect(() => {
    if (!user) {
      setNotifications([]);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if (!user) return;
    
    // TODO: Wywołaj API backendu
    // await fetch(`/api/users/${user.id}/notifications`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(notificationData)
    // });
    
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    // TODO: Wywołaj API backendu
    // await fetch(`/api/users/${user?.id}/notifications/${id}/read`, { method: 'PATCH' });
    
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    if (!user) return;
    
    // TODO: Wywołaj API backendu
    // await fetch(`/api/users/${user.id}/notifications/read-all`, { method: 'PATCH' });
    
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    if (!user) return;
    
    // TODO: Wywołaj API backendu
    // await fetch(`/api/users/${user.id}/notifications/${id}`, { method: 'DELETE' });
    
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    if (!user) return;
    
    // TODO: Wywołaj API backendu
    // await fetch(`/api/users/${user.id}/notifications`, { method: 'DELETE' });
    
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

