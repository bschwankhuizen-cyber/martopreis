import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { alleArtikelen, url } from '~/lib/content';
import { SITE, REGIONS, TYPE_LABEL } from '~/data/site';

export const GET: APIRoute = async () => {
  const all = await alleArtikelen();
  const reps = await getCollection('fotoreportages');
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.name} (${SITE.url}) is een Nederlandstalige reisblog van ${SITE.author.name}. Reisverslagen zijn gebaseerd op eigen bezoeken met eigen foto's; overzichten van campings en hotels combineren eigen ervaring met gastbeoordelingen en prijzen van aanbieders (affiliate links worden vermeld). Elke pagina is ook als schone Markdown beschikbaar door ".md" achter de URL te zetten. De volledige tekst van alle pagina's staat in ${SITE.url}/llms-full.txt.`,
    '',
  ];
  for (const r of REGIONS) {
    const items = all.filter((a) => a.data.region === r.id);
    if (!items.length) continue;
    lines.push(r.name === r.country ? `## ${r.name}` : `## ${r.name} (${r.country})`, '');
    for (const a of items) lines.push(`- [${a.data.title}](${SITE.url}${url(a.id)}.md): ${TYPE_LABEL[a.data.type]}. ${a.data.description}`);
    lines.push('');
  }
  lines.push('## Fotoreportages', '');
  for (const r of reps) lines.push(`- [${r.data.title}](${SITE.url}/fotoreportages/${r.id}): ${r.data.description}`);
  lines.push('', '## Optional', '', `- [Over Mart](${SITE.url}/over-mart): wie schrijft deze site en hoe er gewerkt wordt`, `- [Disclaimer & affiliate](${SITE.url}/disclaimer)`, `- [Sitemap](${SITE.url}/sitemap.xml)`, `- [RSS](${SITE.url}/rss.xml)`, '');
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
