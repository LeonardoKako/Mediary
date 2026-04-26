import React, { useState } from 'react';
import { X, Trash2, Edit2, ArrowLeft, Frown, Flame, BatteryWarning, Dna, Wind, Thermometer, Bug, Activity, CircleDot, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useSintomasStore } from '../store/useSintomasStore';
import { Button } from './Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const getIconForType = (tipo: string) => {
  switch (tipo) {
    case 'DOR': return Activity;
    case 'NAUSEA': return Frown;
    case 'FADIGA': return BatteryWarning;
    case 'VERTIGEM': return CircleDot;
    case 'FALTA_DE_AR': return Wind;
    case 'TOSSE': return Thermometer;
    case 'DIARREIA': return Bug;
    case 'CONSTIPACAO': return Dna;
    case 'COCEIRA': return Flame;
    case 'CONTINUO': return RefreshCw;
    default: return MoreHorizontal;
  }
};

export const ModalViewSintomas: React.FC<Props> = ({ isOpen, onClose }) => {
  const { sintomas, selectedDate, removeSintoma, updateSintoma } = useSintomasStore();
  const [editingSintomaId, setEditingSintomaId] = useState<number | null>(null);

  // States for the edit form
  const [editInicio, setEditInicio] = useState('');
  const [editFim, setEditFim] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setEditingSintomaId(null);
    onClose();
  };

  const handleEditClick = (sintoma: any) => {
    setEditingSintomaId(sintoma.id);
    
    // Converter para datetime-local (YYYY-MM-DDTHH:mm) lidando com fuso horário local
    const toDatetimeLocal = (dateString: string | null) => {
      if (!dateString) return '';
      const d = new Date(dateString);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    setEditInicio(toDatetimeLocal(sintoma.inicio));
    setEditFim(toDatetimeLocal(sintoma.fim));
  };

  const handleSaveEdit = () => {
    if (!editingSintomaId) return;
    updateSintoma(editingSintomaId, {
      inicio: editInicio ? new Date(editInicio).toISOString() : new Date().toISOString(),
      fim: editFim ? new Date(editFim).toISOString() : null
    });
    setEditingSintomaId(null);
  };

  const sintomasDoDia = sintomas.filter(s => {
    const sDate = new Date(s.inicio);
    return sDate.getDate() === selectedDate.getDate() && 
           sDate.getMonth() === selectedDate.getMonth() &&
           sDate.getFullYear() === selectedDate.getFullYear();
  });

  const editingSintoma = sintomas.find(s => s.id === editingSintomaId);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={handleClose}
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md bg-gray-50 rounded-3xl p-6 shadow-xl animate-fade-in">
        
        {editingSintomaId && editingSintoma ? (
          // Edit View
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setEditingSintomaId(null)} className="p-2 bg-gray-200 rounded-full text-brand-navy">
                <ArrowLeft size={20} strokeWidth={3} />
              </button>
              <h2 className="text-xl font-black text-brand-navy">Editar Sintoma</h2>
              <div className="w-10"></div> {/* Spacer */}
            </div>

            <div className="bg-brand-blue/10 p-4 rounded-2xl mb-6">
              <p className="font-black text-brand-navy text-lg">{editingSintoma.tipo}</p>
              {editingSintoma.subtipo && <p className="text-sm font-bold text-gray-500">{editingSintoma.subtipo}</p>}
              {editingSintoma.descricao && <p className="text-sm font-bold text-brand-blue mt-1">"{editingSintoma.descricao}"</p>}
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">Iniciou em:</label>
                <input 
                  type="datetime-local" 
                  value={editInicio}
                  onChange={(e) => setEditInicio(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-navy font-medium outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">Terminou em (opcional):</label>
                <input 
                  type="datetime-local" 
                  value={editFim}
                  onChange={(e) => setEditFim(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-navy font-medium outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleSaveEdit}>SALVAR</Button>
              <button 
                onClick={() => { removeSintoma(editingSintoma.id); setEditingSintomaId(null); }}
                className="w-full py-4 rounded-full font-black text-brand-danger bg-red-50 hover:bg-red-100 transition-colors"
              >
                EXCLUIR SINTOMA
              </button>
            </div>
          </div>
        ) : (
          // List View
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-brand-navy">
                Sintomas do dia {selectedDate.toLocaleDateString()}
              </h2>
              <button onClick={handleClose} className="p-2 bg-gray-200 rounded-full text-brand-navy">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {sintomasDoDia.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl">
                <p className="text-gray-400 font-medium">Nenhum sintoma registrado neste dia.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 pb-2">
                {sintomasDoDia.map(sintoma => {
                  const Icon = getIconForType(sintoma.tipo);
                  return (
                  <div key={sintoma.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border-l-4 border-brand-blue">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-brand-teal/20 p-3 rounded-full text-brand-teal">
                        <Icon size={24} strokeWidth={2} />
                      </div>
                      <div>
                        <p className="font-bold text-brand-navy">{sintoma.tipo.replace(/_/g, ' ')}</p>
                        {sintoma.subtipo && <p className="text-sm text-gray-500 font-medium">{sintoma.subtipo}</p>}
                        {sintoma.descricao && <p className="text-sm text-brand-blue font-medium mt-1">"{sintoma.descricao}"</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pl-2">
                      <div className="text-[10px] text-brand-blue font-bold px-2 py-1 bg-blue-50 rounded-xl text-center min-w-[50px]">
                        <div>{new Date(sintoma.inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</div>
                        {sintoma.fim && (
                          <div className="text-brand-navy mt-1 border-t border-blue-100 pt-1">até {new Date(sintoma.fim).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-1 ml-1">
                        <button 
                          onClick={() => handleEditClick(sintoma)}
                          className="text-brand-navy bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Edit2 size={14} strokeWidth={2.5} />
                        </button>
                        <button 
                          onClick={() => removeSintoma(sintoma.id)}
                          className="text-brand-danger bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
