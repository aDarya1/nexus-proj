import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Interfejs użytkownika
export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  field?: string;
  location?: string;
  website?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Kontekst do zarządzania autentykacją użytkownika
 * TODO: Zastąp localStorage prawdziwym API backendu
 * Przykład:
 * - login: await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
 * - register: await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) })
 * - logout: await fetch('/api/auth/logout', { method: 'POST' })
 * - updateUser: await fetch(`/api/users/${user.id}`, { method: 'PATCH', body: JSON.stringify(userData) })
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Wczytaj użytkownika z localStorage (placeholder dla prawdziwego API)
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Zapisz użytkownika do localStorage przy każdej zmianie (TODO: zastąp prawdziwym API)
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // TODO: Wywołaj API backendu
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // const data = await response.json();
    
    // Symulacja logowania (placeholder)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Sprawdź czy użytkownik istnieje w localStorage (dla testów)
    const savedUsers = localStorage.getItem('registeredUsers');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('Nieprawidłowy email lub hasło');
    }

    const loggedInUser: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      bio: foundUser.bio,
      field: foundUser.field,
      location: foundUser.location,
      website: foundUser.website,
      avatar: foundUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${foundUser.name}`,
      createdAt: foundUser.createdAt,
    };

    setUser(loggedInUser);
  };

  const register = async (email: string, password: string, name: string) => {
    // TODO: Wywołaj API backendu
    // const response = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password, name })
    // });
    // const data = await response.json();
    
    // Symulacja rejestracji (placeholder)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Sprawdź czy użytkownik już istnieje
    const savedUsers = localStorage.getItem('registeredUsers');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    if (users.some((u: any) => u.email === email)) {
      throw new Error('Użytkownik o tym adresie email już istnieje');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password, // W prawdziwej aplikacji hasło powinno być zahashowane
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    const registeredUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      createdAt: newUser.createdAt,
    };

    setUser(registeredUser);
  };

  const logout = () => {
    // TODO: Wywołaj API backendu
    // await fetch('/api/auth/logout', { method: 'POST' });
    
    // Wyczyść dane sesji
    setUser(null);
    localStorage.removeItem('currentUser');
    
    // Wyczyść również powiadomienia i inne dane użytkownika
    // (NotificationContext i inne konteksty powinny to obsłużyć automatycznie)
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Zaktualizuj również w localStorage (dla testów)
      const savedUsers = localStorage.getItem('registeredUsers');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...userData };
          localStorage.setItem('registeredUsers', JSON.stringify(users));
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      register, 
      logout,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

