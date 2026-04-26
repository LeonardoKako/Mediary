import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { toast } from 'react-toastify';
import { registerSchema } from '../features/auth/authSchema';
import { z, ZodError } from 'zod';
import { ChevronLeft } from 'lucide-react';

export const CadastroPage = () => {
  const navigate = useNavigate();
  const setMockUser = useAuthStore(state => state.setMockUser);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      registerSchema.parse({ nome, email, senha });
      
      setTimeout(() => {
        setMockUser();
        toast.success("Conta criada com sucesso!");
        navigate('/');
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro ao criar conta");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-white">
      <div className="pt-12 px-6 pb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-brand-navy"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-12">
        <h1 className="text-2xl font-bold text-brand-navy mb-2">Criar nova conta</h1>
        <p className="text-gray-500 text-sm mb-8">Por favor, preencha os dados abaixo</p>
        
        <form onSubmit={handleRegister} className="w-full space-y-5">
          <Input 
            type="text" 
            placeholder="Nome Completo" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
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
          
          <div className="pt-8">
            <Button type="submit" isLoading={loading}>
              CRIAR CONTA
            </Button>
          </div>
        </form>
        
        <div className="mt-8 flex justify-center w-full">
          <p className="text-brand-navy text-sm">
            Já possui uma conta?{' '}
            <button 
              type="button" 
              onClick={() => navigate('/login')} 
              className="text-brand-blue font-bold"
            >
              Fazer Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
