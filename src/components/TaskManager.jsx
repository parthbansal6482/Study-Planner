import React, { useState } from 'react';
import TaskForm from './TaskForm';
import TaskColumn from './TaskColumn';

const TaskManager = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onStartTimer,
  currentTask
}) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = (taskData) => {
    onAddTask(taskData);
    setShowTaskForm(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleUpdateTask = (taskData) => {
    onUpdateTask(editingTask.id, taskData);
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const statusConfig = {
    pending: {
      title: 'Pending',
      icon: '⏳',
      color: '#f39c12'
    },
    inProgress: {
      title: 'In Progress',
      icon: '🔄',
      color: '#3498db'
    },
    completed: {
      title: 'Completed',
      icon: '✅',
      color: '#27ae60'
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Task Management</h2>
        <button
          onClick={() => setShowTaskForm(true)}
          disabled={showTaskForm}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          Add Task
        </button>
      </div>

      {showTaskForm && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          onCancel={handleCancelEdit}
          initialData={editingTask}
          isEditing={!!editingTask}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => (
          <TaskColumn
            key={status}
            title={config.title}
            icon={config.icon}
            color={config.color}
            tasks={getTasksByStatus(status)}
            onEditTask={handleEditTask}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
            onStartTimer={onStartTimer}
            currentTask={currentTask}
            status={status}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskManager; 