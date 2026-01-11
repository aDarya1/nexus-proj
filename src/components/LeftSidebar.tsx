import { Home, Bookmark, FileText, Users, Search } from 'lucide-react';

export function LeftSidebar() {
  const menuItems = [
    { icon: Home, label: 'Моя лента', active: true },
    { icon: Bookmark, label: 'Мои сохраненные статьи', active: false },
    { icon: FileText, label: 'Мои публикации', active: false },
    { icon: Users, label: 'Группы/Сообщества', active: false },
    { icon: Search, label: 'Поиск/Ресерч', active: false },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
      <nav className="space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Мои области
        </h3>
        <div className="space-y-2">
          {['Machine Learning', 'Computer Vision', 'NLP'].map((topic, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
