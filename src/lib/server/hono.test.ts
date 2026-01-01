import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from './hono';

// Mock the spotify module (Note: we need to use a different approach to mock imports in Hono context if not using dependency injection,
// but since we are importing './spotify' dynamically inside route handlers, we can mock the module)

// However, since we are testing the 'app' which imports 'hono', and the handlers import 'spotify',
// correct mocking depends on how we run the test.
// For simplicity, we will assume standard Vitest module mocking.

vi.mock('./spotify', () => ({
	getNowPlaying: vi.fn(),
	getRecentlyPlayed: vi.fn()
}));

vi.mock('$env/static/private', () => ({
	SPOTIFY_CLIENT_ID: 'mock_client_id',
	SPOTIFY_CLIENT_SECRET: 'mock_client_secret',
	SPOTIFY_REFRESH_TOKEN: 'mock_refresh_token'
}));

import * as spotify from './spotify';

describe('Hono Spotify Endpoints', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('GET /api/health returns status ok', async () => {
		const res = await app.request('/api/health');
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json).toMatchObject({ status: 'ok' });
		expect(json.uptime).toBeDefined();
	});

	it('GET /api/hello returns hello message', async () => {
		const res = await app.request('/api/hello');
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ message: 'Hello from Hono!' });
	});

	it('GET /api/spotify/now-playing returns 204/isPlaying false if nothing playing', async () => {
		vi.mocked(spotify.getNowPlaying).mockResolvedValue({ status: 204 } as Response);

		const res = await app.request('/api/spotify/now-playing');
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json).toEqual({ isPlaying: false });
	});

	it('GET /api/spotify/now-playing handles null item in response', async () => {
		vi.mocked(spotify.getNowPlaying).mockResolvedValue({
			status: 200,
			json: async () => ({ is_playing: true, item: null })
		} as Response);

		const res = await app.request('/api/spotify/now-playing');
		expect(await res.json()).toEqual({ isPlaying: false });
	});

	it('GET /api/spotify/now-playing handles exception gracefully', async () => {
		vi.mocked(spotify.getNowPlaying).mockRejectedValue(new Error('API Error'));
		const res = await app.request('/api/spotify/now-playing');
		expect(await res.json()).toEqual({ isPlaying: false });
	});

	it('GET /api/spotify/now-playing returns track info when playing', async () => {
		const mockSong = {
			is_playing: true,
			item: {
				name: 'Test Song',
				artists: [{ name: 'Test Artist' }],
				album: { name: 'Test Album', images: [{ url: 'http://image.url' }] },
				external_urls: { spotify: 'http://spotify.url' }
			}
		};

		vi.mocked(spotify.getNowPlaying).mockResolvedValue({
			status: 200,
			json: async () => mockSong
		} as Response);

		const res = await app.request('/api/spotify/now-playing');
		const json = await res.json();

		expect(json).toEqual({
			isPlaying: true,
			title: 'Test Song',
			artist: 'Test Artist',
			album: 'Test Album',
			albumImageUrl: 'http://image.url',
			songUrl: 'http://spotify.url'
		});
	});

	it('GET /api/spotify/recent returns count 0 if no recent tracks', async () => {
		vi.mocked(spotify.getRecentlyPlayed).mockResolvedValue({
			ok: true,
			json: async () => ({ items: [] })
		} as Response);

		const res = await app.request('/api/spotify/recent');
		const json = await res.json();
		expect(json).toEqual({ count: 0 });
	});

	it('GET /api/spotify/recent handles API error', async () => {
		vi.mocked(spotify.getRecentlyPlayed).mockResolvedValue({
			ok: false,
			status: 500
		} as Response);
		const res = await app.request('/api/spotify/recent');
		expect(await res.json()).toEqual({ count: 0 });
	});

	it('GET /api/spotify/recent handles exception', async () => {
		vi.mocked(spotify.getRecentlyPlayed).mockRejectedValue(new Error('Network Error'));
		const res = await app.request('/api/spotify/recent');
		expect(await res.json()).toEqual({ count: 0 });
	});

	it('GET /api/spotify/recent returns full track info', async () => {
		const mockRecent = {
			items: [
				{
					track: {
						name: 'Recent Song',
						artists: [{ name: 'Recent Artist' }],
						album: { name: 'Recent Album', images: [{ url: 'http://recent.url' }] },
						external_urls: { spotify: 'http://spotify.recent.url' }
					}
				}
			]
		};

		vi.mocked(spotify.getRecentlyPlayed).mockResolvedValue({
			ok: true,
			json: async () => mockRecent
		} as Response);

		const res = await app.request('/api/spotify/recent');
		const json = await res.json();

		expect(json).toEqual({
			title: 'Recent Song',
			artist: 'Recent Artist',
			album: 'Recent Album',
			albumImageUrl: 'http://recent.url',
			songUrl: 'http://spotify.recent.url'
		});
	});
});
