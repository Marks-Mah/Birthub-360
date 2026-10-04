import React, { useEffect, useState } from 'react';
import { MessageSquareText, Copy, Check, Phone, MessageSquare, Mail, Users, Plus, Sparkles, Filter } from 'lucide-react';
import { CommandCenterHeader } from '../../../components/ui/CommandCenterHeader.js';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card.js';
import { KpiCard } from '../../../components/ui/KpiCard.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import { orchestrationApi, type RoteiroItem } from '../orchestration.api.js';

export function RoteirosHub() {
  const [roteiros, setRoteiros] = useState<RoteiroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCanal, setSelectedCanal] = useState<string>('Todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    orchestrationApi.getOverview().then((res) => {
      if (mounted) {
        setRoteiros(res.roteiros);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const canais = ['Todos', 'Telefone', 'WhatsApp', 'Reunião'];

  const filtered = roteiros.filter((r) => selectedCanal === 'Todos' || r.canal === selectedCanal);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case 'Telefone':
        return <Phone className="w-4 h-4 text-[var(--nav-c-red)]" />;
      case 'WhatsApp':
        return <MessageSquare className="w-4 h-4 text-[var(--nav-c-green)]" />;
      case 'Reunião':
        return <Users className="w-4 h-4 text-[var(--nav-c-blue)]" />;
      default:
        return <Mail className="w-4 h-4 text-[var(--nav-c-iris)]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg)] text-[var(--ink)]">
      <CommandCenterHeader
        title="Roteiros de Abordagem"
        icon={MessageSquareText}
        actions={
          <div className="flex gap-2">
            <Button variant="default" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Novo Roteiro
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Biblioteca de Scripts Comerciais</h2>
            <p className="text-sm text-[var(--ink-2)]">
              Modelos validados com ganchos de atenção, perguntas de diagnóstico e técnicas comprovadas de fechamento.
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Scripts Catalogados"
            value="18 roteiros"
            trend={{ value: "Multicanal", isPositive: true }}
            icon={MessageSquareText}
            subtitle="Cold call, whatsapp e reuniões"
            variant="default"
          />
          <KpiCard
            title="Taxa de Conexão Média"
            value="79.3%"
            trend={{ value: "+8.5% com ganchos validados", isPositive: true }}
            icon={Sparkles}
            subtitle="Eficácia comprovada no campo"
            variant="default"
          />
          <KpiCard
            title="Variáveis Dinâmicas"
            value="100% integradas"
            trend={{ value: "Auto-preenchimento CRM", isPositive: true }}
            icon={Check}
            subtitle="Zero cópia manual"
            variant="default"
          />
        </div>

        {/* Filtro por Canal */}
        <div className="flex gap-2">
          {canais.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCanal(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCanal === c
                  ? 'bg-[var(--nav-c-blue)] text-white shadow-sm'
                  : 'bg-[var(--surface-2)] text-[var(--ink-2)] hover:text-[var(--ink)] border border-[var(--line)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid de Roteiros */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-56 bg-[var(--surface-2)] rounded-xl" />
            <div className="h-56 bg-[var(--surface-2)] rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((rot) => (
              <Card key={rot.id} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--line)]">
                          {getCanalIcon(rot.canal)}
                          {rot.canal}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {rot.fase}
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{rot.titulo}</CardTitle>
                    </div>
                    <Badge variant="default" className="bg-[var(--nav-c-green)]/10 text-[var(--nav-c-green)] text-xs">
                      {rot.taxaSucesso}% eficácia
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="border-t border-[var(--line)] pt-4">
                  <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--line)] font-mono text-xs text-[var(--ink)] mb-4 whitespace-pre-wrap leading-relaxed">
                    {rot.corpoTexto}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-[var(--ink-3)] font-semibold uppercase">Variáveis:</span>
                      {rot.variaveis.map((v) => (
                        <span key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--line)] text-[var(--nav-c-blue)]">
                          {`{${v}}`}
                        </span>
                      ))}
                    </div>

                    <Button
                      variant={copiedId === rot.id ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleCopy(rot.id, rot.corpoTexto)}
                      className="ml-2 shrink-0"
                    >
                      {copiedId === rot.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1 text-[var(--nav-c-green)]" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1" /> Copiar Roteiro
                        </>
                      )}
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
