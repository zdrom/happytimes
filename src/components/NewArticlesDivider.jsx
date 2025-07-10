import React from 'react';

const NewArticlesDivider = ({ isDarkMode }) => {
  return (
    <div className="flex items-center my-6">
      <div className={`flex-1 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
      <div className={`px-4 py-2 rounded-full border ${
        isDarkMode 
          ? 'bg-gray-700 border-gray-600' 
          : 'bg-gray-100 border-gray-300'
      }`}>
        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          📰 Previously seen articles
        </span>
      </div>
      <div className={`flex-1 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
    </div>
  );
};

export default NewArticlesDivider;