import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { updateExistingTask, removeTask } from './tasksSlice';
import { Task } from '../../types';
import CategoryBadge from '../categories/CategoryBadge';

interface TaskItemProps {
  task: Task;
  onTaskClick: (taskId: string) => void; // новый пропс
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskClick }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories);
  const [showCategorySelect, setShowCategorySelect] = useState(false);

  const taskCategory = categories.find(c => c.id === task.categoryId);

  const handleToggle = () => {
    dispatch(updateExistingTask({ ...task, completed: !task.completed }));
  };

  const handleDelete = () => {
    dispatch(removeTask(task.id));
  };

  const handleCategoryChange = (categoryId: string | null) => {
    dispatch(updateExistingTask({ ...task, categoryId }));
    setShowCategorySelect(false);
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
        {/* Вместо Link используем span с обработчиком */}
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
      <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
        Удалить
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