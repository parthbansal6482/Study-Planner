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
      className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[400px]"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="border-b-2 pb-2 mb-3" style={{ borderColor: color }}>
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