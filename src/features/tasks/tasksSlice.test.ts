jest.mock('./tasksAPI', () => ({
  fetchTasks: jest.fn(),
  addTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

import tasksReducer, {
  fetchTasks,
  addNewTask,
  updateExistingTask,
  removeTask,
} from './tasksSlice';

import * as tasksAPI from './tasksAPI';
import { Task } from '../../types';
import { configureStore } from '@reduxjs/toolkit';

describe('tasks slice async thunks', () => {
  const initialState = {
    items: [],
    status: 'idle' as const,
    error: null,
  };

  const mockTask: Task = {
    id: '1',
    title: 'Test',
    description: 'Desc',
    completed: false,
    categoryId: null,
    subtasks: [],
    createdAt: Date.now(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle fetchTasks fulfilled', async () => {
    (tasksAPI.fetchTasks as jest.Mock).mockResolvedValue([mockTask]);

    const store = configureStore({ reducer: { tasks: tasksReducer } });

    await store.dispatch(fetchTasks());
    const state = store.getState().tasks;

    expect(state.items).toEqual([mockTask]);
    expect(state.status).toBe('succeeded');
  });

  it('should handle fetchTasks rejected', async () => {
    (tasksAPI.fetchTasks as jest.Mock).mockRejectedValue(new Error('Error'));

    const store = configureStore({ reducer: { tasks: tasksReducer } });

    await store.dispatch(fetchTasks());
    const state = store.getState().tasks;

    expect(state.status).toBe('failed');
    expect(state.error).toBeDefined();
  });

  it('should handle addNewTask', async () => {
    const newTask = {
      title: 'New',
      description: '',
      completed: false,
      categoryId: null,
      subtasks: [],
    };

    const createdTask = {
      ...newTask,
      id: '2',
      createdAt: Date.now(),
    };

    (tasksAPI.addTask as jest.Mock).mockResolvedValue(createdTask);

    const store = configureStore({ reducer: { tasks: tasksReducer } });

    await store.dispatch(addNewTask(newTask));
    const state = store.getState().tasks;

    expect(state.items).toContainEqual(createdTask);
  });

  it('should handle updateExistingTask', async () => {
    const updatedTask = { ...mockTask, title: 'Updated' };

    (tasksAPI.updateTask as jest.Mock).mockResolvedValue(updatedTask);

    const store = configureStore({ reducer: { tasks: tasksReducer } });

    store.dispatch({
      type: 'tasks/fetchTasks/fulfilled',
      payload: [mockTask],
    });

    await store.dispatch(updateExistingTask(updatedTask));
    const state = store.getState().tasks;

    expect(state.items[0].title).toBe('Updated');
  });

  it('should handle removeTask', async () => {
    (tasksAPI.deleteTask as jest.Mock).mockResolvedValue(undefined);

    const store = configureStore({ reducer: { tasks: tasksReducer } });

    store.dispatch({
      type: 'tasks/fetchTasks/fulfilled',
      payload: [mockTask],
    });

    await store.dispatch(removeTask(mockTask.id));
    const state = store.getState().tasks;

    expect(state.items).toHaveLength(0);
  });
});
