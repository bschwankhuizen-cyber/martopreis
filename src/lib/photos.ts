import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/*.{jpg,jpeg,png,webp,avif,svg}', {
  eager: true,
});

const byName = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) byName.set(path.split('/').pop()!, mod.default);

/** Zoek een foto op bestandsnaam (uit src/assets/photos). Faalt de build als hij niet bestaat. */
export function photo(name: string): ImageMetadata {
  const img = byName.get(name);
  if (!img) throw new Error(`Foto niet gevonden in src/assets/photos: "${name}"`);
  return img;
}

export function hasPhoto(name: string) {
  return byName.has(name);
}

/**
 * Bij object-fit: cover wordt een foto die breder is dan het kader extra ingezoomd.
 * Bereken daarom de benodigde breedte (sizes) en een passende reeks widths.
 */
export function coverImg(img: ImageMetadata, boxRatio: number, slotPx: number, mobileVw = 100) {
  const zoom = Math.max(1, img.width / img.height / boxRatio);
  const desktop = Math.round(slotPx * zoom);
  const mobile = Math.round(mobileVw * zoom);
  const widths = [400, 600, 800, 1100, 1400, 1800, 2200].filter((w) => w <= img.width);
  if (!widths.length) widths.push(img.width);
  return { widths, sizes: `(min-width: 1080px) ${desktop}px, ${mobile}vw` };
}
