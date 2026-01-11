import React from 'react';
import { useTheme } from './ThemeProvider';

export function Footer() {
  const { theme, colors } = useTheme();

  const authors = [
    { name: 'Ruslan Biedychev', album: '82179' },
    { name: 'Darya Atroshchyk', album: '81829' },
    { name: 'Dzmitry Varonin', album: '81138' },
    { name: 'Tomasz Pestka', album: '' },
  ];

  return (
    <footer 
      className="border-t mt-auto"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Authors */}
          <div>
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Autorzy
            </h3>
            <ul className="space-y-2">
              {authors.map((author, index) => (
                <li key={index} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {index + 1}. {author.name}
                  {author.album && (
                    <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>
                      {' '}nr. albumu {author.album}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* University */}
          <div>
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Uczelnia
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              UWSB Merito Gdańsk
            </p>
          </div>

          {/* Year */}
          <div>
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Rok
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              2026
            </p>
          </div>
        </div>

        {/* Bottom border */}
        <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
            © 2026 nexus. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}

