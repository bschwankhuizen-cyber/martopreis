import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import { alleArtikelen, url } from '~/lib/content';
import { photo } from '~/lib/photos';
import { SITE } from '~/data/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const all = await alleArtikelen();
  const reps = await getCollection('fotoreportages');
  const newest = new Date(Math.max(...all.map((a) => +(a.data.updated ?? a.data.published))));
  type U = { loc: string; lastmod?: Date; images?: { loc: string; title?: string }[] };
  const urls: U[] = [
    { loc: '/', lastmod: newest },
    { loc: '/reisverslagen', lastmod: newest },
    { loc: '/fotoreportages', lastmod: newest },
    { loc: '/bestemmingen', lastmod: newest },
    { loc: '/over-mart' },
    { loc: '/disclaimer' },
    { loc: '/privacy' },
  ];
  for (const a of all) {
    const img = await getImage({ src: photo(a.data.hero), width: 1600, format: 'jpg', quality: 80 });
    urls.push({ loc: url(a.id), lastmod: a.data.updated ?? a.data.published, images: [{ loc: img.src, title: a.data.heroAlt }] });
  }
  for (const r of reps) {
    const images = await Promise.all(
      r.data.photos.map(async (p) => ({ loc: (await getImage({ src: photo(p.src), width: Math.min(1800, photo(p.src).width), format: 'webp', quality: 80 })).src, title: p.caption ?? p.alt })),
    );
    urls.push({ loc: `/fotoreportages/${r.id}`, lastmod: r.data.date, images });
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE.url}${u.loc === '/' ? '' : u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}${(u.images ?? [])
      .map((i) => `\n    <image:image><image:loc>${SITE.url}${i.loc}</image:loc>${i.title ? `<image:title>${esc(i.title)}</image:title>` : ''}</image:image>`)
      .join('')}
  </url>`,
  )
  .join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
