import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  Building2,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  Flame,
  Globe,
  Loader2,
  Lock,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../../../lib/api.js';
import { SoundFX } from '../../../../lib/soundEffects.js';

interface ProviderCardInfo {
  id: string;
  name: string;
  category: 'IA' | 'Dados Cadastrais' | 'Firmográfico & Contatos' | 'Geográfico & Web';
  pricing: 'Gratuito / Open Source' | 'API Paga / Créditos' | 'Local';
  status: 'online' | 'unconfigured' | 'offline' | 'checking';
  latencyMs?: number;
  lastChecked?: string;
  endpoint: string;
  notes: string;
  canTest: boolean;
}

export function IntegrationsCentralPanel() {
  const [providers, setProviders] = useState<ProviderCardInfo[]>([
    {
      id: 'groq',
      name: 'GroqCloud AI',
      category: 'IA',
      pricing: 'Gratuito / Open Source',
      status: 'checking',
      endpoint: 'https://api.groq.com/openai/v1',
      notes: 'Motor ultrarrápido Llama 3 / Allam para interpretação de buscas e resumo de leads.',
      canTest: true,
    },
    {
      id: 'ollama',
      name: 'Ollama Local AI',
      category: 'IA',
      pricing: 'Local',
      status: 'checking',
      endpoint: 'http://127.0.0.1:11434',
      notes: 'Execução local de modelos open source sem dependência externa ou custo por token.',
      canTest: true,
    },
    {
      id: 'brasilapi',
      name: 'BrasilAPI / Receita Federal',
      category: 'Dados Cadastrais',
      pricing: 'Gratuito / Open Source',
      status: 'checking',
      endpoint: 'https://brasilapi.com.br/api/cnpj/v1',
      notes: 'Dados oficiais de CNPJ, CNAE, razão social, endereço e quadro societário (QSA).',
      canTest: true,
    },
    {
      id: 'minhareceita',
      name: 'MinhaReceita Open Source',
      category: 'Dados Cadastrais',
      pricing: 'Gratuito / Open Source',
      status: 'checking',
      endpoint: 'https://minhareceita.org',
      notes: 'Fallback open source baseado em dados abertos oficiais da Receita Federal.',
      canTest: true,
    },
    {
      id: 'googleplaces',
      name: 'Google Places API (New)',
      category: 'Geográfico & Web',
      pricing: 'API Paga / Créditos',
      status: 'checking',
      endpoint: 'https://places.googleapis.com/v1',
      notes: 'Mapeamento territorial, telefones e websites oficiais com FieldMasks controlados.',
      canTest: true,
    },
    {
      id: 'apollo',
      name: 'Apollo.io',
      category: 'Firmográfico & Contatos',
      pricing: 'API Paga / Créditos',
      status: 'checking',
      endpoint: 'https://api.apollo.io/api/v1',
      notes: 'Descoberta firmográfica de empresas e pessoas decisoras com cargos e contatos.',
      canTest: true,
    },
    {
      id: 'searxng',
      name: 'SearXNG Metasearch',
      category: 'Geográfico & Web',
      pricing: 'Gratuito / Open Source',
      status: 'checking',
      endpoint: 'http://127.0.0.1:8080',
      notes: 'Metabuscador open source e autohospedado para coleta de sinais web e notícias.',
      canTest: true,
    },
    {
      id: 'openstreetmap',
      name: 'OpenStreetMap (Nominatim)',
      category: 'Geográfico & Web',
      pricing: 'Gratuito / Open Source',
      status: 'online',
      endpoint: 'https://nominatim.openstreetmap.org',
      notes: 'Base geográfica global aberta para localização de empresas e bairros sem custo.',
      canTest: false,
    },
  ]);

  const [testingId, setTestingId] = useState<string | null>(null);

  const checkAllProviders = async () => {
    // 1. Checa status das ferramentas existentes
    try {
      const toolsRes = await api.get<{
        googlePlaces: { configured: boolean };
        apollo: { configured: boolean };
        hunter: { configured: boolean };
      }>('/api/prospecting/tools/status');

      // 2. Checa status da IA
      const aiRes = await api
        .get<{
          groq: { available: boolean; configured: boolean; latencyMs?: number };
          ollama: { available: boolean; configured: boolean; latencyMs?: number };
        }>('/api/prospecting/ai/health')
        .catch(() => null);

      setProviders((prev) =>
        prev.map((p) => {
          if (p.id === 'googleplaces') {
            return {
              ...p,
              status: toolsRes.googlePlaces?.configured ? 'online' : 'unconfigured',
              lastChecked: new Date().toLocaleTimeString(),
            };
          }
          if (p.id === 'apollo') {
            return {
              ...p,
              status: toolsRes.apollo?.configured ? 'online' : 'unconfigured',
              lastChecked: new Date().toLocaleTimeString(),
            };
          }
          if (p.id === 'groq') {
            return {
              ...p,
              status: aiRes?.groq?.available
                ? 'online'
                : aiRes?.groq?.configured
                  ? 'offline'
                  : 'unconfigured',
              latencyMs: aiRes?.groq?.latencyMs,
              lastChecked: new Date().toLocaleTimeString(),
            };
          }
          if (p.id === 'ollama') {
            return {
              ...p,
              status: aiRes?.ollama?.available ? 'online' : 'offline',
              latencyMs: aiRes?.ollama?.latencyMs,
              lastChecked: new Date().toLocaleTimeString(),
            };
          }
          if (p.id === 'brasilapi' || p.id === 'minhareceita') {
            return {
              ...p,
              status: 'online',
              lastChecked: new Date().toLocaleTimeString(),
            };
          }
          return p;
        }),
      );
    } catch {
      // Best-effort
    }
  };

  useEffect(() => {
    checkAllProviders();
  }, []);

  const handleTestProvider = async (providerId: string) => {
    setTestingId(providerId);
    SoundFX.play('click');
    try {
      if (providerId === 'groq' || providerId === 'ollama') {
        const res = await api.get<any>('/api/prospecting/ai/health');
        if (providerId === 'groq' && res.groq?.available) {
          SoundFX.play('success');
        } else if (providerId === 'ollama' && res.ollama?.available) {
          SoundFX.play('success');
        } else {
          SoundFX.play('hover');
        }
      } else if (providerId === 'brasilapi' || providerId === 'minhareceita') {
        await api.post('/api/prospecting/enrich-cnpj', { cnpj: '00000000000191' });
        SoundFX.play('success');
      } else if (providerId === 'apollo') {
        await api.post('/api/prospecting/apollo/reconnect');
        SoundFX.play('success');
      }
      await checkAllProviders();
    } catch {
      SoundFX.play('hover');
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-ink dark:text-brand flex items-center gap-1.5">
            <Zap size={14} /> Governança & Conectores
          </div>
          <h2 className="font-display text-2xl font-bold text-ink tracking-tight mt-0.5">
            Central de Integrações e Provedores
          </h2>
          <p className="text-xs sm:text-sm text-ink-2 max-w-2xl mt-1">
            Monitore a saúde técnica, disponibilidade, cotas de orçamento e latência de cada
            conector ativo no Motor de Busca Turbo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            SoundFX.play('click');
            checkAllProviders();
          }}
          className="bg-surface-2 border border-line text-ink hover:border-brand px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
        >
          <RefreshCw size={14} /> Atualizar Conexões
        </button>
      </div>

      {/* Grid de Cards dos Provedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {providers.map((p) => {
          const isOnline = p.status === 'online';
          const isOffline = p.status === 'offline';
          const isUnconfigured = p.status === 'unconfigured';
          const isTesting = testingId === p.id;

          return (
            <div
              key={p.id}
              className="bg-surface border border-line rounded-2xl p-4 flex flex-col justify-between hover:border-brand/40 transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-2 border border-line text-ink-2">
                    {p.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {isOnline && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={12} /> Ativo
                      </span>
                    )}
                    {isOffline && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-danger bg-danger/10 border border-danger/20 px-2 py-0.5 rounded-full">
                        <ShieldAlert size={12} /> Inacessível
                      </span>
                    )}
                    {isUnconfigured && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        <Lock size={12} /> Sem Chave
                      </span>
                    )}
                    {p.status === 'checking' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-ink-2 bg-surface-2 px-2 py-0.5 rounded-full">
                        <Loader2 size={12} className="animate-spin" /> Verificando
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-base text-ink group-hover:text-brand transition-colors">
                  {p.name}
                </h3>

                <p className="text-[11px] text-ink-2 mt-1 leading-relaxed line-clamp-2">
                  {p.notes}
                </p>

                <div className="mt-3 pt-3 border-t border-line text-[10px] space-y-1 text-ink-2 font-medium">
                  <div className="flex justify-between">
                    <span>Modelo de Custo:</span>
                    <strong className="text-ink">{p.pricing}</strong>
                  </div>
                  <div className="flex justify-between truncate">
                    <span>Endpoint:</span>
                    <span className="truncate max-w-[130px] font-mono">{p.endpoint}</span>
                  </div>
                  {p.latencyMs != null && (
                    <div className="flex justify-between">
                      <span>Latência:</span>
                      <strong className="text-emerald-500 font-mono">{p.latencyMs} ms</strong>
                    </div>
                  )}
                  {p.lastChecked && (
                    <div className="flex justify-between">
                      <span>Último Teste:</span>
                      <span>{p.lastChecked}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between gap-2">
                {p.canTest ? (
                  <button
                    type="button"
                    onClick={() => handleTestProvider(p.id)}
                    disabled={isTesting}
                    className="w-full bg-surface-2 hover:bg-line text-ink border border-line text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isTesting ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Activity size={12} />
                    )}
                    {isTesting ? 'Testando...' : 'Testar Conexão'}
                  </button>
                ) : (
                  <span className="text-[11px] text-ink-2 italic mx-auto">Conector nativo</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
