<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		title?: string;
		description?: string;
		image?: string;
		url?: string;
	};

	const siteUrl = 'https://meoru-web.vercel.app';

	let { title, description, image, url }: Props = $props();

	const siteName = $derived(m.seo_site_name());
	const defaultDescription = $derived(m.seo_default_description());
	const pageTitle = $derived(title ? `${title} | ${siteName}` : siteName);
	const pageDescription = $derived(description || defaultDescription);
	const pageUrl = $derived(url ? `${siteUrl}${url}` : siteUrl);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<link rel="canonical" href={pageUrl} />
	<meta name="description" content={pageDescription} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:description" content={pageDescription} />
	{#if image}
		<meta property="og:image" content={image} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	{#if image}
		<meta name="twitter:image" content={image} />
	{/if}
</svelte:head>
