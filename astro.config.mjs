// @ts-check
import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://antoniotir.one",
  integrations: [preact(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      }
    },
  },
});