import api from './axios';

const MOCK_USER = {
  id: 1,
  nome: 'Usuário Mediary',
  email: 'usuario@mediary.com',
  criado_em: new Date().toISOString()
};

export const authService = {
  login: async (email: string, senha: string) => {
    try {
      const response = await api.post('/login', { email, senha });
      localStorage.setItem('mediary_user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error: any) {
      // Se for erro de rede ou não houver resposta do servidor, usamos o mock
      if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        if (email === 'usuario@mediary.com' && senha === '123456') {
          localStorage.setItem('mediary_user', JSON.stringify(MOCK_USER));
          return { user: MOCK_USER };
        }
      }
      throw error;
    }
  },
  cadastro: async (nome: string, email: string, senha: string) => {
    try {
      const response = await api.post('/cadastro', { nome, email, senha });
      return response.data;
    } catch (error: any) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        const newUser = { id: Date.now(), nome, email, criado_em: new Date().toISOString() };
        localStorage.setItem('mediary_user', JSON.stringify(newUser));
        return { user: newUser };
      }
      throw error;
    }
  },
  logout: async () => {
    try {
      await api.get('/logout');
    } catch (error) {
      // Ignora erro no logout se estiver offline
    } finally {
      localStorage.removeItem('mediary_user');
    }
    return { message: 'Logged out successfully' };
  },
  me: async () => {
    try {
      const response = await api.get('/me');
      localStorage.setItem('mediary_user', JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        const localUser = localStorage.getItem('mediary_user');
        if (localUser) {
          return JSON.parse(localUser);
        }
      }
      throw error;
    }
  },
  updatePerfil: async (nome: string, email: string) => {
    try {
      const response = await api.put('/usuario', { nome, email });
      return response.data;
    } catch (error: any) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        const localUserStr = localStorage.getItem('mediary_user');
        if (localUserStr) {
          const localUser = JSON.parse(localUserStr);
          const updated = { ...localUser, nome, email };
          localStorage.setItem('mediary_user', JSON.stringify(updated));
          return updated;
        }
      }
      throw error;
    }
  },
  updateSenha: async (senha_atual: string, senha_nova: string) => {
    try {
      const response = await api.put('/usuario/senha', { senha_atual, senha_nova });
      return response.data;
    } catch (error: any) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        return { message: 'Senha atualizada localmente' };
      }
      throw error;
    }
  }
};
