import { PRODUCT_MODULES, type ProductModuleKey } from '../../../config/product-modules.js';
import type { OrganizationModuleRepository } from '../domain/OrganizationModule.js';
import { prismaOrganizationModulesRepository } from '../infra/PrismaOrganizationModulesRepository.js';

export class OrganizationModulesServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
  }
}

export class OrganizationModulesService {
  constructor(
    private readonly repository: OrganizationModuleRepository = prismaOrganizationModulesRepository,
  ) {}

  async listActiveModules(organizationId: string): Promise<ProductModuleKey[]> {
    return this.repository.listActiveModules(organizationId);
  }

  async activateModule(
    organizationId: string,
    moduleKey: ProductModuleKey,
    enabledByUserId: string,
  ): Promise<void> {
    const moduleDef = PRODUCT_MODULES.find((m) => m.key === moduleKey);
    if (!moduleDef) {
      throw new OrganizationModulesServiceError(`Módulo inválido: ${moduleKey}`);
    }
    if (moduleDef.alwaysActive) {
      throw new OrganizationModulesServiceError(`O módulo ${moduleKey} é sempre ativo.`);
    }

    await this.repository.upsertGrant({ organizationId, moduleKey, enabledByUserId });
  }

  async deactivateModule(organizationId: string, moduleKey: ProductModuleKey): Promise<void> {
    const moduleDef = PRODUCT_MODULES.find((m) => m.key === moduleKey);
    if (!moduleDef) {
      throw new OrganizationModulesServiceError(`Módulo inválido: ${moduleKey}`);
    }
    if (moduleDef.alwaysActive) {
      throw new OrganizationModulesServiceError(`O módulo ${moduleKey} não pode ser desativado.`);
    }

    await this.repository.deleteGrant({ organizationId, moduleKey });
  }

  async isOnboardingPending(organizationId: string): Promise<boolean> {
    const completed = await this.repository.isOnboardingCompleted(organizationId);
    return !completed;
  }

  async completeOnboarding(organizationId: string): Promise<void> {
    await this.repository.completeOnboarding(organizationId);
  }
}

export const organizationModulesService = new OrganizationModulesService();
