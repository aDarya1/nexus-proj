import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
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

const lightTheme = {
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  primary: '#7C3AED',
  secondary: '#0EA5E9',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  hover: '#F1F5F9',
  border: '#E2E8F0',
  save: '#10B981',
  like: '#EF4444',
  download: '#3B82F6',
  comment: '#8B5CF6',
};

const darkTheme = {
  bg: '#0F172A',
  surface: '#1E293B',
  primary: '#8B5CF6',
  secondary: '#06B6D4',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  hover: '#334155',
  border: '#475569',
  save: '#10B981',
  like: '#FCA5A5',
  download: '#60A5FA',
  comment: '#A78BFA',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    document.documentElement.style.setProperty('--bg', colors.bg);
    document.documentElement.style.setProperty('--surface', colors.surface);
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--secondary', colors.secondary);
    document.documentElement.style.setProperty('--text-primary', colors.textPrimary);
    document.documentElement.style.setProperty('--text-secondary', colors.textSecondary);
    document.documentElement.style.setProperty('--hover', colors.hover);
    document.documentElement.style.setProperty('--border', colors.border);
  }, [theme, colors]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
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
