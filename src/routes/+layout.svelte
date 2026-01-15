<script lang="ts">
	import '$styles/app.css';
	import { ModeWatcher, mode } from 'mode-watcher';
	import { Header } from '$lib/components/layout';

	let { children } = $props();

	// Theme colors matching app.css
	const themeColors = {
		light: 'hsl(0 0% 100%)', // --background in :root
		dark: 'hsl(222.2 84% 4.9%)' // --background in .dark
	} as const;

	const themeColor = $derived(mode.current === 'dark' ? themeColors.dark : themeColors.light);
</script>

<svelte:head>
	<meta name="theme-color" content={themeColor} />
</svelte:head>

<ModeWatcher />

<div class="flex min-h-dvh flex-col">
	<Header />
	<div class="flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
		<main class="w-full max-w-md">
			{@render children()}
		</main>
	</div>
</div>
