import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { toast } from "react-toastify";

export const EditarPerfilPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect with backend later
    toast.success("Perfil atualizado com sucesso!", { position: "top-center" });
    navigate(-1);
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-brand-blue pt-12 pb-16 px-6 rounded-b-[40px] shadow-sm'>
        <div className='flex items-center relative w-full h-10'>
          <button
            onClick={() => navigate(-1)}
            className='absolute left-0 w-10 h-10 bg-white/20 flex items-center justify-center rounded-full text-brand-navy active:scale-95 transition-transform'
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className='flex-1 text-center text-xl font-black text-brand-navy tracking-widest uppercase'>
            Editar Perfil
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
          {user?.email || "usuario@mediary.com"}
        </p>
      </div>
      {/* Formulário */}
      <div className='p-6 flex-1 flex flex-col'>
        <form onSubmit={handleSave} className='space-y-6 flex-1 flex flex-col'>
          <div className='space-y-4'>
            <Input
              label='Nome Completo'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder='Seu nome'
            />
            <Input
              label='Email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='seu@email.com'
            />
          </div>

          <div className='mt-auto pt-6 pb-6'>
            <Button type='submit' className='w-full'>
              SALVAR ALTERAÇÕES
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
