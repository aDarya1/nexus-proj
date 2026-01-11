import { Heart, MessageCircle, Bookmark, Share2, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Article {
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
}

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likes);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Author Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={article.authorAvatar}
            alt={article.authors[0]}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {article.authors[0]}
              {article.authors.length > 1 && (
                <span className="text-gray-500 font-normal">
                  {' '}и {article.authors.length - 1} др.
                </span>
              )}
            </h4>
            <p className="text-xs text-gray-500">{article.time}</p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-4">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2 leading-snug hover:text-blue-600 cursor-pointer transition-colors">
          {article.title}
        </h2>

        {/* Authors */}
        <p className="text-sm text-gray-600 mb-2">
          {article.authors.join(', ')}
        </p>

        {/* Abstract */}
        <p className="text-sm text-gray-700 line-clamp-3 mb-3">
          {article.abstract}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-100 cursor-pointer transition-colors"
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
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium group"
        >
          <span>DOI: {article.doi}</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                liked
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${liked ? 'fill-current' : ''}`}
              />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{article.comments}</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-lg transition-all ${
                saved
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Сохранить"
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </button>

            <button
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Поделиться"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
