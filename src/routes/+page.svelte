<script lang="ts">
	import TechLogo from '#lib/components/TechLogo.svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import ContributionChart from '#lib/components/ContributionChart.svelte';
	import DownloadPdfButton from '#lib/components/DownloadPdfButton.svelte';
	import { EXPERIENCE, LINKS, PROJECTS, SITE, USING } from '#lib/config';
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

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short'
		});
	}

	function cleanUrl(url: string) {
		return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
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

	const resumeInput = $derived(
		user
			? {
					name: displayName(user),
					location: user.location,
					company: user.company,
					githubUrl: user.html_url,
					email: SITE.email,
					// website: SITE.website,
					repos: repos.map((r) => ({
						name: r.name,
						description: r.description,
						html_url: r.html_url,
						language: r.language,
						stargazers_count: r.stargazers_count
					}))
				}
			: null
	);
</script>

{#if data.error || !user || !stats}
	<main class="mx-auto flex min-h-dvh max-w-2xl items-center px-6 py-16">
		<div class="w-full">
			<p class="text-comment mb-2 text-sm font-medium tracking-wide">// error</p>
			<h1 class="text-2xl font-semibold tracking-tight">Could not load portfolio</h1>
			<p class="text-muted mt-3 text-sm leading-relaxed">{data.error ?? 'Unknown error'}</p>
		</div>
	</main>
{:else}
	<main class="mx-auto min-h-dvh w-full max-w-[720px] px-5 py-10 sm:px-8 sm:py-16">
		<article style="animation: rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;">
			<!-- Header -->
			<header class="border-line border-b pb-8">
				<div class="mb-6 flex items-start justify-between gap-4">
					<div class="min-w-0">
						<h1
							class="text-[clamp(1.75rem,4vw,2.35rem)] leading-tight font-semibold tracking-[-0.03em]"
						>
							{displayName(user)}
						</h1>
						{#if user.company || user.location}
							<p class="text-muted mt-2 text-sm font-medium tracking-wide">
								{#if user.company}
									{user.company.trim()}
								{/if}
								{#if user.company && user.location}
									<span class="text-faint mx-2">·</span>
								{/if}
								{#if user.location}
									{user.location}
								{/if}
							</p>
						{/if}
						{#if user.bio}
							<p class="text-muted mt-3 max-w-md text-[15px] leading-relaxed">{user.bio}</p>
						{/if}
					</div>

					<div class="flex shrink-0 flex-col items-end gap-4">
						<ThemeToggle />
						<img
							src={user.avatar_url}
							alt=""
							width="72"
							height="72"
							class="border-line size-[72px] border object-cover grayscale-[15%] dark:grayscale-[25%]"
							style="animation: fade 0.9s ease 0.15s both;"
						/>
					</div>
				</div>

				<ul
					class="text-muted flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium tracking-wide"
				>
					<li>
						<a href="/blog" class="hover:text-accent transition-colors">Blog</a>
					</li>
					<!-- <li>
						{#if resumeInput}
							<DownloadPdfButton resume={resumeInput} />
						{/if}
					</li> -->
					<li>
						<a
							href={user.html_url}
							class="hover:text-accent transition-colors"
							target="_blank"
							rel="noreferrer"
						>
							GitHub
						</a>
					</li>
					{#each LINKS as link (link.href)}
						<li>
							<a
								href={link.href}
								class="hover:text-accent transition-colors"
								target={link.href.startsWith('mailto:') ? undefined : '_blank'}
								rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
							>
								{link.label}
							</a>
						</li>
					{/each}
					{#if user.blog && !LINKS.some((l) => l.href.includes(cleanUrl(user.blog)))}
						<li>
							<a
								href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
								class="hover:text-accent transition-colors"
								target="_blank"
								rel="noreferrer"
							>
								{cleanUrl(user.blog)}
							</a>
						</li>
					{/if}
				</ul>
			</header>

			<!-- Experience -->
			{#if EXPERIENCE.length}
				<section class="border-line border-b py-8" style="animation: rise 0.7s ease 0.06s both;">
					<p class="text-comment mb-5 text-[13px] font-medium tracking-wide">// experience</p>
					<ul class="divide-line divide-y">
						{#each EXPERIENCE as job, i (job.company + job.role + job.start)}
							<li class="py-4 first:pt-0 last:pb-0" style="animation: rise 0.55s ease {0.08 + i * 0.05}s both;">
								<div
									class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
								>
									<div class="min-w-0">
										<p class="text-ink text-[15px] font-semibold tracking-tight">
											{job.role}
										</p>
										<p class="text-muted mt-0.5 text-[13.5px] font-medium tracking-wide">
											{#if job.url}
												<a
													href={job.url}
													target="_blank"
													rel="noreferrer"
													class="hover:text-accent transition-colors"
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
									<p class="text-faint shrink-0 text-[12px] font-medium tabular-nums tracking-wide">
										{job.start}
										<span class="text-faint/80"> — </span>
										{job.end ?? 'Present'}
									</p>
								</div>
								<p class="text-muted mt-2.5 max-w-prose text-[13.5px] leading-relaxed">
									{job.summary}
								</p>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<!-- Using -->
			{#if USING.length}
				<section class="border-line border-b py-8" style="animation: rise 0.7s ease 0.08s both;">
					<p class="text-comment mb-5 text-[13px] font-medium tracking-wide">// using</p>
					<ul class="flex flex-wrap gap-x-4 gap-y-3">
						{#each USING as item (item)}
							<li class="text-ink text-[13.5px] font-medium tracking-wide">
								<TechLogo name={item} size={18} />
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<!-- Stats -->
			<section class="border-line border-b py-8" style="animation: rise 0.7s ease 0.12s both;">
				<p class="text-comment mb-5 text-[13px] font-medium tracking-wide">// github.stats</p>

				<div class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
					{#each [
						{ label: 'repos', value: stats.ownedRepos },
						{ label: 'stars', value: stats.totalStars },
						{ label: 'followers', value: user.followers },
						{ label: 'years', value: stats.yearsActive }
					] as item (item.label)}
						<div>
							<p
								class="text-[1.65rem] leading-none font-semibold tracking-tight tabular-nums"
							>
								{item.value}
							</p>
							<p class="text-faint mt-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase">
								{item.label}
							</p>
						</div>
					{/each}
				</div>

				{#if stats.languages.length}
					<div class="mt-8">
						<p class="text-muted mb-3 text-[12px] font-semibold tracking-[0.12em] uppercase">
							Languages
						</p>
						<ul class="space-y-2.5">
							{#each stats.languages as lang, i (lang.name)}
								<li
									class="grid grid-cols-[8.5rem_1fr_2.5rem] items-center gap-3 sm:grid-cols-[10rem_1fr_2.5rem]"
									style="animation: rise 0.5s ease {0.18 + i * 0.04}s both;"
								>
									<span class="text-ink truncate text-[13px] font-medium">
										<TechLogo name={lang.name} size={15} />
									</span>
									<div class="bg-line/70 h-[3px] overflow-hidden">
										<div
											class="bg-accent h-full origin-left"
											style="width: {lang.pct}%; animation: grow 0.8s cubic-bezier(0.22,1,0.36,1) {0.25 +
												i * 0.05}s both;"
										></div>
									</div>
									<span class="text-faint text-right text-[12px] tabular-nums">{lang.pct}%</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if contributions && contributions.weeks.length}
				<div class="mt-8">
					<p class="text-muted mb-3 text-[12px] font-semibold tracking-[0.12em] uppercase">
						Contributions
					</p>
					<ContributionChart calendar={contributions} />
				</div>
			{/if}
			</section>

			<!-- Projects -->
			<section class="border-line border-b py-8" style="animation: rise 0.7s ease 0.2s both;">
				<p class="text-comment mb-5 text-[13px] font-medium tracking-wide">// projects</p>

				{#if repos.length === 0}
					<p class="text-muted text-sm">No public repositories yet.</p>
				{:else}
					<ul class="divide-line divide-y">
						{#each repos as repo, i (repo.id)}
							{@const extra = extras(repo.name)}
							{@const homepage = homepageFor(repo)}
							{@const description = extra.description ?? repo.description}
							<li class="py-4" style="animation: rise 0.55s ease {0.22 + i * 0.05}s both;">
								<div class="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
									<div class="min-w-0">
										<div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
											<a
												href={repo.html_url}
												target="_blank"
												rel="noreferrer"
												class="text-ink hover:text-accent text-[15px] font-semibold tracking-tight transition-colors"
											>
												{repo.name}
											</a>
											{#if repo.stargazers_count > 0}
												<span class="text-faint text-[12px] font-medium tabular-nums"
													>★ {repo.stargazers_count}</span
												>
											{/if}
										</div>
										{#if description}
											<p class="text-muted mt-1 text-[13.5px] leading-relaxed">
												{description}
											</p>
										{/if}
									</div>
									<span class="text-faint shrink-0 text-[12px] font-medium tabular-nums">
										{formatDate(repo.pushed_at)}
									</span>
								</div>

								<ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] font-semibold tracking-wide">
									<li>
										<a
											href={repo.html_url}
											target="_blank"
											rel="noreferrer"
											class="text-accent hover:opacity-70 transition-opacity"
										>
											GitHub
										</a>
									</li>
									{#if extra.docs}
										<li>
											<a
												href={extra.docs}
												target="_blank"
												rel="noreferrer"
												class="text-accent hover:opacity-70 transition-opacity"
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
												class="text-accent hover:opacity-70 transition-opacity"
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
				<section class="border-line border-b py-8" style="animation: rise 0.7s ease 0.24s both;">
					<div class="mb-5 flex items-baseline justify-between gap-4">
						<p class="text-comment text-[13px] font-medium tracking-wide">// blog</p>
						<a
							href="/blog"
							class="text-accent text-[12px] font-semibold tracking-wide hover:opacity-70"
						>
							All posts
						</a>
					</div>
					<ul class="divide-line divide-y">
						{#each posts as post (post.slug)}
							<li class="py-4 first:pt-0 last:pb-0">
								<a href="/blog/{post.slug}" class="group block">
									<div
										class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
									>
										<span
											class="text-ink group-hover:text-accent text-[15px] font-semibold tracking-tight transition-colors"
										>
											{post.title}
										</span>
										<time
											class="text-faint shrink-0 text-[12px] font-medium tabular-nums"
											datetime={post.date}
										>
											{formatDate(post.date)}
										</time>
									</div>
									{#if post.description}
										<p class="text-muted mt-1 text-[13.5px] leading-relaxed">
											{post.description}
										</p>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<footer class="border-line border-t pt-6">
				<p class="text-faint text-[12px] font-medium tracking-wide">
					<span class="text-comment">//</span> sourced live from the GitHub API ·
					<a
						href={user.html_url}
						class="hover:text-accent transition-colors"
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
