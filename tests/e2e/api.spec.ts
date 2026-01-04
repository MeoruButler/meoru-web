import { expect, test } from './fixtures';

test.describe('API Endpoints', () => {
	test('API health check endpoint works', async ({ request }) => {
		const response = await request.get('/api/health');
		expect(response.ok()).toBeTruthy();
		const json = await response.json();
		expect(json).toEqual(
			expect.objectContaining({
				status: 'ok',
				uptime: expect.any(Number),
				timestamp: expect.any(Number)
			})
		);
	});
});
