<script lang="ts">
	import type { ContributionCalendar } from '#lib/server/github';

	let { calendar }: { calendar: ContributionCalendar } = $props();

	const months = $derived.by(() => {
		const labels: { label: string; index: number }[] = [];
		let last = '';
		calendar.weeks.forEach((week, index) => {
			const first = week.days[0];
			if (!first) return;
			const label = new Date(first.date + 'T00:00:00').toLocaleString('en-US', {
				month: 'short'
			});
			if (label !== last) {
				labels.push({ label, index });
				last = label;
			}
		});
		return labels;
	});
</script>

<div class="contrib">
	<div class="contrib-inner" style="--weeks: {calendar.weeks.length}">
		<div class="contrib-months" aria-hidden="true">
			{#each months as month (month.index + month.label)}
				<span style="grid-column: {month.index + 1}">{month.label}</span>
			{/each}
		</div>

		<div
			class="contrib-grid"
			role="img"
			aria-label="{calendar.total} contributions in the last year"
		>
			{#each calendar.weeks as week, wi (wi)}
				<div class="contrib-week">
					{#each week.days as day (day.date)}
						<span
							class="contrib-cell level-{day.level}"
							title="{day.count} contribution{day.count === 1 ? '' : 's'} on {day.date}"
						></span>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<div class="contrib-legend">
		<span class="text-faint text-[11px]">{calendar.total} contributions</span>
		<div class="flex items-center gap-1">
			<span class="text-faint text-[11px]">Less</span>
			{#each [0, 1, 2, 3, 4] as level (level)}
				<span class="contrib-cell level-{level}"></span>
			{/each}
			<span class="text-faint text-[11px]">More</span>
		</div>
	</div>
</div>

<style>
	.contrib {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.contrib-inner {
		width: 100%;
	}

	.contrib-months {
		display: grid;
		grid-template-columns: repeat(var(--weeks), minmax(0, 1fr));
		column-gap: 2px;
		margin-bottom: 0.35rem;
		height: 0.9rem;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--faint);
	}

	.contrib-months span {
		grid-row: 1;
		overflow: hidden;
		white-space: nowrap;
	}

	.contrib-grid {
		display: grid;
		grid-template-columns: repeat(var(--weeks), minmax(0, 1fr));
		gap: 2px;
		width: 100%;
	}

	.contrib-week {
		display: grid;
		grid-template-rows: repeat(7, 1fr);
		gap: 2px;
		aspect-ratio: 1 / 7;
	}

	.contrib-cell {
		display: block;
		width: 100%;
		aspect-ratio: 1;
		border-radius: 2px;
		background: var(--contrib-0);
	}

	.contrib-legend .contrib-cell {
		width: 11px;
		height: 11px;
		aspect-ratio: auto;
		flex-shrink: 0;
	}

	.level-0 {
		background: var(--contrib-0);
	}
	.level-1 {
		background: var(--contrib-1);
	}
	.level-2 {
		background: var(--contrib-2);
	}
	.level-3 {
		background: var(--contrib-3);
	}
	.level-4 {
		background: var(--contrib-4);
	}

	.contrib-legend {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}
</style>
