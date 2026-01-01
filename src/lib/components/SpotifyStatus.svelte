<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';

	// Define types for our data
	type SpotifyData = {
		isPlaying?: boolean;
		title?: string;
		artist?: string;
		album?: string;
		albumImageUrl?: string;
		songUrl?: string;
	};

	let { class: className } = $props<{ class?: string }>();

	let nowPlaying = $state<SpotifyData | null>(null);
	let recent = $state<SpotifyData | null>(null);
	let loading = $state(true);

	onMount(async () => {
		try {
			const [npRes, recentRes] = await Promise.all([
				fetch('/api/spotify/now-playing'),
				fetch('/api/spotify/recent')
			]);

			nowPlaying = await npRes.json();
			recent = await recentRes.json();
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});
</script>

<div
	class={cn(
		'bg-card text-card-foreground w-full max-w-sm space-y-4 rounded-xl border p-6 shadow',
		className
	)}
>
	<div class="mb-4 flex items-center gap-2">
		<!-- Spotify Icon -->
		<svg viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6 text-green-500">
			<path
				d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.308-1.758-8.796-.962-.335.077-.67-.133-.746-.467-.076-.335.132-.67.467-.746 3.808-.87 7.076-.496 9.712 1.115.293.18.386.563.206.857zm1.229-2.733c-.226.372-.713.49-1.084.264-2.7-1.66-6.812-2.15-9.996-1.178-.394.12-.816-.104-.937-.498-.12-.394.104-.816.498-.937 3.633-1.11 8.243-.565 11.255 1.264.37.227.49.714.264 1.085zm.14-2.859c-3.238-1.922-8.58-2.1-11.669-1.161-.44.135-.91-.115-1.045-.556-.134-.44.116-.91.556-1.046 3.553-1.08 9.475-.865 13.236 1.37.406.24.538.77.297 1.177-.24.406-.77.538-1.176.297z"
			/>
		</svg>
		<h3 class="leading-none font-semibold tracking-tight">Spotify</h3>
	</div>

	{#if loading}
		<div class="flex animate-pulse space-x-4">
			<div class="h-10 w-10 rounded-full bg-slate-200"></div>
			<div class="flex-1 space-y-6 py-1">
				<div class="h-2 rounded bg-slate-200"></div>
				<div class="space-y-3">
					<div class="grid grid-cols-3 gap-4">
						<div class="col-span-2 h-2 rounded bg-slate-200"></div>
						<div class="col-span-1 h-2 rounded bg-slate-200"></div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Now Playing -->
		{#if nowPlaying && nowPlaying.isPlaying}
			<div class="flex items-center gap-4">
				<img
					src={nowPlaying.albumImageUrl}
					alt={nowPlaying.album}
					class="animate-spin-slow h-16 w-16 rounded-md shadow-md"
					style="animation-duration: 10s;"
				/>
				<div class="flex min-w-0 flex-col">
					<p class="mb-1 text-xs font-medium tracking-wider text-green-500 uppercase">
						Now Playing
					</p>
					<a
						href={nowPlaying.songUrl}
						target="_blank"
						class="truncate text-sm font-semibold hover:underline">{nowPlaying.title}</a
					>
					<p class="text-muted-foreground truncate text-xs">{nowPlaying.artist}</p>
				</div>
			</div>
		{/if}

		<!-- Recently Played (If not playing or just to show history) -->
		{#if recent && (!nowPlaying || !nowPlaying.isPlaying)}
			<div class="flex items-center gap-4">
				{#if recent.albumImageUrl}
					<img
						src={recent.albumImageUrl}
						alt={recent.album}
						class="h-16 w-16 rounded-md shadow-md grayscale transition-all hover:grayscale-0"
					/>
				{/if}
				<div class="flex min-w-0 flex-col">
					<p class="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
						Recently Played
					</p>
					<a
						href={recent.songUrl}
						target="_blank"
						class="truncate text-sm font-semibold hover:underline">{recent.title}</a
					>
					<p class="text-muted-foreground truncate text-xs">{recent.artist}</p>
				</div>
			</div>
		{/if}

		{#if !nowPlaying?.isPlaying && !recent?.title}
			<p class="text-muted-foreground text-sm">Not playing anything right now.</p>
		{/if}
	{/if}
</div>
