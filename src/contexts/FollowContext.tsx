import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Interfejs dla autora/uzytkownika
export interface Author {
  id: string;
  name: string;
  field: string;
  avatar: string;
}

interface FollowContextType {
  following: Author[];
  isFollowing: (authorId: string) => boolean;
  followAuthor: (author: Author) => void;
  unfollowAuthor: (authorId: string) => void;
  toggleFollow: (author: Author) => void;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

/**
 * Kontekst do zarządzania obserwowanymi autorami
 * TODO: Zastąp localStorage prawdziwym API backendu
 * Przykład: 
 * - followAuthor: await fetch(`/api/users/${userId}/follow/${authorId}`, { method: 'POST' })
 * - unfollowAuthor: await fetch(`/api/users/${userId}/follow/${authorId}`, { method: 'DELETE' })
 * - following: const response = await fetch(`/api/users/${userId}/following`)
 */
export function FollowProvider({ children }: { children: ReactNode }) {
  const [following, setFollowing] = useState<Author[]>(() => {
    // Wczytaj z localStorage (placeholder dla prawdziwego API)
    const saved = localStorage.getItem('followingAuthors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Domyślni obserwowani autorzy
    return [
      { id: 'elena-rodriguez', name: 'Dr. Elena Rodriguez', field: 'Quantum Physics', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
      { id: 'james-chen', name: 'Prof. James Chen', field: 'Machine Learning', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
      { id: 'maya-thompson', name: 'Dr. Maya Thompson', field: 'Biotechnology', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya' },
    ];
  });

  // Zapisz do localStorage przy każdej zmianie (TODO: zastąp prawdziwym API)
  useEffect(() => {
    localStorage.setItem('followingAuthors', JSON.stringify(following));
  }, [following]);

  const isFollowing = (authorId: string): boolean => {
    return following.some(author => author.id === authorId);
  };

  const followAuthor = (author: Author) => {
    if (!isFollowing(author.id)) {
      // TODO: Wywołaj API backendu
      // await fetch(`/api/users/${userId}/follow/${author.id}`, { method: 'POST' });
      
      setFollowing(prev => [...prev, author]);
    }
  };

  const unfollowAuthor = (authorId: string) => {
    // TODO: Wywołaj API backendu
    // await fetch(`/api/users/${userId}/follow/${authorId}`, { method: 'DELETE' });
    
    setFollowing(prev => prev.filter(author => author.id !== authorId));
  };

  const toggleFollow = (author: Author) => {
    if (isFollowing(author.id)) {
      unfollowAuthor(author.id);
    } else {
      followAuthor(author);
    }
  };

  return (
    <FollowContext.Provider value={{ following, isFollowing, followAuthor, unfollowAuthor, toggleFollow }}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error('useFollow must be used within FollowProvider');
  }
  return context;
}
