import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { addCategory, updateCategory, deleteCategory } from './categoriesSlice';
import { updateExistingTask } from '../tasks/tasksSlice';
import { Category } from '../../types';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', color: '#3B82F6' });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        await dispatch(updateCategory({ id: editingId, ...formData }));
        toast.success('Категория обновлена');
      } else {
        await dispatch(addCategory(formData));
        toast.success('Категория добавлена');
      }
      resetForm();
    } catch (error) {
      toast.error('Ошибка при сохранении категории');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Удалить категорию? Задачи этой категории перейдут в "Без категории".')) return;

    try {
      // Обновляем все задачи, привязанные к этой категории
      const updatePromises = tasks
        .filter(task => task.categoryId === categoryId)
        .map(task => dispatch(updateExistingTask({ ...task, categoryId: null })).unwrap());
      await Promise.all(updatePromises);

      // Удаляем категорию
      await dispatch(deleteCategory(categoryId));
      toast.success('Категория удалена');
    } catch (error) {
      toast.error('Ошибка при удалении категории');
    }
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
            disabled={isSubmitting}
          />
          <input
            type="color"
            value={formData.color}
            onChange={e => setFormData({ ...formData, color: e.target.value })}
            className="w-12 h-10 p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1"
          >
            {isSubmitting ? <span className="animate-spin">⏳</span> : <span>➕</span>}
            {editingId ? 'Сохранить' : 'Добавить'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            >
              <span>❌</span>
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
                <span>✏️</span>
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-500 hover:text-red-700"
              >
                <span>🗑️</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default CategoryManager;