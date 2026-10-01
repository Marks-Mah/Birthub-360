const fs = require('fs');
let content = fs.readFileSync('src/components/layout/tabMeta.ts', 'utf-8');

const imports = `import {
  HubIcon,
  IntelligenceIcon,
  OrchestrationIcon,
  PerformanceIcon,
  AIIcon,
  AutomationIcon,
  EngagementIcon
} from '../brand/PillarIcons.js';\n`;

content = imports + content;

content = content.replace(/crm: \{ label: 'Pipeline CRM', icon: LayoutTemplate/g, "crm: { label: 'Pipeline CRM', icon: HubIcon");
content = content.replace(/prospect: \{ label: 'Prospec.*o', icon: Search/g, "prospect: { label: 'Prospecção', icon: IntelligenceIcon");
content = content.replace(/'daily-plan': \{ label: 'Plano Di.*rio', icon: CalendarCheck/g, "'daily-plan': { label: 'Plano Diário', icon: OrchestrationIcon");
content = content.replace(/dashboard: \{ label: 'Command Center', icon: Home/g, "dashboard: { label: 'Command Center', icon: PerformanceIcon");
content = content.replace(/commercial_intelligence: \{ label: 'Intelig.*ncia de Vendas', icon: LineChart/g, "commercial_intelligence: { label: 'Inteligência de Vendas', icon: AIIcon");
content = content.replace(/automations: \{ label: 'Automa.*es', icon: Cpu/g, "automations: { label: 'Automações', icon: AutomationIcon");

fs.writeFileSync('src/components/layout/tabMeta.ts', content);
