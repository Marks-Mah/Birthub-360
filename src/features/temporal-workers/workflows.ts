import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { scrapeProspect } = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 minutes',
});

export async function prospectWorkflow(url: string): Promise<any> {
  return await scrapeProspect(url);
}
