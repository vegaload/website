import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The landing page lives in public/index.html, so Astro does not know about it.
// customPages adds it to the sitemap.
export default defineConfig({
  site: 'https://vegaload.ai',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      customPages: ['https://vegaload.ai/'],
      filter: (page) => !page.includes('/404'),
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
