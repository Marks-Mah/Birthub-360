import { Target, Trophy, ArrowUpRight, Users, Medal } from 'lucide-react';
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

export function MetasHub() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg)] text-[var(--ink)]">
      <CommandCenterHeader title="Metas e Projeções" icon={Target} />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="mb-4">
          <p className="text-sm text-[var(--ink-2)]">
            Acompanhamento de cotas e performance do time
          </p>
        </div>
        {/* KPIs Globais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Meta Global do Mês"
            value="R$ 500.000"
            trend={{ value: 'Q3 2026', isPositive: true }}
            icon={Target}
            subtitle="Objetivo da empresa"
            variant="default"
          />
          <KpiCard
            title="Total Atingido"
            value="R$ 385.000"
            trend={{ value: '77%', isPositive: true }}
            icon={Trophy}
            subtitle="Faltam R$ 115.000"
            variant="default"
          />
          <KpiCard
            title="Pace (Ritmo Atual)"
            value="105%"
            trend={{ value: '+5%', isPositive: true }}
            icon={ArrowUpRight}
            subtitle="Projeção final: R$ 525.000"
            variant="default"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-[var(--nav-c-gold)]" />
                Leaderboard (Top Performers)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 border-t border-[var(--line)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Meta</TableHead>
                    <TableHead>Realizado</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">João Reis</TableCell>
                    <TableCell>R$ 100k</TableCell>
                    <TableCell>R$ 115k</TableCell>
                    <TableCell className="text-right text-[var(--nav-c-green)] font-semibold">
                      115%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Maria Silva</TableCell>
                    <TableCell>R$ 100k</TableCell>
                    <TableCell>R$ 95k</TableCell>
                    <TableCell className="text-right text-[var(--nav-c-gold)] font-semibold">
                      95%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Carlos Andrade</TableCell>
                    <TableCell>R$ 100k</TableCell>
                    <TableCell>R$ 45k</TableCell>
                    <TableCell className="text-right text-[var(--nav-c-red)] font-semibold">
                      45%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--nav-c-iris)]" />
                Metas por Equipe
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 border-t border-[var(--line)] space-y-6">
              {/* Fake Progress Bars */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Equipe Enterprise</span>
                  <span className="text-[var(--nav-c-green)]">82%</span>
                </div>
                <div className="h-2 w-full bg-[var(--line)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--nav-c-green)] w-[82%]" />
                </div>
                <p className="text-xs text-[var(--ink-3)]">R$ 246.000 de R$ 300.000</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Equipe SMB</span>
                  <span className="text-[var(--nav-c-gold)]">69%</span>
                </div>
                <div className="h-2 w-full bg-[var(--line)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--nav-c-gold)] w-[69%]" />
                </div>
                <p className="text-xs text-[var(--ink-3)]">R$ 138.000 de R$ 200.000</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
