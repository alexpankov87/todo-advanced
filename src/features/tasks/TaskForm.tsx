import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { addNewTask } from './tasksSlice';
import toast from 'react-hot-toast';

const TaskForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await dispatch(addNewTask({
        title: title.trim(),
        description: '',
        completed: false,
        categoryId: null,
        subtasks: [],
      })).unwrap();
      toast.success('Задача добавлена');
      setTitle('');
    } catch (error) {
      toast.error('Ошибка при добавлении задачи');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex space-x-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Новая задача..."
        className="flex-1 border rounded px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1"
      >
        {isLoading ? <span className="animate-spin">⏳</span> : <span>➕</span>}
        Добавить
      </button>
    </form>
  );
};

export default TaskForm;