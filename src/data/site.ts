export const SITE = {
  name: 'Mart op Reis',
  shortName: 'Mart op Reis',
  url: 'https://www.martopreis.nl',
  locale: 'nl_NL',
  lang: 'nl',
  tagline: 'Persoonlijke reisverslagen, fotoreportages en eerlijke reistips',
  description:
    'Reisblog van Mart: persoonlijke reisverslagen en fotoreportages uit de Dordogne, de Cevennen, Duitsland en verder – met eerlijke tips over campings, hotels en bezienswaardigheden.',
  author: {
    name: 'Mart',
    url: 'https://www.martopreis.nl/over-mart',
    description:
      'Mart is een Nederlandse reiziger die met het gezin door Europa trekt en alles zelf bezoekt, fotografeert en beschrijft.',
  },
  defaultImage: 'plein-en-kerkje-monpazier-ef.jpg',
  /** Google Analytics 4 – metings-ID (stream martopreis.nl) */
  ga4: 'G-GJWHS2NYPX',
};

export type Region = {
  id: string;
  name: string;
  country: string; // voor groepering
  href: string;
  blurb: string;
  image: string;
};

/** Regio's/bestemmingen. `href` moet bestaan als artikel (type bestemming) */
export const REGIONS: Region[] = [
  {
    id: 'dordogne',
    name: 'Dordogne',
    country: 'Frankrijk',
    href: '/frankrijk/dordogne',
    blurb: 'Middeleeuwse stadjes, kastelen, kanoën op de rivier en de mooiste campings van Zuidwest-Frankrijk.',
    image: 'dordogne-rivier-panorama-ef.jpg',
  },
  {
    id: 'cevennen',
    name: 'Cevennen',
    country: 'Frankrijk',
    href: '/frankrijk/cevennen',
    blurb: 'Ruige kloven, heldere rivieren en kamperen in de betoverende vallei van de Dourbie.',
    image: 'camping-val-de-cantobre-cevennen.jpg',
  },
  {
    id: 'frankrijk',
    name: 'Frankrijk',
    country: 'Frankrijk',
    href: '/frankrijk',
    blurb: 'Al mijn reizen, campings en tips voor vakantie in Frankrijk.',
    image: 'plein-in-sarlat.jpg',
  },
  {
    id: 'duitsland',
    name: 'Duitsland',
    country: 'Duitsland',
    href: '/duitsland',
    blurb: 'Culinair genieten met halfpension aan de Moezel, in het Sauerland, Beieren en meer.',
    image: 'kasteel-moezel-rivier.jpg',
  },
  {
    id: 'thailand',
    name: 'Thailand',
    country: 'Thailand',
    href: '/thailand/familie-groepsreis',
    blurb: 'Cultuur, natuur en strand: met het gezin op familiereis door Thailand.',
    image: 'strand-en-kust-thailand-pb.jpg',
  },
  {
    id: 'wintersport',
    name: 'Wintersport',
    country: 'Europa',
    href: '/wintersport/ski-huren',
    blurb: 'Slim je ski’s huren en besparen op je wintersportvakantie.',
    image: 'skiverhuur-winkel-ai.jpg',
  },
  {
    id: 'reviews',
    name: 'Reviews',
    country: 'Gear',
    href: '/reviews/leawin-t4-elektrische-step',
    blurb: 'Eerlijke, zelf geteste reviews van spullen voor onderweg.',
    image: 'leawin-t4-elektrische-step.jpg',
  },
];

export const NAV = [
  {
    label: 'Bestemmingen',
    href: '/bestemmingen',
    children: [
      { label: 'Dordogne', href: '/frankrijk/dordogne' },
      { label: 'Cevennen', href: '/frankrijk/cevennen' },
      { label: 'Frankrijk', href: '/frankrijk' },
      { label: 'Duitsland', href: '/duitsland' },
      { label: 'Moezel', href: '/duitsland/moezel-halfpension-hotels' },
      { label: 'Thailand', href: '/thailand/familie-groepsreis' },
      { label: 'Wintersport', href: '/wintersport/ski-huren' },
    ],
  },
  { label: 'Reisverslagen', href: '/reisverslagen' },
  { label: 'Fotoreportages', href: '/fotoreportages' },
  { label: 'Campings', href: '/frankrijk/dordogne/campings' },
  { label: 'Over Mart', href: '/over-mart' },
];

export const TYPE_LABEL: Record<string, string> = {
  bestemming: 'Bestemming',
  reisverslag: 'Reisverslag',
  bezienswaardigheid: 'Bezienswaardigheid',
  camping: 'Camping',
  accommodaties: 'Accommodaties',
  gids: 'Reisgids',
  review: 'Review',
  kaart: 'Kaarten',
};
