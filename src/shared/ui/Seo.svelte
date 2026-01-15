<script lang="ts">
	type Props = {
		title?: string;
		description?: string;
		image?: string;
		url?: string;
	};

	const defaults = {
		siteName: '머루집사',
		title: '머루집사',
		siteUrl: 'https://meoru-web.vercel.app'
	};

	let { title, description, image, url }: Props = $props();

	const pageTitle = $derived(title ? `${title} | ${defaults.siteName}` : defaults.title);
	const pageUrl = $derived(url ? `${defaults.siteUrl}${url}` : defaults.siteUrl);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<link rel="canonical" href={pageUrl} />
	{#if description}
		<meta name="description" content={description} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={defaults.siteName} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:url" content={pageUrl} />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	{#if image}
		<meta property="og:image" content={image} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	{#if description}
		<meta name="twitter:description" content={description} />
	{/if}
	{#if image}
		<meta name="twitter:image" content={image} />
	{/if}
</svelte:head>
