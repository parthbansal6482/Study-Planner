import React from 'react';

const Header = () => {
  return (
    <header className="bg-white border-b-2 border-amber-800 shadow-2xl relative">
      <div className="absolute left-0 right-0 bottom-0 h-2 bg-gradient-to-t from-amber-800/20 to-transparent rounded-b-lg pointer-events-none" />
      <div className="container mx-auto px-4 py-6 text-center relative z-10">
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