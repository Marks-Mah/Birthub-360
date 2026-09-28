const fs = require('fs');
const path = require('path');

const replacements = [
  { from: 'atlasGRCallResult', to: 'birthhub360CallResult' },
  { from: 'AtlasGRCallResult', to: 'Birthub360CallResult' },
  { from: 'UpsertAtlasGRCallResultInput', to: 'UpsertBirthhub360CallResultInput' },
  { from: 'upsertAtlasGRCallResult', to: 'upsertBirthhub360CallResult' },
  { from: 'findAtlasGRCallResultByCallId', to: 'findBirthhub360CallResultByCallId' },
  { from: 'listAtlasGRCallResultsForTenant', to: 'listBirthhub360CallResultsForTenant' },
  { from: 'AtlasGR/Bland', to: 'Birth Hub 360/Bland' },
  { from: 'atlasgr.routes.ts', to: 'birthhub360.routes.ts' },
  { from: 'atlasGROutboundPayloadSchema', to: 'birthhub360OutboundPayloadSchema' },
  { from: 'AtlasGROutboundPayload', to: 'Birthhub360OutboundPayload' },
  { from: 'AtlasGR CRM', to: 'Birth Hub 360 CRM' },
  { from: 'AtlasGR repository', to: 'Birth Hub 360 repository' },
  { from: 'AtlasGR start sending', to: 'Birth Hub 360 start sending' },
  { from: '/api/webhook/atlasgr/outbound', to: '/api/webhook/birthhub360/outbound' },
  { from: '../validators/atlasgr.schema.js', to: '../validators/birthhub360.schema.js' },
  { from: '../../../repositories/atlasGRCallResultRepository.js', to: '../../../repositories/birthhub360CallResultRepository.js' },
  { from: 'validateAtlasGRSecret', to: 'validateBirthhub360Secret' },
  { from: 'ATLASGR_WEBHOOK_SECRET', to: 'BIRTHHUB360_WEBHOOK_SECRET' },
  { from: 'AtlasGR webhook rejected', to: 'Birth Hub 360 webhook rejected' },
  { from: 'x-atlasgr-webhook-secret', to: 'x-birthhub360-webhook-secret' },
  { from: 'ATLASGR_TENANT_ID', to: 'BIRTHHUB360_TENANT_ID' },
  { from: 'AtlasGR', to: 'Birth Hub 360' },
  { from: 'atlasgr', to: 'birthhub360' },
  { from: 'buildAtlasGROutboundIdempotencyKey', to: 'buildBirthhub360OutboundIdempotencyKey' },
  { from: 'atlasgr-outbound-call', to: 'birthhub360-outbound-call' },
  { from: 'bitrixTotalTracWebhook', to: 'bitrixBirthhub360Webhook' },
  { from: 'activeBitrixTarget: \'auto\' | \'totaltrac\' | \'atlasgr\' | \'custom\'', to: 'activeBitrixTarget: \'auto\' | \'birthhub360\' | \'custom\'' },
  { from: 'BITRIX_TOTALTRAC_WEBHOOK', to: 'BITRIX_BIRTHHUB360_WEBHOOK' },
  { from: 'BITRIX_ATLASGR_WEBHOOK', to: 'BITRIX_BIRTHHUB360_WEBHOOK' },
  { from: 'resolveAtlasUserNameByEmail', to: 'resolveBirthubUserNameByEmail' },
  { from: 'resolveAtlasUserIdByEmail', to: 'resolveBirthubUserIdByEmail' },
  { from: 'solucaoAtlas', to: 'solucaoBirthub360' },
  { from: 'TotalTracLogo', to: 'Birthub360Logo' },
  { from: 'AtlasLogo', to: 'BirthubLogo' },
];

function processFile(filePath, isRename = false) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { from, to } of replacements) {
    // Escape string for regex
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    content = content.replace(new RegExp(escapeRegExp(from), 'g'), to);
  }
  
  if (isRename) {
    let newPath = filePath;
    for (const { from, to } of replacements) {
       newPath = newPath.replace(from, to);
    }
    fs.writeFileSync(newPath, content, 'utf8');
    if (newPath !== filePath) fs.unlinkSync(filePath);
  } else {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  console.log('Processed', filePath);
}

// Fase 2 - Backend Voice Hub
processFile('src/lib/voice-hub/repositories/atlasGRCallResultRepository.ts', true);
processFile('src/lib/voice-hub/repositories/atlasGRCallResultRepository.test.ts', true);
processFile('src/lib/voice-hub/features/prospecting/validators/atlasgr.schema.ts', true);
processFile('src/lib/voice-hub/features/prospecting/routes/atlasgr.routes.ts', true);
processFile('src/lib/voice-hub/features/prospecting/routes/atlasgr.routes.test.ts', true);
processFile('src/lib/voice-hub/features/prospecting/services/voice.service.ts');
processFile('src/lib/voice-hub/features/prospecting/services/voice.service.test.ts');
processFile('src/lib/voice-hub/features/prospecting/lib/webhookIdempotency.ts');
processFile('src/lib/voice-hub/features/prospecting/lib/webhookIdempotency.test.ts');
processFile('src/lib/voice-hub/routes/index.ts');
processFile('src/lib/voice-hub/middlewares/index.ts');
processFile('src/features/integrations/birth-voice/voiceResult.webhook.ts');

// Outbound
processFile('src/features/prospecting/outbound/types.ts');
// Outbound backend
processFile('src/features/prospecting/outbound/server/routes.ts');
processFile('src/features/prospecting/outbound/server/services/bitrix.ts');
processFile('src/features/prospecting/outbound/server/search/providers/bitrix.provider.ts');
processFile('src/features/prospecting/outbound/server/observability.ts');
processFile('src/features/prospecting/outbound/server/scoring.ts');
processFile('src/features/prospecting/outbound/utils/bitrix.ts');

// Outbound frontend
processFile('src/features/prospecting/outbound/App.tsx');
processFile('src/features/prospecting/outbound/components/LeadDistributionTab.tsx');
processFile('src/features/prospecting/outbound/components/MyTasksTab.tsx');
processFile('src/features/prospecting/outbound/components/PerformanceTab.tsx');
processFile('src/features/prospecting/outbound/components/Sidebar.tsx');
processFile('src/features/prospecting/outbound/components/Header.tsx');
processFile('src/features/prospecting/outbound/components/UserKanbanBoard.tsx');
processFile('src/features/prospecting/outbound/components/LoginScreen.tsx');

// Integrações
processFile('src/features/integrations/bitrix/service/userMapping.ts');
processFile('src/features/integrations/bitrix/service/deals.ts');
processFile('src/features/integrations/bitrix/service/leads.ts');
processFile('src/features/integrations/bitrix/service/__tests__/userMapping.test.ts');
processFile('src/features/integrations/bitrix/service/outboundSync.ts');
processFile('src/features/integrations/bitrix/bitrixFieldMap.ts');
processFile('src/features/crm/application/LeadUseCases.ts');
processFile('src/features/mesa-tratamento/mesaTratamento.api.ts');
processFile('src/features/mesa-tratamento/components/CurrentLeadCard.tsx');
processFile('src/types/index.ts');
processFile('src/features/mesa-tratamento/constants/lossReasons.ts');
processFile('src/features/integrations/whatsapp/conversation-intelligence.service.ts');
processFile('src/features/activities/domain/ownerGuard.ts');
processFile('src/features/integrations/google/google.service.ts');
processFile('src/features/copiloto-ia/copilotoIa.api.ts');
processFile('src/features/copiloto-ia/infra/conversationIntelligence.service.ts');

// Testes (only text replacements first, we will fix logic later if needed)
processFile('tests/unit/features/knowledge/knowledge.routes.extractText.fixtures.test.ts');
processFile('tests/unit/features/activities/application/ActivityUseCases.test.ts');
processFile('tests/unit/features/activities/services/activity.service.test.ts');
processFile('tests/integration/rbac-e2e-crm-write-routes.test.ts');
processFile('tests/integration/cadenceRun.worker.test.ts');
processFile('tests/integration/followUp.worker.test.ts');
processFile('tests/integration/whatsapp-optout-gating.test.ts');
processFile('tests/unit/features/integrations/whatsapp/whatsapp.service.test.ts');
processFile('tests/unit/features/integrations/birth-voice/birthVoice.webhook.test.ts');
processFile('tests/integration/knowledge-copilot-citation.test.ts');
processFile('src/features/intelligence/evaluation/golden-dataset.json');
processFile('src/features/intelligence/services/__tests__/CentralAISuiteService.test.ts');
processFile('src/features/knowledge/__tests__/chunking.test.ts');
processFile('src/features/knowledge/services/__tests__/knowledge-copilot.service.test.ts');
processFile('src/features/knowledge/services/__tests__/reranker.service.test.ts');
processFile('tests/e2e/accessibility.spec.ts');
processFile('tests/e2e/contact-company-forms.spec.ts');
processFile('tests/unit/components/ui/Drawer.test.tsx');

// Voice Hub UI (Fase 5)
processFile('src/features/voice-hub/components/design-system/index.tsx');
processFile('src/features/voice-hub/components/index.tsx');
processFile('src/features/voice-hub/components/tokens.test.ts');
processFile('src/features/voice-hub/components/design-system/tokens.test.ts');
processFile('src/features/voice-hub/components/CommandPalette.tsx');
processFile('src/features/voice-hub/components/design-system/CommandPalette.tsx');
processFile('src/features/voice-hub/pages/AgentOS.tsx');
processFile('src/features/voice-hub/pages/Dashboard/AgentOS.tsx');
processFile('src/features/voice-hub/pages/Developers.tsx');
processFile('src/features/voice-hub/pages/Dashboard/Developers.tsx');
processFile('src/features/voice-hub/pages/Landing.tsx');
processFile('src/features/voice-hub/store/useStudioStore.ts');
processFile('src/lib/paletteIntent.ts');
processFile('src/features/intelligence/tools/playbookTool.ts');
processFile('src/features/intelligence/services/guardrails.service.ts');
processFile('src/features/intelligence/components/AutomationGuide.tsx');
processFile('src/features/companies/components/CompanyList.tsx');
processFile('metadata.json');
processFile('sonar-project.properties');
processFile('src/shared/constants/icp-options.ts');

processFile('chrome-extension/src/background.js');
processFile('chrome-extension/src/content.js');
processFile('chrome-extension/src/sidepanel.js');
processFile('chrome-extension/src/sidepanel.css');
processFile('chrome-extension/src/api.js');
processFile('src/features/chatbook/components/chatbook-hub/playbookData.ts');
processFile('src/features/roleplay/components/RoleplayHub.tsx');

console.log('Done script');
