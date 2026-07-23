<script lang="ts">
	import { page } from '$app/state';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import type { BlogMeta } from '#lib/server/blog';

	let { data }: { data: { posts: BlogMeta[]; tags: string[] } } = $props();

	let query = $state('');
	let activeTags = $state<string[]>([]);

	$effect(() => {
		const tag = page.url.searchParams.get('tag');
		if (tag && data.tags.includes(tag) && !activeTags.includes(tag)) {
			activeTags = [...activeTags, tag];
		}
	});

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return data.posts.filter((post) => {
			if (activeTags.length && !activeTags.every((tag) => post.tags.includes(tag))) {
				return false;
			}
			if (!q) return true;

			const haystack = [post.title, post.description, post.content, ...post.tags]
				.join('\n')
				.toLowerCase();

			return haystack.includes(q);
		});
	});

	function formatDate(iso: string) {
		return new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function toggleTag(tag: string) {
		if (activeTags.includes(tag)) {
			activeTags = activeTags.filter((t) => t !== tag);
		} else {
			activeTags = [...activeTags, tag];
		}
	}

	function clearFilters() {
		query = '';
		activeTags = [];
	}
</script>

<svelte:head>
	<title>Blog — Siddhartha Khanal</title>
	<meta name="description" content="Notes and writing by Siddhartha Khanal." />
</svelte:head>

<main class="mx-auto min-h-dvh w-full max-w-[720px] px-5 py-10 sm:px-8 sm:py-16">
	<header class="border-line border-b pb-8">
		<div class="mb-6 flex items-center justify-between gap-4">
			<a
				href="/"
				class="text-muted hover:text-accent text-[13px] font-semibold tracking-wide transition-colors"
			>
				Home
			</a>
			<ThemeToggle />
		</div>
		<p class="text-comment mb-3 text-[13px] font-medium tracking-wide">// blog</p>
		<h1 class="text-[clamp(1.75rem,4vw,2.35rem)] leading-tight font-semibold tracking-[-0.03em]">
			Blog
		</h1>
		<p class="text-muted mt-2 text-[15px] leading-relaxed">
			Notes on software, ops, and shipping.
		</p>

		{#if data.posts.length}
			<div class="mt-6 space-y-4">
				<label class="block">
					<span class="sr-only">Search posts</span>
					<input
						type="search"
						bind:value={query}
						placeholder="Search title, content, tags…"
						class="border-line bg-paper text-ink placeholder:text-faint focus:border-accent w-full border px-3 py-2.5 text-[14px] outline-none transition-colors"
					/>
				</label>

				{#if data.tags.length}
					<div>
						<p class="text-faint mb-2 text-[11px] font-semibold tracking-[0.12em] uppercase">
							Filter by tag
						</p>
						<ul class="flex flex-wrap gap-2">
							{#each data.tags as tag (tag)}
								<li>
									<button
										type="button"
										class="tag-chip {activeTags.includes(tag) ? 'tag-chip-active' : ''}"
										aria-pressed={activeTags.includes(tag)}
										onclick={() => toggleTag(tag)}
									>
										{tag}
									</button>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if query || activeTags.length}
					<div class="text-faint flex flex-wrap items-center gap-3 text-[12px] font-medium">
						<span>
							{filtered.length} result{filtered.length === 1 ? '' : 's'}
						</span>
						<button
							type="button"
							class="text-accent hover:opacity-70 transition-opacity"
							onclick={clearFilters}
						>
							Clear
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</header>

	{#if data.posts.length === 0}
		<p class="text-muted py-10 text-sm">No posts yet.</p>
	{:else if filtered.length === 0}
		<p class="text-muted py-10 text-sm">No posts match that search.</p>
	{:else}
		<ul class="divide-line divide-y">
			{#each filtered as post (post.slug)}
				<li class="py-6">
					<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
						<a
							href="/blog/{post.slug}"
							class="text-ink hover:text-accent text-[17px] font-semibold tracking-tight transition-colors"
						>
							{post.title}
						</a>
						<time
							class="text-faint shrink-0 text-[12px] font-medium tabular-nums"
							datetime={post.date}
						>
							{formatDate(post.date)}
						</time>
					</div>
					{#if post.description}
						<p class="text-muted mt-2 text-[14px] leading-relaxed">
							<a href="/blog/{post.slug}" class="hover:text-ink transition-colors">
								{post.description}
							</a>
						</p>
					{/if}
					{#if post.tags.length}
						<ul class="mt-3 flex flex-wrap gap-2">
							{#each post.tags as tag (tag)}
								<li>
									<button
										type="button"
										class="tag-chip {activeTags.includes(tag) ? 'tag-chip-active' : ''}"
										aria-pressed={activeTags.includes(tag)}
										onclick={() => toggleTag(tag)}
									>
										{tag}
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</main>
