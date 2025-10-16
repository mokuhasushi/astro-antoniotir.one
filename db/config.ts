import { defineDb, defineTable, column } from 'astro:db';

// https://astro.build/db/config
const Comment = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    postSlug: column.text(),
    name: column.text(),
    email: column.text(),
    message: column.text(),
    createdAt: column.date({ default: new Date() }),
  },
});

export default defineDb({
  tables: { Comment },
});