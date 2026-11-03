import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const TYPES = [
  'bestemming', // hub-pagina voor land/regio
  'reisverslag', // persoonlijk verslag van een bezoek
  'bezienswaardigheid',
  'camping',
  'accommodaties', // overzicht/vergelijking hotels of campings
  'gids', // praktische gids / tips
  'review',
  'kaart',
] as const;

const artikelen = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/artikelen' }),
  schema: z.object({
    title: z.string(), // H1
    seoTitle: z.string().optional(), // <title>, max ~60 tekens
    description: z.string().max(170), // meta description
    kicker: z.string().optional(), // klein label boven de titel
    subtitle: z.string().optional(),
    type: z.enum(TYPES),
    region: z.string(), // id uit src/data/site.ts → regions
    hero: z.string(), // bestandsnaam in src/assets/photos
    heroAlt: z.string(),
    heroCaption: z.string().optional(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    visited: z.string().optional(), // bv. "augustus 2023"
    camera: z.string().optional(),
    place: z
      .object({
        name: z.string(),
        lat: z.number(),
        lng: z.number(),
        country: z.string().default('FR'),
        region: z.string().optional(),
      })
      .optional(),
    tldr: z.array(z.string()).optional(), // "In het kort" – kernfeiten
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    review: z
      .object({
        product: z.string(),
        brand: z.string().optional(),
        rating: z.number().min(0).max(5),
        price: z.number().optional(),
        gtin: z.string().optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
      })
      .optional(),
    affiliate: z.boolean().default(false),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    related: z.array(z.string()).optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const fotoreportages = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/fotoreportages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    region: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    cover: z.string(),
    coverAlt: z.string(),
    intro: z.string(),
    article: z.string().optional(), // id van bijbehorend artikel
    camera: z.string().optional(),
    photos: z.array(
      z.object({ src: z.string(), caption: z.string().optional(), alt: z.string().optional() }),
    ),
  }),
});

export const collections = { artikelen, fotoreportages };
