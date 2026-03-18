import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { updateExistingTask, removeTask } from './tasksSlice';
import { Task } from '../../types';
import CategoryBadge from '../categories/CategoryBadge';
import toast from 'react-hot-toast';

interface TaskItemProps {
  task: Task;
  onTaskClick: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskClick }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories);
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const taskCategory = categories.find(c => c.id === task.categoryId);

  const handleToggle = async () => {
    try {
      await dispatch(updateExistingTask({ ...task, completed: !task.completed })).unwrap();
      toast.success(`Задача ${task.completed ? 'возобновлена' : 'выполнена'}`);
    } catch {
      toast.error('Ошибка при обновлении');
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await dispatch(removeTask(task.id)).unwrap();
      toast.success('Задача удалена');
    } catch {
      toast.error('Ошибка при удалении');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCategoryChange = async (categoryId: string | null) => {
    try {
      await dispatch(updateExistingTask({ ...task, categoryId })).unwrap();
      toast.success('Категория изменена');
      setShowCategorySelect(false);
    } catch {
      toast.error('Ошибка при изменении категории');
    }
  };

  return (
    <div className="flex items-center justify-between border-b dark:border-gray-700 py-2 relative">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="w-5 h-5 text-blue-600 dark:bg-gray-700"
        />
        <span
          onClick={() => onTaskClick(task.id)}
          className="text-lg hover:underline cursor-pointer dark:text-white"
        >
          {task.title}
        </span>
        <CategoryBadge
          category={taskCategory}
          onClick={() => setShowCategorySelect(!showCategorySelect)}
        />
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        {isDeleting ? <span className="animate-spin">⏳</span> : <span>🗑️</span>}
      </button>

      {showCategorySelect && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg p-2 z-10 min-w-40">
          <div className="text-sm font-semibold mb-1 dark:text-white">Выберите категорию</div>
          <button
            onClick={() => handleCategoryChange(null)}
            className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          >
            Без категории
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              style={{ color: cat.color }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;