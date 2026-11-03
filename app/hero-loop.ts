const BASE = 'https://hwidthwh7olawzlg.public.blob.vercel-storage.com/demos/hero-v3'

/** Approved V3 hero loop. Desktop and mobile are separate files so a phone never fetches the landscape cut. */
export const HERO_LOOP = {
  desktop: {
    poster: `${BASE}/danzus-hero-v3-desktop-poster.webp`,
    posterJpg: `${BASE}/danzus-hero-v3-desktop-poster.jpg`,
    mp4: `${BASE}/danzus-hero-v3-desktop.mp4`,
    webm: `${BASE}/danzus-hero-v3-desktop.webm`,
  },
  mobile: {
    poster: `${BASE}/danzus-hero-v3-mobile-poster.webp`,
    posterJpg: `${BASE}/danzus-hero-v3-mobile-poster.jpg`,
    mp4: `${BASE}/danzus-hero-v3-mobile.mp4`,
    webm: `${BASE}/danzus-hero-v3-mobile.webm`,
  },
}
