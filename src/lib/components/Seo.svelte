<script lang="ts">
	import { page } from '$app/state';
	import { SITE } from '#lib/config';

	type Props = {
		title?: string;
		description?: string;
		type?: 'website' | 'article';
		image?: string;
	};

	let {
		title = `${SITE.title} - Portfolio`,
		description = `${SITE.title}. ${SITE.tagline}.`,
		type = 'website',
		image = '/social-card.png'
	}: Props = $props();

	const pageTitle = $derived(title.includes(SITE.title) ? title : `${title} - ${SITE.title}`);
	const canonicalUrl = $derived(new URL(page.url.pathname, SITE.website).href);
	const imageUrl = $derived(new URL(image, SITE.website).href);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:site_name" content={SITE.title} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:secure_url" content={imageUrl} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="{SITE.title} portfolio preview" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content="{SITE.title} portfolio preview" />
</svelte:head>
