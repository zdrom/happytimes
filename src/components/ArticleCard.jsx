import React from 'react';

const ArticleCard = ({ article }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getSentimentColor = (score) => {
    if (score >= 9) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 8) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getSentimentLabel = (score) => {
    if (score >= 9) return 'Very Uplifting';
    if (score >= 8) return 'Uplifting';
    if (score >= 7) return 'Positive';
    return 'Happy';
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-happy-green hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex flex-col space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {article.section}
            </span>
            <div className="flex items-center space-x-1">
              {article.isNew && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                  ✨ NEW
                </span>
              )}
              {article.aiSentiment && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(article.aiSentiment.score)}`}>
                  {article.aiSentiment.cached ? '💾' : '🤖'} {getSentimentLabel(article.aiSentiment.score)} ({article.aiSentiment.score}/10)
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-gray-400">
            {formatDate(article.publishedDate)}
          </span>
        </div>
        
        <div className="flex items-start space-x-3">
          {article.thumbnail && (
            <div className="flex-shrink-0">
              <img 
                src={article.thumbnail} 
                alt={article.headline}
                className="rounded-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">
              {article.headline}
            </h2>
          </div>
        </div>
        
        {article.abstract && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {article.abstract}
          </p>
        )}
        
        {article.byline && (
          <p className="text-xs text-gray-500 italic">
            {article.byline}
          </p>
        )}
        
        <div className="pt-2">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-happy-blue to-happy-purple hover:from-happy-purple hover:to-happy-blue rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Read Full Article
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;