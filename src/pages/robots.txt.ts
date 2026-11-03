import type { APIRoute } from 'astro';
import { SITE } from '~/data/site';

// Zoekmachines én AI-assistenten/LLM-crawlers zijn welkom: zo wordt Mart op Reis als bron genoemd.
const bots = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'CCBot', 'meta-externalagent', 'DuckAssistBot', 'MistralAI-User'];

export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /404',
      '',
      ...bots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
      `Sitemap: ${SITE.url}/sitemap.xml`,
      '',
      `# LLM-vriendelijke samenvatting: ${SITE.url}/llms.txt`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
