import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    image: z.object({
      url: z.string(),
      alt: z.string().optional()
    }).optional(),
    externalLink: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const experiences = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    logo: z.string().optional(),
    company: z.string().optional(),
    institution: z.string().optional(),
    url: z.string().optional(),
    location: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts, experiences };