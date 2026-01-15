import { expect, test } from './fixtures';

test.describe('Home Page', () => {
	test('has expected title and metadata', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/머루집사/);
	});
});
