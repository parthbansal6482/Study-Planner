import React from 'react';

const Header = () => {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl">📚</span>
          Study Planner
        </h1>
        <p className="text-gray-600 text-lg">Organize tasks, focus with Pomodoro</p>
      </div>
    </header>
  );
};

export default Header; 