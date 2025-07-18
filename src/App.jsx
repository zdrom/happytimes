import React, { useState, useEffect } from 'react';
import ArticleList from './components/ArticleList';
import CategoryFilter from './components/CategoryFilter';
import PreferencesButton from './components/PreferencesButton';
import PreferencesModal from './components/PreferencesModal';
import { fetchArticles, formatArticle } from './services/nytimes';
import { filterHappyArticlesWithAI } from './services/openaiSentiment';
import { articleCache } from './services/articleCache';
import { newArticleTracker } from './services/newArticleTracker';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiProgress, setAiProgress] = useState({ current: 0, total: 0, cached: 0, uncached: 0, processing: false });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [showPreferences, setShowPreferences] = useState(false);
  
  // API Keys from localStorage
  const [nytApiKey, setNytApiKey] = useState(() => localStorage.getItem('happytimes-nyt-key') || '');
  const [openaiApiKey, setOpenaiApiKey] = useState(() => localStorage.getItem('happytimes-openai-key') || '');
  const [hasValidKeys, setHasValidKeys] = useState(false);

  useEffect(() => {
    setHasValidKeys(!!nytApiKey && !!openaiApiKey);
  }, [nytApiKey, openaiApiKey]);

  const loadArticlesWithKeys = async (nytKey, openaiKey) => {
    if (!nytKey || !openaiKey) {
      setError('Please configure your API keys in preferences');
      return;
    }

    setLoading(true);
    setError(null);
    setAiProgress({ current: 0, total: 0, cached: 0, uncached: 0, processing: false });
    
    try {
      const rawArticles = await fetchArticles(nytKey);
      const formattedArticles = rawArticles.map(formatArticle);
      
      // Count cached vs uncached articles
      let cachedCount = 0;
      let uncachedCount = 0;
      formattedArticles.forEach(article => {
        if (articleCache.has(article)) {
          cachedCount++;
        } else {
          uncachedCount++;
        }
      });
      
      setAiProgress({ 
        current: 0, 
        total: formattedArticles.length, 
        cached: cachedCount,
        uncached: uncachedCount,
        processing: uncachedCount > 0
      });
      
      // Use progressive AI-powered sentiment analysis with real-time updates
      await filterHappyArticlesWithAI(
        formattedArticles,
        openaiKey,
        (current, total, progressiveArticles) => {
          // Update progress
          setAiProgress({ 
            current, 
            total, 
            cached: cachedCount,
            uncached: uncachedCount,
            processing: current < total
          });
          
          // Update articles in real-time as they become available
          if (progressiveArticles && progressiveArticles.length > 0) {
            const processedArticles = newArticleTracker.processArticles(progressiveArticles);
            setArticles(processedArticles);
          }
        }
      );
      
    } catch (err) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
      setAiProgress({ current: 0, total: 0, cached: 0, uncached: 0, processing: false });
    }
  };

  const loadArticles = async () => {
    return loadArticlesWithKeys(nytApiKey, openaiApiKey);
  };

  const handleSaveKeys = (nytKey, openaiKey) => {
    localStorage.setItem('happytimes-nyt-key', nytKey);
    localStorage.setItem('happytimes-openai-key', openaiKey);
    setNytApiKey(nytKey);
    setOpenaiApiKey(openaiKey);
    
    // Load articles immediately with the new keys (don't wait for state update)
    loadArticlesWithKeys(nytKey, openaiKey);
  };

  // Auto-load articles if API keys are available
  useEffect(() => {
    if (hasValidKeys && articles.length === 0) {
      loadArticles();
    }
  }, [hasValidKeys]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  // Filter articles by selected categories
  const filteredArticles = selectedCategories.length === 0 
    ? articles 
    : articles.filter(article => selectedCategories.includes(article.section));

  // Show preferences modal if no valid keys
  if (!hasValidKeys) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-happy-yellow to-happy-orange'}`}>
        <PreferencesButton 
          isDarkMode={isDarkMode} 
          onOpenPreferences={() => setShowPreferences(true)} 
        />
        <PreferencesModal
          isOpen={!hasValidKeys || showPreferences}
          onClose={() => setShowPreferences(false)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          nytApiKey={nytApiKey}
          openaiApiKey={openaiApiKey}
          onSaveKeys={handleSaveKeys}
        />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className={`rounded-lg shadow-xl p-8 max-w-md w-full ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="text-center mb-6">
              <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🌟 HappyTimes</h1>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Your source for uplifting news</p>
            </div>
            <div className="text-center">
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Please configure your API keys to get started
              </p>
              <button
                onClick={() => setShowPreferences(true)}
                className={`py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-happy-blue-dark to-happy-purple-dark hover:from-happy-purple-dark hover:to-happy-blue-dark text-white'
                    : 'bg-gradient-to-r from-happy-blue to-happy-purple hover:from-happy-purple hover:to-happy-blue text-white'
                }`}
              >
                ⚙️ Open Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-happy-yellow to-happy-orange'}`}>
      <PreferencesButton 
        isDarkMode={isDarkMode} 
        onOpenPreferences={() => setShowPreferences(true)} 
      />
      <PreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        nytApiKey={nytApiKey}
        openaiApiKey={openaiApiKey}
        onSaveKeys={handleSaveKeys}
      />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🌟 HappyTimes</h1>
        </header>

        <main>
          <CategoryFilter 
            articles={articles}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            isDarkMode={isDarkMode}
          />
          
          {loading && aiProgress.total > 0 && aiProgress.uncached > 0 && (
            <div className={`rounded-lg shadow-md p-4 mb-4 text-center ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                🤖 AI scanning {aiProgress.uncached} new articles...
                {aiProgress.cached > 0 && (
                  <span className={`ml-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    ({aiProgress.cached} loaded instantly from cache)
                  </span>
                )}
              </div>
              <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-happy-blue-dark to-happy-purple-dark'
                      : 'bg-gradient-to-r from-happy-blue to-happy-purple'
                  }`}
                  style={{ width: `${(aiProgress.current / aiProgress.total) * 100}%` }}
                ></div>
              </div>
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {aiProgress.current} of {aiProgress.total} articles processed
              </div>
            </div>
          )}
          
          {loading && aiProgress.total > 0 && aiProgress.uncached === 0 && (
            <div className={`border rounded-lg p-4 mb-4 text-center ${
              isDarkMode 
                ? 'bg-green-900 border-green-700' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                💾 All articles loaded from cache - instant results!
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                {aiProgress.cached} articles loaded instantly (no AI analysis needed)
              </div>
            </div>
          )}
          <ArticleList articles={filteredArticles} loading={loading} error={error} isDarkMode={isDarkMode} />
        </main>
        
        <footer className={`text-center mt-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>Powered by The New York Times API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;