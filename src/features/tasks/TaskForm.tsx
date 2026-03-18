import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { addNewTask } from './tasksSlice';

const TaskForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(addNewTask({
      title: title.trim(),
      description: '',
      completed: false,
      categoryId: null,
      subtasks: [],
    }));

    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex space-x-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Новая задача..."
        className="flex-1 border rounded px-3 py-2"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Добавить
      </button>
    </form>
  );
};

export default TaskForm;