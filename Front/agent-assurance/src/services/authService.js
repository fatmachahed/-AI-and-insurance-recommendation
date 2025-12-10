import axios from 'axios';

const API_URL = 'http://localhost:3000/auth/'; 

const authService = {
  login: async (login, password) => {
    try {
      const response = await axios.post(API_URL + 'login', { login, password });
      
      if (response.data.access_token) {
        // Stocke le token JWT dans le localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

export default authService;