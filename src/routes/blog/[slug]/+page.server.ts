import { listPosts } from '#lib/server/blog';
import { getPost } from '#lib/server/blog';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => {
	return listPosts().map((post) => ({ slug: post.slug }));
};

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
	const post = getPost(params.slug);
	if (!post) error(404, 'Post not found');
	return { post };
};
