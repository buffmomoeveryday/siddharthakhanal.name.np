<script lang="ts">
	import { downloadHarvardResume, type ResumePdfInput } from '#lib/resume-pdf';

	let {
		resume,
		class: className = ''
	}: {
		resume: ResumePdfInput;
		class?: string;
	} = $props();

	let busy = $state(false);

	function download() {
		if (busy) return;
		busy = true;
		try {
			downloadHarvardResume(resume);
		} finally {
			busy = false;
		}
	}
</script>

<button
	type="button"
	class="hover:text-accent transition-colors {className}"
	onclick={download}
	disabled={busy}
>
	{busy ? 'Generating…' : 'Download PDF'}
</button>
