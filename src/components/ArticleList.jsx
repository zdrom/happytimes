import React from 'react';
import ArticleCard from './ArticleCard';
import NewArticlesDivider from './NewArticlesDivider';
import { newArticleTracker } from '../services/newArticleTracker';

const ArticleList = ({ articles, loading, error }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4 animate-pulse">
            <div className="flex justify-between items-center mb-3">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-red-600 font-medium mb-2">Oops! Something went wrong</div>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🌟</div>
        <div className="text-yellow-700 font-medium mb-2">No happy news right now</div>
        <p className="text-yellow-600 text-sm">
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <span className="text-green-700 font-medium">
            ✨ {newArticlesCount} new article{newArticlesCount !== 1 ? 's' : ''} since your last visit!
          </span>
        </div>
      )}
      
      {articles.map((article, index) => (
        <React.Fragment key={article.id}>
          {index === dividerIndex && <NewArticlesDivider />}
          <ArticleCard article={article} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ArticleList;