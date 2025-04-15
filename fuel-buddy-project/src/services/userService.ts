import axios from 'axios';
import api from './apiService';  // Use the configured api with auth token

export interface User {
  id: string;  // Changed from number to string
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Use the proxied path instead of the full URL
const API_URL = '/api/users';

export const userService = {
  async createUser(name: string, email: string, uid: string): Promise<User> {
    const response = await api.post('/users', { name, email, id: uid });
    return response.data;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await api.get(`/users/email/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}; 