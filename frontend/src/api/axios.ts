import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Importante para enviar os cookies da sessão
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
