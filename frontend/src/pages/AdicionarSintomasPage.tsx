import { useNavigate } from "react-router-dom";
import { useSintomasStore } from "../store/useSintomasStore";
import { Button } from "../components/Button";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";

const SINTOMAS_TYPES = [
  {
    id: "DOR",
    label: "Dor",
    icon: "🤕",
    subtypes: [
      "CABEÇA",
      "ABDOMINAL",
      "MUSCULAR",
      "COSTAS",
      "GARGANTA",
      "ARTICULAÇÃO",
      "OUTRO",
    ],
  },
  { id: "FEBRE", label: "Febre", icon: "🤒", subtypes: [] },
  { id: "NAUSEA", label: "Náusea", icon: "🤢", subtypes: [] },
  { id: "FADIGA", label: "Fadiga", icon: "🥱", subtypes: [] },
  { id: "OUTRO", label: "Outro", icon: "📝", subtypes: [] },
];

export const AdicionarSintomasPage = () => {
  const navigate = useNavigate();
  const { addSintoma, selectedDate } = useSintomasStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setSelectedSubtype(null);
    } else {
      setExpandedId(id);
      setSelectedSubtype(null);
    }
  };

  const handleAdd = (tipo: string, subtipo?: string) => {
    addSintoma({
      id: Date.now(), // ID fake
      usuario_id: 1,
      tipo,
      subtipo: subtipo || null,
      descricao: null,
      inicio: new Date(selectedDate).toISOString(),
      fim: null,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    });

    toast.success("Sintoma registrado!");
    navigate("/");
  };

  return (
    <div className='flex flex-col h-full min-h-screen bg-gray-50 pb-8'>
      {/* Header */}
      <div className='pt-12 px-6 pb-6 bg-white flex items-center justify-between shadow-sm sticky top-0 z-20'>
        <button
          onClick={() => navigate(-1)}
          className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-brand-navy'
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className='text-xl font-bold text-brand-navy'>
          Adicionar Registro
        </h1>
        <div className='w-10'></div> {/* Spacer para centralizar o título */}
      </div>

      <div className='px-6 pt-6'>
        <p className='text-gray-500 mb-6'>
          Selecione o sintoma para o dia{" "}
          <strong className='text-brand-navy'>
            {selectedDate.toLocaleDateString()}
          </strong>
          :
        </p>

        <div className='space-y-4'>
          {SINTOMAS_TYPES.map((sintoma) => {
            const isExpanded = expandedId === sintoma.id;

            return (
              <div
                key={sintoma.id}
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? "bg-brand-teal-light" : "bg-brand-teal"}`}
              >
                <button
                  onClick={() => handleToggleExpand(sintoma.id)}
                  className='w-full px-6 py-5 flex items-center justify-between text-white'
                >
                  <div className='flex items-center gap-4'>
                    <span className='text-2xl'>{sintoma.icon}</span>
                    <span className='font-bold text-lg'>{sintoma.label}</span>
                  </div>
                  {sintoma.subtypes.length > 0 &&
                    (isExpanded ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    ))}
                </button>

                {isExpanded && (
                  <div className='px-6 pb-6 pt-2 text-white border-t border-white/20'>
                    {sintoma.subtypes.length > 0 ? (
                      <div className='space-y-3 mt-2'>
                        <p className='text-sm opacity-90 mb-3'>
                          Especifique o tipo de {sintoma.label.toLowerCase()}:
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {sintoma.subtypes.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => setSelectedSubtype(sub)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedSubtype === sub
                                  ? "bg-white text-brand-teal-light"
                                  : "bg-white/20 text-white hover:bg-white/30"
                              }`}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>

                        {selectedSubtype && (
                          <div className='pt-6'>
                            <Button
                              onClick={() =>
                                handleAdd(sintoma.id, selectedSubtype)
                              }
                              className='bg-brand-navy text-white hover:bg-brand-navy/90'
                            >
                              SALVAR REGISTRO
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className='pt-2'>
                        <Button
                          onClick={() => handleAdd(sintoma.id)}
                          className='bg-brand-navy text-white hover:bg-brand-navy/90'
                        >
                          SALVAR REGISTRO
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
