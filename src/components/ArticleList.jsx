import React from 'react';
import ArticleCard from './ArticleCard';
import NewArticlesDivider from './NewArticlesDivider';
import { newArticleTracker } from '../services/newArticleTracker';

const ArticleList = ({ articles, loading, error, isDarkMode }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className={`rounded-lg shadow-md p-4 mb-4 animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-3">
              <div className={`h-3 rounded w-16 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-3 rounded w-12 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`h-6 rounded w-3/4 mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 rounded w-full mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 rounded w-5/6 mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-8 rounded w-32 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`border rounded-lg p-4 text-center ${
        isDarkMode 
          ? 'bg-red-900 border-red-700' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className={`font-medium mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>Oops! Something went wrong</div>
        <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className={`border rounded-lg p-8 text-center ${
        isDarkMode 
          ? 'bg-yellow-900 border-yellow-700' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="text-6xl mb-4">🌟</div>
        <div className={`font-medium mb-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>No happy news right now</div>
        <p className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
          Try refreshing to get the latest positive stories!
        </p>
      </div>
    );
  }

  const dividerIndex = newArticleTracker.getDividerIndex(articles);
  const newArticlesCount = articles.filter(article => article.isNew).length;

  return (
    <div className="space-y-4">
      {newArticlesCount > 0 && (
        <div className={`border rounded-lg p-3 text-center ${
          isDarkMode 
            ? 'bg-green-900 border-green-700' 
            : 'bg-green-50 border-green-200'
        }`}>
          <span className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
            ✨ {newArticlesCount} new article{newArticlesCount !== 1 ? 's' : ''} since your last visit!
          </span>
        </div>
      )}
      
      {articles.map((article, index) => (
        <React.Fragment key={article.id}>
          {index === dividerIndex && <NewArticlesDivider isDarkMode={isDarkMode} />}
          <ArticleCard article={article} isDarkMode={isDarkMode} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ArticleList;