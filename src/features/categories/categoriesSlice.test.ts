import categoriesReducer, {
  addCategory,
  updateCategory,
  deleteCategory,
} from './categoriesSlice';
import { Category } from '../../types';

describe('categories slice', () => {
  const initialState: Category[] = [
    { id: '1', name: 'Работа', color: '#EF4444' },
    { id: '2', name: 'Личное', color: '#3B82F6' },
  ];

  it('should handle addCategory', () => {
    const newCategory = { name: 'Учеба', color: '#10B981' };
    const action = addCategory(newCategory);
    const newState = categoriesReducer(initialState, action);
    expect(newState).toHaveLength(3);
    expect(newState[2]).toMatchObject({
      ...newCategory,
      id: expect.any(String),
    });
  });

  it('should handle updateCategory', () => {
    const updated = { id: '1', name: 'Работа обновленная', color: '#000000' };
    const action = updateCategory(updated);
    const newState = categoriesReducer(initialState, action);
    expect(newState[0]).toEqual(updated);
  });

  it('should handle deleteCategory', () => {
    const action = deleteCategory('1');
    const newState = categoriesReducer(initialState, action);
    expect(newState).toHaveLength(1);
    expect(newState[0].id).toBe('2');
  });
});