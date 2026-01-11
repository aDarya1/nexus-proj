import { useState, useEffect } from 'react';
import { Screen, Article } from '../../App';
import { HomeFeed } from './HomeFeed';
import { SearchResults } from './SearchResults';
import { SavedArticlesLibrary } from './SavedArticlesLibrary';
import { TopicGroups } from './TopicGroups';
import { ConferenceCalendar } from './ConferenceCalendar';
import { CollaboratorSearch } from './CollaboratorSearch';
import { LibraryDownloads } from './LibraryDownloads';
import { UserProfile } from './UserProfile';
import { ArticleDetail } from './ArticleDetail';
import { MobileHeader } from './MobileHeader';
import { MobileSidebar } from './MobileSidebar';
import { Footer } from './Footer';
import { PublishModal } from './PublishModal';

interface MobileAppProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
  newArticles: Article[];
  setNewArticles: (articles: Article[]) => void;
  downloadedArticles: Article[];
  setDownloadedArticles: (articles: Article[]) => void;
  showPublishModal: boolean;
  setShowPublishModal: (show: boolean) => void;
  handleSearch: (query: string) => void;
  handleDownload: (article: Article) => void;
  handleArticleClick: (article: Article) => void;
  handlePublish: (articleData: any) => void;
}

export function MobileApp({
  currentScreen,
  setCurrentScreen,
  searchQuery,
  selectedArticle,
  newArticles,
  downloadedArticles,
  showPublishModal,
  setShowPublishModal,
  handleSearch,
  handleDownload,
  handleArticleClick,
  handlePublish,
}: MobileAppProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg)' }}>
      <MobileHeader 
        onMenuClick={() => setShowMobileMenu(true)}
        onSearch={handleSearch}
      />
      
      <MobileSidebar
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />

      <main className="flex-1 pt-16 flex flex-col">
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
          <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
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

      <Footer />

      {showPublishModal && (
        <PublishModal
          onClose={() => setShowPublishModal(false)}
          onSubmit={handlePublish}
        />
      )}
    </div>
  );
}

