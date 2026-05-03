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
  const { setSelectedDate } = useSintomasStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // const sintomasDoDia = sintomas.filter((s) => {
  //   const sDate = new Date(s.inicio);
  //   return (
  //     sDate.getDate() === selectedDate.getDate() &&
  //     sDate.getMonth() === selectedDate.getMonth() &&
  //     sDate.getFullYear() === selectedDate.getFullYear()
  //   );
  // });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className='flex flex-col h-full bg-brand-blue relative overflow-hidden'>
      {/* Header */}
      <div className='pt-8 px-6 pb-4 flex flex-col gap-4 animate-fade-in'>
        <div className='flex justify-between items-center'>
          <button
            onClick={() => setSelectedDate(new Date())}
            className='w-11 h-11 border-2 border-white/20 rounded-2xl flex items-center justify-center bg-white/10 text-white active:scale-90 transition-all shadow-lg backdrop-blur-sm group'
            title='Ir para hoje'
          >
            <CalendarIcon
              size={22}
              strokeWidth={2}
              className='group-hover:scale-110 transition-transform'
            />
          </button>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => navigate("/configuracoes")}
              className='w-11 h-11 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-blue active:scale-90 transition-all shadow-xl border-2 border-brand-blue-dark/30'
            >
              <User size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-0.5'>
          <h1 className='text-white text-xl font-black flex items-center gap-2'>
            {getGreeting()},{" "}
            <span className='text-brand-navy underline decoration-brand-blue-dark decoration-4 underline-offset-4'>
              {user?.nome?.split(" ")[0] || "Paciente"}
            </span>
            !
          </h1>
          <p className='text-white/70 text-xs font-bold flex items-center gap-2'>
            <span className='w-1.5 h-1.5 bg-brand-navy rounded-full animate-pulse'></span>
            Como você está se sentindo hoje?
          </p>
        </div>
      </div>

      <div className='flex-1 px-6 bg-transparent overflow-hidden flex flex-col justify-center'>
        <div className='scale-[0.95] origin-top'>
          <Calendar onDayClick={() => setIsViewOpen(true)} />
        </div>
      </div>

      {/* Bottom Area with + */}
      <div className='bg-gray-50 rounded-t-[40px] pt-2 pb-6 flex justify-center w-full mt-auto relative z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]'>
        <button
          onClick={() => setIsAddOpen(true)}
          className='text-brand-blue flex items-center justify-center w-full active:scale-95 transition-transform'
        >
          <Plus size={64} strokeWidth={1.5} />
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
