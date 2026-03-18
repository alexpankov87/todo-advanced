import axios from 'axios';
import { Task } from '../../types';

const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) throw new Error('REACT_APP_API_URL is not defined');

export type NewTask = Omit<Task, 'id' | 'createdAt'>;

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get<Task[]>(API_URL);
  return response.data;
};

export const addTask = async (task: NewTask): Promise<Task> => {
  const response = await axios.post<Task>(API_URL, {
    ...task,
    createdAt: Date.now(),
  });
  return response.data;
};

export const updateTask = async (task: Task): Promise<Task> => {
  const response = await axios.put<Task>(`${API_URL}/${task.id}`, task);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};