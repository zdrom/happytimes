import React, { useState } from 'react';

const PreferencesModal = ({ isOpen, onClose, isDarkMode, onToggleDarkMode, nytApiKey, openaiApiKey, onSaveKeys }) => {
  const [tempNytKey, setTempNytKey] = useState(nytApiKey);
  const [tempOpenaiKey, setTempOpenaiKey] = useState(openaiApiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKeys(tempNytKey, tempOpenaiKey);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className={`w-full max-w-md rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ⚙️ Preferences
            </h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-md hover:bg-opacity-20 transition-colors ${
                isDarkMode ? 'text-gray-400 hover:bg-white' : 'text-gray-500 hover:bg-black'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Theme Section */}
          <div>
            <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              🎨 Theme
            </h3>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Dark Mode
              </span>
              <button
                onClick={onToggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-happy-blue-dark' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* API Keys Section */}
          <div>
            <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              🔑 API Keys
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  NYTimes API Key
                </label>
                <input
                  type="password"
                  value={tempNytKey}
                  onChange={(e) => setTempNytKey(e.target.value)}
                  placeholder="Enter your NYTimes API key"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-happy-blue-dark' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-happy-blue'
                  }`}
                />
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Get one from <a href="https://developer.nytimes.com/get-started" target="_blank" rel="noopener noreferrer" className={`underline ${isDarkMode ? 'text-happy-blue-dark' : 'text-happy-blue'}`}>NYTimes Developer Portal</a>
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={tempOpenaiKey}
                  onChange={(e) => setTempOpenaiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-happy-blue-dark' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-happy-blue'
                  }`}
                />
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Get one from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className={`underline ${isDarkMode ? 'text-happy-blue-dark' : 'text-happy-blue'}`}>OpenAI Platform</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!tempNytKey || !tempOpenaiKey}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode
                  ? 'bg-gradient-to-r from-happy-blue-dark to-happy-purple-dark hover:from-happy-purple-dark hover:to-happy-blue-dark'
                  : 'bg-gradient-to-r from-happy-blue to-happy-purple hover:from-happy-purple hover:to-happy-blue'
              }`}
            >
              Save & Load Articles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;