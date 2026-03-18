import { useAppSelector } from './reduxHooks';
import { useMemo } from 'react';

type FilterType = 'all' | 'active' | 'completed';
type SortOrder = 'newest' | 'oldest';

export const useFilteredAndSortedTasks = (
  filter: FilterType,
  categoryId: string | null,
  sortOrder: SortOrder,
  searchQuery: string = '' // значение по умолчанию
) => {
  const tasks = useAppSelector(state => state.tasks.items);

  return useMemo(() => {
    let filtered = tasks;

    // Фильтр по статусу
    if (filter === 'active') filtered = filtered.filter(t => !t.completed);
    else if (filter === 'completed') filtered = filtered.filter(t => t.completed);

    // Фильтр по категории
    if (categoryId) filtered = filtered.filter(t => t.categoryId === categoryId);

    // Поиск по заголовку и описанию
    const query = (searchQuery || '').trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Сортировка
    const sorted = [...filtered].sort((a, b) =>
      sortOrder === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    );

    return sorted;
  }, [tasks, filter, categoryId, sortOrder, searchQuery]);
};