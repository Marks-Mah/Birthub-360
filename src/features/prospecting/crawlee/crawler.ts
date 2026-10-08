import { PlaywrightCrawler } from 'crawlee';

export async function runCrawler(urls: string[]) {
  const data: any[] = [];
  const crawler = new PlaywrightCrawler({
    async requestHandler({ request, page, log }) {
      log.info(`Processing ${request.url}...`);
      const title = await page.title();

      const content = await page.content();

      // Basic email extraction
      const emailMatches =
        content.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/gi) || [];
      const emails = [...new Set(emailMatches)];

      // Basic social media links extraction
      const links = await page.$$eval('a', (anchors) => anchors.map((a) => a.href));
      const socialMedia = [
        ...new Set(
          links.filter(
            (link) =>
              link.includes('linkedin.com') ||
              link.includes('twitter.com') ||
              link.includes('facebook.com') ||
              link.includes('instagram.com'),
          ),
        ),
      ];

      const result = {
        url: request.url,
        title,
        emails,
        socialMedia,
      };

      data.push(result);
    },
  });

  await crawler.run(urls);
  return data;
}
