import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { toast } from 'react-toastify';
import { loginSchema } from '../features/auth/authSchema';
import { z, ZodError } from 'zod';

export const LoginPage = () => {
  const navigate = useNavigate();
  const setMockUser = useAuthStore(state => state.setMockUser);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      loginSchema.parse({ email, senha });
      
      // Simular delay de API
      setTimeout(() => {
        setMockUser();
        toast.success("Login realizado com sucesso!");
        navigate('/');
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro ao fazer login");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen px-6 py-12 bg-white">
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Placeholder para a logo - no design geralmente há uma logo aqui */}
        <div className="w-32 h-32 bg-gray-100 rounded-full mb-8 flex items-center justify-center">
          <span className="text-brand-blue font-bold text-2xl">MEDIARY</span>
        </div>
        
        <h1 className="text-2xl font-bold text-brand-navy mb-8">Faça seu Login</h1>
        
        <form onSubmit={handleLogin} className="w-full space-y-5">
          <Input 
            type="email" 
            placeholder="E-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            type="password" 
            placeholder="Senha" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          
          <div className="flex justify-end w-full">
            <button type="button" className="text-sm text-brand-blue font-medium mt-1">
              Esqueci minha senha
            </button>
          </div>
          
          <div className="pt-6">
            <Button type="submit" isLoading={loading}>
              ENTRAR
            </Button>
          </div>
        </form>
        
        <div className="mt-8">
          <p className="text-brand-navy text-sm">
            Ainda não tem conta?{' '}
            <button 
              type="button" 
              onClick={() => navigate('/cadastro')} 
              className="text-brand-blue font-bold"
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
