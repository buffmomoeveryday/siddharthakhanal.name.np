import { GITHUB_USERNAME } from '../config';

const API = 'https://api.github.com';
const GRAPHQL = 'https://api.github.com/graphql';
const MEMORY_CACHE_TTL_MS = 5 * 60 * 1000;
const KV_CACHE_TTL_SECONDS = 24 * 60 * 60;

export type GitHubUser = {
	login: string;
	name: string | null;
	avatar_url: string;
	html_url: string;
	bio: string | null;
	company: string | null;
	blog: string;
	location: string | null;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
};

export type GitHubRepo = {
	id: number;
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	fork: boolean;
	archived: boolean;
	topics: string[];
	updated_at: string;
	pushed_at: string;
	homepage: string | null;
};

export type LanguageStat = {
	name: string;
	count: number;
	pct: number;
};

export type GitHubStats = {
	totalStars: number;
	totalForks: number;
	ownedRepos: number;
	forkedRepos: number;
	languages: LanguageStat[];
	yearsActive: number;
};

export type ContributionDay = {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionWeek = {
	days: ContributionDay[];
};

export type ContributionCalendar = {
	total: number;
	weeks: ContributionWeek[];
};

export type PortfolioData = {
	user: GitHubUser;
	repos: GitHubRepo[];
	stats: GitHubStats;
	contributions: ContributionCalendar | null;
};

class GitHubApiError extends Error {
	constructor(
		readonly status: number,
		path: string
	) {
		super(`GitHub API ${status}: ${path}`);
	}
}

function headers(token?: string): HeadersInit {
	const h: Record<string, string> = {
		Accept: 'application/vnd.github+json',
		'User-Agent': 'siddharthakhanal-portfolio'
	};
	if (token) h.Authorization = `Bearer ${token}`;
	return h;
}

async function gh<T>(path: string, token?: string): Promise<T> {
	const res = await fetch(`${API}${path}`, { headers: headers(token) });
	if (!res.ok) {
		throw new GitHubApiError(res.status, path);
	}
	return res.json() as Promise<T>;
}

async function fetchAllRepos(username: string, token?: string): Promise<GitHubRepo[]> {
	const repos: GitHubRepo[] = [];
	let page = 1;
	while (page <= 5) {
		const batch = await gh<GitHubRepo[]>(
			`/users/${username}/repos?per_page=100&page=${page}&sort=updated&direction=desc`,
			token
		);
		repos.push(...batch);
		if (batch.length < 100) break;
		page += 1;
	}
	return repos;
}

function levelFromCount(count: number): 0 | 1 | 2 | 3 | 4 {
	if (count <= 0) return 0;
	if (count <= 2) return 1;
	if (count <= 5) return 2;
	if (count <= 9) return 3;
	return 4;
}

type GraphQLCalendarResponse = {
	data?: {
		user?: {
			contributionsCollection?: {
				contributionCalendar?: {
					totalContributions: number;
					weeks: {
						contributionDays: {
							date: string;
							contributionCount: number;
							contributionLevel: string;
						}[];
					}[];
				};
			};
		};
	};
	errors?: { message: string }[];
};

const LEVEL_MAP: Record<string, 0 | 1 | 2 | 3 | 4> = {
	NONE: 0,
	FIRST_QUARTILE: 1,
	SECOND_QUARTILE: 2,
	THIRD_QUARTILE: 3,
	FOURTH_QUARTILE: 4
};

async function fetchContributions(
	username: string,
	token?: string
): Promise<ContributionCalendar | null> {
	if (!token) return null;

	const query = `
		query ($login: String!) {
			user(login: $login) {
				contributionsCollection {
					contributionCalendar {
						totalContributions
						weeks {
							contributionDays {
								date
								contributionCount
								contributionLevel
							}
						}
					}
				}
			}
		}
	`;

	const res = await fetch(GRAPHQL, {
		method: 'POST',
		headers: {
			...headers(token),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query, variables: { login: username } })
	});

	if (!res.ok) return null;

	const json = (await res.json()) as GraphQLCalendarResponse;
	const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
	if (!calendar) return null;

	return {
		total: calendar.totalContributions,
		weeks: calendar.weeks.map((week) => ({
			days: week.contributionDays.map((day) => ({
				date: day.date,
				count: day.contributionCount,
				level: LEVEL_MAP[day.contributionLevel] ?? levelFromCount(day.contributionCount)
			}))
		}))
	};
}

function buildStats(user: GitHubUser, repos: GitHubRepo[]): GitHubStats {
	const owned = repos.filter((r) => !r.fork);
	const forked = repos.filter((r) => r.fork);

	const langCounts = new Map<string, number>();
	for (const repo of owned) {
		if (!repo.language) continue;
		langCounts.set(repo.language, (langCounts.get(repo.language) ?? 0) + 1);
	}

	const totalLangRepos = [...langCounts.values()].reduce((a, b) => a + b, 0) || 1;
	const languages: LanguageStat[] = [...langCounts.entries()]
		.map(([name, count]) => ({
			name,
			count,
			pct: Math.round((count / totalLangRepos) * 100)
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 8);

	const created = new Date(user.created_at);
	const yearsActive = Math.max(
		1,
		Math.floor((Date.now() - created.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
	);

	return {
		totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
		totalForks: owned.reduce((sum, r) => sum + r.forks_count, 0),
		ownedRepos: owned.length,
		forkedRepos: forked.length,
		languages,
		yearsActive
	};
}

let cache: { key: string; at: number; data: PortfolioData } | null = null;

function kvCacheKey(key: string) {
	return `github:portfolio:${key}`;
}

function kvLatestKey(key: string) {
	return `${kvCacheKey(key)}:latest`;
}

function isForbidden(error: unknown) {
	return error instanceof GitHubApiError && error.status === 403;
}

async function readCachedPortfolio(
	kv: KVNamespace | undefined,
	key: string,
	latest = false
): Promise<PortfolioData | null> {
	if (!kv) return null;

	try {
		return await kv.get<PortfolioData>(latest ? kvLatestKey(key) : kvCacheKey(key), 'json');
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`GitHub stats cache read failed: ${message}`);
		return null;
	}
}

async function writeCachedPortfolio(
	kv: KVNamespace | undefined,
	key: string,
	data: PortfolioData
): Promise<void> {
	if (!kv) return;

	const serialized = JSON.stringify(data);

	try {
		await Promise.all([
			kv.put(kvCacheKey(key), serialized, { expirationTtl: KV_CACHE_TTL_SECONDS }),
			kv.put(kvLatestKey(key), serialized)
		]);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`GitHub stats cache write failed: ${message}`);
	}
}

export async function fetchPortfolio(
	username = GITHUB_USERNAME,
	token?: string,
	kv?: KVNamespace
): Promise<PortfolioData> {
	const key = `${username}:${token ? 'auth' : 'anon'}`;
	if (cache && cache.key === key && Date.now() - cache.at < MEMORY_CACHE_TTL_MS) {
		return cache.data;
	}

	const cached = await readCachedPortfolio(kv, key);
	if (cached) {
		cache = { key, at: Date.now(), data: cached };
		return cached;
	}

	try {
		const [user, repos, contributions] = await Promise.all([
			gh<GitHubUser>(`/users/${username}`, token),
			fetchAllRepos(username, token),
			fetchContributions(username, token)
		]);

		const featured = repos
			.filter((r) => !r.fork && !r.archived)
			.sort((a, b) => {
				if (b.stargazers_count !== a.stargazers_count) {
					return b.stargazers_count - a.stargazers_count;
				}
				return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
			})
			.slice(0, 8);

		const data: PortfolioData = {
			user,
			repos: featured,
			stats: buildStats(user, repos),
			contributions
		};

		cache = { key, at: Date.now(), data };
		await writeCachedPortfolio(kv, key, data);
		return data;
	} catch (error) {
		const latest = isForbidden(error) ? await readCachedPortfolio(kv, key, true) : null;
		if (latest) {
			cache = { key, at: Date.now(), data: latest };
			return latest;
		}

		throw error;
	}
}
