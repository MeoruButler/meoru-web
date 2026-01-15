<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';
	import * as m from '$lib/paraglide/messages.js';

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

	// Spotify 디자인 가이드라인에 따른 아트워크 corner radius
	// Small & medium devices: 4px, Large devices: 8px
	const artworkClasses = 'rounded-[4px] sm:rounded-lg';
</script>

<div
	class={cn(
		'bg-card text-card-foreground w-full space-y-5 rounded-2xl border p-5 shadow-lg sm:max-w-md sm:p-7',
		className
	)}
>
	<!-- Header with Spotify branding -->
	<div class="flex items-center gap-3">
		<!-- Spotify Icon - 가이드라인에 따라 그린 컬러 유지 -->
		<svg viewBox="0 0 24 24" fill="currentColor" class="h-7 w-7 text-[#1DB954] sm:h-8 sm:w-8">
			<path
				d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.308-1.758-8.796-.962-.335.077-.67-.133-.746-.467-.076-.335.132-.67.467-.746 3.808-.87 7.076-.496 9.712 1.115.293.18.386.563.206.857zm1.229-2.733c-.226.372-.713.49-1.084.264-2.7-1.66-6.812-2.15-9.996-1.178-.394.12-.816-.104-.937-.498-.12-.394.104-.816.498-.937 3.633-1.11 8.243-.565 11.255 1.264.37.227.49.714.264 1.085zm.14-2.859c-3.238-1.922-8.58-2.1-11.669-1.161-.44.135-.91-.115-1.045-.556-.134-.44.116-.91.556-1.046 3.553-1.08 9.475-.865 13.236 1.37.406.24.538.77.297 1.177-.24.406-.77.538-1.176.297z"
			/>
		</svg>
		<h3 class="text-base leading-none font-semibold tracking-tight sm:text-lg">Spotify</h3>
	</div>

	{#if loading}
		<!-- 로딩 스켈레톤 - 크기 확대 -->
		<div class="flex animate-pulse items-center gap-4">
			<div class="bg-muted h-20 w-20 rounded-[4px] sm:h-24 sm:w-24 sm:rounded-lg"></div>
			<div class="flex-1 space-y-3">
				<div class="bg-muted h-3 w-24 rounded"></div>
				<div class="bg-muted h-4 w-full rounded"></div>
				<div class="bg-muted h-3 w-2/3 rounded"></div>
			</div>
		</div>
	{:else}
		<!-- Now Playing -->
		{#if nowPlaying && nowPlaying.isPlaying}
			<div class="flex items-center gap-4 sm:gap-5">
				<!-- 가이드라인: 아트워크는 원본 형태 유지, 애니메이션/왜곡 금지 -->
				<a
					href={nowPlaying.songUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="group relative shrink-0"
				>
					<img
						src={nowPlaying.albumImageUrl}
						alt={nowPlaying.album}
						class={cn(
							'h-20 w-20 shadow-lg transition-shadow group-hover:shadow-xl sm:h-24 sm:w-24',
							artworkClasses
						)}
					/>
					<!-- 재생 중 표시 애니메이션 - 아트워크 외부에 배치 -->
					<div class="absolute -right-1 -bottom-1 flex items-center gap-0.5">
						<span class="h-2.5 w-0.5 animate-pulse rounded-full bg-[#1DB954]"></span>
						<span
							class="h-3.5 w-0.5 animate-pulse rounded-full bg-[#1DB954]"
							style="animation-delay: 0.2s"
						></span>
						<span
							class="h-2 w-0.5 animate-pulse rounded-full bg-[#1DB954]"
							style="animation-delay: 0.4s"
						></span>
					</div>
				</a>
				<div class="flex min-w-0 flex-1 flex-col gap-1">
					<p class="text-xs font-semibold tracking-wider text-[#1DB954] uppercase sm:text-sm">
						{m.spotify_now_playing()}
					</p>
					<a
						href={nowPlaying.songUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="truncate text-base font-bold hover:underline sm:text-lg"
					>
						{nowPlaying.title}
					</a>
					<p class="text-muted-foreground truncate text-sm sm:text-base">{nowPlaying.artist}</p>
				</div>
			</div>
		{/if}

		<!-- Recently Played (재생 중이 아닐 때) -->
		{#if recent && (!nowPlaying || !nowPlaying.isPlaying)}
			<div class="flex items-center gap-4 sm:gap-5">
				{#if recent.albumImageUrl}
					<!-- 가이드라인 준수: grayscale 제거, 아트워크 원본 유지 -->
					<a href={recent.songUrl} target="_blank" rel="noopener noreferrer" class="group shrink-0">
						<img
							src={recent.albumImageUrl}
							alt={recent.album}
							class={cn(
								'h-20 w-20 shadow-lg transition-shadow group-hover:shadow-xl sm:h-24 sm:w-24',
								artworkClasses
							)}
						/>
					</a>
				{/if}
				<div class="flex min-w-0 flex-1 flex-col gap-1">
					<p
						class="text-muted-foreground text-xs font-semibold tracking-wider uppercase sm:text-sm"
					>
						{m.spotify_recently_played()}
					</p>
					<a
						href={recent.songUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="truncate text-base font-bold hover:underline sm:text-lg"
					>
						{recent.title}
					</a>
					<p class="text-muted-foreground truncate text-sm sm:text-base">{recent.artist}</p>
				</div>
			</div>
		{/if}

		{#if !nowPlaying?.isPlaying && !recent?.title}
			<p class="text-muted-foreground text-sm sm:text-base">{m.spotify_not_playing()}</p>
		{/if}
	{/if}
</div>
