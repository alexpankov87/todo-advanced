import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { updateExistingTask, removeTask } from '../features/tasks/tasksSlice';
import { Task, SubTask } from '../types';

const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const task = useAppSelector(state => state.tasks.items.find(t => t.id === id));
  const categories = useAppSelector(state => state.categories);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  if (!task) {
    return <div className="text-center mt-10">Задача не найдена</div>;
  }

  const handleToggleComplete = () => {
    dispatch(updateExistingTask({ ...task, completed: !task.completed }));
  };

  const handleDelete = () => {
    dispatch(removeTask(task.id));
    navigate('/');
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSubtask: SubTask = {
      id: Date.now().toString(),
      title: newSubtaskTitle,
      completed: false,
    };
    const updatedTask: Task = {
      ...task,
      subtasks: [...task.subtasks, newSubtask],
    };
    dispatch(updateExistingTask(updatedTask));
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(sub =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );
    dispatch(updateExistingTask({ ...task, subtasks: updatedSubtasks }));
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(sub => sub.id !== subtaskId);
    dispatch(updateExistingTask({ ...task, subtasks: updatedSubtasks }));
  };

  const category = categories.find(c => c.id === task.categoryId);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500 hover:underline">
        ← Назад
      </button>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            Удалить задачу
          </button>
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              className="w-5 h-5"
            />
            <span>Завершена</span>
          </label>
        </div>

        {task.description && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Описание</h2>
            <p className="text-gray-700">{task.description}</p>
          </div>
        )}

        {category && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Категория</h2>
            <span className="inline-block px-2 py-1 rounded text-white" style={{ backgroundColor: category.color }}>
              {category.name}
            </span>
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Подзадачи</h2>
          <div className="space-y-2">
            {task.subtasks.map(sub => (
              <div key={sub.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => handleToggleSubtask(sub.id)}
                  />
                  <span className={sub.completed ? 'line-through text-gray-400' : ''}>
                    {sub.title}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteSubtask(sub.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Новая подзадача"
              className="border rounded-l px-3 py-2 flex-1"
            />
            <button
              onClick={handleAddSubtask}
              className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;