import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';
import * as tasksAPI from './tasksAPI';

interface TasksState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
};

// Thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  return await tasksAPI.fetchTasks();
});

export const addNewTask = createAsyncThunk(
  'tasks/addNewTask',
  async (newTask: tasksAPI.NewTask) => {
    return await tasksAPI.addTask(newTask);
  }
);

export const updateExistingTask = createAsyncThunk(
  'tasks/updateExistingTask',
  async (task: Task) => {
    return await tasksAPI.updateTask(task);
  }
);

export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (id: string) => {
    await tasksAPI.deleteTask(id);
    return id;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // локальные синхронные операции (например, toggle подзадачи без отправки на сервер)
    toggleSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.items.find(t => t.id === action.payload.taskId);
      if (task) {
        const sub = task.subtasks.find(s => s.id === action.payload.subtaskId);
        if (sub) sub.completed = !sub.completed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateExistingTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      });
  },
});

export const { toggleSubtask } = tasksSlice.actions;
export default tasksSlice.reducer;