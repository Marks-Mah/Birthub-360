import React, { useState } from 'react';
import {
  Target,
  Search,
  BarChart2,
  Zap,
  Building2,
  TrendingUp,
  Filter,
  Globe,
  ArrowUpRight,
} from 'lucide-react';
import { CommandCenterHeader } from '../../../components/ui/CommandCenterHeader.js';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '../../../components/ui/Card.js';
import { KpiCard } from '../../../components/ui/KpiCard.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';

export function InteligenciaMercadoHub() {
  const [selectedSegmento, setSelectedSegmento] = useState('SaaS B2B');

  const sinais = [
    {
      empresa: 'TechLog Soluções',
      sinal: 'Abriu 5 vagas comerciais (SDR/Closer)',
      timing: 'Hoje às 09:15',
      score: 94,
    },
    {
      empresa: 'AgroFinance Tech',
      sinal: 'Recebeu aporte Series A de R$ 15M',
      timing: 'Ontem',
      score: 89,
    },
    {
      empresa: 'Varejo Connect',
      sinal: 'Trocou de CRM no stack público',
      timing: 'Há 2 dias',
      score: 82,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg)] text-[var(--ink)]">
      <CommandCenterHeader
        title="Inteligência de Mercado"
        icon={Target}
        actions={
          <div className="flex gap-2">
            <Button variant="default" size="sm">
              <Zap className="w-4 h-4 mr-2" /> Novo Radar de Sinais
            </Button>
          </div>
        }
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Radar de Mercado & ICP</h2>
          <p className="text-sm text-[var(--ink-2)]">
            Transforme dados de mercado e sinais de intenção em oportunidades qualificadas.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Contas no Radar ICP"
            value="1.420 empresas"
            trend={{ value: '+120 novas este mês', isPositive: true }}
            icon={Building2}
            subtitle="Faturamento e CNAE aderentes"
            variant="default"
          />
          <KpiCard
            title="Sinais Quentes Captados"
            value="38 alertas"
            trend={{ value: 'Intenção alta', isPositive: true }}
            icon={Zap}
            subtitle="Gatilhos de expansão e contratação"
            variant="default"
          />
          <KpiCard
            title="Taxa de Precisão ICP"
            value="91.4%"
            trend={{ value: '+3.2%', isPositive: true }}
            icon={TrendingUp}
            subtitle="Validação com base na Receita"
            variant="default"
          />
        </div>

        {/* Sinais em Tempo Real */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sinais de Mercado Recentes</CardTitle>
              <CardDescription>
                Oportunidades com momento ideal de abordagem detectado pela IA.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 border-t border-[var(--line)] pt-4">
              {sinais.map((s) => (
                <div
                  key={s.empresa}
                  className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{s.empresa}</span>
                      <Badge
                        variant="default"
                        className="bg-[var(--nav-c-teal)]/10 text-[var(--nav-c-teal)] text-xs"
                      >
                        Score {s.score}
                      </Badge>
                    </div>
                    <p className="text-xs text-[var(--ink-2)] mt-0.5">{s.sinal}</p>
                    <span className="text-[10px] text-[var(--ink-3)] font-mono">{s.timing}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Conta <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de ICP por Setor</CardTitle>
              <CardDescription>
                Segmentos mais representativos no seu mercado endereçável (TAM).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 border-t border-[var(--line)] pt-6">
              {[
                { setor: 'Tecnologia & Software', percent: 45, count: 639 },
                { setor: 'Serviços Financeiros & Fintechs', percent: 28, count: 397 },
                { setor: 'Logística & Cadeia de Suprimentos', percent: 18, count: 255 },
                { setor: 'Indústria & Manufatura 4.0', percent: 9, count: 129 },
              ].map((item) => (
                <div key={item.setor} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{item.setor}</span>
                    <span className="text-[var(--ink-3)]">
                      {item.count} empresas ({item.percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[var(--surface-2)] rounded-full overflow-hidden border border-[var(--line)]">
                    <div
                      className="h-full bg-[var(--nav-c-teal)] rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
