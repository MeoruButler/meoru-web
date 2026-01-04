<script lang="ts">
	import SpotifyStatus from '$lib/components/SpotifyStatus.svelte';
</script>

<svelte:head>
	<title>Hono + SvelteKit Starter</title>
	<meta name="description" content="Hono + SvelteKit starter app" />
</svelte:head>

<section class="w-full py-12 md:py-24 lg:py-32">
	<div class="flex flex-col items-center justify-center space-y-4 px-4 md:px-6">
		<div class="mt-6 w-full max-w-md">
			<SpotifyStatus />
		</div>
	</div>
</section>
