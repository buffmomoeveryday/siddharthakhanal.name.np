/** GitHub username used for profile, repos, and stats. */
export const GITHUB_USERNAME = 'buffmomoeveryday';

export const SITE = {
	title: 'Siddhartha Khanal',
	tagline: 'Software engineer · Kathmandu',
	email: 'hello@siddharthakhanal.name.np',
	// website: 'https://siddharthakhanal.name.np'
} as const;

/** Header / footer links. GitHub profile is always included from the API. */
export const LINKS: { label: string; href: string }[] = [
	{ label: 'Website', href: 'https://siddharthakhanal.com' },
	{ label: 'Email', href: 'mailto:hello@siddharthakhanal.name.np' }
];

/**
 * Tools & stack shown in the // using section.
 * Leave empty to hide the section.
 */
export const USING: string[] = [
	'Python',
	'Django',
	'Django Channels',
	'Nim',
	'SvelteKit',
	'TypeScript',
	'PostgreSQL',
	'SQLite',
	'Docker',
	'Docker Swarm',
	'DigitalOcean',
	'DigitalOcean App Platform',
	'S3',
	'Cloudflare',
	'Cloudflare R2',
	'D1',
	'Workers'
];

/**
 * Work experience shown in the // experience section.
 * Leave empty to hide the section.
 */
export type Experience = {
	role: string;
	company: string;
	url?: string;
	location?: string;
	start: string;
	end?: string;
	summary: string;
	using?: string[];
};

export const EXPERIENCE: Experience[] = [
	{
		role: 'Software Engineer',
		company: 'Hinomaru Tech',
		url: 'https://github.com/hinomaru-tech',
		location: 'Kathmandu, Nepal',
		start: '2024',
		end: 'Present',
		summary:
			'Building and shipping web products — backends, tooling, and full-stack features across Python/Django and modern frontend stacks.',
		using: ['Python', 'Django', 'SvelteKit', 'PostgreSQL', 'TypeScript']
	}
];

/**
 * Optional per-repo overrides keyed by GitHub repo name.
 * - `using` — tech tags for that project
 * - `docs` — documentation URL
 * - `homepage` — live demo / site (falls back to repo.homepage from GitHub)
 * - `description` — override the GitHub description
 */
export type ProjectExtra = {
	using?: string[];
	docs?: string;
	homepage?: string;
	description?: string;
};

export const PROJECTS: Record<string, ProjectExtra> = {
	bridge: {
		using: ['Nim', 'CLI'],
		docs: 'https://github.com/buffmomoeveryday/bridge#readme'
	},
	'channels-sqlite': {
		using: ['Python', 'Django', 'SQLite'],
		docs: 'https://github.com/buffmomoeveryday/channels-sqlite#readme'
	},
	'django-sqlite-tenants': {
		using: ['Python', 'Django', 'SQLite'],
		docs: 'https://github.com/buffmomoeveryday/django-sqlite-tenants#readme'
	},
	sunflower: {
		using: ['SvelteKit', 'JavaScript'],
		docs: 'https://github.com/buffmomoeveryday/sunflower#readme'
	},
	pasal: {
		using: ['JavaScript'],
		docs: 'https://github.com/buffmomoeveryday/pasal#readme'
	},
	quee: {
		using: ['Nim', 'LimDB'],
		docs: 'https://github.com/buffmomoeveryday/quee#readme'
	}
};
