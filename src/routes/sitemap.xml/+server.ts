import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
	const site = 'https://meoru-web.vercel.app';
	const pages = [''];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map((page) => `<url><loc>${site}/${page}</loc></url>`).join('\n  ')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
