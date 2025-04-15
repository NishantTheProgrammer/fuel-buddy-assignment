import axios from 'axios';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Use the proxied path instead of the full URL
const API_URL = '/api/users';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const userService = {
  async createUser(name: string, email: string): Promise<User> {
    const response = await api.post('/', { name, email });
    return response.data;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await api.get(`/email/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}; 