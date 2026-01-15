<script lang="ts">
	import '$styles/app.css';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
	<main class="w-full max-w-md">
		{@render children()}
	</main>
</div>
