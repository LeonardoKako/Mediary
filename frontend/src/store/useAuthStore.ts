import { create } from 'zustand';
import type { User } from '../features/auth/authSchema';
import { authService } from '../api/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, senha: string) => Promise<void>;
  cadastro: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updatePerfil: (nome: string, email: string) => Promise<void>;
  updateSenha: (senhaAtual: string, novaSenha: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, senha) => {
    const data = await authService.login(email, senha);
    set({ user: data.user, isAuthenticated: true });
  },

  cadastro: async (nome, email, senha) => {
    await authService.cadastro(nome, email, senha);
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const data = await authService.me();
      set({ user: data, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePerfil: async (nome, email) => {
    const data = await authService.updatePerfil(nome, email);
    set((state) => ({
      user: state.user ? { ...state.user, nome: data.nome, email: data.email } : null
    }));
  },

  updateSenha: async (senhaAtual, novaSenha) => {
    await authService.updateSenha(senhaAtual, novaSenha);
  }
}));
