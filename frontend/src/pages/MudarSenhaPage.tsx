import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";

export const MudarSenhaPage = () => {
  const { user, updateSenha } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.", { position: "top-center" });
      return;
    }

    if (novaSenha.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);
    try {
      await updateSenha(senhaAtual, novaSenha);
      toast.success("Senha alterada com sucesso!", { position: "top-center" });
      navigate("/configuracoes");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erro ao alterar senha", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-brand-blue pt-12 pb-16 px-6 rounded-b-[40px] shadow-sm'>
        <div className='flex items-center relative w-full h-10'>
          <button
            onClick={() => navigate("/configuracoes")}
            className='absolute left-0 w-10 h-10 bg-white/20 flex items-center justify-center rounded-full text-brand-navy active:scale-95 transition-transform'
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className='flex-1 text-center text-xl font-black text-brand-navy tracking-widest uppercase'>
            Mudar Senha
          </h1>
        </div>
      </div>
      <div className='px-6 -mt-16 flex flex-col items-center mb-8'>
        <div className='w-32 h-32 bg-white rounded-full p-1 shadow-lg mb-4'>
          <div className='w-full h-full bg-brand-teal rounded-full overflow-hidden flex items-center justify-center'>
            {/* Foto Mockada - Pode ser substituída por uma tag img no futuro */}
            <span className='text-white text-4xl font-black'>
              {user?.nome?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </div>
        <h2 className='text-2xl font-black text-brand-navy'>
          {user?.nome || "Usuário"}
        </h2>
        <p className='text-gray-500 font-medium'>
          {user?.email || ""}
        </p>
      </div>
      {/* Formulário */}
      <div className='p-6 flex-1 flex flex-col -mt-6 relative z-10'>
        <form onSubmit={handleSave} className='space-y-6 flex-1 flex flex-col'>
          <div className='space-y-4'>
            <Input
              label='Senha Atual'
              type='password'
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder='Digite sua senha atual'
            />
            <Input
              label='Nova Senha'
              type='password'
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder='No mínimo 6 caracteres'
            />
            <Input
              label='Confirmar Nova Senha'
              type='password'
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder='Repita a nova senha'
            />
          </div>

          <div className='mt-auto pt-6 pb-6'>
            <Button type='submit' className='w-full' isLoading={loading}>
              ATUALIZAR SENHA
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
