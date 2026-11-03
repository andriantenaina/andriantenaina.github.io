import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
// Same domain as the classic site: this one is served under /3d/ (see shared/scripts/merge-sites.mjs).
const site = env.SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site,
  base: '/3d',
  trailingSlash: 'always',
  // No sitemap here: pages point their canonical URL to the classic version, which owns the sitemap.
  integrations: [react()],
  // three.js is one ~1 MB chunk, loaded after first paint, so the default 500 kB warning is expected.
  vite: { plugins: [tailwindcss()], build: { chunkSizeWarningLimit: 1500 } },
});
