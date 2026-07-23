const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

/** Canonical tech name → Devicon SVG path (folder/file without base URL). */
const ICONS: Record<string, string> = {
	python: 'python/python-original.svg',
	django: 'django/django-plain.svg',
	djangochannels: 'django/django-plain.svg',
	nim: 'nim/nim-original.svg',
	svelte: 'svelte/svelte-original.svg',
	sveltekit: 'svelte/svelte-original.svg',
	typescript: 'typescript/typescript-original.svg',
	javascript: 'javascript/javascript-original.svg',
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
	linux: 'linux/linux-original.svg',
	nginx: 'nginx/nginx-original.svg',
	redis: 'redis/redis-original.svg',
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
	return path ? `${DEVICON}/${path}` : null;
}

export function hasLogo(name: string): boolean {
	return keyFor(name) in ICONS;
}
