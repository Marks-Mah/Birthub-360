import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Users, Plus, ArrowUpRight, ShieldCheck, Search, Filter } from 'lucide-react';
import { CommandCenterHeader } from '../../../components/ui/CommandCenterHeader.js';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card.js';
import { KpiCard } from '../../../components/ui/KpiCard.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import { Input } from '../../../components/ui/Input.js';
import { orchestrationApi, type PlaybookItem } from '../orchestration.api.js';

export function PlaybooksHub() {
  const [playbooks, setPlaybooks] = useState<PlaybookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  useEffect(() => {
    let mounted = true;
    orchestrationApi.getOverview().then((res) => {
      if (mounted) {
        setPlaybooks(res.playbooks);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const categories = ['Todas', 'Outbound', 'Inbound', 'Enterprise', 'Expansão'];

  const filteredPlaybooks = playbooks.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg)] text-[var(--ink)]">
      <CommandCenterHeader
        title="Playbooks Comerciais"
        icon={BookOpen}
        actions={
          <div className="flex gap-2">
            <Button variant="default" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Novo Playbook
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Diretório de Playbooks</h2>
            <p className="text-sm text-[var(--ink-2)]">
              Padronização de abordagens, réguas operacionais e critérios de avanço por papel comercial.
            </p>
          </div>
        </div>

        {/* KPIs Globais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            title="Playbooks Ativos"
            value="6"
            trend={{ value: "+2 este trimestre", isPositive: true }}
            icon={BookOpen}
            subtitle="100% alinhados ao ICP"
            variant="default"
          />
          <KpiCard
            title="Aderência Operacional"
            value="88.4%"
            trend={{ value: "+4.2%", isPositive: true }}
            icon={ShieldCheck}
            subtitle="Execução dos passos obrigatórios"
            variant="default"
          />
          <KpiCard
            title="Tempo Médio de Rampa"
            value="14 dias"
            trend={{ value: "-5 dias", isPositive: true }}
            icon={Clock}
            subtitle="Novos vendedores operando"
            variant="default"
          />
          <KpiCard
            title="Pessoas Impactadas"
            value="28 rep."
            trend={{ value: "SDRs e Closers", isPositive: true }}
            icon={Users}
            subtitle="Engajamento diário ativo"
            variant="default"
          />
        </div>

        {/* Barra de Filtro e Busca */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-3)]" />
            <Input
              type="text"
              placeholder="Buscar playbook..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[var(--nav-c-blue)] text-white shadow-sm'
                    : 'bg-[var(--surface-2)] text-[var(--ink-2)] hover:text-[var(--ink)] border border-[var(--line)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Playbooks */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-48 bg-[var(--surface-2)] rounded-xl" />
            <div className="h-48 bg-[var(--surface-2)] rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPlaybooks.map((pb) => (
              <Card key={pb.id} className="flex flex-col justify-between hover:border-[var(--nav-c-blue)]/50 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default" className="bg-[var(--nav-c-blue)]/10 text-[var(--nav-c-blue)]">
                          {pb.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Público: {pb.targetRole}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{pb.title}</CardTitle>
                    </div>
                    <Badge
                      variant="default"
                      className={
                        pb.status === 'Ativo'
                          ? 'bg-[var(--nav-c-green)]/10 text-[var(--nav-c-green)]'
                          : 'bg-[var(--nav-c-gold)]/10 text-[var(--nav-c-gold)]'
                      }
                    >
                      {pb.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm mt-2 text-[var(--ink-2)]">
                    {pb.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="border-t border-[var(--line)] pt-4 mt-2">
                  <div className="flex items-center justify-between text-xs text-[var(--ink-3)] mb-4">
                    <span className="flex items-center gap-1 font-medium text-[var(--ink)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--nav-c-green)]" />
                      {pb.stagesCount} Etapas Definidas
                    </span>
                    <span>Aderência: <strong className="text-[var(--nav-c-blue)]">{pb.complianceRate}%</strong></span>
                    <span>Atualizado: {pb.lastUpdated}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="w-full">
                      Abrir Roteiros & Checklists
                    </Button>
                    <Button variant="outline" size="sm">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
