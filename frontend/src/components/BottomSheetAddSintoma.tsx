import React, { useState } from "react";
import {
  ChevronDown,
  Frown,
  Flame,
  BatteryWarning,
  Dna,
  Wind,
  Thermometer,
  Bug,
  Activity,
  CircleDot,
  MoreHorizontal,
} from "lucide-react";
import { useSintomasStore } from "../store/useSintomasStore";
import { Button } from "./Button";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SINTOMAS = [
  { id: "DOR", label: "DOR", icon: Activity, hasSubtypes: true },
  { id: "NAUSEA", label: "NAÚSEA", icon: Frown },
  { id: "FADIGA", label: "FADIGA", icon: BatteryWarning },
  { id: "VERTIGEM", label: "VERTIGEM", icon: CircleDot },
  { id: "FALTA_DE_AR", label: "FALTA DE AR", icon: Wind },
  { id: "TOSSE", label: "TOSSE", icon: Thermometer },
  { id: "DIARREIA", label: "DIARRÉIA", icon: Bug },
  { id: "CONSTIPACAO", label: "CONSTIPAÇÃO", icon: Dna },
  { id: "COCEIRA", label: "COCEIRA", icon: Flame },
  { id: "OUTRO", label: "OUTRO", icon: MoreHorizontal },
];

const SUBTIPOS_DOR = [
  "CABEÇA",
  "ABDOMINAL",
  "MUSCULAR",
  "COSTAS",
  "GARGANTA",
  "ARTICULAÇÃO",
  "OUTRO",
];

export const BottomSheetAddSintoma: React.FC<Props> = ({ isOpen, onClose }) => {
  const { adicionarSintoma, selectedDate, fetchCalendarioInfo } =
    useSintomasStore();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const [isSubtypeModalOpen, setIsSubtypeModalOpen] = useState(false);
  const [outroText, setOutroText] = useState("");
  const [loading, setLoading] = useState(false);

  const [addDate, setAddDate] = useState("");
  const [addTime, setAddTime] = useState("");

  const [fimDate, setFimDate] = useState("");
  const [fimTime, setFimTime] = useState("");

  React.useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      setAddDate(`${year}-${month}-${day}`);

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setAddTime(`${hours}:${minutes}`);

      setFimDate("");
      setFimTime("");
    }
  }, [isOpen, selectedDate]);

  const handleSave = async () => {
    if (!selectedType) return;
    setLoading(true);

    const parseFormatted = (dateStr: string, timeStr: string) => {
      if (!dateStr) return null;
      // Retorna formato local YYYY-MM-DD HH:mm:ss para evitar problemas de fuso horário no SQLite
      return `${dateStr} ${timeStr || "00:00"}:00`;
    };

    try {
      const dataInicio =
        parseFormatted(addDate, addTime) || new Date().toISOString();
      const dataFim = parseFormatted(fimDate, fimTime);

      await adicionarSintoma({
        tipo: selectedType,
        subtipo: selectedSubtype || null,
        descricao: outroText || null,
        inicio: dataInicio,
        fim: dataFim,
      });

      // Recarrega o calendário
      const d = new Date(dataInicio);
      fetchCalendarioInfo(d.getFullYear(), d.getMonth() + 1);

      toast.success("Sintoma registrado!");
      handleClose();
    } catch (error) {
      toast.error("Erro ao salvar sintoma");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedType(null);
    setSelectedSubtype(null);
    setOutroText("");
    setIsSubtypeModalOpen(false);
    onClose();
  };

  const handleSintomaClick = (sintomaId: string, hasSubtypes?: boolean) => {
    setSelectedType(sintomaId);
    if (hasSubtypes) {
      setIsSubtypeModalOpen(true);
    } else {
      setSelectedSubtype(null);
    }
    setOutroText("");
  };

  if (!isOpen) return null;

  const isOutroActive = selectedType === "OUTRO" || selectedSubtype === "OUTRO";
  const isSaveDisabled =
    !selectedType ||
    (selectedType === "DOR" && !selectedSubtype) ||
    (isOutroActive && outroText.trim().length === 0);

  return (
    <>
      <div
        className='fixed inset-0 bg-black/40 z-40 animate-fade-in'
        onClick={handleClose}
      />

      <div className='fixed bottom-0 left-0 right-0 z-50 bg-gray-50 rounded-t-[40px] px-6 pb-8 pt-4 max-h-[90vh] overflow-y-auto animate-slide-up'>
        <div className='flex justify-center mb-2'>
          <button onClick={handleClose} className='p-2 text-brand-blue'>
            <ChevronDown size={40} strokeWidth={3} />
          </button>
        </div>

        <div className='space-y-4 mb-6 px-4'>
          <div>
            <label className='block text-xs font-black text-brand-navy/60 mb-2 uppercase ml-1 text-center'>
              Quando iniciou?
            </label>
            <div className='flex gap-2 justify-center'>
              <input
                type='date'
                value={addDate}
                onChange={(e) => setAddDate(e.target.value)}
                className='flex-1 max-w-[170px] bg-white border-2 border-gray-200 rounded-2xl px-3 py-4 text-brand-navy font-black text-base outline-none focus:border-brand-blue shadow-sm text-center'
              />
              <input
                type='time'
                value={addTime}
                onChange={(e) => setAddTime(e.target.value)}
                className='w-[110px] bg-white border-2 border-gray-200 rounded-2xl px-2 py-4 text-brand-navy font-black text-base outline-none focus:border-brand-blue shadow-sm text-center'
              />
            </div>
          </div>

          <div className='animate-fade-in'>
            <label className='block text-xs font-black text-brand-navy/60 mb-2 uppercase ml-1 text-center'>
              Quando terminou?{" "}
              <span className='italic font-bold text-[10px] text-gray-400'>
                (opcional)
              </span>
            </label>
            <div className='flex gap-2 justify-center'>
              <input
                type='date'
                value={fimDate}
                onChange={(e) => setFimDate(e.target.value)}
                className='flex-1 max-w-[170px] bg-white border-2 border-gray-200 rounded-2xl px-3 py-4 text-brand-navy font-black text-base outline-none focus:border-brand-blue shadow-sm text-center'
              />
              <input
                type='time'
                value={fimTime}
                onChange={(e) => setFimTime(e.target.value)}
                className='w-[110px] bg-white border-2 border-gray-200 rounded-2xl px-2 py-4 text-brand-navy font-black text-base outline-none focus:border-brand-blue shadow-sm text-center'
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4 mb-6'>
          {SINTOMAS.map((sintoma) => {
            const Icon = sintoma.icon;
            const isSelected = selectedType === sintoma.id;

            return (
              <button
                key={sintoma.id}
                onClick={() =>
                  handleSintomaClick(sintoma.id, sintoma.hasSubtypes)
                }
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 p-2 transition-all duration-200
                  ${isSelected ? "bg-brand-teal-light ring-4 ring-brand-teal ring-opacity-50" : "bg-brand-teal active:scale-95"}
                `}
              >
                <Icon size={32} className='text-white' strokeWidth={1.5} />
                <span className='text-[10px] font-bold text-white text-center leading-tight'>
                  {sintoma.label}
                </span>

                {/* Mostra o subtipo selecionado caso exista */}
                {isSelected && selectedSubtype && sintoma.hasSubtypes && (
                  <div className='absolute -bottom-2 bg-white text-brand-navy text-[9px] font-black px-2 py-1 rounded-full shadow-md truncate max-w-[90%] border border-gray-200'>
                    {selectedSubtype}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {isOutroActive && (
          <div className='mb-6 animate-fade-in'>
            <input
              type='text'
              placeholder='Digite qual é o sintoma...'
              value={outroText}
              onChange={(e) => setOutroText(e.target.value)}
              className='w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-brand-navy font-medium focus:border-brand-blue outline-none transition-colors'
            />
          </div>
        )}

        <div className='pt-2'>
          <Button
            onClick={handleSave}
            disabled={isSaveDisabled}
            isLoading={loading}
          >
            ADICIONAR
          </Button>
        </div>
      </div>

      {/* Modal Interno de Subtipo */}
      {isSubtypeModalOpen && (
        <>
          <div
            className='fixed inset-0 bg-black/50 z-[60] animate-fade-in'
            onClick={() => setIsSubtypeModalOpen(false)}
          />
          <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[70] w-[85%] max-w-sm rounded-3xl p-6 shadow-2xl animate-fade-in'>
            <h3 className='text-center font-black text-brand-navy mb-6 text-xl'>
              Qual tipo de dor?
            </h3>
            <div className='flex flex-wrap gap-3 justify-center mb-2'>
              {SUBTIPOS_DOR.map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubtype(sub);
                    setOutroText(""); // limpa o texto caso o usuário troque
                    setIsSubtypeModalOpen(false);
                  }}
                  className={`px-4 py-2 rounded-xl border-2 font-bold transition-all
                    ${
                      selectedSubtype === sub
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-gray-200 text-brand-navy hover:border-brand-blue"
                    }
                  `}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};
