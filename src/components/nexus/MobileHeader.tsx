import { Search, Menu, Bell, LogIn, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { AuthModal } from './AuthModal';
import { NotificationsPanel } from './NotificationsPanel';
import { DateTimeDisplay } from './DateTimeDisplay';

interface MobileHeaderProps {
  onMenuClick: () => void;
  onSearch: (query: string) => void;
}

export function MobileHeader({ onMenuClick, onSearch }: MobileHeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-3 py-3 gap-2">
          {/* Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg transition-colors hover:bg-[var(--hover)]"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
              <span className="text-lg font-bold text-white">N</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
              NEXUS
            </h1>
          </div>

          {/* Search Button */}
          <button
            onClick={() => onSearch('')}
            className="p-2 rounded-lg transition-colors hover:bg-[var(--hover)]"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Search"
          >
            <Search className="w-6 h-6" />
          </button>

          {/* Date and Time */}
          <div className="flex items-center flex-shrink-0">
            <DateTimeDisplay />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isAuthenticated && (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="relative p-2 rounded-lg transition-all hover:bg-[var(--hover)]"
                    style={{ color: 'var(--text-secondary)' }}
                    title="Powiadomienia"
                    aria-label="Powiadomienia"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span 
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: 'var(--like)',
                          color: 'white',
                        }}
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
                <div className="relative" ref={userMenuRef}>
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden border-2 cursor-pointer hover:scale-110 transition-transform"
                    style={{ borderColor: 'var(--primary)' }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    role="button"
                    tabIndex={0}
                    aria-label="Menu użytkownika"
                  >
                    <img
                      src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nexus'}
                      alt={user?.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {showUserMenu && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-48 rounded-lg border shadow-lg overflow-hidden z-50"
                      style={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                      }}
                    >
                      <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {user?.name}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {user?.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          setAuthModalTab('login');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--hover)]"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <LogOut className="w-4 h-4" />
                        Wyloguj się
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-1 px-2 py-2 rounded-lg border transition-all hover:opacity-80"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <LogIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setAuthModalTab('register');
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-1 px-2 py-2 rounded-lg font-semibold transition-all text-sm"
                  style={{
                    background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                    color: 'white',
                  }}
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          initialTab={authModalTab}
        />
      )}
      {showNotifications && (
        <NotificationsPanel
          onClose={() => setShowNotifications(false)}
          onArticleClick={(articleId) => {
            console.log('Navigate to article:', articleId);
          }}
        />
      )}
    </>
  );
}

