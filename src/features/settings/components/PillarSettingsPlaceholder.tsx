import { useState } from 'react';
import { Settings, Shield, Zap, Link, UserCog, Save } from 'lucide-react';
import { CommandCenterHeader } from '../../../components/ui/CommandCenterHeader.js';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';

interface PillarSettingsProps {
  pillarName: string;
}

export function PillarSettingsPlaceholder({ pillarName }: PillarSettingsProps) {
  const [activeTab, setActiveTab] = useState('permissoes');

  const tabs = [
    { id: 'permissoes', label: 'Permissões e Acessos', icon: Shield },
    { id: 'automacoes', label: 'Automações Locais', icon: Zap },
    { id: 'integracoes', label: 'Integrações Específicas', icon: Link },
    { id: 'roles', label: 'Papéis (Roles)', icon: UserCog },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg)] text-[var(--ink)]">
      <CommandCenterHeader
        title={`Configurações: ${pillarName}`}
        icon={Settings}
        actions={
          <Button variant="default" size="sm">
            <Save className="w-4 h-4 mr-2" /> Salvar Alterações
          </Button>
        }
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Settings Sidebar */}
        <div className="w-64 border-r border-[var(--line)] bg-[var(--surface)] p-4 flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--nav-c-blue)]/10 text-[var(--nav-c-blue)]'
                    : 'text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-1">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <p className="text-[var(--ink-2)] text-sm">
                Gerencie os parâmetros desta categoria exclusivamente para o{' '}
                <strong>{pillarName}</strong>.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Controle de Acesso Modular</CardTitle>
                <CardDescription>
                  Defina quais papéis podem visualizar ou editar dados dentro deste pilar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 border-t border-[var(--line)] pt-6">
                {['Admin', 'Gestor', 'Closer', 'SDR', 'Visualizador'].map((role) => (
                  <div
                    key={role}
                    className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-lg border border-[var(--line)]"
                  >
                    <div>
                      <p className="font-medium text-sm">{role}</p>
                      <p className="text-xs text-[var(--ink-3)]">
                        Acesso padrão de {role.toLowerCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={['Admin', 'Gestor', 'Closer'].includes(role)}
                          className="rounded border-[var(--line)] text-[var(--nav-c-blue)] focus:ring-[var(--nav-c-blue)]"
                        />
                        Leitura
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={['Admin', 'Gestor'].includes(role)}
                          className="rounded border-[var(--line)] text-[var(--nav-c-blue)] focus:ring-[var(--nav-c-blue)]"
                        />
                        Escrita
                      </label>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="p-4 bg-[var(--nav-c-blue)]/5 border border-[var(--nav-c-blue)]/20 rounded-lg flex gap-4">
              <Shield className="text-[var(--nav-c-blue)] shrink-0" />
              <div>
                <h4 className="font-medium text-sm text-[var(--nav-c-blue)]">
                  Alterações em Nível de Pilar
                </h4>
                <p className="text-xs text-[var(--nav-c-blue)]/80 mt-1">
                  As regras aplicadas aqui afetam apenas as ferramentas que pertencem ao{' '}
                  {pillarName}. Para configurações sistêmicas, utilize a Administração Global.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
