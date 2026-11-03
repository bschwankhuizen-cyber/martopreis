import { getCollection, type CollectionEntry } from 'astro:content';

export type Artikel = CollectionEntry<'artikelen'>;

export async function alleArtikelen() {
  const all = await getCollection('artikelen', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order || +b.data.published - +a.data.published);
}

export const url = (id: string) => '/' + id.replace(/\/index$/, '');

export function datum(d: Date) {
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Directe kinderen van een hub (id "frankrijk/dordogne" → "frankrijk/dordogne/x") */
export function kinderen(all: Artikel[], id: string) {
  return all.filter((a) => a.id.startsWith(id + '/') && !a.id.slice(id.length + 1).includes('/'));
}

export function nakomelingen(all: Artikel[], id: string) {
  return all.filter((a) => a.id.startsWith(id + '/'));
}

/** Kruimelpad op basis van de URL-hiërarchie */
export function kruimels(all: Artikel[], id: string) {
  const parts = id.split('/');
  const crumbs: { name: string; href: string }[] = [{ name: 'Home', href: '/' }];
  for (let i = 1; i < parts.length; i++) {
    const pid = parts.slice(0, i).join('/');
    const p = all.find((a) => a.id === pid);
    if (p) crumbs.push({ name: p.data.kicker && p.data.type === 'bestemming' ? p.data.title : p.data.title, href: url(pid) });
  }
  return crumbs;
}
