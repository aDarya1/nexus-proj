import React, { useState, useEffect } from 'react';
import { Settings, MapPin, Link as LinkIcon, UserPlus, UserMinus, Check } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import { Article } from '../../App';
import { useFollow, Author } from '../../contexts/FollowContext';
import { EditProfileModal, UserProfileData } from './EditProfileModal';
import { useTheme } from './ThemeProvider';

interface UserProfileProps {
  onArticleClick: (article: Article) => void;
}

export function UserProfile({ onArticleClick }: UserProfileProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'publications' | 'saved' | 'following'>('publications');
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData>(() => {
    // Wczytaj zapisane dane profilu z localStorage
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          name: 'Dr. You',
          bio: 'Quantum Computing Researcher',
          field: 'Quantum Computing',
          location: 'Stanford, CA',
          website: 'research.stanford.edu/~you',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
        };
      }
    }
    return {
      name: 'Dr. You',
      bio: 'Quantum Computing Researcher',
      field: 'Quantum Computing',
      location: 'Stanford, CA',
      website: 'research.stanford.edu/~you',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
    };
  });

  const myPublications: Article[] = [
    {
      id: 201,
      title: 'Advanced Quantum Computing Architectures for Machine Learning',
      authors: ['You', 'Dr. Emily Chen'],
      abstract: 'We present novel quantum computing architectures optimized for machine learning workloads, achieving significant speedups in training deep neural networks.',
      tags: ['#QuantumComputing', '#MachineLearning', '#AI'],
      doi: '10.48550/arXiv.2024.11111',
      likes: 156,
      comments: 43,
      saves: 89,
      time: '2 weeks ago',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      imageUrl: 'https://images.unsplash.com/photo-1755455840466-85747052a634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFudHVtJTIwcGh5c2ljcyUyMHZpc3VhbGl6YXRpb258ZW58MXx8fHwxNzY3NzkxNjY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const savedArticles: Article[] = [
    {
      id: 1,
      title: 'Quantum Entanglement in Biological Systems: A New Paradigm',
      authors: ['Dr. Elena Rodriguez', 'Prof. Marcus Chen'],
      abstract: 'Recent discoveries suggest that quantum entanglement may play a crucial role in biological processes...',
      tags: ['#QuantumPhysics', '#Neuroscience', '#Biology'],
      doi: '10.48550/arXiv.2024.12345',
      likes: 342,
      comments: 87,
      saves: 156,
      time: '2 hours ago',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      isSaved: true,
      imageUrl: 'https://images.unsplash.com/photo-1755455840466-85747052a634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFudHVtJTIwcGh5c2ljcyUyMHZpc3VhbGl6YXRpb258ZW58MXx8fHwxNzY3NzkxNjY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const { following, isFollowing, toggleFollow } = useFollow();

  // Konwertuj dane obserwowanych autorów do formatu Author
  const followingAuthors: Author[] = following.map((author, index) => ({
    id: author.id || `author-${index}`,
    name: author.name,
    field: author.field,
    avatar: author.avatar,
  }));

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Profile Header */}
      <div className="bg-[#1e1e2e] rounded-lg border border-gray-800 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-6">
            <img
              src={profileData.avatar}
              alt="Profile"
              className="w-16 h-16 rounded-full border-4 border-[#00eeff]/30"
            />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{profileData.name}</h1>
              <p className="text-gray-400 mb-3">{profileData.bio}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                {profileData.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profileData.location}
                  </span>
                )}
                {profileData.website && (
                  <a
                    href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[#00eeff] transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {profileData.website}
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-gray-700 text-white rounded-lg hover:border-[#00eeff] hover:text-[#00eeff] transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>EDYTUJ PROFIL</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 pt-6 border-t border-gray-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#00eeff] mb-1">12</div>
            <div className="text-sm text-gray-400">Publications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#39ff14] mb-1">1.2K</div>
            <div className="text-sm text-gray-400">Citations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#ff00ff] mb-1">234</div>
            <div className="text-sm text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">89</div>
            <div className="text-sm text-gray-400">Following</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('publications')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'publications'
              ? 'bg-[#1e1e2e] border-2 border-[#00eeff] text-[#00eeff] shadow-[0_0_15px_rgba(0,238,255,0.2)]'
              : 'bg-[#1e1e2e] border-2 border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          MY PUBLICATIONS
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'saved'
              ? 'bg-[#1e1e2e] border-2 border-[#00eeff] text-[#00eeff] shadow-[0_0_15px_rgba(0,238,255,0.2)]'
              : 'bg-[#1e1e2e] border-2 border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          SAVED PAPERS
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'following'
              ? 'bg-[#1e1e2e] border-2 border-[#00eeff] text-[#00eeff] shadow-[0_0_15px_rgba(0,238,255,0.2)]'
              : 'bg-[#1e1e2e] border-2 border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          FOLLOWING
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'publications' && (
          <>
            {myPublications.map((article) => (
              <ArticleCard 
                key={article.id}
                article={article}
                onArticleClick={onArticleClick}
                onDownload={() => {}}
              />
            ))}
          </>
        )}

        {activeTab === 'saved' && (
          <>
            {savedArticles.map((article) => (
              <ArticleCard 
                key={article.id}
                article={article}
                onArticleClick={onArticleClick}
                onDownload={() => {}}
              />
            ))}
          </>
        )}

        {activeTab === 'following' && (
          <div className="bg-[#1e1e2e] rounded-lg border border-gray-800 p-6">
            {followingAuthors.length > 0 ? (
              <div className="space-y-4">
                {followingAuthors.map((author) => {
                  const following = isFollowing(author.id);
                  return (
                    <div key={author.id} className="flex items-center justify-between p-4 bg-[#121212] rounded-lg hover:bg-[#1a1a2a] transition-colors">
                      <div className="flex items-center gap-4">
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-8 h-8 rounded-full border-2 border-[#00eeff]/30"
                        />
                        <div>
                          <h4 className="font-medium text-white">{author.name}</h4>
                          <p className="text-sm text-gray-400">{author.field}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(author)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all border font-medium"
                        style={{
                          backgroundColor: following ? 'var(--bg)' : 'var(--bg)',
                          borderColor: following ? colors.like : colors.primary,
                          color: following ? colors.like : colors.primary
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = following 
                            ? `${colors.like}20` 
                            : `${colors.primary}20`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg)';
                        }}
                      >
                        {following ? (
                          <>
                            <UserMinus className="w-4 h-4" />
                            <span className="text-sm font-medium">Przestań obserwować</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span className="text-sm font-medium">Obserwuj</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nie obserwujesz jeszcze nikogo</h3>
                <p className="text-gray-400 mb-4">
                  Zacznij obserwować autorów, aby widzieć ich najnowsze publikacje
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={async (data: UserProfileData) => {
          // TODO: Zastąp tym prawdziwym wywołaniem API backendu
          // const response = await fetch(`/api/users/${userId}/profile`, {
          //   method: 'PUT',
          //   body: JSON.stringify(data),
          //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
          // });
          // if (!response.ok) throw new Error('Nie udało się zapisać profilu');
          
          // Symulacja zapisu (z opóźnieniem dla realizmu)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Formatuj website jeśli potrzebne
          const formattedData = {
            ...data,
            website: data.website && !data.website.startsWith('http') 
              ? `https://${data.website}` 
              : data.website
          };
          
          setProfileData(formattedData);
          
          // Zapisz do localStorage jako placeholder
          localStorage.setItem('userProfile', JSON.stringify(formattedData));
        }}
        initialData={profileData}
      />
    </div>
  );
}