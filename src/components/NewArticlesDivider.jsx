import React from 'react';

const NewArticlesDivider = () => {
  return (
    <div className="flex items-center my-6">
      <div className="flex-1 border-t border-gray-300"></div>
      <div className="px-4 py-2 bg-gray-100 rounded-full border border-gray-300">
        <span className="text-sm font-medium text-gray-600">
          📰 Previously seen articles
        </span>
      </div>
      <div className="flex-1 border-t border-gray-300"></div>
    </div>
  );
};

export default NewArticlesDivider;