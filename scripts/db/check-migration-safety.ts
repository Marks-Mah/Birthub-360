/**
 * Non-Destructive Migration Safety Gate — BirthHub 360
 *
 * Scans all migration SQL files in prisma/migrations/ to detect destructive commands:
 * - DROP TABLE
 * - DROP COLUMN
 * - DROP CONSTRAINT
 * - ALTER TABLE ... DROP
 *
 * Enforces strict 'Expand -> Migrate -> Contract' policy.
 * Historical migrations applied prior to Phase 1 governance are whitelisted in FROZEN_HISTORICAL_DROPS.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// 15 historical migrations cataloged in TECH_DEBT_REMEDIATION_PLAN.md and audit
export const FROZEN_HISTORICAL_DROPS = new Set([
  '20260717141021_add_lead_enrichment',
  '20260717183411_sprint3_5_enums_and_cleanup',
  '20260720235926_sync_accumulated_schema_drift',
  '20260721113210_user_passwordhash_optional',
  '20260804203000_bitrix_sync_rule_lead_source',
  '20260805220000_two_funnels_and_bitrix_fields',
  '20260810130000_remove_knowledge_document',
  '20260817134959_onda11_db_cleanup',
  '20260827200000_drop_dead_ai_governance_models',
  '20260828040000_drop_contact_pii_hash_dec01_superseded',
  '20260908020000_multi_cargo_agent_governance_foundation',
  '20260908090000_public_booking_link_create_and_rls',
  '20260909131444_saved_view',
  '20260913000100_notes_cross_entity_and_attachments',
  '20260918151000_remove_legacy_nba_shadow_domain',
]);

const DESTRUCTIVE_PATTERNS = [
  /\bDROP\s+TABLE\s+(?!IF\s+EXISTS\s+"_)/i,
  /\bALTER\s+TABLE\s+.*\bDROP\s+COLUMN\b/i,
  /\bALTER\s+TABLE\s+.*\bDROP\s+(?!CONSTRAINT\s+IF\s+EXISTS)\b/i,
];

export interface SafetyCheckResult {
  migrationName: string;
  isHistorical: boolean;
  destructiveQueries: string[];
  passed: boolean;
}

export function auditMigrations(migrationsDir: string): SafetyCheckResult[] {
  const results: SafetyCheckResult[] = [];
  const entries = readdirSync(migrationsDir);

  for (const entry of entries) {
    const fullPath = join(migrationsDir, entry);
    if (!statSync(fullPath).isDirectory()) continue;

    const sqlPath = join(fullPath, 'migration.sql');
    let sqlContent = '';
    try {
      sqlContent = readFileSync(sqlPath, 'utf-8');
    } catch {
      continue;
    }

    const destructiveQueries: string[] = [];
    const lines = sqlContent.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('--')) continue; // Skip comments
      // Skip policy drops: DROP POLICY IF EXISTS
      if (/\bDROP\s+POLICY\b/i.test(trimmed)) continue;

      for (const pattern of DESTRUCTIVE_PATTERNS) {
        if (pattern.test(trimmed)) {
          destructiveQueries.push(trimmed);
          break;
        }
      }
    }

    const isHistorical = FROZEN_HISTORICAL_DROPS.has(entry);
    const passed = destructiveQueries.length === 0 || isHistorical;

    results.push({
      migrationName: entry,
      isHistorical,
      destructiveQueries,
      passed,
    });
  }

  return results;
}

export function runMigrationSafetyGate(): void {
  const migrationsDir = join(process.cwd(), 'prisma', 'migrations');
  console.log(`[MIGRATION-SAFETY] Auditing migrations in: ${migrationsDir}`);

  const results = auditMigrations(migrationsDir);
  const violations = results.filter((r) => !r.passed);

  console.log(`[MIGRATION-SAFETY] Scanned ${results.length} migrations.`);
  console.log(`[MIGRATION-SAFETY] Frozen historical migrations with accepted DROP: ${FROZEN_HISTORICAL_DROPS.size}`);

  if (violations.length > 0) {
    console.error('\n❌ [MIGRATION-SAFETY] UNAPPROVED DESTRUCTIVE MIGRATIONS DETECTED:');
    for (const v of violations) {
      console.error(`  - ${v.migrationName}:`);
      for (const q of v.destructiveQueries) {
        console.error(`      ${q}`);
      }
    }
    console.error('\nPolicy violation: All database schema modifications must follow the Expand -> Migrate -> Contract pattern.');
    console.error('See docs/architecture/MIGRATION_SAFETY_POLICY.md for details.\n');
    process.exit(1);
  }

  console.log('✅ [MIGRATION-SAFETY] All migrations comply with Non-Destructive Expand/Migrate/Contract policies.');
}

if (process.argv[1]?.endsWith('check-migration-safety.ts') || process.argv[1]?.endsWith('check-migration-safety.js')) {
  runMigrationSafetyGate();
}
