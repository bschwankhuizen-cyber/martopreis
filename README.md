# Mart op Reis – martopreis.nl

Persoonlijke reisblog met reisverslagen, fotoreportages en reistips. Statische site gebouwd met [Astro](https://astro.build) + MDX en gehost als **Cloudflare Worker (Static Assets)** onder de worker-naam `martopreis`.

## Lokaal werken

```bash
npm install
npm run dev        # ontwikkelserver op http://localhost:4321
npm run build      # bouwt naar dist/
npm run preview    # draait dist/ lokaal in de Cloudflare-runtime (incl. _redirects/_headers)
npm run deploy     # build + wrangler deploy naar de worker "martopreis"
```

## Deployen via Cloudflare

Koppel de repo in het Cloudflare-dashboard aan de worker **martopreis** (Workers & Pages → martopreis → Settings → Build → Connect repository):

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Productiebranch: `main`

Voeg daarna onder *Settings → Domains & Routes* de domeinen `www.martopreis.nl` (en `martopreis.nl`) toe en zet DNS van WordPress over.

## Content toevoegen

| Wat | Waar |
| --- | --- |
| Artikel (reisverslag, camping, gids, review, bestemming) | `src/content/artikelen/<pad>.mdx` – het bestandspad is de URL |
| Fotoreportage | `src/content/fotoreportages/<slug>.yaml` |
| Foto's | `src/assets/photos/` (worden automatisch geoptimaliseerd naar WebP in meerdere formaten) |
| Menu, regio's | `src/data/site.ts` |
| Redirects | `public/_redirects` |

De frontmatter-velden staan in `src/content.config.ts`. Gebruik `type: reisverslag` + `visited:` voor persoonlijke verslagen; vul `tldr` en `faq` in – die worden getoond én als gestructureerde data (FAQPage) en in `llms.txt` gebruikt.

Componenten die je zonder import in MDX kunt gebruiken: `<Foto>`, `<Galerij>`, `<Tip>`, `<KnopLink>`, `<Accommodatie>`, `<Aanbieders>`, `<ProsCons>`, `<Specs>`, `<Score>`, `<Kaart>`, `<Kaarten>` (zie `src/components/mdx/`).

## SEO, LLM & AI

- Schone URL's zonder trailing slash, canonical, Open Graph/Twitter, `max-image-preview:large`
- JSON-LD: WebSite, Person (auteur), BlogPosting/Article, BreadcrumbList, FAQPage, TouristAttraction/Campground (met geo), Review + Product, ImageGallery
- `sitemap.xml` met afbeeldingen en lastmod, `rss.xml`
- `robots.txt` die zoekmachines én AI-crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …) toelaat
- `llms.txt` (index) en `llms-full.txt` (volledige tekst), plus elke pagina als Markdown via `<url>.md`
- "In het kort"-blok per artikel met kernfeiten (goed citeerbaar voor AI-antwoorden)
- 301-redirects van alle oude WordPress-URL's in `public/_redirects`
