import { create } from "zustand";
import type {
  Sintoma,
  CreateSintomaDTO,
  UpdateSintomaDTO,
} from "../types/sintoma";
import { sintomasService } from "../api/sintomas";

interface SintomasState {
  sintomas: Sintoma[];
  calendarioInfo: Record<string, number>; // data -> total
  isLoading: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  fetchSintomasMes: (ano: number, mes: number) => Promise<void>;
  fetchCalendarioInfo: (ano: number, mes: number) => Promise<void>;
  fetchSintomasDia: (dataStr: string) => Promise<void>;
  adicionarSintoma: (dto: CreateSintomaDTO) => Promise<void>;
  atualizarSintoma: (id: number, dto: UpdateSintomaDTO) => Promise<void>;
  excluirSintoma: (id: number) => Promise<void>;
}

export const useSintomasStore = create<SintomasState>((set) => ({
  sintomas: [],
  calendarioInfo: {},
  isLoading: false,
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),

  fetchSintomasMes: async (ano, mes) => {
    set({ isLoading: true });
    try {
      const data = await sintomasService.getSintomasMes(ano, mes);
      set({ sintomas: data });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCalendarioInfo: async (ano, mes) => {
    try {
      const data = await sintomasService.getCalendarioInfo(ano, mes);
      set({ calendarioInfo: data });
    } catch (error) {
      console.error("Erro ao carregar calendário:", error);
    }
  },

  fetchSintomasDia: async (dataStr) => {
    set({ isLoading: true });
    try {
      const data = await sintomasService.getSintomasDia(dataStr);
      set({ sintomas: data });
    } finally {
      set({ isLoading: false });
    }
  },

  adicionarSintoma: async (dto) => {
    await sintomasService.adicionar(dto);
  },

  atualizarSintoma: async (id, dto) => {
    await sintomasService.atualizar(id, dto);
  },

  excluirSintoma: async (id) => {
    await sintomasService.excluir(id);
    set((state) => ({
      sintomas: state.sintomas.filter((s) => s.id !== id),
    }));
  },
}));
