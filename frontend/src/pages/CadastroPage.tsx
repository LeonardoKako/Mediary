import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { toast } from "react-toastify";
import { registerSchema } from "../features/auth/authSchema";
import { ZodError } from "zod";
import {
  ChevronLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

export const CadastroPage = () => {
  const navigate = useNavigate();
  const setMockUser = useAuthStore((state) => state.setMockUser);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      registerSchema.parse({ nome, email, senha });

      setTimeout(() => {
        setMockUser();
        toast.success("Conta criada com sucesso! Bem-vindo!");
        navigate("/");
        setLoading(false);
      }, 1000);
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error("Por favor, preencha todos os campos corretamente.");
      } else {
        toast.error("Erro ao criar conta");
      }
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col h-full min-h-screen bg-brand-blue overflow-hidden'>
      {/* Cabeçalho */}
      <div className='flex-[0.25] flex flex-col justify-center items-center py-4 px-6 relative'>
        <button
          onClick={() => navigate(-1)}
          className='absolute left-6 top-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-all z-30'
        >
          <ChevronLeft size={24} />
        </button>

        <div className='relative z-10 flex flex-col items-center'>
          <div className='bg-brand-navy p-4 rounded-3xl shadow-2xl transform rotate-3 flex items-center justify-center border-4 border-white/10 scale-90'>
            <UserPlus size={50} className='text-brand-blue' strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Contêiner do Formulário */}
      <div className='flex-[0.75] bg-gray-50 rounded-t-[40px] shadow-2xl px-8 pt-10 pb-6 flex flex-col animate-slide-up relative z-20'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-black text-brand-navy tracking-widest uppercase'>
            Cadastro
          </h1>
          <p className='text-gray-400 text-sm font-medium mt-1'>
            Crie sua conta para começar
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className='w-full space-y-5 max-w-sm mx-auto'
        >
          <div className='relative group shadow-sm'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors'>
              <User size={20} />
            </div>
            <Input
              type='text'
              placeholder='Nome Completo'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className='pl-12 bg-white! shadow-lg! border-none py-4 text-base'
            />
          </div>

          <div className='relative group shadow-sm'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors'>
              <Mail size={20} />
            </div>
            <Input
              type='email'
              placeholder='E-mail'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='pl-12 bg-white! shadow-lg! border-none py-4 text-base'
            />
          </div>

          <div className='relative group shadow-sm'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors'>
              <Lock size={20} />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder='Senha'
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className='pl-12 pr-12 bg-white! shadow-lg! border-none py-4 text-base'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-navy transition-colors'
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className='pt-6'>
            <Button
              type='submit'
              isLoading={loading}
              className='text-white! py-5 shadow-[0_8px_0_0_var(--color-brand-blue-dark)] active:translate-y-[8px] active:shadow-none transition-all'
            >
              CRIAR CONTA
            </Button>
          </div>
        </form>

        <div className='mt-auto pt-6 text-center'>
          <p className='text-brand-navy text-[15px] font-medium opacity-80'>
            Já possui uma conta?{" "}
            <button
              type='button'
              onClick={() => navigate("/login")}
              className='text-brand-blue font-black hover:underline underline-offset-4'
            >
              Fazer Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
