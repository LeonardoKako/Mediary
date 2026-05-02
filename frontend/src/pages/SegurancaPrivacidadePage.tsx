import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Shield, FileText, ChevronRight, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/Button";

export const SegurancaPrivacidadePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const termosDeUso = `
    1. Aceitação dos Termos
    Ao realizar o cadastro no aplicativo Mediary informando seus dados pessoais, você concorda com os presentes Termos de Uso.

    2. Objetivo do Aplicativo
    O Mediary tem como finalidade o registro de sintomas em um calendário interativo e a manutenção de um histórico médico digital. O aplicativo atua como uma ferramenta de apoio e não substitui diagnósticos, tratamentos ou consultas médicas de emergência.

    3. Privacidade e Proteção de Dados (LGPD)
    A sua privacidade é nossa prioridade. O sistema atende rigorosamente à Lei Geral de Proteção de Dados (LGPD). Seus dados sensíveis e senhas são protegidos utilizando criptografia. Garantimos que apenas usuários autorizados, como você e os médicos vinculados ao seu acompanhamento, tenham acesso às suas informações médicas.

    4. Responsabilidades do Usuário
    O usuário é responsável por manter o sigilo de suas credenciais de login e senha. As informações e sintomas inseridos no sistema são de inteira responsabilidade do usuário, devendo refletir a realidade para o uso adequado da plataforma.

    5. Disponibilidade do Sistema
    Trabalhamos para garantir a estabilidade do sistema e a integridade dos seus dados através de backups automáticos diários. No entanto, o aplicativo pode passar por manutenções periódicas.

    6. Atualização dos Termos
    Estes Termos de Uso podem ser atualizados a qualquer momento para refletir melhorias no aplicativo ou mudanças na legislação.
  `;

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
          <button
            onClick={() => setIsTermsOpen(true)}
            className='w-full flex items-center justify-between p-6 active:bg-gray-50 transition-colors'
          >
            <div className='flex items-center gap-4'>
              <div className='bg-brand-teal/10 p-3 rounded-2xl text-brand-teal'>
                <FileText size={24} />
              </div>
              <div className='text-left'>
                <span className='block font-bold text-brand-navy text-lg'>
                  Termos de Uso
                </span>
                <span className='block text-xs text-gray-400 font-bold'>
                  Política de Privacidade
                </span>
              </div>
            </div>
            <ChevronRight size={24} className='text-gray-400' />
          </button>
        </div>
      </div>

      {/* Modal de Termos de Uso */}
      {isTermsOpen && (
        <>
          <div
            className='fixed inset-0 bg-black/40 z-[60] animate-fade-in'
            onClick={() => setIsTermsOpen(false)}
          />
          <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[70] w-[92%] max-w-sm rounded-[40px] p-8 shadow-2xl animate-fade-in border-4 border-white/50 max-h-[85vh] flex flex-col'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='font-black text-brand-navy text-2xl uppercase tracking-tighter'>
                Termos de Uso
              </h3>
              <button
                onClick={() => setIsTermsOpen(false)}
                className='p-2 bg-gray-100 rounded-full text-brand-navy'
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto pr-2 mb-8 custom-scrollbar'>
              <p className='text-brand-navy font-black mb-4 text-center'>
                Mediary
              </p>
              <div className='space-y-4'>
                {termosDeUso.split("\n\n").map((paragrafo, idx) => (
                  <p
                    key={idx}
                    className='text-sm text-brand-navy/80 font-medium leading-relaxed'
                  >
                    {paragrafo.trim()}
                  </p>
                ))}
              </div>
            </div>

            <Button onClick={() => setIsTermsOpen(false)}>ACEITAR</Button>
          </div>
        </>
      )}
    </div>
  );
};
