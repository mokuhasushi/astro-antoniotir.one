// @ts-check
import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  site: "https://antoniotir.one",
  integrations: [preact(), sitemap(), mdx(), db()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      }
    },
  },
});