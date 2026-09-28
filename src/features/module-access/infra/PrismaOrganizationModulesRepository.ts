import { prisma } from '../../../lib/prisma.js';
import type { ProductModuleKey } from '../../../config/product-modules.js';
import type {
  OrganizationModuleRepository,
  GrantOrganizationModuleInput,
  RevokeOrganizationModuleInput,
} from '../domain/OrganizationModule.js';

export class PrismaOrganizationModulesRepository implements OrganizationModuleRepository {
  async listActiveModules(organizationId: string): Promise<ProductModuleKey[]> {
    const grants = await prisma.organizationModuleGrant.findMany({
      where: { organizationId },
      select: { moduleKey: true },
    });
    return grants.map((g) => g.moduleKey as ProductModuleKey);
  }

  async upsertGrant(input: GrantOrganizationModuleInput): Promise<void> {
    await prisma.organizationModuleGrant.upsert({
      where: {
        organizationId_moduleKey: {
          organizationId: input.organizationId,
          moduleKey: input.moduleKey,
        },
      },
      update: {
        enabledByUserId: input.enabledByUserId,
      },
      create: {
        organizationId: input.organizationId,
        moduleKey: input.moduleKey,
        enabledByUserId: input.enabledByUserId,
      },
    });
  }

  async deleteGrant(input: RevokeOrganizationModuleInput): Promise<void> {
    await prisma.organizationModuleGrant.deleteMany({
      where: {
        organizationId: input.organizationId,
        moduleKey: input.moduleKey,
      },
    });
  }

  async isOnboardingCompleted(organizationId: string): Promise<boolean> {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { onboardingCompletedAt: true },
    });
    return org?.onboardingCompletedAt != null;
  }

  async completeOnboarding(organizationId: string): Promise<void> {
    await prisma.organization.update({
      where: { id: organizationId },
      data: { onboardingCompletedAt: new Date() },
    });
  }
}

export const prismaOrganizationModulesRepository = new PrismaOrganizationModulesRepository();
