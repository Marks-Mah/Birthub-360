-- Migration: 20261012000000_add_missing_rls_and_fk_indexes
-- Description: Habilita RLS para LeadTouchpoint e adiciona índices de cobertura para Foreign Keys e ordenação temporal multi-tenant

-- 1. Habilitar e forçar RLS em LeadTouchpoint
ALTER TABLE "LeadTouchpoint" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeadTouchpoint" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_isolation" ON "LeadTouchpoint";
CREATE POLICY "tenant_isolation" ON "LeadTouchpoint" AS PERMISSIVE FOR ALL TO public
    USING ("organizationId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("organizationId" = current_setting('app.current_tenant_id', true));

-- 2. Índices de cobertura de Foreign Keys
CREATE INDEX IF NOT EXISTS "Lead_pipelineStageId_idx" ON "Lead"("pipelineStageId");
CREATE INDEX IF NOT EXISTS "TimelineEvent_leadId_idx" ON "TimelineEvent"("leadId");
CREATE INDEX IF NOT EXISTS "TimelineEvent_leadId_createdAt_idx" ON "TimelineEvent"("leadId", "createdAt");
CREATE INDEX IF NOT EXISTS "DecisionMaker_contactId_idx" ON "DecisionMaker"("contactId");
CREATE INDEX IF NOT EXISTS "CrmCommercialDocument_companyId_idx" ON "CrmCommercialDocument"("companyId");
CREATE INDEX IF NOT EXISTS "CrmCommercialDocument_contactId_idx" ON "CrmCommercialDocument"("contactId");
CREATE INDEX IF NOT EXISTS "CrmCommercialDocument_stripeConnectionId_idx" ON "CrmCommercialDocument"("stripeConnectionId");
CREATE INDEX IF NOT EXISTS "Notification_automationId_idx" ON "Notification"("automationId");
CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX IF NOT EXISTS "WhatsAppMessage_contactId_idx" ON "WhatsAppMessage"("contactId");
CREATE INDEX IF NOT EXISTS "CadenceRun_sequenceId_idx" ON "CadenceRun"("sequenceId");
CREATE INDEX IF NOT EXISTS "CadenceCalendarEvent_cadenceRunId_idx" ON "CadenceCalendarEvent"("cadenceRunId");
CREATE INDEX IF NOT EXISTS "UserJobRole_jobRoleId_idx" ON "UserJobRole"("jobRoleId");
CREATE INDEX IF NOT EXISTS "AgentExecution_agentVersionId_idx" ON "AgentExecution"("agentVersionId");
CREATE INDEX IF NOT EXISTS "TemporaryCapabilityGrant_capabilityDefinitionId_idx" ON "TemporaryCapabilityGrant"("capabilityDefinitionId");

-- 3. Índices Compostos Temporais Multi-Tenant ([organizationId, createdAt])
CREATE INDEX IF NOT EXISTS "Lead_organizationId_createdAt_idx" ON "Lead"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "DecisionMaker_organizationId_createdAt_idx" ON "DecisionMaker"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "CrmCommercialDocument_organizationId_createdAt_idx" ON "CrmCommercialDocument"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "CadenceRun_organizationId_startedAt_idx" ON "CadenceRun"("organizationId", "startedAt");
CREATE INDEX IF NOT EXISTS "CadenceCalendarEvent_organizationId_createdAt_idx" ON "CadenceCalendarEvent"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "TemporaryCapabilityGrant_organizationId_createdAt_idx" ON "TemporaryCapabilityGrant"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "ExternalCrmConnection_organizationId_createdAt_idx" ON "ExternalCrmConnection"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "ExternalCrmSyncRule_organizationId_createdAt_idx" ON "ExternalCrmSyncRule"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "ExternalCrmSyncLog_organizationId_createdAt_idx" ON "ExternalCrmSyncLog"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "RoleWorkspaceDefinition_organizationId_createdAt_idx" ON "RoleWorkspaceDefinition"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "WorkspaceLayout_organizationId_createdAt_idx" ON "WorkspaceLayout"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "Workflow_organizationId_createdAt_idx" ON "Workflow"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "Agent_organizationId_createdAt_idx" ON "Agent"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "OrganizationAiConsent_organizationId_createdAt_idx" ON "OrganizationAiConsent"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "APIKey_organizationId_createdAt_idx" ON "APIKey"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "OrganizationWebhookEndpoint_organizationId_createdAt_idx" ON "OrganizationWebhookEndpoint"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "Wallet_organizationId_createdAt_idx" ON "Wallet"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "Transaction_organizationId_createdAt_idx" ON "Transaction"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "AgentSession_organizationId_createdAt_idx" ON "AgentSession"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "Campaign_organizationId_createdAt_idx" ON "Campaign"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "DncList_organizationId_createdAt_idx" ON "DncList"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "CustomAiTool_organizationId_createdAt_idx" ON "CustomAiTool"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "LeadTouchpoint_organizationId_createdAt_idx" ON "LeadTouchpoint"("organizationId", "createdAt");
