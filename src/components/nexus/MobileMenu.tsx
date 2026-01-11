import { X, Home, Search, BookMarked, Bell, User, Download, Users, Calendar, UserSearch } from 'lucide-react';
import { Screen } from '../../App';

interface MobileMenuProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ currentScreen, onNavigate, isOpen, onClose }: MobileMenuProps) {
  const menuItems = [
    { icon: Home, label: 'Home', id: 'home' as Screen },
    { icon: Search, label: 'Search', id: 'search' as Screen },
    { icon: BookMarked, label: 'Library', id: 'library' as Screen },
    { icon: Download, label: 'Downloads', id: 'downloads' as Screen },
    { icon: Bell, label: 'Notifications', id: 'notifications' as Screen },
    { icon: Users, label: 'Groups', id: 'groups' as Screen },
    { icon: Calendar, label: 'Calendar', id: 'calendar' as Screen },
    { icon: UserSearch, label: 'Collaborators', id: 'collaborators' as Screen },
    { icon: User, label: 'Profile', id: 'profile' as Screen },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Menu */}
      <aside 
        className="fixed left-0 top-0 h-full w-64 border-r z-50 transition-transform duration-300 md:hidden overflow-y-auto"
        style={{ 
          backgroundColor: 'var(--surface)', 
          borderColor: 'var(--border)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-[var(--hover)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium"
                style={{
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-primary)',
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Communities Section */}
        <div className="p-4 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
            MY COMMUNITIES
          </h3>
          <div className="space-y-2">
            {['Quantum Physics', 'Machine Learning', 'Neuroscience'].map((community, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 text-sm rounded-lg transition-all"
                style={{ color: 'var(--text-secondary)' }}
                onClick={onClose}
              >
                <span style={{ color: 'var(--primary)' }}>#</span> {community}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

