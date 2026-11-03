import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { alleArtikelen, url } from '~/lib/content';
import { SITE } from '~/data/site';

export async function GET(context: APIContext) {
  const all = (await alleArtikelen()).filter((a) => a.data.type !== 'bestemming').sort((a, b) => +(b.data.updated ?? b.data.published) - +(a.data.updated ?? a.data.published));
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    customData: '<language>nl-nl</language>',
    items: all.map((a) => ({ title: a.data.title, description: a.data.description, link: url(a.id), pubDate: a.data.updated ?? a.data.published, categories: a.data.tags })),
  });
}
