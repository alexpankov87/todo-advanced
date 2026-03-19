import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import TaskForm from './TaskForm';
import * as tasksAPI from './tasksAPI';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Мокаем API
jest.mock('./tasksAPI', () => ({
  addTask: jest.fn(),
}));

describe('TaskForm', () => {
  const renderWithProviders = () => {
    const store = configureStore({
      reducer: { tasks: tasksReducer },
    });
    return render(
      <Provider store={store}>
        <TaskForm />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and button', () => {
    renderWithProviders();
    expect(screen.getByPlaceholderText('Новая задача...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Добавить/i })).toBeInTheDocument();
  });

  it('submits new task', async () => {
    const mockAddTask = tasksAPI.addTask as jest.Mock;
    mockAddTask.mockResolvedValue({ id: '1', title: 'Test', createdAt: Date.now() });

    renderWithProviders();
    const input = screen.getByPlaceholderText('Новая задача...');
    const button = screen.getByRole('button', { name: /Добавить/i });

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Task',
        description: '',
        completed: false,
        categoryId: null,
        subtasks: [],
      }));
      expect(toast.success).toHaveBeenCalledWith('Задача добавлена');
    });
  });

  it('shows error on submission failure', async () => {
    const mockAddTask = tasksAPI.addTask as jest.Mock;
    mockAddTask.mockRejectedValue(new Error('Network error'));

    renderWithProviders();
    const input = screen.getByPlaceholderText('Новая задача...');
    const button = screen.getByRole('button', { name: /Добавить/i });

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Ошибка при добавлении задачи');
    });
  });
});