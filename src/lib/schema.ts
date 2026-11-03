import { SITE } from '~/data/site';
import type { Artikel } from './content';
import { url } from './content';

const abs = (p: string) => new URL(p, SITE.url).href;

export function breadcrumbLd(items: { name: string; href: string }[], current: string, currentHref: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [...items, { name: current, href: currentHref }].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.href),
    })),
  };
}

export function artikelLd(a: Artikel, imageUrl: string, crumbs: { name: string; href: string }[]) {
  const d = a.data;
  const href = url(a.id);
  const page = abs(href);
  const out: Record<string, unknown>[] = [];
  const isPost = d.type === 'reisverslag' || d.type === 'bezienswaardigheid' || d.type === 'gids';
  out.push({
    '@type': isPost ? 'BlogPosting' : 'Article',
    '@id': `${page}#artikel`,
    headline: d.title,
    description: d.description,
    image: [imageUrl],
    datePublished: d.published.toISOString(),
    dateModified: (d.updated ?? d.published).toISOString(),
    inLanguage: 'nl-NL',
    author: { '@id': `${SITE.url}/#mart` },
    publisher: { '@id': `${SITE.url}/#mart` },
    mainEntityOfPage: page,
    isPartOf: { '@id': `${SITE.url}/#website` },
    keywords: d.tags.join(', ') || undefined,
    ...(d.tldr ? { abstract: d.tldr.join(' ') } : {}),
    ...(d.place
      ? {
          contentLocation: {
            '@type': 'Place',
            name: d.place.name,
            geo: { '@type': 'GeoCoordinates', latitude: d.place.lat, longitude: d.place.lng },
            address: { '@type': 'PostalAddress', addressCountry: d.place.country, addressRegion: d.place.region },
          },
        }
      : {}),
  });
  if (d.place && (d.type === 'bezienswaardigheid' || d.type === 'camping' || d.type === 'reisverslag')) {
    out.push({
      '@type': d.type === 'camping' ? 'Campground' : 'TouristAttraction',
      '@id': `${page}#plaats`,
      name: d.place.name,
      description: d.description,
      image: imageUrl,
      url: page,
      geo: { '@type': 'GeoCoordinates', latitude: d.place.lat, longitude: d.place.lng },
      address: { '@type': 'PostalAddress', addressCountry: d.place.country, addressRegion: d.place.region },
    });
  }
  if (d.faq?.length) {
    out.push({
      '@type': 'FAQPage',
      '@id': `${page}#faq`,
      mainEntity: d.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
  if (d.review) {
    const r = d.review;
    out.push({
      '@type': 'Review',
      '@id': `${page}#review`,
      name: d.title,
      author: { '@id': `${SITE.url}/#mart` },
      datePublished: d.published.toISOString(),
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      ...(r.pros ? { positiveNotes: { '@type': 'ItemList', itemListElement: r.pros.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p })) } } : {}),
      ...(r.cons ? { negativeNotes: { '@type': 'ItemList', itemListElement: r.cons.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p })) } } : {}),
      itemReviewed: {
        '@type': 'Product',
        name: r.product,
        image: imageUrl,
        ...(r.brand ? { brand: { '@type': 'Brand', name: r.brand } } : {}),
        ...(r.gtin ? { gtin13: r.gtin } : {}),
        ...(r.price ? { offers: { '@type': 'Offer', price: r.price, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' } } : {}),
      },
    });
  }
  out.push(breadcrumbLd(crumbs, d.title, href));
  return out;
}
