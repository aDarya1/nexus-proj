import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Theme = 'light' | 'dark';

// Ustawienia dostępności
export interface AccessibilitySettings {
  highContrast: boolean; // Tryb wysokiego kontrastu
  fontSize: 'normal' | 'large' | 'extra-large'; // Rozmiar czcionki
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  accessibility: AccessibilitySettings;
  setAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  colors: {
    bg: string;
    surface: string;
    primary: string;
    secondary: string;
    textPrimary: string;
    textSecondary: string;
    hover: string;
    border: string;
    save: string;
    like: string;
    download: string;
    comment: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Kolory dla trybu normalnego
const lightTheme = {
  bg: '#FFFFFF',
  surface: '#F8F9FF',
  primary: '#6366F1',
  secondary: '#EC4899',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  hover: '#F3F4F6',
  border: '#E5E7EB',
  save: '#10B981',
  like: '#EF4444',
  download: '#3B82F6',
  comment: '#8B5CF6',
};

const darkTheme = {
  bg: '#0F172A',
  surface: '#1E293B',
  primary: '#818CF8',
  secondary: '#F472B6',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  hover: '#2D3748',
  border: '#374151',
  save: '#34D399',
  like: '#FCA5A5',
  download: '#60A5FA',
  comment: '#A78BFA',
};

// Kolory dla trybu wysokiego kontrastu (WCAG AAA compliance)
const highContrastLightTheme = {
  bg: '#FFFFFF',
  surface: '#F0F0F0',
  primary: '#0000FF', // Niebieski z wysokim kontrastem
  secondary: '#8B0000', // Ciemny czerwony
  textPrimary: '#000000',
  textSecondary: '#000000',
  hover: '#E0E0E0',
  border: '#000000',
  save: '#006400', // Ciemny zielony
  like: '#8B0000', // Ciemny czerwony
  download: '#0000FF', // Niebieski
  comment: '#4B0082', // Indigo
};

const highContrastDarkTheme = {
  bg: '#000000',
  surface: '#1A1A1A',
  primary: '#00FFFF', // Cyjan z wysokim kontrastem
  secondary: '#FF00FF', // Magenta
  textPrimary: '#FFFFFF',
  textSecondary: '#FFFFFF',
  hover: '#2A2A2A',
  border: '#FFFFFF',
  save: '#00FF00', // Zielony
  like: '#FF0000', // Czerwony
  download: '#00FFFF', // Cyjan
  comment: '#FF00FF', // Magenta
};

// Mapowanie rozmiarów czcionek
const fontSizeMap = {
  normal: '16px',
  large: '20px',
  'extra-large': '24px',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [accessibility, setAccessibilityState] = useState<AccessibilitySettings>(() => {
    // Wczytaj ustawienia z localStorage jeśli istnieją
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { highContrast: false, fontSize: 'normal' };
      }
    }
    return { highContrast: false, fontSize: 'normal' };
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setAccessibility = (settings: Partial<AccessibilitySettings>) => {
    const newSettings = { ...accessibility, ...settings };
    setAccessibilityState(newSettings);
    // Zapisz do localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
  };

  // Wybierz odpowiednie kolory w zależności od tematu i trybu wysokiego kontrastu
  const getColors = () => {
    if (accessibility.highContrast) {
      return theme === 'light' ? highContrastLightTheme : highContrastDarkTheme;
    }
    return theme === 'light' ? lightTheme : darkTheme;
  };

  const colors = getColors();

  useEffect(() => {
    // Zastosuj kolory
    document.documentElement.style.setProperty('--bg', colors.bg);
    document.documentElement.style.setProperty('--surface', colors.surface);
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--secondary', colors.secondary);
    document.documentElement.style.setProperty('--text-primary', colors.textPrimary);
    document.documentElement.style.setProperty('--text-secondary', colors.textSecondary);
    document.documentElement.style.setProperty('--hover', colors.hover);
    document.documentElement.style.setProperty('--border', colors.border);
    document.documentElement.style.setProperty('--save', colors.save);
    document.documentElement.style.setProperty('--like', colors.like);
    document.documentElement.style.setProperty('--download', colors.download);
    document.documentElement.style.setProperty('--comment', colors.comment);

    // Zastosuj rozmiar czcionki
    const fontSize = fontSizeMap[accessibility.fontSize];
    document.documentElement.style.setProperty('--base-font-size', fontSize);
    document.body.style.fontSize = fontSize;

    // Zastosuj klasę dla wysokiego kontrastu (jeśli potrzebna dla dodatkowych stylów)
    if (accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Zastosuj klasę dla rozmiaru czcionki
    document.documentElement.classList.remove('font-normal', 'font-large', 'font-extra-large');
    if (accessibility.fontSize === 'normal') {
      document.documentElement.classList.add('font-normal');
    } else if (accessibility.fontSize === 'large') {
      document.documentElement.classList.add('font-large');
    } else {
      document.documentElement.classList.add('font-extra-large');
    }
  }, [theme, colors, accessibility]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accessibility, setAccessibility, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}