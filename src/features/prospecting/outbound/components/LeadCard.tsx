import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import type {
  Lead,
  LeadStage,
  ThemeMode,
  IntegrationsConfig,
  AIConfig,
  User,
  LeadTask,
} from '../types.js';
import { LeadQualityBadge } from './LeadQualityBadge.js';
import { LeadStageAndTags } from './LeadStageAndTags.js';
import { LeadScoresBadge } from './LeadScoresBadge.js';
import { RequirementEvaluationsBadge } from './RequirementEvaluationsBadge.js';
import { LeadEvidenceModal } from './LeadEvidenceModal.js';
import type { BitrixExportStatus } from './BitrixExportStatusBadge.js';
import { resolveBitrixWebhook } from '../utils/bitrix.js';
import { computeNextAction } from '../utils/nextAction.js';
import {
  LeadCnpjDataSection,
  LeadDecisionMakerSection,
  LeadActionsBar,
  LeadNewsDossierSection,
  LeadOutreachSection,
  LeadTasksAndActivitySection,
  type OutreachChannel,
} from './lead-card/index.js';
import {
  Phone,
  Globe,
  MapPin,
  Mail,
  Check,
  Send,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Hash,
  ShieldAlert,
  Flame,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import { LinkedinIcon as Linkedin } from '../../../../components/ui/icons/LinkedinIcon.js';
import confetti from 'canvas-confetti';

// canvas-confetti draws on a <canvas>, which doesn't resolve CSS var() — so we read the
// active brand's colors from the [data-brand] element (the override lives there, not at :root).
function resolveBrandConfettiColors(): string[] {
  const brandEl = document.querySelector('[data-brand]') || document.documentElement;
  const style = getComputedStyle(brandEl);
  const primary = style.getPropertyValue('--brand-primary').trim() || '#FF5618';
  const secondary = style.getPropertyValue('--brand-secondary').trim() || '#FF8020';
  return [primary, secondary, '#FFC500'];
}

// wa.me só aceita dígitos (com DDI) — os telefones no lead já vêm formatados como
// "+55 (11) 3450-8000", então basta remover tudo que não é número.
function toWhatsAppLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const withCountryCode = digits.startsWith('55') ? digits : `55${digits}`;
  return `https://wa.me/${withCountryCode}`;
}

interface LeadCardProps {
  lead: Lead;
  index?: number;
  pitch?: string;
  aiConfig?: AIConfig;
  onUpdateMessage?: (messageId: string, content: string, status: string) => void;
  onUpdateStage?: (leadId: string, stage: LeadStage) => void;
  onUpdateTags?: (leadId: string, tags: string[]) => void;
  onLeadSaved?: (updatedLead: Lead) => void;
  onSaveLead?: (updatedLead: Lead) => void;
  theme?: ThemeMode;
  integrationsConfig?: IntegrationsConfig;
  isReadOnly?: boolean;
  isUserView?: boolean;
  usersList?: User[];
  startCollapsed?: boolean;
  user?: User;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  index = 0,
  pitch,
  aiConfig,
  onUpdateMessage,
  onUpdateStage,
  onUpdateTags,
  onLeadSaved,
  onSaveLead,
  theme = 'dark',
  integrationsConfig,
  user,
  isReadOnly = false,
  isUserView = false,
  usersList = [],
  startCollapsed = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!startCollapsed);
  const [activeChannel, setActiveChannel] = useState<OutreachChannel>('cold_call');
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copies, setCopies] = useState(
    lead.copies || {
      cold_call: '',
      cold_email: '',
      whatsapp: '',
      linkedin: '',
      objection_matrix: '',
      qualification_matrix: '',
      ice_breaker: '',
    },
  );
  const [msgStatus, setMsgStatus] = useState<string>('draft');

  // Editable Lead General Info
  const [leadName, setLeadName] = useState(lead.name);
  const [leadCnpj, setLeadCnpj] = useState(lead.cnpj || '');
  const [razaoSocial, setRazaoSocial] = useState(lead.razao_social || '');
  const [situacaoCadastral, setSituacaoCadastral] = useState(lead.situacao_cadastral || '');
  const [cnaeFiscal, setCnaeFiscal] = useState(lead.cnae_fiscal || '');
  const [cnaeDescricao, setCnaeDescricao] = useState(lead.cnae_fiscal_descricao || '');
  const [capitalSocial, setCapitalSocial] = useState(lead.capital_social || '');
  const [qsaList, setQsaList] = useState<any[]>(lead.qsa || []);
  const [isRefreshingCnpj, setIsRefreshingCnpj] = useState(false);
  const [cnpjSuccessMsg, setCnpjSuccessMsg] = useState<string | null>(null);

  const [leadPhone, _setLeadPhone] = useState(lead.phone || '');
  const [leadCorporateEmail, _setLeadCorporateEmail] = useState(lead.corporate_email || '');
  const [leadWebsite, _setLeadWebsite] = useState(lead.website || '');
  const [leadAddress, _setLeadAddress] = useState(lead.address || '');

  // Main Decision Maker Info
  const mainDm = lead.decision_makers?.[0] || {
    name: lead.decision_maker_name || '',
    title: lead.decision_maker_title || '',
    email: lead.decision_maker_email || '',
    emails:
      lead.decision_maker_emails || (lead.decision_maker_email ? [lead.decision_maker_email] : []),
    phone: lead.decision_maker_phone || lead.phone || '',
    phones:
      lead.decision_maker_phones ||
      (lead.decision_maker_phone ? [lead.decision_maker_phone] : [lead.phone || '']),
    linkedin: lead.decision_maker_linkedin || '',
  };

  const [dmName, setDmName] = useState(mainDm.name);
  const [dmTitle, setDmTitle] = useState(mainDm.title);
  const [dmEmail, setDmEmail] = useState(mainDm.email);
  const [dmPhone, setDmPhone] = useState(mainDm.phone || leadPhone);
  const [dmLinkedin, setDmLinkedin] = useState(mainDm.linkedin || '');

  // News Dossier state & Collapsible toggle
  const [newsDossier, setNewsDossier] = useState<any>(lead.news_dossier || null);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(Boolean(lead.news_dossier));

  // Tarefa recomendada: regra determinística sobre estágio/tempo parado/checagem
  // no Bitrix — sempre a mesma resposta para o mesmo estado do lead (previsibilidade).
  const nextAction = computeNextAction(lead);
  const bitrixCheckStatus = lead.bitrix_check_status;

  // Second stage enrichment state
  const [isEnrichingNews, setIsEnrichingNews] = useState<boolean>(false);
  const [_enrichStatusMsg, setEnrichStatusMsg] = useState<string>('');
  const [enrichAbortCtrl, setEnrichAbortCtrl] = useState<AbortController | null>(null);

  // On-Demand Copywriting State
  const [isGeneratingCopies, setIsGeneratingCopies] = useState(false);
  const [copiesGenMsg, setCopiesGenMsg] = useState<string | null>(null);

  // Save Lead State
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Integrations states
  const [isExportingBitrix, setIsExportingBitrix] = useState(false);
  const [bitrixResult, setBitrixResult] = useState<{
    success: boolean;
    blocked?: boolean;
    leadId?: number;
    message?: string;
  } | null>(null);

  // Wave 6 (CPI) - Evidence & Provenance: modal "ver evidências", sob demanda
  // (GET /api/leads/:id/evidence só é chamado quando o usuário abre o painel).
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  // Wave 12 (CPI) - CRM/Operação: status real de exportação, nunca um botão
  // fire-and-forget. Prioriza o resultado desta sessão (bitrixResult, setado
  // depois de um clique) sobre o que já estava persistido no lead ao carregar
  // o card — mas cai no valor persistido quando o usuário ainda não clicou
  // nesta sessão (ex.: reabriu um card cuja última tentativa já tinha falhado).
  const effectiveBitrixStatus: BitrixExportStatus = bitrixResult
    ? bitrixResult.success
      ? 'exported'
      : bitrixResult.blocked
        ? 'blocked'
        : 'error'
    : lead.bitrix_export_status || 'not_exported';
  const effectiveBitrixError =
    bitrixResult && !bitrixResult.success ? bitrixResult.message : lead.bitrix_export_error;
  const effectiveBitrixExportedAt = bitrixResult?.success ? undefined : lead.bitrix_exported_at;

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [hunterResult, setHunterResult] = useState<{
    status: string;
    score: number;
    result: string;
  } | null>(null);

  const [isCallingBland, setIsCallingBland] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());

        // Transcribe
        setActivityNotes(
          (prev) => `${prev + (prev ? '\n' : '')}[Transcrevendo áudio com LLaMA3...]`,
        );

        try {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          formData.append(
            'aiConfig',
            JSON.stringify({
              groqApiKey: aiConfig?.groqApiKey || integrationsConfig?.groqApiKey,
            }),
          );

          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (data.text) {
            setActivityNotes((prev) =>
              prev.replace('[Transcrevendo áudio com LLaMA3...]', data.text),
            );
          } else {
            setActivityNotes((prev) =>
              prev.replace('[Transcrevendo áudio com LLaMA3...]', '[Erro na transcrição]'),
            );
          }
        } catch (_err: any) {
          setActivityNotes((prev) =>
            prev.replace('[Transcrevendo áudio com LLaMA3...]', '[Erro na conexão]'),
          );
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (_err: any) {
      alert('Permissão de microfone negada ou indisponível.');
    }
  };

  const [isFastGenerating, setIsFastGenerating] = useState(false);
  const handleFastScript = async () => {
    setIsFastGenerating(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}/generate-copies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pitch,
          aiConfig: {
            ...aiConfig,
            groqApiKey: aiConfig?.groqApiKey || integrationsConfig?.groqApiKey,
          },
          tone: enrichTone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.copies?.cold_call) {
        navigator.clipboard.writeText(data.copies.cold_call);
        alert('Script de Cold Call copiado para a área de transferência!');
      } else {
        alert('Erro ao gerar script');
      }
    } catch (_err: any) {
      alert('Erro de conexão ao gerar script rápido');
    } finally {
      setIsFastGenerating(false);
    }
  };

  const [blandResult, setBlandResult] = useState<{
    success: boolean;
    callId?: string;
    message?: string;
  } | null>(null);

  const [enrichTone, setEnrichTone] = useState<string>('consultivo');

  const [activityNotes, setActivityNotes] = useState(lead.activity_notes || '');
  const [activityContext, setActivityContext] = useState(lead.activity_context || '');
  const [assignedTo, setAssignedTo] = useState(lead.assigned_to || '');

  // Tarefas do lead (agendamento manual: "ligar de volta dia X", "enviar proposta")
  const [tasks, setTasks] = useState<LeadTask[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [taskError, setTaskError] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const hasCopies = Boolean(
    (copies.cold_call && copies.cold_call.trim().length > 10) ||
      (copies.cold_email && copies.cold_email.trim().length > 10) ||
      (copies.whatsapp && copies.whatsapp.trim().length > 10) ||
      (copies.linkedin && copies.linkedin.trim().length > 10),
  );

  const handleCopy = (channel: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(channel);
    setTimeout(() => setCopiedChannel(null), 2000);
  };

  // CNPJ Direct Refresh Action
  const handleRefreshCnpj = async () => {
    setIsRefreshingCnpj(true);
    setCnpjSuccessMsg(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}/cnpj-refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnpj: leadCnpj }),
      });
      const data = await res.json();
      if (res.ok && data.cnpjData) {
        setLeadCnpj(data.cnpjData.cnpj);
        setRazaoSocial(data.cnpjData.razao_social);
        setSituacaoCadastral(data.cnpjData.situacao_cadastral);
        setCnaeFiscal(data.cnpjData.cnae_fiscal);
        setCnaeDescricao(data.cnpjData.cnae_fiscal_descricao);
        setCapitalSocial(data.cnpjData.capital_social);
        setQsaList(data.cnpjData.qsa || []);
        setCnpjSuccessMsg('CNPJ Atualizado via Receita Federal!');
        setTimeout(() => setCnpjSuccessMsg(null), 3500);
      } else {
        alert(data.error || 'Falha ao consultar CNPJ');
      }
    } catch (e: any) {
      alert(`Erro na consulta de CNPJ: ${e.message}`);
    } finally {
      setIsRefreshingCnpj(false);
    }
  };

  // On-demand Copywriting Generation Action
  const handleGenerateCopies = async () => {
    setIsGeneratingCopies(true);
    setCopiesGenMsg('Invocando LLaMA3 para gerar roteiros personalizados...');
    try {
      const res = await fetch(`/api/leads/${lead.id}/generate-copies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pitch,
          aiConfig: {
            ...aiConfig,
            groqApiKey: aiConfig?.groqApiKey || integrationsConfig?.groqApiKey,
          },
          tone: enrichTone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.copies) {
        setCopies(data.copies);
        setCopiesGenMsg('Roteiros comerciais gerados com sucesso!');
        confetti({
          particleCount: 45,
          spread: 65,
          origin: { y: 0.7 },
          colors: resolveBrandConfettiColors(),
        });
        setTimeout(() => setCopiesGenMsg(null), 3500);
      } else {
        alert(data.error || 'Erro ao gerar copys');
      }
    } catch (e: any) {
      alert(`Falha na geração de copys: ${e.message}`);
    } finally {
      setIsGeneratingCopies(false);
    }
  };

  // 1. Action: "Salvar" Button (Persists everything directly to SQLite)
  const handleSaveLead = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updatedLead: Lead = {
        ...lead,
        name: leadName,
        cnpj: leadCnpj,
        phone: leadPhone,
        corporate_email: leadCorporateEmail,
        website: leadWebsite,
        address: leadAddress,
        decision_maker_name: dmName,
        decision_maker_title: dmTitle,
        decision_maker_email: dmEmail,
        decision_maker_phone: dmPhone,
        decision_maker_linkedin: dmLinkedin,
        activity_notes: activityNotes,
        activity_context: activityContext,
        assigned_to: assignedTo,
        copies,
        news_dossier: newsDossier,
        userId: user?.id,
      };

      const res = await fetch(`/api/leads/${lead.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLead),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setIsEditing(false);
        if (onLeadSaved) onLeadSaved(updatedLead);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const err = await res.json();
        alert(`Erro ao salvar: ${err.error || 'Falha no servidor'}`);
      }
    } catch (err: any) {
      alert(`Falha na conexão: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Tarefas do lead: busca só quando o card está expandido (informação completa
  // não deve custar uma chamada de rede enquanto o card está só recolhido na lista).
  useEffect(() => {
    if (!isUserView || !isExpanded) return;
    let cancelled = false;
    setIsLoadingTasks(true);
    fetch(`/api/leads/${lead.id}/tasks`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setTasks(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoadingTasks(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isUserView, isExpanded, lead.id]);

  const handleAddTask = async () => {
    if (!newTaskDescription.trim() || isSavingTask) return;
    setIsSavingTask(true);
    setTaskError(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newTaskDescription.trim(),
          dueDate: newTaskDueDate || null,
          userId: user?.id,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Falha ao criar tarefa.');
      }
      const created: LeadTask = await res.json();
      setTasks((prev) => [created, ...prev]);
      setNewTaskDescription('');
      setNewTaskDueDate('');
    } catch (err: any) {
      setTaskError(err.message || 'Falha ao criar tarefa.');
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleToggleTaskStatus = async (task: LeadTask) => {
    const nextStatus: LeadTask['status'] = task.status === 'done' ? 'pending' : 'done';
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, userId: user?.id }),
      });
      if (!res.ok) throw new Error();
      const updated: LeadTask = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch {
      // Falha ao persistir: desfaz a atualização otimista para não mostrar um estado que não foi salvo.
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    }
  };

  // 2. Action: "Enriquecer +" Button (Second Stage News & Public Sources Dossier + New Scripts)
  const handleEnrichNews = async () => {
    if (isEnrichingNews) return;
    setIsEnrichingNews(true);
    setEnrichStatusMsg('Buscando notícias públicas e fatos relevantes...');

    const controller = new AbortController();
    setEnrichAbortCtrl(controller);

    try {
      const res = await fetch(`/api/leads/${lead.id}/enrich-news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          pitch:
            pitch ||
            'A Atlas conecta pessoas e tecnologia gerando valores com segurança e inteligência logística.',
          aiConfig,
          tone: enrichTone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.news_dossier) {
          setNewsDossier(data.news_dossier);
          setIsDossierOpen(true);
        }
        if (data.copies) {
          setCopies(data.copies);
        }

        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: [...resolveBrandConfettiColors().slice(0, 1), '#00D084', '#0070F3'],
        });
      } else {
        const err = await res.json();
        alert(`Falha no enriquecimento: ${err.error || 'Erro desconhecido'}`);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Erro no enriquecimento:', err);
      }
    } finally {
      setIsEnrichingNews(false);
      setEnrichStatusMsg('');
      setEnrichAbortCtrl(null);
    }
  };

  // 3. Action: "Parar" Button (Aborts news enrichment)
  const handleStopEnrich = () => {
    if (enrichAbortCtrl) {
      enrichAbortCtrl.abort();
      setIsEnrichingNews(false);
      setEnrichStatusMsg('');
    }
  };

  // Integration Action: Send Lead to Bitrix24
  const handleExportToBitrix = async () => {
    setIsExportingBitrix(true);
    try {
      const webhookUrl = resolveBitrixWebhook(user, integrationsConfig);

      const res = await fetch('/api/integrations/bitrix24/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: {
            ...lead,
            name: leadName,
            cnpj: leadCnpj,
            phone: leadPhone,
            corporate_email: leadCorporateEmail,
            decision_maker_name: dmName,
            decision_maker_title: dmTitle,
            decision_maker_email: dmEmail,
            decision_maker_phone: dmPhone,
            decision_maker_linkedin: dmLinkedin,
            copies,
          },
          webhookUrl,
          title: `[Atlas Outbound] ${leadName} - ${dmTitle}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBitrixResult({
          success: true,
          leadId: data.leadId,
          message: 'Enviado com sucesso para o Bitrix24!',
        });
      } else {
        // Wave 12 (CPI) - CRM/Operação: elegibilidade (409, `blocked: true`) é um
        // resultado distinto de uma falha de rede/API - nunca reportado com a
        // mesma mensagem genérica de erro.
        setBitrixResult({
          success: false,
          blocked: Boolean(data.blocked),
          message:
            data.blocked && Array.isArray(data.reasons)
              ? data.reasons.join(' | ')
              : data.error || 'Falha ao sincronizar com Bitrix24',
        });
      }
    } catch (err: any) {
      setBitrixResult({
        success: false,
        message: err.message,
      });
    } finally {
      setIsExportingBitrix(false);
    }
  };

  // Integration Action: Verify Decisor Email via Hunter.io
  const handleVerifyEmail = async () => {
    const targetEmail = dmEmail || mainDm.email;
    if (!targetEmail || targetEmail === 'Não revelado') return;
    setIsVerifyingEmail(true);
    try {
      const res = await fetch('/api/integrations/hunter/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          apiKey: integrationsConfig?.hunterApiKey,
        }),
      });
      const data = await res.json();
      // A verificação só é considerada válida quando o Hunter.io realmente respondeu
      // (success === true). Uma falha de rede ou serviço indisponível nunca deve
      // ser exibida como "e-mail válido" - isso seria inventar um resultado.
      if (res.ok && data.success) {
        setHunterResult({
          status: data.status,
          score: data.score ?? 0,
          result: data.result || 'unknown',
        });
      } else {
        setHunterResult({
          status: 'unknown',
          score: 0,
          result: 'unknown',
        });
      }
    } catch (_err: any) {
      setHunterResult({
        status: 'unknown',
        score: 0,
        result: 'unknown',
      });
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // Integration Action: Call Lead via Bland AI
  const handleCallViaBland = async () => {
    const phoneNumber = dmPhone || leadPhone;
    if (!phoneNumber) {
      // Nunca discamos um número inventado: sem telefone real conhecido, a chamada
      // simplesmente não é disparada.
      setBlandResult({
        success: false,
        message: 'Nenhum telefone conhecido para este lead/decisor.',
      });
      return;
    }
    setIsCallingBland(true);
    try {
      const res = await fetch('/api/integrations/bland/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          prompt:
            copies.cold_call ||
            `Você é o assistente de prospecção da Atlas Segurança e Inteligência Logística. Converse com ${dmName} (${dmTitle}) da empresa ${leadName}.`,
          leadName: dmName,
          companyName: leadName,
          apiKey: integrationsConfig?.blandAiApiKey,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBlandResult({
          success: true,
          callId: data.callId,
          message: 'Chamada iniciada com sucesso via Bland AI!',
        });
      } else {
        setBlandResult({
          success: false,
          message: data.error || 'Erro ao disparar chamada Bland AI',
        });
      }
    } catch (err: any) {
      setBlandResult({
        success: false,
        message: err.message,
      });
    } finally {
      setIsCallingBland(false);
    }
  };

  // Botão "Concluir tarefa": executa a ação concreta por trás da recomendação
  // determinística (computeNextAction), em vez de só exibir o texto. Nunca pula
  // direto para Ganho/Perdido — essa transição sempre exige o motivo estruturado
  // escolhido em LeadStageAndTags, então aqui só abrimos o card para isso.
  const handleCompleteNextAction = () => {
    switch (nextAction.action) {
      case 'Gerar roteiros de abordagem':
        handleGenerateCopies();
        break;
      case 'Fazer o primeiro contato':
      case 'Avançar para o primeiro contato':
        onUpdateStage?.(lead.id, 'contatado');
        break;
      case 'Enriquecer com dossiê de notícias':
        handleEnrichNews();
        break;
      default:
        setIsExpanded(true);
    }
  };

  // Botão "Agendar Reunião": move para o estágio de Negociação, que já é o que
  // representa reunião/proposta em andamento (ver STAGE_CONFIG em LeadStageAndTags).
  const handleScheduleMeeting = () => {
    onUpdateStage?.(lead.id, 'negociacao');
  };

  return (
    <div
      className={`border rounded-2xl p-5 md:p-6 shadow-xl transition space-y-5 ${
        isDark
          ? 'bg-slate-900 border-slate-800 hover:border-slate-700/80 text-slate-200'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-slate-100 text-slate-800'
      }`}
    >
      {/* 1. Header: Company Info with CNPJ, Phone, Email, Website, Address */}
      {/* Empilhado sempre (não só flex-col-por-viewport): este card também vive numa coluna
          de Kanban fixa e estreita, onde sm:flex-row quebrava o layout (a coluna de
          nome/endereço era espremida a 0px de largura, já que o breakpoint reage à largura
          da janela, não à da coluna). */}
      <div
        className={`flex flex-col justify-between items-start gap-4 border-b pb-4 ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[var(--brand-primary)]/15 border border-[var(--brand-primary)]/30 text-[var(--brand-primary)] font-mono text-xs flex items-center justify-center font-bold">
              {index + 1}
            </span>

            {isEditing ? (
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className={`text-base font-bold rounded px-2 py-0.5 border outline-none ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className={`text-lg font-bold tracking-tight text-left hover:underline decoration-2 underline-offset-2 ${isDark ? 'text-white decoration-[var(--brand-primary)]' : 'text-slate-900 decoration-[var(--brand-primary)]'}`}
                title={
                  isExpanded
                    ? 'Clique para recolher os detalhes'
                    : 'Clique para ver todos os detalhes deste lead'
                }
              >
                {leadName}
              </button>
            )}

            {/* CNPJ Badge */}
            <span className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 text-xs px-2.5 py-0.5 rounded-md font-mono font-semibold flex items-center gap-1">
              <Hash className="w-3 h-3 text-[var(--brand-primary)]" />
              <span>CNPJ: {leadCnpj || '61.123.456/0001-89'}</span>
            </span>

            {/* Quality Score Indicator Badge (completude de dado) */}
            <LeadQualityBadge lead={lead} theme={theme} />

            {/* Wave 8 (CPI) - Scoring: Fit / Intent / Data Quality / Final -
                só renderiza quando `lead.scores` existe (resposta de /prospect;
                leads recarregados depois não têm o campo, pois não é persistido). */}
            <LeadScoresBadge lead={lead} theme={theme} />

            {/* Wave 2 (CPI) - Requirement Engine: quais critérios da busca este
                lead confirma / não confirma / tem status desconhecido. */}
            <RequirementEvaluationsBadge lead={lead} theme={theme} />

            {/* News Enriched Badge */}
            {newsDossier && (
              <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Notícias Enriquecidas</span>
              </span>
            )}

            {/* Bitrix24 Duplicate-Check Badge */}
            {bitrixCheckStatus === 'existing_client' && (
              <span
                className="bg-red-500/15 text-red-500 border border-red-500/30 text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1"
                title={lead.bitrix_check_detail}
              >
                <ShieldAlert className="w-3 h-3" />
                <span>Já é cliente (Bitrix24)</span>
              </span>
            )}
            {bitrixCheckStatus === 'existing_lead' && (
              <span
                className="bg-amber-500/15 text-amber-500 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1"
                title={lead.bitrix_check_detail}
              >
                <ShieldAlert className="w-3 h-3" />
                <span>Já está na base (Bitrix24)</span>
              </span>
            )}
            {bitrixCheckStatus === 'new' && (
              <span
                className="bg-sky-500/15 text-sky-500 border border-sky-500/30 text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1"
                title={lead.bitrix_check_detail}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Novo no Bitrix24</span>
              </span>
            )}

            {/* Badge de dado não confirmado: a consulta oficial de CNPJ não trouxe
                situação cadastral, CNAE e/ou capital social. Desde a Wave 0
                (anti-fabricação) esses campos ficam vazios, nunca preenchidos com
                um valor de preenchimento — o badge só sinaliza a ausência. */}
            {lead.is_estimated && (
              <span
                className="bg-amber-500/15 text-amber-600 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1"
                title="Situação cadastral, CNAE e/ou capital social não foram confirmados pela Receita Federal — os campos ficam em branco, não preenchidos com um valor estimado."
              >
                <ShieldAlert className="w-3 h-3" />
                <span>Dados fiscais não confirmados</span>
              </span>
            )}
          </div>

          {/* Próxima Ação / Tarefa Recomendada */}
          {lead.stage !== 'ganho' && lead.stage !== 'perdido' && (
            <div
              className={`w-full rounded-lg border px-3 py-2 space-y-2 ${
                nextAction.urgency === 'alta'
                  ? 'border-red-500/30 bg-red-500/10'
                  : nextAction.urgency === 'media'
                    ? 'border-amber-500/30 bg-amber-500/10'
                    : (isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50')
              }`}
            >
              <div className="flex items-start gap-2">
                <Flame
                  className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                    nextAction.urgency === 'alta'
                      ? 'text-red-500'
                      : nextAction.urgency === 'media'
                        ? 'text-amber-500'
                        : (isDark ? 'text-slate-500' : 'text-slate-400')
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
                  >
                    Próxima ação: {nextAction.action}
                  </p>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {nextAction.reason}
                  </p>
                </div>
              </div>
              {/* Ações de tarefa ficam escondidas até o card ser expandido (clique no nome
                  ou em "Detalhes") — o card recolhido mostra só a informação básica. */}
              {isExpanded && (
                <div className="flex flex-wrap items-center gap-1.5 pl-5">
                  <button
                    type="button"
                    onClick={handleCompleteNextAction}
                    disabled={isGeneratingCopies}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border flex items-center gap-1 transition disabled:opacity-50 ${
                      isDark
                        ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/30'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'
                    }`}
                    title="Executa a próxima ação recomendada (ou abre os detalhes quando precisar de uma decisão sua, como Ganho/Perdido)"
                  >
                    {isGeneratingCopies ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    <span>Concluir tarefa</span>
                  </button>
                  {(lead.stage === 'prospecto' ||
                    lead.stage === 'qualificado' ||
                    lead.stage === 'contatado') && (
                    <button
                      type="button"
                      onClick={handleScheduleMeeting}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border flex items-center gap-1 transition ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                      title="Marca este lead como em Negociação (reunião/proposta agendada)"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Agendar reunião</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {lead.stage === 'perdido' && lead.loss_reason && (
            <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Motivo da perda: <span className="font-semibold">{lead.loss_reason}</span>
            </p>
          )}

          {/* Wave 13 (CPI) - Feedback Loop: contraparte simétrica do motivo de perda. */}
          {lead.stage === 'ganho' && lead.win_reason && (
            <p className={`text-[11px] ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
              Motivo do ganho: <span className="font-semibold">{lead.win_reason}</span>
            </p>
          )}

          {/* Transparência: qual motor de IA gerou os roteiros deste lead */}
          {lead.engine_used && (
            <p className={`text-[10px] font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              Roteiros gerados por: {lead.engine_used}
            </p>
          )}

          {/* Address & Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs">
            <p
              className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
            >
              <MapPin className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0" />
              <span>{leadAddress}</span>
            </p>

            {lead.segment && (
              <span
                className={`px-2 py-0.5 rounded border text-[11px] ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {lead.segment}
              </span>
            )}

            {lead.employee_count && (
              <span
                className={`px-2 py-0.5 rounded border text-[11px] ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {lead.employee_count}
              </span>
            )}

            {lead.annual_revenue && (
              <span
                className={`px-2 py-0.5 rounded border text-[11px] ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {lead.annual_revenue}
              </span>
            )}
          </div>
        </div>

        {/* Só o botão que abre o card fica sempre visível — os contatos rápidos da
            empresa (site, LinkedIn, telefone, WhatsApp, e-mail) são "informação
            completa" e só aparecem expandido, junto com o resto (ver abaixo). */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition flex items-center gap-1 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title={
              isExpanded ? 'Recolher card' : 'Expandir card (CNPJ, decisor, contatos, roteiros)'
            }
          >
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            <span>{isExpanded ? 'Recolher' : 'Detalhes'}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Contatos Rápidos da Empresa (site, LinkedIn, telefone, WhatsApp, e-mail) */}
          <div className="flex flex-wrap items-center gap-2">
            {leadWebsite && (
              <a
                href={leadWebsite.startsWith('http') ? leadWebsite : `https://${leadWebsite}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition flex items-center gap-1.5 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>Website</span>
              </a>
            )}

            {lead.company_linkedin && (
              <a
                href={
                  lead.company_linkedin.startsWith('http')
                    ? lead.company_linkedin
                    : `https://${lead.company_linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition flex items-center gap-1.5 ${
                  isDark
                    ? 'bg-[#0077b5]/15 hover:bg-[#0077b5]/25 text-[#0077b5] border-[#0077b5]/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#0077b5] border-slate-300'
                }`}
                title="Página da Empresa no LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
                <span>LinkedIn Empresa</span>
              </a>
            )}

            {leadPhone && leadPhone !== 'N/A' && (
              <a
                href={`tel:${leadPhone}`}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border flex items-center gap-1.5 transition ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-emerald-600 border-slate-200'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{leadPhone}</span>
              </a>
            )}

            {leadPhone && leadPhone !== 'N/A' && (
              <a
                href={toWhatsAppLink(leadPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition ${
                  isDark
                    ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/30'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'
                }`}
                title="Abrir conversa no WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}

            {leadCorporateEmail && (
              <a
                href={`mailto:${leadCorporateEmail}`}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border flex items-center gap-1.5 transition ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{leadCorporateEmail}</span>
              </a>
            )}
          </div>

          {/* 1.1 Dados Oficiais do CNPJ (API Pública / Receita Federal / Minha Receita) */}
          <LeadCnpjDataSection
            isDark={isDark}
            situacaoCadastral={situacaoCadastral}
            cnpjSuccessMsg={cnpjSuccessMsg}
            handleRefreshCnpj={handleRefreshCnpj}
            isRefreshingCnpj={isRefreshingCnpj}
            razaoSocial={razaoSocial}
            leadCnpj={leadCnpj}
            cnaeFiscal={cnaeFiscal}
            cnaeDescricao={cnaeDescricao}
            capitalSocial={capitalSocial}
            qsaList={qsaList}
          />

          {/* 2. Funnel Stage Selector, Assigned User & Tags Bar */}
          <div
            className={`p-3 rounded-xl border flex flex-col gap-3 ${
              isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50/80 border-slate-200'
            }`}
          >
            <div className="flex flex-col items-start justify-between gap-3">
              <div className="flex-1 w-full">
                <LeadStageAndTags
                  lead={lead}
                  theme={theme}
                  onUpdateStage={onUpdateStage}
                  onUpdateTags={onUpdateTags}
                  userId={user?.id}
                />
              </div>

              {/* Admin Assigner */}
              {!isUserView && usersList.filter((u) => u.role === 'user').length > 0 && (
                <div className="flex items-center gap-2 shrink-0 md:border-l md:pl-3 border-slate-200 dark:border-slate-800 overflow-x-auto">
                  {usersList
                    .filter((u) => u.role === 'user')
                    .map((u) => {
                      const isAssigned = assignedTo === u.id;
                      return (
                        <button
                          type="button"
                          key={u.id}
                          onClick={() => {
                            const newVal = isAssigned ? '' : u.id;
                            setAssignedTo(newVal);
                            fetch(`/api/leads/${lead.id}/save`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                ...lead,
                                assigned_to: newVal,
                                userId: user?.id,
                              }),
                            });
                          }}
                          className={`text-[11px] font-bold rounded-lg px-3 py-2 transition flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
                            isAssigned
                              ? 'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] border border-[var(--brand-primary)]'
                              : isDark
                                ? 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {isAssigned ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Atribuído a {u.name.split(' ')[0]}
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              Enviar p/ {u.name.split(' ')[0]}
                            </>
                          )}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* 3. Decision Maker Profile (Nomes, Emails, Telefones, LinkedIn) */}
          <LeadDecisionMakerSection
            isDark={isDark}
            isEditing={isEditing}
            hunterResult={hunterResult}
            dmName={dmName}
            setDmName={setDmName}
            dmTitle={dmTitle}
            setDmTitle={setDmTitle}
            dmEmail={dmEmail}
            setDmEmail={setDmEmail}
            dmPhone={dmPhone}
            setDmPhone={setDmPhone}
            dmLinkedin={dmLinkedin}
            setDmLinkedin={setDmLinkedin}
            handleVerifyEmail={handleVerifyEmail}
            isVerifyingEmail={isVerifyingEmail}
            toWhatsAppLink={toWhatsAppLink}
          />

          {/* 4. Action Control Bar: "Salvar", "Parar", "Enriquecer +" & Integrations */}
          <LeadActionsBar
            isDark={isDark}
            theme={theme}
            handleSaveLead={handleSaveLead}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
            enrichTone={enrichTone}
            setEnrichTone={setEnrichTone}
            handleEnrichNews={handleEnrichNews}
            isEnrichingNews={isEnrichingNews}
            handleStopEnrich={handleStopEnrich}
            newsDossier={newsDossier}
            isDossierOpen={isDossierOpen}
            setIsDossierOpen={setIsDossierOpen}
            handleFastScript={handleFastScript}
            isFastGenerating={isFastGenerating}
            handleExportToBitrix={handleExportToBitrix}
            isExportingBitrix={isExportingBitrix}
            bitrixResult={bitrixResult}
            effectiveBitrixStatus={effectiveBitrixStatus}
            effectiveBitrixError={effectiveBitrixError}
            effectiveBitrixExportedAt={effectiveBitrixExportedAt}
            setIsEvidenceOpen={setIsEvidenceOpen}
            handleCallViaBland={handleCallViaBland}
            isCallingBland={isCallingBland}
            blandResult={blandResult}
          />

          {/* 5. Second Stage: News & Public Intelligence Dossier (If Available / Expanded) */}
          <LeadNewsDossierSection
            isDark={isDark}
            newsDossier={newsDossier}
            isDossierOpen={isDossierOpen}
          />

          {/* 6. Outreach Copy & Scripts (On-Demand Generation OR Full Channel Viewer) */}
          <LeadOutreachSection
            isDark={isDark}
            hasCopies={hasCopies}
            dmName={dmName}
            dmTitle={dmTitle}
            dmEmail={dmEmail}
            dmPhone={dmPhone}
            leadName={leadName}
            leadCnpj={leadCnpj}
            razaoSocial={razaoSocial}
            cnaeFiscal={cnaeFiscal}
            cnaeDescricao={cnaeDescricao}
            leadSegment={lead.segment}
            leadAddress={leadAddress}
            pitch={pitch}
            enrichTone={enrichTone}
            setEnrichTone={setEnrichTone}
            isGeneratingCopies={isGeneratingCopies}
            isEnrichingNews={isEnrichingNews}
            handleGenerateCopies={handleGenerateCopies}
            handleEnrichNews={handleEnrichNews}
            copiesGenMsg={copiesGenMsg}
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
            msgStatus={msgStatus}
            setMsgStatus={setMsgStatus}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            copies={copies}
            setCopies={setCopies}
            copiedChannel={copiedChannel}
            handleCopy={handleCopy}
          />

          {/* Tarefas e Atividades do Lead */}
          <LeadTasksAndActivitySection
            isDark={isDark}
            isUserView={isUserView}
            tasks={tasks}
            isLoadingTasks={isLoadingTasks}
            taskError={taskError}
            newTaskDescription={newTaskDescription}
            setNewTaskDescription={setNewTaskDescription}
            newTaskDueDate={newTaskDueDate}
            setNewTaskDueDate={setNewTaskDueDate}
            handleAddTask={handleAddTask}
            isSavingTask={isSavingTask}
            handleToggleTaskStatus={handleToggleTaskStatus}
            activityContext={activityContext}
            setActivityContext={setActivityContext}
            activityNotes={activityNotes}
            setActivityNotes={setActivityNotes}
            toggleRecording={toggleRecording}
            isRecording={isRecording}
            handleSaveLead={handleSaveLead}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
          />
        </>
      )}

      {/* Wave 6 (CPI) - Evidence & Provenance: modal sob demanda, busca só ao abrir. */}
      <LeadEvidenceModal
        leadId={lead.id}
        leadName={leadName}
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        theme={theme}
      />
    </div>
  );
};
