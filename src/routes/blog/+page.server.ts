import { listPosts, listTags } from '#lib/server/blog';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const posts = listPosts();
	return { posts, tags: listTags(posts) };
};
