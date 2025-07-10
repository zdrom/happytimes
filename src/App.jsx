import React, { useState, useEffect } from 'react';
import ArticleList from './components/ArticleList';
import CategoryFilter from './components/CategoryFilter';
import DarkModeToggle from './components/DarkModeToggle';
import AuthGate from './components/AuthGate';
import { fetchArticles, formatArticle } from './services/nytimes';
import { filterHappyArticlesWithAI } from './services/openaiSentiment';
import { articleCache } from './services/articleCache';
import { newArticleTracker } from './services/newArticleTracker';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_NYTIMES_API_KEY || '');
  const [showApiInput, setShowApiInput] = useState(!import.meta.env.VITE_NYTIMES_API_KEY);
  const [aiProgress, setAiProgress] = useState({ current: 0, total: 0, cached: 0 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('happytimes-auth') === 'true';
  });

  const loadArticles = async (key) => {
    setLoading(true);
    setError(null);
    setAiProgress({ current: 0, total: 0, cached: 0 });
    
    try {
      // Check if OpenAI API key is available
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        setError('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
        return;
      }

      const rawArticles = await fetchArticles(key);
      const formattedArticles = rawArticles.map(formatArticle);
      
      setAiProgress({ current: 0, total: formattedArticles.length, cached: 0 });
      
      // Count cached articles
      let cachedCount = 0;
      formattedArticles.forEach(article => {
        if (articleCache.has(article)) cachedCount++;
      });
      
      const uncachedCount = formattedArticles.length - cachedCount;
      
      // Use AI-powered sentiment analysis with progress tracking
      const happyArticles = await filterHappyArticlesWithAI(
        formattedArticles,
        (current, total) => {
          setAiProgress({ 
            current, 
            total, 
            cached: cachedCount,
            uncached: uncachedCount,
            processing: current < total
          });
        }
      );
      
      // Process articles to mark new ones and sort them
      const processedArticles = newArticleTracker.processArticles(happyArticles);
      
      setArticles(processedArticles);
      
      if (happyArticles.length === 0) {
        setError('No happy articles found. Try refreshing for new content!');
      }
    } catch (err) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
      setAiProgress({ current: 0, total: 0, cached: 0 });
    }
  };

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setShowApiInput(false);
      loadArticles(apiKey);
    }
  };

  // Auto-load articles if API key is available
  useEffect(() => {
    if (apiKey && !showApiInput) {
      loadArticles(apiKey);
    }
  }, []);

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

  // Show auth gate if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
        <AuthGate onAuthenticated={() => setIsAuthenticated(true)} isDarkMode={isDarkMode} />
      </>
    );
  }

  if (showApiInput) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-happy-yellow to-happy-orange'}`}>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
        <div className={`rounded-lg shadow-xl p-8 max-w-md w-full ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          <div className="text-center mb-6">
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🌟 HappyTimes</h1>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Your source for uplifting news</p>
          </div>
          
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                NYTimes API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your NYTimes API key"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-happy-blue-dark' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-happy-blue'
                }`}
                required
              />
            </div>
            
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-happy-blue-dark to-happy-purple-dark hover:from-happy-purple-dark hover:to-happy-blue-dark text-white'
                  : 'bg-gradient-to-r from-happy-blue to-happy-purple hover:from-happy-purple hover:to-happy-blue text-white'
              }`}
            >
              Get Happy News
            </button>
          </form>
          
          <div className={`mt-6 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>Need an API key? Get one from the <a href="https://developer.nytimes.com/get-started" target="_blank" rel="noopener noreferrer" className={`hover:underline ${isDarkMode ? 'text-happy-blue-dark' : 'text-happy-blue'}`}>NYTimes Developer Portal</a></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-happy-yellow to-happy-orange'}`}>
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
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
                🤖 AI is analyzing {aiProgress.uncached} new articles for positive sentiment...
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
                {aiProgress.current} of {aiProgress.total} articles analyzed
                {aiProgress.cached > 0 && (
                  <span className={`ml-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    • {aiProgress.cached} cached (instant loading!)
                  </span>
                )}
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