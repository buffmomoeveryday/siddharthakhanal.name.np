const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const SIMPLEICONS = 'https://cdn.simpleicons.org';
const DRF_LOGO =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#a30000"/><text x="32" y="39" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700" fill="#fff">REST</text></svg>'
	);
const DJANGO_NINJA_LOGO =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#111"/><path fill="#fff" d="M34 6 14 38h14l-3 20 25-34H35l-1-18z"/><path fill="#f4eadb" d="M38 16h13l-6 8h-9l2-8z"/></svg>'
	);
const GITHUB_LOGO =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#181717" d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .5z"/></svg>'
	);
const LINKEDIN_LOGO =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#0A66C2"/><path fill="#fff" d="M6.94 8.98H4.46v10.04h2.48V8.98zM5.7 4.98a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88zm5.2 4H8.52v10.04h2.48v-5.38c0-1.42.27-2.8 2.03-2.8 1.74 0 1.76 1.63 1.76 2.89v5.29h2.48v-5.97c0-2.93-.63-5.19-4.06-5.19-1.65 0-2.75.9-3.2 1.76h-.03V8.98z"/></svg>'
	);
const EMAIL_LOGO =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#1e4d5c"/><path fill="#fff" d="M5 7h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm1.1 2 5.9 4 5.9-4H6.1zm11.9 6V10.8l-5.44 3.69a1 1 0 0 1-1.12 0L6 10.8V15h12z"/></svg>'
	);
const WEBSITE_LOGO =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#1e4d5c"/><path fill="#fff" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm5.65 7h-2.82a13.8 13.8 0 0 0-.9-4.02A6.03 6.03 0 0 1 17.65 11zM12 6.08c.44.64 1.15 2.16 1.32 4.92h-2.64C10.85 8.24 11.56 6.72 12 6.08zM6.35 13h2.82c.1 1.55.4 2.9.9 4.02A6.03 6.03 0 0 1 6.35 13zm2.82-2H6.35a6.03 6.03 0 0 1 3.72-4.02A13.8 13.8 0 0 0 9.17 11zM12 17.92c-.44-.64-1.15-2.16-1.32-4.92h2.64c-.17 2.76-.88 4.28-1.32 4.92zm1.93-.9c.5-1.12.8-2.47.9-4.02h2.82a6.03 6.03 0 0 1-3.72 4.02z"/></svg>'
	);
const RESUME_LOGO =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#3d6b8a"/><path fill="#fff" d="M7 4h7l3 3v13H7V4zm7 1.8V8h2.2L14 5.8zM9 11h6V9.8H9V11zm0 3h6v-1.2H9V14zm0 3h4v-1.2H9V17z"/></svg>'
	);

/** Canonical tech name → Devicon SVG path (folder/file without base URL). */
const ICONS: Record<string, string> = {
	python: 'python/python-original.svg',
	django: 'django/django-plain.svg',
	drf: DRF_LOGO,
	djangorestframework: DRF_LOGO,
	djangoninja: DJANGO_NINJA_LOGO,
	djangochannels: 'django/django-plain.svg',
	nim: 'nim/nim-original.svg',
	svelte: 'svelte/svelte-original.svg',
	sveltekit: 'svelte/svelte-original.svg',
	typescript: 'typescript/typescript-original.svg',
	javascript: 'javascript/javascript-original.svg',
	htmlcss: 'html5/html5-original.svg',
	postgresql: 'postgresql/postgresql-original.svg',
	postgres: 'postgresql/postgresql-original.svg',
	sqlite: 'sqlite/sqlite-original.svg',
	d1: 'sqlite/sqlite-original.svg',
	d1database: 'sqlite/sqlite-original.svg',
	cloudflare: 'cloudflare/cloudflare-original.svg',
	cloudflarer2: 'cloudflare/cloudflare-original.svg',
	r2: 'cloudflare/cloudflare-original.svg',
	workers: 'cloudflareworkers/cloudflareworkers-original.svg',
	cloudflareworkers: 'cloudflareworkers/cloudflareworkers-original.svg',
	go: 'go/go-original.svg',
	golang: 'go/go-original.svg',
	html: 'html5/html5-original.svg',
	html5: 'html5/html5-original.svg',
	css: 'css3/css3-original.svg',
	css3: 'css3/css3-original.svg',
	shell: 'bash/bash-original.svg',
	bash: 'bash/bash-original.svg',
	nodejs: 'nodejs/nodejs-original.svg',
	node: 'nodejs/nodejs-original.svg',
	fastapi: 'fastapi/fastapi-original.svg',
	docker: 'docker/docker-original.svg',
	dockerswarm: 'docker/docker-original.svg',
	digitalocean: 'digitalocean/digitalocean-original.svg',
	digitaloceanappplatform: 'digitalocean/digitalocean-original.svg',
	s3: 'amazonwebservices/amazonwebservices-original-wordmark.svg',
	aws: 'amazonwebservices/amazonwebservices-original-wordmark.svg',
	amazonwebservices: 'amazonwebservices/amazonwebservices-original-wordmark.svg',
	git: 'git/git-original.svg',
	github: GITHUB_LOGO,
	linkedin: LINKEDIN_LOGO,
	email: EMAIL_LOGO,
	website: WEBSITE_LOGO,
	resume: RESUME_LOGO,
	cv: RESUME_LOGO,
	linux: 'linux/linux-original.svg',
	nginx: 'nginx/nginx-original.svg',
	redis: 'redis/redis-original.svg',
	celery: `${SIMPLEICONS}/celery`,
	githubactions: `${SIMPLEICONS}/githubactions`,
	gunicorn: `${SIMPLEICONS}/gunicorn`,
	djangotenants: 'django/django-plain.svg',
	'django-tenants': 'django/django-plain.svg',
	rust: 'rust/rust-original.svg',
	c: 'c/c-original.svg',
	cpp: 'cplusplus/cplusplus-original.svg',
	'c++': 'cplusplus/cplusplus-original.svg',
	java: 'java/java-original.svg',
	php: 'php/php-original.svg',
	ruby: 'ruby/ruby-original.svg',
	vue: 'vuejs/vuejs-original.svg',
	react: 'react/react-original.svg',
	nextjs: 'nextjs/nextjs-original.svg',
	tailwind: 'tailwindcss/tailwindcss-original.svg',
	tailwindcss: 'tailwindcss/tailwindcss-original.svg',
	vite: 'vitejs/vitejs-original.svg',
	vitest: 'vitest/vitest-original.svg',
	pnpm: 'pnpm/pnpm-original.svg',
	npm: 'npm/npm-original-wordmark.svg'
};

function keyFor(name: string): string {
	return name.trim().toLowerCase().replace(/\s+/g, '');
}

/** Resolve a logo URL for a language/tool name, or null if unknown. */
export function logoUrl(name: string): string | null {
	const key = keyFor(name);
	const path = ICONS[key];
	if (!path) return null;
	return path.startsWith('http') || path.startsWith('data:') ? path : `${DEVICON}/${path}`;
}

export function hasLogo(name: string): boolean {
	return keyFor(name) in ICONS;
}
