import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { fetchTasks } from '../features/tasks/tasksSlice';
import { useFilteredAndSortedTasks } from '../hooks/useFilteredAndSortedTasks';
import TasksList from '../features/tasks/TasksList';
import TaskDetailsModal from '../features/tasks/TaskDetailsModal';
import AddEditTaskModal from '../features/tasks/AddEditTaskModal';
import { useTheme } from '../context/ThemeContext';
import CategoryManager from '../features/categories/CategoryManager';
import toast from 'react-hot-toast';

type FilterType = 'all' | 'active' | 'completed';
type SortOrder = 'newest' | 'oldest';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories);
  const { items: tasks, status } = useAppSelector(state => state.tasks);

  // Состояния фильтров
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Состояния для модалок
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const filteredTasks = useFilteredAndSortedTasks(filter, selectedCategory, sortOrder, searchQuery);
  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;

  const handleTaskClick = (taskId: string) => setSelectedTaskId(taskId);
  const handleCloseModal = () => setSelectedTaskId(null);

  if (status === 'loading') return <div className="text-center dark:text-white">Загрузка задач...</div>;
  if (status === 'failed') return <div className="text-center text-red-500">Ошибка загрузки задач</div>;

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900">
      <div className="p-4 sm:p-6">
        {/* Шапка с кнопками */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Мои задачи</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="p-2 rounded bg-green-500 text-white hover:bg-green-600 flex items-center gap-1"
            >
              <span>➕</span>
              <span className="hidden sm:inline">Добавить</span>
            </button>
            <button
              onClick={() => setIsCategoryManagerOpen(true)}
              className="p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white flex items-center gap-1"
            >
              <span>📁</span>
              <span className="hidden sm:inline">Категории</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
            >
              {theme === 'light' ? <span>🌙</span> : <span>☀️</span>}
            </button>
          </div>
        </div>

        {/* Поиск */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Поиск задач..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded pl-10 pr-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Панель фильтрации и сортировки */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center">
          {/* Фильтр по статусу */}
          <div className="flex gap-2">
            {(['all', 'active', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded capitalize ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {f === 'all' ? 'Все' : f === 'active' ? 'Активные' : 'Завершённые'}
              </button>
            ))}
          </div>

          {/* Фильтр по категории */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="border rounded px-3 py-1 bg-white text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="">Все категории</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Сортировка */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="border rounded px-3 py-1 bg-white text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
          </select>
        </div>

        {/* Список задач */}
        <TasksList tasks={filteredTasks} onTaskClick={handleTaskClick} />
      </div>

      {/* Модалка добавления задачи */}
      <AddEditTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Менеджер категорий */}
      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
      />

      {/* Модалка деталей задачи */}
      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default HomePage;