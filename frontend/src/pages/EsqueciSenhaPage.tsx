import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { toast } from "react-toastify";
import { ChevronLeft, Mail, KeyRound } from "lucide-react";

export const EsqueciSenhaPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, informe seu e-mail.");
      return;
    }

    setLoading(true);

    // Simular envio de e-mail
    setTimeout(() => {
      setSent(true);
      toast.success("E-mail de recuperação enviado!");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-brand-blue overflow-hidden">
      {/* Cabeçalho */}
      <div className="flex-[0.3] flex flex-col justify-center items-center py-4 px-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-all z-30"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-brand-navy p-5 rounded-3xl shadow-2xl transform rotate-[-5deg] flex items-center justify-center border-4 border-white/10 scale-90">
            <KeyRound size={60} className="text-brand-blue" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Contêiner do Formulário */}
      <div className="flex-[0.7] bg-gray-50 rounded-t-[40px] shadow-2xl px-8 pt-12 pb-6 flex flex-col animate-slide-up relative z-20">
        {!sent ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-2xl font-black text-brand-navy tracking-[0.1em] uppercase leading-tight">
                Recuperar<br />Senha
              </h1>
              <p className="text-gray-400 text-sm font-medium mt-3 px-4">
                Informe seu e-mail para receber as instruções de recuperação
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6 max-w-sm mx-auto">
              <div className="relative group shadow-sm">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors">
                  <Mail size={20} />
                </div>
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 !bg-white !shadow-lg border-none py-4 text-base"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  isLoading={loading}
                  className="!text-white py-5 shadow-[0_8px_0_0_var(--color-brand-blue-dark)] active:translate-y-[8px] active:shadow-none transition-all"
                >
                  ENVIAR E-MAIL
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Mail size={40} />
            </div>
            <h2 className="text-2xl font-black text-brand-navy mb-4">E-mail Enviado!</h2>
            <p className="text-gray-500 mb-10 px-6">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <Button 
                onClick={() => navigate("/login")}
                className="!text-white max-w-[200px]"
            >
                VOLTAR AO LOGIN
            </Button>
          </div>
        )}

        <div className="mt-auto pt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-brand-navy text-[15px] font-bold opacity-60 hover:opacity-100 transition-opacity"
            >
              Lembrei minha senha
            </button>
        </div>
      </div>
    </div>
  );
};
