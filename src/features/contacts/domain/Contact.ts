import type { ContactStatus } from '@prisma/client';
import type { Repository } from '../../../shared/domain/Repository.js';

export type { Contact } from '../../../shared/types/crm.js';

export interface ContactRepository extends Repository<Contact> {
  findAllWithFilters(
    organizationId: string,
    query?: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Contact[]; meta: unknown }>;
}
