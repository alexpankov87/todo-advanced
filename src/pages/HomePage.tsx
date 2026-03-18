import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { fetchTasks } from '../features/tasks/tasksSlice';
import { useFilteredAndSortedTasks } from '../hooks/useFilteredAndSortedTasks';
import TasksList from '../features/tasks/TasksList';
import { useTheme } from '../context/ThemeContext';

type FilterType = 'all' | 'active' | 'completed';
type SortOrder = 'newest' | 'oldest';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories);
  const { status } = useAppSelector(state => state.tasks); // статус загрузки
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();

  // Загружаем задачи при первом рендере
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const tasks = useFilteredAndSortedTasks(filter, selectedCategory, sortOrder, searchQuery);

  // Показываем загрузку, пока задачи не получены
  if (status === 'loading') return <div className="text-center dark:text-white">Загрузка задач...</div>;
  if (status === 'failed') return <div className="text-center text-red-500">Ошибка загрузки задач</div>;

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        {/* Шапка с заголовком и переключателем темы */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Мои задачи</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
          >
            {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
          </button>
        </div>

        {/* Поле поиска */}
        <input
          type="text"
          placeholder="Поиск задач..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />

        {/* Панель фильтров */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            {(['all', 'active', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded capitalize ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {f === 'all' ? 'Все' : f === 'active' ? 'Активные' : 'Завершённые'}
              </button>
            ))}
          </div>

          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="border rounded px-3 py-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="">Все категории</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="border rounded px-3 py-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
          </select>
        </div>

        <TasksList tasks={tasks} />
      </div>
    </div>
  );
};

export default HomePage;