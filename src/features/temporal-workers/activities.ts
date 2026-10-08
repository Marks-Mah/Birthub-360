import { runCrawler } from '../prospecting/crawlee/crawler.js';
import {
  TenantContextMissingError,
  withTenantActivity,
  withTenantContext,
} from './interceptors.js';

export interface ScrapeProspectParams {
  tenantId?: string;
  organizationId?: string;
  url: string;
}

export const scrapeProspect = withTenantActivity(
  async (params: ScrapeProspectParams): Promise<any> => {
    return await runCrawler([params.url]);
  },
);

export { TenantContextMissingError, withTenantActivity, withTenantContext };
