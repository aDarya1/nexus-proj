import { UserSearch, Mail, MapPin, Briefcase, Search, Filter, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';

interface Collaborator {
  id: string;
  name: string;
  title: string;
  field: string;
  location: string;
  institution: string;
  avatar: string;
  expertise: string[];
  publications: number;
  hIndex: number;
  available: boolean;
}

export function CollaboratorSearch() {
  const { theme, colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);

  const fields = ['all', 'AI', 'Physics', 'Biology', 'Chemistry', 'Medicine', 'Engineering'];
  const allExpertise = ['Machine Learning', 'Quantum Computing', 'CRISPR', 'Neuroscience', 'Climate Science', 'Materials Science'];

  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Dr. Elena Rodriguez',
      title: 'Senior Research Scientist',
      field: 'Physics',
      location: 'San Francisco, USA',
      institution: 'Stanford University',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      expertise: ['Quantum Computing', 'Machine Learning'],
      publications: 87,
      hIndex: 42,
      available: true,
    },
    {
      id: '2',
      name: 'Prof. James Chen',
      title: 'Professor of Computer Science',
      field: 'AI',
      location: 'Cambridge, UK',
      institution: 'University of Cambridge',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      expertise: ['Machine Learning', 'Neural Networks'],
      publications: 156,
      hIndex: 68,
      available: true,
    },
    {
      id: '3',
      name: 'Dr. Maya Thompson',
      title: 'Research Fellow',
      field: 'Biology',
      location: 'Boston, USA',
      institution: 'MIT',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
      expertise: ['CRISPR', 'Gene Editing'],
      publications: 43,
      hIndex: 28,
      available: false,
    },
    {
      id: '4',
      name: 'Prof. David Kim',
      title: 'Professor of Materials Science',
      field: 'Engineering',
      location: 'Seoul, South Korea',
      institution: 'KAIST',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      expertise: ['Materials Science', 'Nanotechnology'],
      publications: 112,
      hIndex: 55,
      available: true,
    },
  ]);

  const filteredCollaborators = collaborators.filter(collab => {
    const matchesSearch = collab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collab.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collab.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesField = selectedField === 'all' || collab.field === selectedField;
    const matchesExpertise = selectedExpertise.length === 0 || 
                            selectedExpertise.some(exp => collab.expertise.includes(exp));
    return matchesSearch && matchesField && matchesExpertise;
  });

  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise(prev =>
      prev.includes(expertise) ? prev.filter(e => e !== expertise) : [...prev, expertise]
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.secondary}20` }}>
              <UserSearch className="w-6 h-6" style={{ color: colors.secondary }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Wyszukiwanie współpracowników
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Znajdź badaczy do współpracy w projektach naukowych
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
                placeholder="Szukaj po imieniu, instytucji lub ekspertyzie..."
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
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Dziedzina:</span>
                {fields.map(field => (
                  <button
                    key={field}
                    onClick={() => setSelectedField(field)}
                    className="px-3 py-1 rounded-lg text-sm font-medium transition-all border"
                    style={{
                      backgroundColor: selectedField === field ? `${colors.primary}20` : 'var(--surface)',
                      borderColor: selectedField === field ? colors.primary : 'var(--border)',
                      color: selectedField === field ? colors.primary : 'var(--text-secondary)',
                    }}
                  >
                    {field === 'all' ? 'Wszystkie' : field}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ekspertyza:</span>
                {allExpertise.map(exp => (
                  <button
                    key={exp}
                    onClick={() => toggleExpertise(exp)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-all border"
                    style={{
                      backgroundColor: selectedExpertise.includes(exp) ? `${colors.secondary}20` : 'var(--surface)',
                      borderColor: selectedExpertise.includes(exp) ? colors.secondary : 'var(--border)',
                      color: selectedExpertise.includes(exp) ? colors.secondary : 'var(--text-secondary)',
                    }}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Collaborators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollaborators.map(collab => (
            <div
              key={collab.id}
              className="rounded-xl border p-6 transition-all hover:shadow-lg"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: collab.available ? 'var(--border)' : 'var(--border)',
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={collab.avatar}
                  alt={collab.name}
                  className="w-16 h-16 rounded-full border-2"
                  style={{ borderColor: colors.primary }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                    {collab.name}
                  </h3>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    {collab.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {collab.institution}
                    </p>
                  </div>
                </div>
                {collab.available && (
                  <span
                    className="px-2 py-1 text-xs font-bold rounded-full"
                    style={{
                      backgroundColor: `${colors.save}20`,
                      color: colors.save,
                    }}
                  >
                    Dostępny
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {collab.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Ekspertyza:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {collab.expertise.map((exp, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: `${colors.secondary}20`,
                          color: colors.secondary,
                        }}
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Publikacje</p>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {collab.publications}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>h-index</p>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {collab.hIndex}
                    </p>
                  </div>
                </div>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: collab.available ? colors.primary : 'var(--bg)',
                  color: collab.available ? 'white' : 'var(--text-secondary)',
                }}
                disabled={!collab.available}
              >
                <Mail className="w-4 h-4" />
                {collab.available ? 'Skontaktuj się' : 'Niedostępny'}
              </button>
            </div>
          ))}
        </div>

        {filteredCollaborators.length === 0 && (
          <div className="text-center py-12">
            <UserSearch className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Nie znaleziono współpracowników
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

