import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { api } from '../../../lib/api.js';
import { PRODUCT_MODULES } from '../../../config/product-modules.js';
import {
  Settings,
  LayoutTemplate,
  Search,
  Mic,
  Radar,
  Globe,
  Cpu,
  Check,
  ChevronRight,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Settings: <Settings className="w-8 h-8" />,
  LayoutTemplate: <LayoutTemplate className="w-8 h-8" />,
  Search: <Search className="w-8 h-8" />,
  Mic: <Mic className="w-8 h-8" />,
  Radar: <Radar className="w-8 h-8" />,
  Globe: <Globe className="w-8 h-8" />,
  Cpu: <Cpu className="w-8 h-8" />,
};

export function SetupWizard() {
  const [step, setStep] = useState(1);
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set(['crm-comercial']));
  const [isLoading, setIsLoading] = useState(false);
  const _navigate = useNavigate();

  const toggleModule = (key: string) => {
    const next = new Set(selectedModules);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setSelectedModules(next);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Ativa os módulos selecionados
      for (const mod of selectedModules) {
        await api.post(`/api/organization-modules/${mod}`, {});
      }
      // Conclui o onboarding
      await api.post('/api/organization-modules/onboarding/complete', {});

      // Limpa cache/recarrega e vai pro dashboard
      window.location.href = '/app';
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full">
        {/* Header do Wizard */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-ink mb-2">Bem-vindo(a) ao Birth Hub 360</h1>
          <p className="text-ink-2">Configure os módulos que sua organização vai utilizar.</p>
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRODUCT_MODULES.map((mod) => (
                <Card
                  key={mod.key}
                  padding="lg"
                  variant="bento"
                  spotlight
                  soundHover
                  soundClick
                  className={`cursor-pointer transition-all border relative active:scale-95 group/mod ${mod.alwaysActive ? 'opacity-70 pointer-events-none' : ''} ${selectedModules.has(mod.key) || mod.alwaysActive ? 'border-brand shadow-[0_8px_32px_-12px_rgba(212,175,55,0.4)]' : 'border-line hover:border-brand/40'}`}
                  onClick={() => !mod.alwaysActive && toggleModule(mod.key)}
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand/40 to-transparent opacity-0 group-hover/mod:opacity-100 transition-opacity duration-700 z-20"
                    aria-hidden="true"
                  />
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-30 ${mod.colorTheme}`}
                  >
                    {iconMap[mod.iconName] || <Settings />}
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">{mod.label}</h3>
                  <p className="text-sm text-ink-2">{mod.description}</p>

                  {(selectedModules.has(mod.key) || mod.alwaysActive) && (
                    <div className="absolute top-4 right-4 text-brand">
                      <Check className="w-6 h-6" />
                    </div>
                  )}
                  {mod.alwaysActive && (
                    <div className="mt-4 text-xs font-semibold text-ink-2 uppercase tracking-wide">
                      Módulo Base Obrigatório
                    </div>
                  )}
                </Card>
              ))}
            </div>

            <div className="flex justify-end pt-8 border-t border-line">
              <Button
                onClick={() => setStep(2)}
                size="lg"
                soundClick
                className="bg-brand text-on-brand hover:bg-brand-active active:scale-95 transition-all shadow-md"
              >
                Continuar <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in text-center max-w-xl mx-auto space-y-8">
            <div className="w-24 h-24 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-ink">Tudo pronto!</h2>
            <p className="text-ink-2 text-lg">
              Você configurou {selectedModules.size} módulos. Você poderá alterar estas
              configurações mais tarde na aba de Administração.
            </p>

            <div className="flex justify-center gap-4 pt-8">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                size="lg"
                soundClick
                className="active:scale-95 transition-all"
              >
                Voltar
              </Button>
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                size="lg"
                soundClick
                className="bg-brand text-on-brand hover:bg-brand-active shadow-xl shadow-brand/20 active:scale-95 transition-all"
              >
                {isLoading ? 'Configurando...' : 'Ir para o Dashboard'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
