import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';

const initialState: Category[] = [
  { id: '1', name: 'Работа', color: '#EF4444' },
  { id: '2', name: 'Личное', color: '#3B82F6' },
  { id: '3', name: 'Учеба', color: '#10B981' },
];

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
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      return state.filter(c => c.id !== action.payload);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;