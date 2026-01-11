import { TrendingUp, Users, BarChart3 } from 'lucide-react';

export function RightSidebar() {
  const trendingTags = [
    { tag: '#MachineLearning', count: 1245 },
    { tag: '#Bioinformatics', count: 892 },
    { tag: '#QuantumComputing', count: 654 },
    { tag: '#ClimateScience', count: 523 },
    { tag: '#Neuroscience', count: 487 },
  ];

  const recommendedColleagues = [
    { name: 'Dr. Elena Petrova', field: 'Machine Learning', mutual: 12 },
    { name: 'Prof. James Chen', field: 'Computer Vision', mutual: 8 },
    { name: 'Dr. Maria Garcia', field: 'NLP', mutual: 15 },
  ];

  return (
    <div className="space-y-4 sticky top-24">
      {/* Stats Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Статистика</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">За неделю в вашей области:</span>
            <span className="font-semibold text-gray-900">120</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Ваши просмотры:</span>
            <span className="font-semibold text-gray-900">2,340</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Новые подписчики:</span>
            <span className="font-semibold text-green-600">+23</span>
          </div>
        </div>
      </div>

      {/* Trending Tags */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Трендовые теги</h3>
        </div>
        <div className="space-y-2">
          {trendingTags.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-md px-2 cursor-pointer transition-colors"
            >
              <span className="text-sm font-medium text-blue-600">{item.tag}</span>
              <span className="text-xs text-gray-500">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Colleagues */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Рекомендуемые коллеги</h3>
        </div>
        <div className="space-y-3">
          {recommendedColleagues.map((colleague, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {colleague.name}
                </h4>
                <p className="text-xs text-gray-500 truncate">{colleague.field}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {colleague.mutual} общих знакомых
                </p>
                <button className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700">
                  Подписаться
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
