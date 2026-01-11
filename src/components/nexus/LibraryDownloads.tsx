import { Download } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import { Article } from '../../App';

interface LibraryDownloadsProps {
  downloadedArticles: Article[];
  onArticleClick: (article: Article) => void;
}

export function LibraryDownloads({ downloadedArticles, onArticleClick }: LibraryDownloadsProps) {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#00eeff]/20 rounded-lg">
          <Download className="w-6 h-6 text-[#00eeff]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Downloads</h1>
          <p className="text-gray-400">
            {downloadedArticles.length} article{downloadedArticles.length !== 1 ? 's' : ''} downloaded locally
          </p>
        </div>
      </div>

      {downloadedArticles.length > 0 ? (
        <div className="space-y-6">
          {downloadedArticles.map((article) => (
            <ArticleCard 
              key={article.id}
              article={article}
              onArticleClick={onArticleClick}
              onDownload={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#1e1e2e] rounded-lg border border-gray-800 p-12 text-center">
          <div className="inline-flex p-4 bg-[#121212] rounded-full mb-4">
            <Download className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No downloads yet</h3>
          <p className="text-gray-400">
            Articles you download will appear here for offline access
          </p>
        </div>
      )}
    </div>
  );
}
