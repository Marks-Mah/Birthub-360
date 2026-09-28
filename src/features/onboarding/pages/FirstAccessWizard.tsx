import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Building2, ShieldCheck, Zap } from 'lucide-react';
import { api } from '../../../lib/api.js';

export default function FirstAccessWizard() {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [acceptAiTerms, setAcceptAiTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleFinish = async () => {
    if (!companyName.trim()) {
      setError('Nome da empresa  obrigatrio');
      return;
    }
    if (!acceptAiTerms) {
      setError('Voc precisa aceitar os termos de IA para prosseguir');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.post('/onboarding/setup-wizard', {
        companyName,
        userRole,
        acceptAiTerms,
      });
      // Delay to show success state briefly
      setTimeout(() => {
        navigate('/app', { replace: true });
        window.location.reload(); // force reload to clear gates
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Erro ao concluir o setup. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface border border-border/50 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-surface-elevated p-8 border-b border-border/50 text-center">
          <h1 className="text-2xl font-bold text-text-high mb-2">Bem-vindo ao Birth Hub 360</h1>
          <p className="text-text-muted">Vamos configurar seu ambiente de trabalho em poucos passos.</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-surface p-4 flex justify-center border-b border-border/50">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-surface-elevated text-text-muted'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 rounded-full ${
                      step > s ? 'bg-[var(--brand-primary)]' : 'bg-surface-elevated'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[var(--brand-primary)]/10 rounded-lg text-[var(--brand-primary)]">
                  <Building2 size={24} />
                </div>
                <h2 className="text-xl font-semibold text-text-high">Dados da Empresa</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Sua Empresa Ltda"
                  className="w-full bg-surface border border-border/50 rounded-lg px-4 py-2.5 text-text-high focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Seu Cargo (Opcional)
                </label>
                <input
                  type="text"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  placeholder="Diretor de Vendas, CEO..."
                  className="w-full bg-surface border border-border/50 rounded-lg px-4 py-2.5 text-text-high focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[var(--brand-primary)]/10 rounded-lg text-[var(--brand-primary)]">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-xl font-semibold text-text-high">Uso de Inteligncia Artificial</h2>
              </div>
              <div className="bg-surface-elevated border border-border/50 p-6 rounded-xl space-y-4">
                <p className="text-sm text-text-muted">
                  O Birth Hub 360 utiliza Inteligncia Artificial para qualificar leads, analisar
                  sentimentos de ligaes e gerar propostas comerciais inteligentes.
                </p>
                <p className="text-sm text-text-muted">
                  Para utilizar esses recursos, voc precisa consentir com o processamento de
                  dados via modelos de linguagem, incluindo polticas de reteno limitadas
                  ao tempo necessrio para processamento, conforme nossa LGPD.
                </p>
                <label className="flex items-start space-x-3 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptAiTerms}
                    onChange={(e) => setAcceptAiTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-border/50 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                  />
                  <span className="text-sm text-text-high font-medium">
                    Li e concordo com os Termos de Uso de IA e autorizo o processamento seguro de dados.
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[var(--brand-primary)]/10 rounded-lg text-[var(--brand-primary)]">
                  <Zap size={24} />
                </div>
                <h2 className="text-xl font-semibold text-text-high">Tudo Pronto!</h2>
              </div>
              <div className="text-center py-8">
                <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-text-high mb-2">
                  Configuraes registradas
                </h3>
                <p className="text-text-muted max-w-md mx-auto">
                  Sua organizao ser provisionada com os mdulos de CRM Inteligente e IA em
                  instantes. Bem-vindo ao futuro da operao comercial.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-surface p-6 border-t border-border/50 flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-text-muted hover:text-text-high font-medium transition-colors"
            >
              Voltar
            </button>
          ) : (
            <div /> // Spacer
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg bg-[var(--brand-primary)] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading || !acceptAiTerms}
              className="px-8 py-2.5 rounded-lg bg-[var(--brand-primary)] text-white font-medium hover:opacity-90 transition-opacity flex items-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Configurando...
                </>
              ) : (
                'Finalizar e Acessar'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
