<script lang="ts">
	import '$styles/app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Header } from '$lib/components/layout';
	import { dev } from '$app/environment';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectSpeedInsights();
	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();

	// Theme colors matching app.css - using HSL values converted to hex
	const themeColors = {
		light: '#ffffff', // --background in :root (hsl(0 0% 100%))
		dark: '#020817' // --background in .dark (hsl(222.2 84% 4.9%))
	} as const;
</script>

<ModeWatcher defaultMode="system" {themeColors} />

<div class="flex min-h-dvh flex-col">
	<Header />
	<div class="flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
		<main class="w-full max-w-lg">
			{@render children()}
		</main>
	</div>
</div>
