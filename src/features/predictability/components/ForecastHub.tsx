import React from 'react';
import { LineChart, TrendingUp, Target, DollarSign, Calendar, Filter } from 'lucide-react';
import { CommandCenterHeader } from '../../../components/ui/CommandCenterHeader.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { KpiCard } from '../../../components/ui/KpiCard.js';
import { Button } from '../../../components/ui/Button.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/Table.js';
import { Badge } from '../../../components/ui/Badge.js';

export function ForecastHub() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg)] text-[var(--ink)]">
      <CommandCenterHeader
        title="Forecast de Vendas"
        icon={LineChart}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Filter className="w-4 h-4 mr-2" /> Filtros
            </Button>
            <Button variant="default" size="sm">
              <Calendar className="w-4 h-4 mr-2" /> Mês Atual
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="mb-4">
          <p className="text-sm text-[var(--ink-2)]">
            Projete seus resultados com precisão baseada em dados
          </p>
        </div>
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Previsão de Fechamento"
            value="R$ 145.000"
            trend={{ value: '+12%', isPositive: true }}
            icon={TrendingUp}
            subtitle="Baseado em conversão histórica"
            variant="default"
          />
          <KpiCard
            title="Gap para a Meta"
            value="R$ 55.000"
            trend={{ value: 'Faltam 28%', isPositive: false }}
            icon={Target}
            subtitle="Meta Mensal: R$ 200.000"
            variant="default"
          />
          <KpiCard
            title="Pipeline Total Ativo"
            value="R$ 890.000"
            trend={{ value: '+5%', isPositive: true }}
            icon={DollarSign}
            subtitle="42 negócios em andamento"
            variant="default"
          />
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader>
              <CardTitle>Trajetória de Forecast vs Meta</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px] flex items-center justify-center border-t border-[var(--line)]">
              {/* Fake Chart */}
              <div className="text-center text-[var(--ink-3)] font-mono text-sm space-y-4">
                <LineChart size={48} className="mx-auto opacity-20" />
                <p>Gráfico de evolução (Placeholder)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Probabilidade por Etapa</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto border-t border-[var(--line)] p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etapa</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Proposta</TableCell>
                    <TableCell className="text-right text-[var(--nav-c-green)]">45%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Negociação</TableCell>
                    <TableCell className="text-right text-[var(--nav-c-green)]">72%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fechamento</TableCell>
                    <TableCell className="text-right text-[var(--nav-c-green)]">90%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Negócios no Forecast</CardTitle>
          </CardHeader>
          <CardContent className="p-0 border-t border-[var(--line)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Probabilidade</TableHead>
                  <TableHead>Data Prevista</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Tech Solutions S/A</TableCell>
                  <TableCell>R$ 45.000</TableCell>
                  <TableCell>90%</TableCell>
                  <TableCell>15/10/2026</TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="bg-[var(--nav-c-green)]/10 text-[var(--nav-c-green)]"
                    >
                      Quente
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Global Corp</TableCell>
                  <TableCell>R$ 120.000</TableCell>
                  <TableCell>60%</TableCell>
                  <TableCell>22/10/2026</TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="bg-[var(--nav-c-gold)]/10 text-[var(--nav-c-gold)]"
                    >
                      Morno
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Inovação BR</TableCell>
                  <TableCell>R$ 28.000</TableCell>
                  <TableCell>85%</TableCell>
                  <TableCell>10/10/2026</TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="bg-[var(--nav-c-green)]/10 text-[var(--nav-c-green)]"
                    >
                      Quente
                    </Badge>
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
