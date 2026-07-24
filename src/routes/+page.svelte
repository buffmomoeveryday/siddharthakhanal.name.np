<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '#lib/components/Seo.svelte';
	import TechLogo from '#lib/components/TechLogo.svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import ContributionChart from '#lib/components/ContributionChart.svelte';
	import {
		EDUCATION,
		EXPERIENCE,
		FEATURED_PROJECTS,
		PROJECTS,
		SITE,
		SOCIAL_LINKS,
		USING
	} from '#lib/config';
	import type { BlogMeta } from '#lib/server/blog';
	import type { PortfolioData } from '#lib/server/github';

	type Data = {
		portfolio: PortfolioData | null;
		error: string | null;
		posts: BlogMeta[];
	};

	let { data }: { data: Data } = $props();

	const portfolio = $derived(data.portfolio);
	const user = $derived(portfolio?.user);
	const repos = $derived(portfolio?.repos ?? []);
	const stats = $derived(portfolio?.stats);
	const contributions = $derived(portfolio?.contributions);
	const posts = $derived(data.posts ?? []);
	const homeTimezone = 'Asia/Kathmandu';
	let timezoneNote = $state<string | null>(null);

	onMount(() => {
		const visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (!visitorTimezone || visitorTimezone === homeTimezone) return;

		const now = new Date();
		const difference = offsetMinutesAt(now, homeTimezone) - offsetMinutesAt(now, visitorTimezone);
		if (difference === 0) return;

		timezoneNote = `Kathmandu is ${formatTimezoneDifference(difference)} ${difference >= 0 ? 'ahead of' : 'behind'} you`;
	});

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short'
		});
	}

	function offsetMinutesAt(date: Date, timeZone: string) {
		const parts = new Intl.DateTimeFormat('en-US', {
			timeZone,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hourCycle: 'h23',
			hour12: false
		}).formatToParts(date);
		const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
		const asUtc = Date.UTC(
			Number(values.year),
			Number(values.month) - 1,
			Number(values.day),
			Number(values.hour),
			Number(values.minute),
			Number(values.second)
		);
		return Math.round((asUtc - date.getTime()) / 60000);
	}

	function formatTimezoneDifference(minutes: number) {
		const absolute = Math.abs(minutes);
		const hours = Math.floor(absolute / 60);
		const mins = absolute % 60;
		return mins ? `${hours}h ${mins}m` : `${hours}h`;
	}

	function displayName(u: NonNullable<typeof user>) {
		return u.name?.trim() || u.login;
	}

	function extras(name: string) {
		return PROJECTS[name] ?? {};
	}

	function homepageFor(repo: (typeof repos)[number]) {
		const override = extras(repo.name).homepage;
		if (override) return override;
		if (repo.homepage?.trim()) {
			return repo.homepage.startsWith('http') ? repo.homepage : `https://${repo.homepage}`;
		}
		return null;
	}
</script>

<Seo />

{#if data.error || !user || !stats}
	<main class="mx-auto flex min-h-dvh max-w-2xl items-center px-6 py-16">
		<div class="w-full">
			<p class="mb-2 text-sm font-medium tracking-wide text-comment">// error</p>
			<h1 class="text-2xl font-semibold tracking-tight">Could not load portfolio</h1>
			<p class="mt-3 text-sm leading-relaxed text-muted">{data.error ?? 'Unknown error'}</p>
		</div>
	</main>
{:else}
	<main class="mx-auto min-h-dvh w-full max-w-[720px] px-5 py-10 sm:px-8 sm:py-16">
		<article style="animation: rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;">
			<!-- Header -->
			<header class="border-b border-line pb-8">
				<div class="mb-6 flex items-start justify-between gap-4">
					<div class="min-w-0">
						<h1
							class="text-[clamp(1.75rem,4vw,2.35rem)] leading-tight font-semibold tracking-[-0.03em]"
						>
							{displayName(user)}
						</h1>
						{#if user.company || user.location}
							<p class="mt-2 text-sm font-medium tracking-wide text-muted">
								{#if user.company}
									{user.company.trim()}
								{/if}
								{#if user.company && user.location}
									<span class="mx-2 text-faint">·</span>
								{/if}
								{#if user.location}
									{user.location}
								{/if}
							</p>
						{/if}
						<div class="mt-2 flex flex-col gap-2 text-[13px] font-medium tracking-wide text-muted">
							<a href={`mailto:${SITE.email}`} class="transition-colors hover:text-accent">
								{SITE.email}
							</a>
							{#if timezoneNote}
								<span class="text-faint">{timezoneNote}</span>
							{/if}
							<ul class="flex flex-wrap gap-x-5 gap-y-2">
								<li>
									<a
										href="/resume.pdf"
										download="Siddhartha-Khanal-Resume.pdf"
										class="inline-flex items-center transition-colors hover:text-accent"
									>
										<TechLogo name="Resume" size={15} />
									</a>
								</li>
								{#each SOCIAL_LINKS as link (link.href)}
									<li>
										<a
											href={link.href}
											class="inline-flex items-center transition-colors hover:text-accent"
											target="_blank"
											rel="noreferrer"
										>
											<TechLogo name={link.label} size={15} />
										</a>
									</li>
								{/each}
							</ul>
						</div>
						{#if user.bio}
							<p class="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{user.bio}</p>
						{/if}
					</div>

					<div class="flex shrink-0 flex-col items-end gap-4">
						<ThemeToggle />
						<img
							src={user.avatar_url}
							alt=""
							width="72"
							height="72"
							class="size-[72px] border border-line object-cover grayscale-[15%] dark:grayscale-[25%]"
							style="animation: fade 0.9s ease 0.15s both;"
						/>
					</div>
				</div>

				<ul class="flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium tracking-wide text-muted">
					<li>
						<a href="/projects" class="transition-colors hover:text-accent">Projects</a>
					</li>
					<li>
						<a href="/blog" class="transition-colors hover:text-accent">Blog</a>
					</li>
					<li>
						<a href="/contact" class="transition-colors hover:text-accent">Contact</a>
					</li>
				</ul>
			</header>

			<!-- Experience -->
			{#if EXPERIENCE.length}
				<section class="border-b border-line py-8" style="animation: rise 0.7s ease 0.06s both;">
					<p class="mb-5 text-[13px] font-medium tracking-wide text-comment">// experience</p>
					<ul class="divide-y divide-line">
						{#each EXPERIENCE as job, i (job.company + job.role + job.start)}
							<li
								class="py-4 first:pt-0 last:pb-0"
								style="animation: rise 0.55s ease {0.08 + i * 0.05}s both;"
							>
								<div
									class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
								>
									<div class="min-w-0">
										<p class="text-[15px] font-semibold tracking-tight text-ink">
											{job.role}
										</p>
										<p class="mt-0.5 text-[13.5px] font-medium tracking-wide text-muted">
											{#if job.url}
												<a
													href={job.url}
													target="_blank"
													rel="noreferrer"
													class="transition-colors hover:text-accent"
												>
													{job.company}
												</a>
											{:else}
												{job.company}
											{/if}
											{#if job.location}
												<span class="text-faint"> · {job.location}</span>
											{/if}
										</p>
									</div>
									<p class="shrink-0 text-[12px] font-medium tracking-wide text-faint tabular-nums">
										{job.start}
										<span class="text-faint/80"> — </span>
										{job.end ?? 'Present'}
									</p>
								</div>
								<p class="mt-2.5 max-w-prose text-[13.5px] leading-relaxed text-muted">
									{job.summary}
								</p>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<!-- Education -->
			{#if EDUCATION.length}
				<section class="border-b border-line py-8" style="animation: rise 0.7s ease 0.07s both;">
					<p class="mb-5 text-[13px] font-medium tracking-wide text-comment">// education</p>
					<ul class="divide-y divide-line">
						{#each EDUCATION as item, i (item.school + item.degree)}
							<li
								class="py-4 first:pt-0 last:pb-0"
								style="animation: rise 0.55s ease {0.1 + i * 0.05}s both;"
							>
								<div
									class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
								>
									<div class="min-w-0">
										<p class="text-[15px] font-semibold tracking-tight text-ink">
											{item.degree ?? item.school}
										</p>
										<p class="mt-0.5 text-[13.5px] font-medium tracking-wide text-muted">
											{item.school}
											{#if item.location}
												<span class="text-faint"> · {item.location}</span>
											{/if}
										</p>
									</div>
									{#if item.start || item.end}
										<p
											class="shrink-0 text-[12px] font-medium tracking-wide text-faint tabular-nums"
										>
											{item.start ?? ''}
											{#if item.start && item.end}
												<span class="text-faint/80"> — </span>
											{/if}
											{item.end ?? ''}
										</p>
									{/if}
								</div>
								{#if item.summary}
									<p class="mt-2.5 max-w-prose text-[13.5px] leading-relaxed text-muted">
										{item.summary}
									</p>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<!-- Using -->
			{#if USING.length}
				<section class="border-b border-line py-8" style="animation: rise 0.7s ease 0.08s both;">
					<p class="mb-5 text-[13px] font-medium tracking-wide text-comment">// using</p>
					<ul class="space-y-5">
						{#each USING as group (group.category)}
							<li>
								<p class="mb-2 text-[12px] font-semibold tracking-[0.12em] text-faint uppercase">
									{group.category}
								</p>
								<ul class="flex flex-wrap gap-x-4 gap-y-3">
									{#each group.items as item (item)}
										<li class="text-[13.5px] font-medium tracking-wide text-ink">
											<TechLogo name={item} size={18} />
										</li>
									{/each}
								</ul>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<!-- Stats -->
			<section class="border-b border-line py-8" style="animation: rise 0.7s ease 0.12s both;">
				<p class="mb-5 text-[13px] font-medium tracking-wide text-comment">// github.stats</p>

				<div class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
					{#each [{ label: 'repos', value: stats.ownedRepos }, { label: 'stars', value: stats.totalStars }, { label: 'followers', value: user.followers }, { label: 'years', value: stats.yearsActive }] as item (item.label)}
						<div>
							<p class="text-[1.65rem] leading-none font-semibold tracking-tight tabular-nums">
								{item.value}
							</p>
							<p class="mt-1.5 text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">
								{item.label}
							</p>
						</div>
					{/each}
				</div>

				{#if stats.languages.length}
					<div class="mt-8">
						<p class="mb-3 text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">
							Languages
						</p>
						<ul class="space-y-2.5">
							{#each stats.languages as lang, i (lang.name)}
								<li
									class="grid grid-cols-[8.5rem_1fr_2.5rem] items-center gap-3 sm:grid-cols-[10rem_1fr_2.5rem]"
									style="animation: rise 0.5s ease {0.18 + i * 0.04}s both;"
								>
									<span class="truncate text-[13px] font-medium text-ink">
										<TechLogo name={lang.name} size={15} />
									</span>
									<div class="h-[3px] overflow-hidden bg-line/70">
										<div
											class="h-full origin-left bg-accent"
											style="width: {lang.pct}%; animation: grow 0.8s cubic-bezier(0.22,1,0.36,1) {0.25 +
												i * 0.05}s both;"
										></div>
									</div>
									<span class="text-right text-[12px] text-faint tabular-nums">{lang.pct}%</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if contributions && contributions.weeks.length}
					<div class="mt-8">
						<p class="mb-3 text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">
							Contributions
						</p>
						<ContributionChart calendar={contributions} />
					</div>
				{/if}
			</section>

			<!-- Projects -->
			{#if FEATURED_PROJECTS.length}
				<section class="border-b border-line py-8" style="animation: rise 0.7s ease 0.18s both;">
					<div class="mb-5 flex items-baseline justify-between gap-4">
						<p class="text-[13px] font-medium tracking-wide text-comment">// projects</p>
						<a
							href="/projects"
							class="text-[12px] font-semibold tracking-wide text-accent hover:opacity-70"
						>
							All projects
						</a>
					</div>

					<ul class="divide-y divide-line">
						{#each FEATURED_PROJECTS as project, i (project.name)}
							<li
								class="py-4 first:pt-0 last:pb-0"
								style="animation: rise 0.55s ease {0.2 + i * 0.05}s both;"
							>
								<div
									class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
								>
									<a
										href="/projects"
										class="text-[15px] font-semibold tracking-tight text-ink transition-colors hover:text-accent"
									>
										{project.name}
									</a>
									{#if project.year}
										<p class="shrink-0 text-[12px] font-medium text-faint tabular-nums">
											{project.year}
										</p>
									{/if}
								</div>

								<p class="mt-1 text-[13.5px] leading-relaxed text-muted">{project.summary}</p>

								{#if project.using.length}
									<ul class="mt-3 flex flex-wrap gap-x-3 gap-y-2">
										{#each project.using as item (item)}
											<li class="text-[12.5px] font-medium tracking-wide text-muted">
												<TechLogo name={item} size={14} />
											</li>
										{/each}
									</ul>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<!-- Public repos -->
			<section class="border-b border-line py-8" style="animation: rise 0.7s ease 0.2s both;">
				<p class="mb-5 text-[13px] font-medium tracking-wide text-comment">// public repos</p>

				{#if repos.length === 0}
					<p class="text-sm text-muted">No public repositories yet.</p>
				{:else}
					<ul class="divide-y divide-line">
						{#each repos as repo, i (repo.id)}
							{@const extra = extras(repo.name)}
							{@const homepage = homepageFor(repo)}
							{@const description = extra.description ?? repo.description}
							<li class="py-4" style="animation: rise 0.55s ease {0.22 + i * 0.05}s both;">
								<div
									class="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
								>
									<div class="min-w-0">
										<div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
											<a
												href={repo.html_url}
												target="_blank"
												rel="noreferrer"
												class="text-[15px] font-semibold tracking-tight text-ink transition-colors hover:text-accent"
											>
												{repo.name}
											</a>
											{#if repo.stargazers_count > 0}
												<span class="text-[12px] font-medium text-faint tabular-nums"
													>★ {repo.stargazers_count}</span
												>
											{/if}
										</div>
										{#if description}
											<p class="mt-1 text-[13.5px] leading-relaxed text-muted">
												{description}
											</p>
										{/if}
										{#if extra.using?.length}
											<ul class="mt-3 flex flex-wrap gap-x-3 gap-y-2">
												{#each extra.using as item (item)}
													<li class="text-[12.5px] font-medium tracking-wide text-muted">
														<TechLogo name={item} size={14} />
													</li>
												{/each}
											</ul>
										{/if}
									</div>
									<span class="shrink-0 text-[12px] font-medium text-faint tabular-nums">
										{formatDate(repo.pushed_at)}
									</span>
								</div>

								<ul
									class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] font-semibold tracking-wide"
								>
									<li>
										<a
											href={repo.html_url}
											target="_blank"
											rel="noreferrer"
											class="inline-flex items-center text-accent transition-opacity hover:opacity-70"
										>
											<TechLogo name="GitHub" size={13} />
										</a>
									</li>
									{#if extra.docs}
										<li>
											<a
												href={extra.docs}
												target="_blank"
												rel="noreferrer"
												class="text-accent transition-opacity hover:opacity-70"
											>
												Docs
											</a>
										</li>
									{/if}
									{#if homepage}
										<li>
											<a
												href={homepage}
												target="_blank"
												rel="noreferrer"
												class="text-accent transition-opacity hover:opacity-70"
											>
												Live
											</a>
										</li>
									{/if}
								</ul>
							</li>
						{/each}
					</ul>
				{/if}
			</section>

			<!-- Blog -->
			{#if posts.length}
				<section class="border-b border-line py-8" style="animation: rise 0.7s ease 0.24s both;">
					<div class="mb-5 flex items-baseline justify-between gap-4">
						<p class="text-[13px] font-medium tracking-wide text-comment">// blog</p>
						<a
							href="/blog"
							class="text-[12px] font-semibold tracking-wide text-accent hover:opacity-70"
						>
							All posts
						</a>
					</div>
					<ul class="divide-y divide-line">
						{#each posts as post (post.slug)}
							<li class="py-4 first:pt-0 last:pb-0">
								<a href="/blog/{post.slug}" class="group block">
									<div
										class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
									>
										<span
											class="text-[15px] font-semibold tracking-tight text-ink transition-colors group-hover:text-accent"
										>
											{post.title}
										</span>
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
										<p class="mt-1 text-[13.5px] leading-relaxed text-muted">
											{post.description}
										</p>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<footer class="border-t border-line pt-6">
				<p class="text-[12px] font-medium tracking-wide text-faint">
					<span class="text-comment">//</span> sourced live from the GitHub API ·
					<a
						href={user.html_url}
						class="transition-colors hover:text-accent"
						target="_blank"
						rel="noreferrer"
					>
						@{user.login}
					</a>
				</p>
			</footer>
		</article>
	</main>
{/if}

<style>
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes grow {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}
</style>
