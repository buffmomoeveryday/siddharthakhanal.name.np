<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import TechLogo from '#lib/components/TechLogo.svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import { FEATURED_PROJECTS } from '#lib/config';
</script>

<Seo title="Projects" description="Selected projects by Siddhartha Khanal." />

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

		<p class="mb-3 text-[13px] font-medium tracking-wide text-comment">// projects</p>
		<h1 class="text-[clamp(1.75rem,4vw,2.35rem)] leading-tight font-semibold tracking-[-0.03em]">
			Projects
		</h1>
		<p class="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
			Selected work from my resume, focused on backend systems, APIs, multi-tenancy, and async
			processing.
		</p>
	</header>

	<ul class="divide-y divide-line">
		{#each FEATURED_PROJECTS as project (project.name)}
			<li class="py-8">
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
					<h2 class="text-[18px] font-semibold tracking-tight text-ink">{project.name}</h2>
					{#if project.year}
						<p class="shrink-0 text-[12px] font-medium text-faint tabular-nums">{project.year}</p>
					{/if}
				</div>

				<p class="mt-2 text-[14px] leading-relaxed text-muted">{project.summary}</p>

				{#if project.using.length}
					<ul class="mt-4 flex flex-wrap gap-x-3 gap-y-2">
						{#each project.using as item (item)}
							<li class="text-[12.5px] font-medium tracking-wide text-muted">
								<TechLogo name={item} size={14} />
							</li>
						{/each}
					</ul>
				{/if}

				<ul class="mt-4 list-disc space-y-2 pl-5 text-[13.5px] leading-relaxed text-muted">
					{#each project.highlights as item (item)}
						<li>{item}</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>

	<footer class="border-t border-line pt-6">
		<a href="/contact" class="text-[13px] font-semibold tracking-wide text-accent hover:opacity-70">
			Contact me
		</a>
	</footer>
</main>
