import { runCrawler } from '../prospecting/crawlee/crawler';

export async function scrapeProspect(url: string): Promise<any> {
  return await runCrawler([url]);
}
