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
