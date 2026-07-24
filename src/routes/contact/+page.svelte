<script lang="ts">
	import TechLogo from '#lib/components/TechLogo.svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import { LINKS, SITE, SOCIAL_LINKS } from '#lib/config';

	type ContactForm = {
		status?: 'sent' | 'error';
		message?: string;
	};

	let { form }: { form?: ContactForm } = $props();

	const emailHref = `mailto:${SITE.email}`;
	const externalLinks = LINKS.filter((link) => !link.href.startsWith('mailto:'));
</script>

<svelte:head>
	<title>Contact — Siddhartha Khanal</title>
	<meta name="description" content="Contact Siddhartha Khanal." />
</svelte:head>

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

		<p class="mb-3 text-[13px] font-medium tracking-wide text-comment">// contact</p>
		<h1 class="text-[clamp(1.75rem,4vw,2.35rem)] leading-tight font-semibold tracking-[-0.03em]">
			Contact
		</h1>
		<p class="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
			For project work, collaboration, or technical questions, email is the best way to reach me.
		</p>
	</header>

	<section class="border-b border-line py-8">
		<div class="border border-line p-5">
			<div class="mb-5">
				<p class="mb-3 text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">
					Contact us
				</p>
				<h2 class="text-[18px] font-semibold tracking-tight text-ink">Send a quick message</h2>
				<p class="mt-2 max-w-prose text-[13.5px] leading-relaxed text-muted">
					This form uses ntfy.sh to deliver your message as a notification.
				</p>
			</div>

			<form class="space-y-4" method="POST">
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="block">
						<span class="mb-1.5 block text-[12px] font-semibold tracking-wide text-muted">Name</span
						>
						<input
							name="name"
							type="text"
							autocomplete="name"
							required
							class="w-full border-line bg-paper text-[14px] text-ink shadow-none transition-colors focus:border-accent focus:ring-accent"
						/>
					</label>
					<label class="block">
						<span class="mb-1.5 block text-[12px] font-semibold tracking-wide text-muted"
							>Email</span
						>
						<input
							name="email"
							type="email"
							autocomplete="email"
							required
							class="w-full border-line bg-paper text-[14px] text-ink shadow-none transition-colors focus:border-accent focus:ring-accent"
						/>
					</label>
				</div>

				<label class="block">
					<span class="mb-1.5 block text-[12px] font-semibold tracking-wide text-muted"
						>Message</span
					>
					<textarea
						name="message"
						rows="5"
						required
						class="w-full resize-y border-line bg-paper text-[14px] text-ink shadow-none transition-colors focus:border-accent focus:ring-accent"
					></textarea>
				</label>

				<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<p
						class="min-h-[1.25rem] text-[12.5px] font-medium"
						class:text-muted={!form?.status}
						class:text-comment={form?.status === 'sent'}
						class:text-kw={form?.status === 'error'}
					>
						{form?.message || 'Delivered privately through ntfy.sh.'}
					</p>
					<button
						type="submit"
						class="inline-flex items-center justify-center border border-accent px-4 py-2 text-[13px] font-semibold tracking-wide text-accent transition-colors hover:bg-accent hover:text-paper disabled:cursor-wait disabled:opacity-60"
					>
						Send message
					</button>
				</div>
			</form>
		</div>
	</section>

	<section class="border-b border-line py-8">
		<p class="mb-3 text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">Email</p>
		<a
			href={emailHref}
			class="inline-flex items-center text-[17px] font-semibold tracking-tight text-ink transition-colors hover:text-accent"
		>
			<TechLogo name="Email" size={17} showLabel={false} />
			<span class="ml-2">{SITE.email}</span>
		</a>
	</section>

	<section class="border-b border-line py-8">
		<p class="mb-3 text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">Resume</p>
		<a
			href="/resume.pdf"
			download="Siddhartha-Khanal-Resume.pdf"
			class="inline-flex items-center text-[17px] font-semibold tracking-tight text-ink transition-colors hover:text-accent"
		>
			<TechLogo name="CV" size={17} showLabel={false} />
			<span class="ml-2">Download CV</span>
		</a>
	</section>

	<section class="border-b border-line py-8">
		<p class="mb-4 text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">Profiles</p>
		<ul class="flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium tracking-wide text-muted">
			{#each SOCIAL_LINKS as link (link.href)}
				<li>
					<a
						href={link.href}
						class="inline-flex items-center transition-colors hover:text-accent"
						target="_blank"
						rel="noreferrer"
					>
						<TechLogo name={link.label} size={16} />
					</a>
				</li>
			{/each}
		</ul>
	</section>

	{#if externalLinks.length}
		<section class="border-b border-line py-8">
			<p class="mb-4 text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">Links</p>
			<ul class="flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium tracking-wide text-muted">
				{#each externalLinks as link (link.href)}
					<li>
						<a
							href={link.href}
							class="inline-flex items-center transition-colors hover:text-accent"
							target="_blank"
							rel="noreferrer"
						>
							<TechLogo name={link.label} size={16} />
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<footer class="pt-6">
		<a href="/blog" class="text-[13px] font-semibold tracking-wide text-accent hover:opacity-70">
			Read the blog
		</a>
	</footer>
</main>
