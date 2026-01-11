import { Home, Search, BookMarked, Bell, User, Download, Users, Calendar, UserSearch } from 'lucide-react';
import { Screen } from '../../App';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function Sidebar({ currentScreen, onNavigate }: SidebarProps) {
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

  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 border-r p-6 transition-colors duration-300" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium"
              style={{
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-primary)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      {/* Communities Section */}
      <div className="mt-8 pt-8 border-t transition-colors" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
          MY COMMUNITIES
        </h3>
        <div className="space-y-2">
          {['Quantum Physics', 'Machine Learning', 'Neuroscience'].map((community, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 text-sm rounded-lg transition-all"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <span style={{ color: 'var(--primary)' }}>#</span> {community}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}