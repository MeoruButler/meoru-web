import type { RequestHandler } from '@sveltejs/kit';
import { app } from '$shared/api';

export const fallback: RequestHandler = ({ request }) => app.fetch(request);
