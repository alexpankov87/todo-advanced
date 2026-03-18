import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';

const STORAGE_KEY = 'todo_categories';

// Загружаем категории из localStorage, если есть
const loadInitialState = (): Category[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse categories from localStorage', e);
    }
  }
  // Категории по умолчанию
  return [
    { id: '1', name: 'Работа', color: '#EF4444' },
    { id: '2', name: 'Личное', color: '#3B82F6' },
    { id: '3', name: 'Учеба', color: '#10B981' },
  ];
};

const initialState: Category[] = loadInitialState();

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Omit<Category, 'id'>>) => {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...action.payload,
      };
      state.push(newCategory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      const newState = state.filter(c => c.id !== action.payload);
      // Мутируем state, заменяя массив
      state.length = 0;
      state.push(...newState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;