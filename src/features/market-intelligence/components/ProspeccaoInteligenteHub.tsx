import React, { useState } from 'react';
import {
  Search,
  Users,
  Database,
  Filter,
  Building2,
  CheckCircle2,
  Download,
  Plus,
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
import { Input } from '../../../components/ui/Input.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/Table.js';

export function ProspeccaoInteligenteHub() {
  const [searchTerm, setSearchTerm] = useState('');

  const prospects = [
    {
      id: '1',
      nome: 'Rodrigo Medeiros',
      cargo: 'Head de Vendas',
      empresa: 'CloudScale Brasil',
      setor: 'SaaS',
      faturamento: 'R$ 25M - R$ 50M',
      status: 'Verificado',
    },
    {
      id: '2',
      nome: 'Camila Guimarães',
      cargo: 'Diretora Comercial',
      empresa: 'Apex Logística',
      setor: 'Logística',
      faturamento: 'R$ 80M - R$ 120M',
      status: 'Verificado',
    },
    {
      id: '3',
      nome: 'Marcos Vinicius',
      cargo: 'VP de Receita (CRO)',
      empresa: 'Fintech Nexus',
      setor: 'Fintech',
      faturamento: 'R$ 50M - R$ 100M',
      status: 'Verificado',
    },
    {
      id: '4',
      nome: 'Fernanda Prado',
      cargo: 'Gerente de Prospecção',
      empresa: 'AgroData Corp',
      setor: 'Agritech',
      faturamento: 'R$ 30M - R$ 60M',
      status: 'Pendente',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg)] text-[var(--ink)]">
      <CommandCenterHeader
        title="Prospecção Inteligente"
        icon={Search}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Exportar CSV
            </Button>
            <Button variant="default" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Nova Busca B2B
            </Button>
          </div>
        }
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Motor de Descoberta de Decisores</h2>
          <p className="text-sm text-[var(--ink-2)]">
            Localize decisores C-Level e lideranças comerciais com e-mails e números de WhatsApp
            corporativos verificados.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Decisores Mapeados"
            value="4.850 contatos"
            trend={{ value: '100% verificados', isPositive: true }}
            icon={Users}
            subtitle="Com dados diretos de contato"
            variant="default"
          />
          <KpiCard
            title="Taxa de Entregabilidade"
            value="98.2%"
            trend={{ value: 'Zero bounce garantido', isPositive: true }}
            icon={CheckCircle2}
            subtitle="Validação MX e SMTP ativa"
            variant="default"
          />
          <KpiCard
            title="Enriquecimentos no Mês"
            value="1.240 consultas"
            trend={{ value: 'Dentro do plano Pro', isPositive: true }}
            icon={Database}
            subtitle="Créditos restantes: 3.760"
            variant="default"
          />
        </div>

        {/* Tabela de Decisores Encontrados */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Decisores Recém-Localizados pelo ICP</CardTitle>
                <CardDescription>
                  Prontos para envio para cadência ou CRM em 1 clique.
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-3)]" />
                <Input
                  type="text"
                  placeholder="Filtrar por nome, cargo ou empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 border-t border-[var(--line)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Decisor</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Faixa de Faturamento</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prospects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-semibold text-sm">{p.nome}</TableCell>
                    <TableCell className="text-xs text-[var(--ink-2)]">{p.cargo}</TableCell>
                    <TableCell className="text-xs font-medium">{p.empresa}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {p.setor}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-[var(--ink-3)] font-mono">
                      {p.faturamento}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-[var(--nav-c-green)]/10 text-[var(--nav-c-green)] text-xs"
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="default" size="sm">
                        Adicionar ao CRM
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
