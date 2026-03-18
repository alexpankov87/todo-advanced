import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { addCategory, updateCategory, deleteCategory } from './categoriesSlice';
import { updateExistingTask } from '../tasks/tasksSlice';
import { Category } from '../../types';
import Modal from '../../components/Modal';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories);
  const tasks = useAppSelector(state => state.tasks.items);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6' });

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', color: '#3B82F6' });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      dispatch(updateCategory({ id: editingId, ...formData }));
    } else {
      dispatch(addCategory(formData));
    }
    resetForm();
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Удалить категорию? Задачи этой категории перейдут в "Без категории".')) return;

    // Сначала обновляем все задачи, привязанные к этой категории (асинхронно)
    const updatePromises = tasks
      .filter(task => task.categoryId === categoryId)
      .map(task => dispatch(updateExistingTask({ ...task, categoryId: null })));

    await Promise.all(updatePromises); // ждём завершения всех обновлений

    // Затем удаляем категорию
    dispatch(deleteCategory(categoryId));
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, color: category.color });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Управление категориями">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Название категории"
            className="flex-1 border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
          <input
            type="color"
            value={formData.color}
            onChange={e => setFormData({ ...formData, color: e.target.value })}
            className="w-12 h-10 p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? 'Сохранить' : 'Добавить'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      <ul className="space-y-2 max-h-80 overflow-y-auto">
        {categories.map(cat => (
          <li key={cat.id} className="flex items-center justify-between p-2 border rounded dark:border-gray-700">
            <div className="flex items-center gap-3">
              <span
                className="w-6 h-6 rounded"
                style={{ backgroundColor: cat.color }}
              />
              <span className="dark:text-white">{cat.name}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(cat)}
                className="text-blue-500 hover:text-blue-700"
              >
                ✎
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-500 hover:text-red-700"
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default CategoryManager;