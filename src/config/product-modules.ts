import type { TabType } from '../components/layout/tabMeta.js';

export type ProductModuleKey =
  | 'core'
  | 'crm-comercial'
  | 'prospeccao-inteligente'
  | 'copiloto-ia'
  | 'market-intelligence'
  | 'integracoes'
  | 'automacoes'
  | 'social-selling';

export interface ProductModule {
  key: ProductModuleKey;
  label: string;
  description: string;
  tabs: TabType[];
  alwaysActive: boolean;
  iconName: string; // nome do ícone lucide
  colorTheme: string;
}

export const PRODUCT_MODULES: ProductModule[] = [
  {
    key: 'core',
    label: 'Core / Setup',
    description: 'Painel de controle, configurações e gestão de equipe.',
    tabs: ['dashboard', 'workspace', 'daily-plan', 'notifications', 'settings', 'team', 'usage', 'module-access'],
    alwaysActive: true,
    iconName: 'Settings',
    colorTheme: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
  },
  {
    key: 'crm-comercial',
    label: 'CRM Comercial',
    description: 'Pipeline, contas, decisores, propostas e atividades.',
    tabs: ['crm', 'crm360', 'companies', 'contacts', 'activities', 'calendar', 'propostas', 'mesa-tratamento'],
    alwaysActive: false,
    iconName: 'LayoutTemplate',
    colorTheme: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
  },
  {
    key: 'prospeccao-inteligente',
    label: 'Prospecção Inteligente',
    description: 'Busca, outbound, cadências e telefonia.',
    tabs: ['prospect', 'outbound', 'cadence', 'voice-hub', 'dialer'],
    alwaysActive: false,
    iconName: 'Search',
    colorTheme: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200'
  },
  {
    key: 'copiloto-ia',
    label: 'Copiloto Comercial IA',
    description: 'Assistente de Vendas, Chatbook, Editor e treinamento.',
    tabs: ['copiloto_ia', 'intelligence', 'commercial_intelligence', 'roleplay', 'chatbook', 'qualification_matrix', 'objections_matrix', 'topic_training', 'editor', 'knowledge'],
    alwaysActive: false,
    iconName: 'Mic',
    colorTheme: 'bg-iris-100 text-iris-800 dark:bg-iris-900/50 dark:text-iris-200'
  },
  {
    key: 'market-intelligence',
    label: 'Inteligência de Mercado',
    description: 'Pesquisas, Win/Loss e relatórios.',
    tabs: ['market-intelligence', 'analytics', 'winloss', 'reports', 'sdr-diagnostic'],
    alwaysActive: false,
    iconName: 'Radar',
    colorTheme: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200'
  },
  {
    key: 'integracoes',
    label: 'Integrações',
    description: 'Conectores com Bitrix24 e outras ferramentas.',
    tabs: ['integrations', 'bitrix'],
    alwaysActive: false,
    iconName: 'Globe',
    colorTheme: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200'
  },
  {
    key: 'automacoes',
    label: 'Automações',
    description: 'Workflows e gatilhos.',
    tabs: ['automations'],
    alwaysActive: false,
    iconName: 'Cpu',
    colorTheme: 'bg-gold-100 text-gold-800 dark:bg-gold-900/50 dark:text-gold-200'
  }
];

export function isTabInActiveModule(tab: TabType, activeModuleKeys: ProductModuleKey[]): boolean {
  return PRODUCT_MODULES.some(
    (mod) =>
      (mod.alwaysActive || activeModuleKeys.includes(mod.key)) &&
      mod.tabs.includes(tab)
  );
}
