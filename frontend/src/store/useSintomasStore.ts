import { create } from 'zustand';
import type { Sintoma } from '../features/sintomas/sintomasSchema';
import { mockSintomas } from '../../examples/mockSintomas';

interface SintomasState {
  sintomas: Sintoma[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addSintoma: (sintoma: Sintoma) => void;
  removeSintoma: (id: number) => void;
  updateSintoma: (id: number, updates: Partial<Sintoma>) => void;
  loadMockSintomas: () => void;
}

export const useSintomasStore = create<SintomasState>((set) => ({
  sintomas: [],
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  addSintoma: (sintoma) => set((state) => ({ sintomas: [...state.sintomas, sintoma] })),
  removeSintoma: (id) => set((state) => ({ sintomas: state.sintomas.filter(s => s.id !== id) })),
  updateSintoma: (id, updates) => set((state) => ({ 
    sintomas: state.sintomas.map(s => s.id === id ? { ...s, ...updates } : s) 
  })),
  loadMockSintomas: () => set({ sintomas: mockSintomas as Sintoma[] })
}));
