import { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, Check, KeyRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from './ThemeProvider';

interface AuthModalProps {
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export function AuthModal({ onClose, initialTab = 'login' }: AuthModalProps) {
  const { login, register } = useAuth();
  const { theme, colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoginLoading(true);

    try {
      await login(loginEmail, loginPassword);
      onClose();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Wystąpił błąd podczas logowania');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    // Walidacja
    if (registerPassword.length < 6) {
      setRegisterError('Hasło musi mieć co najmniej 6 znaków');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Hasła nie są identyczne');
      return;
    }

    setIsRegisterLoading(true);

    try {
      await register(registerEmail, registerPassword, registerName);
      onClose();
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : 'Wystąpił błąd podczas rejestracji');
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full max-w-md rounded-xl border shadow-2xl"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {activeTab === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-[var(--hover)]"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Zamknij"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
              setRegisterError('');
            }}
            className="flex-1 px-6 py-4 text-sm font-semibold transition-all relative"
            style={{
              color: activeTab === 'login' ? colors.primary : 'var(--text-secondary)',
            }}
          >
            Zaloguj się
            {activeTab === 'login' && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: colors.primary }}
              />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setLoginError('');
              setRegisterError('');
            }}
            className="flex-1 px-6 py-4 text-sm font-semibold transition-all relative"
            style={{
              color: activeTab === 'register' ? colors.primary : 'var(--text-secondary)',
            }}
          >
            Zarejestruj się
            {activeTab === 'register' && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: colors.primary }}
              />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div 
                  className="flex items-center gap-2 p-3 rounded-lg border"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2',
                    borderColor: '#EF4444',
                    color: '#EF4444',
                  }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{loginError}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'var(--bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="twoj@email.pl"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Hasło
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium transition-colors hover:opacity-80"
                    style={{ color: colors.primary }}
                  >
                    Zapomniałeś hasła?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'var(--bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  color: 'white',
                }}
              >
                {isLoginLoading ? 'Logowanie...' : 'Zaloguj się'}
              </button>

              {/* Switch to Register */}
              <div className="text-center text-sm pt-2" style={{ color: 'var(--text-secondary)' }}>
                <span>Nie masz konta? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-semibold transition-colors hover:opacity-80"
                  style={{ color: colors.primary }}
                >
                  Zarejestruj się tutaj
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {registerError && (
                <div 
                  className="flex items-center gap-2 p-3 rounded-lg border"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2',
                    borderColor: '#EF4444',
                    color: '#EF4444',
                  }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{registerError}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Imię i nazwisko
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'var(--bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="Jan Kowalski"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'var(--bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="twoj@email.pl"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Hasło
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'var(--bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Minimum 6 znaków
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Potwierdź hasło
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'var(--bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="••••••••"
                  />
                </div>
                {registerPassword && registerConfirmPassword && registerPassword === registerConfirmPassword && (
                  <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: colors.save }}>
                    <Check className="w-3 h-3" />
                    <span>Hasła są identyczne</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isRegisterLoading}
                className="w-full px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  color: 'white',
                }}
              >
                {isRegisterLoading ? 'Rejestrowanie...' : 'Zarejestruj się'}
              </button>

              {/* Switch to Login */}
              <div className="text-center text-sm pt-2" style={{ color: 'var(--text-secondary)' }}>
                <span>Masz już konto? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-semibold transition-colors hover:opacity-80"
                  style={{ color: colors.primary }}
                >
                  Zaloguj się tutaj
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

