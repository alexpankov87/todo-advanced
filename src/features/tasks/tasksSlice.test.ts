import tasksReducer, {
  fetchTasks,
  addNewTask,
  updateExistingTask,
  removeTask,
} from './tasksSlice';
import * as tasksAPI from './tasksAPI';
import { Task } from '../../types';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Мокаем API
const mock = new MockAdapter(axios);
const API_URL = process.env.REACT_APP_API_URL || 'http://test.com';

describe('tasks slice async thunks', () => {
  afterEach(() => {
    mock.reset();
  });

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

  it('should handle fetchTasks fulfilled', async () => {
    mock.onGet(API_URL).reply(200, [mockTask]);

    const store = configureStore({ reducer: { tasks: tasksReducer } });
    await store.dispatch(fetchTasks());
    const state = store.getState().tasks;
    expect(state.items).toEqual([mockTask]);
    expect(state.status).toBe('succeeded');
  });

  it('should handle fetchTasks rejected', async () => {
    mock.onGet(API_URL).reply(500);

    const store = configureStore({ reducer: { tasks: tasksReducer } });
    await store.dispatch(fetchTasks());
    const state = store.getState().tasks;
    expect(state.status).toBe('failed');
    expect(state.error).toBeDefined();
  });

  it('should handle addNewTask', async () => {
    const newTask = { title: 'New', description: '', completed: false, categoryId: null, subtasks: [] };
    const createdTask = { ...newTask, id: '2', createdAt: Date.now() };
    mock.onPost(API_URL).reply(201, createdTask);

    const store = configureStore({ reducer: { tasks: tasksReducer } });
    await store.dispatch(addNewTask(newTask));
    const state = store.getState().tasks;
    expect(state.items).toContainEqual(createdTask);
  });

  it('should handle updateExistingTask', async () => {
    const updatedTask = { ...mockTask, title: 'Updated' };
    mock.onPut(`${API_URL}/${mockTask.id}`).reply(200, updatedTask);

    const store = configureStore({ reducer: { tasks: tasksReducer } });
    // Сначала добавим задачу в стейт
    store.dispatch({ type: 'tasks/fetchTasks/fulfilled', payload: [mockTask] });
    await store.dispatch(updateExistingTask(updatedTask));
    const state = store.getState().tasks;
    expect(state.items[0].title).toBe('Updated');
  });

  it('should handle removeTask', async () => {
    mock.onDelete(`${API_URL}/${mockTask.id}`).reply(204);

    const store = configureStore({ reducer: { tasks: tasksReducer } });
    store.dispatch({ type: 'tasks/fetchTasks/fulfilled', payload: [mockTask] });
    await store.dispatch(removeTask(mockTask.id));
    const state = store.getState().tasks;
    expect(state.items).toHaveLength(0);
  });
});