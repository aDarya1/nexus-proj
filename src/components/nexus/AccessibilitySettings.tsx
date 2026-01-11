import { Settings, Contrast, Type, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';

/**
 * Komponent ustawień dostępności
 * Zawiera opcje trybu wysokiego kontrastu i zwiększonego rozmiaru czcionki
 */
export function AccessibilitySettings() {
  const { accessibility, setAccessibility } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl transition-all hover:scale-110 border flex items-center gap-2"
        style={{ 
          backgroundColor: 'var(--hover)',
          borderColor: 'var(--border)'
        }}
        title="Ustawienia dostępności"
        aria-label="Otwórz ustawienia dostępności"
      >
        <Settings className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        <span className="text-sm font-medium hidden md:inline" style={{ color: 'var(--text-primary)' }}>
          Dostępność
        </span>
      </button>

      {isOpen && (
        <>
          {/* Overlay do zamknięcia menu */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu ustawień */}
          <div 
            className="absolute right-0 top-full mt-2 w-80 bg-[#1e1e2e] border border-gray-800 rounded-lg shadow-[0_0_20px_rgba(0,238,255,0.2)] z-50 p-4 space-y-4"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Ustawienia dostępności
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-[#121212] transition-colors"
                aria-label="Zamknij menu dostępności"
              >
                <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            {/* Tryb wysokiego kontrastu */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Contrast className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Tryb wysokiego kontrastu
                </label>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                Zwiększa kontrast kolorów dla lepszej czytelności (zgodność z WCAG AAA)
              </p>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={accessibility.highContrast}
                  onChange={(e) => setAccessibility({ highContrast: e.target.checked })}
                  className="w-5 h-5 bg-[#121212] border-2 border-gray-700 rounded checked:bg-[#00eeff] checked:border-[#00eeff] transition-all"
                  style={{
                    backgroundColor: 'var(--bg)',
                    borderColor: 'var(--border)'
                  }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {accessibility.highContrast ? 'Włączone' : 'Wyłączone'}
                </span>
              </label>
            </div>

            {/* Rozmiar czcionki */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Type className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Rozmiar czcionki
                </label>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                Zwiększ rozmiar czcionki dla lepszej czytelności
              </p>
              <div className="flex gap-2">
                {(['normal', 'large', 'extra-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setAccessibility({ fontSize: size })}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      accessibility.fontSize === size
                        ? 'bg-[#00eeff]/20 text-[#00eeff] border border-[#00eeff]'
                        : 'bg-[#121212] text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                    style={{
                      backgroundColor: accessibility.fontSize === size ? 'var(--primary)' : 'var(--hover)',
                      borderColor: accessibility.fontSize === size ? 'var(--primary)' : 'var(--border)',
                      color: accessibility.fontSize === size ? 'var(--primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {size === 'normal' ? 'Normalny' : size === 'large' ? 'Duży' : 'Bardzo duży'}
                  </button>
                ))}
              </div>
            </div>

            {/* Informacja o zgodności */}
            <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                Zgodne z WCAG 2.1 AA/AAA
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
