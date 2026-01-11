import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl transition-all hover:scale-110 border"
      style={{ 
        backgroundColor: 'var(--hover)',
        borderColor: 'var(--border)'
      }}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
      ) : (
        <Sun className="w-5 h-5" style={{ color: 'var(--primary)' }} />
      )}
    </button>
  );
}