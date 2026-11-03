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
      filter: (page) => !page.endsWith(`${site.replace(/\/$/, '')}/`) && !page.includes('/404'),
      // Tells crawlers when pages changed (the build date = the deploy date).
      lastmod: new Date(),
      changefreq: 'monthly',
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr', en: 'en' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
