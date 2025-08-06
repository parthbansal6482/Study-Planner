import React, { useState, useEffect, useCallback } from 'react';

const PomodoroTimer = ({ currentTask, isRunning, onStart, onStop }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [timerMode, setTimerMode] = useState('work');

  useEffect(() => {
    const savedTimerState = localStorage.getItem('pomodoroTimerState');
    if (savedTimerState) {
      try {
        const state = JSON.parse(savedTimerState);
        setTimeLeft(state.timeLeft || 25 * 60);
        setIsPaused(state.isPaused || false);
        setIsBreak(state.isBreak || false);
        setSessions(state.sessions || 0);
        setTimerMode(state.timerMode || 'work');
      } catch (error) {
        console.error('Error loading timer state:', error);
      }
    }
  }, []);

  useEffect(() => {
    const timerState = {
      timeLeft,
      isPaused,
      isBreak,
      sessions,
      timerMode
    };
    try {
      localStorage.setItem('pomodoroTimerState', JSON.stringify(timerState));
    } catch (error) {
      console.error('Error saving timer state:', error);
    }
  }, [timeLeft, isPaused, isBreak, sessions, timerMode]);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, isPaused, timeLeft]);

  const handleTimerComplete = useCallback(() => {
    if (timerMode === 'work') {
      setTimerMode('break');
      setTimeLeft(5 * 60);
      setIsBreak(true);
      setSessions(prev => prev + 1);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: 'Work session completed! Time for a break.',
          icon: '/favicon.ico'
        });
      }
    } else {
      setTimerMode('work');
      setTimeLeft(25 * 60);
      setIsBreak(false);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: 'Break completed! Time to focus.',
          icon: '/favicon.ico'
        });
      }
    }
  }, [timerMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (currentTask) {
      onStart(currentTask);
    }
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setTimeLeft(25 * 60);
    setIsPaused(false);
    setIsBreak(false);
    setTimerMode('work');
    onStop();
  };

  const handleSkip = () => {
    handleTimerComplete();
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const getProgressPercentage = () => {
    const totalTime = timerMode === 'work' ? 25 * 60 : 5 * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="bg-gradient-to-br from-white via-amber-50 to-white rounded-xl p-6 shadow-2xl border-2 border-amber-800 text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pomodoro Timer</h2>
        <button
          onClick={requestNotificationPermission}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-800 transition-colors"
          title="Enable notifications"
        >
          🔔
        </button>
      </div>

      <div className="mb-6">
        <div className="w-48 h-48 mx-auto relative rounded-full bg-gray-200 flex items-center justify-center">
          <div 
            className="absolute inset-0 rounded-full"
            style={{ 
              background: `conic-gradient(#8B4513 ${getProgressPercentage()}%, #ecf0f1 ${getProgressPercentage()}%)` 
            }}
          />
          <div className="relative bg-white w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-lg">
            <div className="text-3xl font-bold text-gray-800 font-mono">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {timerMode === 'work' ? '🔄 Work' : '☕ Break'}
            </div>
          </div>
        </div>
      </div>

      {currentTask && (
        <div className="bg-amber-50 rounded-lg p-4 mb-6 text-left border border-amber-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Current Task:</h4>
          <p className="font-semibold text-gray-800">{currentTask.title}</p>
          {currentTask.description && (
            <p className="text-sm text-gray-600 mt-1">{currentTask.description}</p>
          )}
        </div>
      )}

      <div className="flex justify-around mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Sessions</div>
          <div className="text-xl font-semibold text-gray-800">{sessions}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Mode</div>
          <div className="text-xl font-semibold text-gray-800">
            {timerMode === 'work' ? 'Work' : 'Break'}
          </div>
        </div>
      </div>

      <div className="mb-6">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={!currentTask}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
          >
            {currentTask ? '▶️ Start Timer' : 'Select a task to start'}
          </button>
        ) : (
          <div className="flex gap-3 justify-center flex-wrap">
            {isPaused ? (
              <button 
                onClick={handleResume}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                ▶️ Resume
              </button>
            ) : (
              <button 
                onClick={handlePause}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ⏸️ Pause
              </button>
            )}
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              🔄 Reset
            </button>
            <button 
              onClick={handleSkip}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              ⏭️ Skip
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border border-gray-200">
        <p className="mb-2">
          <strong>Work Session:</strong> 25 minutes | <strong>Break:</strong> 5 minutes
        </p>
        <p>
          Focus on one task at a time for maximum productivity!
        </p>
      </div>
    </div>
  );
};

export default PomodoroTimer; 