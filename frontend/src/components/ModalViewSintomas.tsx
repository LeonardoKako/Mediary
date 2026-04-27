import React, { useState } from "react";
import {
  X,
  Trash2,
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

  // States for the edit form (now as formatted strings)
  const [editDateInicio, setEditDateInicio] = useState("");
  const [editTimeInicio, setEditTimeInicio] = useState("");
  const [editDateFim, setEditDateFim] = useState("");
  const [editTimeFim, setEditTimeFim] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setEditingSintomaId(null);
    onClose();
  };

  // Funções de Máscara
  const maskDate = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove tudo que não é dígito
      .replace(/(\d{2})(\d)/, "$1/$2") // Coloca a primeira barra
      .replace(/(\d{2})(\d)/, "$1/$2") // Coloca a segunda barra
      .replace(/(\d{4})(\d+?$)/, "$1"); // Limita a 8 dígitos
  };

  const maskTime = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1:$2")
      .replace(/(\d{2})(\d+?$)/, "$1"); // Limita a 4 dígitos
  };

  const handleEditClick = (sintoma: any) => {
    setEditingSintomaId(sintoma.id);

    const d = new Date(sintoma.inicio);
    // Formatar para DD/MM/AAAA e HH:mm
    setEditDateInicio(d.toLocaleDateString("pt-BR"));
    setEditTimeInicio(
      d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    );

    if (sintoma.fim) {
      const df = new Date(sintoma.fim);
      setEditDateFim(df.toLocaleDateString("pt-BR"));
      setEditTimeFim(
        df.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      );
    } else {
      setEditDateFim("");
      setEditTimeFim("");
    }
  };

  const handleSaveEdit = () => {
    if (!editingSintomaId) return;

    const parseFormatted = (dateStr: string, timeStr: string) => {
      if (!dateStr || dateStr.length < 10) return null;
      const [day, month, year] = dateStr.split("/");
      const [hour, minute] = (timeStr || "00:00").split(":");
      // Criar data localmente e converter para ISO
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
    });
    setEditingSintomaId(null);
  };

  const sintomasDoDia = sintomas.filter((s) => {
    const sDate = new Date(s.inicio);
    return (
      sDate.getDate() === selectedDate.getDate() &&
      sDate.getMonth() === selectedDate.getMonth() &&
      sDate.getFullYear() === selectedDate.getFullYear()
    );
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
                    type='text'
                    inputMode='numeric'
                    placeholder='DD/MM/AAAA'
                    value={editDateInicio}
                    onChange={(e) =>
                      setEditDateInicio(maskDate(e.target.value))
                    }
                    className='flex-1 bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-brand-navy font-bold text-sm outline-none focus:border-brand-blue shadow-sm'
                  />
                  <input
                    type='text'
                    inputMode='numeric'
                    placeholder='HH:MM'
                    value={editTimeInicio}
                    onChange={(e) =>
                      setEditTimeInicio(maskTime(e.target.value))
                    }
                    className='w-[100px] bg-white border-2 border-gray-200 rounded-2xl px-3 py-4 text-brand-navy font-bold text-sm outline-none focus:border-brand-blue shadow-sm text-center'
                  />
                </div>
              </div>

              <div>
                <label className='block text-xs font-black text-brand-navy/60 mb-2 uppercase ml-1'>
                  Terminou em (opcional):
                </label>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    inputMode='numeric'
                    placeholder='DD/MM/AAAA'
                    value={editDateFim}
                    onChange={(e) => setEditDateFim(maskDate(e.target.value))}
                    className='flex-1 bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-brand-navy font-bold text-sm outline-none focus:border-brand-blue shadow-sm'
                  />
                  <input
                    type='text'
                    inputMode='numeric'
                    placeholder='HH:MM'
                    value={editTimeFim}
                    onChange={(e) => setEditTimeFim(maskTime(e.target.value))}
                    className='w-[100px] bg-white border-2 border-gray-200 rounded-2xl px-3 py-4 text-brand-navy font-bold text-sm outline-none focus:border-brand-blue shadow-sm text-center'
                  />
                </div>
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
                  removeSintoma(editingSintoma.id);
                  setEditingSintomaId(null);
                }}
                className='w-full py-4 rounded-3xl font-black text-brand-danger bg-red-50/50 hover:bg-red-50 transition-colors uppercase tracking-widest text-xs'
              >
                EXCLUIR REGISTRO
              </button>
            </div>
          </div>
        ) : (
          // List View
          <div className='animate-fade-in'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-black text-brand-navy'>
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
                  return (
                    <div
                      key={sintoma.id}
                      className='bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border-l-4 border-brand-blue'
                    >
                      <div className='flex items-center gap-4 flex-1'>
                        <div className='bg-brand-teal/20 p-3 rounded-full text-brand-teal'>
                          <Icon size={24} strokeWidth={2} />
                        </div>
                        <div>
                          <p className='font-bold text-brand-navy'>
                            {sintoma.tipo.replace(/_/g, " ")}
                          </p>
                          {sintoma.subtipo && (
                            <p className='text-sm text-gray-500 font-medium'>
                              {sintoma.subtipo}
                            </p>
                          )}
                          {sintoma.descricao && (
                            <p className='text-sm text-brand-blue font-medium mt-1'>
                              "{sintoma.descricao}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className='flex items-center gap-2 pl-2'>
                        <div className='text-[10px] text-brand-blue font-bold px-2 py-1 bg-blue-50 rounded-xl text-center min-w-[50px]'>
                          <div>
                            {new Date(sintoma.inicio).toLocaleDateString(
                              "pt-BR",
                              { day: "2-digit", month: "2-digit" },
                            )}
                          </div>
                          {sintoma.fim && (
                            <div className='text-brand-navy mt-1 border-t border-blue-100 pt-1'>
                              até{" "}
                              {new Date(sintoma.fim).toLocaleDateString(
                                "pt-BR",
                                { day: "2-digit", month: "2-digit" },
                              )}
                            </div>
                          )}
                        </div>

                        <div className='flex flex-col gap-1 ml-1'>
                          <button
                            onClick={() => handleEditClick(sintoma)}
                            className='text-brand-navy bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors'
                          >
                            <Edit2 size={14} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => removeSintoma(sintoma.id)}
                            className='text-brand-danger bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors'
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
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
