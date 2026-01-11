import { Bell, X, Check, Trash2, ExternalLink } from 'lucide-react';
import { useNotifications, Notification } from '../../contexts/NotificationContext';
import { useTheme } from './ThemeProvider';

// Funkcja do formatowania czasu względnego
const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) return 'przed chwilą';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minutę' : minutes < 5 ? 'minuty' : 'minut'} temu`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'godzinę' : hours < 5 ? 'godziny' : 'godzin'} temu`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'dzień' : 'dni'} temu`;
  }
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? 'tydzień' : weeks < 5 ? 'tygodnie' : 'tygodni'} temu`;
  }
  const months = Math.floor(diffInSeconds / 2592000);
  return `${months} ${months === 1 ? 'miesiąc' : months < 5 ? 'miesiące' : 'miesięcy'} temu`;
};

interface NotificationsPanelProps {
  onClose: () => void;
  onArticleClick?: (articleId: number) => void;
}

export function NotificationsPanel({ onClose, onArticleClick }: NotificationsPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const { theme, colors } = useTheme();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_publication':
        return '📄';
      case 'comment':
        return '💬';
      case 'like':
        return '❤️';
      case 'follow':
        return '👤';
      case 'mention':
        return '🔔';
      case 'event':
        return '📅';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'new_publication':
        return colors.primary;
      case 'comment':
        return '#3B82F6';
      case 'like':
        return colors.like;
      case 'follow':
        return colors.secondary;
      case 'mention':
        return '#F59E0B';
      case 'event':
        return colors.save;
      default:
        return colors.primary;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.articleId && onArticleClick) {
      onArticleClick(notification.articleId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div 
        className="relative w-full max-w-2xl max-h-[80vh] rounded-xl border shadow-2xl flex flex-col"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6" style={{ color: colors.primary }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Powiadomienia
            </h2>
            {unreadCount > 0 && (
              <span 
                className="px-2 py-1 text-xs font-bold rounded-full"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--hover)]"
                style={{ color: 'var(--text-primary)' }}
                title="Oznacz wszystkie jako przeczytane"
              >
                <Check className="w-4 h-4" />
                <span>Przeczytaj wszystkie</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--hover)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="w-16 h-16 mb-4" style={{ color: 'var(--text-secondary)' }} />
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Brak powiadomień
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Będziesz otrzymywać powiadomienia o nowych publikacjach, komentarzach i innych aktywnościach
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  !notification.read ? 'border-l-4' : ''
                }`}
                style={{
                  backgroundColor: notification.read ? 'var(--bg)' : 'var(--surface)',
                  borderColor: notification.read ? 'var(--border)' : getNotificationColor(notification.type),
                  borderLeftWidth: !notification.read ? '4px' : '1px',
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      backgroundColor: `${getNotificationColor(notification.type)}20`,
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 
                        className={`text-sm font-semibold ${!notification.read ? 'font-bold' : ''}`}
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: getNotificationColor(notification.type) }}
                        />
                      )}
                    </div>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {notification.message}
                    </p>
                    {notification.authorName && (
                      <div className="flex items-center gap-2 mb-2">
                        {notification.authorAvatar && (
                          <img
                            src={notification.authorAvatar}
                            alt={notification.authorName}
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {notification.authorName}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 rounded transition-colors hover:bg-[var(--hover)]"
                        style={{ color: 'var(--text-secondary)' }}
                        title="Usuń powiadomienie"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={clearAll}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--hover)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              Wyczyść wszystkie
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

