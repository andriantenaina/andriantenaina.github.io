import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const site = env.SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith(`${site.replace(/\/$/, '')}/`),
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr', en: 'en' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
