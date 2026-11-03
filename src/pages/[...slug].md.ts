import type { APIRoute, GetStaticPaths } from 'astro';
import { alleArtikelen, type Artikel } from '~/lib/content';
import { artikelAlsMarkdown } from '~/lib/plain';

export const getStaticPaths: GetStaticPaths = async () => (await alleArtikelen()).map((entry) => ({ params: { slug: entry.id }, props: { entry } }));

export const GET: APIRoute = ({ props }) =>
  new Response(artikelAlsMarkdown((props as { entry: Artikel }).entry), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
