<script lang="ts">
	import { Seo } from '$shared/ui';
	import { SpotifyStatus } from '$widgets/spotify-status';
</script>

<Seo />

<section class="w-full py-8 sm:py-12 md:py-24">
	<div class="flex flex-col items-center justify-center space-y-4">
		<SpotifyStatus />
	</div>
</section>
