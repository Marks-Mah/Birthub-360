import { PlaywrightCrawler } from 'crawlee';

export async function runCrawler(urls: string[]) {
    const data: any[] = [];
    const crawler = new PlaywrightCrawler({
        async requestHandler({ request, page, log }) {
            log.info(`Processing ${request.url}...`);
            const title = await page.title();
            
            const result = {
                url: request.url,
                title,
            };
            
            data.push(result);
        },
    });

    await crawler.run(urls);
    return data;
}
