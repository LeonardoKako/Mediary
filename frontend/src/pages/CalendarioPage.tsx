import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSintomasStore } from "../store/useSintomasStore";
import { useAuthStore } from "../store/useAuthStore";
import { Calendar as CalendarIcon, User, Plus } from "lucide-react";
import { Calendar } from "../components/Calendar";
import { BottomSheetAddSintoma } from "../components/BottomSheetAddSintoma";
import { ModalViewSintomas } from "../components/ModalViewSintomas";

export const CalendarioPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { loadMockSintomas, sintomas, selectedDate, setSelectedDate } =
    useSintomasStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    loadMockSintomas();
  }, [loadMockSintomas]);

  const sintomasDoDia = sintomas.filter((s) => {
    const sDate = new Date(s.inicio);
    return (
      sDate.getDate() === selectedDate.getDate() &&
      sDate.getMonth() === selectedDate.getMonth() &&
      sDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className='flex flex-col h-full min-h-screen bg-brand-blue relative overflow-hidden'>
      {/* Header */}
      <div className='pt-12 px-6 pb-6 flex justify-between items-center'>
        <button
          onClick={() => setSelectedDate(new Date())}
          className='w-14 h-14 border-[2px] border-brand-navy rounded-xl flex items-center justify-center relative bg-transparent text-brand-navy active:scale-95 transition-transform'
        >
          <CalendarIcon size={32} strokeWidth={1.5} />
          <div className='absolute inset-0 flex items-center justify-center translate-y-1'>
            <Plus size={16} strokeWidth={4} />
          </div>
        </button>
        <button
          onClick={() => navigate("/configuracoes")}
          className='w-14 h-14 bg-brand-navy rounded-full flex items-center justify-center text-brand-blue active:scale-95 transition-transform shadow-md'
        >
          <User size={32} strokeWidth={1.5} />
        </button>
      </div>

      <div className='flex-1 px-6'>
        <Calendar />

        {/* Botão de Ver Sintomas do Dia */}
        <div className='mt-2 flex justify-center animate-fade-in min-h-[48px]'>
          {sintomasDoDia.length > 0 && (
            <button
              onClick={() => setIsViewOpen(true)}
              className='bg-brand-navy text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all text-sm'
            >
              VER SINTOMAS ({sintomasDoDia.length})
            </button>
          )}
        </div>
      </div>

      {/* Bottom Area with + */}
      <div className='bg-gray-50 rounded-t-[40px] pt-4 pb-8 flex justify-center w-full mt-auto relative z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]'>
        <button
          onClick={() => setIsAddOpen(true)}
          className='text-brand-blue flex items-center justify-center w-full active:scale-95 transition-transform'
        >
          <Plus size={80} strokeWidth={1.5} />
        </button>
      </div>

      <BottomSheetAddSintoma
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      <ModalViewSintomas
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />
    </div>
  );
};
