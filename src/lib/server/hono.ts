import { Hono } from 'hono';

export const app = new Hono().basePath('/api');

app.get('/health', (c) => {
	return c.json({
		status: 'ok',
		uptime: process.uptime(),
		timestamp: Date.now()
	});
});

app.get('/hello', (c) => {
	return c.json({
		message: 'Hello from Hono!'
	});
});

// Add more routes or middleware here
