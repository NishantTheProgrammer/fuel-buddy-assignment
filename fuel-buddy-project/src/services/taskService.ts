import type { Task } from '../stores/task';
import api from './apiService';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await api.get('/tasks');
    return response.data;
  },

  async createTask(title: string, description?: string, assigneeIds?: string[]): Promise<Task> {
    const response = await api.post('/tasks', { title, description, assigneeIds });
    return response.data;
  },

  async updateTask(id: number, updates: Partial<Task> & { assigneeIds?: string[] }): Promise<Task> {
    const response = await api.patch(`/tasks/${id}`, updates);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }
}; 