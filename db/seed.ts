import { db, Comment } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Comment).values([
		{
		  postSlug: 'post-1',
		  name: 'Jamie',
		  email: 'jamie@turso.tech',
		  message: 'Great post!',
		  createdAt: new Date(),
		},
		{
		  postSlug: 'post-1',
		  name: 'Jamie',
		  email: 'jamie@turso.tech',
		  message: 'Another great post!',
		  createdAt: new Date(),
		},
	]);
}
