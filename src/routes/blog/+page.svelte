<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import type { BlogMeta } from '#lib/server/blog';

	let { data }: { data: { posts: BlogMeta[] } } = $props();

	function formatDate(iso: string | undefined) {
		if (!iso) return '';
		return new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<Seo title="Blog" description="Notes and writing by Siddhartha Khanal." />

<main class="mx-auto min-h-dvh w-full max-w-[720px] px-5 py-10 sm:px-8 sm:py-16">
	<header class="border-b border-line pb-8">
		<div class="mb-6 flex items-center justify-between gap-4">
			<a
				href="/"
				class="text-[13px] font-semibold tracking-wide text-muted transition-colors hover:text-accent"
			>
				Home
			</a>
			<ThemeToggle />
		</div>
		<p class="mb-3 text-[13px] font-medium tracking-wide text-comment">// blog</p>
		<h1 class="text-[clamp(1.75rem,4vw,2.35rem)] leading-tight font-semibold tracking-[-0.03em]">
			Blog
		</h1>
		<p class="mt-2 text-[15px] leading-relaxed text-muted">
			Short notes on software, operations, and things I learn while building.
		</p>
	</header>

	{#if data.posts.length === 0}
		<p class="py-10 text-sm text-muted">No posts yet.</p>
	{:else}
		<ul class="divide-y divide-line">
			{#each data.posts as post (post.slug)}
				<li class="py-6">
					<a href="/blog/{post.slug}" class="group block">
						<div
							class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
						>
							<h2
								class="text-[18px] font-semibold tracking-tight text-ink transition-colors group-hover:text-accent"
							>
								{post.title}
							</h2>
							{#if post.date}
								<time
									class="shrink-0 text-[12px] font-medium text-faint tabular-nums"
									datetime={post.date}
								>
									{formatDate(post.date)}
								</time>
							{/if}
						</div>
						{#if post.description}
							<p class="mt-2 text-[14px] leading-relaxed text-muted">
								{post.description}
							</p>
						{/if}
					</a>
					{#if post.tags.length}
						<ul class="mt-3 flex flex-wrap gap-2">
							{#each post.tags as tag (tag)}
								<li>
									<span class="tag-chip">{tag}</span>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</main>
