/**
 * Tipo completo do Sintoma conforme retornado pelo Backend
 */
export interface Sintoma {
  id: number;
  usuario_id: number;
  tipo: string;
  subtipo: string | null;
  descricao: string | null;
  inicio: string;
  fim: string | null;
  criado_em: string;
  atualizado_em: string;
}

/**
 * DTO para Criação de Sintoma
 * (O backend cuida do id, usuario_id e timestamps)
 */
export interface CreateSintomaDTO {
  tipo: string;
  subtipo: string | null;
  descricao: string | null;
  inicio: string;
  fim: string | null;
}

/**
 * DTO para Atualização de Sintoma
 * (Permite atualizar apenas alguns campos)
 */
export interface UpdateSintomaDTO {
  tipo?: string;
  subtipo?: string | null;
  descricao?: string | null;
  inicio?: string;
  fim?: string | null;
}
