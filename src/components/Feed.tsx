import { ArticleCard } from './ArticleCard';

export function Feed() {
  const articles = [
    {
      id: 1,
      title: 'Attention Is All You Need: A Comprehensive Analysis of Transformer Architecture',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'et al.'],
      abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms...',
      tags: ['#MachineLearning', '#DeepLearning', '#NLP', '#Transformers'],
      doi: '10.48550/arXiv.1706.03762',
      likes: 342,
      comments: 87,
      saves: 156,
      time: '2 часа назад',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vaswani',
    },
    {
      id: 2,
      title: 'Deep Residual Learning for Image Recognition',
      authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
      abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions...',
      tags: ['#ComputerVision', '#DeepLearning', '#ResNet', '#ImageRecognition'],
      doi: '10.1109/CVPR.2016.90',
      likes: 523,
      comments: 134,
      saves: 289,
      time: '5 часов назад',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=He',
    },
    {
      id: 3,
      title: 'CRISPR-Cas9: A Revolutionary Gene Editing Tool for Therapeutic Applications',
      authors: ['Jennifer Doudna', 'Emmanuelle Charpentier'],
      abstract: 'The CRISPR-Cas9 system has emerged as a powerful tool for genome editing. This review discusses the mechanism of CRISPR-Cas9, its applications in treating genetic disorders, and the ethical considerations surrounding its use in human germline editing...',
      tags: ['#Bioinformatics', '#GeneEditing', '#CRISPR', '#Biotechnology'],
      doi: '10.1126/science.1258096',
      likes: 678,
      comments: 203,
      saves: 421,
      time: '1 день назад',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Doudna',
    },
    {
      id: 4,
      title: 'Quantum Machine Learning: Bridging Quantum Computing and AI',
      authors: ['Peter Wittek', 'Maria Schuld', 'Francesco Petruccione'],
      abstract: 'We explore the intersection of quantum computing and machine learning, examining how quantum algorithms can potentially accelerate certain ML tasks. This paper presents a comprehensive overview of quantum ML algorithms and their theoretical advantages over classical counterparts...',
      tags: ['#QuantumComputing', '#MachineLearning', '#QuantumAlgorithms'],
      doi: '10.1038/s41586-019-0980-2',
      likes: 412,
      comments: 96,
      saves: 267,
      time: '2 дня назад',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wittek',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Create Post Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <textarea
          placeholder="Поделитесь своими научными открытиями..."
          className="w-full resize-none border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              Статья
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              Препринт
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              Обсуждение
            </button>
          </div>
          <button className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Опубликовать
          </button>
        </div>
      </div>

      {/* Articles Feed */}
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
