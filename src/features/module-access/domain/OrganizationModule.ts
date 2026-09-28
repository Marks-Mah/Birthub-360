import type { ProductModuleKey } from '../../../config/product-modules.js';

export interface OrganizationModuleGrantRow {
  moduleKey: string;
}

export interface GrantOrganizationModuleInput {
  organizationId: string;
  moduleKey: ProductModuleKey;
  enabledByUserId: string;
}

export interface RevokeOrganizationModuleInput {
  organizationId: string;
  moduleKey: ProductModuleKey;
}

export interface OrganizationModuleRepository {
  listActiveModules(organizationId: string): Promise<ProductModuleKey[]>;
  upsertGrant(input: GrantOrganizationModuleInput): Promise<void>;
  deleteGrant(input: RevokeOrganizationModuleInput): Promise<void>;
  isOnboardingCompleted(organizationId: string): Promise<boolean>;
  completeOnboarding(organizationId: string): Promise<void>;
}
