import api from './axios';

export const authService = {
  login: async (email: string, senha: string) => {
    const response = await api.post('/login', { email, senha });
    return response.data;
  },
  cadastro: async (nome: string, email: string, senha: string) => {
    const response = await api.post('/cadastro', { nome, email, senha });
    return response.data;
  },
  logout: async () => {
    const response = await api.get('/logout');
    return response.data;
  },
  me: async () => {
    const response = await api.get('/me');
    return response.data;
  },
  updatePerfil: async (nome: string, email: string) => {
    const response = await api.put('/usuario', { nome, email });
    return response.data;
  },
  updateSenha: async (senha_atual: string, senha_nova: string) => {
    const response = await api.put('/usuario/senha', { senha_atual, senha_nova });
    return response.data;
  }
};
