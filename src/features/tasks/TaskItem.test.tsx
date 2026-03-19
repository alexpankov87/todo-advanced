import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import tasksReducer from './tasksSlice';
import categoriesReducer from '../categories/categoriesSlice';
import TaskItem from './TaskItem';
import { Task } from '../../types';

// Мокаем toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Мок для useTheme (не нужен в этом тесте, но может потребоваться, если он используется в дочерних компонентах)
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

describe('TaskItem', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Тестовая задача',
    description: '',
    completed: false,
    categoryId: null,
    subtasks: [],
    createdAt: Date.now(),
  };

  const mockOnTaskClick = jest.fn();

  const renderWithProviders = (task = mockTask) => {
    const store = configureStore({
      reducer: {
        tasks: tasksReducer,
        categories: categoriesReducer,
      },
    });
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <TaskItem task={task} onTaskClick={mockOnTaskClick} />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders task title', () => {
    renderWithProviders();
    expect(screen.getByText('Тестовая задача')).toBeInTheDocument();
  });

  it('calls onTaskClick when title clicked', () => {
    renderWithProviders();
    fireEvent.click(screen.getByText('Тестовая задача'));
    expect(mockOnTaskClick).toHaveBeenCalledWith('1');
  });

  it('toggles task completion', async () => {
    renderWithProviders();
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);   
  });

  it('shows delete button', () => {
    renderWithProviders();
    expect(screen.getByRole('button', { name: /🗑️/ })).toBeInTheDocument();
  });
});