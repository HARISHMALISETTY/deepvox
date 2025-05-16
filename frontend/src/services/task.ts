import axios from 'axios';
import type { Task, CreateTaskData, UpdateTaskData } from '../types/task';

const API_URL = 'http://localhost:3000/api';

const taskService = {
  async getTasks(): Promise<Task[]> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/tasks`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/tasks/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export default taskService; 