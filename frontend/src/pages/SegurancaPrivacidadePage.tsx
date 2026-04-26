import { useNavigate } from "react-router-dom";
import { ChevronLeft, Shield, FileText, ChevronRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export const SegurancaPrivacidadePage = () => {
  const { user } = useAuthStore();

  const navigate = useNavigate();

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
            Segurança
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

      {/* Conteúdo */}
      <div className='p-6 flex-1 flex flex-col space-y-6 -mt-6 relative z-10'>
        <div className='flex flex-col items-center py-6 text-brand-navy opacity-50'>
          <Shield
            size={64}
            strokeWidth={1.5}
            className='mb-4 text-brand-teal'
          />
          <p className='text-center text-sm px-4'>
            Gerencie suas configurações de privacidade e segurança para manter
            sua conta do Mediary protegida.
          </p>
        </div>

        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
          <button className='w-full flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50 transition-colors'>
            <div className='flex items-center gap-3'>
              <div className='bg-brand-teal/10 p-2 rounded-xl text-brand-teal'>
                <Shield size={20} />
              </div>
              <div className='text-left'>
                <span className='block font-bold text-brand-navy'>
                  Autenticação em 2 Fatores
                </span>
                <span className='block text-xs text-gray-400'>
                  Proteção extra ativada
                </span>
              </div>
            </div>
            <ChevronRight size={20} className='text-gray-400' />
          </button>

          <button className='w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors'>
            <div className='flex items-center gap-3'>
              <div className='bg-brand-teal/10 p-2 rounded-xl text-brand-teal'>
                <FileText size={20} />
              </div>
              <div className='text-left'>
                <span className='block font-bold text-brand-navy'>
                  Termos de Uso
                </span>
                <span className='block text-xs text-gray-400'>
                  Política de Privacidade
                </span>
              </div>
            </div>
            <ChevronRight size={20} className='text-gray-400' />
          </button>
        </div>
      </div>
    </div>
  );
};
