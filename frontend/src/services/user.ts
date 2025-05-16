import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

const userService = {
  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export default userService; 