<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
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
		isExplicit?: boolean;
	};

	let { class: className }: { class?: string } = $props();

	let spotifyData = $state<SpotifyData | null>(null);
	let loading = $state(true);
	let isOpen = $state(false);
	let isTransitioning = $state(false);

	// 재생 중일 때 5초, 일시정지 시 30초 간격
	const PLAYING_POLL_MS = 5_000;
	const PAUSED_POLL_MS = 30_000;
	let pollTimer: number | undefined;
	let abortController: AbortController | undefined;
	let previousSongUrl: string | undefined;

	async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
		const res = await fetch(url, { signal });
		return res.json();
	}

	function scheduleNextPoll() {
		if (pollTimer) window.clearInterval(pollTimer);
		const interval = spotifyData?.isPlaying ? PLAYING_POLL_MS : PAUSED_POLL_MS;
		pollTimer = window.setInterval(() => {
			if (document.visibilityState !== 'visible') return;
			void refresh();
		}, interval);
	}

	async function refresh() {
		abortController?.abort();
		abortController = new AbortController();

		try {
			const data = await fetchJson<SpotifyData>('/api/spotify/now-playing', abortController.signal);

			// 곡이 바뀌면 전환 애니메이션 트리거
			if (previousSongUrl && data?.songUrl !== previousSongUrl) {
				isTransitioning = true;
				setTimeout(() => {
					isTransitioning = false;
				}, 500);
			}
			previousSongUrl = data?.songUrl;

			spotifyData = data;
		} catch (e) {
			if ((e as Error)?.name !== 'AbortError') console.error(e);
		} finally {
			loading = false;
			scheduleNextPoll();
		}
	}

	function toggleOpen() {
		isOpen = !isOpen;
	}

	onMount(async () => {
		await refresh();
	});

	onDestroy(() => {
		if (pollTimer) window.clearInterval(pollTimer);
		abortController?.abort();
	});
</script>

<div class={cn('w-full max-w-lg overflow-visible p-4 select-none', className)}>
	{#if loading}
		<!-- 로딩 스켈레톤 -->
		<div class="relative flex items-center">
			<!-- LP Disc Skeleton -->
			<div
				class="absolute left-0 size-24 rounded-full border-4 border-neutral-800/50 bg-neutral-900/50 sm:size-32"
			></div>
			<!-- Album Sleeve Skeleton -->
			<div class="relative z-10 shrink-0">
				<div class="bg-muted size-24 animate-pulse rounded-lg sm:size-32"></div>
			</div>
			<!-- Track Info Skeleton -->
			<div class="ml-6 min-w-0 flex-1 space-y-2 pl-2 sm:ml-8">
				<div class="bg-muted h-4 w-24 animate-pulse rounded"></div>
				<div class="bg-muted h-5 w-32 animate-pulse rounded sm:w-40"></div>
				<div class="bg-muted h-4 w-24 animate-pulse rounded sm:w-32"></div>
			</div>
		</div>
	{:else if spotifyData?.title}
		<div class="group relative flex items-center">
			<!-- Vinyl Toggle Button -->
			<button
				type="button"
				class="relative z-10 shrink-0 cursor-pointer transition-transform duration-300 active:scale-95"
				onclick={toggleOpen}
				aria-label="Toggle vinyl player"
				aria-pressed={isOpen}
			>
				<!-- LP Disc -->
				<div
					class={cn(
						'absolute top-1/2 left-0 z-0 flex size-24 -translate-y-1/2 items-center justify-center rounded-full sm:size-32',
						'bg-linear-to-br from-neutral-800 via-neutral-900 to-black',
						'shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]',
						'transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
						isOpen ? 'translate-x-12 rotate-180 sm:translate-x-20' : 'translate-x-0 rotate-0',
						spotifyData.isPlaying && isOpen && 'animate-[spin_4s_linear_infinite]'
					)}
					aria-hidden="true"
				>
					<!-- Outer rim -->
					<div class="absolute inset-0 rounded-full border border-neutral-700/50"></div>
					<!-- Groove pattern -->
					<div class="absolute inset-[8%] rounded-full border border-neutral-700/30"></div>
					<div class="absolute inset-[16%] rounded-full border border-neutral-700/20"></div>
					<div class="absolute inset-[24%] rounded-full border border-neutral-700/30"></div>
					<div class="absolute inset-[32%] rounded-full border border-neutral-700/20"></div>
					<!-- Light reflection -->
					<div
						class="absolute inset-0 rounded-full bg-[conic-gradient(from_45deg,transparent_0deg,rgba(255,255,255,0.6)_30deg,transparent_90deg,transparent_180deg,rgba(255,255,255,0.3)_210deg,transparent_270deg)] opacity-20"
					></div>
					<!-- Center label area -->
					<div
						class="relative flex size-8 items-center justify-center rounded-full bg-linear-to-br from-neutral-700 via-neutral-800 to-neutral-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] sm:size-10"
					>
						<div
							class="absolute inset-0 rounded-full bg-linear-to-b from-white/10 to-transparent"
						></div>
						<div
							class="absolute top-1 size-0.5 rounded-full bg-neutral-500/60 sm:top-1.5 sm:size-1"
						></div>
						<div
							class="size-1.5 rounded-full bg-neutral-950 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:size-2"
						></div>
					</div>
				</div>

				<!-- Album Sleeve -->
				<div
					class={cn(
						'relative size-24 overflow-hidden rounded border border-neutral-200 bg-neutral-800 shadow-2xl sm:size-32 sm:rounded-lg dark:border-white/10',
						isTransitioning && 'animate-fade-in-scale'
					)}
				>
					<img
						src={spotifyData.albumImageUrl}
						alt={spotifyData.album}
						class="size-full object-cover"
					/>
				</div>
			</button>

			<!-- Track Info -->
			<div
				class={cn(
					'z-20 ml-6 flex min-w-0 flex-1 flex-col justify-center pl-2 sm:ml-8',
					isTransitioning && 'animate-fade-in-slide'
				)}
			>
				<div class="mb-1 flex items-center gap-1.5 whitespace-nowrap opacity-60">
					<!-- Spotify icon -->
					<svg
						class="size-6 shrink-0 text-[#1DB954]"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
						/>
					</svg>
					<span class="text-xs font-medium">
						{#if spotifyData.isPlaying}
							{m.spotify_now_playing()}
						{:else}
							{m.spotify_recently_played()}
						{/if}
					</span>
					{#if spotifyData.isPlaying}
						<span class="relative flex size-2">
							<span
								class="absolute inline-flex size-full animate-ping rounded-full bg-[#1DB954] opacity-75"
							></span>
							<span class="relative inline-flex size-2 rounded-full bg-[#1DB954]"></span>
						</span>
					{/if}
				</div>

				<a
					href={spotifyData.songUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="group/link transition-colors duration-300 hover:text-green-500"
				>
					<span class="flex items-center gap-1.5">
						<span class="truncate text-base leading-tight font-bold sm:text-lg">
							{spotifyData.title}
						</span>
						{#if spotifyData.isExplicit}
							<span
								class="inline-grid size-4 shrink-0 place-items-center rounded-full border border-red-600 bg-white pt-px text-[9px] leading-none font-bold text-red-600 dark:bg-red-600 dark:text-white"
								title="Explicit content"
								aria-label="Explicit content"
							>
								19
							</span>
						{/if}
					</span>
					<span class="text-muted-foreground mt-0.5 block truncate text-sm">
						{spotifyData.artist}
					</span>
				</a>
			</div>
		</div>
	{:else}
		<p class="text-muted-foreground text-sm sm:text-base">{m.spotify_not_playing()}</p>
	{/if}
</div>

<style>
	@keyframes fadeInScale {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes fadeInSlide {
		from {
			opacity: 0;
			transform: translateX(-8px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.animate-fade-in-scale {
		animation: fadeInScale 0.4s ease-out;
	}

	.animate-fade-in-slide {
		animation: fadeInSlide 0.4s ease-out;
	}
</style>
