-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "KnowledgeChunk" DROP CONSTRAINT "KnowledgeChunk_organizationId_fkey";

-- DropIndex
DROP INDEX "Company_tradeName_trgm_idx";

-- DropIndex
DROP INDEX "Contact_name_trgm_idx";

-- DropIndex
DROP INDEX "Contact_role_trgm_idx";

-- DropIndex
DROP INDEX "MarketIntelligenceCompany_cnaesSecundarios_gin_idx";

-- DropIndex
DROP INDEX "MarketIntelligenceCompany_nomeFantasiaSearch_trgm_idx";

-- DropIndex
DROP INDEX "MarketIntelligenceCompany_razaoSocialSearch_trgm_idx";

-- DropTable
DROP TABLE "KnowledgeChunk";

-- CreateIndex
CREATE INDEX "AccountRecommendation_organizationId_companyId_idempotencyKey_u" ON "AccountRecommendation"("organizationId", "companyId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "AgentVersion_one_active_per_agent" ON "AgentVersion"("agentDefinitionId");

-- CreateIndex
CREATE INDEX "Note_leadId_idx" ON "Note"("leadId");

-- RenameForeignKey
ALTER TABLE "AccountRecommendation" RENAME CONSTRAINT "AccountRecommendation_accountScoreId_organizationId_companyId_f" TO "AccountRecommendation_accountScoreId_organizationId_compan_fkey";

-- RenameForeignKey
ALTER TABLE "EconomicRelationship" RENAME CONSTRAINT "EconomicRelationship_snapshotId_organizationId_sourceCompanyId_" TO "EconomicRelationship_snapshotId_organizationId_sourceCompa_fkey";

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "AccountIntelligenceSnapshot_organizationId_companyId_generatedA" RENAME TO "AccountIntelligenceSnapshot_organizationId_companyId_genera_idx";

-- RenameIndex
ALTER INDEX "AccountIntelligenceSnapshot_organizationId_companyId_version_ke" RENAME TO "AccountIntelligenceSnapshot_organizationId_companyId_versio_key";

-- RenameIndex
ALTER INDEX "AccountRecommendation_organizationId_companyId_actionType_input" RENAME TO "AccountRecommendation_organizationId_companyId_actionType_i_key";

-- RenameIndex
ALTER INDEX "AccountRecommendation_organizationId_companyId_status_generated" RENAME TO "AccountRecommendation_organizationId_companyId_status_gener_idx";

-- RenameIndex
ALTER INDEX "AccountScore_organizationId_companyId_scoreVersion_inputHash_ke" RENAME TO "AccountScore_organizationId_companyId_scoreVersion_inputHas_key";

-- RenameIndex
ALTER INDEX "CadenceRun_leadId_idx" RENAME TO "CadenceRun_leadId_active_unique";

-- RenameIndex
ALTER INDEX "MarketIntelligenceCompany_datasetId_municipioIbge_situacao_idx" RENAME TO "MarketIntelligenceCompany_datasetId_municipioIbge_situacaoC_idx";

-- RenameIndex
ALTER INDEX "TemporaryCapabilityGrant_organizationId_granteeId_capabili_idx" RENAME TO "TemporaryCapabilityGrant_organizationId_granteeId_capabilit_idx";

-- RenameIndex
ALTER INDEX "UserJobRole_userId_idx" RENAME TO "UserJobRole_one_active_primary_per_user";
