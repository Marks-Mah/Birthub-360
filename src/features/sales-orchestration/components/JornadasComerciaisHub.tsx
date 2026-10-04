import React, { useEffect, useState } from 'react';
import { GitBranch, Clock, ArrowRight, CheckCircle2, Shield, AlertTriangle, Users } from 'lucide-react';
import { CommandCenterHeader } from '../../../components/ui/CommandCenterHeader.js';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card.js';
import { KpiCard } from '../../../components/ui/KpiCard.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import { orchestrationApi, type JornadaEtapa } from '../orchestration.api.js';

export function JornadasComerciaisHub() {
  const [jornadas, setJornadas] = useState<JornadaEtapa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    orchestrationApi.getOverview().then((res) => {
      if (mounted) {
        setJornadas(res.jornadas);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg)] text-[var(--ink)]">
      <CommandCenterHeader
        title="Jornadas Comerciais"
        icon={GitBranch}
        actions={
          <div className="flex gap-2">
            <Button variant="default" size="sm">
              <GitBranch className="w-4 h-4 mr-2" /> Nova Jornada
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold">Mapeamento da Jornada do Comprador</h2>
          <p className="text-sm text-[var(--ink-2)]">
            Acompanhe o caminho percorrido pelo cliente desde a descoberta inicial até a assinatura e kickoff, com SLAs e pontos de atrito controlados.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Ciclo Médio de Venda"
            value="15.5 dias"
            trend={{ value: "-3.2 dias vs mês anterior", isPositive: true }}
            icon={Clock}
            subtitle="Do primeiro toque ao fechamento"
            variant="default"
          />
          <KpiCard
            title="Conversão Ponta a Ponta"
            value="11.4%"
            trend={{ value: "+1.8%", isPositive: true }}
            icon={CheckCircle2}
            subtitle="De Lead Descoberto a Negócio Ganho"
            variant="default"
          />
          <KpiCard
            title="SLA de Passagem de Bastão"
            value="94.2%"
            trend={{ value: "Dentro do limite de 4h", isPositive: true }}
            icon={Shield}
            subtitle="SDR → Closer sem atrasos"
            variant="default"
          />
        </div>

        {/* Diagrama Visual de Etapas da Jornada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Fluxo Operacional da Jornada Padrão</span>
              <Badge variant="default" className="bg-[var(--nav-c-blue)]/10 text-[var(--nav-c-blue)] font-normal">
                Modelo Ativo: Enterprise & Mid-Market
              </Badge>
            </CardTitle>
            <CardDescription>
              Sequência de transições e touchpoints acordados entre pré-vendas, vendas e pós-vendas.
            </CardDescription>
          </CardHeader>
          <CardContent className="border-t border-[var(--line)] pt-6">
            {loading ? (
              <div className="h-64 bg-[var(--surface-2)] rounded-xl animate-pulse" />
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  {jornadas.map((etapa, idx) => (
                    <div
                      key={etapa.id}
                      className="relative p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold text-[var(--nav-c-blue)]">
                            PASSO {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-[var(--nav-c-green)]">
                            {etapa.conversionRate}% conv.
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{etapa.name}</h4>
                        <p className="text-xs text-[var(--ink-3)] mb-3">{etapa.personaStage}</p>

                        <div className="space-y-1 mb-4">
                          <span className="text-[10px] font-bold tracking-wider text-[var(--ink-3)] uppercase">
                            Touchpoints
                          </span>
                          {etapa.touchpoints.map((tp) => (
                            <div key={tp} className="text-xs text-[var(--ink-2)] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--nav-c-blue)]" />
                              {tp}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[var(--line)] pt-3 text-xs flex items-center justify-between text-[var(--ink-3)]">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> {etapa.ownerRole}
                        </span>
                        <span>SLA: {etapa.slaHours}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
