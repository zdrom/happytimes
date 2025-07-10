import React, { useState, useEffect } from 'react';
import ArticleList from './components/ArticleList';
import { fetchArticles, formatArticle } from './services/nytimes';
import { filterHappyArticles } from './services/sentiment';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);

  const loadArticles = async (key) => {
    setLoading(true);
    setError(null);
    
    try {
      const rawArticles = await fetchArticles(key);
      const formattedArticles = rawArticles.map(formatArticle);
      const happyArticles = filterHappyArticles(formattedArticles);
      
      setArticles(happyArticles);
      
      if (happyArticles.length === 0) {
        setError('No happy articles found. Try refreshing for new content!');
      }
    } catch (err) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setShowApiInput(false);
      loadArticles(apiKey);
    }
  };

  const handleRefresh = () => {
    if (apiKey) {
      loadArticles(apiKey);
    }
  };

  if (showApiInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-happy-yellow to-happy-orange flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🌟 HappyTimes</h1>
            <p className="text-gray-600">Your source for uplifting news</p>
          </div>
          
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NYTimes API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your NYTimes API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-happy-blue focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-happy-blue to-happy-purple text-white py-2 px-4 rounded-md hover:from-happy-purple hover:to-happy-blue transition-all duration-200 font-medium"
            >
              Get Happy News
            </button>
          </form>
          
          <div className="mt-6 text-xs text-gray-500">
            <p>Need an API key? Get one from the <a href="https://developer.nytimes.com/get-started" target="_blank" rel="noopener noreferrer" className="text-happy-blue hover:underline">NYTimes Developer Portal</a></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-happy-yellow to-happy-orange">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🌟 HappyTimes</h1>
          <p className="text-gray-700">Uplifting news from The New York Times</p>
          <div className="mt-2 text-sm text-gray-600">
            <p>Showing English articles with positive sentiment score (&gt;0) and no negative keywords</p>
          </div>
          
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              <svg className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            
            <button
              onClick={() => setShowApiInput(true)}
              className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Change API Key
            </button>
          </div>
        </header>

        <main>
          <ArticleList articles={articles} loading={loading} error={error} />
        </main>
        
        <footer className="text-center mt-8 text-gray-600 text-sm">
          <p>Powered by The New York Times API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;