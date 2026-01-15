import { test, expect } from './fixtures';

test.describe('Spotify Component', () => {
	test('shows Now Playing state', async ({ page }) => {
		// Mock API response
		await page.route('/api/spotify/recent', async (route) => {
			await route.fulfill({ json: { count: 0 } });
		});

		await page.route('/api/spotify/now-playing', async (route) => {
			await route.fulfill({
				json: {
					isPlaying: true,
					title: 'Mock Song',
					artist: 'Mock Artist',
					album: 'Mock Album',
					albumImageUrl: 'https://placehold.co/600x400',
					songUrl: 'https://spotify.com'
				}
			});
		});

		await page.goto('/');
		// 기본 locale이 한국어이므로 '재생 중' 텍스트를 찾음
		await expect(page.getByText('재생 중')).toBeVisible();
		await expect(page.getByText('Mock Song')).toBeVisible();
		await expect(page.getByText('Mock Artist')).toBeVisible();
	});

	test('shows Recently Played state when not playing', async ({ page }) => {
		await page.route('/api/spotify/now-playing', async (route) => {
			await route.fulfill({ json: { isPlaying: false } });
		});

		await page.route('/api/spotify/recent', async (route) => {
			await route.fulfill({
				json: {
					title: 'Recent Song',
					artist: 'Recent Artist',
					album: 'Recent Album',
					albumImageUrl: 'https://placehold.co/600x400',
					songUrl: 'https://spotify.com'
				}
			});
		});

		await page.goto('/');
		// 기본 locale이 한국어이므로 '최근 재생' 텍스트를 찾음
		await expect(page.getByText('최근 재생')).toBeVisible();
		await expect(page.getByText('Recent Song')).toBeVisible();
	});
});
