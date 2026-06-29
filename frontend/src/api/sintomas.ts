import api from "./axios";
import type { Sintoma, CreateSintomaDTO, UpdateSintomaDTO } from "../types/sintoma";

const LOCAL_KEY = "mediary_sintomas";

const getLocalSintomas = (): Sintoma[] => {
  const data = localStorage.getItem(LOCAL_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalSintomas = (sintomas: Sintoma[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(sintomas));
};

export const sintomasService = {
  getSintomasMes: async (ano: number, mes: number) => {
    try {
      const response = await api.get(`/sintomas/mes/${ano}/${mes}`);
      return response.data;
    } catch (error: any) {
      if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        const sintomas = getLocalSintomas();
        // Filtra pelo ano e mês da data de 'inicio' (formato YYYY-MM-DD...)
        const mesStr = String(mes).padStart(2, '0');
        const prefix = `${ano}-${mesStr}`;
        return sintomas.filter(s => s.inicio.startsWith(prefix));
      }
      throw error;
    }
  },
  getCalendarioInfo: async (ano: number, mes: number) => {
    try {
      const response = await api.get(`/sintomas/calendario`, {
        params: { ano, mes },
      });
      return response.data;
    } catch (error: any) {
      if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        const sintomas = getLocalSintomas();
        const mesStr = String(mes).padStart(2, '0');
        const prefix = `${ano}-${mesStr}`;
        
        const counts: Record<string, number> = {};
        sintomas.forEach(s => {
          if (s.inicio.startsWith(prefix)) {
            // Pega o YYYY-MM-DD
            const dataStr = s.inicio.split('T')[0];
            counts[dataStr] = (counts[dataStr] || 0) + 1;
          }
        });
        return counts;
      }
      throw error;
    }
  },
  getSintomasDia: async (data: string) => {
    try {
      const response = await api.get(`/sintomas/dia`, {
        params: { data },
      });
      return response.data;
    } catch (error: any) {
      if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        const sintomas = getLocalSintomas();
        // data está no formato YYYY-MM-DD
        return sintomas.filter(s => s.inicio.startsWith(data));
      }
      throw error;
    }
  },
  adicionar: async (dto: CreateSintomaDTO) => {
    try {
      const response = await api.post("/sintomas", dto);
      return response.data;
    } catch (error: any) {
      if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        const sintomas = getLocalSintomas();
        const newSintoma: Sintoma = {
          id: Date.now(),
          usuario_id: 1,
          tipo: dto.tipo,
          subtipo: dto.subtipo,
          descricao: dto.descricao,
          inicio: dto.inicio,
          fim: dto.fim,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString()
        };
        sintomas.push(newSintoma);
        saveLocalSintomas(sintomas);
        return newSintoma;
      }
      throw error;
    }
  },
  atualizar: async (id: number, dto: UpdateSintomaDTO) => {
    try {
      const response = await api.put(`/sintomas/${id}`, dto);
      return response.data;
    } catch (error: any) {
      if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        const sintomas = getLocalSintomas();
        const idx = sintomas.findIndex(s => s.id === id);
        if (idx !== -1) {
          const updatedSintoma: Sintoma = {
            ...sintomas[idx],
            ...dto,
            atualizado_em: new Date().toISOString()
          };
          sintomas[idx] = updatedSintoma;
          saveLocalSintomas(sintomas);
          return updatedSintoma;
        }
        throw new Error("Sintoma não encontrado localmente.");
      }
      throw error;
    }
  },
  excluir: async (id: number) => {
    try {
      const response = await api.delete(`/sintomas/${id}`);
      return response.data;
    } catch (error: any) {
      if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        const sintomas = getLocalSintomas();
        const filtered = sintomas.filter(s => s.id !== id);
        saveLocalSintomas(filtered);
        return { message: "Sintoma excluído com sucesso localmente." };
      }
      throw error;
    }
  },
};
