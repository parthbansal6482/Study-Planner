import React from 'react';
import TaskCard from './TaskCard';

const TaskColumn = ({
  title,
  icon,
  color,
  tasks,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onStartTimer,
  currentTask,
  status
}) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onMoveTask(taskId, status);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'inProgress',
      inProgress: 'completed',
      completed: 'pending'
    };
    return statusFlow[currentStatus] || 'pending';
  };

  const getPreviousStatus = (currentStatus) => {
    const statusFlow = {
      inProgress: 'pending',
      completed: 'inProgress',
      pending: 'completed'
    };
    return statusFlow[currentStatus] || 'pending';
  };

  return (
    <div
      className="bg-gradient-to-br from-white via-amber-50 to-white rounded-xl p-3 shadow-2xl border-2 border-amber-800 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-200 min-h-[400px] hover:-translate-y-1"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="border-b-2 border-amber-600 pb-2 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          </div>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-6 text-gray-500 italic text-sm">
            <p>No tasks yet</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
              onStartTimer={onStartTimer}
              isCurrentTask={currentTask && currentTask.id === task.id}
              canMoveForward={status !== 'completed'}
              canMoveBackward={status !== 'pending'}
              nextStatus={getNextStatus(status)}
              previousStatus={getPreviousStatus(status)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn; 