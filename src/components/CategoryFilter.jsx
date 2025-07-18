import React, { useState } from 'react';

const CategoryFilter = ({ articles, selectedCategories, onCategoryToggle, isDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get unique categories from articles (these are already filtered happy articles)
  const categories = [...new Set(articles.map(article => article.section).filter(Boolean))].sort();
  
  if (categories.length === 0) return null;

  const totalArticles = articles.length;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md p-4 mb-6 border`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} hover:opacity-80 transition-opacity`}
      >
        <span>📂 Filter by Category</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const isSelected = selectedCategories.includes(category);
          const articleCount = articles.filter(article => article.section === category).length;
          
          // Truncate long category names for mobile
          const displayCategory = category.length > 12 ? category.substring(0, 12) + '…' : category;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              title={category} // Show full name on hover
              className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap
                ${isSelected 
                  ? isDarkMode 
                    ? 'bg-happy-blue-dark text-white border-happy-blue-dark' 
                    : 'bg-happy-blue text-blue-800 border-blue-200'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }
              `}
            >
              <span className="truncate max-w-[80px] sm:max-w-none">
                {displayCategory}
              </span>
              <span className={`ml-1 flex-shrink-0 ${isSelected ? 'text-current' : isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                ({articleCount})
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {selectedCategories.length === 0 ? 'All categories shown' : `${selectedCategories.length} category(ies) selected`}
        </span>
        {selectedCategories.length > 0 && (
          <button
            onClick={() => selectedCategories.forEach(cat => onCategoryToggle(cat))}
            className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} underline`}
          >
            Clear all
          </button>
        )}
      </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;