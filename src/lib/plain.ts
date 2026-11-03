import type { Artikel } from './content';
import { url } from './content';
import { SITE } from '~/data/site';

const strip = (s: string) => s.replace(/<[^>]+>/g, '');

/** Haal een string-attribuut of array-literal uit JSX-props (simpel, voor llms-teksten) */
function attr(src: string, name: string) {
  const m = src.match(new RegExp(`${name}=(?:"([^"]*)"|'([^']*)'|\\{\\s*['"]([^'"]*)['"]\\s*\\})`));
  return m ? (m[1] ?? m[2] ?? m[3]) : undefined;
}

/** Zet MDX-body om naar leesbare Markdown zonder componenten (voor LLM's / .md-versies) */
export function mdxNaarMarkdown(body: string) {
  let s = body;
  // Accommodatie-kaarten → opsomming
  s = s.replace(/<Accommodatie\b([\s\S]*?)(?:\/>|>([\s\S]*?)<\/Accommodatie>)/g, (_, props: string, inner = '') => {
    const naam = attr(props, 'naam') ?? '';
    const score = attr(props, 'score');
    const prijs = attr(props, 'prijs');
    const toel = attr(props, 'prijsToelichting');
    const plaats = attr(props, 'plaats');
    const link = attr(props, 'link');
    const kenm = [...(props.match(/kenmerken=\{\[([\s\S]*?)\]\}/)?.[1] ?? '').matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
    const head = `### ${naam}` + (plaats ? ` (${plaats})` : '');
    const meta = [score && `Beoordeling: ${score}`, prijs && `Prijs vanaf ${prijs}${toel ? ` (${toel})` : ''}`, link && `Boeken: ${link}`].filter(Boolean).join(' · ');
    return `\n${head}\n${meta ? meta + '\n' : ''}${kenm.map((k) => `- ${k}`).join('\n')}\n${strip(inner).trim()}\n`;
  });
  // Galerij/Foto → bijschriften als beeldbeschrijving
  s = s.replace(/<Galerij\b[\s\S]*?\/>/g, (m) => {
    const caps = [...m.matchAll(/caption:\s*['"]([^'"]+)['"]/g)].map((x) => x[1]);
    return caps.length ? `\n[Foto's: ${caps.join(' | ')}]\n` : '';
  });
  s = s.replace(/<Foto\b[\s\S]*?\/>/g, (m) => {
    const c = attr(m, 'caption') ?? attr(m, 'alt');
    return c ? `\n[Foto: ${c}]\n` : '';
  });
  s = s.replace(/<Kaart\b[\s\S]*?\/>/g, (m) => `\n[Kaart: ${attr(m, 'titel') ?? ''}]\n`);
  s = s.replace(/<Kaarten\b[\s\S]*?\/>/g, (m) => [...m.matchAll(/href:\s*['"]([^'"]+)['"],\s*titel:\s*['"]([^'"]+)['"]/g)].map((x) => `- [${x[2]}](${x[1]})`).join('\n'));
  s = s.replace(/<Aanbieders\b[\s\S]*?\/>/g, (m) => [...m.matchAll(/naam:\s*['"]([^'"]+)['"],\s*href:\s*['"]([^'"]+)['"]/g)].map((x) => `- ${x[1]}: ${x[2]}`).join('\n'));
  s = s.replace(/<ProsCons\b[\s\S]*?\/>/g, (m) => {
    const list = (k: string) => [...(m.match(new RegExp(`${k}=\\{\\[([\\s\\S]*?)\\]\\}`))?.[1] ?? '').matchAll(/['"]([^'"]+)['"]/g)].map((x) => `- ${x[1]}`).join('\n');
    return `\n**Pluspunten**\n${list('plus')}\n\n**Minpunten**\n${list('min')}\n`;
  });
  s = s.replace(/<Specs\b[\s\S]*?\/>/g, (m) => [...m.matchAll(/\[\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\]/g)].map((x) => `- ${x[1]}: ${x[2]}`).join('\n'));
  s = s.replace(/<Score\b([^>]*?)(?:\/>|>([\s\S]*?)<\/Score>)/g, (_, p: string, inner = '') => `\n**Eindoordeel: ${p.match(/score=\{([\d.]+)\}/)?.[1] ?? ''}/5** ${strip(inner).trim()}\n`);
  s = s.replace(/<KnopLink\b([^>]*)>([\s\S]*?)<\/KnopLink>/g, (_, p: string, t: string) => `[${strip(t).trim()}](${attr(p, 'href')})`);
  // Overige componenten: tags weg, inhoud houden
  s = s.replace(/<\/?[A-Z][A-Za-z]*\b[^>]*>/g, '');
  s = s.replace(/\]\(\//g, `](${SITE.url}/`);
  return s.replace(/\n{3,}/g, '\n\n').trim();
}

export function artikelAlsMarkdown(a: Artikel) {
  const d = a.data;
  const out = [
    `# ${d.title}`,
    '',
    `> ${d.description}`,
    '',
    `- URL: ${SITE.url}${url(a.id)}`,
    `- Auteur: ${SITE.author.name} (${SITE.name})`,
    `- Type: ${d.type}`,
    d.visited ? `- Bezocht: ${d.visited}` : '',
    d.place ? `- Locatie: ${d.place.name} (${d.place.lat}, ${d.place.lng})` : '',
    `- Laatst bijgewerkt: ${(d.updated ?? d.published).toISOString().slice(0, 10)}`,
    '',
  ].filter((l) => l !== '');
  if (d.tldr) out.push('', '## In het kort', ...d.tldr.map((t) => `- ${strip(t)}`));
  out.push('', mdxNaarMarkdown(a.body ?? ''));
  if (d.faq) out.push('', '## Veelgestelde vragen', ...d.faq.flatMap((f) => [`### ${f.q}`, strip(f.a), '']));
  return out.join('\n').trim() + '\n';
}
