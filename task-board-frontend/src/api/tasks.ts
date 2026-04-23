import api from './axios';
import type { Task } from '../types/index';

export const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await api.get('/tasks');
  return data;
};

export const createTask = async (task: { title: string; description: string }) => {
  const { data } = await api.post('/tasks', task);
  return data;
};

export const updateTaskStatus = async ({ id, status }: { id: string, status: string }) => {
  const { data } = await api.patch(`/tasks/${id}/status`, { status });
  return data;
};