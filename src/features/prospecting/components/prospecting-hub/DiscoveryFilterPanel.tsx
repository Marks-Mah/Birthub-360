import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  Building,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Database,
  Filter,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { fadeIn } from '../../../../lib/motion.js';
import { api } from '../../../../lib/api.js';
import {
  ESTADO_OPTIONS,
  PORTE_OPTIONS,
  QUANTIDADE_LEADS_OPTIONS,
  TECNOLOGIA_OPTIONS,
} from '../../../../shared/constants/icp-options.js';
import type { ProspectCriteria } from '../../services/prospecting.service.js';

type PersonaOption = {
  label: string;
  nivel: string;
  titles: string;
  seniorities: readonly string[];
};

export const STANDARD_PERSONAS = [
  'Proprietário',
  'Fundador',
  'Sócio',
  'CEO',
  'CFO',
  'COO',
  'CTO',
  'CMO',
  'Diretor Comercial',
  'Diretor Financeiro',
  'Diretor de Marketing',
  'Diretor de Operações',
  'Gerente Comercial',
  'Gerente de Compras',
  'Head de Vendas',
  'Head de Marketing',
  'Responsável por Tecnologia',
  'Responsável por Contratações',
];

export function DiscoveryFilterPanel({
  criteria,
  setCriteria,
  activeSegments,
  activePersonaOptions,
  cities,
  showAdvanced,
  setShowAdvanced,
  isSearching,
  discoverError,
  onDiscover,
}: {
  criteria: ProspectCriteria;
  setCriteria: (criteria: ProspectCriteria) => void;
  activeSegments: readonly string[];
  activePersonaOptions: readonly PersonaOption[];
  cities: string[];
  showAdvanced: boolean;
  setShowAdvanced: (updater: (v: boolean) => boolean) => void;
  isSearching: boolean;
  discoverError: string | null;
  onDiscover: () => void;
}) {
  const [nlpPrompt, setNlpPrompt] = useState('');
  const [isParsingNlp, setIsParsingNlp] = useState(false);
  const [nlpFeedback, setNlpFeedback] = useState<string | null>(null);

  // Cargos da persona
  const cargos = criteria.decisorCargos ?? [];
  const addCargoRow = () => setCriteria({ ...criteria, decisorCargos: [...cargos, ''] });
  const updateCargoRow = (index: number, value: string) => {
    const next = [...cargos];
    next[index] = value;
    setCriteria({ ...criteria, decisorCargos: next });
  };
  const removeCargoRow = (index: number) => {
    setCriteria({ ...criteria, decisorCargos: cargos.filter((_, i) => i !== index) });
  };

  const addPersonaChip = (cargoName: string) => {
    const existing = new Set(cargos.map((c) => c.trim().toLowerCase()).filter(Boolean));
    if (existing.has(cargoName.toLowerCase())) return;
    setCriteria({ ...criteria, decisorCargos: [...cargos, cargoName] });
  };

  const clearAllFilters = () => {
    setCriteria({
      segmento: '',
      localizacao: '',
      quantidade: 20,
      decisorCargos: [],
      subsegmento: undefined,
      nicho: undefined,
      produtos: undefined,
      servicos: undefined,
      descricaoEmpresaIdeal: undefined,
      palavrasChaveObrigatorias: undefined,
      palavrasChaveOpcionais: undefined,
      palavrasChaveExcluir: undefined,
      cnaePrincipal: undefined,
      cnaesSecundarios: undefined,
      setorEconomico: undefined,
      tipoMercado: undefined,
      modeloNegocio: undefined,
      cnpj: undefined,
      situacaoCadastral: undefined,
      naturezaJuridica: undefined,
      capitalSocialMin: undefined,
      tipoEstabelecimento: undefined,
      personaNome: undefined,
      departamento: undefined,
      funcao: undefined,
      nivelHierarquico: undefined,
      senioridade: undefined,
      poderDecisao: undefined,
      cargosEquivalentes: undefined,
      cargosExcluir: undefined,
      apenasComEmail: undefined,
      apenasComTelefone: undefined,
      apenasComLinkedin: undefined,
      maxDecisoresPorEmpresa: undefined,
    });
    setNlpPrompt('');
    setNlpFeedback(null);
  };

  const handleNlpParse = async () => {
    if (!nlpPrompt.trim()) return;
    setIsParsingNlp(true);
    setNlpFeedback(null);
    try {
      const res = await api.post<{
        criteria: Partial<ProspectCriteria>;
        explanation: string;
      }>('/api/prospecting/ai/parse-query', {
        prompt: nlpPrompt,
        mode: criteria.aiProviderMode || 'auto',
      });

      if (res?.criteria) {
        setCriteria({
          ...criteria,
          ...res.criteria,
        });
        setNlpFeedback(`✨ IA: ${res.explanation}`);
      }
    } catch {
      setNlpFeedback(
        '⚠️ Não foi possível interpretar via IA. Os termos foram adicionados na busca.',
      );
      setCriteria({
        ...criteria,
        segmento: nlpPrompt,
        palavrasChave: nlpPrompt,
      });
    } finally {
      setIsParsingNlp(false);
    }
  };

  return (
    <div className="xl:col-span-4 bg-surface p-5 sm:p-7 rounded-2xl border border-line shadow-sm relative overflow-hidden flex flex-col h-full max-h-[850px]">
      <div className="absolute top-0 right-0 w-40 h-40 bg-brand opacity-5 transform rotate-45 translate-x-20 -translate-y-20 pointer-events-none" />

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand-ink dark:text-brand">
            <Database size={18} />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-ink">🗺️ Motor de Busca Turbo</h2>
            <span className="text-[10px] text-ink-2 font-medium">
              B2B Discovery • IA • Fontes Oficiais
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={clearAllFilters}
          title="Limpar todos os filtros"
          className="text-ink-2 hover:text-danger text-xs font-semibold flex items-center gap-1 border border-line rounded-lg px-2 py-1 bg-surface-2/40 transition-colors"
        >
          <RotateCcw size={12} /> Limpar
        </button>
      </div>

      <div className="space-y-4 relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Bloco 0: Inteligência Artificial (Linguagem Natural) */}
        <div className="p-3.5 rounded-xl border border-brand/30 bg-brand/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-brand-ink dark:text-brand uppercase tracking-wider">
              <Sparkles size={13} /> Assistente de Busca por IA
            </span>
            <select
              value={criteria.aiProviderMode || 'auto'}
              onChange={(e) =>
                setCriteria({
                  ...criteria,
                  aiProviderMode: e.target.value as 'auto' | 'groq' | 'local',
                })
              }
              className="text-[10px] font-semibold bg-surface border border-line rounded-md px-2 py-0.5 text-ink outline-none"
            >
              <option value="auto">Modo: Auto</option>
              <option value="groq">Groq Cloud (Nuvem)</option>
              <option value="local">Ollama (Local)</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: Clínicas odontológicas em Curitiba com mais de 20 funcionários..."
              value={nlpPrompt}
              onChange={(e) => setNlpPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNlpParse()}
              className="flex-1 p-2.5 bg-surface text-xs rounded-xl border border-line text-ink outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={handleNlpParse}
              disabled={isParsingNlp || !nlpPrompt.trim()}
              className="bg-brand text-on-brand px-3 py-2 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1 shrink-0"
            >
              {isParsingNlp ? <Loader2 size={13} className="animate-spin" /> : <Brain size={13} />}
              Interpretar
            </button>
          </div>
          {nlpFeedback && (
            <p className="text-[11px] text-ink-2 bg-surface/80 p-2 rounded-lg border border-line">
              {nlpFeedback}
            </p>
          )}
        </div>

        {/* Bloco 1: Formulário Completo de Segmento e Empresa */}
        <div className="space-y-3 p-3.5 rounded-xl border border-line bg-surface-2/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-wider font-bold uppercase text-ink-2 flex items-center gap-1.5">
              <Building size={14} /> Perfil Empresarial & Segmento
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="discovery-segmento"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Segmento Principal
              </label>
              <input
                id="discovery-segmento"
                type="text"
                list="discovery-segmento-suggestions"
                placeholder="Ex: Engenharia Civil"
                className="w-full p-2.5 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand"
                value={criteria.segmento || ''}
                onChange={(e) => setCriteria({ ...criteria, segmento: e.target.value })}
              />
              <datalist id="discovery-segmento-suggestions">
                {activeSegments.map((seg) => (
                  <option key={seg} value={seg} />
                ))}
              </datalist>
            </div>
            <div>
              <label
                htmlFor="discovery-subsegmento"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Subsegmento
              </label>
              <input
                id="discovery-subsegmento"
                type="text"
                placeholder="Ex: Construção Predial"
                className="w-full p-2.5 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand"
                value={criteria.subsegmento || ''}
                onChange={(e) =>
                  setCriteria({ ...criteria, subsegmento: e.target.value || undefined })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="discovery-nicho"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Nicho de Mercado
              </label>
              <input
                id="discovery-nicho"
                type="text"
                placeholder="Ex: Obras de Alto Padrão"
                className="w-full p-2.5 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand"
                value={criteria.nicho || ''}
                onChange={(e) => setCriteria({ ...criteria, nicho: e.target.value || undefined })}
              />
            </div>
            <div>
              <label
                htmlFor="discovery-cnae"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                CNAE Principal
              </label>
              <input
                id="discovery-cnae"
                type="text"
                placeholder="Ex: 4120400"
                className="w-full p-2.5 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand"
                value={criteria.cnaePrincipal || ''}
                onChange={(e) =>
                  setCriteria({ ...criteria, cnaePrincipal: e.target.value || undefined })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="discovery-produtos"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Produtos Comercializados
              </label>
              <input
                id="discovery-produtos"
                type="text"
                placeholder="Ex: Concreto, Ferragens"
                className="w-full p-2.5 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand"
                value={criteria.produtos || ''}
                onChange={(e) =>
                  setCriteria({ ...criteria, produtos: e.target.value || undefined })
                }
              />
            </div>
            <div>
              <label
                htmlFor="discovery-servicos"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Serviços Oferecidos
              </label>
              <input
                id="discovery-servicos"
                type="text"
                placeholder="Ex: Consultoria, Reformas"
                className="w-full p-2.5 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand"
                value={criteria.servicos || ''}
                onChange={(e) =>
                  setCriteria({ ...criteria, servicos: e.target.value || undefined })
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="discovery-empresa-ideal"
              className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
            >
              Descrição da Empresa Ideal (ICP)
            </label>
            <textarea
              id="discovery-empresa-ideal"
              rows={2}
              placeholder="Ex: Construtoras com frota própria e atuação em obras corporativas..."
              className="w-full p-2.5 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand resize-none"
              value={criteria.descricaoEmpresaIdeal || criteria.icp || ''}
              onChange={(e) => {
                setCriteria({
                  ...criteria,
                  descricaoEmpresaIdeal: e.target.value,
                  icp: e.target.value,
                });
              }}
            />
          </div>

          {/* Palavras-chave avançadas */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label
                htmlFor="discovery-kw-obrig"
                className="block text-[9px] font-bold uppercase text-ink-2 mb-1"
              >
                Obrigatórias
              </label>
              <input
                id="discovery-kw-obrig"
                type="text"
                placeholder="Ex: ISO 9001"
                className="w-full p-2 bg-surface rounded-lg border border-line text-xs text-ink outline-none focus:border-brand"
                value={criteria.palavrasChaveObrigatorias || ''}
                onChange={(e) =>
                  setCriteria({
                    ...criteria,
                    palavrasChaveObrigatorias: e.target.value || undefined,
                  })
                }
              />
            </div>
            <div>
              <label
                htmlFor="discovery-kw-opc"
                className="block text-[9px] font-bold uppercase text-ink-2 mb-1"
              >
                Opcionais
              </label>
              <input
                id="discovery-kw-opc"
                type="text"
                placeholder="Ex: corporativo"
                className="w-full p-2 bg-surface rounded-lg border border-line text-xs text-ink outline-none focus:border-brand"
                value={criteria.palavrasChaveOpcionais || criteria.palavrasChave || ''}
                onChange={(e) =>
                  setCriteria({ ...criteria, palavrasChaveOpcionais: e.target.value || undefined })
                }
              />
            </div>
            <div>
              <label
                htmlFor="discovery-kw-exc"
                className="block text-[9px] font-bold uppercase text-ink-2 mb-1"
              >
                Excluir
              </label>
              <input
                id="discovery-kw-exc"
                type="text"
                placeholder="Ex: residencial"
                className="w-full p-2 bg-surface rounded-lg border border-line text-xs text-ink outline-none focus:border-brand"
                value={criteria.palavrasChaveExcluir || ''}
                onChange={(e) =>
                  setCriteria({ ...criteria, palavrasChaveExcluir: e.target.value || undefined })
                }
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Localização e Porte (SEM CAMPO VOLUME) */}
        <div className="space-y-3 p-3.5 rounded-xl border border-line bg-surface-2/40">
          <span className="text-[11px] tracking-wider font-bold uppercase text-ink-2 block">
            📍 Localização e Porte
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="discovery-estado"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Estado (UF)
              </label>
              <select
                id="discovery-estado"
                className="w-full p-2.5 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand"
                value={criteria.estado || ''}
                onChange={(e) => {
                  const estado = e.target.value;
                  setCriteria({
                    ...criteria,
                    estado,
                    localizacao: criteria.cidade
                      ? `${criteria.cidade}, ${estado}`
                      : estado || criteria.localizacao,
                  });
                }}
              >
                <option value="">Todos os estados</option>
                {ESTADO_OPTIONS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="discovery-cidade"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Cidade
              </label>
              {cities.length > 0 ? (
                <select
                  id="discovery-cidade"
                  className="w-full p-2.5 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand"
                  value={criteria.cidade || ''}
                  onChange={(e) => {
                    const cidade = e.target.value;
                    setCriteria({
                      ...criteria,
                      cidade: cidade || undefined,
                      localizacao: cidade
                        ? criteria.estado
                          ? `${cidade}, ${criteria.estado}`
                          : cidade
                        : criteria.estado || '',
                    });
                  }}
                >
                  <option value="">Todas as cidades</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="discovery-cidade"
                  type="text"
                  placeholder="Selecione um estado..."
                  className="w-full p-2.5 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand"
                  value={criteria.cidade || ''}
                  onChange={(e) => {
                    const cidade = e.target.value;
                    setCriteria({
                      ...criteria,
                      cidade,
                      localizacao: cidade
                        ? criteria.estado
                          ? `${cidade}, ${criteria.estado}`
                          : cidade
                        : criteria.estado || '',
                    });
                  }}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="discovery-porte"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Porte (Funcionários)
              </label>
              <select
                id="discovery-porte"
                className="w-full p-2.5 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand"
                value={criteria.porte || ''}
                onChange={(e) => setCriteria({ ...criteria, porte: e.target.value || undefined })}
              >
                {PORTE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="discovery-quantidade"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Quantidade de Leads
              </label>
              <select
                id="discovery-quantidade"
                className="w-full p-2.5 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand"
                value={criteria.quantidade ?? 20}
                onChange={(e) => setCriteria({ ...criteria, quantidade: Number(e.target.value) })}
              >
                {QUANTIDADE_LEADS_OPTIONS.map((qtd) => (
                  <option key={qtd} value={qtd}>
                    {qtd} leads
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bloco 3: Persona do Decisor (Formulário Completo e Modelos) */}
        <div className="space-y-3 p-3.5 rounded-xl border border-line bg-surface-2/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-wider font-bold uppercase text-ink-2 flex items-center gap-1.5">
              <UserCheck size={14} /> Persona do Decisor
            </span>
          </div>

          {/* Modelos rápidos de Persona */}
          <div>
            <span className="block text-[9px] font-bold uppercase text-ink-2 mb-1.5">
              Modelos Rápidos (Clique para adicionar):
            </span>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 bg-surface rounded-xl border border-line">
              {STANDARD_PERSONAS.map((cargoName) => (
                <button
                  key={cargoName}
                  type="button"
                  onClick={() => addPersonaChip(cargoName)}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium border border-line bg-surface-2 text-ink-2 hover:border-brand hover:text-brand transition-colors"
                >
                  + {cargoName}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="discovery-persona-nome"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Nome da Persona
              </label>
              <input
                id="discovery-persona-nome"
                type="text"
                placeholder="Ex: Diretor de Expansão"
                className="w-full p-2 bg-surface rounded-xl border border-line text-xs text-ink outline-none focus:border-brand"
                value={criteria.personaNome || ''}
                onChange={(e) =>
                  setCriteria({ ...criteria, personaNome: e.target.value || undefined })
                }
              />
            </div>
            <div>
              <label
                htmlFor="discovery-departamento"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Departamento
              </label>
              <input
                id="discovery-departamento"
                type="text"
                placeholder="Ex: Comercial, Operações"
                className="w-full p-2 bg-surface rounded-xl border border-line text-xs text-ink outline-none focus:border-brand"
                value={criteria.departamento || ''}
                onChange={(e) =>
                  setCriteria({ ...criteria, departamento: e.target.value || undefined })
                }
              />
            </div>
          </div>

          {/* Lista dinâmica de Cargos Alvo */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-bold uppercase text-ink-2">
              Cargos Específicos Alvo ({cargos.length})
            </span>
            <AnimatePresence initial={false}>
              {cargos.map((cargo, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="flex gap-1.5"
                >
                  <input
                    aria-label={`Cargo do decisor ${index + 1}`}
                    type="text"
                    placeholder="Ex: Diretor Geral"
                    value={cargo}
                    onChange={(e) => updateCargoRow(index, e.target.value)}
                    className="flex-1 p-2 bg-surface rounded-xl border border-line text-xs text-ink outline-none focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={() => removeCargoRow(index)}
                    className="w-9 flex items-center justify-center rounded-xl border border-line text-ink-2 hover:text-danger hover:border-danger/40 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            <button
              type="button"
              onClick={addCargoRow}
              className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl border border-dashed border-line text-xs font-semibold text-ink-2 hover:text-brand hover:border-brand/40 transition-colors"
            >
              <Plus size={13} /> Adicionar outro cargo
            </button>
          </div>
        </div>

        {/* Bloco 4: Busca direta por Nome Empresarial ou CNPJ */}
        <div className="p-3.5 rounded-xl border border-line bg-surface-2/40 space-y-2">
          <label
            htmlFor="discovery-pesquisar"
            className="block text-[10px] font-bold uppercase text-ink-2"
          >
            Pesquisa Direta por Nome ou CNPJ
          </label>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-2 pointer-events-none"
            />
            <input
              id="discovery-pesquisar"
              type="search"
              placeholder="Ex: 00.000.000/0001-91 ou Nome da Empresa..."
              value={criteria.nomeEmpresa || criteria.cnpj || ''}
              onChange={(e) => {
                const val = e.target.value;
                const isCnpj = val.replace(/\D/g, '').length === 14;
                setCriteria({
                  ...criteria,
                  nomeEmpresa: val || undefined,
                  cnpj: isCnpj ? val : undefined,
                });
              }}
              onKeyDown={(e) => e.key === 'Enter' && onDiscover()}
              className="w-full py-2.5 pl-9 pr-3 bg-surface rounded-xl border border-line text-xs font-medium text-ink outline-none focus:border-brand"
            />
          </div>
          <p className="text-[10px] text-ink-2">
            Se for informado um CNPJ válido, a busca consulta diretamente a Receita Federal.
          </p>
        </div>

        {/* Filtros Avançados Expansíveis (Apollo + Fontes Oficiais) */}
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-center justify-between w-full text-[10px] tracking-wider font-bold uppercase text-ink-2 hover:text-brand transition-colors pt-1"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal size={13} /> Filtros Avançados (Apollo & Receita)
          </span>
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showAdvanced && (
          <div className="space-y-3.5 p-3.5 rounded-xl border border-line bg-surface-2/20 pt-2">
            <div>
              <label
                htmlFor="discovery-ano-min"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Ano de Fundação (Mín e Máx)
              </label>
              <div className="flex gap-2">
                <input
                  id="discovery-ano-min"
                  type="number"
                  placeholder="De"
                  value={criteria.anoFundacaoMin ?? ''}
                  onChange={(e) =>
                    setCriteria({
                      ...criteria,
                      anoFundacaoMin: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full p-2 bg-surface rounded-xl border border-line text-xs text-ink outline-none focus:border-brand"
                />
                <input
                  type="number"
                  placeholder="Até"
                  value={criteria.anoFundacaoMax ?? ''}
                  onChange={(e) =>
                    setCriteria({
                      ...criteria,
                      anoFundacaoMax: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full p-2 bg-surface rounded-xl border border-line text-xs text-ink outline-none focus:border-brand"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="discovery-faturamento-min"
                className="block text-[10px] font-bold uppercase text-ink-2 mb-1"
              >
                Faturamento Anual Estimado (USD)
              </label>
              <div className="flex gap-2">
                <input
                  id="discovery-faturamento-min"
                  type="number"
                  placeholder="Mínimo"
                  value={criteria.faturamentoMin ?? ''}
                  onChange={(e) =>
                    setCriteria({
                      ...criteria,
                      faturamentoMin: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full p-2 bg-surface rounded-xl border border-line text-xs text-ink outline-none focus:border-brand"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={criteria.faturamentoMax ?? ''}
                  onChange={(e) =>
                    setCriteria({
                      ...criteria,
                      faturamentoMax: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full p-2 bg-surface rounded-xl border border-line text-xs text-ink outline-none focus:border-brand"
                />
              </div>
            </div>

            {/* Tecnologias */}
            <div>
              <span className="block text-[10px] font-bold uppercase text-ink-2 mb-1">
                Tecnologias Utilizadas
              </span>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 bg-surface rounded-xl border border-line">
                {TECNOLOGIA_OPTIONS.map((opt) => {
                  const selected = (criteria.tecnologias || '')
                    .split(',')
                    .filter(Boolean)
                    .includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        const current = (criteria.tecnologias || '').split(',').filter(Boolean);
                        const next = selected
                          ? current.filter((v) => v !== opt.value)
                          : [...current, opt.value];
                        setCriteria({
                          ...criteria,
                          tecnologias: next.length ? next.join(',') : undefined,
                        });
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                        selected
                          ? 'bg-brand text-on-brand border-brand'
                          : 'bg-surface-2 border-line text-ink-2 hover:border-brand'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checkboxes de contato do decisor */}
            <div className="space-y-1 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-ink-2">
                <input
                  type="checkbox"
                  checked={!!criteria.apenasComEmail}
                  onChange={(e) =>
                    setCriteria({ ...criteria, apenasComEmail: e.target.checked || undefined })
                  }
                  className="rounded border-line text-brand focus:ring-brand"
                />
                Exigir e-mail profissional do decisor
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-ink-2">
                <input
                  type="checkbox"
                  checked={!!criteria.apenasComTelefone}
                  onChange={(e) =>
                    setCriteria({ ...criteria, apenasComTelefone: e.target.checked || undefined })
                  }
                  className="rounded border-line text-brand focus:ring-brand"
                />
                Exigir telefone ou WhatsApp
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-ink-2">
                <input
                  type="checkbox"
                  checked={!!criteria.apenasCapitalAberto}
                  onChange={(e) =>
                    setCriteria({ ...criteria, apenasCapitalAberto: e.target.checked || undefined })
                  }
                  className="rounded border-line text-brand focus:ring-brand"
                />
                Apenas empresas de capital aberto (B3/bolsa)
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Botão de Disparo */}
      <div className="pt-4 mt-2 relative z-10 border-t border-line">
        <button
          type="button"
          id="btn-discover"
          onClick={onDiscover}
          disabled={isSearching}
          className="w-full bg-brand-active text-on-brand py-3.5 rounded-xl font-bold hover:brightness-110 active:scale-95 disabled:opacity-80 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand/20 cursor-pointer"
        >
          {isSearching ? (
            <>
              <Loader2 className="animate-spin" size={18} /> <span>Mapeando Mercado Turbo...</span>
            </>
          ) : (
            <>
              <Cpu size={18} /> <span>🚀 Disparar Prospecção Turbo</span>
            </>
          )}
        </button>
        {discoverError && (
          <p className="text-xs text-danger font-medium mt-2 text-center">{discoverError}</p>
        )}
      </div>
    </div>
  );
}
