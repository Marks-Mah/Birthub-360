import React from 'react';
import { Layers, Calculator, BarChart4, AlertCircle } from 'lucide-react';
import { CommandCenterHeader } from '../../../components/ui/CommandCenterHeader.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { KpiCard } from '../../../components/ui/KpiCard.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/Table.js';

export function PipelinePonderadoHub() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg)] text-[var(--ink)]">
      <CommandCenterHeader title="Pipeline Ponderado" icon={Layers} />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="mb-4">
          <p className="text-sm text-[var(--ink-2)]">
            O valor real do seu funil ajustado pelo risco de fechamento
          </p>
        </div>
        {/* KPIs Globais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Valor Bruto do Funil"
            value="R$ 1.250.000"
            trend={{ value: '140 negócios', isPositive: true }}
            icon={BarChart4}
            subtitle="Soma total sem descontos"
            variant="default"
          />
          <KpiCard
            title="Valor Ponderado (Real)"
            value="R$ 485.000"
            trend={{ value: '38.8% do Bruto', isPositive: true }}
            icon={Calculator}
            subtitle="Ajustado pela probabilidade"
            variant="default"
          />
          <KpiCard
            title="Risco Calculado"
            value="Alto"
            trend={{ value: 'R$ 765k em risco', isPositive: false }}
            icon={AlertCircle}
            subtitle="Falta tração no topo do funil"
            variant="default"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cálculo por Etapa do Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="p-0 border-t border-[var(--line)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fase</TableHead>
                  <TableHead className="text-right">Volume (Qtd)</TableHead>
                  <TableHead className="text-right">Valor Bruto</TableHead>
                  <TableHead className="text-center">Probabilidade (Win Rate)</TableHead>
                  <TableHead className="text-right">Valor Ponderado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">1. Prospecção Ativa</TableCell>
                  <TableCell className="text-right">45</TableCell>
                  <TableCell className="text-right">R$ 450.000</TableCell>
                  <TableCell className="text-center text-[var(--ink-3)]">10%</TableCell>
                  <TableCell className="text-right font-semibold">R$ 45.000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">2. Qualificação (SDR)</TableCell>
                  <TableCell className="text-right">32</TableCell>
                  <TableCell className="text-right">R$ 320.000</TableCell>
                  <TableCell className="text-center text-[var(--ink-3)]">25%</TableCell>
                  <TableCell className="text-right font-semibold">R$ 80.000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">3. Apresentação / Demo</TableCell>
                  <TableCell className="text-right">28</TableCell>
                  <TableCell className="text-right">R$ 280.000</TableCell>
                  <TableCell className="text-center text-[var(--ink-3)]">50%</TableCell>
                  <TableCell className="text-right font-semibold">R$ 140.000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">4. Envio de Proposta</TableCell>
                  <TableCell className="text-right">20</TableCell>
                  <TableCell className="text-right">R$ 120.000</TableCell>
                  <TableCell className="text-center text-[var(--ink-3)]">75%</TableCell>
                  <TableCell className="text-right font-semibold">R$ 90.000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">5. Negociação Final</TableCell>
                  <TableCell className="text-right">15</TableCell>
                  <TableCell className="text-right">R$ 80.000</TableCell>
                  <TableCell className="text-center text-[var(--ink-3)]">90%</TableCell>
                  <TableCell className="text-right font-semibold text-[var(--nav-c-green)]">
                    R$ 72.000
                  </TableCell>
                </TableRow>
                <TableRow className="bg-[var(--surface-2)]">
                  <TableCell className="font-bold">Total Geral</TableCell>
                  <TableCell className="text-right font-bold">140</TableCell>
                  <TableCell className="text-right font-bold">R$ 1.250.000</TableCell>
                  <TableCell className="text-center font-bold">--</TableCell>
                  <TableCell className="text-right font-bold text-[var(--nav-c-teal)]">
                    R$ 427.000
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
