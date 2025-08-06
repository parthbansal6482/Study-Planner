import React, { useState } from 'react';

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onMove,
  onStartTimer,
  isCurrentTask,
  canMoveForward,
  canMoveBackward,
  nextStatus,
  previousStatus
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleMoveForward = () => {
    if (canMoveForward) {
      onMove(task.id, nextStatus);
    }
  };

  const handleMoveBackward = () => {
    if (canMoveBackward) {
      onMove(task.id, previousStatus);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      inProgress: '🔄',
      completed: '✅'
    };
    return icons[status] || '📝';
  };

  return (
    <div
      className={`bg-gradient-to-br from-white via-amber-50 to-white rounded-xl p-3 shadow-2xl hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-200 cursor-grab border-2 ${
        isCurrentTask ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:border-amber-300'
      } hover:-translate-y-1`}
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1">
          <span className="text-lg">{getStatusIcon(task.status)}</span>
        </div>
        <div className={`flex gap-1 transition-opacity duration-200 ${
          showActions ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="mb-2">
        <h4 className="font-semibold text-gray-800 text-sm mb-1">{task.title}</h4>
        {task.description && (
          <p className="text-xs text-gray-600 mb-1 line-clamp-2">{task.description}</p>
        )}
        <div className="text-xs text-gray-500">
          <div>Created: {formatDate(task.createdAt)}</div>
          {task.completedAt && (
            <div>Completed: {formatDate(task.completedAt)}</div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          {task.status === 'pending' && (
            <button
              onClick={() => onStartTimer(task)}
              disabled={isCurrentTask}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                isCurrentTask
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-800'
              }`}
            >
              {isCurrentTask ? '⏱️ Running' : '▶️ Start'}
            </button>
          )}
        </div>
        
        {showActions && (
          <div className="flex gap-1">
            {canMoveBackward && (
              <button
                onClick={handleMoveBackward}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
                title={`Move to ${previousStatus}`}
              >
                ⬅️
              </button>
            )}
            {canMoveForward && (
              <button
                onClick={handleMoveForward}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
                title={`Move to ${nextStatus}`}
              >
                ➡️
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard; 