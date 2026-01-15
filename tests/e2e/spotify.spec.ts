import { test, expect } from './fixtures';

test.describe('Spotify Component', () => {
	test('shows Now Playing state', async ({ page }) => {
		// SpotifyStatus 컴포넌트는 /api/spotify/now-playing만 호출함
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
		// 로딩 완료 후 텍스트가 표시될 때까지 대기
		await expect(page.getByText('Mock Song')).toBeVisible({ timeout: 10000 });
		// 브라우저 기본 locale이 영어이므로 영어 텍스트 확인
		await expect(page.getByText('Now Playing')).toBeVisible();
		await expect(page.getByText('Mock Artist')).toBeVisible();
	});

	test('shows Recently Played state when not playing', async ({ page }) => {
		// isPlaying: false일 때도 title이 있으면 최근 재생으로 표시됨
		await page.route('/api/spotify/now-playing', async (route) => {
			await route.fulfill({
				json: {
					isPlaying: false,
					title: 'Recent Song',
					artist: 'Recent Artist',
					album: 'Recent Album',
					albumImageUrl: 'https://placehold.co/600x400',
					songUrl: 'https://spotify.com'
				}
			});
		});

		await page.goto('/');
		// 로딩 완료 후 텍스트가 표시될 때까지 대기
		await expect(page.getByText('Recent Song')).toBeVisible({ timeout: 10000 });
		// 브라우저 기본 locale이 영어이므로 영어 텍스트 확인
		await expect(page.getByText('Recently Played')).toBeVisible();
	});
});
