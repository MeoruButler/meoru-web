import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
	// TODO: 실제 도메인으로 변경 필요
	const site = 'https://meoru.dev';
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
