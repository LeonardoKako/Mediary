import React, { useState } from "react";
import {
  X,
  Edit2,
  ArrowLeft,
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
  RefreshCw,
} from "lucide-react";
import { useSintomasStore } from "../store/useSintomasStore";
import { Button } from "./Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const getIconForType = (tipo: string) => {
  switch (tipo) {
    case "DOR":
      return Activity;
    case "NAUSEA":
      return Frown;
    case "FADIGA":
      return BatteryWarning;
    case "VERTIGEM":
      return CircleDot;
    case "FALTA_DE_AR":
      return Wind;
    case "TOSSE":
      return Thermometer;
    case "DIARREIA":
      return Bug;
    case "CONSTIPACAO":
      return Dna;
    case "COCEIRA":
      return Flame;
    case "CONTINUO":
      return RefreshCw;
    default:
      return MoreHorizontal;
  }
};

export const ModalViewSintomas: React.FC<Props> = ({ isOpen, onClose }) => {
  const { sintomas, selectedDate, removeSintoma, updateSintoma } =
    useSintomasStore();

  const [editingSintomaId, setEditingSintomaId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // States for the edit form
  const [editDateInicio, setEditDateInicio] = useState("");
  const [editTimeInicio, setEditTimeInicio] = useState("");
  const [editDateFim, setEditDateFim] = useState("");
  const [editTimeFim, setEditTimeFim] = useState("");
  const [editDescricao, setEditDescricao] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setEditingSintomaId(null);
    setConfirmDeleteId(null);
    onClose();
  };

  const handleEditClick = (sintoma: any) => {
    setEditingSintomaId(sintoma.id);
    setConfirmDeleteId(null);
    setEditDescricao(sintoma.descricao || "");

    const d = new Date(sintoma.inicio);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setEditDateInicio(`${year}-${month}-${day}`);

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    setEditTimeInicio(`${hours}:${minutes}`);

    if (sintoma.fim) {
      const df = new Date(sintoma.fim);
      const fYear = df.getFullYear();
      const fMonth = String(df.getMonth() + 1).padStart(2, "0");
      const fDay = String(df.getDate()).padStart(2, "0");
      setEditDateFim(`${fYear}-${fMonth}-${fDay}`);

      const fHours = String(df.getHours()).padStart(2, "0");
      const fMinutes = String(df.getMinutes()).padStart(2, "0");
      setEditTimeFim(`${fHours}:${fMinutes}`);
    } else {
      setEditDateFim("");
      setEditTimeFim("");
    }
  };

  const handleSaveEdit = () => {
    if (!editingSintomaId) return;

    const parseFormatted = (dateStr: string, timeStr: string) => {
      if (!dateStr) return null;
      const [year, month, day] = dateStr.split("-");
      const [hour, minute] = (timeStr || "00:00").split(":");
      const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
      );
      return date.toISOString();
    };

    updateSintoma(editingSintomaId, {
      inicio:
        parseFormatted(editDateInicio, editTimeInicio) ||
        new Date().toISOString(),
      fim: parseFormatted(editDateFim, editTimeFim),
      descricao: editDescricao || null,
      atualizado_em: new Date().toISOString(),
    });
    setEditingSintomaId(null);
  };

  const sintomasDoDia = sintomas.filter((s) => {
    const sInicio = new Date(s.inicio);
    const sFim = s.fim ? new Date(s.fim) : null;
    
    // Normalizar datas para comparação (apenas dia, mês, ano)
    const d = new Date(selectedDate);
    d.setHours(0, 0, 0, 0);
    
    const inicio = new Date(sInicio);
    inicio.setHours(0, 0, 0, 0);
    
    if (!sFim) {
      return d.getTime() === inicio.getTime();
    }
    
    const fim = new Date(sFim);
    fim.setHours(0, 0, 0, 0);
    
    return d.getTime() >= inicio.getTime() && d.getTime() <= fim.getTime();
  });

  const editingSintoma = sintomas.find((s) => s.id === editingSintomaId);

  return (
    <>
      <div
        className='fixed inset-0 bg-black/40 z-40 animate-fade-in'
        onClick={handleClose}
      />

      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[94%] max-w-sm bg-gray-50 rounded-3xl p-6 shadow-xl animate-fade-in border-4 border-white/50'>
        {editingSintomaId && editingSintoma ? (
          // Edit View
          <div className='animate-fade-in'>
            <div className='flex justify-between items-center mb-6'>
              <button
                onClick={() => setEditingSintomaId(null)}
                className='p-2 bg-gray-200 rounded-full text-brand-navy active:scale-90 transition-transform'
              >
                <ArrowLeft size={20} strokeWidth={3} />
              </button>
              <h2 className='text-xl font-black text-brand-navy uppercase tracking-tight'>
                Editar Sintoma
              </h2>
              <div className='w-10'></div>
            </div>

            <div className='bg-brand-blue/10 p-5 rounded-3xl mb-6 shadow-inner ring-1 ring-white'>
              <div className='flex items-center gap-3'>
                <div className='bg-brand-blue p-2 rounded-xl text-white'>
                  {React.createElement(getIconForType(editingSintoma.tipo), {
                    size: 24,
                    strokeWidth: 2.5,
                  })}
                </div>
                <div>
                  <p className='font-black text-brand-navy text-xl uppercase tracking-tighter'>
                    {editingSintoma.tipo}
                  </p>
                  {editingSintoma.subtipo && (
                    <p className='text-sm font-black text-gray-400'>
                      {editingSintoma.subtipo}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className='space-y-5 mb-8'>
              <div>
                <label className='block text-xs font-black text-brand-navy/60 mb-2 uppercase ml-1'>
                  Iniciou em:
                </label>
                <div className='flex gap-2'>
                  <input
                    type='date'
                    value={editDateInicio}
                    onChange={(e) => setEditDateInicio(e.target.value)}
                    className='flex-1 bg-white border-2 border-gray-200 rounded-2xl px-3 py-4 text-brand-navy font-bold text-sm outline-none focus:border-brand-blue shadow-sm'
                  />
                  <input
                    type='time'
                    value={editTimeInicio}
                    onChange={(e) => setEditTimeInicio(e.target.value)}
                    className='w-[110px] bg-white border-2 border-gray-200 rounded-2xl px-2 py-4 text-brand-navy font-bold text-sm outline-none focus:border-brand-blue shadow-sm text-center'
                  />
                </div>
              </div>

              <div className='animate-fade-in'>
                <label className='block text-xs font-black text-brand-navy/60 mb-2 uppercase ml-1'>
                  Terminou em{" "}
                  <span className='italic text-[10px] text-gray-400 font-bold'>
                    (opcional)
                  </span>
                  :
                </label>
                <div className='flex gap-2'>
                  <input
                    type='date'
                    value={editDateFim}
                    onChange={(e) => setEditDateFim(e.target.value)}
                    className='flex-1 bg-white border-2 border-gray-200 rounded-2xl px-3 py-4 text-brand-navy font-bold text-sm outline-none focus:border-brand-blue shadow-sm'
                  />
                  <input
                    type='time'
                    value={editTimeFim}
                    onChange={(e) => setEditTimeFim(e.target.value)}
                    className='w-[110px] bg-white border-2 border-gray-200 rounded-2xl px-2 py-4 text-brand-navy font-bold text-sm outline-none focus:border-brand-blue shadow-sm text-center'
                  />
                </div>
              </div>


              <div className='animate-fade-in'>
                <label className='block text-xs font-black text-brand-navy/60 mb-2 uppercase ml-1'>
                  Observações:
                </label>
                <textarea
                  value={editDescricao}
                  onChange={(e) => setEditDescricao(e.target.value)}
                  placeholder='Detalhes sobre o sintoma...'
                  className='w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 text-brand-navy font-medium text-sm outline-none focus:border-brand-blue shadow-sm min-h-[80px] resize-none'
                />
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <Button
                onClick={handleSaveEdit}
                className='text-white! shadow-[0_6px_0_0_var(--color-brand-blue-dark)]'
              >
                SALVAR ALTERAÇÕES
              </Button>
              <button
                onClick={() => {
                  if (confirmDeleteId === editingSintoma.id) {
                    removeSintoma(editingSintoma.id);
                    setEditingSintomaId(null);
                    setConfirmDeleteId(null);
                  } else {
                    setConfirmDeleteId(editingSintoma.id);
                  }
                }}
                className={`w-full py-4 rounded-3xl font-black uppercase tracking-widest text-xs transition-all duration-200 ${
                  confirmDeleteId === editingSintoma.id
                    ? "bg-brand-danger text-white scale-105 shadow-lg"
                    : "bg-red-50/50 text-brand-danger hover:bg-red-50"
                }`}
              >
                {confirmDeleteId === editingSintoma.id
                  ? "CONFIRMAR EXCLUSÃO?"
                  : "EXCLUIR REGISTRO"}
              </button>
            </div>
          </div>
        ) : (
          // List View
          <div className='animate-fade-in'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-lg font-black text-brand-navy'>
                Sintomas do dia {selectedDate.toLocaleDateString()}
              </h2>
              <button
                onClick={handleClose}
                className='p-2 bg-gray-200 rounded-full text-brand-navy'
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {sintomasDoDia.length === 0 ? (
              <div className='text-center py-8 bg-white rounded-2xl'>
                <p className='text-gray-400 font-medium'>
                  Nenhum sintoma registrado neste dia.
                </p>
              </div>
            ) : (
              <div className='space-y-4 max-h-[50vh] overflow-y-auto pr-2 pb-2'>
                {sintomasDoDia.map((sintoma) => {
                  const Icon = getIconForType(sintoma.tipo);
                  // const isConfirming = confirmDeleteId === sintoma.id;

                  return (
                    <div
                      key={sintoma.id}
                      className='bg-white py-6 px-6 rounded-[32px] shadow-sm border-l-[12px] border-brand-blue relative overflow-hidden group hover:bg-gray-50 transition-colors'
                    >
                      <div className='flex flex-col gap-3'>
                        {/* Título Centralizado no Topo */}
                        <div className='border-b border-gray-100 pb-3 text-center'>
                          <p className='font-black text-brand-navy text-xl uppercase tracking-tighter'>
                            {sintoma.tipo.replace(/_/g, " ")}
                          </p>
                        </div>

                        <div className='flex items-center justify-between gap-2 px-2'>
                          {/* Coluna 1: Ícone */}
                          <div className='bg-brand-blue/10 p-3 rounded-2xl text-brand-blue shrink-0 shadow-inner'>
                            <Icon size={24} strokeWidth={2.5} />
                          </div>

                          {/* Coluna 2: Detalhes Centralizados (Data Início e Fim Empilhadas) */}
                          <div className='flex flex-col items-center gap-1.5 flex-1 min-w-0'>
                            <div className="flex flex-col items-center gap-1">
                              <span className='text-[11px] font-black text-[#007AFF] bg-[#007AFF]/10 px-3 py-0.5 rounded-lg shadow-sm border border-[#007AFF]/20'>
                                {new Date(sintoma.inicio).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                  },
                                )}
                              </span>
                              
                              {sintoma.fim && (
                                <span className='text-[11px] font-black text-[#FF3B30] bg-[#FF3B30]/10 px-3 py-0.5 rounded-lg shadow-sm border border-[#FF3B30]/20'>
                                  {new Date(sintoma.fim).toLocaleDateString(
                                    "pt-BR",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                    },
                                  )}
                                </span>
                              )}
                            </div>

                            {sintoma.subtipo && (
                              <p className='text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate max-w-full'>
                                {sintoma.subtipo}
                              </p>
                            )}

                            {sintoma.descricao && (
                              <p className='text-[11px] text-brand-navy/70 font-medium italic mt-1 line-clamp-2 max-w-full'>
                                "{sintoma.descricao}"
                              </p>
                            )}
                          </div>

                          {/* Coluna 3: Ação (Editar) */}
                          <button
                            onClick={() => handleEditClick(sintoma)}
                            className='bg-brand-blue/5 text-brand-blue p-4 rounded-2xl hover:bg-brand-blue hover:text-white transition-all active:scale-90 shadow-sm'
                          >
                            <Edit2 size={24} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
