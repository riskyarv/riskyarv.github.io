// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cms from './cms/integration.mjs';

export default defineConfig({
  site: 'https://pasquil.nl',
  trailingSlash: 'always',
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    cms(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
