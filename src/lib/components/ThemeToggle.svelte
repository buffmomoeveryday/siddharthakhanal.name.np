<script lang="ts">
	import { onMount } from 'svelte';
	import {
		applyTheme,
		cyclePreference,
		getStoredPreference,
		themeLabel,
		type ThemePreference
	} from '#lib/theme';

	let preference = $state<ThemePreference>('system');

	onMount(() => {
		preference = getStoredPreference();
		applyTheme(preference);

		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const onChange = () => {
			if (preference === 'system') applyTheme('system');
		};
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	function toggle() {
		preference = cyclePreference(preference);
	}
</script>

<button
	type="button"
	class="text-muted hover:text-accent border-line inline-flex items-center gap-2 border px-2.5 py-1.5 text-[12px] font-semibold tracking-wide transition-colors"
	onclick={toggle}
	aria-label="Theme: {themeLabel(preference)}. Click to cycle system, light, and dark."
	title="Theme: {themeLabel(preference)}"
>
	{#if preference === 'system'}
		<svg class="size-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" stroke-width="1.75" />
			<path d="M8 20h8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
			<path d="M12 16v4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
		</svg>
	{:else if preference === 'light'}
		<svg class="size-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.75" />
			<path
				d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
			/>
		</svg>
	{:else}
		<svg class="size-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M20 14.5A7.5 7.5 0 0 1 9.5 4 7.5 7.5 0 1 0 20 14.5Z"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
	<span>{themeLabel(preference)}</span>
</button>
