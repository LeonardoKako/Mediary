import api from "./axios";
import type { CreateSintomaDTO, UpdateSintomaDTO } from "../types/sintoma";

export const sintomasService = {
  getSintomasMes: async (ano: number, mes: number) => {
    const response = await api.get(`/sintomas/mes/${ano}/${mes}`);
    return response.data;
  },
  getCalendarioInfo: async (ano: number, mes: number) => {
    const response = await api.get(`/sintomas/calendario`, {
      params: { ano, mes },
    });
    return response.data;
  },
  getSintomasDia: async (data: string) => {
    const response = await api.get(`/sintomas/dia`, {
      params: { data },
    });
    return response.data;
  },
  adicionar: async (dto: CreateSintomaDTO) => {
    const response = await api.post("/sintomas", dto);
    return response.data;
  },
  atualizar: async (id: number, dto: UpdateSintomaDTO) => {
    const response = await api.put(`/sintomas/${id}`, dto);
    return response.data;
  },
  excluir: async (id: number) => {
    const response = await api.delete(`/sintomas/${id}`);
    return response.data;
  },
};
