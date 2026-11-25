import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const siteUrl = process.env.PUBLIC_SITE_URL || 'https://shellcat.example';

export default defineConfig({
  site: siteUrl,
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404'),
    }),
  ],
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
