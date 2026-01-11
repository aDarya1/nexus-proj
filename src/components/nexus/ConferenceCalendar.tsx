import { Calendar, MapPin, Clock, Users, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';

interface ConferenceEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  type: 'conference' | 'workshop' | 'symposium' | 'webinar';
  field: string;
  attendees: number;
  description: string;
  website?: string;
}

export function ConferenceCalendar() {
  const { theme, colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');

  const types = ['all', 'conference', 'workshop', 'symposium', 'webinar'];
  const fields = ['all', 'AI', 'Physics', 'Biology', 'Chemistry', 'Medicine', 'Engineering'];

  const [events, setEvents] = useState<ConferenceEvent[]>([
    {
      id: '1',
      title: 'International Conference on Quantum Computing',
      date: '2024-03-15',
      endDate: '2024-03-17',
      location: 'San Francisco, USA',
      type: 'conference',
      field: 'Physics',
      attendees: 1200,
      description: 'Leading researchers will present latest breakthroughs in quantum computing',
      website: 'https://example.com',
    },
    {
      id: '2',
      title: 'AI & Machine Learning Workshop',
      date: '2024-03-20',
      location: 'London, UK',
      type: 'workshop',
      field: 'AI',
      attendees: 350,
      description: 'Hands-on workshop on advanced ML techniques',
    },
    {
      id: '3',
      title: 'Neuroscience Symposium',
      date: '2024-04-05',
      endDate: '2024-04-06',
      location: 'Berlin, Germany',
      type: 'symposium',
      field: 'Medicine',
      attendees: 500,
      description: 'Exploring the latest in brain research and neural networks',
    },
    {
      id: '4',
      title: 'CRISPR Technology Webinar',
      date: '2024-03-25',
      location: 'Online',
      type: 'webinar',
      field: 'Biology',
      attendees: 800,
      description: 'Virtual event on CRISPR gene editing advances',
    },
  ]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesField = selectedField === 'all' || event.field === selectedField;
    return matchesSearch && matchesType && matchesField;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getTypeColor = (type: ConferenceEvent['type']) => {
    switch (type) {
      case 'conference':
        return colors.primary;
      case 'workshop':
        return colors.secondary;
      case 'symposium':
        return colors.save;
      case 'webinar':
        return '#F59E0B';
      default:
        return colors.primary;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}20` }}>
              <Calendar className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Kalendarz konferencji i wydarzeń
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Znajdź konferencje, warsztaty i wydarzenia naukowe
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj wydarzeń..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--bg)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Typ:</span>
                {types.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className="px-3 py-1 rounded-lg text-sm font-medium transition-all border"
                    style={{
                      backgroundColor: selectedType === type ? `${colors.primary}20` : 'var(--surface)',
                      borderColor: selectedType === type ? colors.primary : 'var(--border)',
                      color: selectedType === type ? colors.primary : 'var(--text-secondary)',
                    }}
                  >
                    {type === 'all' ? 'Wszystkie' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Dziedzina:</span>
                {fields.map(field => (
                  <button
                    key={field}
                    onClick={() => setSelectedField(field)}
                    className="px-3 py-1 rounded-lg text-sm font-medium transition-all border"
                    style={{
                      backgroundColor: selectedField === field ? `${colors.secondary}20` : 'var(--surface)',
                      borderColor: selectedField === field ? colors.secondary : 'var(--border)',
                      color: selectedField === field ? colors.secondary : 'var(--text-secondary)',
                    }}
                  >
                    {field === 'all' ? 'Wszystkie' : field}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="rounded-xl border p-6 transition-all hover:shadow-lg"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {event.title}
                    </h3>
                    <span
                      className="px-2 py-1 text-xs font-bold rounded-full"
                      style={{
                        backgroundColor: `${getTypeColor(event.type)}20`,
                        color: getTypeColor(event.type),
                      }}
                    >
                      {event.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Data</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {formatDate(event.date)}
                      {event.endDate && ` - ${formatDate(event.endDate)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Lokalizacja</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {event.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Uczestnicy</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {event.attendees.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: `${colors.secondary}20`,
                      color: colors.secondary,
                    }}
                  >
                    {event.field}
                  </span>
                </div>
              </div>

              {event.website && (
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: `${colors.primary}20`,
                    color: colors.primary,
                  }}
                >
                  Odwiedź stronę wydarzenia
                </a>
              )}
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Nie znaleziono wydarzeń
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Spróbuj zmienić kryteria wyszukiwania
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

