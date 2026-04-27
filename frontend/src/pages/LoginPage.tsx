import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { toast } from "react-toastify";
import { loginSchema } from "../features/auth/authSchema";
import { ZodError } from "zod";
import { Calendar, Mail, Lock, Eye, EyeOff } from "lucide-react";

export const LoginPage = () => {
  const navigate = useNavigate();
  const setMockUser = useAuthStore((state) => state.setMockUser);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      loginSchema.parse({ email, senha });

      // Simular delay de API
      setTimeout(() => {
        setMockUser();
        toast.success("Bem-vindo de volta!");
        navigate("/");
        setLoading(false);
      }, 800);
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error("Por favor, verifique seus dados.");
      } else {
        toast.error("Erro ao fazer login");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-brand-blue overflow-hidden">
      {/* Cabeçalho com Ícone */}
      <div className="flex-[0.3] flex flex-col justify-center items-center py-4 px-6 relative">
        {/* Placeholder para o fundo decorado */}
        <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4 overflow-hidden pointer-events-none">
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="bg-brand-navy p-5 rounded-3xl shadow-2xl transform rotate-[-2deg] flex items-center justify-center border-4 border-white/10 scale-90">
                <div className="relative">
                    <Calendar size={70} className="text-brand-blue" strokeWidth={1.5} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[10%] flex items-center justify-center">
                        <div className="w-7 h-7 flex items-center justify-center">
                             <div className="absolute w-full h-1.5 bg-brand-navy rounded-full"></div>
                             <div className="absolute h-full w-1.5 bg-brand-navy rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Contêiner do Formulário */}
      <div className="flex-[0.7] bg-gray-50 rounded-t-[40px] shadow-2xl px-8 pt-12 pb-6 flex flex-col items-center animate-slide-up relative z-20">
        <h1 className="text-3xl font-black text-brand-navy mb-8 tracking-[0.2em] uppercase">
          Login
        </h1>

        <form onSubmit={handleLogin} className="w-full space-y-6 max-w-sm">
          <div className="relative group shadow-sm">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors">
              <Mail size={20} />
            </div>
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 !bg-white !shadow-lg border-none py-4 text-base"
            />
          </div>

          <div className="relative group shadow-sm">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors">
              <Lock size={20} />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="pl-12 pr-12 !bg-white !shadow-lg border-none py-4 text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-navy transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-end w-full px-1">
            <button
              type="button"
              onClick={() => navigate("/esqueci-senha")}
              className="text-sm text-brand-teal-light font-bold hover:text-brand-blue transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>

          <div className="pt-4 pb-2">
            <Button 
                type="submit" 
                isLoading={loading} 
                className="!text-white py-5 shadow-[0_8px_0_0_var(--color-brand-blue-dark)] active:translate-y-[8px] active:shadow-none transition-all"
            >
              ENTRAR
            </Button>
          </div>
        </form>

        <div className="mt-auto pt-6 text-center">
          <p className="text-brand-navy text-[15px] font-medium opacity-80">
            Ainda não tem uma conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/cadastro")}
              className="text-brand-blue font-black hover:underline underline-offset-4"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

