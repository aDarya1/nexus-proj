import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/nexus/ThemeProvider';
import { FollowProvider } from './contexts/FollowContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Header } from './components/nexus/Header';
import { Sidebar } from './components/nexus/Sidebar';
import { HomeFeed } from './components/nexus/HomeFeed';
import { PublishModal } from './components/nexus/PublishModal';
import { ArticleDetail } from './components/nexus/ArticleDetail';
import { SearchResults } from './components/nexus/SearchResults';
import { UserProfile } from './components/nexus/UserProfile';
import { LibraryDownloads } from './components/nexus/LibraryDownloads';
import { SavedArticlesLibrary } from './components/nexus/SavedArticlesLibrary';
import { TopicGroups } from './components/nexus/TopicGroups';
import { ConferenceCalendar } from './components/nexus/ConferenceCalendar';
import { CollaboratorSearch } from './components/nexus/CollaboratorSearch';
import { Footer } from './components/nexus/Footer';
import { MobileApp } from './components/nexus/MobileApp';
import { useIsMobile } from './hooks/useDeviceType';

export type Screen = 'home' | 'search' | 'library' | 'notifications' | 'profile' | 'article-detail' | 'downloads' | 'groups' | 'calendar' | 'collaborators';

export interface Article {
  id: number;
  title: string;
  authors: string[];
  abstract: string;
  tags: string[];
  doi: string;
  likes: number;
  comments: number;
  saves: number;
  time: string;
  authorAvatar: string;
  isLiked?: boolean;
  isSaved?: boolean;
  imageUrl?: string;
  isDownloaded?: boolean;
  badge?: 'NEW' | 'TRENDING' | 'OPEN ACCESS';
  contentType?: 'PDF' | 'VIDEO' | 'DATASET';
  featured?: boolean;
  layout?: 'default' | 'compact' | 'featured';
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <FollowProvider>
            <AppContent />
          </FollowProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const isMobile = useIsMobile();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [newArticles, setNewArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadedArticles, setDownloadedArticles] = useState<Article[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDownload = async (article: Article) => {
    try {
      // Import funkcji pobierania
      const { downloadArticleAsPDF } = await import('./utils/downloadArticle');
      
      // Pobierz artykuł jako PDF
      await downloadArticleAsPDF(article);
      
      // Zaktualizuj stan
      const updatedArticle = { ...article, isDownloaded: true };
      // Sprawdź czy artykuł nie został już pobrany
      if (!downloadedArticles.find(a => a.id === article.id)) {
        setDownloadedArticles([updatedArticle, ...downloadedArticles]);
      }
      
      showToastMessage('Artykuł pobrany na urządzenie');
    } catch (error) {
      console.error('Błąd podczas pobierania:', error);
      showToastMessage(error instanceof Error ? error.message : 'Nie udało się pobrać artykułu');
    }
  };

  const handlePublish = (articleData: any) => {
    const newArticle: Article = {
      id: Date.now(),
      title: articleData.title,
      authors: [articleData.authors],
      abstract: articleData.abstract,
      tags: articleData.tags,
      doi: `10.48550/arXiv.${Date.now()}`,
      likes: 0,
      comments: 0,
      saves: 0,
      time: 'Just now',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      isLiked: false,
      isSaved: false,
    };
    setNewArticles([newArticle, ...newArticles]);
    setShowPublishModal(false);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setCurrentScreen('article-detail');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentScreen('search');
  };

  // Listen for search events from SearchResults component
  useEffect(() => {
    const handleSearchEvent = (event: CustomEvent) => {
      setSearchQuery(event.detail);
    };
    
    window.addEventListener('performSearch', handleSearchEvent as EventListener);
    
    return () => {
      window.removeEventListener('performSearch', handleSearchEvent as EventListener);
    };
  }, []);

  // Render different versions based on device type
  if (isMobile) {
    return (
      <MobileApp
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedArticle={selectedArticle}
        setSelectedArticle={setSelectedArticle}
        newArticles={newArticles}
        setNewArticles={setNewArticles}
        downloadedArticles={downloadedArticles}
        setDownloadedArticles={setDownloadedArticles}
        showPublishModal={showPublishModal}
        setShowPublishModal={setShowPublishModal}
        handleSearch={handleSearch}
        handleDownload={handleDownload}
        handleArticleClick={handleArticleClick}
        handlePublish={handlePublish}
      />
    );
  }

  // Desktop version - original layout
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg)' }}>
      <Header 
        onPublish={() => setShowPublishModal(true)}
        onSearch={handleSearch}
      />
      
      <div className="flex flex-1">
        <Sidebar 
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
        />
        
        <main className="flex-1 ml-64 pt-20 flex flex-col">
          {currentScreen === 'home' && (
            <HomeFeed 
              newArticles={newArticles}
              onArticleClick={handleArticleClick}
              onDownload={handleDownload}
            />
          )}
          
          {currentScreen === 'search' && (
            <SearchResults 
              searchQuery={searchQuery}
              onArticleClick={handleArticleClick}
              onDownload={handleDownload}
            />
          )}
          
          {currentScreen === 'library' && (
            <SavedArticlesLibrary 
              onArticleClick={handleArticleClick}
              onDownload={handleDownload}
            />
          )}
          
          {currentScreen === 'groups' && (
            <TopicGroups />
          )}
          
          {currentScreen === 'calendar' && (
            <ConferenceCalendar />
          )}
          
          {currentScreen === 'collaborators' && (
            <CollaboratorSearch />
          )}
          
          {currentScreen === 'downloads' && (
            <LibraryDownloads 
              downloadedArticles={downloadedArticles}
              onArticleClick={handleArticleClick}
            />
          )}
          
          {currentScreen === 'notifications' && (
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
              <p style={{ color: 'var(--text-secondary)' }}>You're all caught up!</p>
            </div>
          )}
          
          {currentScreen === 'profile' && (
            <UserProfile onArticleClick={handleArticleClick} />
          )}
          
          {currentScreen === 'article-detail' && selectedArticle && (
            <ArticleDetail 
              article={selectedArticle}
              onBack={() => setCurrentScreen('home')}
              onDownload={handleDownload}
            />
          )}
        </main>
      </div>

      <div className="ml-64">
        <Footer />
      </div>

      {showPublishModal && (
        <PublishModal
          onClose={() => setShowPublishModal(false)}
          onSubmit={handlePublish}
        />
      )}

      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow">
          {toastMessage}
        </div>
      )}
    </div>
  );
}