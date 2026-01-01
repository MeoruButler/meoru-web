import type { RequestHandler } from '@sveltejs/kit';
import { app } from '$lib/server/hono';

export const fallback: RequestHandler = ({ request }) => app.fetch(request);
