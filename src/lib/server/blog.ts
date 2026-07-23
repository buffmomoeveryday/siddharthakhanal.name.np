import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import nginx from 'highlight.js/lib/languages/nginx';
import nim from 'highlight.js/lib/languages/nim';
import plaintext from 'highlight.js/lib/languages/plaintext';
import python from 'highlight.js/lib/languages/python';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('css', css);
hljs.registerLanguage('go', go);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('nginx', nginx);
hljs.registerLanguage('nim', nim);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('text', plaintext);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('svelte', xml);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);

const marked = new Marked(
	markedHighlight({
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		}
	})
);

export type BlogMeta = {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags: string[];
	/** Plain markdown body for client-side search (not rendered HTML). */
	content: string;
	draft?: boolean;
};

export type BlogPost = Omit<BlogMeta, 'content'> & {
	html: string;
};

type Frontmatter = {
	title?: string;
	description?: string;
	date?: string;
	tags?: string[] | string;
	draft?: boolean;
};

const files = import.meta.glob('../../content/blog/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

function parseFrontmatter(raw: string): { meta: Frontmatter; body: string } {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) return { meta: {}, body: raw };

	const [, yamlBlock, body] = match;
	const meta: Frontmatter = {};

	for (const line of yamlBlock.split('\n')) {
		const idx = line.indexOf(':');
		if (idx === -1) continue;
		const key = line.slice(0, idx).trim();
		let value = line.slice(idx + 1).trim();

		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		if (key === 'tags') {
			if (value.startsWith('[') && value.endsWith(']')) {
				meta.tags = value
					.slice(1, -1)
					.split(',')
					.map((t) => t.trim().replace(/^["']|["']$/g, ''))
					.filter(Boolean);
			} else {
				meta.tags = value;
			}
		} else if (key === 'draft') {
			meta.draft = value === 'true';
		} else if (key === 'title') {
			meta.title = value;
		} else if (key === 'description') {
			meta.description = value;
		} else if (key === 'date') {
			meta.date = value;
		}
	}

	return { meta, body };
}

function slugFromPath(path: string): string {
	const file = path.split('/').pop() ?? path;
	return file.replace(/\.md$/, '');
}

function toMeta(path: string, meta: Frontmatter, body = ''): BlogMeta | null {
	if (!meta.title || !meta.date) return null;
	const tags = Array.isArray(meta.tags)
		? meta.tags
		: typeof meta.tags === 'string' && meta.tags
			? meta.tags.split(',').map((t) => t.trim())
			: [];

	return {
		slug: slugFromPath(path),
		title: meta.title,
		description: meta.description ?? '',
		date: meta.date,
		tags,
		content: body,
		draft: meta.draft ?? false
	};
}

export function listPosts(): BlogMeta[] {
	const posts: BlogMeta[] = [];

	for (const [path, raw] of Object.entries(files)) {
		const { meta, body } = parseFrontmatter(raw);
		const post = toMeta(path, meta, body);
		if (!post || post.draft) continue;
		posts.push(post);
	}

	return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function listTags(posts = listPosts()): string[] {
	const tags = new Set<string>();
	for (const post of posts) {
		for (const tag of post.tags) tags.add(tag);
	}
	return [...tags].sort((a, b) => a.localeCompare(b));
}

export function getPost(slug: string): BlogPost | null {
	const entry = Object.entries(files).find(([path]) => slugFromPath(path) === slug);
	if (!entry) return null;

	const [path, raw] = entry;
	const { meta, body } = parseFrontmatter(raw);
	const post = toMeta(path, meta, body);
	if (!post || post.draft) return null;

	const html = marked.parse(body, { async: false }) as string;
	const { content: _content, ...rest } = post;
	return { ...rest, html };
}
