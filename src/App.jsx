import React, { useState, useEffect } from 'react';
import './App.css';
import TaskManager from './components/TaskManager';
import PomodoroTimer from './components/PomodoroTimer';
import Header from './components/Header';

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('studyPlannerTasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('studyPlannerTasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

  const addTask = (newTask) => {
    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const updateTask = (taskId, updates) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    if (currentTask && currentTask.id === taskId) {
      setCurrentTask(null);
    }
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : null
          };
        }
        return task;
      })
    );
  };

  const startTimerForTask = (task) => {
    setCurrentTask(task);
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setCurrentTask(null);
  };

  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <div className="main-content">
          <div className="w-full">
            <TaskManager
              tasks={tasks}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onMoveTask={moveTask}
              onStartTimer={startTimerForTask}
              currentTask={currentTask}
            />
          </div>
          <div className="w-full">
            <PomodoroTimer
              currentTask={currentTask}
              isRunning={isTimerRunning}
              onStart={startTimerForTask}
              onStop={stopTimer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
