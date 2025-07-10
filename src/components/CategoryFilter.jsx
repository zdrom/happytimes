import React from 'react';

const CategoryFilter = ({ articles, selectedCategories, onCategoryToggle, isDarkMode }) => {
  // Get unique categories from articles
  const categories = [...new Set(articles.map(article => article.section).filter(Boolean))].sort();
  
  if (categories.length === 0) return null;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md p-4 mb-6 border`}>
      <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
        📂 Filter by Category
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const isSelected = selectedCategories.includes(category);
          const articleCount = articles.filter(article => article.section === category).length;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
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
              {category}
              <span className={`ml-1 ${isSelected ? 'text-current' : isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
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
  );
};

export default CategoryFilter;