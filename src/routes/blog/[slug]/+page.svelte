<script lang="ts">
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import type { BlogPost } from '#lib/server/blog';

	let { data }: { data: { post: BlogPost } } = $props();

	const post = $derived(data.post);

	function formatDate(iso: string) {
		return new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{post.title} — Blog</title>
	<meta name="description" content={post.description || post.title} />
</svelte:head>

<main class="mx-auto min-h-dvh w-full max-w-[720px] px-5 py-10 sm:px-8 sm:py-16">
	<header class="border-line border-b pb-8">
		<div class="mb-6 flex items-center justify-between gap-4">
			<a
				href="/blog"
				class="text-muted hover:text-accent text-[13px] font-semibold tracking-wide transition-colors"
			>
				Blog
			</a>
			<ThemeToggle />
		</div>

		<p class="text-comment mb-3 text-[13px] font-medium tracking-wide">// post</p>
		<h1 class="text-[clamp(1.6rem,4vw,2.2rem)] leading-tight font-semibold tracking-[-0.03em]">
			{post.title}
		</h1>
		<div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
			<time class="text-faint text-[13px] font-medium" datetime={post.date}
				>{formatDate(post.date)}</time
			>
			{#if post.tags.length}
				<ul class="flex flex-wrap gap-2">
					{#each post.tags as tag (tag)}
						<li>
							<a href="/blog?tag={encodeURIComponent(tag)}" class="tag-chip">{tag}</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</header>

	<article class="prose-blog border-line border-b py-8">
		{@html post.html}
	</article>

	<footer class="pt-6">
		<a href="/blog" class="text-accent text-[13px] font-semibold tracking-wide hover:opacity-70">
			All posts
		</a>
	</footer>
</main>
