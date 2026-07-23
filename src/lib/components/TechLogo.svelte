<script lang="ts">
	import { logoUrl } from '#lib/logos';

	let {
		name,
		size = 16,
		showLabel = true,
		class: className = ''
	}: {
		name: string;
		size?: number;
		showLabel?: boolean;
		class?: string;
	} = $props();

	const src = $derived(logoUrl(name));
</script>

<span class="inline-flex items-center gap-1.5 {className}" title={name}>
	{#if src}
		<img
			{src}
			alt=""
			width={size}
			height={size}
			class="shrink-0 object-contain"
			style="width: {size}px; height: {size}px;"
			loading="lazy"
			decoding="async"
		/>
	{/if}
	{#if showLabel}
		<span>{name}</span>
	{/if}
</span>
