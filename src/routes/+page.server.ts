import { GITHUB_TOKEN } from '$app/env/private';
import { listPosts, type BlogMeta } from '#lib/server/blog';
import { fetchPortfolio, type PortfolioData } from '#lib/server/github';
import type { PageServerLoad } from './$types';

export type PageLoadData = {
	portfolio: PortfolioData | null;
	error: string | null;
	posts: BlogMeta[];
};

export const load: PageServerLoad = async (): Promise<PageLoadData> => {
	const posts = listPosts().slice(0, 3);

	try {
		const portfolio = await fetchPortfolio(undefined, GITHUB_TOKEN || undefined);
		return { portfolio, error: null, posts };
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Failed to load GitHub data';
		return { portfolio: null, error: message, posts };
	}
};
