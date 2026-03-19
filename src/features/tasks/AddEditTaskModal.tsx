import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { addNewTask, updateExistingTask } from './tasksSlice';
import { Task } from '../../types';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

interface AddEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null; // если передан, то режим редактирования
}

const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Если редактируем – заполняем поля
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategoryId(taskToEdit.categoryId || null);
    } else {
      // Сброс при закрытии
      setTitle('');
      setDescription('');
      setCategoryId(null);
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (taskToEdit) {
        // Редактирование
        await dispatch(updateExistingTask({
          ...taskToEdit,
          title: title.trim(),
          description: description.trim() || undefined,
          categoryId,
        })).unwrap();
        toast.success('Задача обновлена');
      } else {
        // Добавление
        await dispatch(addNewTask({
          title: title.trim(),
          description: description.trim() || undefined,
          completed: false,
          categoryId,
          subtasks: [],
        })).unwrap();
        toast.success('Задача добавлена');
      }
      onClose();
    } catch (error) {
      toast.error('Ошибка при сохранении');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={taskToEdit ? 'Редактировать задачу' : 'Новая задача'}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Название <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Описание
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Категория
          </label>
          <select
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value || null)}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            disabled={isSubmitting}
          >
            <option value="">Без категории</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? '⏳' : (taskToEdit ? 'Сохранить' : 'Добавить')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditTaskModal;