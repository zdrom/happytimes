import React, { useState } from 'react';

const AuthGate = ({ onAuthenticated, isDarkMode }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // You can change this password to whatever you want
  const CORRECT_PASSWORD = 'happynews2024';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem('happytimes-auth', 'true');
      onAuthenticated();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-happy-yellow to-happy-orange'}`}>
      <div className={`rounded-lg shadow-xl p-8 max-w-md w-full ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔐 HappyTimes</h1>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Enter password to access</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-happy-blue-dark' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-happy-blue'
              }`}
              required
            />
          </div>
          
          {error && (
            <div className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              isDarkMode
                ? 'bg-gradient-to-r from-happy-blue-dark to-happy-purple-dark hover:from-happy-purple-dark hover:to-happy-blue-dark text-white'
                : 'bg-gradient-to-r from-happy-blue to-happy-purple hover:from-happy-purple hover:to-happy-blue text-white'
            }`}
          >
            Access HappyTimes
          </button>
        </form>
        
        <div className={`mt-6 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>This app is password protected to limit API usage</p>
        </div>
      </div>
    </div>
  );
};

export default AuthGate;