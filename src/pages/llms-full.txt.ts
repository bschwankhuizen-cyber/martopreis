import type { APIRoute } from 'astro';
import { alleArtikelen } from '~/lib/content';
import { artikelAlsMarkdown } from '~/lib/plain';
import { SITE } from '~/data/site';

export const GET: APIRoute = async () => {
  const all = await alleArtikelen();
  const body = [`# ${SITE.name} – volledige inhoud`, '', `> ${SITE.description}`, '', ...all.map((a) => artikelAlsMarkdown(a) + '\n---\n')].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
