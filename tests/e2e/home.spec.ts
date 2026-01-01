import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
	test('has expected title and metadata', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/Hono \+ SvelteKit/);
	});

	test('renders API response correctly', async ({ page }) => {
		await page.goto('/');

		// Wait for the hydration and API fetch to complete
		const heading = page.locator('h1');

		// Initially might be loading or empty, but eventually should show the message
		await expect(heading).toContainText(/Hello from Hono!/);

		// Check for the code block containing the JSON response
		const codeBlock = page.locator('pre');
		await expect(codeBlock).toContainText('"message": "Hello from Hono!"');
	});

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
