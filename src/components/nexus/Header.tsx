import { Search, Plus, Mic, X, LogIn, User, LogOut, Bell, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { AccessibilitySettings } from './AccessibilitySettings';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { AuthModal } from './AuthModal';
import { NotificationsPanel } from './NotificationsPanel';
import { MobileMenu } from './MobileMenu';
import { Screen } from '../../App';

interface HeaderProps {
  onPublish: () => void;
  onSearch: (query: string) => void;
  currentScreen?: Screen;
  onNavigate?: (screen: Screen) => void;
}

export function Header({ onPublish, onSearch, currentScreen, onNavigate }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [searchValue, setSearchValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Zamknij menu użytkownika po kliknięciu poza nim
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

  const suggestions = {
    articles: ['Quantum Computing Breakthrough', 'Neural Networks for Protein Folding', 'Climate Change Modeling 2024'],
    authors: ['Dr. Elena Rodriguez', 'Prof. James Chen', 'Dr. Maya Thompson'],
    terms: ['quantum', 'machine learning', 'CRISPR', 'climate change', 'artificial intelligence'],
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    setShowSuggestions(value.length > 0);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setShowSuggestions(false);
    onSearch(''); // Wyczyść wyszukiwanie i pokaż wszystkie artykuły
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Simulate voice input
    setTimeout(() => {
      setSearchValue('quantum computing');
      setIsListening(false);
    }, 2000);
  };

  return (
    <>
      {/* Desktop Header - Original version, always visible on desktop */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
            <span className="text-xl font-bold text-white">N</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
            NEXUS
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
          <div className="relative group">
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 z-10 pointer-events-none group-focus-within:text-[var(--primary)] transition-colors" 
              style={{ color: 'var(--text-secondary)' }} 
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => searchValue && setShowSuggestions(true)}
              placeholder="Search papers, authors, topics..."
              className="w-full pl-12 pr-20 py-3 border rounded-xl focus:outline-none transition-all"
              style={{ 
                backgroundColor: 'var(--bg)', 
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            />
            {/* Clear Button (X) */}
            {searchValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all hover:bg-[var(--hover)] flex items-center justify-center"
                style={{ color: 'var(--text-secondary)' }}
                title="Wyczyść wyszukiwanie"
                aria-label="Wyczyść wyszukiwanie"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all flex items-center justify-center ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : ''
              }`}
              style={{ color: isListening ? 'white' : 'var(--text-secondary)' }}
              title="Voice search"
              aria-label="Voice search"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Autocomplete Suggestions */}
            {showSuggestions && (
              <div className="absolute top-full mt-2 w-full rounded-xl shadow-2xl z-50 overflow-hidden border transition-colors" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                {/* Articles */}
                {suggestions.articles.some(a => a.toLowerCase().includes(searchValue.toLowerCase())) && (
                  <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs uppercase font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Articles</div>
                    {suggestions.articles
                      .filter(a => a.toLowerCase().includes(searchValue.toLowerCase()))
                      .map((article, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(article)}
                          className="w-full text-left px-3 py-2 text-sm rounded transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {article}
                        </button>
                      ))
                    }
                  </div>
                )}

                {/* Authors */}
                {suggestions.authors.some(a => a.toLowerCase().includes(searchValue.toLowerCase())) && (
                  <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs uppercase font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Authors</div>
                    {suggestions.authors
                      .filter(a => a.toLowerCase().includes(searchValue.toLowerCase()))
                      .map((author, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(author)}
                          className="w-full text-left px-3 py-2 text-sm rounded transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {author}
                        </button>
                      ))
                    }
                  </div>
                )}

                {/* Terms */}
                {suggestions.terms.some(t => t.toLowerCase().includes(searchValue.toLowerCase())) && (
                  <div className="p-3">
                    <div className="text-xs uppercase font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Popular Terms</div>
                    {suggestions.terms
                      .filter(t => t.toLowerCase().includes(searchValue.toLowerCase()))
                      .map((term, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(term)}
                          className="w-full text-left px-3 py-2 text-sm rounded transition-colors"
                          style={{ color: 'var(--primary)' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {term}
                        </button>
                      ))
                    }
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={onPublish}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                color: 'white'
              }}
            >
              <Plus className="w-5 h-5" />
              <span>PUBLISH</span>
            </button>
          )}

          <ThemeToggle />

          <AccessibilitySettings />

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
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
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

              {/* Welcome message and user menu */}
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Witaj, {user?.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {user?.email}
                  </p>
                </div>
                <div className="relative" ref={userMenuRef}>
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer hover:scale-110 transition-transform"
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
                      className="absolute right-0 top-full mt-2 w-56 rounded-lg border shadow-lg overflow-hidden z-50"
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
                        <LogOut className="w-5 h-5" />
                        Wyloguj się
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setShowAuthModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:opacity-80"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                <LogIn className="w-6 h-6" />
                <span>Zaloguj</span>
              </button>
              <button
                onClick={() => {
                  setAuthModalTab('register');
                  setShowAuthModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all"
                style={{
                  background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                  color: 'white',
                }}
              >
                <User className="w-6 h-6" />
                <span>Rejestracja</span>
              </button>
            </div>
          )}
        </div>
        </div>
      </header>

      {/* Mobile Header - Responsive version */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-3 py-3 gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(true)}
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

          {/* Mobile Search Button */}
          <button
            onClick={() => {
              if (onNavigate) onNavigate('search');
            }}
            className="p-2 rounded-lg transition-colors hover:bg-[var(--hover)]"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Search"
          >
            <Search className="w-6 h-6" />
          </button>

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

      {/* Modals - Shared for both desktop and mobile */}
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
            // TODO: Navigate to article detail
            console.log('Navigate to article:', articleId);
          }}
        />
      )}

      {/* Mobile Menu */}
      {onNavigate && currentScreen && (
        <MobileMenu
          currentScreen={currentScreen}
          onNavigate={onNavigate}
          isOpen={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
        />
      )}
    </>
  );
}