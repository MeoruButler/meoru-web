import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';
import { getNowPlaying, getRecentlyPlayed } from './spotify';

// Mock env is handled by alias in vitest.config.ts

describe('Spotify Service', () => {
	let fetchSpy: MockInstance;

	beforeEach(() => {
		fetchSpy = vi.spyOn(global, 'fetch');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('getNowPlaying fetches token and then data', async () => {
		// Mock Token Response
		fetchSpy.mockResolvedValueOnce({
			json: async () => ({ access_token: 'mock_access_token' })
		} as Response);

		// Mock API Response
		fetchSpy.mockResolvedValueOnce({
			status: 200,
			json: async () => ({ is_playing: true })
		} as Response);

		const res = await getNowPlaying();
		const json = await res.json();

		expect(json).toEqual({ is_playing: true });

		// Check calls
		expect(fetchSpy).toHaveBeenCalledTimes(2);
		expect(fetchSpy).toHaveBeenNthCalledWith(
			1,
			'https://accounts.spotify.com/api/token',
			expect.any(Object)
		);
		expect(fetchSpy).toHaveBeenNthCalledWith(
			2,
			'https://api.spotify.com/v1/me/player/currently-playing',
			expect.objectContaining({
				headers: { Authorization: 'Bearer mock_access_token' }
			})
		);
	});

	it('getRecentlyPlayed fetches token and then data', async () => {
		// Mock Token Response
		fetchSpy.mockResolvedValueOnce({
			json: async () => ({ access_token: 'mock_access_token' })
		} as Response);

		// Mock API Response
		fetchSpy.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ items: [] })
		} as Response);

		const res = await getRecentlyPlayed();
		const json = await res.json();

		expect(json).toEqual({ items: [] });
		expect(fetchSpy).toHaveBeenNthCalledWith(
			2,
			'https://api.spotify.com/v1/me/player/recently-played?limit=1',
			expect.objectContaining({
				headers: { Authorization: 'Bearer mock_access_token' }
			})
		);
	});

	it('getNowPlaying throws on error', async () => {
		fetchSpy.mockImplementation(() => {
			throw new Error('Fetch failed');
		});
		await expect(getNowPlaying()).rejects.toThrow('Failed to fetch now playing');
	});

	it('getRecentlyPlayed throws on error', async () => {
		fetchSpy.mockImplementation(() => {
			throw new Error('Fetch failed');
		});
		await expect(getRecentlyPlayed()).rejects.toThrow('Failed to fetch recently playing');
	});
});
