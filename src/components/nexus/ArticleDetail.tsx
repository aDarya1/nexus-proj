import { ArrowLeft, Heart, Bookmark, Share2, ExternalLink, Send, Download, Check, Loader2, UserPlus, UserMinus } from 'lucide-react';
import { useState } from 'react';
import { Article } from '../../App';
import { downloadArticleAsPDF } from '../../utils/downloadArticle';
import { useFollow, Author } from '../../contexts/FollowContext';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  onDownload: (article: Article) => void;
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export function ArticleDetail({ article, onBack, onDownload }: ArticleDetailProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likes);
  const [commentText, setCommentText] = useState('');
  const [downloadState, setDownloadState] = useState<'default' | 'downloading' | 'downloaded'>(
    article.isDownloaded ? 'downloaded' : 'default'
  );
  const { isFollowing, toggleFollow } = useFollow();

  // Utwórz obiekt autora z danych artykułu
  const mainAuthor: Author = {
    id: article.authors[0].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    name: article.authors[0],
    field: article.tags[0]?.replace('#', '') || 'Research',
    avatar: article.authorAvatar,
  };

  const authorIsFollowed = isFollowing(mainAuthor.id);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'Dr. Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      text: 'Fascinating research! The implications for quantum computing are enormous. Have you considered applying this to photonic quantum processors?',
      time: '3 hours ago',
      likes: 24,
    },
    {
      id: 2,
      author: 'Prof. Michael Zhang',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      text: 'Excellent methodology. I would love to see how this scales with larger datasets. Are you planning follow-up experiments?',
      time: '5 hours ago',
      likes: 18,
    },
  ]);

  const handlePostComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: comments.length + 1,
        author: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
        text: commentText,
        time: 'Just now',
        likes: 0,
      };
      setComments([newComment, ...comments]);
      setCommentText('');
    }
  };

  const handleDownload = async () => {
    if (downloadState !== 'default') return;
    
    setDownloadState('downloading');
    
    try {
      // Pobierz artykuł jako PDF
      await downloadArticleAsPDF(article);
      
      // Symulacja dodatkowego opóźnienia dla lepszego UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setDownloadState('downloaded');
      onDownload(article);
    } catch (error) {
      console.error('Błąd podczas pobierania:', error);
      setDownloadState('default');
      // TODO: Pokaż komunikat błędu użytkownikowi (np. przez toast)
      alert(error instanceof Error ? error.message : 'Nie udało się pobrać artykułu. Spróbuj ponownie.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-[#00eeff] mb-6 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to feed</span>
      </button>

      {/* Article Header */}
      <div className="bg-[#1e1e2e] rounded-lg border border-gray-800 p-8 mb-6">
        {/* Preview Image */}
        {article.imageUrl && (
          <div className="mb-6 -mx-8 -mt-8 overflow-hidden rounded-t-lg">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-80 object-cover"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={article.authorAvatar}
              alt={article.authors[0]}
              className="w-14 h-14 rounded-full border-2 border-[#00eeff]/30"
            />
            <div>
              <p className="font-medium text-white">
                {article.authors.join(', ')}
              </p>
              <p className="text-sm text-gray-500">{article.time}</p>
            </div>
          </div>
          <button
            onClick={() => toggleFollow(mainAuthor)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              authorIsFollowed
                ? 'bg-[#121212] border border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-500'
                : 'bg-[#00eeff]/20 border border-[#00eeff] text-[#00eeff] hover:bg-[#00eeff]/30'
            }`}
          >
            {authorIsFollowed ? (
              <>
                <UserMinus className="w-4 h-4" />
                <span className="text-sm font-medium">Przestań obserwować</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span className="text-sm font-medium">Obserwuj autora</span>
              </>
            )}
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-[#121212] border border-[#39ff14]/30 text-[#39ff14] text-sm font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Abstract */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Abstract</h3>
          <p className="text-gray-400 leading-relaxed">
            {article.abstract}
          </p>
        </div>

        {/* DOI */}
        <a
          href={`https://doi.org/${article.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#5d8aa8] hover:text-[#00eeff] font-medium group"
        >
          <span>DOI: {article.doi}</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLiked(!liked);
                setLikesCount(liked ? likesCount - 1 : likesCount + 1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                liked
                  ? 'bg-[#ff00ff]/20 text-[#ff00ff] shadow-[0_0_15px_rgba(255,0,255,0.3)]'
                  : 'text-gray-400 hover:bg-[#121212] hover:text-[#ff00ff]'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likesCount}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved(!saved)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                saved
                  ? 'bg-[#39ff14]/20 text-[#39ff14] shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                  : 'text-gray-400 hover:bg-[#121212] hover:text-[#39ff14]'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
              <span className="font-medium">Save</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={downloadState === 'downloading'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                downloadState === 'downloaded'
                  ? 'bg-[#39ff14]/20 text-[#39ff14] shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                  : downloadState === 'downloading'
                  ? 'bg-[#00eeff]/20 text-[#00eeff] cursor-wait'
                  : 'text-gray-400 hover:bg-[#121212] hover:text-[#00eeff] hover:shadow-[0_0_15px_rgba(0,238,255,0.2)]'
              }`}
            >
              {downloadState === 'downloading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#00eeff] border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium">DOWNLOADING...</span>
                </>
              ) : downloadState === 'downloaded' ? (
                <>
                  <Check className="w-5 h-5" />
                  <span className="font-medium">DOWNLOADED</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span className="font-medium">DOWNLOAD</span>
                </>
              )}
            </button>

            <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:bg-[#121212] hover:text-[#00eeff] rounded-lg transition-all">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-[#1e1e2e] rounded-lg border border-gray-800 p-8">
        <h3 className="text-xl font-bold text-white mb-6">
          Discussion ({comments.length})
        </h3>

        {/* Add Comment */}
        <div className="mb-8">
          <div className="flex gap-4">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=You"
              alt="You"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full px-4 py-3 bg-[#121212] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00eeff] focus:shadow-[0_0_15px_rgba(0,238,255,0.2)] transition-all text-white placeholder-gray-500 resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handlePostComment}
                  disabled={!commentText.trim()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    commentText.trim()
                      ? 'bg-gradient-to-r from-[#00eeff] to-[#5d8aa8] text-[#121212] font-semibold hover:shadow-[0_0_20px_rgba(0,238,255,0.4)]'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>POST</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="bg-[#121212] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{comment.author}</h4>
                    <span className="text-xs text-gray-500">{comment.time}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {comment.text}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2 ml-4">
                  <button className="text-xs text-gray-500 hover:text-[#ff00ff] transition-colors">
                    <Heart className="w-3 h-3 inline mr-1" />
                    {comment.likes}
                  </button>
                  <button className="text-xs text-gray-500 hover:text-[#00eeff] transition-colors">
                    REPLY
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}