import { Heart, MessageCircle, Bookmark, Share2, ExternalLink, Download, Check } from 'lucide-react';
import { useState } from 'react';
import { Article } from '../../App';
import { useTheme } from './ThemeProvider';

interface ArticleCardProps {
  article: Article;
  onArticleClick: (article: Article) => void;
  onDownload: (article: Article) => void;
}

export function ArticleCard({ article, onArticleClick, onDownload }: ArticleCardProps) {
  const { theme } = useTheme();
  const [liked, setLiked] = useState(article.isLiked || false);
  const [saved, setSaved] = useState(article.isSaved || false);
  const [likesCount, setLikesCount] = useState(article.likes);
  const [showCopied, setShowCopied] = useState(false);
  const [downloadState, setDownloadState] = useState<'default' | 'downloading' | 'downloaded'>(
    article.isDownloaded ? 'downloaded' : 'default'
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    // This would trigger search - handled by parent
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloadState === 'downloading') return;
    
    setDownloadState('downloading');
    try {
      await onDownload(article);
      setDownloadState('downloaded');
    } catch (error) {
      console.error('Błąd podczas pobierania:', error);
      setDownloadState('default');
    }
  };

  const getBadgeStyles = (badge?: string) => {
    switch (badge) {
      case 'NEW':
        return theme === 'light' 
          ? { backgroundColor: '#3B82F6', color: '#FFFFFF' }
          : { backgroundColor: '#60A5FA', color: '#0F172A' };
      case 'TRENDING':
        return theme === 'light'
          ? { backgroundColor: '#EC4899', color: '#FFFFFF' }
          : { backgroundColor: '#F472B6', color: '#0F172A' };
      case 'OPEN ACCESS':
        return theme === 'light'
          ? { backgroundColor: '#10B981', color: '#FFFFFF' }
          : { backgroundColor: '#34D399', color: '#0F172A' };
      default:
        return {};
    }
  };

  const getContentTypeIcon = (type?: string) => {
    switch (type) {
      case 'PDF':
        return '📄';
      case 'VIDEO':
        return '🎥';
      case 'DATASET':
        return '📊';
      default:
        return '📄';
    }
  };

  const tagStyles = theme === 'light'
    ? { backgroundColor: '#E0E7FF', color: '#4F46E5', borderColor: '#C7D2FE' }
    : { backgroundColor: '#3730A3', color: '#C7D2FE', borderColor: '#4F46E5' };

  // Compact layout (small image on left)
  if (article.layout === 'compact') {
    return (
      <article 
        className="rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: article.featured ? 'var(--primary)' : 'var(--border)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex gap-2 md:gap-4 p-3 md:p-4">
          {/* Small Image Left */}
          {article.imageUrl && (
            <div className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-lg relative" onClick={() => onArticleClick(article)}>
              <img
                src={article.imageUrl}
                alt={article.title}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              />
              {article.badge && (
                <div 
                  className="absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded shadow-lg"
                  style={getBadgeStyles(article.badge)}
                >
                  {article.badge}
                </div>
              )}
              {article.contentType && (
                <div className="absolute bottom-2 right-2 text-2xl drop-shadow-lg">
                  {getContentTypeIcon(article.contentType)}
                </div>
              )}
            </div>
          )}

          {/* Content Right */}
          <div className="flex-1 min-w-0" onClick={() => onArticleClick(article)}>
            <h2 
              className="text-base font-bold mb-2 leading-tight group-hover:line-clamp-none transition-colors line-clamp-2"
              style={{ color: isHovered ? 'var(--primary)' : 'var(--text-primary)' }}
            >
              {article.title}
            </h2>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              {article.authors[0]}
              {article.authors.length > 1 && ` and ${article.authors.length - 1} others`}
            </p>
            <p className="text-xs line-clamp-2 mb-2" style={{ color: theme === 'light' ? '#4B5563' : '#9CA3AF' }}>
              {article.abstract}
            </p>
            <div className="flex flex-wrap gap-1 mb-2">
              {article.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                  style={tagStyles}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" /> {likesCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> {article.comments}
              </span>
              <span>{article.time}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default & Featured layout
  return (
    <article 
      className="rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-lg"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: article.featured ? 'var(--primary)' : 'var(--border)',
        boxShadow: article.featured ? '0 0 0 2px var(--primary)' : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Author Info */}
      <div className="p-3 md:p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src={article.authorAvatar}
            alt={article.authors[0]}
            className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2"
            style={{ borderColor: 'var(--primary)' }}
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm md:text-base font-medium" style={{ color: 'var(--text-primary)' }}>
              {article.authors[0]}
              {article.authors.length > 1 && (
                <span className="font-normal text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {' '}and {article.authors.length - 1} others
                </span>
              )}
            </h4>
            <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>{article.time}</p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-3 md:p-6" onClick={() => onArticleClick(article)}>
        {/* Preview Image */}
        {article.imageUrl && (
          <div className="mb-3 md:mb-4 -mx-3 md:-mx-6 -mt-3 md:-mt-6 overflow-hidden relative">
            <img
              src={article.imageUrl}
              alt={article.title}
              className={`w-full h-32 md:h-48 object-cover transition-transform duration-300 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Badges on Image */}
            {article.badge && (
              <div 
                className="absolute top-4 left-4 px-3 py-1.5 text-sm font-bold rounded-lg shadow-lg"
                style={getBadgeStyles(article.badge)}
              >
                {article.badge}
              </div>
            )}
            {article.contentType && (
              <div 
                className="absolute bottom-4 right-4 px-3 py-1.5 backdrop-blur-sm text-sm font-medium rounded-lg flex items-center gap-2"
                style={{
                  backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
                  color: 'var(--text-primary)'
                }}
              >
                <span className="text-lg">{getContentTypeIcon(article.contentType)}</span>
                {article.contentType}
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <h2 
          className="text-base md:text-xl font-bold mb-2 md:mb-3 leading-tight transition-colors"
          style={{ color: isHovered ? 'var(--primary)' : 'var(--text-primary)' }}
        >
          {article.title}
        </h2>

        {/* Abstract */}
        <p className="text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-3" style={{ color: theme === 'light' ? '#4B5563' : '#9CA3AF' }}>
          {article.abstract}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
          {article.tags.map((tag, index) => (
            <span
              key={index}
              onClick={(e) => handleTagClick(e, tag)}
              className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 text-xs font-medium rounded-full transition-all cursor-pointer hover:opacity-80"
              style={tagStyles}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* DOI Link */}
        <a
          href={`https://doi.org/${article.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 text-sm font-medium group/link"
          style={{ color: 'var(--primary)' }}
        >
          <span>DOI: {article.doi}</span>
          <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Actions */}
      <div className="px-3 md:px-6 py-2 md:py-4 border-t" style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg transition-all duration-200 ${
                liked ? 'shadow-md' : ''
              }`}
              style={{
                backgroundColor: liked ? (theme === 'light' ? '#FEE2E2' : 'rgba(252, 165, 165, 0.2)') : 'transparent',
                color: liked ? 'var(--like)' : 'var(--text-secondary)',
              }}
            >
              <Heart className={`w-4 h-4 md:w-5 md:h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="text-xs md:text-sm font-medium">{likesCount}</span>
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onArticleClick(article);
              }}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg transition-all hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium">{article.comments}</span>
            </button>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={handleSave}
              className={`p-1.5 md:p-2 rounded-lg transition-all duration-200 ${saved ? 'shadow-md' : ''}`}
              style={{
                backgroundColor: saved ? (theme === 'light' ? '#D1FAE5' : 'rgba(52, 211, 153, 0.2)') : 'transparent',
                color: saved ? 'var(--save)' : 'var(--text-secondary)',
              }}
              title="Save"
            >
              <Bookmark className={`w-4 h-4 md:w-5 md:h-5 ${saved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleDownload}
              disabled={downloadState === 'downloading'}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-all duration-200 ${
                downloadState === 'downloaded' ? 'shadow-md' : ''
              }`}
              style={{
                backgroundColor: 
                  downloadState === 'downloaded' 
                    ? (theme === 'light' ? '#D1FAE5' : 'rgba(52, 211, 153, 0.2)')
                    : downloadState === 'downloading'
                    ? (theme === 'light' ? '#DBEAFE' : 'rgba(96, 165, 250, 0.2)')
                    : 'transparent',
                color: 
                  downloadState === 'downloaded'
                    ? 'var(--save)'
                    : downloadState === 'downloading'
                    ? 'var(--download)'
                    : 'var(--text-secondary)',
                cursor: downloadState === 'downloading' ? 'wait' : 'pointer',
              }}
              title="Download"
            >
              {downloadState === 'downloading' ? (
                <>
                  <div className="w-3 h-3 md:w-4 md:h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--download)', borderTopColor: 'transparent' }} />
                  <span className="text-xs font-medium hidden sm:inline">DOWNLOADING...</span>
                </>
              ) : downloadState === 'downloaded' ? (
                <>
                  <Check className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs font-medium hidden sm:inline">DOWNLOADED</span>
                </>
              ) : (
                <>
                  <Download className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs font-medium hidden sm:inline">DOWNLOAD</span>
                </>
              )}
            </button>

            <div className="relative">
              <button
                onClick={handleShare}
                className="p-1.5 md:p-2 rounded-lg transition-all hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
                title="Share"
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              {showCopied && (
                <div 
                  className="absolute bottom-full right-0 mb-2 px-3 py-1 text-xs font-medium rounded shadow-lg animate-fade-in"
                  style={{ backgroundColor: 'var(--save)', color: 'white' }}
                >
                  Link copied!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
