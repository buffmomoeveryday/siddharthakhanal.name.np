/** GitHub username used for profile, repos, and stats. */
export const GITHUB_USERNAME = 'buffmomoeveryday';

export const SITE = {
	title: 'Siddhartha Khanal',
	tagline: 'Software engineer · Kathmandu',
	email: 'hello@siddharthakhanal.name.np',
	website: 'https://siddharthakhanal.name.np'
} as const;

/** Header / footer links. GitHub profile is always included from the API. */
export const LINKS: { label: string; href: string }[] = [];

export const SOCIAL_LINKS: { label: string; href: string }[] = [
	{ label: 'GitHub', href: 'https://github.com/buffmomoeveryday' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/siddhartha-khanal/' }
];

/**
 * Tools & stack shown in the // using section.
 * Leave empty to hide the section.
 */
export type UsingGroup = {
	category: string;
	items: string[];
};

export const USING: UsingGroup[] = [
	{
		category: 'Languages',
		items: ['Python', 'Go', 'Nim', 'TypeScript', 'JavaScript', 'SQL']
	},
	{
		category: 'Backend',
		items: ['Django', 'DRF', 'Django Ninja', 'Django Channels', 'FastAPI', 'Go', 'Nim', 'Celery']
	},
	{
		category: 'Frontend',
		items: ['SvelteKit', 'HTML', 'CSS']
	},
	{
		category: 'Databases & Cache',
		items: ['PostgreSQL', 'SQLite', 'Redis', 'D1']
	},
	{
		category: 'DevOps',
		items: ['Docker', 'Docker Swarm', 'Git', 'Linux', 'GitHub Actions', 'Nginx', 'Gunicorn']
	},
	{
		category: 'Cloud',
		items: [
			'DigitalOcean',
			'DigitalOcean App Platform',
			'S3',
			'Cloudflare',
			'Cloudflare R2',
			'Workers'
		]
	}
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
		role: 'Backend Developer & Team Lead',
		company: 'Hinomaru Tech',
		url: 'https://github.com/hinomaru-tech',
		location: 'Kathmandu, Nepal',
		start: 'Jan 2025',
		end: 'Present',
		summary:
			'Leading backend engineering, mentoring developers, reviewing code, and guiding architecture for core products.',
		using: ['Python', 'Django', 'DRF', 'PostgreSQL', 'Redis', 'Docker']
	},
	{
		role: 'Backend Developer',
		company: 'Freelance',
		location: 'Remote',
		start: 'Jun 2024',
		end: 'Dec 2024',
		summary:
			'Delivered custom backend solutions, optimized database queries, and integrated third-party APIs for client projects.',
		using: ['Python', 'Django', 'DRF', 'PostgreSQL']
	}
];

/**
 * Education shown in the // education section.
 */
export type Education = {
	school: string;
	degree?: string;
	location?: string;
	start?: string;
	end?: string;
	summary?: string;
};

export const EDUCATION: Education[] = [
	{
		school: 'Reliance College',
		degree: 'Bachelor of Computer Application',
		location: 'Saraswatinagar, Kathmandu',
		start: 'Jan 2020',
		end: 'Jan 2025',
		summary: 'Final year project: TinyShop.'
	},
	{
		school: 'Reliance International College',
		degree: '+2 in Management (Computer Science)',
		location: 'Kathmandu, Nepal',
		start: 'Jun 2017',
		end: 'Jun 2019'
	},
	{
		school: 'Tarasadan English School',
		degree: 'SLC / SEE',
		location: 'Kathmandu, Nepal',
		end: 'Apr 2017'
	}
];

/**
 * Project page content from the resume.
 */
export type FeaturedProject = {
	name: string;
	year?: string;
	summary: string;
	highlights: string[];
	using: string[];
};

export const FEATURED_PROJECTS: FeaturedProject[] = [
	{
		name: 'TinyShop',
		year: '2024',
		summary:
			'A Shopify-esque e-commerce framework where users can create isolated, custom storefronts.',
		highlights: [
			'Implemented multi-tenancy using django-tenants and PostgreSQL multi-schema architecture.',
			'Engineered asynchronous task queues with Celery and Redis for order processing.',
			'Built a dynamic templating system supporting custom domains and user-defined themes.'
		],
		using: ['Python', 'Django', 'django-tenants', 'PostgreSQL', 'Celery', 'Redis']
	},
	{
		name: 'Jamma',
		year: '2024',
		summary: 'A proof-of-concept web analytics platform inspired by Plausible Analytics.',
		highlights: [
			'Built a high-performance ingestion API using Django REST Framework.',
			'Implemented Celery workers to process tracking events asynchronously.',
			'Kept data collection non-blocking for incoming analytics requests.'
		],
		using: ['Python', 'Django', 'DRF', 'Celery', 'Redis']
	},
	{
		name: 'Django SQLite Tenants',
		year: '2024',
		summary:
			'A published Python package for creating multi-tenant Django applications with SQLite.',
		highlights: [
			'Packaged reusable multi-tenancy behavior for Django projects.',
			'Published the package on PyPI for public use.'
		],
		using: ['Python', 'Django', 'SQLite']
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
	tinyshop: {
		using: ['Python', 'Django', 'django-tenants', 'PostgreSQL', 'Celery', 'Redis'],
		description:
			'Shopify-esque e-commerce framework with isolated storefronts, multi-schema tenancy, async order processing, custom domains, and user-defined themes.'
	},
	jamma: {
		using: ['Python', 'Django', 'DRF', 'Celery', 'Redis'],
		description:
			'Proof-of-concept web analytics platform with a high-performance ingestion API and asynchronous event processing.'
	},
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
		docs: 'https://github.com/buffmomoeveryday/django-sqlite-tenants#readme',
		description:
			'Published Python package for creating multi-tenant Django applications with SQLite.'
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
