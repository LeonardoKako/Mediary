import React, { useState } from 'react';
import { useSintomasStore } from '../store/useSintomasStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Calendar: React.FC = () => {
  const { selectedDate, setSelectedDate } = useSintomasStore();
  
  // Estado para controlar qual mês estamos visualizando
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  // Sincronizar visualização quando a data selecionada mudar externamente
  React.useEffect(() => {
    setViewDate(new Date(selectedDate));
  }, [selectedDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const prevMonthDays = Array.from({ length: firstDay }, (_, i) => daysInPrevMonth - firstDay + i + 1);
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const nextMonthDaysLength = 42 - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = Array.from({ length: nextMonthDaysLength }, (_, i) => i + 1);

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayClick = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
  };

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-8 px-2">
        <button onClick={handlePrevMonth} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-navy shadow-sm active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-brand-navy font-bold text-xl">{monthNames[month]} {year}</h2>
        <button onClick={handleNextMonth} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-navy shadow-sm active:scale-95 transition-transform">
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 gap-y-4 text-center mb-4">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
           <div key={`weekday-${i}`} className="text-brand-navy/60 text-sm font-bold">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-6 text-center mb-6">
        {prevMonthDays.map((day, i) => (
          <div key={`prev-${i}`} className="h-12 flex items-center justify-center text-brand-navy/30 text-xl font-medium">
            {day}
          </div>
        ))}

        {currentMonthDays.map(day => {
          const isSelected = selectedDate.getDate() === day && 
                             selectedDate.getMonth() === month && 
                             selectedDate.getFullYear() === year;
          
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`h-12 flex items-center justify-center text-xl font-medium transition-all mx-auto w-12
                ${isSelected ? 'bg-brand-active text-white rounded-2xl ring-2 ring-brand-active ring-offset-2 ring-offset-brand-blue' : 'text-brand-navy hover:bg-black/5 rounded-2xl'}
              `}
            >
              {day}
            </button>
          );
        })}

        {nextMonthDays.map((day, i) => (
          <div key={`next-${i}`} className="h-12 flex items-center justify-center text-brand-navy/30 text-xl font-medium">
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};
