import { create } from 'zustand';
import type { User } from '../features/auth/authSchema';
import { mockUser } from '../../examples/mockUser';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  
  // Apenas para testes rápidos
  setMockUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setMockUser: () => set({ user: mockUser, isAuthenticated: true })
}));
