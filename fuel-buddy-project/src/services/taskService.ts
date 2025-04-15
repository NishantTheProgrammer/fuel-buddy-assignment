import axios from 'axios';
import type { Task } from '../stores/task';

// Use the proxied path instead of the full URL
const API_URL = '/api/tasks';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await api.get('/');
    return response.data;
  },

  async createTask(title: string, description?: string): Promise<Task> {
    const response = await api.post('/', { title, description });
    return response.data;
  },

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const response = await api.patch(`/${id}`, updates);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/${id}`);
  }
}; 