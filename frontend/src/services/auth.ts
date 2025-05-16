import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const authService = {
  async signUp(data: { name: string; email: string; password: string }) {
    const response = await axios.post(`${API_URL}/auth/signup`, data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async signIn(data: { email: string; password: string }) {
    const response = await axios.post(`${API_URL}/auth/signin`, data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async signOut(): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/signout`, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove the token even if the server request fails
      localStorage.removeItem('token');
    }
  }
};

export default authService; 