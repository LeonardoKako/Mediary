import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string().email(),
  criado_em: z.string()
});

export type User = z.infer<typeof userSchema>;

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

export type RegisterForm = z.infer<typeof registerSchema>;
